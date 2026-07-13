'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { ZatcaApiClient } from '@/lib/zatca/api-client';
import { generateCSR, ComplianceApi } from '@talha7k/zatca';

export async function onboardZatcaDevice(companyId: string, otp: string, environment: 'Sandbox' | 'Simulation' | 'Production') {
  try {
    // Check if the company exists first
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      await prisma.company.create({
        data: {
          id: companyId,
          name: "Default Company",
          subscriptionStatus: "Active"
        }
      });
    }

    let profile = await prisma.companyProfile.findFirst({
      where: { companyId }
    });

    if (!profile) {
      profile = await prisma.companyProfile.create({
        data: {
          id: companyId + '_profile',
          companyId: companyId,
          name: "Company Name"
        }
      });
    }

    // 1. Generate CSR using real company data
    const csrParams = {
      organizationNameAr: profile.nameAr || profile.name,
      organizationNameEn: profile.name,
      vatNumber: profile.taxNumber || "311111111101113",
      crNumber: "1010010000",
      country: profile.country || "SA",
      commonName: "127.0.0.1",
      invoiceType: "1100", // TSCZ
      businessCategory: "Software",
      location: {
          city: profile.city || "Riyadh",
          district: profile.district || "Olaya",
          street: profile.streetName || "Main Street",
          buildingNumber: profile.buildingNumber || "1234",
          postalCode: profile.postalCode || "12222",
      },
      egsSerialNumber: "1-123|2-123|3-123",
    };

    const { csr, privateKey } = generateCSR(csrParams);

    // 2. Call ZATCA API to issue CSID
    const zatcaEnv = environment.toLowerCase() as 'sandbox' | 'production';
    const complianceApi = new ComplianceApi({ environment: zatcaEnv });
    
    // Request Compliance CSID
    const response = await complianceApi.requestCSID(csr, otp);
    
    // In a real flow, you would also do verifyCompliance tests and then requestProductionCSID.
    // For Sandbox/Simulation, getting the Compliance CSID is usually enough for Phase 2 tests.

    // 4. Save to Database
    await prisma.companyProfile.update({
      where: { id: profile.id },
      data: {
        zatcaEnvironment: environment,
        zatcaPrivateKey: privateKey,
        zatcaPublicKey: '', // Public key can be extracted from CSR or CSID, but ZATCA mainly uses CSID and Private Key
        zatcaCsid: response.binarySecurityToken,
        zatcaSecret: response.secret,
        zatcaComplianceStatus: 'CSID Issued'
      }
    });

    revalidatePath('/superadmin/companies');
    revalidatePath('/company-settings');
    revalidatePath('/settings/zatca');
    revalidatePath('/settings', 'layout');

    return { success: true, message: "Device onboarded successfully with ZATCA." };
  } catch (error: any) {
    console.error("ZATCA Onboarding Error:", error);
    return { success: false, message: error.message || "Failed to onboard device" };
  }
}

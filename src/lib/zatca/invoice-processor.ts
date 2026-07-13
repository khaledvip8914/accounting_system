import { prisma } from '@/lib/db';
import { ZatcaXmlBuilder } from './xml-builder';
import { generateSha256Hash, signData } from './crypto';
import { ZatcaHasher } from './hashing';
import { generateZatcaQr } from './qr-generator';
import { ZatcaApiClient } from './api-client';
import { randomUUID } from 'crypto';

export async function processZatcaInvoice(invoiceId: string) {
  try {
    const invoice = await prisma.salesInvoice.findUnique({
      where: { id: invoiceId },
      include: { company: true, customer: true, items: { include: { product: true } } }
    });

    if (!invoice || !invoice.company) throw new Error("Invoice or company not found");

    const profile = await prisma.companyProfile.findFirst({
      where: { companyId: invoice.companyId }
    });

    if (!profile) {
      throw new Error("Company profile not found");
    }

    // 1. Prepare XML Data
    const isB2B = !!(invoice.customer.taxNumber && invoice.customer.taxNumber.length > 5);

    // Fetch previous invoice hash
    const prevInvoice = await prisma.salesInvoice.findFirst({
      where: { companyId: invoice.companyId, zatcaInvoiceHash: { not: null } },
      orderBy: { createdAt: 'desc' }
    });
    const previousHash = prevInvoice?.zatcaInvoiceHash || Buffer.from('NWZlY2ViNjZmZmM4NmYzOGQ5NTI3ODZjNmQ2OTZjNzljMmRiYzIzOWRkNGU5MWI0NjcyOWQ3M2EyN2ZiNTdlOQ==', 'base64').toString('base64');

    invoice.zatcaUuid = randomUUID();
    invoice.zatcaPreviousHash = previousHash;

    const xmlBuilder = new ZatcaXmlBuilder(invoice, profile, invoice.customer, invoice.items);
    const xmlString = xmlBuilder.buildInvoiceXml();
    const canonicalXml = ZatcaHasher.preCanonicalize(xmlString);

    // 2. Hash & Sign
    const invoiceHash = ZatcaHasher.hashXml(canonicalXml);
    let signature = '';
    let qrCode = '';

    if (profile.zatcaPrivateKey) {
      signature = signData(invoiceHash, profile.zatcaPrivateKey);
      
      // 3. Generate QR Code
      qrCode = generateZatcaQr(
        profile.name,
        profile.taxNumber || '300000000000003',
        invoice.date.toISOString(),
        invoice.totalAmount.toString(),
        invoice.taxAmount.toString(),
        invoiceHash,
        signature,
        profile.zatcaPublicKey || '',
        '' // Signature of public key (needs CSID cert logic)
      );
    }

    // 4. Base64 Encode XML
    const xmlBase64 = Buffer.from(xmlString).toString('base64');

    // 5. Save to DB BEFORE API Call
    await prisma.salesInvoice.update({
      where: { id: invoiceId },
      data: {
        zatcaUuid: invoice.zatcaUuid,
        zatcaInvoiceHash: invoiceHash,
        zatcaPreviousHash: previousHash,
        zatcaCryptographicStamp: signature,
        zatcaQrCode: qrCode,
        zatcaXml: xmlBase64,
        zatcaStatus: 'Pending'
      }
    });

    // 6. Call API
    if (profile.zatcaCsid && profile.zatcaSecret && profile.zatcaEnvironment) {
      const apiClient = new ZatcaApiClient(profile.zatcaEnvironment as any);
      
      try {
        if (isB2B) {
          // Clearance
          const res = await apiClient.clearInvoice(profile.zatcaCsid, profile.zatcaSecret, invoiceHash, invoice.zatcaUuid, xmlBase64);
          await prisma.salesInvoice.update({
            where: { id: invoiceId },
            data: { 
              zatcaStatus: 'Cleared',
              zatcaReportedAt: new Date(),
              zatcaErrorLogs: JSON.stringify(res) // Save response for debugging
            }
          });
        } else {
          // Reporting
          const res = await apiClient.reportInvoice(profile.zatcaCsid, profile.zatcaSecret, invoiceHash, invoice.zatcaUuid, xmlBase64);
          await prisma.salesInvoice.update({
            where: { id: invoiceId },
            data: { 
              zatcaStatus: 'Reported',
              zatcaReportedAt: new Date(),
              zatcaErrorLogs: JSON.stringify(res) // Save response for debugging
            }
          });
        }
      } catch (apiError: any) {
        await prisma.salesInvoice.update({
          where: { id: invoiceId },
          data: { zatcaStatus: 'Failed', zatcaErrorLogs: apiError.message }
        });
      }
    }

  } catch (error) {
    console.error("ZATCA Processing Error:", error);
  }
}

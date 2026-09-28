import { prisma } from '@/lib/db';
import { ZatcaXmlBuilder } from './xml-builder';
import { generateSha256Hash, signData } from './crypto';
import { ZatcaHasher } from './hashing';
import { generateZatcaQr } from './qr-generator';
import { ZatcaApiClient } from './api-client';
import { randomUUID } from 'crypto';
import * as zatca from '@talha7k/zatca';

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
    let invoiceHash = '';
    let signature = '';
    let qrCode = '';
    let finalXmlString = xmlString;

    if (profile.zatcaPrivateKey && profile.zatcaCsid) {
      // 2. Sign XML using ZATCA SDK (generates hash, signature, and injects QR into UBL extensions)
      let originalLen = profile.zatcaCsid.length;
      let certPem = profile.zatcaCsid.replace(/[^A-Za-z0-9+/=]/g, '');
      let loopLogs = "";
      
      for (let i = 0; i < 3; i++) {
        const decoded = Buffer.from(certPem, 'base64');
        loopLogs += `[L${i} len=${certPem.length} d0=${decoded[0]}] `;
        if (decoded[0] === 0x30) {
          break;
        }
        certPem = decoded.toString('utf8').replace(/[^A-Za-z0-9+/=]/g, '');
      }

      if (!certPem.includes('BEGIN CERTIFICATE')) {
        certPem = `-----BEGIN CERTIFICATE-----\n${certPem.match(/.{1,64}/g)?.join('\n')}\n-----END CERTIFICATE-----`;
      }
      
      try {
        let certSignature: any;
        try {
          certSignature = zatca.extractCertificateSignature(certPem);
        } catch (e: any) {
          let derDiagnostic = "N/A";
          try {
            const testDer = Buffer.from(certPem.replace(/-----BEGIN CERTIFICATE-----/g, '').replace(/-----END CERTIFICATE-----/g, '').replace(/\\s/g, ''), 'base64');
            derDiagnostic = `der[0]=${testDer[0]}`;
          } catch(err) {}
          throw new Error(`[V4] CSID origLen: ${originalLen}. Logs: ${loopLogs}. DerDiag: ${derDiagnostic}. Error: ${e.message}`);
        }
        const signed = zatca.signInvoice({
          xml: xmlString,
          privateKeyPem: profile.zatcaPrivateKey,
          certificatePem: certPem,
          qrData: {
            sellerName: profile.name,
            vatNumber: profile.taxNumber || '300000000000003',
            timestamp: invoice.date.toISOString(),
            totalWithVat: invoice.netAmount ? invoice.netAmount.toString() : (invoice.totalAmount + invoice.taxAmount).toString(),
            vatTotal: invoice.taxAmount.toString(),
            certificateSignature: certSignature
          }
        });
        
        finalXmlString = signed.signedXml;
        invoiceHash = signed.invoiceHash;
        signature = signed.signatureValue;
      } catch (err) {
        console.error("ZATCA Signing Error:", err);
        throw err;
      }
    } else {
      const canonicalXml = ZatcaHasher.preCanonicalize(xmlString);
      invoiceHash = ZatcaHasher.hashXml(canonicalXml);
    }

    // 4. Base64 Encode final XML
    const xmlBase64 = Buffer.from(finalXmlString).toString('base64');

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
      const isCompliance = profile.zatcaComplianceStatus !== 'Production CSID Issued';
      
      try {
        if (isB2B) {
          // Clearance
          const res = await apiClient.clearInvoice(profile.zatcaCsid, profile.zatcaSecret, invoiceHash, invoice.zatcaUuid, xmlBase64, isCompliance);
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
          const res = await apiClient.reportInvoice(profile.zatcaCsid, profile.zatcaSecret, invoiceHash, invoice.zatcaUuid, xmlBase64, isCompliance);
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

  } catch (error: any) {
    console.error("ZATCA Processing Error:", error);
    try {
      await prisma.salesInvoice.update({
        where: { id: invoiceId },
        data: { zatcaStatus: 'Failed', zatcaErrorLogs: String(error.message || error) }
      });
    } catch (dbErr) {}
  }
}

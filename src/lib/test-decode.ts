import * as zatca from '@talha7k/zatca';
import { prisma } from './db';

async function run() {
  const profile = await prisma.companyProfile.findFirst({ where: { zatcaCsid: { not: null } } });
  if (!profile || !profile.zatcaCsid) {
    console.log("No profile");
    return;
  }
  
  let certPem = profile.zatcaCsid.trim();
  console.log("Original start:", certPem.substring(0, 10));
  
  while (certPem.startsWith('TUl')) {
    certPem = Buffer.from(certPem, 'base64').toString('utf8').trim();
  }

  console.log("After loop start:", certPem.substring(0, 10));

  if (!certPem.includes('BEGIN CERTIFICATE')) {
    certPem = `-----BEGIN CERTIFICATE-----\n${certPem.replace(/\\s+/g, '').match(/.{1,64}/g)?.join('\n')}\n-----END CERTIFICATE-----`;
  }
  
  try {
    const der = Buffer.from(certPem.replace(/-----BEGIN CERTIFICATE-----/g, '').replace(/-----END CERTIFICATE-----/g, '').replace(/\\s/g, ''), 'base64');
    console.log("der[0]:", der[0].toString(16));
    
    zatca.extractCertificateSignature(certPem);
    console.log("Success!");
  } catch(e: any) {
    console.log("Error:", e.message);
  }
}
run();

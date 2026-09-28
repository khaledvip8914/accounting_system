const zatca = require('@talha7k/zatca');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const profile = await prisma.companyProfile.findFirst({ where: { zatcaCsid: { not: null } } });
  if (!profile) return console.log("No profile");
  
  let certPem = profile.zatcaCsid;
  console.log("Raw CSID prefix:", certPem.substring(0, 50));
  
  if (!certPem.includes('BEGIN CERTIFICATE')) {
    certPem = `-----BEGIN CERTIFICATE-----\n${certPem.replace(/\\s+/g, '').match(/.{1,64}/g)?.join('\n')}\n-----END CERTIFICATE-----`;
  }
  
  console.log("certPem prefix:", certPem.substring(0, 100).replace(/\n/g, '\\n'));
  try {
    const sig = zatca.extractCertificateSignature(certPem);
    console.log("Success! Sig length:", sig.length);
  } catch (err) {
    console.error("Error extracting:", err.message);
    
    // try decoding base64 to see if it's readable text
    const decoded = Buffer.from(profile.zatcaCsid, 'base64').toString('utf8');
    console.log("Decoded utf8 prefix:", decoded.substring(0, 100).replace(/\n/g, '\\n'));
  }
}
test();

import { prisma } from './db';
async function run() {
  const profile = await prisma.companyProfile.findFirst({ where: { zatcaCsid: { not: null } } });
  if (profile) {
    console.log('CSID length:', profile.zatcaCsid?.length);
    console.log('CSID:', profile.zatcaCsid);
  }
}
run();

// @ts-nocheck
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting unit cleanup...');
  // Find all companies
  const companies = await prisma.company.findMany();
  console.log(`Found ${companies.length} companies.`);

  // Find duplicates
  const allUnits = await prisma.unitOfMeasure.findMany();
  console.log(`Found ${allUnits.length} total units in DB.`);

  try {
    const res = await prisma.unitOfMeasure.deleteMany({});
    console.log(`Deleted ${res.count} existing units of measure.`);
  } catch (e: any) {
    console.warn('Could not delete all units, they might be in use.', e.message);
  }

  // Re-seed units for each company
  for (const company of companies) {
    const defaults = [
      { name: 'Kilogram', nameAr: 'كيلوجرام', companyId: company.id },
      { name: 'Gram', nameAr: 'جرام', companyId: company.id },
      { name: 'Liter', nameAr: 'لتر', companyId: company.id },
      { name: 'Milliliter', nameAr: 'مليلتر', companyId: company.id },
      { name: 'Piece', nameAr: 'قطعة', companyId: company.id },
      { name: 'Carton', nameAr: 'كرتون', companyId: company.id },
      { name: 'Bag', nameAr: 'كيس', companyId: company.id }
    ];
    
    // Create using loop to avoid unique constraint if some already exist
    for (const d of defaults) {
      try {
        await prisma.unitOfMeasure.upsert({
          where: { companyId_name: { companyId: d.companyId, name: d.name } },
          update: {},
          create: d
        });
      } catch (err: any) {
        // ignore unique constraint errors if schema handles it differently
        try {
          await prisma.unitOfMeasure.create({ data: d });
        } catch(e: any) {}
      }
    }
    console.log(`Seeded units for company ${company.id}`);
  }
  console.log('Cleanup finished.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

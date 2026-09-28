import { prisma } from '../lib/db';
import { ALL_MODULES } from '../lib/permissions';

const ADMIN_PERMISSIONS = ALL_MODULES.reduce((acc, module) => {
  acc[module] = { view: true, create: true, edit: true, delete: true };
  return acc;
}, {} as any);

const ACCOUNTANT_PERMISSIONS = {
  ...ALL_MODULES.reduce((acc, module) => { acc[module] = { view: false, create: false, edit: false, delete: false }; return acc; }, {} as any),
  quotations: { view: true, create: true, edit: true, delete: true },
  invoices: { view: true, create: true, edit: true, delete: true },
  purchases: { view: true, create: true, edit: true, delete: true },
  accounting: { view: true, create: true, edit: true, delete: true },
  contacts: { view: true, create: true, edit: true, delete: true },
  reports: { view: true, create: false, edit: false, delete: false },
  sales_reports: { view: true, create: false, edit: false, delete: false },
  purchase_reports: { view: true, create: false, edit: false, delete: false },
  return_reports: { view: true, create: false, edit: false, delete: false },
  settings_financial: { view: true, create: true, edit: true, delete: false },
};

const HR_PERMISSIONS = {
  ...ALL_MODULES.reduce((acc, module) => { acc[module] = { view: false, create: false, edit: false, delete: false }; return acc; }, {} as any),
  hr: { view: true, create: true, edit: true, delete: true },
  hr_employees: { view: true, create: true, edit: true, delete: true },
  hr_salaries: { view: true, create: true, edit: true, delete: true },
  settings_payroll: { view: true, create: true, edit: true, delete: false },
};

const EMPLOYEE_PERMISSIONS = {
  ...ALL_MODULES.reduce((acc, module) => { acc[module] = { view: false, create: false, edit: false, delete: false }; return acc; }, {} as any),
  hr_employees: { view: true, create: false, edit: false, delete: false },
};

export const STANDARD_ROLES = [
  { name: 'مدير النظام (Admin)', permissions: JSON.stringify(ADMIN_PERMISSIONS) },
  { name: 'محاسب (Accountant)', permissions: JSON.stringify(ACCOUNTANT_PERMISSIONS) },
  { name: 'موظف موارد بشرية (HR)', permissions: JSON.stringify(HR_PERMISSIONS) },
  { name: 'موظف عادي (Employee)', permissions: JSON.stringify(EMPLOYEE_PERMISSIONS) },
];

export async function seedRolesForCompany(companyId: string) {
  for (const role of STANDARD_ROLES) {
    const existingRole = await prisma.role.findFirst({
      where: { companyId, name: role.name }
    });
    if (!existingRole) {
      await prisma.role.create({
        data: {
          name: role.name,
          permissions: role.permissions,
          companyId
        }
      });
    }
  }
}

// If run directly:
async function main() {
  if (require.main === module) {
    const companies = await prisma.company.findMany();
    for (const company of companies) {
      console.log(`Seeding roles for company: ${company.name}`);
      await seedRolesForCompany(company.id);
    }
    console.log('Seeding completed.');
    process.exit(0);
  }
}

main().catch(console.error);

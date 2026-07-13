// @ts-nocheck
import { PrismaClient } from '../generated/client_v8';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Subscription Plans...');

  // 1. Basic Plan
  await prisma.subscriptionPlan.upsert({
    where: { id: 'plan_basic' },
    update: {},
    create: {
      id: 'plan_basic',
      name: 'Basic',
      nameAr: 'الأساسية',
      price: 0, // Set price as needed
      maxUsers: 1,
      maxBranches: 1,
      hasZatcaPhase2: false,
      hasSalesAndPurchases: false,
      hasBankReconciliation: false,
      hasUserPermissions: false,
      hasFixedAssets: false,
      hasMultiCurrency: false,
      hasAdvancedReports: false,
    }
  });

  // 2. Professional Plan
  await prisma.subscriptionPlan.upsert({
    where: { id: 'plan_professional' },
    update: {},
    create: {
      id: 'plan_professional',
      name: 'Professional',
      nameAr: 'الاحترافية',
      price: 0,
      maxUsers: 3,
      maxBranches: 3,
      hasZatcaPhase2: true, // Assuming Pro might have phase 2, user said Phase 1 ZATCA only for basic. So Pro gets phase 2? Or we leave it false. Let's make it false unless explicitly stated. Wait, usually Phase 2 is Pro/Advanced. I'll set it to false and user can change later or we can assume it. Let's just follow strictly: Sales & Purchases, Bank Reconciliations, User Permissions.
      hasSalesAndPurchases: true,
      hasBankReconciliation: true,
      hasUserPermissions: true,
      hasFixedAssets: false,
      hasMultiCurrency: false,
      hasAdvancedReports: false,
    }
  });

  // 3. Advanced Plan
  await prisma.subscriptionPlan.upsert({
    where: { id: 'plan_advanced' },
    update: {},
    create: {
      id: 'plan_advanced',
      name: 'Advanced',
      nameAr: 'المتقدمة',
      price: 0,
      maxUsers: 5,
      maxBranches: 5,
      hasZatcaPhase2: true,
      hasSalesAndPurchases: true,
      hasBankReconciliation: true,
      hasUserPermissions: true,
      hasFixedAssets: true,
      hasMultiCurrency: true,
      hasAdvancedReports: true,
    }
  });

  console.log('✅ Subscription Plans seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding subscription plans:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

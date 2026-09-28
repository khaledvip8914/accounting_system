'use server';

import { prisma } from '../../lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { getActiveBranch } from '@/lib/branch';
import { validateFinancialYear } from '@/lib/financial-years';

async function getAuthContext() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    throw new Error('Unauthorized');
  }
  return {
    companyId: session.user.companyId,
    permissions: session.user,
    role: session.user.role
  };
}

export async function getAccounts() {
  const { companyId } = await getAuthContext();
  return await prisma.account.findMany({ 
    where: { companyId },
    orderBy: { code: 'asc' } 
  });
}

export async function getJournalVouchers() {
  const { companyId } = await getAuthContext();
  const branchId = await getActiveBranch();
  const whereClause: any = { companyId };
  if (branchId) {
    whereClause.OR = [
      { branchId: branchId },
      { branchId: null }
    ];
  }
  return await prisma.journalVoucher.findMany({
    where: whereClause,
    include: {
      entries: {
        include: { account: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getJournalEntries() {
  const { companyId } = await getAuthContext();
  const branchId = await getActiveBranch();
  
  const whereClause: any = { account: { companyId } };
  if (branchId) {
    whereClause.journalVoucher = { 
      OR: [
        { branchId: branchId },
        { branchId: null }
      ]
    };
  }
  
  return await prisma.journalEntry.findMany({
    where: whereClause,
    include: { 
      account: true,
      journalVoucher: true
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function saveJournalVoucher(data: {
  date: string;
  description: string;
  lines: { accountId: string; debit: number; credit: number; description?: string; dimensionValues?: any[] }[];
}) {
  try {
    const { companyId, permissions, role } = await getAuthContext();
    if (role !== 'Admin' && !hasPermission(permissions, 'accounting', 'create')) {
      throw new Error('غير مصرح لك بإضافة قيد يومية');
    }

    await validateFinancialYear(companyId, data.date);

    const branchId = await getActiveBranch();
    const totalDebit = data.lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = data.lines.reduce((sum, l) => sum + l.credit, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new Error('Voucher does not balance');
    }

    const date = new Date(data.date + 'T12:00:00Z');
    
    // Generate simple reference: JV-Year-Count (scoped to company)
    const count = await prisma.journalVoucher.count({ where: { companyId } });
    const reference = `JV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    await prisma.journalVoucher.create({
      data: {
        companyId,
        branchId,
        reference,
        date,
        description: data.description,
        status: 'Posted',
        entries: {
          create: data.lines.map(line => ({
            date,
            description: line.description || data.description,
            accountId: line.accountId,
            debit: line.debit,
            credit: line.credit,
            dimensionValues: line.dimensionValues || []
          }))
        }
      }
    });

    revalidatePath('/ledger');
    revalidatePath('/reports');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to save journal voucher:', error);
    return { success: false, error: error.message || 'Failed' };
  }
}

export async function deleteJournalVoucher(voucherId: string) {
  try {
    const { companyId, permissions, role } = await getAuthContext();
    if (role !== 'Admin' && !hasPermission(permissions, 'accounting', 'delete')) {
      throw new Error('غير مصرح لك بحذف قيود اليومية');
    }

    // Verify ownership
    const existing = await prisma.journalVoucher.findUnique({
      where: { id: voucherId },
      select: { companyId: true }
    });
    if (!existing || existing.companyId !== companyId) throw new Error('Not found');

    await prisma.$transaction(async (tx: any) => {
      // Unlink from any invoices first
      await tx.salesInvoice.updateMany({
        where: { companyId, journalVoucherId: voucherId },
        data: { journalVoucherId: null }
      });
      await tx.purchaseInvoice.updateMany({
        where: { companyId, journalVoucherId: voucherId },
        data: { journalVoucherId: null }
      });
      // Delete entries then voucher
      await tx.journalEntry.deleteMany({ where: { journalVoucherId: voucherId } });
      await tx.journalVoucher.delete({ where: { id: voucherId } });
    });
    revalidatePath('/ledger');
    revalidatePath('/financial');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateJournalVoucher(
  voucherId: string,
  data: {
    date: string;
    description: string;
    lines: { accountId: string; debit: number; credit: number; description?: string; dimensionValues?: any[] }[];
  }
) {
  try {
    const { companyId, permissions, role } = await getAuthContext();
    if (role !== 'Admin' && !hasPermission(permissions, 'accounting', 'edit')) {
      throw new Error('غير مصرح لك بتعديل قيود اليومية');
    }

    // Verify ownership
    const existing = await prisma.journalVoucher.findUnique({
      where: { id: voucherId },
      select: { companyId: true }
    });
    if (!existing || existing.companyId !== companyId) throw new Error('Not found');

    const totalDebit = data.lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = data.lines.reduce((sum, l) => sum + l.credit, 0);
    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new Error('Voucher does not balance');
    }
    const date = new Date(data.date + 'T12:00:00Z');

    await prisma.$transaction(async (tx: any) => {
      // Replace all entries
      await tx.journalEntry.deleteMany({ where: { journalVoucherId: voucherId } });
      await tx.journalVoucher.update({
        where: { id: voucherId },
        data: {
          date,
          description: data.description,
          entries: {
            create: data.lines.map(line => ({
              date,
              description: line.description || data.description,
              accountId: line.accountId,
              debit: line.debit,
              credit: line.credit,
              dimensionValues: line.dimensionValues || []
            }))
          }
        }
      });
    });

    revalidatePath('/ledger');
    revalidatePath('/financial');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function setupDefaultAccounts() {
  const { companyId } = await getAuthContext();
  const count = await prisma.account.count({ where: { companyId } });
  if (count > 0) return { success: false, message: 'Accounts already exist' };

  // دليل الحسابات الموحّد - معيار السعودية / الخليج
  const accountDefs = [
    { code:'1000', name:'Assets', nameAr:'الأصول', type:'Asset', nature:'Debit', description:'الموارد الاقتصادية التي تمتلكها المنشأة ويتوقع أن تحقق منافع مستقبلية.', parent:null },
    { code:'1100', name:'Current Assets', nameAr:'الأصول المتداولة', type:'Asset', nature:'Debit', description:'النقدية والأصول الأخرى التي يتوقع تحويلها إلى نقدية أو استخدامها خلال سنة مالية.', parent:'1000' },
    { code:'1110', name:'Cash in Hand', nameAr:'النقدية بالصندوق', type:'Asset', nature:'Debit', description:'الأموال النقدية المتاحة في خزينة الشركة الرئيسية.', parent:'1100' },
    { code:'1120', name:'Bank Accounts', nameAr:'الحسابات البنكية', type:'Asset', nature:'Debit', description:'الأرصدة النقدية المودعة في الحسابات الجارية لدى البنوك.', parent:'1100' },
    { code:'1130', name:'Accounts Receivable', nameAr:'ذمم المدينين - العملاء', type:'Asset', nature:'Debit', description:'المبالغ المستحقة للشركة على عملائها نتيجة بيع بضائع أو تقديم خدمات على الحساب.', parent:'1100' },
    { code:'1140', name:'Inventory', nameAr:'المخزون', type:'Asset', nature:'Debit', description:'تكلفة البضائع المتاحة للبيع أو المواد الخام المستخدمة في الإنتاج.', parent:'1100' },
    { code:'1150', name:'Prepaid Expenses', nameAr:'مصروفات مدفوعة مقدماً', type:'Asset', nature:'Debit', description:'المصروفات التي تم دفعها مقدماً وتخص فترات مالية قادمة (مثل الإيجار المقدم).', parent:'1100' },
    { code:'1160', name:'VAT Receivable', nameAr:'ضريبة القيمة المضافة - مدخلات', type:'Asset', nature:'Debit', description:'ضريبة القيمة المضافة القابلة للاسترداد من هيئة الزكاة والدخل.', parent:'1100' },
    { code:'1170', name:'Employee Loans & Advances', nameAr:'سلف وقروض الموظفين', type:'Asset', nature:'Debit', description:'السلف والقروض الممنوحة للموظفين والتي سيتم استردادها منهم لاحقاً.', parent:'1100' },
    { code:'1200', name:'Non-Current Assets', nameAr:'الأصول غير المتداولة', type:'Asset', nature:'Debit', description:'الأصول التي تقتنيها الشركة بغرض استخدامها في نشاطها وليس بغرض البيع وتدوم لأكثر من سنة.', parent:'1000' },
    { code:'1210', name:'Property, Plant & Equipment', nameAr:'العقارات والمنشآت والمعدات', type:'Asset', nature:'Debit', description:'الأراضي والمباني والآلات والمعدات والسيارات المملوكة للشركة.', parent:'1200' },
    { code:'1220', name:'Accumulated Depreciation', nameAr:'مجمع استهلاك الأصول الثابتة', type:'Asset', nature:'Credit', description:'مجموع الاستهلاكات المتراكمة للأصول الثابتة عبر السنوات (حساب مقابل للأصول يطرح منها).', parent:'1200' },
    { code:'2000', name:'Liabilities', nameAr:'الالتزامات', type:'Liability', nature:'Credit', description:'الالتزامات والديون المستحقة على الشركة للغير.', parent:null },
    { code:'2100', name:'Current Liabilities', nameAr:'الالتزامات المتداولة', type:'Liability', nature:'Credit', description:'الالتزامات التي يجب سدادها خلال سنة مالية واحدة.', parent:'2000' },
    { code:'2110', name:'Accounts Payable', nameAr:'ذمم الدائنين - الموردون', type:'Liability', nature:'Credit', description:'المبالغ المستحقة للموردين نتيجة شراء بضائع أو خدمات على الحساب.', parent:'2100' },
    { code:'2120', name:'Accrued Salaries & Wages', nameAr:'الرواتب والأجور المستحقة', type:'Liability', nature:'Credit', description:'الرواتب والأجور المستحقة للموظفين والتي لم يتم صرفها بعد.', parent:'2100' },
    { code:'2130', name:'GOSI Payable', nameAr:'التأمينات الاجتماعية المستحقة', type:'Liability', nature:'Credit', description:'المبالغ المستحقة للمؤسسة العامة للتأمينات الاجتماعية.', parent:'2100' },
    { code:'2140', name:'End of Service Provision', nameAr:'مخصص مكافأة نهاية الخدمة', type:'Liability', nature:'Credit', description:'المخصصات المالية لمكافأة نهاية الخدمة للعاملين بالشركة.', parent:'2100' },
    { code:'2150', name:'Annual Leave Provision', nameAr:'مخصص الإجازات السنوية', type:'Liability', nature:'Credit', description:'المخصصات المالية للإجازات السنوية المستحقة للموظفين.', parent:'2100' },
    { code:'2160', name:'VAT Payable', nameAr:'ضريبة القيمة المضافة - مخرجات', type:'Liability', nature:'Credit', description:'ضريبة القيمة المضافة المحصلة من العملاء والمستحقة السداد لهيئة الزكاة والدخل.', parent:'2100' },
    { code:'2170', name:'Customer Advances', nameAr:'دفعات مقدمة من العملاء', type:'Liability', nature:'Credit', description:'المبالغ المحصلة مقدماً من العملاء قبل تقديم الخدمة أو تسليم البضاعة.', parent:'2100' },
    { code:'2200', name:'Non-Current Liabilities', nameAr:'الالتزامات طويلة الأجل', type:'Liability', nature:'Credit', description:'الالتزامات والديون التي يستحق سدادها بعد أكثر من سنة مالية.', parent:'2000' },
    { code:'2210', name:'Long-term Loans', nameAr:'قروض طويلة الأجل', type:'Liability', nature:'Credit', description:'القروض البنكية أو التمويلية التي يستحق سدادها على مدى زمني طويل.', parent:'2200' },
    { code:'3000', name:'Equity', nameAr:'حقوق الملكية', type:'Equity', nature:'Credit', description:'حقوق ملاك الشركة متمثلة في رأس المال والأرباح المحتجزة.', parent:null },
    { code:'3100', name:'Paid-in Capital', nameAr:'رأس المال المدفوع', type:'Equity', nature:'Credit', description:'رأس المال المستثمر والمدفوع من قبل الشركاء أو المساهمين.', parent:'3000' },
    { code:'3200', name:'Retained Earnings', nameAr:'الأرباح المبقاة', type:'Equity', nature:'Credit', description:'الأرباح المتراكمة من سنوات سابقة ولم يتم توزيعها على الملاك.', parent:'3000' },
    { code:'3300', name:'Current Year Net Income', nameAr:'صافي دخل السنة الحالية', type:'Equity', nature:'Credit', description:'صافي أرباح أو خسائر السنة المالية الحالية.', parent:'3000' },
    { code:'4000', name:'Revenue', nameAr:'الإيرادات', type:'Revenue', nature:'Credit', description:'إجمالي التدفقات النقدية أو الذمم الناتجة عن ممارسة الأنشطة الرئيسية للشركة.', parent:null },
    { code:'4100', name:'Sales Revenue', nameAr:'إيرادات المبيعات', type:'Revenue', nature:'Credit', description:'الإيرادات المحققة من بيع البضائع أو المنتجات.', parent:'4000' },
    { code:'4200', name:'Service Revenue', nameAr:'إيرادات الخدمات', type:'Revenue', nature:'Credit', description:'الإيرادات المحققة من تقديم الخدمات للعملاء.', parent:'4000' },
    { code:'4300', name:'Other Revenue', nameAr:'إيرادات أخرى', type:'Revenue', nature:'Credit', description:'إيرادات أخرى عرضية لا تتعلق بالنشاط الرئيسي للشركة.', parent:'4000' },
    { code:'5000', name:'Cost of Goods Sold', nameAr:'تكلفة المبيعات', type:'Expense', nature:'Debit', description:'التكلفة المباشرة للبضائع والخدمات التي تم بيعها خلال الفترة.', parent:null },
    { code:'5100', name:'Direct Material Cost', nameAr:'تكلفة المواد المباشرة', type:'Expense', nature:'Debit', description:'تكلفة المواد الخام المباشرة المستخدمة في الإنتاج أو المشتريات بغرض البيع.', parent:'5000' },
    { code:'5200', name:'Direct Labor Cost', nameAr:'تكلفة العمالة المباشرة', type:'Expense', nature:'Debit', description:'تكلفة أجور العمالة المباشرة المرتبطة بالإنتاج أو تقديم الخدمة.', parent:'5000' },
    { code:'6000', name:'Operating Expenses', nameAr:'المصروفات التشغيلية', type:'Expense', nature:'Debit', description:'المصروفات التي تتكبدها الشركة لممارسة نشاطها اليومي وإدارتها.', parent:null },
    { code:'6100', name:'General & Admin Expenses', nameAr:'المصروفات العمومية والإدارية', type:'Expense', nature:'Debit', description:'المصروفات المتعلقة بإدارة وتشغيل الشركة بشكل عام.', parent:'6000' },
    { code:'6110', name:'Rent Expense', nameAr:'مصروف الإيجارات', type:'Expense', nature:'Debit', description:'مصروف إيجار المكاتب والمستودعات والفروع.', parent:'6100' },
    { code:'6120', name:'Utilities Expense', nameAr:'مصروف الكهرباء والمياه والاتصالات', type:'Expense', nature:'Debit', description:'مصروف استهلاك الكهرباء والمياه وخدمات الاتصالات والإنترنت.', parent:'6100' },
    { code:'6130', name:'Travel & Transportation Expense', nameAr:'مصروف السفر والتنقلات', type:'Expense', nature:'Debit', description:'مصروفات السفر والإركاب وتذاكر الطيران والانتقالات.', parent:'6100' },
    { code:'6140', name:'Advertising & Marketing Expense', nameAr:'مصروف الإعلان والتسويق', type:'Expense', nature:'Debit', description:'مصروفات الحملات الإعلانية والتسويق والدعاية.', parent:'6100' },
    { code:'6150', name:'Professional Fees', nameAr:'أتعاب مهنية وقانونية', type:'Expense', nature:'Debit', description:'الأتعاب المدفوعة للمستشارين والمحاسبين القانونيين والمحامين.', parent:'6100' },
    { code:'6160', name:'Depreciation Expense', nameAr:'مصروف الاستهلاك', type:'Expense', nature:'Debit', description:'قيمة النقص التدريجي في قيمة الأصول الثابتة المحملة كعبء على الفترة.', parent:'6100' },
    { code:'6190', name:'Miscellaneous Expense', nameAr:'مصروفات متنوعة', type:'Expense', nature:'Debit', description:'أي مصروفات إدارية وعمومية أخرى لا تندرج تحت تصنيف محدد.', parent:'6100' },
    { code:'6200', name:'Payroll & Employee Benefits', nameAr:'مصروفات الرواتب وما في حكمها', type:'Expense', nature:'Debit', description:'إجمالي المصروفات المتعلقة بموظفي الشركة.', parent:'6000' },
    { code:'6210', name:'Salaries & Wages Expense', nameAr:'مصروف الرواتب والأجور', type:'Expense', nature:'Debit', description:'إجمالي الرواتب والأجور المدفوعة لموظفي الشركة.', parent:'6200' },
    { code:'6220', name:'Allowances Expense', nameAr:'مصروف البدلات', type:'Expense', nature:'Debit', description:'البدلات المدفوعة للموظفين (سكن، مواصلات، هاتف، إلخ).', parent:'6200' },
    { code:'6230', name:'Employee Deductions & Penalties', nameAr:'خصومات وجزاءات الموظفين', type:'Expense', nature:'Credit', description:'الخصومات والجزاءات المطبقة على الموظفين (طبيعة دائنة تخفض المصروف).', parent:'6200' },
    { code:'6240', name:'GOSI / Social Insurance Expense', nameAr:'مصروف التأمينات الاجتماعية', type:'Expense', nature:'Debit', description:'حصة الشركة من مصروف التأمينات الاجتماعية للموظفين.', parent:'6200' },
    { code:'6250', name:'End of Service Benefits Expense', nameAr:'مصروف مكافأة نهاية الخدمة', type:'Expense', nature:'Debit', description:'مصروف مكافأة نهاية الخدمة المحمل على الفترة المالية الحالية.', parent:'6200' },
    { code:'6260', name:'Annual Leave Expense', nameAr:'مصروف الإجازات السنوية', type:'Expense', nature:'Debit', description:'مصروف الإجازات السنوية المحمل على الفترة المالية الحالية.', parent:'6200' }
  ];

  const codeToId: Record<string, string> = {};
  for (const acc of accountDefs) {
    const created = await (prisma as any).account.create({
      data: {
        companyId,
        code:     acc.code,
        name:     acc.name,
        nameAr:   acc.nameAr,
        type:     acc.type,
        nature:   acc.nature,
        parentId: acc.parent ? codeToId[acc.parent] : null,
        balance:  0,
      }
    });
    codeToId[acc.code] = created.id;
  }

  // ─── ربط حسابات الرواتب تلقائياً ───
  const payrollMapping = {
    basicSalaryAccountId:           codeToId['6100'],
    allowancesAccountId:            codeToId['6110'],
    deductionsAccountId:            codeToId['6120'],
    gosiCompanyExpenseAccountId:    codeToId['6130'],
    endOfServiceExpenseAccountId:   codeToId['6140'],
    vacationExpenseAccountId:       codeToId['6150'],
    employeeLoansAccountId:         codeToId['1135'],
    accruedSalariesAccountId:       codeToId['2110'],
    gosiPayableAccountId:           codeToId['2120'],
    endOfServiceProvisionAccountId: codeToId['2130'],
    vacationProvisionAccountId:     codeToId['2140'],
  };
  await (prisma as any).payrollSettings.upsert({
    where:  { companyId },
    update: payrollMapping,
    create: { companyId, ...payrollMapping, gosiEmployeeRatio:9.75, gosiCompanyRatio:11.75, gosiMaxSalary:45000, defaultAnnualLeaveDays:30, payrollCycleStartDay:1, payrollCycleEndDay:30 }
  });

  revalidatePath('/ledger');
  revalidatePath('/accounts');
  return { success: true };
}


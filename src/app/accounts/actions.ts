'use server';

import { prisma } from '../../lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function getAccounts() {
  const allAccounts = await prisma.account.findMany({
    orderBy: { code: 'asc' },
    include: {
      entries: true
    }
  });

  const accountMap = new Map();
  allAccounts.forEach((acc: any) => {
    // Calculate balance
    const totalDebit = acc.entries.reduce((sum: number, e: any) => sum + e.debit, 0);
    const totalCredit = acc.entries.reduce((sum: number, e: any) => sum + e.credit, 0);
    
    let balance = 0;
    if (['Asset', 'Expense'].includes(acc.type)) {
      balance = totalDebit - totalCredit;
    } else {
      balance = totalCredit - totalDebit;
    }

    acc.balance = balance;
    acc.totalDebit = totalDebit;
    acc.totalCredit = totalCredit;
    acc.children = [];
    accountMap.set(acc.id, acc);
  });

  const roots: any[] = [];
  allAccounts.forEach((acc: any) => {
    if (acc.parentId) {
      const parent = accountMap.get(acc.parentId);
      if (parent) {
        parent.children.push(acc);
      } else {
        roots.push(acc);
      }
    } else {
      roots.push(acc);
    }
  });

  return roots;
}

export async function createAccount(data: { code: string; name: string; nameAr?: string; type: string; nature?: string; description?: string; parentId?: string }) {
  try {
    const session = await getSession();
    const perms = session?.user?.permissions;
    
    if (!hasPermission(perms, 'accounting', 'create')) {
      throw new Error('غير مصرح لك بإدارة الحسابات');
    }

    await prisma.account.create({
      data: {
        code: data.code,
        name: data.name,
        nameAr: data.nameAr || null,
        type: data.type,
        nature: data.nature || (['Asset', 'Expense'].includes(data.type) ? 'Debit' : 'Credit'),
        description: data.description || null,
        parentId: data.parentId || null,
      },
    });
    revalidatePath('/accounts');
    revalidatePath('/ledger');
    return { success: true };
  } catch (error) {
    console.error('Failed to create account:', error);
    return { success: false, error: 'Failed to create account. The code might already exist.' };
  }
}

export async function updateAccount(id: string, data: { code: string; name: string; nameAr?: string; nature: string; description?: string }) {
  try {
    const session = await getSession();
    const perms = session?.user?.permissions;
    
    if (!hasPermission(perms, 'accounting', 'edit')) {
      throw new Error('غير مصرح لك بإدارة الحسابات');
    }

    await prisma.account.update({
      where: { id },
      data: {
        code: data.code,
        name: data.name,
        nameAr: data.nameAr || null,
        nature: data.nature,
        description: data.description || null,
      },
    });
    revalidatePath('/accounts');
    revalidatePath('/ledger');
    return { success: true };
  } catch (error) {
    console.error('Failed to update account:', error);
    return { success: false, error: 'Failed to update account. The code might already exist.' };
  }
}

export async function translateText(text: string, from: 'ar' | 'en', to: 'ar' | 'en') {
  if (!text) return { text: '' };
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    let translated = data[0][0][0];
    return { success: true, text: translated };
  } catch (error) {
    console.error('Translation failed', error);
    return { success: false, error: 'Translation failed' };
  }
}

export async function deleteAccount(id: string) {
  try {
    const cookieStore = await cookies();
    const lang = cookieStore.get('NX_LANG')?.value || 'en';
    const session = await getSession();
    const user = session?.user;
    const perms = user?.permissions;
    
    // Admin always has full access
    const isAuthorized = user?.role === 'Admin' || hasPermission(perms, 'accounting', 'delete');
    
    if (!isAuthorized) {
      return { success: false, error: lang === 'ar' ? 'غير مصرح لك بمسح الحسابات، يرجى مراجعة المسؤول.' : 'You are not authorized to delete accounts.' };
    }

    const entriesCount = await prisma.journalEntry.count({ where: { accountId: id } });
    if (entriesCount > 0) {
      return { success: false, error: lang === 'ar' ? 'لا يمكن حذف حساب يحتوي على معاملات قيود يومية.' : 'Cannot delete an account that has existing journal entries.' };
    }

    const primaryVoucherCount = await prisma.transactionVoucher.count({ where: { primaryAccountId: id } });
    const relatedVoucherCount = await prisma.transactionVoucher.count({ where: { relatedAccountId: id } });
    if (primaryVoucherCount > 0 || relatedVoucherCount > 0) {
        return { success: false, error: lang === 'ar' ? 'لا يمكن حذف حساب مرتبط بسندات صرف أو قبض.' : 'Cannot delete an account linked to transaction vouchers (receipts/payments).' };
    }
    
    const childrenCount = await prisma.account.count({ where: { parentId: id } });
    if (childrenCount > 0) {
      return { success: false, error: lang === 'ar' ? 'لا يمكن حذف حساب أب يحتوي على حسابات فرعية.' : 'Cannot delete a parent account that contains sub-accounts.' };
    }
    
    await prisma.account.delete({ where: { id } });
    
    revalidatePath('/accounts');
    revalidatePath('/ledger');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete account:', error);
    return { success: false, error: error.message || 'Failed to delete account.' };
  }
}

export async function authorizeDBDeleteAllAccounts() {
   // A quick utility for the user to reset so they can get the new Arabic Accounts without clicking 32 times
   await prisma.journalEntry.deleteMany({});
   await prisma.account.deleteMany({});
   revalidatePath('/accounts');
   revalidatePath('/ledger');
   return { success: true };
}

export async function seedProfessionalAccounts() {
  try {
    const session = await getSession();
    const perms = session?.user?.permissions;
    
    if (!hasPermission(perms, 'accounting', 'create')) {
      return { success: false, error: 'غير مصرح لك بإدارة الحسابات' };
    }

    const currentCount = await prisma.account.count();
    if (currentCount > 0) {
      return { success: false, error: 'Accounts already exist. Cannot auto-generate over existing accounts.' };
    }

    // 1. Top-Level Roots
    const assetRoot = await prisma.account.create({ data: { code: '1', name: 'Assets', nameAr: 'الأصول', type: 'Asset', nature: 'Debit', description: 'كافة ممتلكات المنشأة ومواردها الاقتصادية' } });
    const liabilityRoot = await prisma.account.create({ data: { code: '2', name: 'Liabilities', nameAr: 'الخصوم', type: 'Liability', nature: 'Credit', description: 'الالتزامات والديون المستحقة على المنشأة تجاه الغير' } });
    const equityRoot = await prisma.account.create({ data: { code: '3', name: 'Equity', nameAr: 'حقوق الملكية', type: 'Equity', nature: 'Credit', description: 'حقوق الملاك في صافي أصول المنشأة بعد خصم الخصوم' } });
    const revenueRoot = await prisma.account.create({ data: { code: '4', name: 'Revenue', nameAr: 'الإيرادات', type: 'Revenue', nature: 'Credit', description: 'كافة التدفقات النقدية الداخلة للمنشأة الناتجة عن نشاطها' } });
    const expenseRoot = await prisma.account.create({ data: { code: '5', name: 'Expenses', nameAr: 'المصروفات', type: 'Expense', nature: 'Debit', description: 'كافة التكاليف التي تتحملها المنشأة في سبيل تحقيق الإيراد' } });

    // 2. Asset Sub-Categories
    const currentAssets = await prisma.account.create({ 
      data: { code: '11', name: 'Current Assets', nameAr: 'الأصول المتداولة', type: 'Asset', parentId: assetRoot.id, nature: 'Debit', description: 'الأصول التي يمكن تحويلها إلى نقد خلال سنة مالية واحدة' } 
    });
    const fixedAssets = await prisma.account.create({ 
      data: { code: '12', name: 'Fixed Assets', nameAr: 'الأصول الثابتة', type: 'Asset', parentId: assetRoot.id, nature: 'Debit', description: 'الأصول طويلة الأجل المستخدمة في تشغيل النشاط وغير معدة للبيع' } 
    });

    // 3. Equity Sub-Categories (3xxx)
    const capParent = await prisma.account.create({ data: { code: '31', name: 'Capital', nameAr: 'رأس المال', type: 'Equity', parentId: equityRoot.id, nature: 'Credit', description: 'رأس مال المنشأة المخصص من الملاك' } });
    const reservesParent = await prisma.account.create({ data: { code: '32', name: 'Reserves', nameAr: 'الاحتياطيات', type: 'Equity', parentId: equityRoot.id, nature: 'Credit', description: 'المبالغ المحتجزة من الأرباح لمواجهة ظروف مستقبلية' } });
    const partnersParent = await prisma.account.create({ data: { code: '33', name: 'Partners Current Accounts', nameAr: 'جاري الشركاء / الملاك', type: 'Equity', parentId: equityRoot.id, nature: 'Credit', description: 'حسابات متابعة المسحوبات والإيداعات الشخصية للملاك' } });
    const reParent = await prisma.account.create({ data: { code: '34', name: 'Retained Earnings (or Losses)', nameAr: 'الأرباح المبقاة (أو الخسائر)', type: 'Equity', parentId: equityRoot.id, nature: 'Credit', description: 'صافي أرباح السنوات السابقة التي لم يتم توزيعها' } });
    const treasuryParent = await prisma.account.create({ data: { code: '35', name: 'Treasury Shares', nameAr: 'أسهم الخزانة', type: 'Equity', parentId: equityRoot.id, nature: 'Debit', description: 'أسهم تشتريها الشركة من السوق وتقلل من حقوق الملكية' } });

    const professionalCOA = [
      { code: '1100', name: 'Cash on Hand', nameAr: 'النقدية بالصندوق', type: 'Asset', parentId: currentAssets.id, nature: 'Debit', description: 'النقد الموجود فعلياً في خزينة الشركة' },
      { code: '1110', name: 'Petty Cash', nameAr: 'العهد النقدية', type: 'Asset', parentId: currentAssets.id, nature: 'Debit', description: 'المبالغ النقدية لدى الموظفين للمصروفات الصغيرة' },
      { code: '1120', name: 'Main Bank Account', nameAr: 'حساب البنك الرئيسي', type: 'Asset', parentId: currentAssets.id, nature: 'Debit', description: 'الرصيد النقدي في الحساب الجاري الأساسي لدى البنك' },
      { code: '1130', name: 'Accounts Receivable', nameAr: 'حسابات العملاء (ذمم)', type: 'Asset', parentId: currentAssets.id, nature: 'Debit', description: 'الأرصدة المدينة المستحقة على العملاء مقابل مبيعات آجلة' },
      { code: '1135', name: 'Advances to Employees', nameAr: 'سلف الموظفين', type: 'Asset', parentId: currentAssets.id, nature: 'Debit', description: 'قيمة السلف والعهد الشخصية الممنوحة للموظفين' },
      { code: '1140', name: 'Inventory Asset', nameAr: 'المخزون', type: 'Asset', parentId: currentAssets.id, nature: 'Debit', description: 'قيمة البضائع والمواد المخزنة القابلة للبيع' },
      { code: '1150', name: 'VAT Receivable (Input Tax)', nameAr: 'ضريبة القيمة المضافة المدفوعة', type: 'Asset', parentId: currentAssets.id, nature: 'Debit', description: 'ضريبة القيمة المضافة التي تم دفعها للموردين والقابلة للاسترداد' },
      
      // Fixed Assets (12xx)
      { code: '1200', name: 'Machinery & Equipment', nameAr: 'آلات ومعدات', type: 'Asset', parentId: fixedAssets.id, nature: 'Debit', description: 'قيمة الأصول الثابتة من آلات ومعدات ووسائل إنتاج' },
      { code: '1210', name: 'Office Furniture', nameAr: 'أثاث ومعدات مكاتب', type: 'Asset', parentId: fixedAssets.id, nature: 'Debit', description: 'الأصول الثابتة المستخدمة في المكاتب الإدارية' },
      { code: '1220', name: 'Vehicles', nameAr: 'سيارات ووسائل نقل', type: 'Asset', parentId: fixedAssets.id, nature: 'Debit', description: 'السيارات والشاحنات المملوكة للشركة' },
      { code: '1299', name: 'Accumulated Depreciation', nameAr: 'مجمع الإهلاك', type: 'Asset', parentId: fixedAssets.id, nature: 'Credit', description: 'مجمع استهلاك الأصول الذي يقلل من القيمة الدفترية للأصل الثابت' },

      // Liabilities (2xxx)
      { code: '2000', name: 'Accounts Payable', nameAr: 'حسابات الموردين (ذمم)', type: 'Liability', parentId: liabilityRoot.id, nature: 'Credit', description: 'الالتزامات المالية للموردين مقابل مشتريات بضائع أو خدمات آجلة' },
      { code: '2100', name: 'Accrued Salaries', nameAr: 'رواتب مستحقة', type: 'Liability', parentId: liabilityRoot.id, nature: 'Credit', description: 'إجمالي الرواتب والأجور التي استحقت للموظفين ولم تُصرف بعد' },
      { code: '2120', name: 'VAT Payable (Output Tax)', nameAr: 'ضريبة القيمة المضافة المحصلة', type: 'Liability', parentId: liabilityRoot.id, nature: 'Credit', description: 'ضريبة القيمة المضافة التي تم تحصيلها من العملاء ولَم تُورد للدولة بعد' },
      { code: '2300', name: 'Income Tax Payable', nameAr: 'ضريبة الدخل المستحقة', type: 'Liability', parentId: liabilityRoot.id, nature: 'Credit', description: 'المبالغ المخصصة لتغطية مستحقات ضريبة الدخل والزكاة' },
      
      // Equity Sub-accounts (3xxx)
      { code: '3101', name: 'Registered Capital', nameAr: 'رأس المال المسجل', type: 'Equity', parentId: capParent.id, nature: 'Credit', description: 'القيمة الاسمية لرأس مال الشركة المساهم به من الملاك' },
      { code: '3102', name: 'Paid-in Capital', nameAr: 'رأس المال المدفوع', type: 'Equity', parentId: capParent.id, nature: 'Credit', description: 'إجمالي المبالغ المدفوعة فعلياً من رأس المال' },
      
      { code: '3201', name: 'Statutory Reserve', nameAr: 'الاحتياطي النظامي', type: 'Equity', parentId: reservesParent.id, nature: 'Credit', description: 'الاحتياطي المفروض بموجب نظام الشركات' },
      { code: '3202', name: 'General Reserve', nameAr: 'الاحتياطي العام', type: 'Equity', parentId: reservesParent.id, nature: 'Credit', description: 'احتياطيات اختيارية تخصص من الأرباح' },
      
      { code: '3301', name: 'Partner Current Account 1', nameAr: 'جاري الشريك (1)', type: 'Equity', parentId: partnersParent.id, nature: 'Credit', description: 'المسحوبات والإيداعات والتعاملات الشخصية للشريك الأول' },
      
      { code: '3401', name: 'Retained Earnings', nameAr: 'أرباح محتجزة', type: 'Equity', parentId: reParent.id, nature: 'Credit', description: 'تراكم الأرباح التي لم يتم توزيعها من سنوات سابقة' },
      { code: '3402', name: 'Current Year Profit/Loss', nameAr: 'أرباح وخسائر العام الحالي', type: 'Equity', parentId: reParent.id, nature: 'Credit', description: 'صافي نتيجة النشاط للسنة المالية الحالية' },
      
      { code: '3501', name: 'Treasury Shares (at cost)', nameAr: 'أسهم الخزانة (بالتكلفة)', type: 'Equity', parentId: treasuryParent.id, nature: 'Debit', description: 'تكلفة الأسهم التي تمت إعادة شرائها من قبل الشركة' },
      
      // Revenue
      { code: '4000', name: 'Sales Revenue', nameAr: 'إيرادات المبيعات', type: 'Revenue', parentId: revenueRoot.id, nature: 'Credit', description: 'الدخل المحقق من النشاط التجاري الرئيسي لبيع البضائع' },
      { code: '4100', name: 'Service Revenue', nameAr: 'إيرادات الخدمات', type: 'Revenue', parentId: revenueRoot.id, nature: 'Credit', description: 'الدخل المحقق من تقديم الخدمات والاستشارات للغير' },
      { code: '4400', name: 'Penalties Income', nameAr: 'إيرادات الجزاءات', type: 'Revenue', parentId: revenueRoot.id, nature: 'Credit', description: 'الإيرادات المحصلة من جزاءات الموظفين أو غرامات التأخير من الغير' },
      
      // Expenses
      { code: '5000', name: 'Cost of Goods Sold (COGS)', nameAr: 'تكلفة البضاعة المباعة', type: 'Expense', parentId: expenseRoot.id, nature: 'Debit', description: 'التكلفة المباشرة للبضائع التي تم بيعها خلال الفترة' },
      { code: '6000', name: 'Salaries and Wages', nameAr: 'رواتب وأجور', type: 'Expense', parentId: expenseRoot.id, nature: 'Debit', description: 'إجمالي الرواتب الشهرية والبدلات والمكافآت لموظفي الشركة' },
      { code: '6100', name: 'Rent Expense', nameAr: 'مصروف إيجار', type: 'Expense', parentId: expenseRoot.id, nature: 'Debit', description: 'تكلفة استئجار المقرات والمخازن والمكاتب الإدارية' },
      { code: '6200', name: 'Utilities Expense', nameAr: 'مصروف منافع (ماء وكهرباء)', type: 'Expense', parentId: expenseRoot.id, nature: 'Debit', description: 'تكاليف الكهرباء والماء والاتصالات والإنترنت الدورية' }
    ];

    await prisma.account.createMany({
      data: professionalCOA
    });

    revalidatePath('/accounts');
    revalidatePath('/ledger');
    return { success: true };
  } catch (error) {
    console.error('Failed to seed professional COA:', error);
    return { success: false, error: 'Failed to generate Chart of Accounts.' };
  }
}

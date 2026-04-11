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
    if (!hasPermission(session?.user?.role, 'MANAGE_ACCOUNTS')) {
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
    if (!hasPermission(session?.user?.role, 'MANAGE_ACCOUNTS')) {
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
    if (!hasPermission(session?.user?.role, 'MANAGE_ACCOUNTS')) {
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
    if (!hasPermission(session?.user?.role, 'MANAGE_ACCOUNTS')) {
      return { success: false, error: 'غير مصرح لك بإدارة الحسابات' };
    }

    const currentCount = await prisma.account.count();
    if (currentCount > 0) {
      return { success: false, error: 'Accounts already exist. Cannot auto-generate over existing accounts.' };
    }
    // Top-Level
    const assetParent = await prisma.account.create({ data: { code: '1', name: 'Assets', nameAr: 'الأصول', type: 'Asset' } });
    const liabilityParent = await prisma.account.create({ data: { code: '2', name: 'Liabilities', nameAr: 'الخصوم', type: 'Liability' } });
    const equityParent = await prisma.account.create({ data: { code: '3', name: 'Equity', nameAr: 'حقوق الملكية', type: 'Equity' } });
    const revenueParent = await prisma.account.create({ data: { code: '4', name: 'Revenue', nameAr: 'الإيرادات', type: 'Revenue' } });
    const expenseParent = await prisma.account.create({ data: { code: '5', name: 'Expenses', nameAr: 'المصروفات', type: 'Expense' } });

    const p = {
      ast: assetParent.id,
      lib: liabilityParent.id,
      eqt: equityParent.id,
      rev: revenueParent.id,
      exp: expenseParent.id,
    };

    // Intermediate Parents for Equity
    const capParent = await prisma.account.create({ data: { code: '31', name: 'Capital', nameAr: 'رأس المال', type: 'Equity', parentId: p.eqt } });
    const otherEquityParent = await prisma.account.create({ data: { code: '32', name: 'Other Equity', nameAr: 'حقوق ملكية أخرى', type: 'Equity', parentId: p.eqt } });
    const reserveParent = await prisma.account.create({ data: { code: '33', name: 'Reserves', nameAr: 'احتياطيات', type: 'Equity', parentId: p.eqt } });
    const reParent = await prisma.account.create({ data: { code: '34', name: 'Retained Earnings (or Losses)', nameAr: 'الأرباح المبقاة (أو الخسائر)', type: 'Equity', parentId: p.eqt } });

    const professionalCOA = [
      // Assets
      { code: '1000', name: 'Cash on Hand', nameAr: 'النقدية بالصندوق', type: 'Asset', parentId: p.ast, nature: 'Debit', description: 'النقد الموجود فعلياً في خزينة الشركة' },
      { code: '1010', name: 'Petty Cash', nameAr: 'العهد النقدية', type: 'Asset', parentId: p.ast, nature: 'Debit', description: 'المبالغ النقدية لدى الموظفين للمصروفات الصغيرة' },
      { code: '1020', name: 'Main Bank Account', nameAr: 'حساب البنك الرئيسي', type: 'Asset', parentId: p.ast, nature: 'Debit', description: 'الرصيد النقدي في الحساب البنكي الأساسي' },
      { code: '1200', name: 'Accounts Receivable', nameAr: 'حسابات العملاء (ذمم)', type: 'Asset', parentId: p.ast, nature: 'Debit', description: 'المبالغ المستحقة للشركة لدى العملاء' },
      { code: '1300', name: 'Inventory Asset', nameAr: 'المخزون', type: 'Asset', parentId: p.ast, nature: 'Debit', description: 'قيمة بضاعة المستودع المتاحة للبيع' },
      { code: '1400', name: 'Prepaid Expenses', nameAr: 'مصروفات مدفوعة مقدماً', type: 'Asset', parentId: p.ast, nature: 'Debit', description: 'المبالغ المدفوعة مقدماً لمصروفات تخص فترات مستقبلية' },
      { code: '1500', name: 'Machinery & Equipment', nameAr: 'آلات ومعدات', type: 'Asset', parentId: p.ast, nature: 'Debit', description: 'الأصول الثابتة المستخدمة في عمليات الشركة' },
      { code: '1510', name: 'Accumulated Depreciation', nameAr: 'مجمع الإهلاك', type: 'Asset', parentId: p.ast, nature: 'Credit', description: 'إجمالي قيمة استهلاك الأصول الثابتة عبر الزمن' },
      
      // Liabilities
      { code: '2000', name: 'Accounts Payable', nameAr: 'حسابات الموردين (ذمم)', type: 'Liability', parentId: p.lib, nature: 'Credit' },
      { code: '2100', name: 'Accrued Salaries', nameAr: 'رواتب مستحقة', type: 'Liability', parentId: p.lib, nature: 'Credit' },
      { code: '2200', name: 'Sales Tax Payable', nameAr: 'ضريبة المبيعات المستحقة', type: 'Liability', parentId: p.lib, nature: 'Credit' },
      { code: '2300', name: 'Income Tax Payable', nameAr: 'ضريبة الدخل المستحقة', type: 'Liability', parentId: p.lib, nature: 'Credit' },
      { code: '2500', name: 'Long-Term Bank Loan', nameAr: 'قرض بنكي طويل الأجل', type: 'Liability', parentId: p.lib, nature: 'Credit' },
      
      // Equity Sub-accounts
      { code: '3101', name: 'Registered Capital', nameAr: 'رأس المال المسجل', type: 'Equity', parentId: capParent.id, nature: 'Credit' },
      { code: '3102', name: 'Additional Paid-in Capital', nameAr: 'رأس المال الإضافي المدفوع', type: 'Equity', parentId: capParent.id, nature: 'Credit' },
      { code: '3201', name: 'Opening Balances', nameAr: 'أرصدة افتتاحية', type: 'Equity', parentId: otherEquityParent.id, nature: 'Credit' },
      { code: '3301', name: 'Statutory Reserve', nameAr: 'احتياطي نظامي', type: 'Equity', parentId: reserveParent.id, nature: 'Credit' },
      { code: '3302', name: 'Foreign Currency Translation Reserve', nameAr: 'احتياطي ترجمة عملات أجنبية', type: 'Equity', parentId: reserveParent.id, nature: 'Credit' },
      { code: '3401', name: 'Operating Profit and Loss', nameAr: 'الأرباح والخسائر العاملة', type: 'Equity', parentId: reParent.id, nature: 'Credit' },
      { code: '3402', name: 'Retained Earnings (or Losses)', nameAr: 'الأرباح المبقاة (أو الخسائر)', type: 'Equity', parentId: reParent.id, nature: 'Credit' },
      
      // Revenue
      { code: '4000', name: 'Sales Revenue', nameAr: 'إيرادات المبيعات', type: 'Revenue', parentId: p.rev, nature: 'Credit' },
      { code: '4100', name: 'Service Revenue', nameAr: 'إيرادات الخدمات', type: 'Revenue', parentId: p.rev, nature: 'Credit' },
      { code: '4200', name: 'Sales Returns and Allowances', nameAr: 'مردودات ومسموحات المبيعات', type: 'Revenue', parentId: p.rev, nature: 'Debit' },
      { code: '4300', name: 'Interest Income', nameAr: 'إيرادات فوائد', type: 'Revenue', parentId: p.rev, nature: 'Credit' },
      
      // Expenses
      { code: '5000', name: 'Cost of Goods Sold (COGS)', nameAr: 'تكلفة البضاعة المباعة', type: 'Expense', parentId: p.exp, nature: 'Debit' },
      { code: '5100', name: 'Direct Labor', nameAr: 'أجور عمالة مباشرة', type: 'Expense', parentId: p.exp, nature: 'Debit' },
      { code: '5200', name: 'Shipping and Delivery', nameAr: 'مصروفات شحن وتوصيل', type: 'Expense', parentId: p.exp, nature: 'Debit' },
      { code: '6000', name: 'Salaries and Wages', nameAr: 'رواتب وأجور', type: 'Expense', parentId: p.exp, nature: 'Debit' },
      { code: '6100', name: 'Rent Expense', nameAr: 'مصروف إيجار', type: 'Expense', parentId: p.exp, nature: 'Debit' },
      { code: '6200', name: 'Utilities Expense', nameAr: 'مصروف منافع (ماء وكهرباء)', type: 'Expense', parentId: p.exp, nature: 'Debit' },
      { code: '6300', name: 'Office Supplies', nameAr: 'قرطاسية وأدوات مكتبية', type: 'Expense', parentId: p.exp, nature: 'Debit' },
      { code: '6400', name: 'Marketing and Advertising', nameAr: 'دعاية وإعلان', type: 'Expense', parentId: p.exp, nature: 'Debit' },
      { code: '6500', name: 'Insurance Expense', nameAr: 'مصروف تأمين', type: 'Expense', parentId: p.exp, nature: 'Debit' },
      { code: '6600', name: 'Depreciation Expense', nameAr: 'مصروف الإهلاك', type: 'Expense', parentId: p.exp, nature: 'Debit' },
      { code: '6700', name: 'Bank Fees', nameAr: 'عمولات بنكية', type: 'Expense', parentId: p.exp, nature: 'Debit' },
      { code: '6800', name: 'Legal and Professional Fees', nameAr: 'أتعاب مهنية وقانونية', type: 'Expense', parentId: p.exp, nature: 'Debit' }
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

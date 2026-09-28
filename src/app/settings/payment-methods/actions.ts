'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function getAuthContext() {
  const session = await getSession();
  if (!session?.user?.companyId) {
    throw new Error('غير مصرح لك بالوصول');
  }
  return {
    companyId: session.user.companyId,
    user: session.user
  };
}

export async function seedDefaultPaymentMethods(companyId: string) {
  try {
    const existing = await prisma.paymentMethod.count({ where: { companyId } });
    if (existing > 0) return;

    // Find cash and bank accounts
    const cashAccount = await prisma.account.findFirst({
      where: {
        companyId,
        OR: [
          { code: { startsWith: '111' } },
          { nameAr: { contains: 'صندوق' } },
          { name: { contains: 'Cash', mode: 'insensitive' } }
        ]
      }
    });

    const bankAccount = await prisma.account.findFirst({
      where: {
        companyId,
        OR: [
          { code: { startsWith: '112' } },
          { nameAr: { contains: 'بنك' } },
          { name: { contains: 'Bank', mode: 'insensitive' } }
        ]
      }
    });

    const fallbackAsset = await prisma.account.findFirst({
      where: { companyId, type: 'Asset' }
    });

    const defaultMethods = [
      {
        companyId,
        name: 'Cash',
        nameAr: 'نقد / كاش',
        code: 'CASH',
        type: 'Cash',
        accountId: cashAccount?.id || fallbackAsset?.id || null,
        isDefault: true,
        isActive: true
      },
      {
        companyId,
        name: 'Mada / POS',
        nameAr: 'مدى / شبكة (POS)',
        code: 'MADA',
        type: 'Card',
        accountId: bankAccount?.id || fallbackAsset?.id || null,
        isDefault: false,
        isActive: true
      },
      {
        companyId,
        name: 'Bank Transfer',
        nameAr: 'تحويل بنكي',
        code: 'TRANSFER',
        type: 'Bank',
        accountId: bankAccount?.id || fallbackAsset?.id || null,
        isDefault: false,
        isActive: true
      },
      {
        companyId,
        name: 'Credit Card (Visa/Mastercard)',
        nameAr: 'بطاقة ائتمانية (فيزا / ماستر كارد)',
        code: 'CC',
        type: 'Card',
        accountId: bankAccount?.id || fallbackAsset?.id || null,
        isDefault: false,
        isActive: true
      }
    ];

    for (const m of defaultMethods) {
      await prisma.paymentMethod.create({ data: m });
    }
  } catch (err) {
    console.error('Failed to seed default payment methods:', err);
  }
}

export async function getPaymentMethods() {
  try {
    const { companyId } = await getAuthContext();
    await seedDefaultPaymentMethods(companyId);

    const methods = await prisma.paymentMethod.findMany({
      where: { companyId },
      include: {
        account: true
      },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }]
    });

    return { success: true, methods };
  } catch (err: any) {
    console.error('Error fetching payment methods:', err);
    return { success: false, error: err.message, methods: [] };
  }
}

export async function createPaymentMethod(data: {
  name: string;
  nameAr?: string;
  code?: string;
  type?: string;
  accountId?: string | null;
  isActive?: boolean;
  isDefault?: boolean;
}) {
  try {
    const { companyId } = await getAuthContext();

    if (!data.name || !data.name.trim()) {
      return { success: false, error: 'اسم طريقة الدفع مطلوب' };
    }

    if (data.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { companyId },
        data: { isDefault: false }
      });
    }

    const created = await prisma.paymentMethod.create({
      data: {
        companyId,
        name: data.name.trim(),
        nameAr: data.nameAr?.trim() || data.name.trim(),
        code: data.code?.trim() || null,
        type: data.type || 'Cash',
        accountId: data.accountId || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        isDefault: !!data.isDefault
      },
      include: { account: true }
    });

    revalidatePath('/settings/payment-methods');
    revalidatePath('/sales');
    return { success: true, paymentMethod: created };
  } catch (err: any) {
    console.error('Failed to create payment method:', err);
    if (err?.code === 'P2002') {
      return { success: false, error: 'طريقة دفع بهذا الاسم موجودة مسبقاً' };
    }
    return { success: false, error: err.message || 'فشل حفظ طريقة الدفع' };
  }
}

export async function updatePaymentMethod(
  id: string,
  data: {
    name?: string;
    nameAr?: string;
    code?: string;
    type?: string;
    accountId?: string | null;
    isActive?: boolean;
    isDefault?: boolean;
  }
) {
  try {
    const { companyId } = await getAuthContext();

    if (data.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { companyId, id: { not: id } },
        data: { isDefault: false }
      });
    }

    const updated = await prisma.paymentMethod.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.nameAr !== undefined && { nameAr: data.nameAr?.trim() || null }),
        ...(data.code !== undefined && { code: data.code?.trim() || null }),
        ...(data.type && { type: data.type }),
        ...(data.accountId !== undefined && { accountId: data.accountId || null }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.isDefault !== undefined && { isDefault: data.isDefault })
      },
      include: { account: true }
    });

    revalidatePath('/settings/payment-methods');
    revalidatePath('/sales');
    return { success: true, paymentMethod: updated };
  } catch (err: any) {
    console.error('Failed to update payment method:', err);
    return { success: false, error: err.message || 'فشل تحديث طريقة الدفع' };
  }
}

export async function deletePaymentMethod(id: string) {
  try {
    const { companyId } = await getAuthContext();

    // Check if used in invoices
    const usedInvoices = await prisma.salesInvoice.count({
      where: { companyId, paymentMethodId: id }
    });

    if (usedInvoices > 0) {
      return {
        success: false,
        error: `لا يمكن حذف طريقة الدفع لأنها مستخدمة في ${usedInvoices} فاتورة. يمكنك تعطيلها بدلاً من حذفها.`
      };
    }

    await prisma.paymentMethod.delete({
      where: { id }
    });

    revalidatePath('/settings/payment-methods');
    revalidatePath('/sales');
    return { success: true };
  } catch (err: any) {
    console.error('Failed to delete payment method:', err);
    return { success: false, error: err.message || 'فشل حذف طريقة الدفع' };
  }
}

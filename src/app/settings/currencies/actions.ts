'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function saveCurrency(data: any) {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    throw new Error('Unauthorized');
  }

  const companyId = session.user.companyId;

  if (data.id) {
    if (data.isDefault) {
      await prisma.currency.updateMany({
        where: { companyId },
        data: { isDefault: false }
      });
    }
    await prisma.currency.update({
      where: { id: data.id, companyId },
      data: {
        code: data.code,
        name: data.name,
        nameAr: data.nameAr,
        exchangeRate: parseFloat(data.exchangeRate),
        isDefault: data.isDefault,
      }
    });
  } else {
    if (data.isDefault) {
      await prisma.currency.updateMany({
        where: { companyId },
        data: { isDefault: false }
      });
    }
    await prisma.currency.create({
      data: {
        companyId,
        code: data.code,
        name: data.name,
        nameAr: data.nameAr,
        exchangeRate: parseFloat(data.exchangeRate),
        isDefault: data.isDefault,
      }
    });
  }

  revalidatePath('/settings/currencies');
}

export async function deleteCurrency(id: string) {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    throw new Error('Unauthorized');
  }

  const currency = await prisma.currency.findUnique({ where: { id } });
  if (currency?.isDefault) {
    throw new Error('Cannot delete default currency');
  }

  await prisma.currency.delete({
    where: { id, companyId: session.user.companyId }
  });

  revalidatePath('/settings/currencies');
}

'use server';

import { prisma } from '@/lib/db';

export async function getItemCard(productId: string) {
  try {
    const logs = await prisma.inventoryLog.findMany({
      where: { productId },
      include: {
        product: { include: { unitRef: true } },
        unit: true,
        warehouse: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return logs;
  } catch (err) {
    console.error('Error fetching item card:', err);
    return [];
  }
}

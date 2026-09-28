import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { seedDefaultPaymentMethods } from '@/app/settings/payment-methods/actions';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    await seedDefaultPaymentMethods(companyId);

    const methods = await prisma.paymentMethod.findMany({
      where: { companyId, isActive: true },
      include: { account: true },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }]
    });

    return NextResponse.json(methods);
  } catch (error: any) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

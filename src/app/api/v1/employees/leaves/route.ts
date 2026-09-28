import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const companyId = session.user.companyId;

    const leaves = await prisma.employeeLeave.findMany({
      where: { companyId },
      include: {
        employee: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(leaves);
  } catch (error: any) {
    console.error('Fetch Leaves Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    
    const financialYears = await prisma.financialYear.findMany({
      where: { companyId },
      orderBy: { startDate: 'desc' }
    });

    return NextResponse.json(financialYears);
  } catch (error: any) {
    console.error('Error fetching financial years:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    const body = await request.json();

    const { name, startDate, endDate, isActive } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    // Check for overlaps
    const overlapping = await prisma.financialYear.findFirst({
      where: {
        companyId,
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start }
          }
        ]
      }
    });

    if (overlapping) {
      return NextResponse.json({ error: 'Financial year overlaps with an existing year' }, { status: 400 });
    }

    // If this is set to active, unset active from others
    if (isActive) {
      await prisma.financialYear.updateMany({
        where: { companyId },
        data: { isActive: false }
      });
    }

    const newYear = await prisma.financialYear.create({
      data: {
        companyId,
        name,
        startDate: start,
        endDate: end,
        isActive: isActive || false,
        status: 'Open'
      }
    });

    return NextResponse.json(newYear);
  } catch (error: any) {
    console.error('Error creating financial year:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Financial year with this name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

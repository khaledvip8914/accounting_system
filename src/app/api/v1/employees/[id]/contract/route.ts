import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    const { id: employeeId } = await params;

    // Get the active contract for the employee
    const contract = await prisma.employeeContract.findFirst({
      where: { companyId, employeeId, status: 'Active' },
      include: {
        allowances: true,
        deductions: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(contract || null);
  } catch (error: any) {
    console.error('Error fetching employee contract:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    const { id: employeeId } = await params;
    const body = await request.json();

    const { basicSalary, startDate, endDate, allowances, deductions, photoUrl } = body;

    // Handle photo-only update
    if (photoUrl !== undefined && !basicSalary) {
      await prisma.employee.update({
        where: { id: employeeId, companyId },
        data: { photoUrl }
      });
      return NextResponse.json({ success: true });
    }

    if (!basicSalary || !startDate) {
      return NextResponse.json({ error: 'Basic salary and start date are required' }, { status: 400 });
    }

    // In a real system, we might terminate old contracts and create a new one.
    // For simplicity, we will either update the existing active contract or create a new one.
    
    // First, sync the basicSalary (and optionally photoUrl) back to the Employee model for legacy compatibility
    await prisma.employee.update({
      where: { id: employeeId, companyId },
      data: { basicSalary: parseFloat(basicSalary), ...(photoUrl !== undefined ? { photoUrl } : {}) }
    });

    let contract = await prisma.employeeContract.findFirst({
      where: { companyId, employeeId, status: 'Active' }
    });

    if (contract) {
      // Update existing contract
      contract = await prisma.employeeContract.update({
        where: { id: contract.id },
        data: {
          basicSalary: parseFloat(basicSalary),
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          allowances: {
            deleteMany: {}, // Clear old allowances
            create: allowances.map((a: any) => ({ name: a.name, amount: parseFloat(a.amount) }))
          },
          deductions: {
            deleteMany: {}, // Clear old deductions
            create: deductions.map((d: any) => ({ name: d.name, amount: parseFloat(d.amount) }))
          }
        },
        include: { allowances: true, deductions: true }
      });
    } else {
      // Create new contract
      contract = await prisma.employeeContract.create({
        data: {
          companyId,
          employeeId,
          basicSalary: parseFloat(basicSalary),
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          status: 'Active',
          allowances: {
            create: allowances.map((a: any) => ({ name: a.name, amount: parseFloat(a.amount) }))
          },
          deductions: {
            create: deductions.map((d: any) => ({ name: d.name, amount: parseFloat(d.amount) }))
          }
        },
        include: { allowances: true, deductions: true }
      });
    }

    return NextResponse.json(contract);
  } catch (error: any) {
    console.error('Error updating employee contract:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

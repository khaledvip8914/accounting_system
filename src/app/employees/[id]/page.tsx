import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import EmployeeProfileClient from './EmployeeProfileClient';

export const dynamic = 'force-dynamic';

export default async function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const lang = (cookieStore.get('NX_LANG')?.value as any) || 'ar';

  const session = await getSession();
  if (!session || !session.user) {
    redirect('/login');
  }

  const employee = await prisma.employee.findUnique({
    where: { id, companyId: session.user.companyId },
    include: {
      financialMoves: {
        orderBy: { date: 'desc' }
      },
      contracts: {
        include: {
          allowances: true,
          deductions: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!employee) {
    redirect('/employees');
  }

  // Also fetch all available allowances and deductions from settings
  const availableAllowances = await prisma.payrollAllowanceType.findMany({
    where: { companyId: session.user.companyId, isActive: true }
  });

  const availableDeductions = await prisma.payrollDeductionType.findMany({
    where: { companyId: session.user.companyId, isActive: true }
  });

  return (
    <EmployeeProfileClient 
      employee={employee} 
      availableAllowances={availableAllowances}
      availableDeductions={availableDeductions}
      lang={lang} 
    />
  );
}

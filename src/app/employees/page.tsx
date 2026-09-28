import { getDictionary } from '@/lib/i18n';
import { prisma_latest as prisma } from '@/lib/db';
import EmployeesClient from './EmployeesClient';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getActiveBranch } from '@/lib/branch';

export default async function EmployeesPage() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }

  const { hasPermission } = await import('@/lib/permissions');
  if (!hasPermission(session.user, 'hr_employees', 'view') && !hasPermission(session.user, 'hr', 'view')) {
    redirect('/unauthorized');
  }

  const companyId = session.user.companyId;

  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'ar';
  
  const dict = getDictionary(lang);
  const branchId = await getActiveBranch();
  
  // Branch separation logic:
  // If a specific branch is selected: show employees assigned to that branch.
  // (If it's the main branch, also include unassigned employees).
  const whereClause: any = { companyId };
  if (branchId) {
    const activeBranch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (activeBranch?.isMain) {
      whereClause.OR = [
        { branchId: branchId },
        { branchId: null }
      ];
    } else {
      whereClause.branchId = branchId;
    }
  }

  const employees = await prisma.employee.findMany({
    where: whereClause,
    include: { branch: true },
    orderBy: { createdAt: 'desc' }
  });

  const financialMoves = await prisma.employeeFinancialMove.findMany({
    where: whereClause,
    orderBy: { date: 'desc' },
    include: { employee: true }
  });

  const branches = await prisma.branch.findMany({
    where: { companyId },
    orderBy: { createdAt: 'asc' }
  });

  return (
    <EmployeesClient 
      initialEmployees={employees} 
      initialMoves={financialMoves}
      branches={branches}
      lang={lang} 
      dict={dict} 
    />
  );
}


import { getDictionary } from '@/lib/i18n';
import { prisma_latest as prisma } from '@/lib/db';
import EmployeesClient from './EmployeesClient';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function EmployeesPage() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }
  const companyId = session.user.companyId;

  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'en';
  
  const dict = getDictionary(lang);

  const employees = await prisma.employee.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' }
  });

  const financialMoves = await prisma.employeeFinancialMove.findMany({
    where: { companyId },
    orderBy: { date: 'desc' },
    include: { employee: true }
  });

  return (
    <EmployeesClient 
      initialEmployees={employees} 
      initialMoves={financialMoves}
      lang={lang} 
      dict={dict} 
    />
  );
}

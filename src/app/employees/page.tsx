import { getDictionary } from '@/lib/i18n';
import { prisma_latest as prisma } from '@/lib/db';
import EmployeesClient from './EmployeesClient';
import AppShell from '@/components/AppShell';
import { cookies } from 'next/headers';

export default async function EmployeesPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'en';
  const dict = getDictionary(lang);

  // Simple mock user for shell - in real app, get from auth
  const user = { username: 'admin', role: 'Administrator' };

  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const financialMoves = await prisma.employeeFinancialMove.findMany({
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

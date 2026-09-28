import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import PayrollSettingsClient from './PayrollSettingsClient';

export const dynamic = 'force-dynamic';

export default async function PayrollSettingsPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('NX_LANG')?.value as any) || 'ar';

  const session = await getSession();
  if (!session || !session.user) {
    redirect('/login');
  }

  const { companyId } = session.user;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { roleRef: true }
  });

  // Fetch accounts for mapping
  const accounts = await prisma.account.findMany({
    where: { companyId },
    orderBy: { code: 'asc' },
    select: { id: true, code: true, name: true, nameAr: true, type: true }
  });

  // Fetch initial settings
  let settings = await prisma.payrollSettings.findUnique({
    where: { companyId }
  });
  if (!settings) {
    settings = await prisma.payrollSettings.create({
      data: { companyId }
    });
  }

  // Fetch allowance types
  const allowances = await prisma.payrollAllowanceType.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch deduction types
  const deductions = await prisma.payrollDeductionType.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <PayrollSettingsClient
      initialSettings={settings}
      initialAllowances={allowances}
      initialDeductions={deductions}
      accounts={accounts}
      lang={lang}
    />
  );
}

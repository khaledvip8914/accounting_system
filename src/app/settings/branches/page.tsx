import { prisma } from '@/lib/db';
import BranchesClient from './BranchesClient';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Lang } from '@/lib/i18n';

export default async function BranchesPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const resolvedParams = await searchParams;
  const lang = (resolvedParams.lang || 'ar') as Lang;
  const session = await getSession();
  if (!session) redirect('/login');
  
  if (session.user.role !== 'Admin' && session.user.role !== 'SuperAdmin') {
    redirect('/'); // Only admins can manage branches
  }

  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
    include: { subscriptionPlan: true }
  });

  if (!company) redirect('/');

  const maxBranches = company.subscriptionPlan?.maxBranches || 1;

  const branches = await prisma.branch.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { createdAt: 'asc' }
  });

  return (
    <BranchesClient 
      lang={lang} 
      initialBranches={branches} 
      maxBranches={maxBranches}
    />
  );
}

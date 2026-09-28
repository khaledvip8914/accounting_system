import { prisma } from '@/lib/db';
import TaxesClient from './TaxesClient';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TaxesPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('NX_LANG')?.value as any) || 'ar';
  const dict = getDictionary(lang);
  
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }
  
  const taxRates = await prisma.taxRate.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { createdAt: 'asc' }
  });

  const accounts = await prisma.account.findMany({
    where: { companyId: session.user.companyId },
    select: { id: true, code: true, name: true, nameAr: true }
  });

  return (
    <TaxesClient 
      initialTaxes={taxRates} 
      accounts={accounts}
      lang={lang} 
      dict={dict} 
    />
  );
}

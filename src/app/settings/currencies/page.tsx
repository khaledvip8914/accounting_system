import { prisma } from '@/lib/db';
import CurrenciesClient from './CurrenciesClient';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { requireFeature } from '@/lib/subscription';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CurrenciesPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'ar';
  const dict = getDictionary(lang);
  
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }
  
  await requireFeature(session.user.companyId, 'hasMultiCurrency');

  const currencies = await prisma.currency.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { isDefault: 'desc' }
  });

  return (
    <CurrenciesClient 
      initialCurrencies={currencies} 
      lang={lang} 
      dict={dict} 
    />
  );
}

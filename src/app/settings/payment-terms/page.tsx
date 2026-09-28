import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import PaymentTermsClient from './PaymentTermsClient';
import { getDictionary } from '@/lib/i18n';
import { cookies } from 'next/headers';
import { hasPermission } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export default async function PaymentTermsPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  
  if (!hasPermission(session.user, 'settings_financial', 'view') && !hasPermission(session.user, 'settings', 'view')) {
    redirect('/unauthorized');
  }

  const { companyId } = session.user;
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'ar') as 'ar' | 'en';
  const dict = await getDictionary(lang);

  const paymentTerms = await prisma.paymentTerm.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="module-container">
      <PaymentTermsClient 
        initialTerms={paymentTerms} 
        lang={lang} 
        dict={dict}
      />
    </div>
  );
}

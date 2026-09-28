import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import PaymentMethodsClient from './PaymentMethodsClient';
import { getDictionary } from '@/lib/i18n';
import { cookies } from 'next/headers';
import { hasPermission } from '@/lib/permissions';
import { getPaymentMethods } from './actions';

export const dynamic = 'force-dynamic';

export default async function PaymentMethodsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  if (
    !hasPermission(session.user, 'settings_financial', 'view') &&
    !hasPermission(session.user, 'settings', 'view')
  ) {
    redirect('/unauthorized');
  }

  const { companyId } = session.user;
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'ar') as 'ar' | 'en';
  const dict = await getDictionary(lang);

  const [methodsRes, accounts] = await Promise.all([
    getPaymentMethods(),
    prisma.account.findMany({
      where: { companyId },
      orderBy: { code: 'asc' }
    })
  ]);

  return (
    <div className="module-container">
      <PaymentMethodsClient
        initialMethods={methodsRes.methods || []}
        accounts={accounts || []}
        lang={lang}
        dict={dict}
      />
    </div>
  );
}

import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import ProductPropsClient from './ProductPropsClient';
import { getDictionary } from '@/lib/i18n';
import { cookies } from 'next/headers';
import { hasPermission } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export default async function ProductPropsPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  
  if (!hasPermission(session.user, 'settings_financial', 'view') && !hasPermission(session.user, 'settings', 'view')) {
    redirect('/unauthorized');
  }

  const { companyId } = session.user;
  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'ar') as 'ar' | 'en';
  const dict = await getDictionary(lang);

  const productProps = await prisma.productCharacteristic.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="module-container">
      <ProductPropsClient 
        initialProps={productProps} 
        lang={lang} 
        dict={dict}
      />
    </div>
  );
}

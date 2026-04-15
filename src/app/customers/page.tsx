import { prisma } from '@/lib/db';
import CustomerList from '../sales/CustomerList';
import { Lang, getDictionary } from '@/lib/i18n';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const cookieStore = await cookies();
  const lang = (cookieStore.get('NX_LANG')?.value as Lang) || 'ar';
  const dict = getDictionary(lang);
  
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { name: 'asc' }
    });

    return (
      <div style={{ padding: '0 1rem' }}>
        <CustomerList customers={customers} lang={lang} dict={dict} />
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h2>Error Loading Customers</h2>
        <pre>{String(error)}</pre>
      </div>
    );
  }
}

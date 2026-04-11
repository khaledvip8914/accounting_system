import { getInvoices } from './actions';
import InvoicesClient from './InvoicesClient';
import { cookies } from 'next/headers';
import { getDictionary } from '../../lib/i18n';

export const dynamic = 'force-dynamic';

export default async function InvoicesPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'en';
  const dict = getDictionary(lang).invoices;

  const invoices = await getInvoices();
  
  return <InvoicesClient initialInvoices={invoices} dict={dict} />;
}

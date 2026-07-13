import { prisma } from '@/lib/db';
import SalesClient from './SalesClient';
import { Lang } from '@/lib/i18n';
import { getCompanyProfile } from '../settings/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function SalesPage(props: {
  params: Promise<any>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }
  const companyId = session.user.companyId;

  const searchParams = await props.searchParams;
  const lang = (searchParams.lang as Lang) || 'ar';
  
  try {
    const [invoices, quotations, customers, warehouses, accounts, companyProfile] = await Promise.all([
      prisma.salesInvoice.findMany({
        where: { companyId },
        include: { customer: true, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.salesQuotation.findMany({
        where: { companyId },
        include: { customer: true, items: { include: { product: true } }, convertedTo: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.findMany({
        where: { companyId },
        orderBy: { name: 'asc' }
      }),
      prisma.warehouse.findMany({
        where: { companyId },
        orderBy: { code: 'asc' }
      }),
      prisma.account.findMany({
        where: { companyId },
        orderBy: { code: 'asc' }
      }),
      getCompanyProfile()
    ]);

    // Fetch products just for the selection in invoices/quotations
    const products = await prisma.product.findMany({ 
        where: { companyId },
        orderBy: { sku: 'asc' } 
    });

    return (
      <SalesClient 
        lang={lang}
        initialInvoices={invoices || []}
        initialQuotations={quotations || []}
        initialCustomers={customers || []}
        initialProducts={products || []}
        initialWarehouses={warehouses || []}
        initialAccounts={accounts || []}
        companyProfile={companyProfile}
        initialUnits={[]}
        initialCostCenters={[]}
        initialProductionOrders={[]}
      />
    );
  } catch (err: any) {
    console.error('SERVER ERROR IN SalesPage:', err);
    return (
       <div style={{ padding: '2rem', color: 'red' }}>
          <h1>Server Error</h1>
          <pre>{err.message}</pre>
       </div>
    );
  }
}

import { prisma } from '@/lib/db';
import PurchasesClient from './PurchasesClient';
import { Lang } from '@/lib/i18n';
import { getCompanyProfile } from '../settings/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function PurchasesPage(props: {
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
    const [invoices, suppliers, products, accounts, companyProfile, warehouses, units, purchaseOrders] = await Promise.all([
      prisma.purchaseInvoice.findMany({
        where: { companyId },
        include: { supplier: true, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.supplier.findMany({
        where: { companyId },
        orderBy: { name: 'asc' }
      }),
      prisma.product.findMany({
        where: { companyId },
        include: { unitRef: true, subUnitRef: true, supplier: true },
        orderBy: { sku: 'asc' }
      }),
      // Fetch accounts suitable for payment: Cash, Bank, and Liability (Payables) types
      prisma.account.findMany({
        where: { companyId, type: { in: ['Asset', 'Liability'] } },
        orderBy: { code: 'asc' }
      }),
      getCompanyProfile(),
      prisma.warehouse.findMany({ where: { companyId }, orderBy: { code: 'asc' } }),
      prisma.unitOfMeasure.findMany({ where: { companyId }, orderBy: { name: 'asc' } }),
      prisma.purchaseOrder.findMany({
        where: { companyId },
        include: { supplier: true, items: { include: { product: true } } },
        orderBy: { date: 'desc' }
      })
    ]);

    return (
      <PurchasesClient 
        lang={lang}
        initialInvoices={invoices}
        initialSuppliers={suppliers}
        initialProducts={products}
        initialAccounts={accounts}
        initialWarehouses={warehouses}
        companyProfile={companyProfile}
        initialUnits={units}
        initialPurchaseOrders={purchaseOrders}
      />
    );
  } catch (err: any) {
    return (
       <div style={{ padding: '2rem', color: 'red' }}>
          <h1>Server Error (Purchases)</h1>
          <pre>{err.message}</pre>
       </div>
    );
  }
}

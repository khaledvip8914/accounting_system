import { prisma } from '@/lib/db';
import SalesClient from './SalesClient';
import { Lang } from '@/lib/i18n';
import { getCompanyProfile } from '../settings/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { requireFeature } from '@/lib/subscription';
import { getActiveBranch } from '@/lib/branch';

export default async function SalesPage(props: {
  params: Promise<any>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }
  const companyId = session.user.companyId;

  await requireFeature(companyId, 'hasSalesAndPurchases');

  const searchParams = await props.searchParams;
  const lang = (searchParams.lang as Lang) || 'ar';
  const branchId = await getActiveBranch();
  const whereClause: any = { companyId };
  if (branchId) whereClause.branchId = branchId;
  
  try {
    const [invoices, quotations, customers, warehouses, accounts, currencies, companyProfile, branches] = await Promise.all([
      prisma.salesInvoice.findMany({
        where: whereClause,
        include: { customer: true, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.salesQuotation.findMany({
        where: whereClause,
        include: { customer: true, items: { include: { product: true } }, convertedTo: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.findMany({
        where: { companyId },
        orderBy: { name: 'asc' }
      }),
      prisma.warehouse.findMany({
        where: whereClause,
        orderBy: { code: 'asc' }
      }),
      prisma.account.findMany({
        where: { companyId },
        orderBy: { code: 'asc' }
      }),
      prisma.currency.findMany({
        where: { companyId },
        orderBy: { isDefault: 'desc' }
      }),
      getCompanyProfile(),
      prisma.branch.findMany({ where: branchId ? { companyId, id: branchId } : { companyId } })
    ]);

    // Fetch products just for the selection in invoices/quotations
    const [products, warehouseStocks] = await Promise.all([
      prisma.product.findMany({ 
          where: whereClause,
          orderBy: { sku: 'asc' } 
      }),
      prisma.warehouseStock.findMany({
          where: branchId ? { warehouse: { companyId, branchId } } : { warehouse: { companyId } }
      })
    ]);

    products.forEach(p => {
      const pStocks = warehouseStocks.filter(ws => ws.productId === p.id);
      p.stockQuantity = pStocks.reduce((sum, ws) => sum + ws.quantity, 0);
    });

    return (
      <SalesClient 
        lang={lang}
        initialInvoices={invoices || []}
        initialQuotations={quotations || []}
        initialCustomers={customers || []}
        initialProducts={products || []}
        initialWarehouses={warehouses || []}
        initialBranches={branches || []}
        initialAccounts={accounts || []}
        initialCurrencies={currencies || []}
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

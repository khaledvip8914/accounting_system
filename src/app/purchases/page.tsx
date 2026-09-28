import { prisma } from '@/lib/db';
import PurchasesClient from './PurchasesClient';
import { Lang } from '@/lib/i18n';
import { getCompanyProfile } from '../settings/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { requireFeature } from '@/lib/subscription';
import { getActiveBranch } from '@/lib/branch';

export default async function PurchasesPage(props: {
  params: Promise<any>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }

  const { hasPermission } = await import('@/lib/permissions');
  if (!hasPermission(session.user, 'purchases', 'view')) {
    redirect('/unauthorized');
  }

  const companyId = session.user.companyId;

  await requireFeature(companyId, 'hasSalesAndPurchases');

  const searchParams = await props.searchParams;
  const lang = (searchParams.lang as Lang) || 'ar';
  
  const branchId = await getActiveBranch();
  const whereClause: any = { companyId };
  if (branchId) whereClause.branchId = branchId;

  try {
    const [invoices, suppliers, products, accounts, companyProfile, warehouses, units, purchaseOrders, currencies, warehouseStocks] = await Promise.all([
      prisma.purchaseInvoice.findMany({
        where: whereClause,
        include: { supplier: true, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.supplier.findMany({
        where: { companyId },
        orderBy: { name: 'asc' }
      }),
      prisma.product.findMany({
        where: whereClause,
        include: { unitRef: true, subUnitRef: true, supplier: true },
        orderBy: { sku: 'asc' }
      }),
      // Fetch accounts suitable for payment: Cash, Bank, and Liability (Payables) types
      prisma.account.findMany({
        where: { companyId, type: { in: ['Asset', 'Liability'] } },
        orderBy: { code: 'asc' }
      }),
      getCompanyProfile(),
      prisma.warehouse.findMany({ where: whereClause, orderBy: { code: 'asc' } }),
      prisma.unitOfMeasure.findMany({ where: { companyId }, orderBy: { name: 'asc' } }),
      prisma.purchaseOrder.findMany({
        where: whereClause,
        include: { supplier: true, items: { include: { product: true } } },
        orderBy: { date: 'desc' }
      }),
      prisma.currency.findMany({
        where: { companyId },
        orderBy: { isDefault: 'desc' }
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
        initialCurrencies={currencies}
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

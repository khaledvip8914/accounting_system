import { prisma } from '@/lib/db';
import InventoryClient from './InventoryClient';
import { Lang } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getActiveBranch } from '@/lib/branch';

export const dynamic = 'force-dynamic';

export default async function InventoryPage(props: {
  params: Promise<any>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }

  // Check Inventory Permission
  const { hasPermission } = await import('@/lib/permissions');
  if (!hasPermission(session.user, 'inventory', 'view')) {
    redirect('/unauthorized');
  }

  const companyId = session.user.companyId;

  const searchParams = await props.searchParams;
  const lang = (searchParams.lang as Lang) || 'ar';
  
  const branchId = await getActiveBranch();
  const whereClause: any = { companyId };
  if (branchId) whereClause.branchId = branchId;

  try {
    const [products, units, costCenters, productionOrders, warehouses, disposalVouchers, suppliers, categories, warehouseStocks] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: { unitRef: true, subUnitRef: true, categoryRef: true },
        orderBy: { sku: 'asc' }
      }),
      import('../sales/actions').then(m => m.getUnits()),
      import('../sales/actions').then(m => m.getCostCenters()),
      import('../sales/actions').then(m => m.getProductionOrders()),
      prisma.warehouse.findMany({
        where: whereClause,
        orderBy: { code: 'asc' }
      }),
      prisma.disposalVoucher.findMany({
          where: whereClause,
          include: { product: { include: { unitRef: true, subUnitRef: true } }, warehouse: true },
          orderBy: { date: 'desc' }
      }),
      prisma.supplier.findMany({
        where: { companyId },
        orderBy: { name: 'asc' }
      }),
      prisma.category.findMany({
        where: whereClause,
        orderBy: { name: 'asc' }
      }),
      prisma.warehouseStock.findMany({
        where: branchId ? { warehouse: { companyId, branchId } } : { warehouse: { companyId } }
      })
    ]);

    // Recalculate product stock based on the branch
    products.forEach(p => {
      const pStocks = warehouseStocks.filter(ws => ws.productId === p.id);
      p.stockQuantity = pStocks.reduce((sum, ws) => sum + ws.quantity, 0);
    });

    return (
      <InventoryClient 
        lang={lang}
        initialProducts={products || []}
        initialUnits={units || []}
        initialCostCenters={costCenters || []}
        initialProductionOrders={productionOrders || []}
        initialWarehouses={warehouses || []}
        initialDisposalVouchers={disposalVouchers || []}
        initialSuppliers={suppliers || []}
        initialCategories={categories || []}
      />
    );
  } catch (err: any) {
    console.error('SERVER ERROR IN InventoryPage:', err);
    return (
       <div style={{ padding: '2rem', color: 'red' }}>
          <h1>Server Error</h1>
          <pre>{err.message}</pre>
       </div>
    );
  }
}

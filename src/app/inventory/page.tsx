import { prisma } from '@/lib/db';
import InventoryClient from './InventoryClient';
import { Lang } from '@/lib/i18n';
export const dynamic = 'force-dynamic';

export default async function InventoryPage(props: {
  params: Promise<any>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const searchParams = await props.searchParams;
  const lang = (searchParams.lang as Lang) || 'ar';
  
  try {
    const [products, units, costCenters, productionOrders, warehouses, disposalVouchers] = await Promise.all([
      prisma.product.findMany({
        include: { unitRef: true, subUnitRef: true },
        orderBy: { sku: 'asc' }
      }),
      import('../sales/actions').then(m => m.getUnits()),
      import('../sales/actions').then(m => m.getCostCenters()),
      import('../sales/actions').then(m => m.getProductionOrders()),
      prisma.warehouse.findMany({
        orderBy: { code: 'asc' }
      }),
      prisma.disposalVoucher.findMany({
          include: { product: { include: { unitRef: true, subUnitRef: true } }, warehouse: true },
          orderBy: { date: 'desc' }
      })
    ]);

    return (
      <InventoryClient 
        lang={lang}
        initialProducts={products || []}
        initialUnits={units || []}
        initialCostCenters={costCenters || []}
        initialProductionOrders={productionOrders || []}
        initialWarehouses={warehouses || []}
        initialDisposalVouchers={disposalVouchers || []}
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

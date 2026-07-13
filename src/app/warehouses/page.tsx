import { prisma } from '@/lib/db';
import WarehouseClient from './WarehouseClient';
import { Lang } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getActiveBranch } from '@/lib/branch';

export default async function WarehousesPage(props: {
  params: Promise<any>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const searchParams = await props.searchParams;
  const lang = (searchParams.lang as Lang) || 'ar';
  
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
      redirect('/login');
  }
  const companyId = session.user.companyId;

  try {
    const branchId = await getActiveBranch();
    const whereClause: any = { companyId, branchId: branchId || null };

    const [warehouses, products, stocks] = await Promise.all([
      prisma.warehouse.findMany({
        where: whereClause,
        include: { stockItems: true },
        orderBy: { code: 'asc' }
      }),
      prisma.product.findMany({
        where: whereClause,
        orderBy: { sku: 'asc' }
      }),
      prisma.warehouseStock.findMany({
        where: branchId ? { warehouse: { companyId, branchId } } : { warehouse: { companyId } },
        include: { product: true, warehouse: true }
      })
    ]);

    products.forEach(p => {
      const pStocks = stocks.filter(ws => ws.productId === p.id);
      p.stockQuantity = pStocks.reduce((sum, ws) => sum + ws.quantity, 0);
    });

    return (
      <WarehouseClient 
        lang={lang}
        initialWarehouses={warehouses}
        initialProducts={products}
        initialStocks={stocks}
      />
    );
  } catch (err: any) {
    return (
       <div style={{ padding: '2rem', color: 'red' }}>
          <h1>Server Error (Warehouses)</h1>
          <pre>{err.message}</pre>
       </div>
    );
  }
}

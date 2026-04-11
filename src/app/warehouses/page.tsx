import { prisma } from '@/lib/db';
import WarehouseClient from './WarehouseClient';
import { Lang } from '@/lib/i18n';

export default async function WarehousesPage(props: {
  params: Promise<any>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const searchParams = await props.searchParams;
  const lang = (searchParams.lang as Lang) || 'ar';
  
  try {
    const [warehouses, products, stocks] = await Promise.all([
      prisma.warehouse.findMany({
        include: { stockItems: true },
        orderBy: { code: 'asc' }
      }),
      prisma.product.findMany({
        orderBy: { sku: 'asc' }
      }),
      prisma.warehouseStock.findMany({
        include: { product: true, warehouse: true }
      })
    ]);

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

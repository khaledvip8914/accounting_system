'use client';

import { useState } from 'react';
import ProductList from '../sales/ProductList';
import CostCenterList from '../sales/CostCenterList';
import ProductionOrderList from '../sales/ProductionOrderList';
import UnitList from '../sales/UnitList';
import ItemCardList from './ItemCardList';
import { getDictionary } from '@/lib/i18n';

export default function InventoryClient({
  lang,
  initialProducts,
  initialUnits,
  initialCostCenters,
  initialProductionOrders,
  initialWarehouses
}: {
  lang: string,
  initialProducts: any[],
  initialUnits: any[],
  initialCostCenters: any[],
  initialProductionOrders: any[],
  initialWarehouses: any[]
}) {
  const [activeTab, setActiveTab] = useState('products');
  const dict = getDictionary(lang);

  const tabs = [
    { id: 'products', label: lang === 'ar' ? 'المخزن والمنتجات' : 'Inventory', icon: '📦' },
    { id: 'cost-centers', label: lang === 'ar' ? 'وصفات الإنتاج (Recipe)' : 'Recipes/BOM', icon: '📝' },
    { id: 'production', label: lang === 'ar' ? 'أوامر الإنتاج' : 'Prod. Orders', icon: '🏭' },
    { id: 'item-card', label: lang === 'ar' ? 'بطاقة الصنف' : 'Item Card', icon: '📇' },
    { id: 'units', label: lang === 'ar' ? 'وحدات القياس' : 'Units/Scale', icon: '⚖️' },
  ];

  return (
    <div className="inventory-module">
      <div className="sales-header no-print">
        <div className="header-left">
           <div className="tabs-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tab-content" style={{ marginTop: '1.5rem' }}>
        {activeTab === 'products' && <ProductList products={initialProducts} units={initialUnits} lang={lang} dict={dict} />}
        {activeTab === 'cost-centers' && <CostCenterList costCenters={initialCostCenters} products={initialProducts} units={initialUnits} lang={lang} />}
        {activeTab === 'production' && <ProductionOrderList orders={initialProductionOrders} products={initialProducts} warehouses={initialWarehouses} costCenters={initialCostCenters} units={initialUnits} lang={lang} />}
        {activeTab === 'item-card' && <ItemCardList products={initialProducts} lang={lang} />}
        {activeTab === 'units' && <UnitList units={initialUnits} lang={lang} />}
      </div>

      <style jsx>{`
        .sales-header { display: flex; justify-content: space-between; align-items: center; background: var(--card-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); padding: 0.5rem 1.5rem; border-bottom: 1px solid var(--glass-border); margin: -1.5rem -1.5rem 0 -1.5rem; position: sticky; top: 0; z-index: 10; }
        .header-left { display: flex; align-items: center; }
        .tabs-container { display: flex; gap: 1.5rem; }
        .tab-item { padding: 1rem 0; border: none; background: none; font-weight: 500; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; position: relative; transition: all 0.2s; }
        .tab-item.active { color: #2563eb; }
        .tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #2563eb; }
        .tab-icon { font-size: 1.1rem; }
      `}</style>
    </div>
  );
}

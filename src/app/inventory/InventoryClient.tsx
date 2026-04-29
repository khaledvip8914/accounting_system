'use client';

import { useState } from 'react';
import ProductList from '../sales/ProductList';
import CostCenterList from '../sales/CostCenterList';
import ProductionOrderList from '../sales/ProductionOrderList';
import UnitList from '../sales/UnitList';
import ItemCardList from './ItemCardList';
import DisposalVoucherList from './DisposalVoucherList';
import CategoryList from './CategoryList';
import { getDictionary } from '@/lib/i18n';

export default function InventoryClient({
  lang,
  initialProducts,
  initialUnits,
  initialCostCenters,
  initialProductionOrders,
  initialWarehouses,
  initialDisposalVouchers,
  initialSuppliers,
  initialCategories
}: {
  lang: string,
  initialProducts: any[],
  initialUnits: any[],
  initialCostCenters: any[],
  initialProductionOrders: any[],
  initialWarehouses: any[],
  initialDisposalVouchers: any[],
  initialSuppliers: any[],
  initialCategories: any[]
}) {
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const dict = getDictionary(lang);

  const handleViewItemCard = (productId: string) => {
    setSelectedProductId(productId);
    setActiveTab('item-card');
  };

  const tabs = [
    { id: 'products', label: lang === 'ar' ? 'المخزن والمنتجات' : 'Inventory', icon: '📦' },
    { id: 'cost-centers', label: lang === 'ar' ? 'وصفات الإنتاج (Recipe)' : 'Recipes/BOM', icon: '📝' },
    { id: 'production', label: lang === 'ar' ? 'أوامر الإنتاج' : 'Prod. Orders', icon: '🏭' },
    { id: 'disposal', label: lang === 'ar' ? 'سند إتلاف صنف' : 'Item Disposal', icon: '💥' },
    { id: 'item-card', label: lang === 'ar' ? 'بطاقة الصنف' : 'Item Card', icon: '📇' },
    { id: 'units', label: lang === 'ar' ? 'وحدات القياس' : 'Units/Scale', icon: '⚖️' },
    { id: 'categories', label: lang === 'ar' ? 'الأقسام' : 'Categories', icon: '📁' },
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
        {activeTab === 'products' && (
          <ProductList 
            products={initialProducts} 
            units={initialUnits} 
            warehouses={initialWarehouses}
            suppliers={initialSuppliers}
            categories={initialCategories}
            lang={lang} 
            dict={dict} 
            onViewItemCard={handleViewItemCard} 
          />
        )}
        {activeTab === 'cost-centers' && <CostCenterList costCenters={initialCostCenters} products={initialProducts} units={initialUnits} lang={lang} />}
        {activeTab === 'production' && <ProductionOrderList orders={initialProductionOrders} products={initialProducts} warehouses={initialWarehouses} costCenters={initialCostCenters} units={initialUnits} lang={lang} />}
        {activeTab === 'disposal' && <DisposalVoucherList vouchers={initialDisposalVouchers} products={initialProducts} warehouses={initialWarehouses} units={initialUnits} lang={lang} />}
        {activeTab === 'item-card' && <ItemCardList products={initialProducts} lang={lang} initialProductId={selectedProductId} />}
        {activeTab === 'units' && <UnitList units={initialUnits} lang={lang} />}
        {activeTab === 'categories' && <CategoryList categories={initialCategories} lang={lang} />}
      </div>

      <style jsx>{`
        .sales-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          background: var(--card-bg); 
          backdrop-filter: blur(20px); 
          -webkit-backdrop-filter: blur(20px); 
          padding: 0 1.5rem; 
          border-bottom: 1px solid var(--glass-border); 
          margin: -2rem -2rem 0 -2rem; 
          position: sticky; 
          top: 0; 
          z-index: 10; 
          overflow-x: auto;
          scrollbar-width: none;
        }
        .sales-header::-webkit-scrollbar { display: none; }
        .header-left { display: flex; align-items: center; width: 100%; }
        .tabs-container { display: flex; gap: 1.5rem; width: 100%; }
        .tab-item { 
          padding: 1.25rem 0; 
          border: none; 
          background: none; 
          font-weight: 600; 
          color: #94a3b8; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          position: relative; 
          transition: all 0.2s; 
          white-space: nowrap; 
          font-size: 0.9rem;
        }
        .tab-item.active { color: #6366f1; }
        .tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: #6366f1; border-radius: 3px 3px 0 0; }
        .tab-icon { font-size: 1.2rem; }

        @media (max-width: 768px) {
          .sales-header { margin: -1.5rem -1.5rem 0 -1.5rem; }
          .tabs-container { gap: 1.25rem; }
          .tab-item { font-size: 0.85rem; padding: 1rem 0; }
        }
      `}</style>
    </div>
  );
}

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
      <div className="page-header no-print" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">{lang === 'ar' ? 'المخزون والمنتجات' : 'Inventory & Products'}</h1>
        <p className="page-subtitle">{lang === 'ar' ? 'إدارة المنتجات والمستودعات والتصنيع' : 'Manage products, warehouses, and manufacturing'}</p>
      </div>

      <div className="categories-container no-print" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {tabs.map((tab) => (
          <button suppressHydrationWarning
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: '1',
              minWidth: '160px',
              padding: '1.25rem 1rem',
              background: activeTab === tab.id ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.03)',
              color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
              border: `1px solid ${activeTab === tab.id ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === tab.id ? '0 8px 20px rgba(var(--accent-primary-rgb), 0.2)' : 'none'
            }}
            className="animate-in"
          >
            <span style={{ fontSize: '1.8rem', lineHeight: '1' }}>{tab.icon}</span>
            <span style={{ textAlign: 'center' }}>{tab.label}</span>
          </button>
        ))}
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
        .categories-container::-webkit-scrollbar {
          height: 6px;
        }
        .categories-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .categories-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .categories-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 768px) {
          .categories-container button {
            min-width: 130px !important;
            padding: 1rem 0.5rem !important;
          }
          .categories-container button span:first-child {
            font-size: 1.5rem !important;
          }
          .categories-container button span:last-child {
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
}

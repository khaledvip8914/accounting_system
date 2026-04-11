'use client';

import { useState } from 'react';
import WarehouseList from './WarehouseList';
import WarehouseStockList from './WarehouseStockList';
import { Lang, getDictionary } from '@/lib/i18n';

export default function WarehouseClient({
  lang,
  initialWarehouses,
  initialProducts,
  initialStocks
}: {
  lang: string,
  initialWarehouses: any[],
  initialProducts: any[],
  initialStocks: any[]
}) {
  const [activeTab, setActiveTab] = useState('inventory');
  const dict = getDictionary(lang);

  const tabs = [
    { id: 'inventory', label: lang === 'ar' ? 'جرد المستودعات' : 'Warehouse Inventory', icon: '📋' },
    { id: 'warehouses', label: lang === 'ar' ? 'المواقع - المستودعات' : 'Storage Locations', icon: '🏢' },
    { id: 'transfers', label: lang === 'ar' ? 'نقل وتحويلات' : 'Stock Transfers', icon: '🚚' },
  ];

  const totalStockValue = initialProducts.reduce((sum, p) => sum + (p.stockQuantity * p.costPrice), 0);

  return (
    <div className="warehouse-module">
      <div className="warehouse-header no-print">
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
        <div className="header-right">
           <button className="btn-export pdf" onClick={() => window.print()}>
              {lang === 'ar' ? 'طباعة تقرير الجرد' : 'Print Stock Report'} 📊
           </button>
        </div>
      </div>

      <div className="tab-content" style={{ marginTop: '1.5rem' }}>
        {activeTab === 'inventory' && (
           <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="card stat-card" style={{ padding: '1.5rem', background: '#f5f3ff', borderColor: '#7c3aed' }}>
                     <div style={{ color: '#6d28d9', fontSize: '0.875rem' }}>{lang === 'ar' ? 'إجمالي قيمة المخزون' : 'Total Inventory Value'}</div>
                     <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#4c1d95', marginTop: '0.5rem' }}>
                        {totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR
                     </div>
                  </div>
                  <div className="card stat-card" style={{ padding: '1.5rem', background: '#fff', borderColor: '#10b981' }}>
                     <div style={{ color: '#166534', fontSize: '0.875rem' }}>{lang === 'ar' ? 'عدد الأصناف المتاحة' : 'Products in Stock'}</div>
                     <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#166534', marginTop: '0.5rem' }}>
                        {initialProducts.filter(p => p.stockQuantity > 0).length}
                     </div>
                  </div>
              </div>
              <WarehouseStockList stocks={initialStocks} lang={lang} />
           </>
        )}
        {activeTab === 'warehouses' && <WarehouseList warehouses={initialWarehouses} lang={lang} />}
        {activeTab === 'transfers' && (
           <div className="card" style={{ padding: '3rem', textAlign: 'center', background: 'white' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚚</div>
              <h3>{lang === 'ar' ? 'إدارة التحويلات المخزنية' : 'Stock Transfer Management'}</h3>
              <p className="text-sub">{lang === 'ar' ? 'جاري تطوير ميزة نقل البضاعة بين المستودعات' : 'Inter-warehouse transfers module is under construction'}</p>
           </div>
        )}
      </div>

      <style jsx>{`
        .warehouse-header { display: flex; justify-content: space-between; align-items: center; background: white; padding: 0.5rem 1.5rem; border-bottom: 2px solid #f3f4f6; margin: -1.5rem -1.5rem 0 -1.5rem; position: sticky; top: 0; z-index: 10; }
        .tabs-container { display: flex; gap: 2rem; }
        .tab-item { padding: 1rem 0; border: none; background: none; font-weight: 500; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; position: relative; transition: all 0.2s; }
        .tab-item:hover { color: #1e293b; }
        .tab-item.active { color: #7c3aed; font-weight: 700; }
        .tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: #7c3aed; border-radius: 3px 3px 0 0; }
        .stat-card { border-left: 5px solid; }
        .btn-export { background: #ede9fe; color: #5b21b6; border: 1px solid #c4b5fd; padding: 0.5rem 1.25rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
      `}</style>
    </div>
  );
}

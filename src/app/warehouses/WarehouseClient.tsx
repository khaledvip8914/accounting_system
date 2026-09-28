'use client';

import { useState } from 'react';
import WarehouseList from './WarehouseList';
import WarehouseStockList from './WarehouseStockList';
import WarehouseTransfersClient from './WarehouseTransfersClient';
import { Lang, getDictionary } from '@/lib/i18n';

export default function WarehouseClient({
  lang,
  initialWarehouses,
  initialProducts,
  initialStocks,
  allWarehouses,
  initialTransfers,
  companyId
}: {
  lang: string,
  initialWarehouses: any[],
  initialProducts: any[],
  initialStocks: any[],
  allWarehouses: any[],
  initialTransfers: any[],
  companyId: string
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
    <div className="page-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="page-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        background: 'var(--glass-bg)',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2.2rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {lang === 'ar' ? 'المستودعات والمخزون' : 'Warehouses & Inventory'}
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>
            {activeTab === 'inventory' 
              ? (lang === 'ar' ? 'مراقبة ومتابعة المخزون' : 'Inventory monitoring')
              : activeTab === 'warehouses'
                ? (lang === 'ar' ? 'إدارة المواقع والمستودعات' : 'Manage storage locations')
                : (lang === 'ar' ? 'نقل وتحويلات المخزون' : 'Stock transfers')}
          </p>
        </div>
        <div className="header-right no-print">
           <button className="btn btn-secondary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🖨️</span> {lang === 'ar' ? 'طباعة تقرير الجرد' : 'Print Stock Report'}
           </button>
        </div>
      </div>

      <div className="tabs-container no-print" style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        background: 'rgba(255,255,255,0.03)',
        padding: '0.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '2rem',
        overflowX: 'auto'
      }}>
         {tabs.map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             style={{
               flex: '1',
               padding: '1rem 1.5rem',
               background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
               color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
               border: 'none',
               borderRadius: '8px',
               cursor: 'pointer',
               fontWeight: activeTab === tab.id ? 'bold' : 'normal',
               transition: 'all 0.3s ease',
               whiteSpace: 'nowrap',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               gap: '0.5rem'
             }}
           >
              <span>{tab.icon}</span>
              {tab.label}
           </button>
         ))}
      </div>

      <div className="tab-content animate-in" style={{ marginTop: '1.5rem' }}>
        {activeTab === 'inventory' && (
           <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="card glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
                     <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{lang === 'ar' ? 'إجمالي قيمة المخزون' : 'Total Inventory Value'}</div>
                     <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                        {totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR
                     </div>
                  </div>
                  <div className="card glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                     <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{lang === 'ar' ? 'عدد الأصناف المتاحة' : 'Products in Stock'}</div>
                     <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                        {initialProducts.filter(p => p.stockQuantity > 0).length}
                     </div>
                  </div>
              </div>
              <WarehouseStockList stocks={initialStocks} lang={lang} />
           </>
        )}
        {activeTab === 'warehouses' && <WarehouseList warehouses={initialWarehouses} lang={lang} />}
        {activeTab === 'transfers' && (
           <WarehouseTransfersClient 
              lang={lang} 
              allWarehouses={allWarehouses} 
              initialProducts={initialProducts}
              initialStocks={initialStocks}
              initialTransfers={initialTransfers}
              companyId={companyId}
           />
        )}
      </div>
    </div>
  );
}

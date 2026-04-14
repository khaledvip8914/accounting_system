'use client';

import { useState } from 'react';
import PurchaseInvoiceList from './PurchaseInvoiceList';
import SupplierList from './SupplierList';
import CreatePurchaseModal from './CreatePurchaseModal';
import { createPurchaseInvoice, updatePurchaseInvoice } from './actions';
import { Lang, getDictionary } from '@/lib/i18n';

export default function PurchasesClient({
  lang,
  initialInvoices,
  initialSuppliers,
  initialProducts,
  initialAccounts,
  initialWarehouses,
  initialUnits,
  companyProfile
}: {
  lang: string,
  initialInvoices: any[],
  initialSuppliers: any[],
  initialProducts: any[],
  initialAccounts: any[],
  initialWarehouses: any[],
  initialUnits: any[],
  companyProfile: any
}) {
  const [activeTab, setActiveTab] = useState('invoices');
  const [showNewPurchase, setShowNewPurchase] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any | null>(null);
  const dict = getDictionary(lang);

  const tabs = [
    { id: 'dashboard', label: lang === 'ar' ? 'نظرة عامة' : 'Overview', icon: '📈' },
    { id: 'invoices', label: lang === 'ar' ? 'فواتير المشتريات' : 'Purchase Invoices', icon: '📥' },
    { id: 'suppliers', label: lang === 'ar' ? 'الموردين' : 'Suppliers', icon: '🚛' },
  ];

  const handlePurchaseSave = async (data: any) => {
    let res;
    if (editingInvoice) {
      res = await updatePurchaseInvoice(editingInvoice.id, { ...data, lang });
    } else {
      res = await createPurchaseInvoice({ ...data, lang });
    }
    
    if (res?.success) {
      setShowNewPurchase(false);
      setEditingInvoice(null);
    } else {
      alert(res?.error || (lang === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving purchase'));
    }
  };

  const openEdit = (invoice: any) => {
    setEditingInvoice(invoice);
    setShowNewPurchase(true);
  };

  return (
    <div className="purchases-module">
      {/* Print-only Report Header */}
      <div className="print-report-header" style={{ display: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '2px solid #333', paddingBottom: '1.5rem' }}>
          {companyProfile?.logo && (
            <img src={companyProfile.logo} alt="Logo" style={{ height: '100px', objectFit: 'contain', marginBottom: '1.5rem' }} />
          )}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '28px', margin: '0', color: '#1a1a1a', fontWeight: '800' }}>
              {lang === 'ar' ? companyProfile?.nameAr : companyProfile?.name}
            </h1>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '8px', fontSize: '13px', color: '#444' }}>
              {companyProfile?.taxNumber && (
                <span>{lang === 'ar' ? 'الرقم الضريبي:' : 'Tax No:'} {companyProfile.taxNumber}</span>
              )}
              {companyProfile?.email && <span>{companyProfile.email}</span>}
              {companyProfile?.phone && <span>{companyProfile.phone}</span>}
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', textAlign: 'center', width: '100%' }}>
            <h2 style={{ fontSize: '22px', color: '#1e293b', margin: '0 0 10px', paddingBottom: '5px', borderBottom: '1px solid #eee', display: 'inline-block' }}>
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
        </div>
      </div>
      <div className="purchases-header no-print">
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
        <div className="header-right">
           {/* Global action buttons can go here */}
        </div>
      </div>

      <div className="tab-content" style={{ marginTop: '1.5rem' }}>
        {activeTab === 'dashboard' && (
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="card stat-card" style={{ padding: '1.5rem' }}>
                 <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{lang === 'ar' ? 'إجمالي المشتريات' : 'Total Procurement'}</div>
                 <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#047857', marginTop: '0.5rem' }}>
                    {initialInvoices.reduce((s, i) => s + i.netAmount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR
                 </div>
              </div>
              <div className="card stat-card" style={{ padding: '1.5rem' }}>
                 <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{lang === 'ar' ? 'عدد الموردين' : 'Suppliers Count'}</div>
                 <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#b45309', marginTop: '0.5rem' }}>
                    {initialSuppliers.length}
                 </div>
              </div>
           </div>
        )}
        {activeTab === 'invoices' && (
          <PurchaseInvoiceList 
            invoices={initialInvoices} 
            lang={lang} 
            dict={dict} 
            onNewInvoice={() => { setShowNewPurchase(true); setEditingInvoice(null); }} 
            onEditInvoice={openEdit}
            companyProfile={companyProfile}
          />
        )}
        {activeTab === 'suppliers' && <SupplierList suppliers={initialSuppliers} lang={lang} dict={dict} />}
      </div>

      {showNewPurchase && (
        <CreatePurchaseModal 
          invoiceToEdit={editingInvoice}
          suppliers={initialSuppliers}
          products={initialProducts}
          accounts={initialAccounts}
          warehouses={initialWarehouses}
          inventoryUnits={initialUnits}
          lang={lang}
          onClose={() => { setShowNewPurchase(false); setEditingInvoice(null); }}
          onSave={handlePurchaseSave}
        />
      )}

      <style jsx>{`
        .purchases-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 0.5rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          margin: -1.5rem -1.5rem 0 -1.5rem;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .tabs-container { display: flex; gap: 1.5rem; }
        .tab-item {
          padding: 1rem 0;
          border: none;
          background: none;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }
        .tab-item.active { color: #059669; }
        .tab-item.active::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: #059669; border-radius: 3px 3px 0 0;
        }
        .stat-card { border-left: 4px solid #059669; }
      `}</style>
    </div>
  );
}

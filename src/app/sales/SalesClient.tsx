'use client';

import { useState } from 'react';
import InvoiceList from './InvoiceList';
import CustomerList from './CustomerList';
import QuotationList from './QuotationList';
import CreateInvoiceModal from './CreateInvoiceModal';
import CreateQuotationModal from './CreateQuotationModal';
import { createSalesInvoice, updateSalesInvoice, createSalesQuotation, updateSalesQuotation } from './actions';
import { Lang, getDictionary } from '@/lib/i18n';

export default function SalesClient({
  lang,
  initialInvoices,
  initialQuotations,
  initialCustomers,
  initialProducts,
  initialWarehouses,
  initialAccounts,
  initialUnits,
  initialCostCenters,
  initialProductionOrders,
  companyProfile
}: {
  lang: string,
  initialInvoices: any[],
  initialQuotations: any[],
  initialCustomers: any[],
  initialProducts: any[],
  initialWarehouses: any[],
  initialAccounts: any[],
  initialUnits: any[],
  initialCostCenters: any[],
  initialProductionOrders: any[],
  companyProfile: any
}) {
  const [activeTab, setActiveTab] = useState('invoices');
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any | null>(null);
  
  const [showNewQuotation, setShowNewQuotation] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<any | null>(null);

  const dict = getDictionary(lang);

  const handleInvoiceSave = async (data: any) => {
    if (editingInvoice) {
      await updateSalesInvoice(editingInvoice.id, data);
    } else {
      await createSalesInvoice(data);
    }
    setShowNewInvoice(false);
    setEditingInvoice(null);
  };

  const handleQuotationSave = async (data: any) => {
    if (editingQuotation) {
      await updateSalesQuotation(editingQuotation.id, data);
    } else {
      await createSalesQuotation(data);
    }
    setShowNewQuotation(false);
    setEditingQuotation(null);
  };

  const openEditInvoice = (invoice: any) => {
    setEditingInvoice(invoice);
    setShowNewInvoice(true);
  };

  const openEditQuotation = (quotation: any) => {
    setEditingQuotation(quotation);
    setShowNewQuotation(true);
  };

  const tabs = [
    { id: 'quotations', label: lang === 'ar' ? 'عروض الأسعار' : 'Quotations', icon: '📄' },
    { id: 'invoices', label: lang === 'ar' ? 'فواتير المبيعات' : 'Sales Invoices', icon: '🧾' },
    { id: 'customers', label: lang === 'ar' ? 'العملاء' : 'Customers', icon: '👥' },
  ];

  return (
    <div className="sales-module">
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
        <div className="header-right">
           <div className="header-actions">
              <button className="btn-export pdf" onClick={() => window.print()}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  PDF
              </button>
           </div>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
             <div className="card text-center" style={{ padding: '1.5rem', background: 'white' }}>
                 <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{lang === 'ar' ? 'إجمالي المبيعات' : 'Total Sales'}</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#166534', marginTop: '0.5rem' }}>
                    {initialInvoices.reduce((s, i) => s + i.netAmount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR
                 </div>
             </div>
             <div className="card text-center" style={{ padding: '1.5rem', background: 'white' }}>
                 <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{lang === 'ar' ? 'عروض أسعار قيد الانتظار' : 'Pending Quotations'}</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ca8a04', marginTop: '0.5rem' }}>
                    {initialQuotations.filter(q => q.status === 'Sent' || q.status === 'Draft').length}
                 </div>
             </div>
             <div className="card text-center" style={{ padding: '1.5rem', background: 'white' }}>
                 <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{lang === 'ar' ? 'عدد العملاء' : 'Active Customers'}</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2563eb', marginTop: '0.5rem' }}>
                    {initialCustomers.length}
                 </div>
             </div>
          </div>
        )}
        {activeTab === 'quotations' && (
            <QuotationList
                quotations={initialQuotations}
                lang={lang}
                onNewQuotation={() => { setShowNewQuotation(true); setEditingQuotation(null); }}
                onEditQuotation={openEditQuotation}
                companyProfile={companyProfile}
                accounts={initialAccounts}
            />
        )}
        {activeTab === 'invoices' && (
           <InvoiceList 
             invoices={initialInvoices} 
             lang={lang} 
             onNewInvoice={() => { setShowNewInvoice(true); setEditingInvoice(null); }} 
             onEditInvoice={openEditInvoice}
             companyProfile={companyProfile}
           />
        )}
        {activeTab === 'customers' && <CustomerList customers={initialCustomers} lang={lang} dict={dict} />}
      </div>

      {showNewInvoice && (
        <CreateInvoiceModal 
          invoiceToEdit={editingInvoice}
          customers={initialCustomers}
          products={initialProducts}
          warehouses={initialWarehouses}
          accounts={initialAccounts}
          lang={lang}
          onClose={() => { setShowNewInvoice(false); setEditingInvoice(null); }}
          onSave={handleInvoiceSave}
        />
      )}

      {showNewQuotation && (
        <CreateQuotationModal
            quotationToEdit={editingQuotation}
            customers={initialCustomers}
            products={initialProducts}
            warehouses={initialWarehouses}
            lang={lang}
            onClose={() => { setShowNewQuotation(false); setEditingQuotation(null); }}
            onSave={handleQuotationSave}
        />
      )}

      <style jsx>{`
        .sales-header { display: flex; justify-content: space-between; align-items: center; background: white; padding: 0.5rem 1.5rem; border-bottom: 1px solid #e5e7eb; margin: -1.5rem -1.5rem 1.5rem -1.5rem; position: sticky; top: 0; z-index: 10; }
        .header-left { display: flex; align-items: center; }
        .tabs-container { display: flex; gap: 1.5rem; }
        .tab-item { padding: 1rem 0; border: none; background: none; font-weight: 500; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; position: relative; transition: all 0.2s; }
        .tab-item.active { color: #2563eb; }
        .tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #2563eb; }
        .tab-icon { font-size: 1.1rem; }
        .header-actions { display: flex; gap: 0.75rem; }
        .btn-export { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; }
        .btn-export.pdf { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
      `}</style>
    </div>
  );
}

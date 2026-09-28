'use client';

import { useState } from 'react';
import InvoiceList from './InvoiceList';
import CustomerList from './CustomerList';
import QuotationList from './QuotationList';
import ProductionOrderList from './ProductionOrderList';
import CreateInvoiceModal from './CreateInvoiceModal';
import CreateQuotationModal from './CreateQuotationModal';
import { createSalesInvoice, updateSalesInvoice, createSalesQuotation, updateSalesQuotation } from './actions';
import { Lang, getDictionary } from '@/lib/i18n';
import { useUser } from '@/components/UserContext';

export default function SalesClient({
  lang,
  initialInvoices,
  initialQuotations,
  initialCustomers,
  initialProducts,
  initialWarehouses,
  initialBranches,
  initialAccounts,
  initialCurrencies,
  initialUnits,
  initialCostCenters,
  initialProductionOrders,
  companyProfile,
  initialPaymentMethods
}: {
  lang: string,
  initialInvoices: any[],
  initialQuotations: any[],
  initialCustomers: any[],
  initialProducts: any[],
  initialWarehouses: any[],
  initialBranches?: any[],
  initialAccounts: any[],
  initialCurrencies: any[],
  initialUnits: any[],
  initialCostCenters: any[],
  initialProductionOrders: any[],
  companyProfile: any,
  initialPaymentMethods?: any[]
}) {
  const { canAccess } = useUser();
  const [activeTab, setActiveTab] = useState('invoices');
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any | null>(null);
  const [paymentMethods] = useState<any[]>(initialPaymentMethods || []);
  
  const [showNewQuotation, setShowNewQuotation] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<any | null>(null);

  const dict = getDictionary(lang);

  const allTabs = [
    { id: 'quotations', label: lang === 'ar' ? 'عروض الأسعار' : 'Quotations', icon: '📄', module: 'quotations' as const },
    { id: 'invoices', label: lang === 'ar' ? 'فواتير المبيعات' : 'Sales Invoices', icon: '🧾', module: 'invoices' as const },
    { id: 'production', label: lang === 'ar' ? 'أوامر الإنتاج' : 'Production Orders', icon: '🏭', module: 'production' as const },
    { id: 'customers', label: lang === 'ar' ? 'العملاء' : 'Customers', icon: '👥', module: 'contacts' as const },
  ];

  const tabs = allTabs.filter(t => canAccess(t.module));
  const currentTab = tabs.find(t => t.id === activeTab) ? activeTab : (tabs[0]?.id || 'invoices');

  const handleInvoiceSave = async (data: any) => {
    let res;
    if (editingInvoice) {
      res = await updateSalesInvoice(editingInvoice.id, data);
    } else {
      res = await createSalesInvoice(data);
    }
    
    if (res?.success) {
      setShowNewInvoice(false);
      setEditingInvoice(null);
    } else {
      alert(res?.error || (lang === 'ar' ? 'حدث خطأ أثناء حفظ الفاتورة' : 'Error saving invoice'));
    }
  };

  const handleQuotationSave = async (data: any) => {
    let res;
    if (editingQuotation) {
      res = await updateSalesQuotation(editingQuotation.id, data);
    } else {
      res = await createSalesQuotation(data);
    }
    
    if (res?.success) {
      setShowNewQuotation(false);
      setEditingQuotation(null);
    } else {
      alert(res?.error || (lang === 'ar' ? 'حدث خطأ أثناء حفظ العرض' : 'Error saving quotation'));
    }
  };

  const openEditInvoice = (invoice: any) => {
    setEditingInvoice(invoice);
    setShowNewInvoice(true);
  };

  const openEditQuotation = (quotation: any) => {
    setEditingQuotation(quotation);
    setShowNewQuotation(true);
  };

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
              {tabs.find(t => t.id === currentTab)?.label}
            </h2>
          </div>
        </div>
      </div>
      <div className="page-header no-print" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">{lang === 'ar' ? 'المبيعات' : 'Sales'}</h1>
        <p className="page-subtitle">{lang === 'ar' ? 'إدارة فواتير المبيعات وعروض الأسعار والعملاء' : 'Manage sales invoices, quotations, and customers'}</p>
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
              background: currentTab === tab.id ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.03)',
              color: currentTab === tab.id ? 'white' : 'var(--text-primary)',
              border: `1px solid ${currentTab === tab.id ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
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
              boxShadow: currentTab === tab.id ? '0 8px 20px rgba(var(--accent-primary-rgb), 0.2)' : 'none'
            }}
            className="animate-in"
          >
            <span style={{ fontSize: '1.8rem', lineHeight: '1' }}>{tab.icon}</span>
            <span style={{ textAlign: 'center' }}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="card glass-panel no-print" style={{ marginBottom: '2rem', padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div className="header-actions" style={{ display: 'flex', gap: '0.75rem' }}>
          
          {currentTab === 'invoices' && canAccess('invoices', 'create') && (
            <button className="btn btn-primary" onClick={() => { setEditingInvoice(null); setShowNewInvoice(true); }}>
              <span className="icon">+</span>
              {lang === 'ar' ? 'فاتورة مبيعات' : 'New Invoice'}
            </button>
          )}

          {currentTab === 'quotations' && canAccess('quotations', 'create') && (
            <button className="btn btn-primary" onClick={() => { setEditingQuotation(null); setShowNewQuotation(true); }}>
              <span className="icon">+</span>
              {lang === 'ar' ? 'عرض سعر' : 'New Quotation'}
            </button>
          )}
        </div>
      </div>

      <div className="tab-content">
        {currentTab === 'production' && (
          <ProductionOrderList 
            orders={initialProductionOrders}
            products={initialProducts}
            warehouses={initialWarehouses}
          branches={initialBranches || []}
            units={initialUnits}
            costCenters={initialCostCenters}
            lang={lang}
          />
        )}
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
          branches={initialBranches || []}
          accounts={initialAccounts}
          currencies={initialCurrencies}
          paymentMethods={paymentMethods}
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
          branches={initialBranches || []}
            lang={lang}
            onClose={() => { setShowNewQuotation(false); setEditingQuotation(null); }}
            onSave={handleQuotationSave}
        />
      )}

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
        .header-actions { display: flex; gap: 0.75rem; }
        .btn-export { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; }
        .btn-export.pdf { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }

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

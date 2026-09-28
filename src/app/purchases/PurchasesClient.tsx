'use client';

import { useState } from 'react';
import PurchaseInvoiceList from './PurchaseInvoiceList';
import SupplierList from './SupplierList';
import PurchaseOrderList from './PurchaseOrderList';
import CreatePurchaseModal from './CreatePurchaseModal';
import CreatePurchaseOrderModal from './CreatePurchaseOrderModal';
import { createPurchaseInvoice, updatePurchaseInvoice, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } from './actions';
import { Lang, getDictionary } from '@/lib/i18n';

export default function PurchasesClient({
  lang,
  initialInvoices,
  initialSuppliers,
  initialProducts,
  initialAccounts,
  initialWarehouses,
  initialUnits,
  initialPurchaseOrders,
  initialCurrencies,
  companyProfile
}: {
  lang: string,
  initialInvoices: any[],
  initialSuppliers: any[],
  initialProducts: any[],
  initialAccounts: any[],
  initialWarehouses: any[],
  initialUnits: any[],
  initialPurchaseOrders: any[],
  initialCurrencies: any[],
  companyProfile: any
}) {
  const [activeTab, setActiveTab] = useState('invoices');
  const [showNewPurchase, setShowNewPurchase] = useState(false);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const dict = getDictionary(lang);

  const tabs = [
    { id: 'dashboard', label: lang === 'ar' ? 'نظرة عامة' : 'Overview', icon: '📈' },
    { id: 'purchase-orders', label: lang === 'ar' ? 'طلبات الشراء' : 'Purchase Orders', icon: '📝' },
    { id: 'invoices', label: lang === 'ar' ? 'فواتير المشتريات' : 'Purchase Invoices', icon: '📥' },
    { id: 'suppliers', label: lang === 'ar' ? 'الموردين' : 'Suppliers', icon: '🚛' },
  ];

  const handlePurchaseSave = async (data: any) => {
    let res;
    if (editingInvoice && editingInvoice.id) {
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

  const handleOrderSave = async (data: any) => {
    let res;
    if (editingOrder) {
      res = await updatePurchaseOrder(editingOrder.id, data);
    } else {
      res = await createPurchaseOrder(data);
    }

    if (res?.success) {
      setShowNewOrder(false);
      setEditingOrder(null);
    } else {
      alert(res?.error || (lang === 'ar' ? 'حدث خطأ أثناء حفظ الطلب' : 'Error saving order'));
    }
  };

  const handleDeleteOrder = async (id: string) => {
    const res = await deletePurchaseOrder(id);
    if (!res.success) alert(res.error);
  };

  const openEditOrder = (order: any) => {
    setEditingOrder(order);
    setShowNewOrder(true);
  };

  const handleConvertToInvoice = (order: any) => {
    // Map order data to a new invoice format
    const newInvoiceData = {
      orderId: order.id,
      supplierId: order.supplierId,
      warehouseId: order.warehouseId || '',
      date: new Date().toISOString(),
      isTaxInclusive: order.isTaxInclusive,
      notes: lang === 'ar' ? `محولة من أمر شراء رقم ${order.orderNumber}` : `Converted from PO ${order.orderNumber}`,
      items: order.items.map((item: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        productId: item.productId,
        unitId: item.unitId || '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxPercent: 15,
        total: item.total
      }))
    };
    
    setEditingInvoice(newInvoiceData);
    setActiveTab('invoices');
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
      <div className="page-header no-print" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">{lang === 'ar' ? 'المشتريات' : 'Purchases'}</h1>
        <p className="page-subtitle">{lang === 'ar' ? 'إدارة فواتير المشتريات وطلبات الشراء والموردين' : 'Manage purchase invoices, orders, and suppliers'}</p>
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
              <div className="card stat-card" style={{ padding: '1.5rem', borderLeft: '4px solid #6366f1' }}>
                 <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{lang === 'ar' ? 'طلبات شراء نشطة' : 'Active Purchase Orders'}</div>
                 <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#6366f1', marginTop: '0.5rem' }}>
                    {initialPurchaseOrders.filter(o => o.status === 'Pending' || o.status === 'Ordered').length}
                 </div>
              </div>
           </div>
        )}
        {activeTab === 'purchase-orders' && (
          <PurchaseOrderList 
            orders={initialPurchaseOrders} 
            lang={lang} 
            onNewOrder={() => { setEditingOrder(null); setShowNewOrder(true); }}
            onEditOrder={openEditOrder}
            onDeleteOrder={handleDeleteOrder}
            onConvertToInvoice={handleConvertToInvoice}
          />
        )}
        {activeTab === 'invoices' && (
          <PurchaseInvoiceList 
            invoices={initialInvoices} 
            lang={lang} 
            dict={dict} 
            onNewInvoice={() => { setShowNewPurchase(true); setEditingInvoice(null); }} 
            onEditInvoice={(inv) => { setEditingInvoice(inv); setShowNewPurchase(true); }}
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
          currencies={initialCurrencies}
          lang={lang}
          onClose={() => { setShowNewPurchase(false); setEditingInvoice(null); }}
          onSave={handlePurchaseSave}
        />
      )}

      {showNewOrder && (
        <CreatePurchaseOrderModal 
          orderToEdit={editingOrder}
          suppliers={initialSuppliers}
          products={initialProducts}
          warehouses={initialWarehouses}
          currencies={initialCurrencies}
          lang={lang}
          onClose={() => { setShowNewOrder(false); setEditingOrder(null); }}
          onSave={handleOrderSave}
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
        .stat-card { border-left: 4px solid #059669; }

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

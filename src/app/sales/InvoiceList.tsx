'use client';

import React, { useState, useTransition } from 'react';
import { deleteSalesInvoice, updateSalesInvoiceStatus } from './actions';
import { useUser } from '@/components/UserContext';

const STATUS_OPTIONS = ['Draft', 'Sent', 'Paid', 'Overdue'];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Paid: { bg: '#dcfce7', color: '#166534' },
  Draft: { bg: '#f3f4f6', color: '#4b5563' },
  Sent: { bg: '#eff6ff', color: '#1e40af' },
  Overdue: { bg: '#fee2e2', color: '#991b1b' },
};

export default function InvoiceList({ 
  invoices, 
  lang, 
  onNewInvoice,
  onEditInvoice,
  companyProfile
}: { 
  invoices: any[], 
  lang: string,
  onNewInvoice?: () => void,
  onEditInvoice?: (invoice: any) => void,
  companyProfile: any
}) {
  const { canAccess } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (expandedId) {
      document.body.classList.add('has-expanded-invoice');
    } else {
      document.body.classList.remove('has-expanded-invoice');
    }
    return () => document.body.classList.remove('has-expanded-invoice');
  }, [expandedId]);

  const filtered = (invoices || []).filter(i => {
    const s = (searchTerm || '').toLowerCase();
    const matchSearch = (i?.invoiceNumber || '').toLowerCase().includes(s) || 
      (i?.customer?.name || '').toLowerCase().includes(s) ||
      (i?.customer?.nameAr || '').toLowerCase().includes(s);
    const matchStatus = filterStatus === 'all' || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDelete = (id: string) => {
    setConfirmDeleteId(null);
    startTransition(async () => {
      const res = await deleteSalesInvoice(id);
      if (!res.success) alert(res.error || 'Delete failed');
    });
  };

  const handleStatusChange = (id: string, status: string) => {
    startTransition(async () => {
      const res = await updateSalesInvoiceStatus(id, status);
      if (!res.success) alert(res.error || 'Failed to update status');
    });
  };

  const s = (id: string) => STATUS_STYLES[id] || STATUS_STYLES['Draft'];

  return (
    <div className={`invoice-list-container ${expandedId ? 'has-expanded' : ''}`}>
      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="confirm-dialog">
            <div className="confirm-icon">⚠️</div>
            <h3>{lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}</h3>
            <p className="text-sub">
              {lang === 'ar' 
                ? 'سيتم حذف الفاتورة وعكس حركات المخزون والقيد المحاسبي نهائياً.' 
                : 'This will permanently delete the invoice and reverse all inventory and accounting entries.'}
            </p>
            <div className="confirm-actions">
              <button className="btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button className="btn-danger" onClick={() => handleDelete(confirmDeleteId)}>
                {lang === 'ar' ? 'حذف نهائياً' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">{lang === 'ar' ? 'فواتير المبيعات' : 'Sales Invoices'}</h2>
          {canAccess('invoices', 'create') && (
            <button className="btn-primary" onClick={onNewInvoice}>
              {lang === 'ar' ? '+ فاتورة جديدة' : '+ New Invoice'}
            </button>
          )}
        </div>

        <div className="filter-bar no-print" style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder={lang === 'ar' ? 'بحث برقم الفاتورة أو العميل...' : 'Search by invoice # or customer...'} 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ddd', minWidth: '160px' }}
          >
            <option value="all">{lang === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="table-container">
          <table className="invoice-list-table">
            <thead className={expandedId ? 'no-print' : ''}>
              <tr>
                <th>{lang === 'ar' ? 'الرقم' : 'Number'}</th>
                <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th>{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Net Total'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="no-print" style={{ width: '120px', textAlign: 'center' }}>
                  {lang === 'ar' ? 'إجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    {lang === 'ar' ? 'لا توجد فواتير مبيعات' : 'No sales invoices found'}
                  </td>
                </tr>
              )}
              {filtered.map((inv: any) => {
                const dateObj = new Date(inv.date);
                const createdAtObj = new Date(inv.createdAt);
                const timeStr = createdAtObj.toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <React.Fragment key={inv.id}>
                    <tr 
                      className={expandedId ? 'no-print' : ''}
                      style={{ 
                        cursor: 'pointer',
                        background: expandedId === inv.id ? '#f8fafc' : 'transparent',
                        opacity: isPending ? 0.6 : 1,
                        transition: 'background 0.2s'
                      }}
                    >
                      <td onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}>
                        <strong style={{ color: '#6366f1' }}>{inv.invoiceNumber}</strong>
                      </td>
                      <td className="text-sub" onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span>{mounted ? dateObj.toLocaleDateString() : '...'}</span>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{mounted ? timeStr : '...'}</span>
                        </div>
                      </td>
                      <td onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}>
                      <div style={{ fontWeight: 600 }}>{lang === 'ar' && inv.customer.nameAr ? inv.customer.nameAr : inv.customer.name}</div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }} onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}>
                      {inv.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span 
                        className="badge"
                        style={{ 
                          background: s(inv.status).bg, 
                          color: s(inv.status).color,
                          border: 'none',
                          padding: '0.25rem 0.7rem',
                          fontSize: '0.75rem',
                          borderRadius: '12px'
                        }}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="no-print" style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button
                          title={lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                          className="action-icon-btn view"
                          onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        {canAccess('invoices', 'edit') && (
                          <button
                            title={lang === 'ar' ? 'تعديل الفاتورة' : 'Edit Invoice'}
                            className="action-icon-btn edit"
                            onClick={() => onEditInvoice && onEditInvoice(inv)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                        )}
                          <button
                            title={lang === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}
                            className="action-icon-btn print"
                            onClick={() => {
                              setExpandedId(inv.id);
                              setTimeout(() => window.print(), 100);
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                          </button>
                        {canAccess('invoices', 'delete') && (
                          <button
                            title={lang === 'ar' ? 'حذف الفاتورة' : 'Delete Invoice'}
                            className="action-icon-btn delete"
                            onClick={() => setConfirmDeleteId(inv.id)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expandable Details Row */}
                  {expandedId === inv.id && (
                    <tr key={`${inv.id}-details`} className="invoice-details-tr">
                      <td colSpan={6} style={{ padding: 0, background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                        <div style={{ padding: '1.25rem 2rem' }}>
                          {/* Print Header for single invoice */}
                          <div className="print-report-header invoice-specific-header" style={{ display: 'none' }}>
                             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #333', paddingBottom: '1.5rem' }}>
                                {companyProfile?.logo && (
                                   <img src={companyProfile.logo} alt="Logo" style={{ height: '100px', objectFit: 'contain', marginBottom: '1.5rem' }} />
                                )}
                                <div style={{ textAlign: 'center' }}>
                                   <h2 style={{ fontSize: '24px', margin: 0, fontWeight: '800' }}>{lang === 'ar' ? companyProfile?.nameAr : companyProfile?.name}</h2>
                                   <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '6px', fontSize: '12px', color: '#444' }}>
                                      {companyProfile?.taxNumber && <span>{lang === 'ar' ? 'الرقم الضريبي:' : 'Tax No:'} {companyProfile.taxNumber}</span>}
                                      {companyProfile?.email && <span>{companyProfile.email}</span>}
                                      {companyProfile?.phone && <span>{companyProfile.phone}</span>}
                                   </div>
                                </div>

                                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                   <h1 style={{ fontSize: '26px', color: '#1e293b', margin: 0, letterSpacing: '1px' }}>{lang === 'ar' ? 'فاتورة ضريبية' : 'Tax Invoice'}</h1>
                                   <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '4px 0' }}>#{inv.invoiceNumber}</p>
                                   <div style={{ fontSize: '13px', color: '#64748b' }}>
                                      {lang === 'ar' ? 'التاريخ:' : 'Date:'} {new Date(inv.date).toLocaleDateString()}
                                   </div>
                                </div>
                             </div>
                             
                             <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
                                <div style={{ width: '40%', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                   <strong style={{ fontSize: '13px', borderBottom: '2px solid #6366f1', paddingBottom: '2px', display: 'inline-block', marginBottom: '8px', color: '#6366f1' }}>
                                      {lang === 'ar' ? 'العميل:' : 'Bill To:'}
                                   </strong>
                                   <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>{lang === 'ar' && inv.customer.nameAr ? inv.customer.nameAr : inv.customer.name}</div>
                                   <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{inv.customer.taxNumber ? `${lang === 'ar' ? 'الرقم الضريبي للعميل:' : 'Customer Tax No:'} ${inv.customer.taxNumber}` : ''}</div>
                                </div>
                             </div>
                          </div>

                          <h4 className="no-print" style={{ margin: '0 0 1rem', color: '#1e293b', fontSize: '0.875rem', fontWeight: 700 }}>
                            {lang === 'ar' ? `تفاصيل الفاتورة: ${inv.invoiceNumber}` : `Invoice Details: ${inv.invoiceNumber}`}
                          </h4>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                              <tr style={{ background: '#e2e8f0' }}>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>{lang === 'ar' ? 'الصنف' : 'Product'}</th>
                                <th style={{ padding: '0.5rem', textAlign: 'right' }}>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                                <th style={{ padding: '0.5rem', textAlign: 'right' }}>{lang === 'ar' ? 'سعر الوحدة' : 'Unit Price'}</th>
                                <th style={{ padding: '0.5rem', textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inv.items.map((item: any, idx: number) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                  <td style={{ padding: '0.5rem' }}>
                                    {lang === 'ar' && item.product.nameAr ? item.product.nameAr : item.product.name}
                                  </td>
                                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{item.quantity}</td>
                                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                  <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600 }}>{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan={3} style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 700 }}>{lang === 'ar' ? 'الإجمالي الصافي:' : 'Net Total:'}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 900, color: '#6366f1' }}>{inv.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .invoice-list-container { color: inherit; }
        .invoice-list-table th { color: var(--text-secondary) !important; border-bottom: 1px solid var(--glass-border); text-align: right; }
        .invoice-list-table td { border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .action-icon-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .action-icon-btn.view { background: #f0f9ff; border-color: #bae6fd; color: #0284c7; }
        .action-icon-btn.view:hover { background: #0284c7; color: white; }
        .action-icon-btn.edit { background: #fefce8; border-color: #fde047; color: #ca8a04; }
        .action-icon-btn.edit:hover { background: #ca8a04; color: white; }
        .action-icon-btn.print { background: #f0fdf4; border-color: #86efac; color: #166534; }
        .action-icon-btn.print:hover { background: #166534; color: white; }
        .action-icon-btn.delete { background: #fff1f2; border-color: #fca5a5; color: #dc2626; }
        .action-icon-btn.delete:hover { background: #dc2626; color: white; }
        .confirm-dialog { background: white; border-radius: 16px; padding: 2.5rem; max-width: 440px; width: 100%; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
        .confirm-icon { font-size: 3rem; margin-bottom: 1rem; }
        .confirm-dialog h3 { margin: 0 0 0.75rem; font-size: 1.25rem; color: #1e293b; }
        .confirm-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }
        .btn-danger { background: #dc2626; color: white; border: none; padding: 0.625rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-danger:hover { background: #b91c1c; }
        
        @media print {
          .invoice-details-tr td { background: white !important; color: black !important; }
          .invoice-specific-header h2, .invoice-specific-header h1, .invoice-specific-header p { color: black !important; }
        }
      `}</style>
    </div>
  );
}

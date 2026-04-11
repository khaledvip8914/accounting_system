'use client';

import React, { useState, useTransition } from 'react';
import { deletePurchaseInvoice, updatePurchaseInvoiceStatus } from './actions';

const STATUS_OPTIONS = ['Draft', 'Paid', 'Partially Paid', 'Overdue'];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Paid: { bg: '#dcfce7', color: '#166534' },
  Draft: { bg: '#f3f4f6', color: '#4b5563' },
  'Partially Paid': { bg: '#fef9c3', color: '#854d0e' },
  Overdue: { bg: '#fee2e2', color: '#991b1b' },
};

export default function PurchaseInvoiceList({
  invoices,
  lang,
  dict,
  onNewInvoice,
  onEditInvoice,
  companyProfile
}: {
  invoices: any[],
  lang: string,
  dict: any,
  onNewInvoice?: () => void,
  onEditInvoice?: (invoice: any) => void,
  companyProfile: any
}) {
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
    const term = (searchTerm || '').toLowerCase();
    const invNum = (i?.invoiceNumber || '').toLowerCase();
    const suppName = (i?.supplier?.name || '').toLowerCase();
    const suppNameAr = (i?.supplier?.nameAr || '').toLowerCase();

    const matchSearch = invNum.includes(term) ||
      suppName.includes(term) ||
      suppNameAr.includes(term);

    const matchStatus = filterStatus === 'all' || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDelete = (id: string) => {
    setConfirmDeleteId(null);
    startTransition(async () => {
      const res = await deletePurchaseInvoice(id);
      if (!res.success) alert(res.error || 'Delete failed');
    });
  };

  const sStyle = (id: string) => STATUS_STYLES[id] || STATUS_STYLES['Draft'];

  return (
    <div className={`purchase-invoices-module ${expandedId ? 'has-expanded' : ''}`}>
      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="confirm-dialog">
            <div className="confirm-icon">⚠️</div>
            <h3>{lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}</h3>
            <p className="text-sub">
              {lang === 'ar'
                ? 'سيتم حذف فاتورة الشراء وعكس حركات المخزون والقيد المحاسبي نهائياً.'
                : 'This will permanently delete the purchase and reverse all inventory and accounting entries.'}
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
          <h2 className="card-title">{lang === 'ar' ? 'فواتير المشتريات' : 'Purchase Invoices'}</h2>
          {onNewInvoice && (
            <button className="btn-primary no-print" style={{ background: '#059669' }} onClick={onNewInvoice}>
              {lang === 'ar' ? '+ فاتورة شراء جديدة' : '+ New Purchase'}
            </button>
          )}
        </div>

        <div className="filter-bar no-print" style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder={lang === 'ar' ? 'البحث برقم الفاتورة أو المورد...' : 'Search invoice # or supplier...'}
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
          <table className="purchase-list-table">
            <thead className={expandedId ? 'no-print' : ''}>
              <tr>
                <th>{lang === 'ar' ? 'الرقم' : 'Number'}</th>
                <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th>{lang === 'ar' ? 'المورد' : 'Supplier'}</th>
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
                    {lang === 'ar' ? 'لا توجد فواتير مشتريات' : 'No purchase invoices found'}
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
                        <strong style={{ color: '#059669' }}>{inv.invoiceNumber}</strong>
                      </td>
                      <td className="text-sub" onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span>{mounted ? dateObj.toLocaleDateString() : '...'}</span>
                          <span style={{ fontSize: '0.7rem', color: '#94a3af' }}>{mounted ? timeStr : '...'}</span>
                        </div>
                      </td>
                      <td onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}>
                        <div style={{ fontWeight: 600 }}>{lang === 'ar' && inv.supplier.nameAr ? inv.supplier.nameAr : inv.supplier.name}</div>
                      </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }} onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}>
                      {inv.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className="badge"
                        style={{
                          background: sStyle(inv.status).bg,
                          color: sStyle(inv.status).color,
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
                        <button
                          title={lang === 'ar' ? 'تعديل الفاتورة' : 'Edit Invoice'}
                          className="action-icon-btn edit"
                          onClick={() => onEditInvoice && onEditInvoice(inv)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
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
                        <button
                          title={lang === 'ar' ? 'حذف الفاتورة' : 'Delete Invoice'}
                          className="action-icon-btn delete"
                          onClick={() => setConfirmDeleteId(inv.id)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded details */}
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
                                   <h1 style={{ fontSize: '26px', color: '#1e293b', margin: 0, letterSpacing: '1px' }}>{lang === 'ar' ? 'فاتورة شراء' : 'Purchase Invoice'}</h1>
                                   <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '4px 0' }}>#{inv.invoiceNumber}</p>
                                   <div style={{ fontSize: '13px', color: '#64748b' }}>
                                      {lang === 'ar' ? 'التاريخ:' : 'Date:'} {new Date(inv.date).toLocaleDateString()}
                                   </div>
                                </div>
                             </div>
                             
                             <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
                                <div style={{ width: '40%', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                   <strong style={{ fontSize: '13px', borderBottom: '2px solid #059669', paddingBottom: '2px', display: 'inline-block', marginBottom: '8px', color: '#059669' }}>
                                      {lang === 'ar' ? 'المورد:' : 'Supplier:'}
                                   </strong>
                                   <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>{lang === 'ar' && inv.supplier.nameAr ? inv.supplier.nameAr : inv.supplier.name}</div>
                                   <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{inv.supplier.taxNumber ? `${lang === 'ar' ? 'الرقم الضريبي للمورد:' : 'Supplier Tax No:'} ${inv.supplier.taxNumber}` : ''}</div>
                                </div>
                             </div>
                          </div>

                          <h4 className="no-print" style={{ margin: '0 0 1rem', color: '#065f46', fontSize: '0.875rem', fontWeight: 700 }}>
                            {lang === 'ar' ? `تفاصيل فاتورة الشراء: ${inv.invoiceNumber}` : `Purchase Details: ${inv.invoiceNumber}`}
                          </h4>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                              <tr style={{ background: '#d1fae5' }}>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>{lang === 'ar' ? 'الصنف' : 'Product'}</th>
                                <th style={{ padding: '0.5rem', textAlign: 'right' }}>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                                <th style={{ padding: '0.5rem', textAlign: 'right' }}>{lang === 'ar' ? 'سعر التكلفة' : 'Cost Price'}</th>
                                <th style={{ padding: '0.5rem', textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inv.items.map((item: any, idx: number) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #ecfdf5' }}>
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
                                <td colSpan={3} style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 700 }}>
                                  {lang === 'ar' ? 'الإجمالي الصافي:' : 'Net Total:'}
                                </td>
                                <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 900, color: '#059669' }}>
                                  {inv.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR
                                </td>
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
        .purchase-invoices-module { color: inherit; }
        .card-title { color: inherit !important; margin-bottom: 2rem; font-weight: 800; font-size: 1.5rem; }
        .purchase-list-table th { 
          color: var(--text-secondary) !important; 
          border-bottom: 1px solid var(--glass-border); 
          text-align: right;
          background: rgba(255, 255, 255, 0.03);
          padding: 1.25rem 1rem;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }
        .purchase-list-table td { 
          border-bottom: 1px solid rgba(255, 255, 255, 0.05); 
          padding: 1rem;
        }
        .action-icon-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .action-icon-btn.view { background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.2); color: #60a5fa; }
        .action-icon-btn.view:hover { background: #3b82f6; color: white; }
        .action-icon-btn.edit { background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .action-icon-btn.edit:hover { background: #f59e0b; color: white; }
        .action-icon-btn.print { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); color: #34d399; }
        .action-icon-btn.print:hover { background: #10b881; color: white; }
        .action-icon-btn.delete { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: #f87171; }
        .action-icon-btn.delete:hover { background: #ef4444; color: white; }
        .text-sub { color: var(--text-secondary); }
        .confirm-dialog { background: #1e293b; border-radius: 16px; padding: 2.5rem; max-width: 440px; width: 100%; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); border: 1px solid rgba(255, 255, 255, 0.1); }
        .confirm-dialog h3 { color: white; margin-bottom: 1rem; }
        .confirm-dialog p { color: var(--text-secondary); }
        .confirm-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }
        .btn-danger { background: #dc2626; color: white; border: none; padding: 0.625rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .btn-danger:hover { background: #b91c1c; }
        
        @media print {
          .purchase-invoices-module { background: white !important; padding: 0 !important; }
          .purchase-invoices-module * { color: #000000 !important; }
          .no-print { display: none !important; }
          .purchase-list-table th { background: #f1f5f9 !important; border-bottom: 2px solid #000 !important; color: #000 !important; }
          .purchase-list-table td { border-bottom: 1px solid #e2e8f0 !important; color: #000 !important; }
          .invoice-details-tr td { background: white !important; color: black !important; }
          .invoice-specific-header h2, .invoice-specific-header h1, .invoice-specific-header p { color: black !important; }
        }
      `}</style>
    </div>
  );
}

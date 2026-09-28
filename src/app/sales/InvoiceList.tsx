'use client';

import React, { useState, useTransition } from 'react';
import { deleteSalesInvoice, updateSalesInvoiceStatus, createCreditNote } from './actions';
import { useUser } from '@/components/UserContext';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { generateZatcaQr } from '@/lib/zatca/qr-generator';
import PrintInvoiceModal from './PrintInvoiceModal';

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
  const { canAccess, subscriptionPlan } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [printInvoice, setPrintInvoice] = useState<any | null>(null);
  const [backgroundInvoice, setBackgroundInvoice] = useState<any | null>(null);
  const [isSendingWhatsapp, setIsSendingWhatsapp] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = (invoices || []).filter(i => {
    const s = (searchTerm || '').toLowerCase();
    const matchSearch = (i?.invoiceNumber || '').toLowerCase().includes(s) || 
      (i?.customer?.name || '').toLowerCase().includes(s) ||
      (i?.customer?.nameAr || '').toLowerCase().includes(s);
    const matchStatus = filterStatus === 'all' || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreditNote = async (id: string) => {
    startTransition(async () => {
      try {
        const res = await createCreditNote(id);
        if (res.success) {
          alert(lang === 'ar' ? 'تم إنشاء الإشعار الدائن كمسودة بنجاح! يمكنك مراجعته وتعديله من القائمة.' : 'Credit note draft created successfully! You can edit it from the list.');
          router.refresh();
        } else {
          alert(res.error || (lang === 'ar' ? 'فشل إنشاء الإشعار الدائن' : 'Failed to create credit note'));
        }
      } catch (e) {
        console.error(e);
      }
    });
  };

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
    <div className="invoice-list-container">
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

        <div className="table-container no-print">
          <table className="invoice-list-table">
            <thead>
              <tr>
                <th>{lang === 'ar' ? 'الرقم' : 'Number'}</th>
                <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th>{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Net Total'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'حالة ZATCA' : 'ZATCA Status'}</th>
                <th className="no-print" style={{ width: '180px', textAlign: 'center' }}>
                  {lang === 'ar' ? 'إجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
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
                      style={{ 
                        opacity: isPending ? 0.6 : 1,
                        transition: 'background 0.2s'
                      }}
                    >
                      <td>
                        <strong style={{ color: '#6366f1' }}>{inv.invoiceNumber}</strong>
                      </td>
                      <td className="text-sub">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span>{mounted ? dateObj.toLocaleDateString() : '...'}</span>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{mounted ? timeStr : '...'}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {lang === 'ar' 
                            ? (inv.customer?.nameAr || inv.customer?.name || 'عميل نقدي') 
                            : (inv.customer?.name || inv.customer?.nameAr || 'Cash Customer')}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '3px', flexWrap: 'wrap' }}>
                          {inv.paymentMethod && (
                            <span style={{ fontSize: '0.7rem', background: '#eff6ff', color: '#1d4ed8', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                              💳 {lang === 'ar' ? (inv.paymentMethod.nameAr || inv.paymentMethod.name) : inv.paymentMethod.name}
                            </span>
                          )}
                          {inv.notes && (
                            <span title={inv.notes} style={{ fontSize: '0.7rem', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', padding: '1px 6px', borderRadius: '4px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              📝 {inv.notes}
                            </span>
                          )}
                        </div>
                      </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {(inv.netAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR
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
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                        background: inv.zatcaStatus === 'Reported' || inv.zatcaStatus === 'Cleared' ? '#dcfce7' : '#f1f5f9',
                        color: inv.zatcaStatus === 'Reported' || inv.zatcaStatus === 'Cleared' ? '#166534' : '#475569'
                      }}>
                        {inv.zatcaStatus || (lang === 'ar' ? 'غير مسجلة' : 'Not Reported')}
                      </span>
                    </td>
                    <td className="no-print" style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button
                          title={lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                          className="action-icon-btn view"
                          onClick={() => setPrintInvoice(inv)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        {canAccess('invoices', 'edit') && inv.zatcaStatus !== 'Reported' && inv.zatcaStatus !== 'Cleared' && (
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
                            onClick={() => setPrintInvoice(inv)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                          </button>
                          <button
                            title={lang === 'ar' ? 'تحميل PDF' : 'Download PDF'}
                            className="action-icon-btn pdf"
                            onClick={() => {
                              setPrintInvoice(inv);
                              setTimeout(() => {
                                import('@/lib/pdf').then(m => m.generatePDF('invoice-print-area', `Invoice-${inv.invoiceNumber}.pdf`));
                              }, 800);
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                          </button>
                          {subscriptionPlan?.hasWhatsApp !== false && (
                          <button
                            title={lang === 'ar' ? 'إرسال عبر واتساب' : 'Send via WhatsApp'}
                            className="action-icon-btn whatsapp"
                            onClick={async () => {
                              if (!inv.customer?.phone) {
                                alert(lang === 'ar' ? 'العميل ليس لديه رقم هاتف' : 'Customer has no phone number');
                                return;
                              }
                              setIsSendingWhatsapp(inv.id);
                              setBackgroundInvoice(inv);
                              setTimeout(async () => {
                                try {
                                  const { generatePDFBlob } = await import('@/lib/pdf');
                                  const blob = await generatePDFBlob('invoice-print-area');
                                  if (!blob) throw new Error('فشل توليد الـ PDF (PDF generation failed)');
                                  
                                  const formData = new FormData();
                                  formData.append('phone', inv.customer?.phone || '');
                                  formData.append('message', lang === 'ar' 
                                        ? `مرحباً، مرفق فاتورتكم رقم ${inv.invoiceNumber} بصيغة PDF. شكراً لتعاملكم معنا.` 
                                        : `Hello, attached is your invoice ${inv.invoiceNumber} in PDF. Thank you.`);
                                  formData.append('file', blob, `Invoice-${inv.invoiceNumber}.pdf`);

                                  const res = await fetch('/api/settings/whatsapp/send', {
                                    method: 'POST',
                                    body: formData
                                  });
                                  
                                  const data = await res.json().catch(() => ({ error: 'فشل في قراءة رد السيرفر' }));
                                  if (!res.ok) throw new Error(await res.text());
                                
                                alert(lang === 'ar' ? 'تم إرسال الفاتورة عبر الواتساب بنجاح!' : 'Invoice sent via WhatsApp successfully!');
                              } catch (err: any) {
                                console.error(err);
                                let msg = lang === 'ar' ? 'حدث خطأ أثناء الإرسال.' : 'Error sending message.';
                                try {
                                    const parsed = JSON.parse(err.message);
                                    if (parsed.error) msg += '\n\n' + parsed.error;
                                } catch {
                                    if (err.message) msg += '\n\n' + err.message;
                                }
                                alert(msg);
                              } finally {
                                setIsSendingWhatsapp(null);
                                setBackgroundInvoice(null);
                                setPrintInvoice(null);
                              }
                              }, 1000);
                            }}
                            disabled={isSendingWhatsapp === inv.id}
                            style={{ opacity: isSendingWhatsapp === inv.id ? 0.5 : 1, color: '#25D366' }}
                          >
                            {isSendingWhatsapp === inv.id ? (
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spinner"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                            ) : (
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                            )}
                          </button>
                          )}
                        {canAccess('invoices', 'delete') && inv.zatcaStatus !== 'Reported' && inv.zatcaStatus !== 'Cleared' && (
                          <button
                            title={lang === 'ar' ? 'حذف الفاتورة' : 'Delete Invoice'}
                            className="action-icon-btn delete"
                            onClick={() => setConfirmDeleteId(inv.id)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          </button>
                        )}
                        {canAccess('invoices', 'create') && (inv.zatcaStatus === 'Reported' || inv.zatcaStatus === 'Cleared') && (
                          <button
                            title={lang === 'ar' ? 'إصدار إشعار دائن (مرتجع)' : 'Issue Credit Note (Return)'}
                            className="action-icon-btn return"
                            onClick={() => handleCreditNote(inv.id)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                          </button>
                        )}
                        <button
                          title={lang === 'ar' ? 'معاينة ZATCA XML' : 'Preview ZATCA XML'}
                          className="action-icon-btn"
                          style={{ background: '#f5f3ff', borderColor: '#c4b5fd', color: '#7c3aed' }}
                          onClick={async () => {
                            try {
                              const { processZatcaInvoiceAction } = await import('./actions');
                              const res = await processZatcaInvoiceAction(inv.id);
                              if (res.success) {
                                if (res.xml) {
                                  const xmlContent = atob(res.xml);
                                  const blob = new Blob([xmlContent], { type: 'text/xml' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `zatca_invoice_${inv.invoiceNumber}.xml`;
                                  a.click();
                                  URL.revokeObjectURL(url);
                                } else {
                                  alert(lang === 'ar' ? 'لم يتم توليد XML' : 'XML not generated');
                                }
                              } else {
                                alert(res.error || 'Failed to process ZATCA invoice');
                              }
                            } catch (e: any) {
                              alert(e.message);
                            }
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                </React.Fragment>
              );
            })}
            </tbody>
          </table>
        </div>
      {/* Print Modal */}
      {printInvoice && (
        <PrintInvoiceModal 
          invoice={printInvoice} 
          companyProfile={companyProfile} 
          lang={lang} 
          onClose={() => setPrintInvoice(null)} 
        />
      )}

      {/* Hidden Print Modal for WhatsApp Background Generation */}
      {backgroundInvoice && (
        <div style={{ display: 'none' }}>
          <PrintInvoiceModal 
            invoice={backgroundInvoice} 
            companyProfile={companyProfile} 
            lang={lang} 
            onClose={() => setBackgroundInvoice(null)} 
          />
        </div>
      )}
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
        .action-icon-btn.pdf { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
        .action-icon-btn.pdf:hover { background: #1d4ed8; color: white; }
        .action-icon-btn.return { background: #fdf4ff; border-color: #f5d0fe; color: #a21caf; }
        .action-icon-btn.return:hover { background: #a21caf; color: white; }
        .action-icon-btn.delete { background: #fff1f2; border-color: #fca5a5; color: #dc2626; }
        .action-icon-btn.delete:hover { background: #dc2626; color: white; }
        .confirm-dialog { background: white; border-radius: 16px; padding: 2.5rem; max-width: 440px; width: 100%; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
        .confirm-icon { font-size: 3rem; margin-bottom: 1rem; }
        .confirm-dialog h3 { margin: 0 0 0.75rem; font-size: 1.25rem; color: #1e293b; }
        .confirm-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }
        .btn-danger { background: #dc2626; color: white; border: none; padding: 0.625rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-danger:hover { background: #b91c1c; }
      `}</style>
    </div>
  );
}

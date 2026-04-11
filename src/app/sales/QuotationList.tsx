'use client';

import { useState } from 'react';
import { deleteSalesQuotation, deleteAllQuotations, convertQuotationToInvoice } from './actions';
import { generatePDF, sharePDF } from '@/lib/pdf';

function QuotationPrintView({ q, companyProfile, lang }: { q: any, companyProfile: any, lang: string }) {
  if (!q) return null;
  return (
    <div className="quotation-print-content">
      <div className="print-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '2px solid #854d0e', paddingBottom: '1rem' }}>
         <div className="header-left">
            {companyProfile?.logo && <img src={companyProfile.logo} alt="Logo" style={{ height: '70px' }} />}
            <div style={{ marginTop: '0.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', margin: '0' }}>{lang === 'ar' ? companyProfile?.nameAr : companyProfile?.name}</h2>
                <p style={{ fontSize: '0.8rem', margin: '0' }}>{companyProfile?.taxNumber && `${lang === 'ar' ? 'الرقم الضريبي:' : 'VAT:'} ${companyProfile.taxNumber}`}</p>
            </div>
         </div>
         <div className="header-right text-right">
            <h1 style={{ color: '#854d0e', margin: '0', fontSize: '2rem' }}>{lang === 'ar' ? 'عــرض ســعــر' : 'SALES QUOTATION'}</h1>
            <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>{q.quotationNumber}</p>
         </div>
      </div>

      <div className="print-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
         <div className="info-section">
            <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>{lang === 'ar' ? 'العميل:' : 'Customer:'}</h3>
            <p style={{ fontWeight: 'bold', margin: '0.5rem 0' }}>{lang === 'ar' ? q.customer?.nameAr || q.customer?.name : q.customer?.name}</p>
            {q.customer?.phone && <p style={{ fontSize: '0.9rem', margin: '0' }}>{q.customer.phone}</p>}
            {q.customer?.address && <p style={{ fontSize: '0.9rem', margin: '0' }}>{q.customer.address}</p>}
         </div>
         <div className="info-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
               <span>{lang === 'ar' ? 'التاريخ:' : 'Date:'}</span>
               <span style={{ fontWeight: 'bold' }}>{new Date(q.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span>
            </div>
            {q.validUntil && (
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{lang === 'ar' ? 'صالح حتى:' : 'Valid Until:'}</span>
                  <span style={{ fontWeight: 'bold' }}>{new Date(q.validUntil).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span>
               </div>
            )}
         </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
        <thead>
          <tr style={{ background: '#fefce8', borderBottom: '2px solid #854d0e' }}>
            <th style={{ padding: '0.75rem', textAlign: 'center' }}>#</th>
            <th style={{ padding: '0.75rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'الصنف' : 'Product'}</th>
            <th style={{ padding: '0.75rem', textAlign: 'center' }}>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
            <th style={{ padding: '0.75rem', textAlign: 'center' }}>{lang === 'ar' ? 'سعر الوحدة' : 'Unit Price'}</th>
            <th style={{ padding: '0.75rem', textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
          </tr>
        </thead>
        <tbody>
          {q.items?.map((item: any, idx: number) => (
            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem', textAlign: 'center' }}>{idx + 1}</td>
              <td style={{ padding: '0.75rem' }}>
                <div style={{ fontWeight: 'bold' }}>{lang === 'ar' ? item.product?.nameAr || item.product?.name : item.product?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>{item.product?.sku}</div>
              </td>
              <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.quantity} {item.product?.unit}</td>
              <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.unitPrice.toLocaleString()}</td>
              <td style={{ padding: '0.75rem', textAlign: 'right' }}>{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="print-footer" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
         <div className="footer-notes">
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{lang === 'ar' ? 'ملاحظات وشروط:' : 'Notes & Terms:'}</p>
            <div style={{ fontSize: '0.85rem', color: '#444', lineHeight: '1.6' }}>
                {lang === 'ar' ? '- يسري هذا العرض للمدة المذكورة أعلاه.' : '- This quotation is valid for the period mentioned above.'}<br/>
                {lang === 'ar' ? '- الأسعار تشمل ضريبة القيمة المضافة 15٪.' : '- Prices include 15% VAT.'}<br/>
                {lang === 'ar' ? '- نشكركم على ثقتكم بنا.' : '- Thank you for your business.'}
            </div>
         </div>
         <div className="footer-totals">
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
               <span>{lang === 'ar' ? 'المجموع:' : 'Subtotal:'}</span>
               <span>{q.totalAmount.toLocaleString()}</span>
            </div>
            {q.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span>{lang === 'ar' ? 'الخصم:' : 'Discount:'}</span>
                    <span style={{ color: '#dc2626' }}>-{q.discount.toLocaleString()}</span>
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
               <span>{lang === 'ar' ? 'الضريبة (15%):' : 'VAT (15%):'}</span>
               <span>{q.taxAmount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '2px solid #854d0e', marginTop: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem', color: '#854d0e' }}>
               <span>{lang === 'ar' ? 'إجمالي العرض:' : 'Total Quote:'}</span>
               <span>{q.netAmount.toLocaleString()} {lang === 'ar' ? 'ر.س' : 'SAR'}</span>
            </div>
         </div>
      </div>
    </div>
  );
}

export default function QuotationList({ 
  quotations, 
  lang, 
  onNewQuotation, 
  onEditQuotation,
  companyProfile,
  accounts
}: { 
  quotations: any[], 
  lang: string, 
  onNewQuotation: () => void,
  onEditQuotation: (q: any) => void,
  companyProfile: any,
  accounts: any[]
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [printingQuotation, setPrintingQuotation] = useState<any | null>(null);
  const [viewingQuotation, setViewingQuotation] = useState<any | null>(null);
  const [conversionDialog, setConversionDialog] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'credit'>('cash');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = (quotations || []).filter(q => {
    const s = (searchTerm || '').toLowerCase();
    return (
      (q?.quotationNumber || '').toLowerCase().includes(s) ||
      (q?.customer?.name || '').toLowerCase().includes(s) ||
      (q?.customer?.nameAr || '').toLowerCase().includes(s)
    );
  });

  const handleDelete = async (id: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من حذف عرض السعر؟' : 'Are you sure you want to delete this quotation?')) {
      const res = await deleteSalesQuotation(id);
      if (res.success) {
          alert(lang === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
      } else {
          alert(lang === 'ar' ? `فشل الحذف: ${res.error}` : `Delete failed: ${res.error}`);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (confirm(lang === 'ar' ? 'تحذير: سيتم حذف كافة عروض الأسعار المسجلة! هل تود الاستمرار؟' : 'Warning: All quotations will be deleted! Do you want to proceed?')) {
        setIsSubmitting(true);
        const res = await deleteAllQuotations();
        setIsSubmitting(false);
        if (res.success) {
            alert(lang === 'ar' ? 'تم حذف كافة عروض الأسعار بنجاح' : 'All quotations deleted successfully');
        } else {
            alert(lang === 'ar' ? `فشل الحذف: ${res.error}` : `Failed: ${res.error}`);
        }
    }
  };

  const handlePrint = (q: any) => {
    setPrintingQuotation(q);
    setTimeout(() => {
      window.print();
      setPrintingQuotation(null);
    }, 100);
  };

  const handleWhatsApp = (q: any) => {
    const phone = q.customer.phone?.replace(/[^0-9]/g, '');
    if (!phone) {
      alert(lang === 'ar' ? 'العميل لا يملك رقم هاتف مسجل!' : 'Customer has no registered phone number!');
      return;
    }
    const text = encodeURIComponent(
      lang === 'ar' 
        ? `السلام عليكم، عرض السعر الخاص بكم رقم ${q.quotationNumber} جاهز للإطلاع. الإجمالي: ${q.netAmount.toLocaleString()} ر.س` 
        : `Hello, your quotation #${q.quotationNumber} is ready. Total: ${q.netAmount.toLocaleString()} SAR`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleEmail = (q: any) => {
    const email = q.customer.email;
    if (!email) {
      alert(lang === 'ar' ? 'العميل لا يملك بريد إلكتروني مسجل!' : 'Customer has no registered email!');
      return;
    }
    const subject = encodeURIComponent(lang === 'ar' ? `عرض سعر - ${q.quotationNumber}` : `Sales Quotation - ${q.quotationNumber}`);
    const body = encodeURIComponent(
      lang === 'ar'
        ? `تحية طيبة، مرفق لكم تفاصيل عرض السعر رقم ${q.quotationNumber}.\n\nالمجموع: ${q.netAmount} ر.س`
        : `Greetings, find below the details for quotation #${q.quotationNumber}.\n\nTotal: ${q.netAmount} SAR`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleDownloadPDF = async (q: any) => {
    setIsSubmitting(true);
    await generatePDF('quotation-print-area', `Quotation_${q.quotationNumber}`);
    setIsSubmitting(false);
  };

  const handleSharePDF = async (q: any) => {
    setIsSubmitting(true);
    const title = lang === 'ar' ? `عرض سعر - ${q.quotationNumber}` : `Sales Quotation - ${q.quotationNumber}`;
    const text = lang === 'ar' ? 'يرجى الإطلاع على عرض السعر المرفق' : 'Please find the attached quotation';
    await sharePDF('quotation-print-area', q.quotationNumber, title, text);
    setIsSubmitting(false);
  };

  const handleConvert = async () => {
    if (!conversionDialog) return;
    if (paymentMethod !== 'credit' && !selectedAccountId) {
      alert(lang === 'ar' ? 'يرجى اختيار حساب الدفع' : 'Please select a payment account');
      return;
    }

    setIsSubmitting(true);
    const res = await convertQuotationToInvoice(conversionDialog.id, {
      paymentType: paymentMethod === 'credit' ? 'credit' : 'paid',
      receiptAccountId: paymentMethod === 'credit' ? null : selectedAccountId
    });
    
    setIsSubmitting(false);
    if (res.success) {
      setConversionDialog(null);
      alert(lang === 'ar' ? 'تم تحويل عرض السعر إلى فاتورة بنجاح' : 'Quotation converted to invoice successfully');
    } else {
      alert(lang === 'ar' ? `خطأ: ${res.error}` : `Error: ${res.error}`);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Draft': return { bg: '#f1f5f9', color: '#64748b' };
      case 'Sent': return { bg: '#eff6ff', color: '#2563eb' };
      case 'Accepted': return { bg: '#f0fdf4', color: '#166534' };
      case 'Rejected': return { bg: '#fef2f2', color: '#991b1b' };
      case 'Converted': return { bg: '#fefce8', color: '#854d0e' };
      default: return { bg: '#f1f5f9', color: '#64748b' };
    }
  };

  const cashAccounts = (accounts || []).filter(a => a.type === 'Asset' && ((a.name || '').includes('Cash') || (a.nameAr || '').includes('نقد') || (a.code || '').startsWith('1101')));
  const bankAccounts = (accounts || []).filter(a => a.type === 'Asset' && ((a.name || '').includes('Bank') || (a.nameAr || '').includes('بنك') || (a.code || '').startsWith('1102')));

  return (
    <div className="quotation-list-container">
      <div className="list-actions no-print">
        <div className="search-box">
          <input 
            type="text" 
            placeholder={lang === 'ar' ? 'بحث برقم العرض أو العميل...' : 'Search by number or customer...'} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" style={{ color: '#dc2626', borderColor: '#fca5a5' }} onClick={handleDeleteAll}>
                {lang === 'ar' ? '🗑️ حذف الكل' : '🗑️ Delete All'}
            </button>
            <button className="btn-primary" onClick={onNewQuotation}>
                {lang === 'ar' ? '+ عرض سعر جديد' : '+ New Quotation'}
            </button>
        </div>
      </div>

      <div className="table-responsive no-print">
        <table className="data-table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'رقم العرض' : 'Quo #'}</th>
              <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
              <th>{lang === 'ar' ? 'العميل' : 'Customer'}</th>
              <th>{lang === 'ar' ? 'المستودع' : 'Warehouse'}</th>
              <th>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((q) => (
              <tr key={q.id}>
                <td className="font-mono">{q.quotationNumber}</td>
                <td>{new Date(q.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</td>
                <td className="font-bold">{lang === 'ar' ? q.customer.nameAr || q.customer.name : q.customer.name}</td>
                <td>{q.warehouse?.nameAr || q.warehouse?.name || '-'}</td>
                <td className="font-bold text-right">{q.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td>
                  <span className="status-badge" style={{ 
                    backgroundColor: getStatusStyle(q.status).bg,
                    color: getStatusStyle(q.status).color
                  }}>
                    {q.status === 'Draft' ? (lang === 'ar' ? 'مسودة' : 'Draft') :
                     q.status === 'Sent' ? (lang === 'ar' ? 'مرسل' : 'Sent') :
                     q.status === 'Accepted' ? (lang === 'ar' ? 'مقبول' : 'Accepted') :
                     q.status === 'Rejected' ? (lang === 'ar' ? 'مرفوض' : 'Rejected') :
                     q.status === 'Converted' ? (lang === 'ar' ? 'تم التحويل' : 'Converted') : q.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn" onClick={() => setViewingQuotation(q)} title={lang === 'ar' ? 'عرض مسبق' : 'Preview'}>👁️</button>
                    <button className="icon-btn" onClick={() => handlePrint(q)} title={lang === 'ar' ? 'طباعة' : 'Print'}>📊</button>
                    <button className="icon-btn whatsapp" onClick={() => handleWhatsApp(q)} title={lang === 'ar' ? 'واتساب' : 'WhatsApp'}>💬</button>
                    <button className="icon-btn email" onClick={() => handleEmail(q)} title={lang === 'ar' ? 'إيميل' : 'Email'}>📧</button>
                    {q.status !== 'Converted' && (
                        <>
                            <button className="icon-btn" onClick={() => setConversionDialog(q)} title={lang === 'ar' ? 'تحويل لفاتورة' : 'Convert to Invoice'}>🔄</button>
                            <button className="icon-btn" onClick={() => onEditQuotation(q)} title={lang === 'ar' ? 'تعديل' : 'Edit'}>✏️</button>
                            <button className="icon-btn delete" onClick={() => handleDelete(q.id)} title={lang === 'ar' ? 'حذف' : 'Delete'}>🗑️</button>
                        </>
                    )}
                    {q.status === 'Converted' && q.convertedTo && (
                        <span className="converted-link" title={lang === 'ar' ? 'تم التحويل لفاتورة' : 'Converted to Invoice'}>
                            #{q.convertedTo.invoiceNumber}
                        </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {viewingQuotation && (
        <div className="modal-overlay no-print">
          <div className="modal-content large" style={{ background: '#f8fafc', overflowY: 'auto', maxHeight: '90vh' }}>
            <div className="modal-header">
                <h3>{lang === 'ar' ? 'عرض مسبق لعرض السعر' : 'Quotation Preview'}</h3>
                <button className="close-btn" onClick={() => setViewingQuotation(null)}>&times;</button>
            </div>
            <div id="quotation-print-area" style={{ padding: '2rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto' }}>
                <QuotationPrintView q={viewingQuotation} companyProfile={companyProfile} lang={lang} />
            </div>
            <div className="modal-footer" style={{ marginTop: '1.5rem', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn-secondary" onClick={() => setViewingQuotation(null)}>{lang === 'ar' ? 'إغلاق' : 'Close'}</button>
              <button className="btn-primary" onClick={() => { handlePrint(viewingQuotation); }}>
                🖨️ {lang === 'ar' ? 'طباعة' : 'Print'}
              </button>
              <button className="btn-share pdf" onClick={() => handleDownloadPDF(viewingQuotation)} disabled={isSubmitting}>
                📄 {isSubmitting ? '...' : (lang === 'ar' ? 'تحميل PDF' : 'Download PDF')}
              </button>
              <button className="btn-share share" onClick={() => handleSharePDF(viewingQuotation)} disabled={isSubmitting}>
                📤 {isSubmitting ? '...' : (lang === 'ar' ? 'مشاركة الملف' : 'Share File')}
              </button>
              <button className="btn-share whatsapp" onClick={() => handleWhatsApp(viewingQuotation)}>
                💬 {lang === 'ar' ? 'واتساب' : 'WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conversion Dialog */}
      {conversionDialog && (
        <div className="modal-overlay no-print">
          <div className="modal-content small">
            <h3>{lang === 'ar' ? 'تحويل إلى فاتورة مبيعات' : 'Convert to Sales Invoice'}</h3>
            <p style={{ margin: '1rem 0', color: '#64748b' }}>
                {lang === 'ar' ? `سيتم إنشاء فاتورة مبيعات جديدة بناءً على عرض السعر ${conversionDialog.quotationNumber}. يرجى اختيار تفاصيل الدفع:` 
                           : `A new sales invoice will be created based on quotation ${conversionDialog.quotationNumber}. Please select payment details:`}
            </p>
            <div className="payment-options">
                <label className="payment-option">
                    <input type="radio" name="payType" checked={paymentMethod === 'cash'} onChange={() => { setPaymentMethod('cash'); setSelectedAccountId(cashAccounts[0]?.id || ''); }} />
                    <div className="opt-box">
                        <span className="opt-icon">💵</span>
                        <span className="opt-label">{lang === 'ar' ? 'نقدي' : 'Cash'}</span>
                    </div>
                </label>
                <label className="payment-option">
                    <input type="radio" name="payType" checked={paymentMethod === 'bank'} onChange={() => { setPaymentMethod('bank'); setSelectedAccountId(bankAccounts[0]?.id || ''); }} />
                    <div className="opt-box">
                        <span className="opt-icon">🏦</span>
                        <span className="opt-label">{lang === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}</span>
                    </div>
                </label>
                <label className="payment-option">
                    <input type="radio" name="payType" checked={paymentMethod === 'credit'} onChange={() => { setPaymentMethod('credit'); setSelectedAccountId(''); }} />
                    <div className="opt-box">
                        <span className="opt-icon">⏳</span>
                        <span className="opt-label">{lang === 'ar' ? 'آجل' : 'On Credit'}</span>
                    </div>
                </label>
            </div>
            {paymentMethod !== 'credit' && (
                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label>{paymentMethod === 'cash' ? (lang === 'ar' ? 'صندوق النقدية' : 'Cash Account') : (lang === 'ar' ? 'الحساب البنكي' : 'Bank Account')}</label>
                    <select value={selectedAccountId} onChange={(e) => setSelectedAccountId(e.target.value)}>
                        <option value="">{lang === 'ar' ? 'اختر الحساب...' : 'Select account...'}</option>
                        {(paymentMethod === 'cash' ? cashAccounts : bankAccounts).map(acc => (
                            <option key={acc.id} value={acc.id}>
                                {acc.code} - {lang === 'ar' ? acc.nameAr || acc.name : acc.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div className="modal-footer">
              <button disabled={isSubmitting} className="btn-secondary" onClick={() => setConversionDialog(null)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button disabled={isSubmitting} className="btn-primary" onClick={handleConvert}>
                {isSubmitting ? (lang === 'ar' ? 'جاري التحويل...' : 'Converting...') : (lang === 'ar' ? 'تأكيد التحويل' : 'Confirm Conversion')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print View - Quotation Specific */}
      {printingQuotation && (
        <div className="print-view quotation-print">
            <QuotationPrintView q={printingQuotation} companyProfile={companyProfile} lang={lang} />
        </div>
      )}

      <style jsx>{`
        .quotation-list-container { color: inherit; }
        .list-actions { display: flex; justify-content: space-between; margin-bottom: 1.5rem; }
        .search-box input { padding: 0.5rem 1rem; border: 1px solid var(--glass-border); border-radius: 0.5rem; min-width: 300px; color: var(--text-primary); background: var(--glass-bg); }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { padding: 1rem; text-align: right; border-bottom: 1px solid var(--glass-border); color: var(--text-secondary); }
        .data-table td { padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .action-buttons { display: flex; gap: 0.4rem; }
        .icon-btn { transition: all 0.2s; padding: 0.4rem; border-radius: 0.4rem; border: 1px solid var(--glass-border); background: var(--glass-bg); cursor: pointer; font-size: 1rem; }
        .icon-btn:hover { background: var(--glass-hover); transform: translateY(-1px); }
        .icon-btn.delete:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
        .icon-btn.whatsapp:hover { color: #25d366; background: #dcfce7; border-color: #86efac; }
        .icon-btn.email:hover { color: #ef4444; background: #fee2e2; border-color: #fca5a5; }
        .converted-link { font-size: 0.75rem; color: #854d0e; background: #fefce8; padding: 0.25rem 0.5rem; border-radius: 0.3rem; border: 1px solid #fef08a; }

        .btn-share { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.25rem; border-radius: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .btn-share.whatsapp { background: #22c55e; color: white; }
        .btn-share.whatsapp:hover { background: #16a34a; transform: translateY(-1px); }
        .btn-share.pdf { background: #dc2626; color: white; }
        .btn-share.pdf:hover { background: #b91c1c; transform: translateY(-1px); }
        .btn-share.share { background: #6366f1; color: white; }
        .btn-share.share:hover { background: #4f46e5; transform: translateY(-1px); }
        .btn-share.email { background: #64748b; color: white; }
        .btn-share.email:hover { background: #475569; transform: translateY(-1px); }
        .payment-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
        .opt-box { cursor: pointer; border: 1px solid var(--glass-border); border-radius: 0.5rem; padding: 0.75rem; display: flex; flex-direction: column; align-items: center; background: var(--glass-bg); }
        .payment-option input { display: none; }
        .payment-option input:checked + .opt-box { border-color: var(--accent-primary); background: rgba(99,102,241,0.1); }
        
        @media print {
          .no-print { display: none !important; }
          .quotation-print { display: block !important; padding: 1cm; background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
}

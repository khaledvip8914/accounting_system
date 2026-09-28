'use client';

import { useState } from 'react';
import { deleteSalesQuotation, deleteAllQuotations, convertQuotationToInvoice } from './actions';
import { generatePDF, sharePDF } from '@/lib/pdf';
import { useUser } from '@/components/UserContext';

function QuotationPrintView({ q, companyProfile, lang }: { q: any, companyProfile: any, lang: string }) {
  if (!q) return null;
  return (
    <>
    <div className="invoice-paper" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #333', paddingBottom: '1.5rem' }}>
        {companyProfile?.logo && (
            <img src={companyProfile.logo} alt="Logo" style={{ height: '100px', objectFit: 'contain', marginBottom: '1.5rem' }} />
        )}
        <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', margin: 0, fontWeight: '800', color: '#000' }}>{lang === 'ar' ? companyProfile?.nameAr : companyProfile?.name}</h2>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '6px', fontSize: '14px', color: '#333' }}>
              {companyProfile?.taxNumber && <span>{lang === 'ar' ? 'الرقم الضريبي:' : 'Tax No:'} {companyProfile.taxNumber}</span>}
              {companyProfile?.email && <span>{companyProfile.email}</span>}
              {companyProfile?.phone && <span>{companyProfile.phone}</span>}
            </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '26px', color: '#000', margin: 0, letterSpacing: '1px' }}>{lang === 'ar' ? 'عــرض ســعــر' : 'Sales Quotation'}</h1>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0', color: '#000' }}>#{q.quotationNumber}</p>
            <div style={{ fontSize: '14px', color: '#444' }}>
              {lang === 'ar' ? 'التاريخ:' : 'Date:'} {new Date(q.date).toLocaleDateString()}
            </div>
            {q.validUntil && (
                <div style={{ fontSize: '14px', color: '#444', marginTop: '4px' }}>
                  {lang === 'ar' ? 'صالح حتى:' : 'Valid Until:'} <span suppressHydrationWarning>{new Date(q.validUntil).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span>
                </div>
            )}
        </div>
      </div>
      
      {/* Bill To */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
        <div style={{ width: '50%', textAlign: lang === 'ar' ? 'right' : 'left' }}>
            <strong style={{ fontSize: '15px', borderBottom: '2px solid #6366f1', paddingBottom: '4px', display: 'inline-block', marginBottom: '8px', color: '#6366f1' }}>
              {lang === 'ar' ? 'العميل:' : 'Bill To:'}
            </strong>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#000' }}>
              {lang === 'ar' 
                ? (q.customer?.nameAr || q.customer?.name || 'عميل نقدي') 
                : (q.customer?.name || q.customer?.nameAr || 'Cash Customer')}
            </div>
            <div style={{ fontSize: '14px', color: '#444', marginTop: '4px' }}>{q.customer?.taxNumber ? `${lang === 'ar' ? 'الرقم الضريبي للعميل:' : 'Customer Tax No:'} ${q.customer.taxNumber}` : ''}</div>
            {q.customer?.phone && <div style={{ fontSize: '14px', color: '#444', marginTop: '4px' }}>{q.customer.phone}</div>}
        </div>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'الصنف' : 'Product'}</th>
            <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
            <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'سعر الوحدة' : 'Unit Price'}</th>
            <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
          </tr>
        </thead>
        <tbody>
          {q.items?.map((item: any, idx: number) => (
            <tr key={idx}>
              <td style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                <div style={{ fontWeight: 'bold' }}>{lang === 'ar' ? item.product?.nameAr || item.product?.name : item.product?.name}</div>
              </td>
              <td style={{ textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right' }}>{item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="print-totals" style={{ marginLeft: lang === 'ar' ? '0' : 'auto', marginRight: lang === 'ar' ? 'auto' : '0' }}>
        <div className="totals-row">
          <span>{lang === 'ar' ? 'الإجمالي (بدون الضريبة):' : 'Total (Excl. VAT):'}</span>
          <span>{q.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'} SAR</span>
        </div>
        {q.discount > 0 && (
            <div className="totals-row">
                <span>{lang === 'ar' ? 'الخصم:' : 'Discount:'}</span>
                <span style={{ color: '#dc2626' }}>-{q.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR</span>
            </div>
        )}
        <div className="totals-row">
          <span>{lang === 'ar' ? 'قيمة الضريبة (15%):' : 'VAT Amount (15%):'}</span>
          <span>{q.taxAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'} SAR</span>
        </div>
        <div className="totals-row net-total">
          <span>{lang === 'ar' ? 'الإجمالي الشامل:' : 'Net Total:'}</span>
          <span>{q.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR</span>
        </div>
      </div>

      <div style={{ marginTop: '3rem', fontSize: '14px', color: '#444' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#000' }}>{lang === 'ar' ? 'ملاحظات وشروط:' : 'Notes & Terms:'}</p>
          <div>
              {lang === 'ar' ? '- يسري هذا العرض للمدة المذكورة أعلاه.' : '- This quotation is valid for the period mentioned above.'}<br/>
              {lang === 'ar' ? '- الأسعار تشمل ضريبة القيمة المضافة 15٪.' : '- Prices include 15% VAT.'}<br/>
              {lang === 'ar' ? '- نشكركم على ثقتكم بنا.' : '- Thank you for your business.'}
          </div>
      </div>
    </div>
    
    <style jsx>{`
      .invoice-paper {
        background: white;
        width: 100%;
        max-width: 800px;
        padding: 3rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        color: black;
      }
      .print-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 2rem;
        font-size: 14px;
      }
      .print-table th {
        background: #f8fafc;
        padding: 12px;
        border-bottom: 2px solid #cbd5e1;
        color: #334155;
        font-weight: 700;
      }
      .print-table td {
        padding: 12px;
        border-bottom: 1px solid #e2e8f0;
        color: #0f172a;
      }
      .print-totals {
        width: 350px;
        background: #f8fafc;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }
      .totals-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        color: #334155;
        font-weight: 600;
      }
      .net-total {
        border-top: 2px solid #cbd5e1;
        margin-top: 8px;
        padding-top: 12px;
        font-size: 1.25rem;
        font-weight: 800;
        color: #4f46e5;
      }
    `}</style>
    </>
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
  const { subscriptionPlan } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingQuotation, setViewingQuotation] = useState<any | null>(null);
  const [conversionDialog, setConversionDialog] = useState<any | null>(null);
  const [backgroundQuotation, setBackgroundQuotation] = useState<any | null>(null);
  const [isSendingWhatsapp, setIsSendingWhatsapp] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'credit'>('cash');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  const STATUS_OPTIONS = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Converted'];

  const filtered = (quotations || []).filter(q => {
    const s = (searchTerm || '').toLowerCase();
    const matchSearch = (
      (q?.quotationNumber || '').toLowerCase().includes(s) ||
      (q?.customer?.name || '').toLowerCase().includes(s) ||
      (q?.customer?.nameAr || '').toLowerCase().includes(s)
    );
    const matchStatus = filterStatus === 'all' || q.status === filterStatus;
    return matchSearch && matchStatus;
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

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = async (q: any) => {
    if (!q.customer?.phone) {
      alert(lang === 'ar' ? 'العميل لا يملك رقم هاتف مسجل!' : 'Customer has no registered phone number!');
      return;
    }
    setIsSendingWhatsapp(q.id);
    setBackgroundQuotation(q);
    setTimeout(async () => {
      try {
        const { generatePDFBlob } = await import('@/lib/pdf');
        const blob = await generatePDFBlob('quotation-print-area');
        if (!blob) throw new Error('فشل توليد الـ PDF (PDF generation failed)');
        
        const formData = new FormData();
        formData.append('phone', q.customer?.phone || '');
        formData.append('message', lang === 'ar' 
              ? `السلام عليكم، مرفق عرض السعر الخاص بكم رقم ${q.quotationNumber} بصيغة PDF. الإجمالي: ${q.netAmount.toLocaleString()} ر.س.` 
              : `Hello, attached is your quotation #${q.quotationNumber} in PDF. Total: ${q.netAmount.toLocaleString()} SAR.`);
        formData.append('file', blob, `Quotation-${q.quotationNumber}.pdf`);

        const res = await fetch('/api/settings/whatsapp/send', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error(await res.text());
        
        alert(lang === 'ar' ? 'تم إرسال عرض السعر عبر الواتساب بنجاح!' : 'Quotation sent via WhatsApp successfully!');
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
        setBackgroundQuotation(null);
      }
    }, 800);
  };

  const handleEmail = (q: any) => {
    const email = q.customer?.email;
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
    const { generatePDF } = await import('@/lib/pdf');
    await generatePDF('quotation-print-area', `Quotation_${q.quotationNumber}`);
    setIsSubmitting(false);
  };

  const handleSharePDF = async (q: any) => {
    setIsSubmitting(true);
    const title = lang === 'ar' ? `عرض سعر - ${q.quotationNumber}` : `Sales Quotation - ${q.quotationNumber}`;
    const text = lang === 'ar' ? 'يرجى الإطلاع على عرض السعر المرفق' : 'Please find the attached quotation';
    const { sharePDF } = await import('@/lib/pdf');
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
      <div className="card">
        <div className="card-header no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">{lang === 'ar' ? 'عروض الأسعار' : 'Quotations'}</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" style={{ color: '#dc2626', borderColor: '#fca5a5' }} onClick={handleDeleteAll}>
                {lang === 'ar' ? '🗑️ حذف الكل' : '🗑️ Delete All'}
            </button>
            <button className="btn-primary" onClick={onNewQuotation}>
                {lang === 'ar' ? '+ عرض سعر جديد' : '+ New Quotation'}
            </button>
          </div>
        </div>

        <div className="filter-bar no-print" style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder={lang === 'ar' ? 'بحث برقم العرض أو العميل...' : 'Search by quotation # or customer...'} 
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
              <th>{lang === 'ar' ? 'رقم العرض' : 'Quo #'}</th>
              <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
              <th>{lang === 'ar' ? 'العميل' : 'Customer'}</th>
              <th>{lang === 'ar' ? 'المستودع' : 'Warehouse'}</th>
              <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
              <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  {lang === 'ar' ? 'لا توجد عروض أسعار متطابقة' : 'No matching quotations found'}
                </td>
              </tr>
            )}
            {filtered.map((q) => (
              <tr key={q.id}>
                <td className="font-mono">{q.quotationNumber}</td>
                <td suppressHydrationWarning>{new Date(q.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</td>
                <td className="font-bold">
                  {lang === 'ar' 
                    ? (q.customer?.nameAr || q.customer?.name || 'عميل نقدي') 
                    : (q.customer?.name || q.customer?.nameAr || 'Cash Customer')}
                </td>
                <td>{q.warehouse?.nameAr || q.warehouse?.name || '-'}</td>
                <td className="font-bold" style={{ textAlign: 'right' }}>{q.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className="status-badge" style={{ 
                    backgroundColor: getStatusStyle(q.status).bg,
                    color: getStatusStyle(q.status).color,
                    padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600
                  }}>
                    {q.status === 'Draft' ? (lang === 'ar' ? 'مسودة' : 'Draft') :
                     q.status === 'Sent' ? (lang === 'ar' ? 'مرسل' : 'Sent') :
                     q.status === 'Accepted' ? (lang === 'ar' ? 'مقبول' : 'Accepted') :
                     q.status === 'Rejected' ? (lang === 'ar' ? 'مرفوض' : 'Rejected') :
                     q.status === 'Converted' ? (lang === 'ar' ? 'تم التحويل' : 'Converted') : q.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                    <button className="action-icon-btn view" onClick={() => setViewingQuotation(q)} title={lang === 'ar' ? 'عرض مسبق' : 'Preview'}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button className="action-icon-btn print" onClick={() => setViewingQuotation(q)} title={lang === 'ar' ? 'طباعة' : 'Print'}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    </button>
                    {subscriptionPlan?.hasWhatsApp !== false && (
                    <button 
                      className="action-icon-btn" 
                      onClick={() => handleWhatsApp(q)} 
                      title={lang === 'ar' ? 'واتساب' : 'WhatsApp'} 
                      disabled={isSendingWhatsapp === q.id}
                      style={{ opacity: isSendingWhatsapp === q.id ? 0.5 : 1, color: '#16a34a', background: '#dcfce7', borderColor: '#86efac' }}
                    >
                      {isSendingWhatsapp === q.id ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spinner"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      )}
                    </button>
                    )}
                    <button className="action-icon-btn" onClick={() => handleEmail(q)} title={lang === 'ar' ? 'إيميل' : 'Email'} style={{ color: '#0284c7', background: '#e0f2fe', borderColor: '#bae6fd' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </button>
                    {q.status !== 'Converted' && (
                        <>
                            <button className="action-icon-btn pdf" onClick={() => setConversionDialog(q)} title={lang === 'ar' ? 'تحويل لفاتورة' : 'Convert to Invoice'}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                            </button>
                            <button className="action-icon-btn edit" onClick={() => onEditQuotation(q)} title={lang === 'ar' ? 'تعديل' : 'Edit'}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button className="action-icon-btn delete" onClick={() => handleDelete(q.id)} title={lang === 'ar' ? 'حذف' : 'Delete'}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </>
                    )}
                    {q.status === 'Converted' && q.convertedTo && (
                        <span className="converted-link" title={lang === 'ar' ? 'تم التحويل لفاتورة' : 'Converted to Invoice'} style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
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
      </div>

      {/* Hidden Print Area for WhatsApp Background Generation */}
      {backgroundQuotation && (
        <div style={{ display: 'none' }}>
          <div id="quotation-print-area">
             <QuotationPrintView q={backgroundQuotation} companyProfile={companyProfile} lang={lang} />
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {viewingQuotation && (
        <div className="modal-overlay" style={{ animation: 'none' }}>
          <div className="modal-content large" style={{ background: '#f8fafc', overflowY: 'auto', maxHeight: '90vh', animation: 'none', transform: 'none' }}>
            <div className="modal-header">
                <h3>{lang === 'ar' ? 'عرض مسبق لعرض السعر' : 'Quotation Preview'}</h3>
                <button className="close-btn" onClick={() => setViewingQuotation(null)}>&times;</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
              <div id="quotation-print-area" style={{ width: '100%', maxWidth: '800px' }}>
                  <QuotationPrintView q={viewingQuotation} companyProfile={companyProfile} lang={lang} />
              </div>
            </div>
            <div className="modal-footer" style={{ marginTop: '1.5rem', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn-secondary" onClick={() => setViewingQuotation(null)}>{lang === 'ar' ? 'إغلاق' : 'Close'}</button>
              <button className="btn-primary" onClick={handlePrint}>
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



      <style jsx>{`
        .quotation-list-container { color: inherit; }
        .list-actions { display: flex; justify-content: space-between; margin-bottom: 1.5rem; }
        .search-box input { padding: 0.5rem 1rem; border: 1px solid var(--glass-border); border-radius: 0.5rem; min-width: 300px; color: var(--text-primary); background: var(--glass-bg); }
        .invoice-list-table { width: 100%; border-collapse: collapse; }
        .invoice-list-table th { color: var(--text-secondary) !important; border-bottom: 1px solid var(--glass-border); text-align: right; padding: 1rem; }
        .invoice-list-table td { border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding: 1rem; }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .action-icon-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .action-icon-btn.view { background: #f0f9ff; border-color: #bae6fd; color: #0284c7; }
        .action-icon-btn.view:hover { background: #0284c7; color: white; }
        .action-icon-btn.edit { background: #fefce8; border-color: #fde047; color: #ca8a04; }
        .action-icon-btn.edit:hover { background: #ca8a04; color: white; }
        .action-icon-btn.print { background: #f0fdf4; border-color: #86efac; color: #166534; }
        .action-icon-btn.print:hover { background: #166534; color: white; }
        .action-icon-btn.pdf { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
        .action-icon-btn.pdf:hover { background: #1d4ed8; color: white; }
        .action-icon-btn.delete { background: #fff1f2; border-color: #fca5a5; color: #dc2626; }
        .action-icon-btn.delete:hover { background: #dc2626; color: white; }
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
          body * { visibility: hidden; }
          #quotation-print-area, #quotation-print-area * { visibility: visible; }
          #quotation-print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; box-shadow: none; border: none; }
          .no-print { display: none !important; }
          .modal-overlay { background: transparent; padding: 0; overflow: visible; position: static; }
          .modal-content { box-shadow: none; background: transparent; position: static; transform: none; padding: 0; }
        }
        @media screen {
          .print-view { 
            position: absolute !important;
            top: -9999px !important;
            left: -9999px !important;
            z-index: -9999 !important;
          }
        }
      `}</style>
    </div>
  );
}

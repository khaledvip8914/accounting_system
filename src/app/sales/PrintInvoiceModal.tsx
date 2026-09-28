'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateZatcaQr } from '@/lib/zatca/qr-generator';

export default function PrintInvoiceModal({
  invoice,
  companyProfile,
  lang,
  onClose
}: {
  invoice: any;
  companyProfile: any;
  lang: string;
  onClose: () => void;
}) {
  const handlePrint = () => {
    window.print();
  };

  const isRtl = lang === 'ar';
  
  const shortAddress = [companyProfile?.district, companyProfile?.city].filter(Boolean).join(' - ');

  return (
    <div className="modal-overlay print-modal-overlay" onClick={onClose}>
      <div className="modal-content print-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header no-print">
          <h2 className="modal-title">{lang === 'ar' ? 'معاينة الطباعة الاحترافية' : 'Pro Print Preview'}</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              {lang === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}
            </button>
            <button className="btn-secondary" onClick={onClose}>
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>

        <div className="print-area">
          <div id="invoice-print-area" className="pro-invoice-paper">
            
            {/* 1. HEADER ROW */}
            <div className="pro-invoice-header">
              <div className="header-company-info">
                {companyProfile?.logo && (
                  <img src={companyProfile.logo} alt="Logo" className="company-logo" />
                )}
                <h2 className="company-name">{lang === 'ar' ? companyProfile?.nameAr || companyProfile?.name : companyProfile?.name || companyProfile?.nameAr}</h2>
                <div className="company-details">
                  {companyProfile?.taxNumber && <span><strong>{lang === 'ar' ? 'الرقم الضريبي:' : 'Tax No:'}</strong> {companyProfile.taxNumber}</span>}
                  {companyProfile?.commercialRegister && <span><strong>{lang === 'ar' ? 'س.ت:' : 'CR:'}</strong> {companyProfile.commercialRegister}</span>}
                  {shortAddress && <span><strong>{lang === 'ar' ? 'العنوان:' : 'Address:'}</strong> {shortAddress}</span>}
                  {companyProfile?.phone && <span><strong>{lang === 'ar' ? 'الهاتف:' : 'Phone:'}</strong> {companyProfile.phone}</span>}
                  {companyProfile?.email && <span><strong>{lang === 'ar' ? 'البريد:' : 'Email:'}</strong> {companyProfile.email}</span>}
                </div>
              </div>

              <div className="header-invoice-title">
                <h1 className="invoice-type-title">{lang === 'ar' ? 'فاتورة ضريبية' : 'TAX INVOICE'}</h1>
                <div className="invoice-meta">
                  <div className="meta-item">
                    <span className="meta-label">{lang === 'ar' ? 'رقم الفاتورة:' : 'Invoice No:'}</span>
                    <span className="meta-value">{invoice.invoiceNumber}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">{lang === 'ar' ? 'تاريخ الإصدار:' : 'Issue Date:'}</span>
                    <span className="meta-value">{new Date(invoice.date || invoice.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CUSTOMER & PAYMENT ROW */}
            <div className="pro-invoice-customer-row">
              <div className="customer-box">
                <div className="box-title">{lang === 'ar' ? 'فُتِرت إلى (العميل):' : 'Billed To (Customer):'}</div>
                <div className="customer-name">
                  {lang === 'ar' 
                    ? (invoice.customer?.nameAr || invoice.customer?.name || 'عميل نقدي') 
                    : (invoice.customer?.name || invoice.customer?.nameAr || 'Cash Customer')}
                </div>
                {invoice.customer?.taxNumber && (
                  <div className="customer-tax">
                    {lang === 'ar' ? 'الرقم الضريبي:' : 'Tax No:'} {invoice.customer.taxNumber}
                  </div>
                )}
              </div>
              
              <div className="payment-box">
                <div className="box-title">{lang === 'ar' ? 'معلومات الدفع:' : 'Payment Info:'}</div>
                <div className="payment-method">
                  <strong>{lang === 'ar' ? 'طريقة الدفع:' : 'Method:'}</strong>{' '}
                  {invoice.paymentMethod ? (lang === 'ar' ? invoice.paymentMethod.nameAr || invoice.paymentMethod.name : invoice.paymentMethod.name) : (lang === 'ar' ? 'غير محدد' : 'N/A')}
                </div>
                <div className="payment-status">
                  <strong>{lang === 'ar' ? 'الحالة:' : 'Status:'}</strong>{' '}
                  {invoice.status === 'Paid' ? (lang === 'ar' ? 'مدفوعة' : 'Paid') : (lang === 'ar' ? 'آجلة/غير مدفوعة' : 'Credit/Unpaid')}
                </div>
              </div>
            </div>

            {/* 3. ITEMS TABLE */}
            <div className="pro-table-container">
              <table className="pro-print-table">
                <thead>
                  <tr>
                    <th style={{ width: '5%' }}>#</th>
                    <th style={{ width: '45%', textAlign: isRtl ? 'right' : 'left' }}>{lang === 'ar' ? 'الوصف / الصنف' : 'Description / Item'}</th>
                    <th style={{ width: '10%', textAlign: 'center' }}>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                    <th style={{ width: '15%', textAlign: isRtl ? 'left' : 'right' }}>{lang === 'ar' ? 'سعر الوحدة' : 'Unit Price'}</th>
                    <th style={{ width: '25%', textAlign: isRtl ? 'left' : 'right' }}>{lang === 'ar' ? 'المجموع' : 'Total'}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                      <td>
                        <strong>{lang === 'ar' && item.product?.nameAr ? item.product.nameAr : item.product?.name}</strong>
                      </td>
                      <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ textAlign: isRtl ? 'left' : 'right' }}>{item.unitPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td style={{ textAlign: isRtl ? 'left' : 'right', fontWeight: 600 }}>{item.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4. TOTALS & QR ROW */}
            <div className="pro-invoice-footer-row">
              <div className="qr-section">
                <div className="zatca-qr-box">
                  <QRCodeSVG 
                    value={generateZatcaQr(
                      companyProfile?.nameAr || companyProfile?.name || 'Seller',
                      companyProfile?.taxNumber || '000000000000000',
                      new Date(invoice.createdAt || invoice.date).toISOString(),
                      (invoice.netAmount || 0).toString(),
                      (invoice.taxAmount || 0).toString()
                    )}
                    size={120}
                  />
                  <div className="qr-label">{lang === 'ar' ? 'رمز هيئة الزكاة (ZATCA)' : 'ZATCA QR'}</div>
                </div>
              </div>

              <div className="totals-section">
                <div className="totals-box">
                  <div className="totals-row">
                    <span className="t-label">{lang === 'ar' ? 'الإجمالي (بدون الضريبة):' : 'Subtotal (Excl. VAT):'}</span>
                    <span className="t-value">{(invoice.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="totals-row text-red">
                      <span className="t-label">{lang === 'ar' ? 'الخصم:' : 'Discount:'}</span>
                      <span className="t-value">- {(invoice.discount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR</span>
                    </div>
                  )}
                  <div className="totals-row">
                    <span className="t-label">{lang === 'ar' ? 'ضريبة القيمة المضافة (15%):' : 'VAT (15%):'}</span>
                    <span className="t-value">{(invoice.taxAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR</span>
                  </div>
                  <div className="totals-row net-total-row">
                    <span className="t-label">{lang === 'ar' ? 'الإجمالي المستحق:' : 'Total Due:'}</span>
                    <span className="t-value">{(invoice.netAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. NOTES */}
            {invoice.notes && (
              <div className="pro-invoice-notes">
                <div className="notes-title">{lang === 'ar' ? 'ملاحظات وشروط:' : 'Notes & Terms:'}</div>
                <div className="notes-content">{invoice.notes}</div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      <style jsx>{`
        .print-modal-overlay {
          padding: 40px;
          overflow-y: auto;
          background: rgba(15, 23, 42, 0.85);
          align-items: flex-start !important;
        }
        .print-modal-content {
          max-width: 900px;
          margin: 0 auto;
          background: #f8fafc;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }
        .print-area {
          padding: 2rem;
          display: flex;
          justify-content: center;
        }
        
        /* PRO MAX INVOICE STYLES */
        .pro-invoice-paper {
          background: white;
          width: 100%;
          max-width: 800px;
          padding: 40px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          color: #0f172a;
          direction: ${isRtl ? 'rtl' : 'ltr'};
          font-family: system-ui, -apple-system, sans-serif;
        }

        .pro-invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 3px solid #1e293b;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .header-company-info {
          flex: 1;
        }
        .company-logo {
          height: 80px;
          object-fit: contain;
          margin-bottom: 15px;
        }
        .company-name {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px 0;
        }
        .company-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 13px;
          color: #475569;
        }

        .header-invoice-title {
          text-align: ${isRtl ? 'left' : 'right'};
        }
        .invoice-type-title {
          font-size: 28px;
          font-weight: 900;
          color: #1e293b;
          margin: 0 0 15px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .invoice-meta {
          display: inline-flex;
          flex-direction: column;
          gap: 8px;
          background: #f8fafc;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .meta-item {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          font-size: 14px;
        }
        .meta-label {
          color: #64748b;
          font-weight: 600;
        }
        .meta-value {
          color: #0f172a;
          font-weight: 700;
        }

        .pro-invoice-customer-row {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
        }
        .customer-box, .payment-box {
          flex: 1;
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          border-left: ${isRtl ? 'none' : '4px solid #3b82f6'};
          border-right: ${isRtl ? '4px solid #3b82f6' : 'none'};
        }
        .payment-box {
          border-left: ${isRtl ? 'none' : '4px solid #10b981'};
          border-right: ${isRtl ? '4px solid #10b981' : 'none'};
        }
        .box-title {
          font-size: 12px;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .customer-name {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .customer-tax, .payment-method, .payment-status {
          font-size: 13px;
          color: #475569;
          margin-bottom: 4px;
        }

        .pro-table-container {
          margin-bottom: 30px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .pro-print-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .pro-print-table th {
          background: #1e293b;
          color: white;
          padding: 12px 16px;
          font-weight: 600;
        }
        .pro-print-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }
        .pro-print-table tr:last-child td {
          border-bottom: none;
        }
        .pro-print-table tbody tr:nth-child(even) {
          background: #f8fafc;
        }

        .pro-invoice-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }
        
        .zatca-qr-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
          background: white;
        }
        .qr-label {
          margin-top: 8px;
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
        }

        .totals-section {
          width: 350px;
        }
        .totals-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          color: #475569;
          border-bottom: 1px solid #e2e8f0;
        }
        .totals-row:last-child {
          border-bottom: none;
        }
        .text-red { color: #ef4444; }
        .t-label { font-weight: 600; }
        .t-value { font-weight: 700; color: #0f172a; }
        
        .net-total-row {
          margin-top: 8px;
          padding-top: 12px;
          border-top: 2px solid #cbd5e1;
          font-size: 18px;
        }
        .net-total-row .t-value {
          color: #2563eb;
          font-weight: 900;
        }

        .pro-invoice-notes {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 8px;
          padding: 16px;
          color: #92400e;
        }
        .notes-title {
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .notes-content {
          font-size: 13px;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        @media print {
          body * { visibility: hidden; }
          .pro-invoice-paper, .pro-invoice-paper * { visibility: visible; }
          .pro-invoice-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            box-shadow: none;
          }
          .no-print { display: none !important; }
          .print-modal-overlay { background: transparent; padding: 0; overflow: visible; }
          .print-modal-content { box-shadow: none; background: transparent; }
          .print-area { padding: 0; }
          
          /* Ensure backgrounds print correctly */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}

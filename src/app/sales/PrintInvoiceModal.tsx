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

  return (
    <div className="modal-overlay print-modal-overlay" onClick={onClose}>
      <div className="modal-content print-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header no-print">
          <h2 className="modal-title">{lang === 'ar' ? 'معاينة الطباعة' : 'Print Preview'}</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="btn-primary" onClick={handlePrint}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', marginLeft: '8px' }}>
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              {lang === 'ar' ? 'طباعة' : 'Print'}
            </button>
            <button className="btn-secondary" onClick={onClose} style={{ padding: '0.5rem 1rem' }}>
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', color: '#64748b' }} title={lang === 'ar' ? 'إغلاق' : 'Close'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <div className="print-area">
          <div id="invoice-print-area" className="invoice-paper">
            {/* Header */}
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
                  <h1 style={{ fontSize: '26px', color: '#000', margin: 0, letterSpacing: '1px' }}>{lang === 'ar' ? 'فاتورة ضريبية' : 'Tax Invoice'}</h1>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0', color: '#000' }}>#{invoice.invoiceNumber}</p>
                  <div style={{ fontSize: '14px', color: '#444' }}>
                    {lang === 'ar' ? 'التاريخ:' : 'Date:'} {new Date(invoice.date).toLocaleDateString()}
                  </div>
              </div>
            </div>
            
            {/* Bill To */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
              <div style={{ width: '50%', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                  <strong style={{ fontSize: '15px', borderBottom: '2px solid #6366f1', paddingBottom: '4px', display: 'inline-block', marginBottom: '8px', color: '#6366f1' }}>
                    {lang === 'ar' ? 'العميل:' : 'Bill To:'}
                  </strong>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#000' }}>{lang === 'ar' && invoice.customer.nameAr ? invoice.customer.nameAr : invoice.customer.name}</div>
                  <div style={{ fontSize: '14px', color: '#444', marginTop: '4px' }}>{invoice.customer.taxNumber ? `${lang === 'ar' ? 'الرقم الضريبي للعميل:' : 'Customer Tax No:'} ${invoice.customer.taxNumber}` : ''}</div>
              </div>
            </div>

            {/* Items Table */}
            <table className="print-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>{lang === 'ar' ? 'الصنف' : 'Product'}</th>
                  <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                  <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'سعر الوحدة' : 'Unit Price'}</th>
                  <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td>
                      {lang === 'ar' && item.product.nameAr ? item.product.nameAr : item.product.name}
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>{item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="print-totals">
              <div className="totals-row">
                <span>{lang === 'ar' ? 'الإجمالي (بدون الضريبة):' : 'Total (Excl. VAT):'}</span>
                <span>{invoice.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'} SAR</span>
              </div>
              <div className="totals-row">
                <span>{lang === 'ar' ? 'قيمة الضريبة (15%):' : 'VAT Amount (15%):'}</span>
                <span>{invoice.taxAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'} SAR</span>
              </div>
              <div className="totals-row net-total">
                <span>{lang === 'ar' ? 'الإجمالي الشامل:' : 'Net Total:'}</span>
                <span>{invoice.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR</span>
              </div>
            </div>

            {/* ZATCA QR Code */}
            <div className="zatca-qr-print-container">
              <QRCodeSVG 
                value={generateZatcaQr(
                  companyProfile?.nameAr || companyProfile?.name || 'Seller',
                  companyProfile?.taxNumber || '000000000000000',
                  new Date(invoice.createdAt || invoice.date).toISOString(),
                  invoice.netAmount.toString(),
                  invoice.taxAmount?.toString() || '0'
                )}
                size={140}
              />
              <div style={{ marginTop: '0.75rem', fontSize: '12px', color: '#444' }}>
                {lang === 'ar' ? 'رمز الاستجابة السريعة (ZATCA)' : 'ZATCA QR Code'}
              </div>
            </div>
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
          background: #f1f5f9;
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
        .invoice-paper {
          background: white;
          width: 100%;
          max-width: 800px;
          padding: 3rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          color: black;
          direction: ${lang === 'ar' ? 'rtl' : 'ltr'};
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
          margin-left: ${lang === 'ar' ? '0' : 'auto'};
          margin-right: ${lang === 'ar' ? 'auto' : '0'};
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
        .zatca-qr-print-container {
          margin-top: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px dashed #cbd5e1;
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-paper, .invoice-paper * {
            visibility: visible;
          }
          .invoice-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
          .print-modal-overlay {
            background: transparent;
            padding: 0;
            overflow: visible;
          }
          .print-modal-content {
            box-shadow: none;
            background: transparent;
          }
          .print-area {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}

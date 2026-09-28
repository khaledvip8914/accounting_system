'use client';
import React, { useEffect, useState } from 'react';
import { getAccountLedgerByCode } from './actions';
import { getCompanyProfile } from '../settings/actions';
import { tafqeet } from '@/lib/tafqeet';

export default function ContactStatementModal({
  contact, // { id, name, nameAr, code, taxNumber, address, commercialRegistry, phone }
  type, // 'customer' | 'supplier'
  startDate,
  endDate,
  onClose,
  lang,
  dict
}: any) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  
  const [localStartDate, setLocalStartDate] = useState(startDate || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
  const [localEndDate, setLocalEndDate] = useState(endDate || new Date().toISOString().split('T')[0]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const profileRes = await getCompanyProfile();
        if (profileRes) setCompany(profileRes as any);

        // Account code logic based on contact type
        const accountCode = type === 'customer' ? `1130-${contact.code}` : `2000-${contact.code}`;
        const res = await getAccountLedgerByCode(accountCode, localStartDate, localEndDate);
        if ((res as any).success === false) {
          alert((res as any).error || 'Failed to load statement');
        } else {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [contact, type, localStartDate, localEndDate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const isAr = lang === 'ar';
  const statementTitle = type === 'customer' ? (isAr ? 'كشف حساب عميل' : 'Customer Statement of Account') : (isAr ? 'كشف حساب مورد' : 'Supplier Statement of Account');
  const contactName = isAr && contact.nameAr ? contact.nameAr : contact.name;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 99999, padding: '2rem'
    }}>
      <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()} style={{
        background: 'var(--bg-primary)',
        borderRadius: '12px',
        width: '100%', maxWidth: '1000px', maxHeight: '90vh',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Actions Header (No Print) */}
        <div className="no-print" style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input type="date" value={localStartDate} onChange={e => setLocalStartDate(e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ddd', color: 'black' }} />
            <input type="date" value={localEndDate} onChange={e => setLocalEndDate(e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ddd', color: 'black' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => window.print()} style={{
              background: 'var(--accent-primary)', color: '#fff', border: 'none',
              padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
            }}>
              🖨️ {isAr ? 'طباعة' : 'Print'}
            </button>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none',
              padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
            }}>
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="print-area" style={{ padding: '2rem', overflowY: 'auto', flex: 1, background: '#fff', color: '#000' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>{isAr ? 'جاري التحميل...' : 'Loading...'}</div>
          ) : !data ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>{isAr ? 'خطأ في جلب البيانات' : 'Error loading data'}</div>
          ) : (
            <div style={{ maxWidth: '210mm', margin: '0 auto', fontSize: '14px' }}>
              
              {/* Print Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1, textAlign: isAr ? 'right' : 'left' }}>
                  <h1 style={{ margin: 0, fontSize: '24px', color: '#000' }}>{isAr && company?.nameAr ? company.nameAr : company?.name || 'Company Name'}</h1>
                  {company?.taxNumber && <p style={{ margin: '5px 0 0', color: '#444' }}>{isAr ? 'الرقم الضريبي:' : 'Tax No:'} {company.taxNumber}</p>}
                  {company?.commercialRegistry && <p style={{ margin: '5px 0 0', color: '#444' }}>{isAr ? 'سجل تجاري:' : 'CR:'} {company.commercialRegistry}</p>}
                </div>
                
                {company?.logoUrl && (
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <img src={company.logoUrl} alt="Logo" style={{ maxHeight: '80px', maxWidth: '100%' }} />
                  </div>
                )}
                
                <div style={{ flex: 1, textAlign: isAr ? 'left' : 'right' }}>
                  <h2 style={{ margin: 0, fontSize: '22px', color: '#3b82f6' }}>{statementTitle}</h2>
                  <p style={{ margin: '5px 0 0', color: '#444' }}>{isAr ? 'من:' : 'From:'} {localStartDate}</p>
                  <p style={{ margin: '5px 0 0', color: '#444' }}>{isAr ? 'إلى:' : 'To:'} {localEndDate}</p>
                </div>
              </div>

              {/* Customer/Supplier Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '16px' }}>{isAr ? 'بيانات الحساب' : 'Account Details'}</h3>
                  <p style={{ margin: '0 0 5px 0', color: '#334155' }}><strong>{isAr ? 'الاسم:' : 'Name:'}</strong> {contactName}</p>
                  <p style={{ margin: '0 0 5px 0', color: '#334155' }}><strong>{isAr ? 'الرمز:' : 'Code:'}</strong> {contact.code}</p>
                  {contact.phone && <p style={{ margin: '0 0 5px 0', color: '#334155' }}><strong>{isAr ? 'الجوال:' : 'Phone:'}</strong> {contact.phone}</p>}
                </div>
                <div style={{ textAlign: isAr ? 'left' : 'right' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '16px' }}>{isAr ? 'معلومات إضافية' : 'Additional Info'}</h3>
                  {contact.taxNumber && <p style={{ margin: '0 0 5px 0', color: '#334155' }}><strong>{isAr ? 'الرقم الضريبي:' : 'Tax No:'}</strong> {contact.taxNumber}</p>}
                  {contact.commercialRegistry && <p style={{ margin: '0 0 5px 0', color: '#334155' }}><strong>{isAr ? 'سجل تجاري:' : 'CR:'}</strong> {contact.commercialRegistry}</p>}
                  {contact.address && <p style={{ margin: '0 0 5px 0', color: '#334155' }}><strong>{isAr ? 'العنوان:' : 'Address:'}</strong> {contact.address}</p>}
                </div>
              </div>

              {/* Ledger Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                <thead>
                  <tr style={{ background: '#0f172a', color: '#fff' }}>
                    <th style={{ padding: '12px 10px', textAlign: 'center', border: '1px solid #334155' }}>{isAr ? 'التاريخ' : 'Date'}</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center', border: '1px solid #334155' }}>{isAr ? 'المرجع' : 'Reference'}</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center', border: '1px solid #334155' }}>{isAr ? 'البيان' : 'Description'}</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center', border: '1px solid #334155' }}>{isAr ? 'مدين' : 'Debit'}</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center', border: '1px solid #334155' }}>{isAr ? 'دائن' : 'Credit'}</th>
                    <th style={{ padding: '12px 10px', textAlign: 'center', border: '1px solid #334155' }}>{isAr ? 'الرصيد' : 'Balance'}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Opening Balance */}
                  <tr style={{ background: '#f1f5f9', fontWeight: 'bold' }}>
                    <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{localStartDate}</td>
                    <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>-</td>
                    <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{isAr ? 'رصيد البداية' : 'Opening Balance'}</td>
                    <td colSpan={2} style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}></td>
                    <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{formatCurrency(Math.abs(data.openingBalance || 0))} {(data.openingBalance || 0) === 0 ? '' : (data.openingBalance || 0) < 0 ? (isAr ? '(دائن)' : '(Cr)') : (isAr ? '(مدين)' : '(Dr)')}</td>
                  </tr>

                  {/* Transactions */}
                  {data.rows.map((row: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{new Date(row.date).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</td>
                      <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{row.reference}</td>
                      <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{row.description}</td>
                      <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{row.debit > 0 ? formatCurrency(row.debit) : '-'}</td>
                      <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>{row.credit > 0 ? formatCurrency(row.credit) : '-'}</td>
                      <td style={{ padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' }}>{formatCurrency(Math.abs(row.balance || 0))} {(row.balance || 0) === 0 ? '' : (row.balance || 0) < 0 ? (isAr ? '(دائن)' : '(Cr)') : (isAr ? '(مدين)' : '(Dr)')}</td>
                    </tr>
                  ))}

                  {data.rows.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', border: '1px solid #e2e8f0' }}>
                        {isAr ? 'لا توجد حركات مالية' : 'No transactions'}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#0f172a', color: '#fff', fontWeight: 'bold' }}>
                    <td colSpan={3} style={{ padding: '12px 10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>{isAr ? 'الإجمالي:' : 'Total:'}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>{formatCurrency(data.totalDebit)}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>{formatCurrency(data.totalCredit)}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>{formatCurrency(Math.abs(data.finalBalance || 0))} {(data.finalBalance || 0) === 0 ? '' : (data.finalBalance || 0) < 0 ? (isAr ? '(دائن)' : '(Cr)') : (isAr ? '(مدين)' : '(Dr)')}</td>
                  </tr>
                  <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                    <td colSpan={6} style={{ padding: '12px 10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      {isAr ? tafqeet(Math.abs(data.finalBalance || 0)) : `Only ${Math.abs(data.finalBalance || 0)} SAR`}
                    </td>
                  </tr>
                </tfoot>
              </table>
              
              {/* Footer Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', paddingTop: '2rem' }}>
                <div style={{ textAlign: 'center', width: '200px' }}>
                  <p style={{ borderBottom: '1px solid #000', paddingBottom: '2rem', margin: 0 }}></p>
                  <p style={{ margin: '10px 0 0', fontWeight: 'bold' }}>{isAr ? 'المحاسب' : 'Accountant'}</p>
                </div>
                <div style={{ textAlign: 'center', width: '200px' }}>
                  <p style={{ borderBottom: '1px solid #000', paddingBottom: '2rem', margin: 0 }}></p>
                  <p style={{ margin: '10px 0 0', fontWeight: 'bold' }}>{isAr ? 'المدير المالي' : 'Financial Manager'}</p>
                </div>
                <div style={{ textAlign: 'center', width: '200px' }}>
                  <p style={{ borderBottom: '1px solid #000', paddingBottom: '2rem', margin: 0 }}></p>
                  <p style={{ margin: '10px 0 0', fontWeight: 'bold' }}>{isAr ? (type === 'customer' ? 'توقيع العميل' : 'توقيع المورد') : (type === 'customer' ? 'Customer Signature' : 'Vendor Signature')}</p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
      
      {/* Global CSS for Print */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; color: #000 !important; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; background: white !important; }
          .no-print { display: none !important; }
        }
      `}} />
    </div>
  );
}

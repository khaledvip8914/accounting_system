'use client';
import React, { useEffect, useState } from 'react';
import { getAccountLedger } from './actions';

export default function LedgerModal({
  accountId,
  accountName,
  accountCode,
  startDate,
  endDate,
  onClose,
  lang,
  dict
}: any) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getAccountLedger(accountId, startDate, endDate);
        if (res.success === false) {
          alert(res.error || 'Failed to load ledger');
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
  }, [accountId, startDate, endDate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 99999, padding: '2rem'
    }}>
      <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()} style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        width: '100%', maxWidth: '900px', maxHeight: '90vh',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05) inset',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary, #3b82f6)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.8rem' }}>📑</span>
              {lang === 'ar' ? 'كشف حساب الأستاذ' : 'Account Ledger'}
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: '#fff', fontSize: '0.85rem' }}>{accountCode}</span>
              {accountName}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button onClick={() => window.print()} className="no-print" style={{
              background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.5)', color: '#60a5fa',
              padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}>
              <span>🖨️</span> {lang === 'ar' ? 'طباعة' : 'Print'}
            </button>
            <button onClick={onClose} className="no-print" style={{
              background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: '#cbd5e1',
              width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', transition: 'all 0.2s ease'
            }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}>
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', color: '#64748b' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(59, 130, 246, 0.3)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
              <p>{lang === 'ar' ? 'جاري تحميل كشف الحساب...' : 'Loading ledger data...'}</p>
              <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
            </div>
          ) : !data || (!data.rows?.length && data.openingBalance === 0) ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', opacity: 0.5 }}>📭</span>
              <p>{lang === 'ar' ? 'لا توجد حركات مالية لهذا الحساب في الفترة المحددة' : 'No financial transactions for this account in the selected period'}</p>
            </div>
          ) : (
            <div className="table-container" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1' }}>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{dict.date || (lang === 'ar' ? 'التاريخ' : 'Date')}</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{dict.reference || (lang === 'ar' ? 'المرجع' : 'Ref')}</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', width: '35%' }}>{dict.description || (lang === 'ar' ? 'البيان' : 'Description')}</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>{dict.debit || (lang === 'ar' ? 'مدين' : 'Debit')}</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>{dict.credit || (lang === 'ar' ? 'دائن' : 'Credit')}</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#fff' }}>{dict.balance || (lang === 'ar' ? 'الرصيد' : 'Balance')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
                    <td colSpan={3} style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontStyle: 'italic', color: '#94a3b8' }}>
                      {lang === 'ar' ? 'الرصيد الافتتاحي' : 'Opening Balance'}
                    </td>
                    <td colSpan={2} style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}></td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', fontWeight: 'bold', color: data.openingBalance >= 0 ? '#4ade80' : '#f87171' }}>
                      {formatCurrency(data.openingBalance)}
                    </td>
                  </tr>
                  
                  {(() => {
                    let runningBalance = data.openingBalance;
                    return (data.rows || []).map((entry: any, i: number) => {
                      runningBalance += (entry.debit - entry.credit);
                      return (
                        <tr key={entry.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                          <td style={{ padding: '1rem', color: '#94a3b8' }}>{new Date(entry.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</td>
                          <td style={{ padding: '1rem', color: '#cbd5e1' }}>{entry.reference}</td>
                          <td style={{ padding: '1rem', color: '#f8fafc' }}>{entry.description}</td>
                          <td style={{ padding: '1rem', textAlign: 'left', color: entry.debit > 0 ? '#4ade80' : '#64748b' }}>{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</td>
                          <td style={{ padding: '1rem', textAlign: 'left', color: entry.credit > 0 ? '#f87171' : '#64748b' }}>{entry.credit > 0 ? formatCurrency(entry.credit) : '-'}</td>
                          <td style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: runningBalance >= 0 ? '#4ade80' : '#f87171' }}>{formatCurrency(runningBalance)}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                    <td colSpan={3} style={{ padding: '1.2rem 1rem', fontWeight: 'bold', color: '#fff', textAlign: lang === 'ar' ? 'left' : 'right' }}>
                      {dict.total || (lang === 'ar' ? 'الإجمالي' : 'Total')}
                    </td>
                    <td style={{ padding: '1.2rem 1rem', textAlign: 'left', fontWeight: 'bold', color: '#4ade80' }}>
                      {formatCurrency(data.totalDebit)}
                    </td>
                    <td style={{ padding: '1.2rem 1rem', textAlign: 'left', fontWeight: 'bold', color: '#f87171' }}>
                      {formatCurrency(data.totalCredit)}
                    </td>
                    <td style={{ padding: '1.2rem 1rem', textAlign: 'left', fontWeight: '900', color: data.finalBalance >= 0 ? '#4ade80' : '#f87171', fontSize: '1.1rem' }}>
                      {formatCurrency(data.finalBalance)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

        @media print {
          body * {
            visibility: hidden;
          }
          .modal-overlay, .modal-overlay * {
            visibility: visible;
          }
          .modal-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            padding: 0 !important;
            backdrop-filter: none !important;
            overflow: visible !important;
            display: block !important;
          }
          .modal-content {
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
            max-width: 100% !important;
            width: 100% !important;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
            display: block !important;
          }
          .modal-content > div {
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
            display: block !important;
          }
          .table-container {
            border: none !important;
            background: white !important;
          }
          table, th, td { 
            border: 1px solid #000 !important; 
            color: black !important; 
          }
          th { 
            background-color: #f3f4f6 !important; 
          }
          /* Ensure header text and values are dark */
          span, p, h2, h3, td {
            color: black !important;
          }
          .no-print { 
            display: none !important; 
          }
        }
      `}</style>
    </div>
  );
}

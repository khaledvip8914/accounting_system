'use client';

import React, { useEffect, useState } from 'react';
import { getPayrollData } from './actions';

export default function PayrollPrintModal({ 
  lang, month, year, companyName, companyLogo, onClose, autoPrint 
}: { 
  lang: string, month: number, year: number, companyName?: string, companyLogo?: string | null, onClose: () => void, autoPrint?: boolean
}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [month, year]);

  const loadData = async () => {
    setLoading(true);
    const res = await getPayrollData(month, year);
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    if (!loading && autoPrint) {
      // Small delay to ensure rendering is complete before printing
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, autoPrint]);

  return (
    <div className="modal-overlay" style={{ zIndex: 3000 }} onClick={onClose}>
      <div className="modal-content glass-panel animate-in" style={{ maxWidth: '1000px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header no-print" style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <h2 className="modal-title" style={{ margin: 0 }}>{lang === 'ar' ? `تفاصيل مسير شهر ${month}/${year}` : `Payroll Details ${month}/${year}`}</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => window.print()}
              disabled={loading}
              style={{
                background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              🖨️ {lang === 'ar' ? 'طباعة المسير' : 'Print Payroll'}
            </button>
            <button 
              onClick={onClose} 
              style={{ 
                background: 'rgba(255,0,0,0.1)', 
                border: '1px solid rgba(255,0,0,0.3)', 
                fontSize: '1.25rem', 
                cursor: 'pointer', 
                color: '#ef4444', 
                width: '36px', 
                height: '36px', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,0,0,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="modal-body" style={{ padding: '2rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-primary)' }}>Loading...</div>
          ) : (
            <div id="print-area">
              <div className="print-only print-header" style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '2px solid #000', marginBottom: '1rem' }}>
                {companyLogo && <img src={companyLogo} alt={companyName} style={{ maxHeight: '60px', marginBottom: '10px' }} />}
                {companyName && <h1 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>{companyName}</h1>}
                <h2>{lang === 'ar' ? `سجلات الرواتب لشهر ${month}/${year}` : `Payroll Records ${month}/${year}`}</h2>
                <p>{new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</p>
              </div>

              <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--glass-border)' }}>{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--glass-border)', textAlign: 'center' }}>{lang === 'ar' ? 'الراتب الأساسي' : 'Base'}</th>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--glass-border)', textAlign: 'center' }}>{lang === 'ar' ? 'الإضافات' : 'Additions'}</th>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--glass-border)', textAlign: 'center' }}>{lang === 'ar' ? 'الاستقطاعات' : 'Deductions'}</th>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--glass-border)', textAlign: 'center' }}>{lang === 'ar' ? 'الصافي' : 'Net'}</th>
                      <th style={{ padding: '1rem', borderBottom: '2px solid var(--glass-border)' }}>{lang === 'ar' ? 'الملاحظات' : 'Notes'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(item => (
                      <tr key={item.employeeId}>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                          <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 800 }}>{item.code}</div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{lang === 'ar' && item.nameAr ? item.nameAr : item.name}</div>
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', textAlign: 'center', fontWeight: 'bold' }}>
                          {item.basicSalary.toLocaleString()}
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', textAlign: 'center', color: '#10b881', fontWeight: 600 }}>
                          +{ (item.allowances + item.rewards).toLocaleString() }
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>
                          -{ (item.advances + item.penalties).toLocaleString() }
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', textAlign: 'center', fontWeight: 900, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                          {item.netSalary.toLocaleString()} SAR
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                          {item.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="print-only signature-section" style={{ marginTop: '4rem', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '3rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'إعداد (المحاسب)' : 'Prepared by (Accountant)'}</div>
                    <div style={{ borderBottom: '1px solid #000', width: '80%', margin: '0 auto' }}></div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '3rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'مراجعة (الموارد البشرية)' : 'Reviewed by (HR Manager)'}</div>
                    <div style={{ borderBottom: '1px solid #000', width: '80%', margin: '0 auto' }}></div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '3rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'اعتماد (المدير العام)' : 'Approved by (General Manager)'}</div>
                    <div style={{ borderBottom: '1px solid #000', width: '80%', margin: '0 auto' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .print-only { display: none; }
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #000 !important;
            padding: 8px !important;
            font-size: 11px !important;
            color: #000 !important;
          }
          th {
            background-color: #f3f4f6 !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

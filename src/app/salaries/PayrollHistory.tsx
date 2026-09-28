'use client';

import React, { useState, useEffect } from 'react';
import { getPayrollHistory } from './actions';
import PayrollPrintModal from './PayrollPrintModal';

export default function PayrollHistory({ lang, companyName, companyLogo }: { lang: string, companyName?: string, companyLogo?: string | null }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [printModalData, setPrintModalData] = useState<{ month: number, year: number, autoPrint: boolean } | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const data = await getPayrollHistory();
    setHistory(data);
    setLoading(false);
  };

  return (
    <div className="card glass-panel">
      <div className="card-header" style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
        <h2 className="card-title" style={{ margin: 0, color: 'var(--text-primary)' }}>{lang === 'ar' ? 'سجل مسيرات الرواتب' : 'Payroll History'}</h2>
      </div>
      <div className="table-container">
        {loading ? (
          <div className="loading-overlay">Loading...</div>
        ) : history.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            {lang === 'ar' ? 'لا توجد سجلات رواتب معتمدة بعد' : 'No approved payroll records yet'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: lang === 'ar' ? 'right' : 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{lang === 'ar' ? 'الشهر / السنة' : 'Month / Year'}</th>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{lang === 'ar' ? 'عدد الموظفين' : 'Employees Count'}</th>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{lang === 'ar' ? 'إجمالي الأساسي' : 'Total Basic'}</th>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{lang === 'ar' ? 'إجمالي البدلات' : 'Total Allowances'}</th>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{lang === 'ar' ? 'إجمالي الاستقطاعات' : 'Total Deductions'}</th>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{lang === 'ar' ? 'إجمالي الصافي' : 'Total Net'}</th>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {item.month} / {item.year}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: '#3b82f6', fontWeight: 700 }}>
                    {item._count.id}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
                    {item._sum.basicSalary?.toLocaleString() || 0}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: '#10b881' }}>
                    +{((item._sum.allowances || 0) + (item._sum.rewards || 0)).toLocaleString()}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: '#ef4444' }}>
                    -{((item._sum.advances || 0) + (item._sum.penalties || 0)).toLocaleString()}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {item._sum.netSalary?.toLocaleString() || 0} SAR
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => setPrintModalData({ month: item.month, year: item.year, autoPrint: false })}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--accent-primary)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        color: 'var(--accent-primary)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                    >
                      {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {printModalData && (
        <PayrollPrintModal 
          lang={lang} 
          month={printModalData.month} 
          year={printModalData.year} 
          companyName={companyName} 
          companyLogo={companyLogo} 
          autoPrint={printModalData.autoPrint}
          onClose={() => setPrintModalData(null)} 
        />
      )}
      <style jsx>{`
        .table-container { min-height: 200px; position: relative; overflow-x: auto; }
        .loading-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.1); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; font-weight: 800; z-index: 10; color: var(--text-primary); }
        tr:hover { background: rgba(255, 255, 255, 0.05); }
      `}</style>
    </div>
  );
}

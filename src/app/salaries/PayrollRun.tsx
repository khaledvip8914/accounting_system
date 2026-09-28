'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PayrollRun({ lang, companyName, companyLogo }: { lang: string, companyName?: string, companyLogo?: string | null }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const t = {
    title: lang === 'ar' ? 'إصدار مسير الرواتب' : 'Run Payroll',
    subtitle: lang === 'ar' ? 'معاينة واعتماد رواتب الموظفين للشهر المحدد' : 'Preview and commit employee salaries for the selected month',
    month: lang === 'ar' ? 'الشهر' : 'Month',
    year: lang === 'ar' ? 'السنة' : 'Year',
    generatePreview: lang === 'ar' ? 'إنشاء المعاينة' : 'Generate Preview',
    commit: lang === 'ar' ? 'اعتماد وإصدار القيود' : 'Commit & Generate Journals',
    table: {
      code: lang === 'ar' ? 'الرقم' : 'Code',
      name: lang === 'ar' ? 'الموظف' : 'Employee',
      basic: lang === 'ar' ? 'الأساسي' : 'Basic Salary',
      allowances: lang === 'ar' ? 'البدلات' : 'Allowances',
      rewards: lang === 'ar' ? 'المكافآت' : 'Rewards',
      advances: lang === 'ar' ? 'السلف' : 'Advances',
      penalties: lang === 'ar' ? 'الخصومات' : 'Deductions/Penalties',
      gosi: lang === 'ar' ? 'تأمينات' : 'GOSI',
      net: lang === 'ar' ? 'الصافي' : 'Net Salary'
    }
  };

  const handleGeneratePreview = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    setIsSuccess(false);
    
    try {
      const res = await fetch('/api/v1/salaries/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, year })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (data.length === 0) {
          setMessage({ type: 'info', text: lang === 'ar' ? 'لا يوجد موظفين نشطين' : 'No active employees found' });
        } else {
          setPreviewData(data);
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Error' });
        setPreviewData([]);
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Network Error' });
      setPreviewData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من اعتماد المسير وإنشاء القيود المحاسبية؟ هذه العملية لا يمكن التراجع عنها.' : 'Are you sure you want to commit payroll and generate journal vouchers? This cannot be undone.')) {
      return;
    }

    setIsCommitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      const res = await fetch('/api/v1/salaries/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, year })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setIsSuccess(true);
        setMessage({ type: 'success', text: lang === 'ar' ? `تم اعتماد الرواتب لعدد ${data.count} موظف وإنشاء القيود بنجاح.` : `Successfully committed payroll for ${data.count} employees.` });
        setPreviewData([]);
      } else {
        setMessage({ type: 'error', text: data.error || 'Error' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Network Error' });
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="page-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h1 className="page-title">{t.title}</h1>
            <p className="page-subtitle">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : (message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)'), color: message.type === 'error' ? '#ef4444' : (message.type === 'success' ? '#22c55e' : '#3b82f6'), border: `1px solid ${message.type === 'error' ? '#ef4444' : (message.type === 'success' ? '#22c55e' : '#3b82f6')}` }}>
          {message.text}
        </div>
      )}

      {!isSuccess && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div className="card no-print glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
            
            <div>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>📅</div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.5rem' }}>{lang === 'ar' ? 'تحديد فترة المسير' : 'Select Payroll Period'}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
                {lang === 'ar' ? 'اختر الشهر والسنة لإنشاء أو معاينة مسير رواتب الموظفين.' : 'Choose the month and year to run or preview the payroll.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: lang === 'ar' ? 'right' : 'left' }}>{t.month}</label>
                <select className="form-control glass-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={month} onChange={e => setMonth(parseInt(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                    <option key={m} value={m} style={{ color: '#000' }}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: lang === 'ar' ? 'right' : 'left' }}>{t.year}</label>
                <select className="form-control glass-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={year} onChange={e => setYear(parseInt(e.target.value))}>
                  {[2024, 2025, 2026, 2027, 2028].map(y => (
                    <option key={y} value={y} style={{ color: '#000' }}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleGeneratePreview} 
              disabled={isLoading}
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(var(--accent-primary-rgb), 0.3)' }}
            >
              {isLoading ? '...' : (
                <>
                  <span>✨</span>
                  <span>{t.generatePreview}</span>
                </>
              )}
            </button>
            
          </div>
        </div>
      )}

      {previewData.length > 0 && !isSuccess && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }} className="no-print">
            <h2 className="card-title">{lang === 'ar' ? `معاينة مسير شهر ${month}/${year}` : `Preview Payroll ${month}/${year}`}</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-secondary" onClick={() => window.print()}>
                🖨️ {lang === 'ar' ? 'طباعة المسير' : 'Print Payroll'}
              </button>
              <button className="btn-primary" onClick={handleCommit} disabled={isCommitting}>
                {isCommitting ? '...' : t.commit}
              </button>
            </div>
          </div>
          
          <div className="print-only print-header" style={{ display: 'none', padding: '1.5rem', textAlign: 'center', borderBottom: '2px solid #000', marginBottom: '1rem' }}>
            {companyLogo && <img src={companyLogo} alt={companyName} style={{ maxHeight: '60px', marginBottom: '10px' }} />}
            {companyName && <h1 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>{companyName}</h1>}
            <h2>{lang === 'ar' ? `مسير رواتب شهر ${month}/${year}` : `Payroll Sheet ${month}/${year}`}</h2>
            <p>{new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</p>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{t.table.code}</th>
                  <th>{t.table.name}</th>
                  <th style={{ textAlign: 'right' }}>{t.table.basic}</th>
                  <th style={{ textAlign: 'right' }}>{t.table.allowances}</th>
                  <th style={{ textAlign: 'right' }}>{t.table.rewards}</th>
                  <th style={{ textAlign: 'right', color: 'var(--accent-danger)' }}>{t.table.advances}</th>
                  <th style={{ textAlign: 'right', color: 'var(--accent-danger)' }}>{t.table.penalties}</th>
                  <th style={{ textAlign: 'right', color: 'var(--accent-danger)' }}>{t.table.gosi}</th>
                  <th style={{ textAlign: 'right', fontWeight: 'bold' }}>{t.table.net}</th>
                  <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الملاحظات / التفاصيل' : 'Notes / Details'}</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((emp) => (
                  <tr key={emp.employeeId}>
                    <td style={{ fontFamily: 'monospace' }}>{emp.employeeCode}</td>
                    <td>{lang === 'ar' ? (emp.employeeNameAr || emp.employeeName) : emp.employeeName}</td>
                    <td style={{ textAlign: 'right' }}>{emp.basicSalary.toLocaleString()}</td>
                    <td style={{ textAlign: 'right' }}>{emp.allowances.toLocaleString()}</td>
                    <td style={{ textAlign: 'right' }}>{emp.rewards.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', color: 'var(--accent-danger)' }}>{emp.advances.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', color: 'var(--accent-danger)' }}>{emp.penalties.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', color: 'var(--accent-danger)' }}>{emp.gosiDeduction.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{emp.netSalary.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{emp.notes}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ fontWeight: 'bold', textAlign: 'left' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{previewData.reduce((sum, e) => sum + e.basicSalary, 0).toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{previewData.reduce((sum, e) => sum + e.allowances, 0).toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{previewData.reduce((sum, e) => sum + e.rewards, 0).toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-danger)' }}>{previewData.reduce((sum, e) => sum + e.advances, 0).toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-danger)' }}>{previewData.reduce((sum, e) => sum + e.penalties, 0).toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-danger)' }}>{previewData.reduce((sum, e) => sum + e.gosiDeduction, 0).toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{previewData.reduce((sum, e) => sum + e.netSalary, 0).toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="print-only signature-section" style={{ display: 'none', marginTop: '4rem', padding: '2rem' }}>
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

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .card, .card * {
            visibility: visible;
          }
          .card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .print-header {
            display: block !important;
          }
          .signature-section {
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

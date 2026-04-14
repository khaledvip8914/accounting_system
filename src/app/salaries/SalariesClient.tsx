'use client';

import React, { useState, useEffect } from 'react';
import { getPayrollData, approveSalary, approveAllSalaries } from './actions';

export default function SalariesClient({ lang }: { lang: string }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [month, year]);

  const loadData = async () => {
    setLoading(true);
    const res = await getPayrollData(month, year);
    setData(res);
    setLoading(false);
  };

  const handleApprove = async (item: any) => {
    if (processingId) return;
    if (!window.confirm(lang === 'ar' ? `هل أنت متأكد من اعتماد راتب ${item.nameAr || item.name}؟` : `Are you sure you want to approve salary for ${item.name}?`)) return;

    setProcessingId(item.employeeId);
    try {
      const res = await approveSalary({ employeeId: item.employeeId, month, year, amounts: item });
      if (res.success) {
        await loadData();
      } else {
        alert((res as any).error || 'Failed to approve');
      }
    } catch (err) {
      alert('Error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveAll = async () => {
    if (processingId) return;
    const pending = data.filter(d => d.status !== 'Approved');
    if (pending.length === 0) {
      alert(lang === 'ar' ? 'جميع الرواتب معتمدة بالفعل' : 'All salaries are already approved');
      return;
    }

    if (!window.confirm(lang === 'ar' ? `هل أنت متأكد من اعتماد جميع الرواتب المعلقة (${pending.length})؟` : `Are you sure you want to approve all pending salaries (${pending.length})?`)) return;

    setProcessingId('ALL');
    try {
      const res = await approveAllSalaries({ month, year, data });
      if (res.success) {
        alert(lang === 'ar' ? `تم اعتماد ${(res as any).count} رواتب بنجاح` : `Approved ${(res as any).count} salaries successfully`);
        await loadData();
      }
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="salaries-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'ar' ? 'سجلات الرواتب' : 'Payroll Records'}</h1>
          <p className="page-subtitle">{lang === 'ar' ? 'مراجعة واعتماد الرواتب الشهرية وتوريدها للقيود' : 'Review and approve monthly salaries and sync to ledger'}</p>
        </div>

        <div className="header-actions">
          <div className="period-selector">
            <select value={month} onChange={e => setMonth(parseInt(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString(lang === 'ar' ? 'ar' : 'en', { month: 'long' })}
                </option>
              ))}
            </select>
            <select value={year} onChange={e => setYear(parseInt(e.target.value))}>
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button 
            className="btn-primary bulk-btn" 
            onClick={handleApproveAll}
            disabled={processingId !== null}
          >
            {processingId === 'ALL' ? '...' : (lang === 'ar' ? 'اعتماد الكل' : 'Approve All')}
          </button>
        </div>
      </div>

      <div className="stats-strip">
        <div className="mini-stat">
          <label>{lang === 'ar' ? 'إجمالي المستحق' : 'Total Gross'}</label>
          <div className="value">{(data.reduce((s, i) => s + i.basicSalary + i.allowances + i.rewards, 0)).toLocaleString()} SAR</div>
        </div>
        <div className="mini-stat">
          <label>{lang === 'ar' ? 'إجمالي الخصومات' : 'Total Deductions'}</label>
          <div className="value">{(data.reduce((s, i) => s + i.advances + i.penalties, 0)).toLocaleString()} SAR</div>
        </div>
        <div className="mini-stat highlight">
          <label>{lang === 'ar' ? 'صافي الرواتب' : 'Net Payroll'}</label>
          <div className="value">{(data.reduce((s, i) => s + i.netSalary, 0)).toLocaleString()} SAR</div>
        </div>
      </div>

      <div className="card table-card">
        <div className="table-container">
          {loading ? (
            <div className="loading-overlay">Loading...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                  <th className="text-right">{lang === 'ar' ? 'الراتب الأساسي' : 'Base'}</th>
                  <th className="text-right">{lang === 'ar' ? 'الإضافات' : 'Additions'}</th>
                  <th className="text-right">{lang === 'ar' ? 'الاستقطاعات' : 'Deductions'}</th>
                  <th className="text-right">{lang === 'ar' ? 'الصافي' : 'Net'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.employeeId} className={item.status === 'Approved' ? 'row-approved' : ''}>
                    <td>
                      <div className="emp-cell">
                        <div className="emp-code">{item.code}</div>
                        <div className="emp-name">{lang === 'ar' && item.nameAr ? item.nameAr : item.name}</div>
                      </div>
                    </td>
                    <td className="text-right">{item.basicSalary.toLocaleString()}</td>
                    <td className="text-right positive">+{ (item.allowances + item.rewards).toLocaleString() }</td>
                    <td className="text-right negative">-{ (item.advances + item.penalties).toLocaleString() }</td>
                    <td className="text-right net-salary">{item.netSalary.toLocaleString()} SAR</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status === 'Approved' ? (lang === 'ar' ? 'معتمد' : 'Approved') : (lang === 'ar' ? 'بانتظار الاعتماد' : 'Pending')}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        {item.status !== 'Approved' ? (
                          <button 
                            className="approve-btn"
                            onClick={() => handleApprove(item)}
                            disabled={processingId !== null}
                          >
                            {processingId === item.employeeId ? '...' : (lang === 'ar' ? 'اعتماد' : 'Approve')}
                          </button>
                        ) : (
                          <span className="success-icon">✅</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style jsx>{`
        .salaries-page { padding: 2rem; max-width: 1400px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .page-title { font-size: 2rem; font-weight: 900; color: #0f172a; margin: 0; }
        .page-subtitle { color: #64748b; margin: 0.25rem 0 0; }
        
        .header-actions { display: flex; gap: 1rem; align-items: center; }
        .period-selector { display: flex; gap: 0.5rem; background: #f1f5f9; padding: 4px; border-radius: 12px; }
        .period-selector select { border: none; background: white; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; color: #1e293b; cursor: pointer; }
        
        .btn-primary { background: #0f172a; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .bulk-btn { background: #2563eb; }
        .bulk-btn:hover { background: #1d4ed8; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .stats-strip { display: flex; gap: 1.5rem; margin-bottom: 2.5rem; }
        .mini-stat { flex: 1; background: white; padding: 1.25rem 1.5rem; border-radius: 16px; border: 1px solid #e2e8f0; }
        .mini-stat label { font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 0.5rem; }
        .mini-stat .value { font-size: 1.5rem; font-weight: 900; color: #0f172a; }
        .mini-stat.highlight { background: #0f172a; border-color: #0f172a; }
        .mini-stat.highlight label { color: #94a3b8; }
        .mini-stat.highlight .value { color: white; }

        .card { background: white; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; }
        .table-container { min-height: 400px; position: relative; }
        .loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; font-weight: 800; z-index: 10; }

        table { width: 100%; border-collapse: collapse; }
        th { padding: 1.25rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
        [dir="rtl"] th { text-align: right; }
        td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .text-right { text-align: right; }
        [dir="rtl"] .text-right { text-align: left; }
        
        .emp-cell { display: flex; flex-direction: column; gap: 2px; }
        .emp-code { font-size: 0.75rem; color: #3b82f6; font-weight: 800; }
        .emp-name { font-weight: 700; color: #1e293b; }
        
        .positive { color: #10b881; font-weight: 600; }
        .negative { color: #ef4444; font-weight: 600; }
        .net-salary { font-weight: 900; color: #0f172a; font-size: 1.1rem; }
        
        .status-badge { padding: 0.35rem 0.75rem; border-radius: 30px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
        .status-badge.approved { background: #dcfce7; color: #15803d; }
        .status-badge.pending { background: #fff7ed; color: #9a3412; }
        
        .row-approved { background: #fcfdfd; }
        
        .actions { text-align: center; }
        .approve-btn { background: #10b881; color: white; border: none; padding: 0.5rem 1.25rem; border-radius: 8px; font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
        .approve-btn:hover { background: #059669; transform: translateY(-1px); }
        .success-icon { font-size: 1.25rem; }
      `}</style>
    </div>
  );
}

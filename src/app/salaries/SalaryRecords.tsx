'use client';

import React, { useState, useEffect } from 'react';
import { getPayrollData, payPayrollBatch } from './actions';
import DimensionSelector from '@/components/DimensionSelector';
import PayPayrollModal from './PayPayrollModal';

export default function SalaryRecords({ lang, companyName, companyLogo, defaultMonth, defaultYear }: { lang: string, companyName?: string, companyLogo?: string | null, defaultMonth?: number, defaultYear?: number }) {
  const [month, setMonth] = useState(defaultMonth || (new Date().getMonth() + 1));
  const [year, setYear] = useState(defaultYear || new Date().getFullYear());
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [employeeDimensions, setEmployeeDimensions] = useState<Record<string, any[]>>({});
  const [dimModalEmpId, setDimModalEmpId] = useState<string | null>(null);
  const [selectedEmpIds, setSelectedEmpIds] = useState<Set<string>>(new Set());
  const [showPayModal, setShowPayModal] = useState(false);

  useEffect(() => {
    if (defaultMonth) setMonth(defaultMonth);
    if (defaultYear) setYear(defaultYear);
  }, [defaultMonth, defaultYear]);

  useEffect(() => {
    loadData();
  }, [month, year]);

  const loadData = async () => {
    setLoading(true);
    const res = await getPayrollData(month, year);
    setData(res);
    setSelectedEmpIds(new Set(res.filter((d: any) => d.status === 'Approved').map((d: any) => d.employeeId)));
    setLoading(false);
  };


  const [sendingWhatsapp, setSendingWhatsapp] = useState<{current: number, total: number} | null>(null);

  const handleSendWhatsappBulk = async () => {
    const approved = data.filter(d => d.status === 'Approved' && d.phone);
    if (approved.length === 0) {
      alert(lang === 'ar' ? 'لا يوجد رواتب معتمدة بأرقام هواتف صالحة' : 'No approved salaries with valid phone numbers found');
      return;
    }

    if (!window.confirm(lang === 'ar' ? `هل أنت متأكد من إرسال إشعارات الواتساب لـ ${approved.length} موظف؟` : `Are you sure you want to send WhatsApp notifications to ${approved.length} employees?`)) return;

    setSendingWhatsapp({ current: 0, total: approved.length });

    let count = 0;
    for (const emp of approved) {
      try {
        const msgAr = `مرحباً ${emp.nameAr || emp.name}،\nتم إيداع راتبك لشهر ${month}/${year}.\n\n*تفاصيل الراتب:*\nالراتب الأساسي: ${emp.basicSalary}\nالبدلات: ${emp.allowances}\nالمكافآت: ${emp.rewards}\nالاستقطاعات والسلف: ${emp.advances + emp.penalties}\n*صافي الراتب المُودع: ${emp.netSalary} ريال*\n\nنتمنى لك يوماً سعيداً!`;
        
        const msgEn = `Hello ${emp.name},\nYour salary for ${month}/${year} has been deposited.\n\n*Payslip Details:*\nBasic Salary: ${emp.basicSalary}\nAllowances: ${emp.allowances}\nRewards: ${emp.rewards}\nDeductions & Loans: ${emp.advances + emp.penalties}\n*Net Salary: ${emp.netSalary} SAR*\n\nHave a great day!`;

        const formData = new FormData();
        formData.append('phone', emp.phone);
        formData.append('message', lang === 'ar' ? msgAr : msgEn);

        await fetch('/api/settings/whatsapp/send', {
          method: 'POST',
          body: formData
        });

      } catch (err) {
        console.error('Failed to send for', emp.name, err);
      }
      count++;
      setSendingWhatsapp({ current: count, total: approved.length });
      
      // Delay 1 second between messages
      await new Promise(r => setTimeout(r, 1000));
    }

    setTimeout(() => {
      setSendingWhatsapp(null);
      alert(lang === 'ar' ? 'تم الانتهاء من الإرسال بنجاح!' : 'Finished sending messages successfully!');
    }, 500);
  };

  return (
    <div className="salaries-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'ar' ? 'سجلات الرواتب' : 'Payroll Records'}</h1>
          <p className="page-subtitle">{lang === 'ar' ? 'مراجعة واعتماد الرواتب الشهرية وتوريدها للقيود' : 'Review and approve monthly salaries and sync to ledger'}</p>
        </div>

        <div className="header-actions">
          <div className="period-selector no-print">
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
            className="btn-success no-print" 
            onClick={handleSendWhatsappBulk}
            disabled={processingId !== null || sendingWhatsapp !== null}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#25D366' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            {sendingWhatsapp ? `${lang === 'ar' ? 'جاري الإرسال' : 'Sending'} (${sendingWhatsapp.current}/${sendingWhatsapp.total})` : (lang === 'ar' ? 'إرسال إشعارات الواتساب' : 'Send WhatsApp Slips')}
          </button>

          {data.some(d => d.status === 'Approved') && (
            <button 
              className="btn-primary no-print" 
              onClick={() => {
                if (selectedEmpIds.size === 0) {
                  alert(lang === 'ar' ? 'يرجى تحديد موظف واحد على الأقل' : 'Please select at least one employee');
                  return;
                }
                setShowPayModal(true);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#10b881', border: 'none' }}
            >
              💸 {lang === 'ar' ? 'صرف الرواتب المحددة' : 'Pay Selected'}
            </button>
          )}

          <button 
            className="btn-secondary no-print" 
            onClick={() => window.print()}
          >
            🖨️ {lang === 'ar' ? 'طباعة' : 'Print'}
          </button>
        </div>
      </div>

      <div className="print-only print-header" style={{ display: 'none', padding: '1.5rem', textAlign: 'center', borderBottom: '2px solid #000', marginBottom: '1rem' }}>
        {companyLogo && <img src={companyLogo} alt={companyName} style={{ maxHeight: '60px', marginBottom: '10px' }} />}
        {companyName && <h1 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>{companyName}</h1>}
        <h2>{lang === 'ar' ? `سجلات الرواتب لشهر ${month}/${year}` : `Payroll Records ${month}/${year}`}</h2>
        <p>{new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</p>
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
                  <th style={{ width: '40px' }} className="no-print">
                    <input 
                      type="checkbox" 
                      checked={selectedEmpIds.size === data.filter(d => d.status === 'Approved').length && data.some(d => d.status === 'Approved')}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedEmpIds(new Set(data.filter(d => d.status === 'Approved').map(d => d.employeeId)));
                        } else {
                          setSelectedEmpIds(new Set());
                        }
                      }}
                      style={{ cursor: 'pointer', width: '1.25rem', height: '1.25rem' }}
                    />
                  </th>
                  <th>{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                  <th className="text-right">{lang === 'ar' ? 'الراتب الأساسي' : 'Base'}</th>
                  <th className="text-right">{lang === 'ar' ? 'الإضافات' : 'Additions'}</th>
                  <th className="text-right">{lang === 'ar' ? 'الاستقطاعات' : 'Deductions'}</th>
                  <th className="text-right">{lang === 'ar' ? 'الصافي' : 'Net'}</th>
                  <th className="text-right">{lang === 'ar' ? 'الملاحظات' : 'Notes'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.employeeId}>
                    <td className="no-print">
                      {item.status === 'Approved' ? (
                        <input 
                          type="checkbox" 
                          checked={selectedEmpIds.has(item.employeeId)}
                          onChange={e => {
                            const newSet = new Set(selectedEmpIds);
                            if (e.target.checked) newSet.add(item.employeeId);
                            else newSet.delete(item.employeeId);
                            setSelectedEmpIds(newSet);
                          }}
                          style={{ cursor: 'pointer', width: '1.25rem', height: '1.25rem' }}
                        />
                      ) : (
                        <div style={{ width: '1.25rem', height: '1.25rem' }}></div>
                      )}
                    </td>
                    <td>
                      <div className="emp-cell">
                        <div className="emp-code">{item.code}</div>
                        <div className="emp-name">{lang === 'ar' && item.nameAr ? item.nameAr : item.name}</div>
                      </div>
                    </td>
                    <td className="text-right" style={{ color: '#1e293b', fontWeight: 'bold' }}>{item.basicSalary.toLocaleString()}</td>
                    <td className="text-right positive">+{ (item.allowances + item.rewards).toLocaleString() }</td>
                    <td className="text-right negative">-{ (item.advances + item.penalties).toLocaleString() }</td>
                    <td className="text-right net-salary">{item.netSalary.toLocaleString()} SAR</td>
                    <td className="text-right" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', maxWidth: '300px' }}>{item.notes}</td>
                    <td>
                      <span className={`status ${item.status.toLowerCase()}`}>
                        {item.status === 'Approved' ? (lang === 'ar' ? 'معتمد' : 'Approved') : 
                         item.status === 'Paid' ? (lang === 'ar' ? 'مصروف' : 'Paid') :
                         (lang === 'ar' ? 'بانتظار الاعتماد' : 'Pending')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

      {dimModalEmpId && (
        <div className="modal-overlay" style={{ zIndex: 2500 }}>
          <div className="modal-content" style={{ maxWidth: '500px', width: '90%', background: 'white', borderRadius: '12px' }}>
            <div className="modal-header" style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <h2 className="modal-title" style={{ margin: 0 }}>{lang === 'ar' ? 'الأبعاد التحليلية (مراكز التكلفة)' : 'Analytical Dimensions (Cost Centers)'}</h2>
              <button onClick={() => setDimModalEmpId(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            <div className="modal-body" style={{ padding: '1.5rem' }}>
              <DimensionSelector 
                companyId="" 
                lang={lang} 
                value={employeeDimensions[dimModalEmpId] || []} 
                onChange={(val) => setEmployeeDimensions(prev => ({ ...prev, [dimModalEmpId]: val }))} 
              />
            </div>
            <div className="modal-footer" style={{ padding: '1.5rem', textAlign: 'right', borderTop: '1px solid #e2e8f0' }}>
              <button className="btn-primary" onClick={() => setDimModalEmpId(null)}>{lang === 'ar' ? 'تم' : 'Done'}</button>
            </div>
          </div>
        </div>
      )}

      {showPayModal && (
        <PayPayrollModal
          lang={lang}
          totalNetSalary={data.filter(d => selectedEmpIds.has(d.employeeId)).reduce((sum, d) => sum + d.netSalary, 0)}
          onClose={() => setShowPayModal(false)}
          onPay={async (methods, notes, reference) => {
            const res = await payPayrollBatch({
              month,
              year,
              employeeIds: Array.from(selectedEmpIds),
              paymentMethods: methods,
              notes,
              reference
            });
            if (res.success) {
              alert(lang === 'ar' ? 'تم اعتماد قيد الصرف بنجاح!' : 'Payment and Journal Voucher generated successfully!');
              setShowPayModal(false);
              loadData(); // refresh table
            } else {
              alert(lang === 'ar' ? 'حدث خطأ: ' + res.error : 'Error: ' + res.error);
            }
          }}
        />
      )}

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
        
        @media print {
          body * {
            visibility: hidden;
          }
          .salaries-page, .salaries-page * {
            visibility: visible;
          }
          .salaries-page {
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
          .print-header {
            display: block !important;
          }
          .signature-section {
            display: block !important;
          }
          .card {
            box-shadow: none !important;
            border: none !important;
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
        
        .row-approved { background: #fcfdfd; }
        
        .actions { text-align: center; }
        .approve-btn { background: #10b881; color: white; border: none; padding: 0.5rem 1.25rem; border-radius: 8px; font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
        .approve-btn:hover { background: #059669; transform: translateY(-1px); }
        .dim-btn { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
        .dim-btn:hover { background: #e2e8f0; }
        .success-icon { font-size: 1.25rem; }
        
        .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        
        @media (max-width: 768px) {
          .salaries-page { padding: 1rem; }
          .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .header-actions { flex-direction: column; align-items: stretch; width: 100%; }
          .period-selector { width: 100%; justify-content: space-between; }
          .period-selector select { flex: 1; }
          .bulk-btn { width: 100%; }
          .stats-strip { flex-direction: column; gap: 1rem; }
          .mini-stat { padding: 1rem; }
        }
      `}</style>
    </div>
  );
}

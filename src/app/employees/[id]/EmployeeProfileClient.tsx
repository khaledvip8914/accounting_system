'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { resetEmployeeDevice } from '../actions';

export default function EmployeeProfileClient({ employee, availableAllowances, availableDeductions, lang }: any) {
  const [activeTab, setActiveTab] = useState<'details' | 'contract' | 'moves'>('details');
  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState(employee.photoUrl || '');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isResettingDevice, setIsResettingDevice] = useState(false);
  const [boundDeviceId, setBoundDeviceId] = useState<string | null>(employee.deviceId || null);
  const [boundDeviceInfo, setBoundDeviceInfo] = useState<string | null>((employee.customFields as any)?.deviceInfo || null);

  const handleResetDevice = async () => {
    if (window.confirm(lang === 'ar' 
      ? `هل تريد فك ارتباط الهاتف بالموظف (${employee.nameAr || employee.name})؟\nسيتمكن الموظف من استخدام هاتفه الجديد وسيتم توثيقه تلقائياً عند أول تسجيل حضور.` 
      : 'Reset trusted device binding?')) {
      setIsResettingDevice(true);
      try {
        const res = await resetEmployeeDevice(employee.id);
        if (res.success) {
          setBoundDeviceId(null);
          setBoundDeviceInfo(null);
          alert(res.message);
          router.refresh();
        } else {
          alert(res.error || 'فشلت العملية');
        }
      } catch (e: any) {
        alert('Error: ' + e.message);
      } finally {
        setIsResettingDevice(false);
      }
    }
  };

  // Contract State
  const activeContract = employee.contracts?.find((c: any) => c.status === 'Active') || null;
  const [basicSalary, setBasicSalary] = useState(activeContract?.basicSalary || employee.basicSalary || '');
  const [startDate, setStartDate] = useState(activeContract?.startDate ? new Date(activeContract.startDate).toISOString().split('T')[0] : '');
  const [endDate, setEndDate] = useState(activeContract?.endDate ? new Date(activeContract.endDate).toISOString().split('T')[0] : '');
  
  const [allowances, setAllowances] = useState<any[]>(activeContract?.allowances || []);
  const [deductions, setDeductions] = useState<any[]>(activeContract?.deductions || []);
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const t = {
    back: lang === 'ar' ? 'عودة' : 'Back',
    title: lang === 'ar' ? `ملف الموظف: ${employee.nameAr || employee.name}` : `Employee Profile: ${employee.name}`,
    tabs: {
      details: lang === 'ar' ? 'البيانات الأساسية' : 'Basic Details',
      contract: lang === 'ar' ? 'هيكل الراتب والعقد' : 'Salary Structure & Contract',
      moves: lang === 'ar' ? 'سجل الحركات المالية' : 'Financial Moves'
    },
    save: lang === 'ar' ? 'حفظ العقد' : 'Save Contract',
    addAllowance: lang === 'ar' ? '+ إضافة بدل' : '+ Add Allowance',
    addDeduction: lang === 'ar' ? '+ إضافة استقطاع' : '+ Add Deduction'
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload/employee-photo', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        // Save to employee record
        await fetch(`/api/v1/employees/${employee.id}/contract`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photoUrl: data.url })
        });
        setPhotoUrl(data.url);
        router.refresh();
      }
    } catch { /* silent */ } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveContract = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`/api/v1/employees/${employee.id}/contract`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basicSalary,
          startDate,
          endDate: endDate || null,
          allowances,
          deductions
        })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: lang === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: lang === 'ar' ? 'فشل الحفظ' : 'Failed to save' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network Error' });
    } finally {
      setIsSaving(false);
    }
  };

  const addAllowanceRow = () => {
    setAllowances([...allowances, { name: '', amount: 0 }]);
  };

  const addDeductionRow = () => {
    setDeductions([...deductions, { name: '', amount: 0 }]);
  };

  return (
    <div className="page-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/employees" className="back-btn" style={{ textDecoration: 'none', background: 'var(--glass-bg)', padding: '0.5rem', borderRadius: '50%', display: 'flex', border: '1px solid var(--glass-border)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {lang === 'ar' ? <polyline points="15 18 9 12 15 6"></polyline> : <polyline points="9 18 15 12 9 6"></polyline>}
          </svg>
        </Link>
        {/* Employee Photo in Header */}
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => photoInputRef.current?.click()} title={lang === 'ar' ? 'اضغط لتغيير الصورة' : 'Click to change photo'}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--accent-primary)', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent-primary)', flexShrink: 0 }}>
            {photoUrl 
              ? <img src={photoUrl} alt={employee.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (lang === 'ar' && employee.nameAr ? employee.nameAr[0] : employee.name[0])}
          </div>
          {isUploadingPhoto && <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>...</div>}
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>📷</div>
        </div>
        <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
        <div>
          <h1 className="page-title">{t.title}</h1>
          <p className="page-subtitle">{lang === 'ar' ? `الكود: ${employee.code}` : `Code: ${employee.code}`}</p>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: message.type === 'error' ? '#ef4444' : '#22c55e', border: `1px solid ${message.type === 'error' ? '#ef4444' : '#22c55e'}` }}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
        {(Object.keys(t.tabs) as Array<keyof typeof t.tabs>).map(tabKey => (
          <button
            key={tabKey}
            onClick={() => setActiveTab(tabKey)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tabKey ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === tabKey ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: activeTab === tabKey ? '600' : '400'
            }}
          >
            {t.tabs[tabKey]}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {activeTab === 'details' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <p><strong>{lang === 'ar' ? 'الاسم' : 'Name'}:</strong> {employee.name}</p>
                <p><strong>{lang === 'ar' ? 'الاسم بالعربي' : 'Name (Arabic)'}:</strong> {employee.nameAr}</p>
                <p><strong>{lang === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}:</strong> {employee.jobTitle}</p>
                <p><strong>{lang === 'ar' ? 'القسم' : 'Department'}:</strong> {employee.department}</p>
              </div>
              <div>
                <p><strong>{lang === 'ar' ? 'تاريخ التعيين' : 'Join Date'}:</strong> {new Date(employee.joinDate).toLocaleDateString()}</p>
                <p><strong>{lang === 'ar' ? 'رقم الهوية' : 'ID Number'}:</strong> {employee.idNumber}</p>
                <p><strong>{lang === 'ar' ? 'الهاتف' : 'Phone'}:</strong> {employee.phone}</p>
                <p><strong>{lang === 'ar' ? 'الحالة' : 'Status'}:</strong> <span className={`status ${employee.status === 'Active' ? 'paid' : 'overdue'}`}>{employee.status}</span></p>
              </div>
            </div>

            {/* Device Binding Info */}
            <div style={{
              background: boundDeviceId ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
              border: boundDeviceId ? '1px solid #10b981' : '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>{boundDeviceId ? '🔒' : '🔓'}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: boundDeviceId ? '#10b981' : 'var(--text-primary)' }}>
                    {boundDeviceId 
                      ? (lang === 'ar' ? `الهاتف المعتمد للبصمة: ${boundDeviceInfo || 'هاتف موثق'}` : `Trusted Attendance Device: ${boundDeviceInfo || 'Authorized Phone'}`)
                      : (lang === 'ar' ? 'لا يوجد هاتف موثق للبصمة حالياً' : 'No trusted device bound')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {boundDeviceId 
                      ? (lang === 'ar' ? 'نظام الحماية مفعل: لا يمكن للموظف تسجيل الحضور إلا من هذا الهاتف لمنع التلاعب.' : 'Protection Active: Only this phone can punch in/out.')
                      : (lang === 'ar' ? 'سيتم ربط وتوثيق أول هاتف يسجل منه الموظف تلقائياً.' : 'The account will automatically bind to the first device used.')}
                  </div>
                </div>
              </div>

              {boundDeviceId && (
                <button
                  type="button"
                  onClick={handleResetDevice}
                  disabled={isResettingDevice}
                  className="btn btn-secondary"
                  style={{
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    color: '#b91c1c',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '8px 16px',
                    borderRadius: '8px'
                  }}
                >
                  {isResettingDevice ? '⏳...' : (lang === 'ar' ? '🔓 فك ارتباط الهاتف (السماح بهاتف جديد)' : 'Reset Device')}
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contract' && (
          <form onSubmit={handleSaveContract}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>{lang === 'ar' ? 'تفاصيل العقد' : 'Contract Details'}</h3>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>{lang === 'ar' ? 'الراتب الأساسي' : 'Basic Salary'}</label>
                  <input type="number" required className="form-control" value={basicSalary} onChange={e => setBasicSalary(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>{lang === 'ar' ? 'تاريخ البداية' : 'Start Date'}</label>
                  <input type="date" required className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>{lang === 'ar' ? 'تاريخ الانتهاء (اختياري)' : 'End Date (Optional)'}</label>
                  <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              {/* Allowances */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: 'var(--accent-primary)', margin: 0 }}>{lang === 'ar' ? 'البدلات الثابتة' : 'Fixed Allowances'}</h3>
                  <button type="button" onClick={addAllowanceRow} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    {t.addAllowance}
                  </button>
                </div>
                {allowances.map((allowance, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={lang === 'ar' ? 'اسم البدل' : 'Allowance name'}
                      value={allowance.name}
                      onChange={e => {
                        const newArr = [...allowances];
                        newArr[index] = { ...newArr[index], name: e.target.value };
                        setAllowances(newArr);
                      }}
                      style={{ flex: 1 }}
                    />
                    <input type="number" className="form-control" style={{ width: '120px' }} placeholder={lang === 'ar' ? 'المبلغ' : 'Amount'} value={allowance.amount} onChange={e => {
                      const newArr = [...allowances];
                      newArr[index] = { ...newArr[index], amount: e.target.value };
                      setAllowances(newArr);
                    }} />
                    <button type="button" onClick={() => setAllowances(allowances.filter((_, i) => i !== index))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>
                      ✖
                    </button>
                  </div>
                ))}
              </div>

              {/* Deductions */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: 'var(--accent-primary)', margin: 0 }}>{lang === 'ar' ? 'الاستقطاعات الثابتة' : 'Fixed Deductions'}</h3>
                  <button type="button" onClick={addDeductionRow} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    {t.addDeduction}
                  </button>
                </div>
                {deductions.map((deduction, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={lang === 'ar' ? 'اسم الاستقطاع' : 'Deduction name'}
                      value={deduction.name}
                      onChange={e => {
                        const newArr = [...deductions];
                        newArr[index] = { ...newArr[index], name: e.target.value };
                        setDeductions(newArr);
                      }}
                      style={{ flex: 1 }}
                    />
                    <input type="number" className="form-control" style={{ width: '120px' }} placeholder={lang === 'ar' ? 'المبلغ' : 'Amount'} value={deduction.amount} onChange={e => {
                      const newArr = [...deductions];
                      newArr[index] = { ...newArr[index], amount: e.target.value };
                      setDeductions(newArr);
                    }} />
                    <button type="button" onClick={() => setDeductions(deductions.filter((_, i) => i !== index))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? '...' : t.save}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'moves' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th>{lang === 'ar' ? 'النوع' : 'Type'}</th>
                  <th>{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                  <th>{lang === 'ar' ? 'السبب' : 'Reason'}</th>
                </tr>
              </thead>
              <tbody>
                {employee.financialMoves.map((m: any) => (
                  <tr key={m.id}>
                    <td>{new Date(m.date).toLocaleDateString()}</td>
                    <td>
                      {m.type === 'Advance' ? (lang === 'ar' ? 'سلفة' : 'Advance') : ''}
                      {m.type === 'Penalty' ? (lang === 'ar' ? 'جزاء/خصم' : 'Penalty') : ''}
                      {m.type === 'Reward' ? (lang === 'ar' ? 'مكافأة' : 'Reward') : ''}
                      {m.type === 'Allowance' ? (lang === 'ar' ? 'بدل' : 'Allowance') : ''}
                    </td>
                    <td style={{ color: ['Penalty', 'Advance'].includes(m.type) ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>
                      {['Penalty', 'Advance'].includes(m.type) ? '-' : '+'}{m.amount}
                    </td>
                    <td>{m.reason || '-'}</td>
                  </tr>
                ))}
                {employee.financialMoves.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center' }}>{lang === 'ar' ? 'لا توجد حركات مالية مسجلة' : 'No financial moves'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

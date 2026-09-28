'use client';

import React, { useState, useMemo } from 'react';

interface LoanModalProps {
  employees: any[];
  lang: string;
  onClose: () => void;
  onSave: (loan: any) => void;
  preselectedEmployeeId?: string;
}

const MONTH_NAMES_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const MONTH_NAMES_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function LoanModal({ employees, lang, onClose, onSave, preselectedEmployeeId }: LoanModalProps) {
  const now = new Date();
  const nextMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2;
  const nextYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();

  const [form, setForm] = useState({
    employeeId: preselectedEmployeeId || '',
    totalAmount: '',
    installmentAmount: '',
    startMonth: nextMonth.toString(),
    startYear: nextYear.toString(),
    reason: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const ar = lang === 'ar';

  // Calculate installment preview
  const installmentPreview = useMemo(() => {
    const total = parseFloat(form.totalAmount);
    const inst = parseFloat(form.installmentAmount);
    const startM = parseInt(form.startMonth);
    const startY = parseInt(form.startYear);

    if (!total || !inst || inst <= 0 || total <= 0 || !startM || !startY) return [];

    const schedule = [];
    let remaining = total;
    let month = startM;
    let year = startY;

    while (remaining > 0 && schedule.length < 120) { // max 10 years safety
      const amount = remaining >= inst ? inst : remaining;
      schedule.push({ month, year, amount: parseFloat(amount.toFixed(2)) });
      remaining = parseFloat((remaining - amount).toFixed(2));
      month++;
      if (month > 12) { month = 1; year++; }
    }
    return schedule;
  }, [form.totalAmount, form.installmentAmount, form.startMonth, form.startYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (installmentPreview.length === 0) {
      alert(ar ? 'يرجى إدخال بيانات صحيحة' : 'Please enter valid data');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/v1/employees/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: form.employeeId,
          totalAmount: parseFloat(form.totalAmount),
          installmentAmount: parseFloat(form.installmentAmount),
          startMonth: parseInt(form.startMonth),
          startYear: parseInt(form.startYear),
          reason: form.reason
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSave(data);
      onClose();
    } catch (err: any) {
      alert(err.message || (ar ? 'فشل الحفظ' : 'Failed to save'));
    } finally {
      setIsSaving(false);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() + i);

  return (
    <div className="modal-overlay">
      <div className="modal-content loan-modal">
        <div className="modal-header">
          <h3>{ar ? '📋 إضافة قرض جديد' : '📋 New Employee Loan'}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="loan-grid">
            {/* Left: Form */}
            <div className="loan-form">
              <div className="form-group">
                <label>{ar ? 'الموظف' : 'Employee'}</label>
                <select
                  required
                  value={form.employeeId}
                  onChange={e => setForm({ ...form, employeeId: e.target.value })}
                  className="form-control"
                >
                  <option value="">{ar ? '--- اختر موظف ---' : '--- Select Employee ---'}</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {ar && emp.nameAr ? emp.nameAr : emp.name} ({emp.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{ar ? 'إجمالي مبلغ القرض (SAR)' : 'Total Loan Amount (SAR)'}</label>
                <input
                  type="number"
                  required
                  min={1}
                  step="0.01"
                  className="form-control loan-input-highlight"
                  placeholder="10000"
                  value={form.totalAmount}
                  onChange={e => setForm({ ...form, totalAmount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{ar ? 'قيمة القسط الشهري (SAR)' : 'Monthly Installment (SAR)'}</label>
                <input
                  type="number"
                  required
                  min={1}
                  step="0.01"
                  className="form-control"
                  placeholder="1000"
                  value={form.installmentAmount}
                  onChange={e => setForm({ ...form, installmentAmount: e.target.value })}
                />
                {form.totalAmount && form.installmentAmount && (
                  <span className="form-hint">
                    {ar ? `عدد الأقساط: ${installmentPreview.length} شهر` : `Installments: ${installmentPreview.length} months`}
                  </span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{ar ? 'شهر بدء الخصم' : 'Start Month'}</label>
                  <select className="form-control" value={form.startMonth} onChange={e => setForm({ ...form, startMonth: e.target.value })}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {ar ? MONTH_NAMES_AR[i] : MONTH_NAMES_EN[i]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{ar ? 'السنة' : 'Year'}</label>
                  <select className="form-control" value={form.startYear} onChange={e => setForm({ ...form, startYear: e.target.value })}>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>{ar ? 'السبب / الملاحظات' : 'Reason / Notes'}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={ar ? 'سبب القرض...' : 'Loan reason...'}
                  value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })}
                />
              </div>
            </div>

            {/* Right: Installment Preview */}
            <div className="installment-preview">
              <h4>{ar ? '📅 جدول الأقساط' : '📅 Installment Schedule'}</h4>
              {installmentPreview.length === 0 ? (
                <div className="preview-empty">
                  {ar ? 'أدخل بيانات القرض لرؤية الجدول' : 'Enter loan details to preview schedule'}
                </div>
              ) : (
                <>
                  <div className="preview-summary">
                    <div className="summary-item">
                      <span>{ar ? 'إجمالي القرض' : 'Total'}</span>
                      <strong>{parseFloat(form.totalAmount).toLocaleString()} SAR</strong>
                    </div>
                    <div className="summary-item">
                      <span>{ar ? 'عدد الأقساط' : 'Months'}</span>
                      <strong>{installmentPreview.length}</strong>
                    </div>
                  </div>
                  <div className="installment-list">
                    {installmentPreview.map((inst, i) => (
                      <div key={i} className="installment-row">
                        <span className="inst-num">#{i + 1}</span>
                        <span className="inst-date">
                          {ar ? MONTH_NAMES_AR[inst.month - 1] : MONTH_NAMES_EN[inst.month - 1]} {inst.year}
                        </span>
                        <span className="inst-amount">{inst.amount.toLocaleString()} SAR</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">{ar ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" className="btn-primary" disabled={isSaving || installmentPreview.length === 0}>
              {isSaving ? (ar ? 'جاري الحفظ...' : 'Saving...') : (ar ? '✓ حفظ القرض' : '✓ Save Loan')}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); padding: 1rem; }
        .modal-content { background: white; border-radius: 16px; width: 100%; max-width: 900px; padding: 2rem; box-shadow: 0 25px 60px -12px rgba(0,0,0,0.3); max-height: 92vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-header h3 { font-size: 1.2rem; font-weight: 700; color: #0f172a; }
        .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; }

        .loan-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
        .loan-form { display: flex; flex-direction: column; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group label { font-size: 0.82rem; font-weight: 600; color: #64748b; }
        .form-control { padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.92rem; transition: border-color 0.15s; width: 100%; }
        .form-control:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .loan-input-highlight { border-color: #6366f1; font-weight: 600; font-size: 1rem; }
        .form-hint { font-size: 0.75rem; color: #6366f1; font-weight: 600; margin-top: 2px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

        .installment-preview { background: #f8fafc; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; border: 1px solid #e2e8f0; }
        .installment-preview h4 { margin: 0; font-size: 0.95rem; font-weight: 700; color: #0f172a; }
        .preview-empty { color: #94a3b8; font-size: 0.85rem; text-align: center; padding: 2rem 1rem; }
        .preview-summary { display: flex; gap: 1rem; margin-bottom: 0.5rem; }
        .summary-item { flex: 1; background: white; border-radius: 8px; padding: 0.6rem 0.85rem; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 0.2rem; }
        .summary-item span { font-size: 0.72rem; color: #64748b; }
        .summary-item strong { font-size: 1rem; color: #0f172a; }
        .installment-list { display: flex; flex-direction: column; gap: 0.35rem; max-height: 280px; overflow-y: auto; }
        .installment-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.4rem 0.6rem; border-radius: 6px; background: white; border: 1px solid #f1f5f9; font-size: 0.82rem; }
        .inst-num { color: #94a3b8; width: 28px; font-size: 0.75rem; }
        .inst-date { flex: 1; color: #475569; font-weight: 500; }
        .inst-amount { color: #ef4444; font-weight: 700; font-size: 0.88rem; }

        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; }
        .btn-secondary { background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.7rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 500; }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border: none; padding: 0.7rem 1.75rem; border-radius: 10px; cursor: pointer; font-weight: 600; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 700px) {
          .loan-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

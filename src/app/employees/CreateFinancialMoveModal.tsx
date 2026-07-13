'use client';

import React, { useState } from 'react';

const DEDUCTIONS = [
  { value: 'AdvanceDeduction', labelAr: '🔄 استرداد سلفة', labelEn: 'Recover Advance', color: '#6366f1' },
  { value: 'Penalty',          labelAr: '⚠️ جزاء / خصم', labelEn: 'Penalty',          color: '#ef4444' },
];

const ADDITIONS = [
  { value: 'AdvanceAddition', labelAr: '💰 صرف سلفة', labelEn: 'Pay Advance',       color: '#3b82f6' },
  { value: 'Reward',           labelAr: '🏆 مكافأة',       labelEn: 'Reward',            color: '#10b981' },
  { value: 'Allowance',        labelAr: '📋 بدل',           labelEn: 'Allowance',         color: '#8b5cf6' },
];

const MOVE_TYPES = [...DEDUCTIONS, ...ADDITIONS];

export default function CreateFinancialMoveModal({ 
  onClose, 
  onSave, 
  employees, 
  lang,
  activeTab,
  initialData
}: { 
  onClose: () => void, 
  onSave: (data: any) => Promise<void>, 
  employees: any[], 
  lang: string,
  activeTab: string,
  initialData?: any
}) {
  const [formData, setFormData] = useState({
    id:         initialData?.id || '',
    employeeId: initialData?.employeeId || '',
    type:       initialData?.type || 'AdvanceAddition',
    amount:     initialData?.amount?.toString() || '',
    date:       initialData?.date 
                  ? new Date(initialData.date).toISOString().split('T')[0] 
                  : new Date().toISOString().split('T')[0],
    reason:     initialData?.reason || '',
    status:     initialData?.status || 'Confirmed'
  });
  const [isSaving, setIsSaving] = useState(false);

  const selected = MOVE_TYPES.find(t => t.value === formData.type) || MOVE_TYPES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId) {
      alert(lang === 'ar' ? 'يرجى اختيار الموظف' : 'Please select an employee');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert(lang === 'ar' ? 'يرجى إدخال مبلغ صحيح' : 'Please enter a valid amount');
      return;
    }
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      alert(err?.message || 'Failed to save transaction');
    } finally {
      setIsSaving(false);
    }
  };

  const isEditMode = !!formData.id;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h3>{isEditMode ? (lang === 'ar' ? 'تعديل العملية' : 'Edit Transaction') : (lang === 'ar' ? 'عملية مالية جديدة' : 'New Financial Transaction')}</h3>
            <p className="modal-subtitle">{lang === 'ar' ? 'اختر النوع وأدخل التفاصيل' : 'Select type and enter details'}</p>
          </div>
          <button onClick={onClose} className="close-btn" suppressHydrationWarning>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Type Selector */}
          {!isEditMode && (
            <div className="type-groups" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem' }}>
              {activeTab === 'financial' && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 700 }}>
                    {lang === 'ar' ? 'الاستقطاعات (خصم من الموظف)' : 'Deductions'}
                  </h4>
                  <div className="type-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                    {DEDUCTIONS.map(t => (
                      <button
                        key={t.value}
                        type="button"
                        className={`type-card ${formData.type === t.value ? 'selected' : ''}`}
                        style={formData.type === t.value ? { borderColor: t.color, background: t.color + '15' } : {}}
                        onClick={() => setFormData({ ...formData, type: t.value })}
                        suppressHydrationWarning
                      >
                        <span className="type-label" style={formData.type === t.value ? { color: t.color } : {}}>
                          {lang === 'ar' ? t.labelAr : t.labelEn}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'rewards' && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 700 }}>
                    {lang === 'ar' ? 'الإضافات / المكافآت (لصالح الموظف)' : 'Additions / Rewards'}
                  </h4>
                  <div className="type-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                    {ADDITIONS.map(t => (
                      <button
                        key={t.value}
                        type="button"
                        className={`type-card ${formData.type === t.value ? 'selected' : ''}`}
                        style={formData.type === t.value ? { borderColor: t.color, background: t.color + '15' } : {}}
                        onClick={() => setFormData({ ...formData, type: t.value })}
                        suppressHydrationWarning
                      >
                        <span className="type-label" style={formData.type === t.value ? { color: t.color } : {}}>
                          {lang === 'ar' ? t.labelAr : t.labelEn}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selected type indicator */}
          <div className="selected-type-banner" style={{ background: selected.color + '18', borderLeft: `4px solid ${selected.color}` }}>
            <span style={{ color: selected.color, fontWeight: 800 }}>
              {lang === 'ar' ? selected.labelAr : selected.labelEn}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
              {formData.type === 'AdvanceAddition' && (lang === 'ar' ? '← يُقيّد على حساب الموظف' : '← Debited to employee account')}
              {formData.type === 'AdvanceDeduction' && (lang === 'ar' ? '← يُرحّل من حساب الموظف' : '← Credited from employee account')}
              {formData.type === 'Penalty' && (lang === 'ar' ? '← خصم من مستحقات الموظف' : '← Deducted from employee')}
              {formData.type === 'Reward' && (lang === 'ar' ? '← إضافة لمستحقات الموظف' : '← Added to employee payable')}
              {formData.type === 'Allowance' && (lang === 'ar' ? '← بدل يُضاف لمستحقات الموظف' : '← Allowance added to payable')}
            </span>
          </div>

          <div className="form-sections">
            {/* Employee */}
            <div className="form-group">
              <label>{lang === 'ar' ? 'الموظف' : 'Employee'}</label>
              <select 
                required 
                value={formData.employeeId} 
                onChange={e => setFormData({...formData, employeeId: e.target.value})}
                suppressHydrationWarning
              >
                <option value="">{lang === 'ar' ? '-- اختر الموظف --' : '-- Select Employee --'}</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.code} — {lang === 'ar' && emp.nameAr ? emp.nameAr : emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>{lang === 'ar' ? 'المبلغ (ر.س)' : 'Amount (SAR)'}</label>
                <input 
                  type="number" 
                  required 
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount} 
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  suppressHydrationWarning
                />
              </div>

              <div className="form-group flex-1">
                <label>{lang === 'ar' ? 'التاريخ' : 'Date'}</label>
                <input 
                  type="date" 
                  required 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})} 
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'الحالة' : 'Status'}</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
                suppressHydrationWarning
              >
                <option value="Confirmed">{lang === 'ar' ? '✅ تم الاعتماد' : '✅ Confirmed'}</option>
                <option value="Pending">{lang === 'ar' ? '⏳ قيد الانتظار' : '⏳ Pending'}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'البيان / السبب' : 'Reason / Note'}</label>
              <textarea 
                rows={3}
                placeholder={lang === 'ar' ? 'سبب العملية أو ملاحظات...' : 'Reason or notes...'}
                value={formData.reason} 
                onChange={e => setFormData({...formData, reason: e.target.value})}
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary" suppressHydrationWarning>
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSaving}
              style={{ background: selected.color }}
              suppressHydrationWarning
            >
              {isSaving 
                ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                : (lang === 'ar' ? `حفظ ${selected.labelAr}` : `Save ${selected.labelEn}`)}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay { 
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
          background: rgba(15, 23, 42, 0.75); z-index: 1000; 
          display: flex; align-items: center; justify-content: center; 
          backdrop-filter: blur(8px); padding: 1rem;
        }
        .modal-content { 
          background: white; border-radius: 20px; width: 100%; max-width: 580px; 
          padding: 2rem; box-shadow: 0 25px 60px -12px rgba(0,0,0,0.4); 
          max-height: 90vh; overflow-y: auto;
        }
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
        .modal-header h3 { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0 0 0.25rem; }
        .modal-subtitle { font-size: 0.85rem; color: #94a3b8; margin: 0; }
        .close-btn { background: #f1f5f9; border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; color: #64748b; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        
        .type-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; margin-bottom: 1rem; }
        .type-card { 
          padding: 0.75rem 0.4rem; border: 2px solid #e2e8f0; border-radius: 12px; 
          background: white; cursor: pointer; transition: all 0.2s; text-align: center;
        }
        .type-card:hover { border-color: #94a3b8; transform: translateY(-1px); }
        .type-card.selected { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .type-label { font-size: 0.78rem; font-weight: 700; color: #475569; display: block; line-height: 1.4; }

        .selected-type-banner { 
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 0.75rem 1rem; border-radius: 10px; margin-bottom: 1.5rem; flex-wrap: wrap;
        }

        .form-sections { display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 1.5rem; }
        .form-row { display: flex; gap: 1rem; }
        .flex-1 { flex: 1; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group label { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; }
        
        select, input, textarea { 
          padding: 0.8rem; border-radius: 10px; border: 1.5px solid #e2e8f0; 
          font-size: 0.95rem; background: #fff; width: 100%; transition: all 0.2s; 
          font-family: inherit;
        }
        select:focus, input:focus, textarea:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        textarea { resize: vertical; }

        .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1.25rem; border-top: 1px solid #f1f5f9; }
        .btn-secondary { background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.8rem 1.75rem; border-radius: 10px; font-weight: 700; color: #64748b; cursor: pointer; font-size: 0.9rem; }
        .btn-primary { color: white; border: none; padding: 0.8rem 1.75rem; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-primary:active { transform: scale(0.98); }
        
        @media (max-width: 640px) {
          .modal-content { padding: 1.25rem; }
          .form-row { flex-direction: column; }
          .type-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
}

'use client';

import React, { useState } from 'react';

export default function CreateFinancialMoveModal({ 
  onClose, 
  onSave, 
  employees, 
  lang,
  initialData
}: { 
  onClose: () => void, 
  onSave: (data: any) => Promise<void>, 
  employees: any[], 
  lang: string,
  initialData?: any
}) {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    employeeId: initialData?.employeeId || '',
    type: initialData?.type || 'Advance',
    amount: initialData?.amount?.toString() || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    reason: initialData?.reason || '',
    status: initialData?.status || 'Pending'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId) {
      alert(lang === 'ar' ? 'يرجى اختيار الموظف' : 'Please select an employee');
      return;
    }
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      alert('Failed to save transaction');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            {formData.id 
              ? (lang === 'ar' ? 'تعديل السند' : 'Edit Record')
              : (formData.type === 'Advance' 
                ? (lang === 'ar' ? 'إضافة سلفة جديدة' : 'Add New Advance')
                : formData.type === 'Penalty'
                  ? (lang === 'ar' ? 'إضافة جزاء / خصم جديد' : 'Add New Penalty / Deduction')
                  : formData.type === 'Reward'
                    ? (lang === 'ar' ? 'إضافة مكافأة جديدة' : 'Add New Reward')
                    : (lang === 'ar' ? 'إضافة بدل جديد' : 'Add New Allowance'))
            }
          </h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-sections">
            <div className="form-group">
              <label>{lang === 'ar' ? 'الموظف' : 'Employee'}</label>
              <select 
                required 
                value={formData.employeeId} 
                onChange={e => setFormData({...formData, employeeId: e.target.value})}
              >
                <option value="">{lang === 'ar' ? '-- اختر الموظف --' : '-- Select Employee --'}</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.code} - {lang === 'ar' && emp.nameAr ? emp.nameAr : emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>{lang === 'ar' ? 'النوع' : 'Type'}</label>
                <div className="type-toggle">
                  {(formData.type === 'Advance' || formData.type === 'Penalty') ? (
                    <>
                      <button 
                        type="button"
                        className={(formData.type === 'AdvanceDeduction' || formData.type === 'Advance') ? 'active advance' : ''}
                        onClick={() => setFormData({...formData, type: 'AdvanceDeduction'})}
                      >
                        {lang === 'ar' ? 'سداد سلفة مستحقة' : 'Advance Repayment'}
                      </button>
                      <button 
                        type="button"
                        className={formData.type === 'Penalty' ? 'active penalty' : ''}
                        onClick={() => setFormData({...formData, type: 'Penalty'})}
                      >
                        {lang === 'ar' ? 'جزاء' : 'Penalty'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        type="button"
                        className={formData.type === 'Reward' ? 'active reward' : ''}
                        onClick={() => setFormData({...formData, type: 'Reward'})}
                      >
                        {lang === 'ar' ? 'مكافأة' : 'Reward'}
                      </button>
                      <button 
                        type="button"
                        className={formData.type === 'Allowance' ? 'active allowance' : ''}
                        onClick={() => setFormData({...formData, type: 'Allowance'})}
                      >
                        {lang === 'ar' ? 'بدل' : 'Allowance'}
                      </button>
                      <button 
                        type="button"
                        className={formData.type === 'AdvanceAddition' ? 'active advance' : ''}
                        onClick={() => setFormData({...formData, type: 'AdvanceAddition'})}
                      >
                        {lang === 'ar' ? 'صرف سلفة مقدمة' : 'Advance Payment'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="form-group flex-1">
                <label>{lang === 'ar' ? 'المبلغ' : 'Amount'}</label>
                <input 
                  type="number" 
                  required 
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount} 
                  onChange={e => setFormData({...formData, amount: e.target.value})} 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>{lang === 'ar' ? 'التاريخ' : 'Date'}</label>
                <input 
                  type="date" 
                  required 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})} 
                  style={{ width: '100%', minWidth: '150px' }}
                />
              </div>

              <div className="form-group flex-1">
                <label>{lang === 'ar' ? 'الإجراء' : 'Procedure'}</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Confirmed">{lang === 'ar' ? 'تم الاعتماد' : 'Confirmed'}</option>
                  <option value="Pending">{lang === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'البيان / السبب' : 'Reason / Note'}</label>
              <textarea 
                rows={3}
                placeholder={lang === 'ar' ? 'سبب العملية...' : 'Reason for entry...'}
                value={formData.reason} 
                onChange={e => setFormData({...formData, reason: e.target.value})} 
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ العملية' : 'Save Transaction')}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
        .modal-content { background: white; border-radius: 20px; width: 100%; max-width: 550px; padding: 2.5rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .modal-header h3 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; }
        .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; line-height: 1; }
        
        .form-sections { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem; }
        .form-row { display: flex; gap: 1.25rem; }
        .flex-1 { flex: 1; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.025em; }
        
        select, input, textarea { padding: 0.875rem; border-radius: 12px; border: 1.5px solid #e2e8f0; font-size: 0.95rem; background: #fff; width: 100%; transition: all 0.2s; }
        select:focus, input:focus, textarea:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        textarea { resize: vertical; }

        .type-toggle { display: grid; grid-template-columns: 1fr 1fr; background: #f1f5f9; padding: 4px; border-radius: 12px; }
        .type-toggle button { padding: 0.75rem; border: none; background: transparent; border-radius: 9px; font-size: 0.85rem; font-weight: 800; color: #64748b; cursor: pointer; transition: all 0.2s; }
        .type-toggle button.active.advance { background: #3b82f6; color: white; }
        .type-toggle button.active.penalty { background: #ef4444; color: white; }
        .type-toggle button.active.reward { background: #10b881; color: white; }
        .type-toggle button.active.allowance { background: #8b5cf6; color: white; }

        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; }
        .btn-secondary { background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.875rem 2rem; border-radius: 12px; font-weight: 800; color: #64748b; cursor: pointer; }
        .btn-primary { background: #0f172a; color: white; border: none; padding: 0.875rem 2rem; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .btn-primary:active { transform: scale(0.98); }
        
        @media (max-width: 640px) {
          .modal-content { margin: 1rem; padding: 1.5rem; }
          .form-row { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}


import React, { useState, useEffect } from 'react';

export default function LeaveModal({ onClose, onSave, leave, employees, lang }: any) {
  const [formData, setFormData] = useState({
    employeeId: leave?.employeeId || '',
    type: leave?.type || '',
    startDate: leave?.startDate ? new Date(leave.startDate).toISOString().split('T')[0] : '',
    endDate: leave?.endDate ? new Date(leave.endDate).toISOString().split('T')[0] : '',
    reason: leave?.reason || '',
    status: leave?.status || 'Pending'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const leaveTypes = [
    { value: 'Annual', label: lang === 'ar' ? 'إجازة سنوية' : 'Annual Leave' },
    { value: 'Sick', label: lang === 'ar' ? 'إجازة مرضية' : 'Sick Leave' },
    { value: 'Emergency', label: lang === 'ar' ? 'إجازة طارئة' : 'Emergency Leave' },
    { value: 'Permission', label: lang === 'ar' ? 'طلب استئذان (ساعي)' : 'Permission / Short Leave' },
    { value: 'EarlyDeparture', label: lang === 'ar' ? 'انصراف مبكر مبرر' : 'Excused Early Departure' },
    { value: 'LateArrival', label: lang === 'ar' ? 'تأخر مبرر' : 'Excused Late Arrival' },
    { value: 'Unpaid', label: lang === 'ar' ? 'إجازة بدون راتب' : 'Unpaid Leave' },
    { value: 'Maternity', label: lang === 'ar' ? 'إجازة أمومة / أبوة' : 'Maternity / Paternity' },
    { value: 'Other', label: lang === 'ar' ? 'أخرى' : 'Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.employeeId || !formData.type || !formData.startDate || !formData.endDate) {
      setError(lang === 'ar' ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError(lang === 'ar' ? 'تاريخ بداية الإجازة يجب أن يكون قبل تاريخ النهاية' : 'Start date must be before end date');
      return;
    }

    setLoading(true);
    try {
      await onSave({ ...formData, id: leave?.id });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving leave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content animate-in" style={{ width: '90%', maxWidth: '550px', background: 'white', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', position: 'relative' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
          <h2 className="modal-title" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            {leave 
              ? (lang === 'ar' ? 'تعديل طلب الإجازة' : 'Edit Leave Request') 
              : (lang === 'ar' ? 'تقديم طلب إجازة' : 'New Leave Request')}
          </h2>
          <button onClick={onClose} className="btn-close" style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>
            <label style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>{lang === 'ar' ? 'الموظف *' : 'Employee *'}</label>
            <select
              required
              value={formData.employeeId}
              onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
              style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '0.875rem 1rem', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }}
              disabled={!!leave}
            >
              <option value="">{lang === 'ar' ? 'اختر الموظف' : 'Select Employee'}</option>
              {employees.map((emp: any) => (
                <option key={emp.id} value={emp.id}>
                  {emp.code} - {lang === 'ar' ? emp.nameAr || emp.name : emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>
            <label style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>{lang === 'ar' ? 'نوع الإجازة *' : 'Leave Type *'}</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '0.875rem 1rem', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }}
            >
              <option value="">{lang === 'ar' ? 'اختر النوع' : 'Select Type'}</option>
              {leaveTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <label style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>{lang === 'ar' ? 'من تاريخ *' : 'Start Date *'}</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '0.875rem 1rem', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <label style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>{lang === 'ar' ? 'إلى تاريخ *' : 'End Date *'}</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '0.875rem 1rem', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>
            <label style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>{lang === 'ar' ? 'السبب / ملاحظات' : 'Reason / Notes'}</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              placeholder={lang === 'ar' ? 'اكتب سبب الإجازة هنا...' : 'Write reason here...'}
              style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '0.875rem 1rem', color: '#0f172a', fontSize: '0.95rem', outline: 'none', minHeight: '100px', resize: 'vertical' }}
            />
          </div>

          {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>{error}</div>}

          <div className="modal-footer" style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading} style={{ flex: 1, padding: '0.875rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 800, cursor: 'pointer' }}>
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1, padding: '0.875rem', borderRadius: '12px', background: '#0f172a', border: 'none', color: 'white', fontWeight: 800, cursor: 'pointer' }}>
              {loading ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ الطلب' : 'Save Request')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

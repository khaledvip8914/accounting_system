'use client';

import React, { useState } from 'react';
import { recordAttendance } from './actions';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  employees: any[];
  lang: string;
  initialData?: any;
}

export default function AttendanceModal({ onClose, onSuccess, employees, lang, initialData }: Props) {
  const isAr = lang === 'ar';
  const [formData, setFormData] = useState({
    employeeId: initialData?.employeeId || (employees[0]?.id || ''),
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    checkInTime: initialData?.checkIn ? new Date(initialData.checkIn).toTimeString().substring(0, 5) : '08:00',
    checkOutTime: initialData?.checkOut ? new Date(initialData.checkOut).toTimeString().substring(0, 5) : '17:00',
    status: initialData?.status || 'PRESENT',
    notes: initialData?.notes || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.date) {
      alert(isAr ? 'يرجى اختيار الموظف والتاريخ' : 'Please select employee and date');
      return;
    }

    setIsSaving(true);
    try {
      let checkInIso: string | null = null;
      let checkOutIso: string | null = null;

      if (formData.checkInTime && formData.status !== 'ABSENT') {
        checkInIso = `${formData.date}T${formData.checkInTime}:00`;
      }
      if (formData.checkOutTime && formData.status !== 'ABSENT') {
        checkOutIso = `${formData.date}T${formData.checkOutTime}:00`;
      }

      const res = await recordAttendance({
        employeeId: formData.employeeId,
        date: formData.date,
        checkIn: checkInIso,
        checkOut: checkOutIso,
        status: formData.status,
        source: 'MANUAL',
        notes: formData.notes,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        alert(res.error || 'Failed to record attendance');
      }
    } catch (err: any) {
      alert(err.message || 'Error recording attendance');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content animate-in" style={{ width: '90%', maxWidth: '520px', background: 'white', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            {initialData ? (isAr ? 'تعديل حركة حضور وانصراف' : 'Edit Attendance') : (isAr ? 'تسجيل حضور / انصراف يدوي' : 'Record Manual Attendance')}
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>
              {isAr ? 'الموظف' : 'Employee'}
            </label>
            <select
              value={formData.employeeId}
              onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
              required
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            >
              <option value="">{isAr ? '-- اختر الموظف --' : '-- Select Employee --'}</option>
              {employees.map((emp: any) => (
                <option key={emp.id} value={emp.id}>
                  {emp.code} - {isAr && emp.nameAr ? emp.nameAr : emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>
              {isAr ? 'التاريخ' : 'Date'}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              required
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>
              {isAr ? 'حالة الحضور' : 'Attendance Status'}
            </label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            >
              <option value="PRESENT">{isAr ? 'حاضر (Present)' : 'Present'}</option>
              <option value="LATE">{isAr ? 'متأخر (Late)' : 'Late'}</option>
              <option value="ABSENT">{isAr ? 'غائب (Absent)' : 'Absent'}</option>
              <option value="ON_LEAVE">{isAr ? 'إجازة رسمية / معتمدة' : 'On Leave'}</option>
              <option value="WEEKEND">{isAr ? 'عطلة أسبوعية' : 'Weekend'}</option>
            </select>
          </div>

          {formData.status !== 'ABSENT' && formData.status !== 'WEEKEND' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>
                  {isAr ? 'وقت الحضور (Check-In)' : 'Check-In Time'}
                </label>
                <input
                  type="time"
                  value={formData.checkInTime}
                  onChange={e => setFormData({ ...formData, checkInTime: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>
                  {isAr ? 'وقت الانصراف (Check-Out)' : 'Check-Out Time'}
                </label>
                <input
                  type="time"
                  value={formData.checkOutTime}
                  onChange={e => setFormData({ ...formData, checkOutTime: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>
              {isAr ? 'ملاحظات' : 'Notes'}
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder={isAr ? 'ملاحظات إضافية...' : 'Additional notes...'}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '8px 18px' }}>
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary"
              style={{ padding: '8px 24px' }}
            >
              {isSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ الحركة' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import LocationPicker from '@/components/LocationPicker';
import { resetEmployeeDevice } from './actions';

interface Props {
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  branches?: any[];
  lang: string;
  initialData?: any; // if provided = edit mode
}

export default function CreateEmployeeModal({ onClose, onSave, branches = [], lang, initialData }: Props) {
  const isEdit = !!initialData?.id;

  const [formData, setFormData] = useState({
    code: '',
    branchId: '',
    name: '',
    nameAr: '',
    jobTitle: '',
    jobTitleAr: '',
    department: '',
    phone: '',
    basicSalary: 0,
    idNumber: '',
    idExpiry: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    photoUrl: '',
    biometricId: '',
    appPassword: '',
    weekendDays: ['5'], // 5 = الجمعة افتراضياً
    shiftStart: '09:00',
    shiftEnd: '17:00',
    workHoursPerDay: 8,
    workLat: '' as any,
    workLng: '' as any,
    workRadius: 100,
    allowFieldWork: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [boundDeviceId, setBoundDeviceId] = useState<string | null>(initialData?.deviceId || null);
  const [boundDeviceInfo, setBoundDeviceInfo] = useState<string | null>((initialData?.customFields as any)?.deviceInfo || null);
  const [isResettingDevice, setIsResettingDevice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setBoundDeviceId(initialData.deviceId || null);
      setBoundDeviceInfo((initialData.customFields as any)?.deviceInfo || null);
      setFormData({
        code: initialData.code || '',
        branchId: initialData.branchId || '',
        name: initialData.name || '',
        nameAr: initialData.nameAr || '',
        jobTitle: initialData.jobTitle || '',
        jobTitleAr: initialData.jobTitleAr || '',
        department: initialData.department || '',
        phone: initialData.phone || '',
        basicSalary: initialData.basicSalary || 0,
        idNumber: initialData.idNumber || '',
        idExpiry: initialData.idExpiry ? new Date(initialData.idExpiry).toISOString().split('T')[0] : '',
        joinDate: initialData.joinDate ? new Date(initialData.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: initialData.status || 'Active',
        photoUrl: initialData.photoUrl || '',
        biometricId: initialData.biometricId || '',
        appPassword: initialData.appPassword || '',
        weekendDays: initialData.weekendDays ? (typeof initialData.weekendDays === 'string' ? initialData.weekendDays.split(',') : initialData.weekendDays) : ['5'],
        shiftStart: initialData.shiftStart || '09:00',
        shiftEnd: initialData.shiftEnd || '17:00',
        workHoursPerDay: initialData.workHoursPerDay || 8,
        workLat: initialData.workLat !== null && initialData.workLat !== undefined ? initialData.workLat : '',
        workLng: initialData.workLng !== null && initialData.workLng !== undefined ? initialData.workLng : '',
        workRadius: initialData.workRadius || 100,
        allowFieldWork: initialData.allowFieldWork ?? (initialData.customFields as any)?.allowFieldWork ?? false,
      });
      if (initialData.photoUrl) setPhotoPreview(initialData.photoUrl);
    }
  }, [initialData]);

  const handleResetBoundDevice = async () => {
    if (!initialData?.id) return;
    if (window.confirm(lang === 'ar' 
      ? 'هل أنت متأكد من فك ارتباط الهاتف بهذا الموظف؟\nسيتمكن الموظف من استخدام هاتفه الجديد وسيتم توثيقه وربطه تلقائياً عند أول تسجيل حضور.' 
      : 'Reset trusted device binding for this employee?')) {
      setIsResettingDevice(true);
      try {
        const res = await resetEmployeeDevice(initialData.id);
        if (res.success) {
          setBoundDeviceId(null);
          setBoundDeviceInfo(null);
          alert(res.message);
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    
    // Upload to server
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload/employee-photo', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, photoUrl: data.url }));
      } else {
        alert(lang === 'ar' ? 'فشل رفع الصورة' : 'Photo upload failed');
        setPhotoPreview('');
      }
    } catch {
      alert(lang === 'ar' ? 'فشل رفع الصورة' : 'Photo upload failed');
      setPhotoPreview('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      alert(lang === 'ar' ? 'فشل في حفظ البيانات' : 'Failed to save employee');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{isEdit ? (lang === 'ar' ? 'تعديل بيانات الموظف' : 'Edit Employee') : (lang === 'ar' ? 'إضافة موظف جديد' : 'Add New Employee')}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Photo Upload Section */}
          <div className="photo-section">
            <div className="photo-preview-wrap" onClick={() => fileInputRef.current?.click()}>
              {photoPreview ? (
                <img src={photoPreview} alt="Employee Photo" className="photo-preview" />
              ) : (
                <div className="photo-placeholder">
                  <span className="photo-icon">📷</span>
                  <span className="photo-hint">{lang === 'ar' ? 'اضغط لرفع صورة' : 'Click to upload photo'}</span>
                </div>
              )}
              {isUploading && <div className="photo-uploading">{lang === 'ar' ? 'جاري الرفع...' : 'Uploading...'}</div>}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
            <p className="photo-tip">{lang === 'ar' ? 'JPG أو PNG، بحد أقصى 3MB' : 'JPG or PNG, max 3MB'}</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>{lang === 'ar' ? 'الفرع التابع له الموظف' : 'Assigned Branch'}</label>
              <select 
                value={formData.branchId || ''} 
                onChange={e => setFormData({...formData, branchId: e.target.value})}
              >
                <option value="">{lang === 'ar' ? 'الفرع الرئيسي (افتراضي)' : 'Main Branch (Default)'}</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    {lang === 'ar' ? (b.nameAr || b.name) : b.name} {b.isMain ? (lang === 'ar' ? '(رئيسي)' : '(Main)') : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'كود الموظف' : 'Employee Code'}</label>
              <input 
                type="text" 
                value={formData.code} 
                onChange={e => setFormData({...formData, code: e.target.value})} 
                placeholder={lang === 'ar' ? 'يترك فارغاً للتوليد التلقائي' : 'Leave empty for auto-gen'}
              />
            </div>
            
            <div className="form-group">
              <label>{lang === 'ar' ? 'تاريخ الالتحاق' : 'Joining Date'}</label>
              <input 
                type="date" 
                required
                value={formData.joinDate} 
                onChange={e => setFormData({...formData, joinDate: e.target.value})} 
              />
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'الاسم (EN)' : 'Name (EN)'}</label>
              <input 
                type="text" 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'الاسم (AR)' : 'Name (AR)'}</label>
              <input 
                type="text" 
                value={formData.nameAr} 
                onChange={e => setFormData({...formData, nameAr: e.target.value})} 
                placeholder="جون دو"
              />
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'المسمى الوظيفي (EN)' : 'Job Title (EN)'}</label>
              <input 
                type="text" 
                value={formData.jobTitle} 
                onChange={e => setFormData({...formData, jobTitle: e.target.value})} 
                placeholder="Accountant"
              />
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'المسمى الوظيفي (AR)' : 'Job Title (AR)'}</label>
              <input 
                type="text" 
                value={formData.jobTitleAr} 
                onChange={e => setFormData({...formData, jobTitleAr: e.target.value})} 
                placeholder="محاسب"
              />
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'القسم / الإدارة' : 'Department'}</label>
              <input 
                type="text" 
                value={formData.department} 
                onChange={e => setFormData({...formData, department: e.target.value})} 
                placeholder={lang === 'ar' ? 'المحاسبة' : 'Accounting'}
              />
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'رقم الجوال' : 'Phone'}</label>
              <input 
                type="text" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                placeholder="05xxxxxxxx"
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>🔒</span>
                <span>{lang === 'ar' ? 'كلمة مرور تطبيق الهاتف (اختياري)' : 'Mobile App Password'}</span>
              </label>
              <input 
                type="text" 
                value={formData.appPassword} 
                onChange={e => setFormData({...formData, appPassword: e.target.value})} 
                placeholder={lang === 'ar' ? 'مثال: 123456' : 'e.g. 123456'}
              />
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'رقم الإقامة / الهوية' : 'ID / Residence No.'}</label>
              <input 
                type="text" 
                value={formData.idNumber} 
                onChange={e => setFormData({...formData, idNumber: e.target.value})} 
                placeholder="2xxxxxxxxx"
              />
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'تاريخ انتهاء الهوية' : 'ID Expiry Date'}</label>
              <input 
                type="date" 
                value={formData.idExpiry} 
                onChange={e => setFormData({...formData, idExpiry: e.target.value})} 
              />
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'الراتب الأساسي (SAR)' : 'Basic Salary (SAR)'}</label>
              <input 
                type="number" 
                required 
                min={0}
                value={formData.basicSalary} 
                onChange={e => setFormData({...formData, basicSalary: parseFloat(e.target.value)})} 
              />
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'الحالة' : 'Status'}</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Active">{lang === 'ar' ? 'نشط' : 'Active'}</option>
                <option value="Inactive">{lang === 'ar' ? 'غير نشط' : 'Inactive'}</option>
                <option value="OnLeave">{lang === 'ar' ? 'في إجازة' : 'On Leave'}</option>
                <option value="Terminated">{lang === 'ar' ? 'منهي الخدمة' : 'Terminated'}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'معرّف جهاز البصمة (Biometric ID)' : 'Biometric Device ID'}</label>
              <input 
                type="text" 
                value={formData.biometricId} 
                onChange={e => setFormData({...formData, biometricId: e.target.value})} 
                placeholder={lang === 'ar' ? 'مثال: 1001 أو كود البصمة' : 'e.g. 1001'}
              />
            </div>
          </div>

          {/* أوقات الوردية والدوام الرسمي */}
          <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b', margin: 0 }}>
                {lang === 'ar' ? '⏰ نظام الوردية (الشيفت) وساعات العمل' : '⏰ Shift Schedule & Work Hours'}
              </label>
              {/* Quick Shift Presets */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, shiftStart: '08:00', shiftEnd: '14:00', workHoursPerDay: 6 })}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: (formData.shiftStart === '08:00' && formData.shiftEnd === '14:00') ? '#0284c7' : '#ffffff',
                    color: (formData.shiftStart === '08:00' && formData.shiftEnd === '14:00') ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  🌅 {lang === 'ar' ? 'صباحي (08:00 - 14:00)' : 'Morning (8am-2pm)'}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, shiftStart: '14:00', shiftEnd: '20:00', workHoursPerDay: 6 })}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: (formData.shiftStart === '14:00' && formData.shiftEnd === '20:00') ? '#0284c7' : '#ffffff',
                    color: (formData.shiftStart === '14:00' && formData.shiftEnd === '20:00') ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  🌆 {lang === 'ar' ? 'مسائي (14:00 - 20:00)' : 'Evening (2pm-8pm)'}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, shiftStart: '09:00', shiftEnd: '17:00', workHoursPerDay: 8 })}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: (formData.shiftStart === '09:00' && formData.shiftEnd === '17:00') ? '#0284c7' : '#ffffff',
                    color: (formData.shiftStart === '09:00' && formData.shiftEnd === '17:00') ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  🏢 {lang === 'ar' ? 'دوام كامل (09:00 - 17:00)' : 'Full (9am-5pm)'}
                </button>
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
              {lang === 'ar' ? 'اختر أحد النماذج الجاهزة أعلاه أو حدد بداية ونهاية الوردية وساعات العمل يدوياً للموظف' : 'Pick a preset shift or customize start/end time and hours per day'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>{lang === 'ar' ? 'بداية الدوام (حضور)' : 'Shift Start'}</label>
                <input 
                  type="time" 
                  value={formData.shiftStart} 
                  onChange={e => {
                    const newStart = e.target.value;
                    let autoHours = formData.workHoursPerDay;
                    if (newStart && formData.shiftEnd) {
                      const [sh, sm] = newStart.split(':').map(Number);
                      const [eh, em] = formData.shiftEnd.split(':').map(Number);
                      let startMinutes = sh * 60 + sm;
                      let endMinutes = eh * 60 + em;
                      if (endMinutes < startMinutes) endMinutes += 24 * 60; // Cross midnight
                      autoHours = Math.round(((endMinutes - startMinutes) / 60) * 10) / 10;
                    }
                    setFormData({
                      ...formData, 
                      shiftStart: newStart,
                      workHoursPerDay: autoHours > 0 ? autoHours : formData.workHoursPerDay
                    });
                  }} 
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>{lang === 'ar' ? 'نهاية الدوام (انصراف)' : 'Shift End'}</label>
                <input 
                  type="time" 
                  value={formData.shiftEnd} 
                  onChange={e => {
                    const newEnd = e.target.value;
                    let autoHours = formData.workHoursPerDay;
                    if (formData.shiftStart && newEnd) {
                      const [sh, sm] = formData.shiftStart.split(':').map(Number);
                      const [eh, em] = newEnd.split(':').map(Number);
                      let startMinutes = sh * 60 + sm;
                      let endMinutes = eh * 60 + em;
                      if (endMinutes < startMinutes) endMinutes += 24 * 60; // Cross midnight
                      autoHours = Math.round(((endMinutes - startMinutes) / 60) * 10) / 10;
                    }
                    setFormData({
                      ...formData, 
                      shiftEnd: newEnd,
                      workHoursPerDay: autoHours > 0 ? autoHours : formData.workHoursPerDay
                    });
                  }} 
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>{lang === 'ar' ? 'ساعات العمل / يوم' : 'Hours/Day'}</label>
                <input 
                  type="number" 
                  step="0.5"
                  min="1"
                  max="24"
                  value={formData.workHoursPerDay} 
                  onChange={e => setFormData({...formData, workHoursPerDay: parseFloat(e.target.value) || 8})} 
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          </div>

          {/* أيام العطلة الأسبوعية المخصصة للموظف */}
          <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.5rem' }}>
              {lang === 'ar' ? '📅 أيام العطلة الأسبوعية الخاصة بالموظف' : '📅 Employee Weekly Weekend Days'}
            </label>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
              {lang === 'ar' ? 'اختر أيام الراحة الأسبوعية للموظف ليتم تمييزها تلقائياً وعدم احتسابها غياب' : 'Select weekly rest days for this employee'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {[
                { id: '6', ar: 'السبت', en: 'Saturday' },
                { id: '0', ar: 'الأحد', en: 'Sunday' },
                { id: '1', ar: 'الإثنين', en: 'Monday' },
                { id: '2', ar: 'الثلاثاء', en: 'Tuesday' },
                { id: '3', ar: 'الأربعاء', en: 'Wednesday' },
                { id: '4', ar: 'الخميس', en: 'Thursday' },
                { id: '5', ar: 'الجمعة', en: 'Friday' },
              ].map(day => {
                const isSelected = Array.isArray(formData.weekendDays) 
                  ? formData.weekendDays.includes(day.id)
                  : String(formData.weekendDays).split(',').includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => {
                      const current = Array.isArray(formData.weekendDays) 
                        ? [...formData.weekendDays] 
                        : String(formData.weekendDays).split(',').filter(Boolean);
                      let updated;
                      if (current.includes(day.id)) {
                        updated = current.filter(d => d !== day.id);
                      } else {
                        updated = [...current, day.id];
                      }
                      setFormData({ ...formData, weekendDays: updated });
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      color: isSelected ? '#1d4ed8' : '#475569',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? '✓ ' : ''}{lang === 'ar' ? day.ar : day.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* توثيق وقفل جهاز البصمة (منع التلاعب) */}
          <div style={{
            marginTop: '1.25rem',
            background: '#f8fafc',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📱</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                  {lang === 'ar' ? 'توثيق وقفل جهاز البصمة (منع التلاعب)' : 'Trusted Device Binding (Anti-Fraud)'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {lang === 'ar' ? 'يسمح بتسجيل الحضور من هاتف واحد موثق فقط لكل موظف مثل الأنظمة البنكية' : 'Restricts attendance punches to a single authenticated device'}
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: boundDeviceId ? '#ecfdf5' : '#f1f5f9',
              border: boundDeviceId ? '1.5px solid #10b981' : '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.25rem' }}>{boundDeviceId ? '🔒' : '🔓'}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: boundDeviceId ? '#065f46' : '#334155' }}>
                    {boundDeviceId 
                      ? (lang === 'ar' ? `هاتف معتمد وموثق: ${boundDeviceInfo || 'هاتف الموظف'}` : `Bound Device: ${boundDeviceInfo || 'Authorized Phone'}`)
                      : (lang === 'ar' ? 'الحساب غير مقيد بجهاز حالياً' : 'No device bound yet')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: boundDeviceId ? '#047857' : '#64748b', marginTop: '2px' }}>
                    {boundDeviceId 
                      ? (lang === 'ar' ? 'لا يمكن تسجيل الحضور إلا من هذا الهاتف لمنع التلاعب والبصمة بالنيابة.' : 'Attendance can only be registered from this device.')
                      : (lang === 'ar' ? 'سيتم قفل وتوثيق أول هاتف يسجل منه الموظف تلقائياً على حسابه.' : 'The account will automatically bind to the first device used.')}
                  </div>
                </div>
              </div>

              {boundDeviceId && isEdit && (
                <button
                  type="button"
                  onClick={handleResetBoundDevice}
                  disabled={isResettingDevice}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #fca5a5',
                    background: '#fee2e2',
                    color: '#b91c1c',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isResettingDevice ? '⏳...' : (lang === 'ar' ? '🔓 فك الارتباط (تغيير الهاتف)' : 'Reset Device')}
                </button>
              )}
            </div>
          </div>

          {/* إعدادات النطاق الجغرافي وحضور الهاتف */}
          <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            {/* خيار العمل الميداني / بدون تقييد جغرافي */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.75rem 1rem', 
              background: formData.allowFieldWork ? '#ecfdf5' : '#ffffff', 
              borderRadius: '8px', 
              border: formData.allowFieldWork ? '1.5px solid #10b981' : '1px solid #cbd5e1',
              marginBottom: '1rem'
            }}>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', color: formData.allowFieldWork ? '#065f46' : '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🚗 {lang === 'ar' ? 'موظف ميداني (حضور حر من أي موقع)' : 'Field / Mobile Employee (Punch from Anywhere)'}</span>
                </label>
                <div style={{ fontSize: '0.75rem', color: formData.allowFieldWork ? '#047857' : '#64748b', marginTop: '2px' }}>
                  {lang === 'ar' 
                    ? 'مندوب مبيعات، مشتريات، أو صيانة ميدانية: يمكنه تسجيل البصمة من هاتفه أينما كان دون التقييد بالنطاق الجغرافي للشركة.' 
                    : 'Sales reps, field agents: Can punch in/out from any GPS location without distance restrictions.'}
                </div>
              </div>
              <input 
                type="checkbox"
                checked={formData.allowFieldWork}
                onChange={e => setFormData({ ...formData, allowFieldWork: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: '#10b981', cursor: 'pointer' }}
              />
            </div>

            {!formData.allowFieldWork && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                    {lang === 'ar' ? '📍 الموقع الجغرافي المعتمد للبصمة بالهاتف (Geofencing)' : '📍 Work Location GPS Coordinates'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if ('geolocation' in navigator) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setFormData({
                              ...formData,
                              workLat: pos.coords.latitude,
                              workLng: pos.coords.longitude
                            });
                            alert(lang === 'ar' ? 'تم التقاط إحداثيات موقعك الحالي بنجاح!' : 'Current GPS captured successfully!');
                          },
                          (err) => {
                            alert(lang === 'ar' ? `تعذر جلب الموقع: ${err.message}` : `Location error: ${err.message}`);
                          }
                        );
                      } else {
                        alert('Geolocation is not supported by your browser');
                      }
                    }}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      color: '#0f172a',
                      fontWeight: 600
                    }}
                  >
                    {lang === 'ar' ? '🎯 التقاط موقعي الحالي' : '🎯 Capture Current Location'}
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#64748b' }}>{lang === 'ar' ? 'خط العرض (Latitude)' : 'Latitude'}</label>
                    <input 
                      type="number" 
                      step="any"
                      value={formData.workLat} 
                      onChange={e => setFormData({...formData, workLat: e.target.value})} 
                      placeholder="24.7136"
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#64748b' }}>{lang === 'ar' ? 'خط الطول (Longitude)' : 'Longitude'}</label>
                    <input 
                      type="number" 
                      step="any"
                      value={formData.workLng} 
                      onChange={e => setFormData({...formData, workLng: e.target.value})} 
                      placeholder="46.6753"
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#64748b' }}>{lang === 'ar' ? 'نطاق السماح (متر)' : 'Radius (Meters)'}</label>
                    <input 
                      type="number" 
                      value={formData.workRadius} 
                      onChange={e => setFormData({...formData, workRadius: parseFloat(e.target.value) || 100})} 
                      placeholder="100"
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* زر الخريطة التفاعلية */}
                <LocationPicker 
                  lat={formData.workLat ? parseFloat(String(formData.workLat)) : null}
                  lng={formData.workLng ? parseFloat(String(formData.workLng)) : null}
                  radius={formData.workRadius ? Number(formData.workRadius) : 100}
                  onLocationChange={(newLat, newLng) => {
                    setFormData({
                      ...formData,
                      workLat: newLat,
                      workLng: newLng
                    });
                  }}
                  lang={lang}
                />
              </>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); padding: 1rem; }
        .modal-content { background: white; border-radius: 16px; width: 100%; max-width: 680px; padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-header h3 { font-size: 1.25rem; font-weight: 700; color: #0f172a; }
        .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; line-height: 1; }
        .close-btn:hover { color: #475569; }

        .photo-section { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; }
        .photo-preview-wrap { position: relative; width: 100px; height: 100px; border-radius: 50%; cursor: pointer; overflow: hidden; border: 3px dashed #e2e8f0; transition: border-color 0.2s; background: #f8fafc; display: flex; align-items: center; justify-content: center; }
        .photo-preview-wrap:hover { border-color: #6366f1; background: #f0f0ff; }
        .photo-preview { width: 100%; height: 100%; object-fit: cover; }
        .photo-placeholder { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .photo-icon { font-size: 1.8rem; }
        .photo-hint { font-size: 0.65rem; color: #94a3b8; text-align: center; padding: 0 4px; line-height: 1.3; }
        .photo-uploading { position: absolute; inset: 0; background: rgba(255,255,255,0.85); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #6366f1; font-weight: 600; }
        .photo-tip { font-size: 0.72rem; color: #94a3b8; margin: 0; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 2rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group label { font-size: 0.82rem; font-weight: 600; color: #64748b; }
        .form-group input, .form-group select { padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.92rem; transition: border-color 0.15s; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; }
        .btn-secondary { background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.7rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 500; }
        .btn-secondary:hover { background: #f1f5f9; }
        .btn-primary { background: #0f172a; color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600; }
        .btn-primary:hover { background: #1e293b; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

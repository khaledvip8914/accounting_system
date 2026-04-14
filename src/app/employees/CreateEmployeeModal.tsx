'use client';

import React, { useState } from 'react';

export default function CreateEmployeeModal({ onClose, onSave, lang }: { onClose: () => void, onSave: (data: any) => Promise<void>, lang: string }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    nameAr: '',
    jobTitle: '',
    jobTitleAr: '',
    department: '',
    basicSalary: 0,
    idNumber: '',
    idExpiry: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      alert('Failed to save employee');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{lang === 'ar' ? 'إضافة موظف جديد' : 'Add New Employee'}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>{lang === 'ar' ? 'كود الموظف (تلقائي)' : 'Employee Code (Auto)'}</label>
              <input 
                type="text" 
                value={formData.code} 
                onChange={e => setFormData({...formData, code: e.target.value})} 
                placeholder={lang === 'ar' ? 'يترك فارغاً للتوليد التلقائي' : 'Leave empty for auto-gen'}
              />
            </div>
            
            <div className="form-group">
              <label>{lang === 'ar' ? 'تاريخ الالتحاق بالشركة' : 'Joining Date'}</label>
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
              <label>{lang === 'ar' ? 'الراتب الأساسي' : 'Basic Salary'}</label>
              <input 
                type="number" 
                required 
                value={formData.basicSalary} 
                onChange={e => setFormData({...formData, basicSalary: parseFloat(e.target.value)})} 
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ الموظف' : 'Save Employee')}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .modal-content { background: white; border-radius: 16px; width: 100%; max-width: 600px; padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.85rem; font-weight: 600; color: #64748b; }
        .form-group input { padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.95rem; }
        
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; }
        .btn-secondary { background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; }
        .btn-primary { background: #0f172a; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; }
        
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

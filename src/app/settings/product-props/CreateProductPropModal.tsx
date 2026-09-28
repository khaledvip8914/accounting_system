'use client';

import { useState } from 'react';

export default function CreateProductPropModal({
  propToEdit,
  lang,
  onClose,
  onSave
}: {
  propToEdit: any;
  lang: 'ar' | 'en';
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: propToEdit?.name || '',
    nameAr: propToEdit?.nameAr || '',
    type: propToEdit?.type || 'text',
    options: propToEdit?.options?.join(', ') || '',
    isRequired: propToEdit ? propToEdit.isRequired : false,
    isActive: propToEdit ? propToEdit.isActive : true,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setLoading(true);
    
    // Convert comma separated string to array if type is select
    const payload = {
      ...formData,
      options: formData.type === 'select' ? formData.options.split(',').map((s: string) => s.trim()).filter((s: string) => s) : []
    };
    
    await onSave(payload);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="pro-max-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {propToEdit 
              ? (lang === 'ar' ? 'تعديل الخاصية' : 'Edit Characteristic') 
              : (lang === 'ar' ? 'إضافة خاصية جديدة' : 'Add New Characteristic')}
          </h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="input-group">
              <label>{lang === 'ar' ? 'اسم الخاصية' : 'Name'} *</label>
              <input 
                type="text" 
                className="pro-input"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder={lang === 'ar' ? 'مثال: اللون، المقاس...' : 'e.g. Color, Size...'}
              />
            </div>
            <div className="input-group">
              <label>{lang === 'ar' ? 'الاسم بالإنجليزية (اختياري)' : 'Name in English (Optional)'}</label>
              <input 
                type="text" 
                className="pro-input"
                value={formData.nameAr}
                onChange={e => setFormData({...formData, nameAr: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label>{lang === 'ar' ? 'نوع الحقل' : 'Field Type'} *</label>
              <select 
                className="pro-select"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="text">{lang === 'ar' ? 'نص حر (Text)' : 'Text'}</option>
                <option value="number">{lang === 'ar' ? 'رقم (Number)' : 'Number'}</option>
                <option value="select">{lang === 'ar' ? 'قائمة منسدلة (Select/Dropdown)' : 'Select/Dropdown'}</option>
                <option value="boolean">{lang === 'ar' ? 'نعم/لا (Boolean/Checkbox)' : 'Boolean/Checkbox'}</option>
              </select>
            </div>

            {formData.type === 'select' && (
              <div className="input-group">
                <label>{lang === 'ar' ? 'خيارات القائمة المنسدلة' : 'Dropdown Options'} *</label>
                <input 
                  type="text" 
                  className="pro-input"
                  required
                  value={formData.options}
                  onChange={e => setFormData({...formData, options: e.target.value})}
                  placeholder={lang === 'ar' ? 'افصل بين الخيارات بفاصلة (أحمر, أزرق, أخضر)' : 'Comma separated (Red, Blue, Green)'}
                />
              </div>
            )}

            <div className="switches-grid">
              <div className="input-group switch-group">
                <label className="switch-label">
                  <span className="switch-text">{lang === 'ar' ? 'حقل إلزامي؟' : 'Is Required?'}</span>
                  <div className="switch-wrapper">
                    <input 
                      type="checkbox"
                      checked={formData.isRequired}
                      onChange={e => setFormData({...formData, isRequired: e.target.checked})}
                    />
                    <span className="slider"></span>
                  </div>
                </label>
              </div>

              <div className="input-group switch-group">
                <label className="switch-label">
                  <span className="switch-text">{lang === 'ar' ? 'نشط' : 'Active'}</span>
                  <div className="switch-wrapper">
                    <input 
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    />
                    <span className="slider"></span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        .pro-max-modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #0f172a;
        }

        .btn-close {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          color: #64748b;
          cursor: pointer;
          transition: color 0.2s;
        }

        .btn-close:hover { color: #0f172a; }

        .modal-body { padding: 1.5rem; }

        .form-grid {
          display: grid;
          gap: 1.25rem;
        }

        .switches-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #334155;
        }

        .pro-input, .pro-select {
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.95rem;
          color: #0f172a;
          transition: all 0.2s;
        }

        .pro-input:focus, .pro-select:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .switch-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .switch-text {
          font-size: 0.9rem;
          font-weight: 500;
          color: #475569;
        }

        .switch-wrapper {
          position: relative;
          width: 44px;
          height: 24px;
        }

        .switch-wrapper input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #cbd5e1;
          transition: .4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider { background-color: #4f46e5; }
        input:checked + .slider:before { transform: translateX(20px); }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
          margin-top: 1rem;
        }

        .btn-secondary {
          padding: 0.75rem 1.5rem;
          background: white;
          border: 1px solid #cbd5e1;
          color: #475569;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-secondary:hover { background: #f8fafc; }

        .btn-primary {
          padding: 0.75rem 1.5rem;
          background: #4f46e5;
          border: none;
          color: white;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-primary:hover { background: #4338ca; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function CreateWarehouseModal({
  lang,
  onClose,
  onSave,
  isEdit = false,
  initialData = null
}: {
  lang: string,
  onClose: () => void,
  onSave: (data: any) => Promise<any>,
  isEdit?: boolean,
  initialData?: any
}) {
  const [formData, setFormData] = useState(initialData || {
    code: `WH-${Date.now()}`,
    name: '',
    nameAr: '',
    location: ''
  });
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const res = await onSave(formData);
      if (res.success) {
        onClose();
      } else {
        alert(res.error || (lang === 'ar' ? 'فشل الحفظ' : 'Save failed'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="sub-modal-overlay">
      <div className="sub-modal-content">
        <div className="sub-modal-header">
           <h3 style={{ color: '#059669' }}>{isEdit ? (lang === 'ar' ? 'تعديل مستودع' : 'Edit Warehouse') : (lang === 'ar' ? 'إضافة مستودع جديد' : 'Add New Warehouse')}</h3>
           <button onClick={onClose} className="close-x">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="detailed-form">
          <div className="form-grid-modal">
            <div className="form-group">
              <label>{lang === 'ar' ? 'الكود' : 'Code'}</label>
              <input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder={lang === 'ar' ? 'تلقائي إن تُرك فارغاً' : 'Auto if left empty'} />
            </div>
            <div className="form-group">
              <label>{lang === 'ar' ? 'الموقع' : 'Location'}</label>
              <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="form-group">
              <label>{lang === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
              <input required value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} />
            </div>
            <div className="form-group">
              <label>{lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>

          <div className="sub-modal-actions">
            <button type="button" onClick={onClose} disabled={isPending}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" className="btn-primary" style={{ background: '#059669' }} disabled={isPending}>
              {isPending ? '...' : (lang === 'ar' ? 'حفظ البيانات' : 'Save Details')}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .sub-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(4px);
        }
        .sub-modal-content {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          color: #1e293b;
        }
        .sub-modal-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 1.5rem;
           border-bottom: 1px solid #f1f5f9;
           padding-bottom: 1rem;
        }
        .sub-modal-header h3 { margin: 0; font-size: 1.25rem; }
        .close-x { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; }
        
        .form-grid-modal {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.85rem; color: #475569; }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          outline: none;
          font-size: 0.9rem;
        }
        input:focus { border-color: #059669; }

        .sub-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }
        .sub-modal-actions button {
          padding: 0.6rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-primary { color: white; border: none; }
        .btn-primary:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}

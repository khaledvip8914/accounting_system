'use client';

import { useState } from 'react';

export default function CreateCustomerModal({
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
    code: `CUST-${Date.now()}`,
    name: '',
    nameAr: '',
    phone: '',
    email: '',
    address: '',
    taxNumber: '',
    commercialRegistry: ''
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
           <h3>{isEdit ? (lang === 'ar' ? 'تعديل عميل' : 'Edit Customer') : (lang === 'ar' ? 'إضافة عميل جديد' : 'Add New Customer')}</h3>
           <button onClick={onClose} className="close-x">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="detailed-form">
          <div className="form-grid-modal">
            <div className="form-group">
              <label>{lang === 'ar' ? 'الكود' : 'Code'}</label>
              <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
            </div>
            <div className="form-group">
              <label>{lang === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
              <input required value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} />
            </div>
            <div className="form-group">
              <label>{lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
              <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>{lang === 'ar' ? 'الرقم الضريبي' : 'Tax Number'}</label>
              <input value={formData.taxNumber} onChange={e => setFormData({...formData, taxNumber: e.target.value})} />
            </div>
            <div className="form-group">
              <label>{lang === 'ar' ? 'السجل التجاري' : 'Commercial Registry'}</label>
              <input value={formData.commercialRegistry} onChange={e => setFormData({...formData, commercialRegistry: e.target.value})} />
            </div>
            <div className="form-group full-width">
              <label>{lang === 'ar' ? 'العنوان الوطني / التفصيلي' : 'National / Detailed Address'}</label>
              <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
          </div>

          <div className="sub-modal-actions">
            <button type="button" onClick={onClose} disabled={isPending}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" className="btn-primary" disabled={isPending}>
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
          max-width: 650px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          color: #1e293b;
        }
        .sub-modal-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 2rem;
           border-bottom: 1px solid #f1f5f9;
           padding-bottom: 1rem;
        }
        .sub-modal-header h3 { margin: 0; font-size: 1.25rem; color: #0f172a; }
        .close-x { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; }
        
        .form-grid-modal {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .form-group.full-width { grid-column: span 2; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.85rem; color: #475569; }
        input, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          outline: none;
          font-size: 0.9rem;
        }
        input:focus, textarea:focus { border-color: #2563eb; ring: 2px solid #dbeafe; }
        textarea { height: 80px; resize: vertical; }

        .sub-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }
        .sub-modal-actions button {
          padding: 0.6rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-primary { background: #2563eb; color: white; border: none; }
        .btn-primary:hover { background: #1d4ed8; }
      `}</style>
    </div>
  );
}

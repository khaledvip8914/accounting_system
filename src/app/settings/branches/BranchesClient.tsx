'use client';

import { useState } from 'react';
import { Lang } from '@/lib/i18n';
import { createBranch, updateBranch, deleteBranch } from './actions';

export default function BranchesClient({ lang, initialBranches, maxBranches }: { lang: Lang, initialBranches: any[], maxBranches: number }) {
  const [branches, setBranches] = useState(initialBranches);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = (b: any) => {
    setFormData(b);
    setShowModal(true);
  };

  const handleCreateNew = () => {
    if (branches.length >= maxBranches) {
      setError(lang === 'ar' ? `لقد وصلت للحد الأقصى للفروع (${maxBranches}) حسب باقتك الحالية` : `You have reached the max branches limit (${maxBranches}) for your plan`);
      return;
    }
    setFormData({ name: '', nameAr: '', address: '', taxNumber: '', commercialRegistry: '', isMain: false });
    setShowModal(true);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (formData.id) {
        await updateBranch(formData.id, formData);
      } else {
        await createBranch(formData);
      }
      setShowModal(false);
      window.location.reload();
    } catch (err: any) {
      if (err.message.includes('MAX_BRANCHES_REACHED')) {
        setError(lang === 'ar' ? 'لقد وصلت للحد الأقصى للفروع' : 'Max branches limit reached');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, isMain: boolean) => {
    if (isMain) {
      alert(lang === 'ar' ? 'لا يمكن حذف الفرع الرئيسي' : 'Cannot delete main branch');
      return;
    }
    if (confirm(lang === 'ar' ? 'تأكيد الحذف؟' : 'Confirm delete?')) {
      try {
        await deleteBranch(id);
        window.location.reload();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="branches-container">
      <div className="header-actions">
        <h1 className="title">{lang === 'ar' ? 'الفروع' : 'Branches'}</h1>
        <button onClick={handleCreateNew} className="btn-primary" disabled={branches.length >= maxBranches}>
          {lang === 'ar' ? 'إضافة فرع' : 'Add Branch'}
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      
      <div className="info-banner">
        {lang === 'ar' ? `الباقة الحالية تسمح بـ ${maxBranches} فروع. المستخدم: ${branches.length}` : `Current plan allows ${maxBranches} branches. Used: ${branches.length}`}
      </div>

      <div className="grid">
        {branches.map(b => (
          <div key={b.id} className="card">
            <div className="card-header">
              <h3>{lang === 'ar' ? (b.nameAr || b.name) : b.name}</h3>
              {b.isMain && <span className="badge badge-primary">{lang === 'ar' ? 'رئيسي' : 'Main'}</span>}
            </div>
            <div className="card-body">
              <p><strong>{lang === 'ar' ? 'العنوان' : 'Address'}:</strong> {b.address || '-'}</p>
              <p><strong>{lang === 'ar' ? 'الرقم الضريبي' : 'Tax No'}:</strong> {b.taxNumber || '-'}</p>
            </div>
            <div className="card-footer">
              <button onClick={() => handleEdit(b)} className="btn-secondary btn-sm">{lang === 'ar' ? 'تعديل' : 'Edit'}</button>
              {!b.isMain && (
                <button onClick={() => handleDelete(b.id, b.isMain)} className="btn-danger btn-sm">{lang === 'ar' ? 'حذف' : 'Delete'}</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{formData.id ? (lang === 'ar' ? 'تعديل فرع' : 'Edit Branch') : (lang === 'ar' ? 'فرع جديد' : 'New Branch')}</h2>
            <form onSubmit={handleSave} className="form">
              <div className="form-group">
                <label>{lang === 'ar' ? 'الاسم (EN)' : 'Name (EN)'}</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'الاسم (AR)' : 'Name (AR)'}</label>
                <input type="text" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} />
              </div>
              <div className="form-group full-width">
                <label>{lang === 'ar' ? 'العنوان' : 'Address'}</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'الرقم الضريبي (اختياري)' : 'Tax Number (Optional)'}</label>
                <input type="text" value={formData.taxNumber} onChange={e => setFormData({...formData, taxNumber: e.target.value})} />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'السجل التجاري (اختياري)' : 'Commercial Registry'}</label>
                <input type="text" value={formData.commercialRegistry} onChange={e => setFormData({...formData, commercialRegistry: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary" disabled={loading}>{lang === 'ar' ? 'حفظ' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .branches-container { padding: 1rem; max-width: 1200px; margin: 0 auto; }
        .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .title { font-size: 1.5rem; font-weight: 700; color: #1e293b; }
        .info-banner { background: #e0f2fe; color: #0369a1; padding: 0.75rem; border-radius: 8px; margin-bottom: 1.5rem; font-size: 0.875rem; font-weight: 500; }
        .alert-error { background: #fee2e2; color: #991b1b; padding: 0.75rem; border-radius: 8px; margin-bottom: 1.5rem; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .card-header { padding: 1rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
        .card-header h3 { margin: 0; font-size: 1.1rem; color: #0f172a; }
        .card-body { padding: 1rem; flex: 1; font-size: 0.875rem; color: #475569; }
        .card-body p { margin: 0.5rem 0; }
        .card-footer { padding: 1rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 0.5rem; background: #f8fafc; }
        
        .badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
        .badge-primary { background: #dbeafe; color: #1e40af; }
        
        .btn-primary { background: #3b82f6; color: white; padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background 0.2s; }
        .btn-primary:hover:not(:disabled) { background: #2563eb; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-secondary { background: white; color: #475569; padding: 0.5rem 1rem; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; font-weight: 500; }
        .btn-secondary:hover { background: #f8fafc; }
        .btn-danger { background: white; color: #ef4444; padding: 0.5rem 1rem; border: 1px solid #fca5a5; border-radius: 6px; cursor: pointer; font-weight: 500; }
        .btn-danger:hover { background: #fef2f2; }
        .btn-sm { padding: 0.25rem 0.75rem; font-size: 0.875rem; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; padding: 2rem; border-radius: 12px; width: 100%; max-width: 600px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .modal-content h2 { margin-top: 0; margin-bottom: 1.5rem; color: #0f172a; }
        .form { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-group label { font-size: 0.875rem; font-weight: 500; color: #475569; }
        .form-group input { padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; }
        .form-group input:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
        .modal-actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}

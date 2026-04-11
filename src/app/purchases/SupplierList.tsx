'use client';

import { useState, useTransition } from 'react';
import { createSupplier, updateSupplier, deleteSupplier } from './actions';

export default function SupplierList({ suppliers, lang, dict }: { suppliers: any[], lang: string, dict: any }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editingSupplier, setEditingSupplier] = useState<any | null>(null);
  const [formData, setFormData] = useState({ code: '', name: '', nameAr: '', phone: '', email: '' });

  const filtered = (suppliers || []).filter(s => {
    const term = (searchTerm || '').toLowerCase();
    return (
      (s?.name || '').toLowerCase().includes(term) ||
      (s?.nameAr || '').toLowerCase().includes(term) ||
      (s?.code || '').toLowerCase().includes(term)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;
    
    startTransition(async () => {
      let res;
      if (editingSupplier) {
        res = await updateSupplier(editingSupplier.id, formData);
      } else {
        res = await createSupplier(formData);
      }
      
      if (res.success) {
        setShowModal(false);
        setEditingSupplier(null);
        setFormData({ code: '', name: '', nameAr: '', phone: '', email: '' });
      } else {
        alert(res.error || (lang === 'ar' ? 'فشل الحفظ' : 'Failed to save'));
      }
    });
  };

  const openNew = () => {
    setEditingSupplier(null);
    setFormData({ code: `SUPP-${Date.now()}`, name: '', nameAr: '', phone: '', email: '' });
    setShowModal(true);
  };

  const openEdit = (supplier: any) => {
    setEditingSupplier(supplier);
    setFormData({
      code: supplier.code || '',
      name: supplier.name || '',
      nameAr: supplier.nameAr || '',
      phone: supplier.phone || '',
      email: supplier.email || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    const msg = lang === 'ar' ? `هل أنت متأكد من حذف المورد "${name}"؟` : `Are you sure you want to delete supplier "${name}"?`;
    const subMsg = lang === 'ar' ? "سيتم حذف حساب المورد من شجرة الحسابات أيضاً إذا لم يكن له قيود مسبقة." : "The associated ledger account will be deleted if it has no entries.";

    if (!confirm(msg + "\n\n" + subMsg)) return;

    startTransition(async () => {
      const res = await deleteSupplier(id);
      if (!res.success) {
        alert(res.error || (lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error during deletion'));
      }
    });
  };

  return (
    <div className="suppliers-module">
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">{lang === 'ar' ? 'إدارة الموردين' : 'Supplier Management'}</h2>
          <button className="btn-primary no-print" onClick={openNew}>
            {lang === 'ar' ? '+ مورد جديد' : '+ New Supplier'}
          </button>
        </div>

        <div className="filter-bar no-print" style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
           <input 
             type="text" 
             placeholder={lang === 'ar' ? "البحث عن مورد..." : "Search suppliers..."}
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="search-input"
             style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ddd' }}
           />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{lang === 'ar' ? 'الكود' : 'Code'}</th>
                <th>{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                <th>{lang === 'ar' ? 'الهاتف' : 'Phone'}</th>
                <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الرصيد الحسابي' : 'Accounting Balance'}</th>
                <th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td><span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>{s.code}</span></td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{lang === 'ar' && s.nameAr ? s.nameAr : s.name}</div>
                    <div className="text-sub" style={{ fontSize: '0.75rem' }}>{s.email || ''}</div>
                  </td>
                  <td className="text-secondary">{s.phone || '-'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    {((s.balance != null ? s.balance : s.openingBalance) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="no-print">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn-text" onClick={() => openEdit(s)} title={lang === 'ar' ? 'تعديل' : 'Edit'}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button className="btn-text danger" onClick={() => handleDelete(s.id, lang === 'ar' && s.nameAr ? s.nameAr : s.name)} title={lang === 'ar' ? 'حذف' : 'Delete'}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingSupplier 
                  ? (lang === 'ar' ? 'تعديل بيانات المورد' : 'Edit Supplier')
                  : (lang === 'ar' ? 'مورد جديد' : 'New Supplier')
                }
              </h2>
              <button className="close-btn" onClick={() => setShowModal(false)} type="button">×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{lang === 'ar' ? 'الكود' : 'Code'}</label>
                  <input required type="text" className="form-input" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">{lang === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
                  <input required type="text" className="form-input" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">{lang === 'ar' ? 'الاسم (انجليزي)' : 'Name (English)'}</label>
                  <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
                  <input type="text" className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                  <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={isPending}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary" disabled={isPending}>
                  {isPending ? '⏳...' : (lang === 'ar' ? 'حفظ' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

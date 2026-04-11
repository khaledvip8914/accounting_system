'use client';

import { useState, useTransition } from 'react';
import { createCustomer, updateCustomer, deleteCustomer } from './actions';

export default function CustomerList({ customers, lang, dict }: { customers: any[], lang: string, dict: any }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [formData, setFormData] = useState({ code: '', name: '', nameAr: '', phone: '', email: '' });

  const filtered = (customers || []).filter(c => {
    const s = (searchTerm || '').toLowerCase();
    return (
      (c?.name || '').toLowerCase().includes(s) ||
      (c?.nameAr || '').toLowerCase().includes(s) ||
      (c?.code || '').toLowerCase().includes(s)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;
    
    startTransition(async () => {
      let res;
      if (editingCustomer) {
        res = await updateCustomer(editingCustomer.id, formData);
      } else {
        res = await createCustomer(formData);
      }
      
      if (res.success) {
        setShowModal(false);
        setEditingCustomer(null);
        setFormData({ code: '', name: '', nameAr: '', phone: '', email: '' });
      } else {
        alert(res.error || (lang === 'ar' ? 'فشل الحفظ' : 'Failed to save'));
      }
    });
  };

  const openNew = () => {
    setEditingCustomer(null);
    setFormData({ code: `CUST-${Date.now()}`, name: '', nameAr: '', phone: '', email: '' });
    setShowModal(true);
  };

  const openEdit = (customer: any) => {
    setEditingCustomer(customer);
    setFormData({
      code: customer.code || '',
      name: customer.name || '',
      nameAr: customer.nameAr || '',
      phone: customer.phone || '',
      email: customer.email || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    const msg = lang === 'ar' ? `هل أنت متأكد من حذف العميل "${name}"؟` : `Are you sure you want to delete customer "${name}"?`;
    const subMsg = lang === 'ar' ? "سيتم حذف حساب العميل من شجرة الحسابات أيضاً إذا لم يكن له قيود مسبقة." : "The associated ledger account will be deleted if it has no entries.";
    
    if (!confirm(msg + "\n\n" + subMsg)) return;

    startTransition(async () => {
      const res = await deleteCustomer(id);
      if (!res.success) {
        alert(res.error || (lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error during deletion'));
      }
    });
  };

  return (
    <div className="customers-module">
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">{lang === 'ar' ? 'إدارة العملاء' : 'Customer Management'}</h2>
          <button className="btn-primary no-print" onClick={openNew}>
            {lang === 'ar' ? '+ عميل جديد' : '+ New Customer'}
          </button>
        </div>

        <div className="filter-bar no-print" style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
           <input 
             type="text" 
             placeholder={lang === 'ar' ? "البحث عن عميل..." : "Search customers..."}
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
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><span className="badge">{c.code}</span></td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{lang === 'ar' && c.nameAr ? c.nameAr : c.name}</div>
                    <div className="text-sub" style={{ fontSize: '0.75rem' }}>{c.email || ''}</div>
                  </td>
                  <td className="text-secondary">{c.phone || '-'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    {((c.balance != null ? c.balance : c.openingBalance) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="no-print">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn-text" onClick={() => openEdit(c)} title={lang === 'ar' ? 'تعديل' : 'Edit'}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button className="btn-text danger" onClick={() => handleDelete(c.id, lang === 'ar' && c.nameAr ? c.nameAr : c.name)} title={lang === 'ar' ? 'حذف' : 'Delete'}>
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
                {editingCustomer 
                  ? (lang === 'ar' ? 'تعديل بيانات العميل' : 'Edit Customer')
                  : (lang === 'ar' ? 'عميل جديد' : 'New Customer')
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
      <style jsx>{`
        .customers-module { color: inherit; }
        .card-title { color: var(--text-primary) !important; font-weight: 700 !important; }
        .table-container th { color: var(--text-secondary) !important; border-bottom: 1px solid var(--glass-border); background: rgba(255, 255, 255, 0.05); text-align: right; }
        .table-container td { color: inherit !important; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .search-input { color: var(--text-primary) !important; background: var(--glass-bg) !important; border: 1px solid var(--glass-border) !important; }
        .btn-text { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 4px; transition: background 0.2s; color: var(--text-secondary); }
        .btn-text:hover { background: var(--glass-hover); color: var(--text-primary); }
        .btn-text.danger:hover { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
      `}</style>
    </div>
  );
}

'use client';

import React, { useState, useTransition } from 'react';
import { createAccount, deleteAccount, seedProfessionalAccounts, updateAccount, translateText } from './actions';

type Account = {
  id: string;
  code: string;
  name: string;
  nameAr: string | null;
  type: string;
  nature: string;
  description: string | null;
  parentId: string | null;
  balance: number;
  totalDebit: number;
  totalCredit: number;
  children?: Account[];
};

export default function AccountsClient({ initialAccounts, dict, lang }: { initialAccounts: Account[], dict: any, lang: string }) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({ 
    code: '', 
    name: '', 
    nameAr: '', 
    type: 'Asset', 
    nature: 'Debit', 
    description: '', 
    parentId: '' 
  });
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [translatingEn, setTranslatingEn] = useState(false);
  const [translatingAr, setTranslatingAr] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState<string>("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, name: string } | null>(null);

  const handleTranslateToAr = async () => {
    if (!formData.name) return;
    setTranslatingAr(true);
    const res = await translateText(formData.name, 'en', 'ar');
    if (res && res.success && res.text) {
      setFormData(prev => ({ ...prev, nameAr: res.text }));
    } else {
      alert("Translation failed or currently unavailable");
    }
    setTranslatingAr(false);
  };

  const handleTranslateToEn = async () => {
    if (!formData.nameAr) return;
    setTranslatingEn(true);
    const res = await translateText(formData.nameAr, 'ar', 'en');
    if (res && res.success && res.text) {
      setFormData(prev => ({ ...prev, name: res.text }));
    } else {
      alert("Translation failed or currently unavailable");
    }
    setTranslatingEn(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) return;

    startTransition(async () => {
      let typeToSave = formData.type;
      let natureToSave = formData.nature;
      if (formData.parentId) {
        const parent = initialAccounts.find(a => a.id === formData.parentId);
        if (parent) {
          typeToSave = parent.type;
          natureToSave = parent.nature;
        }
      }
      
      let res;
      if (editingId) {
        res = await updateAccount(editingId, { 
          code: formData.code, 
          name: formData.name, 
          nameAr: formData.nameAr,
          nature: natureToSave,
          description: formData.description
        });
      } else {
        res = await createAccount({ 
          ...formData, 
          type: typeToSave, 
          nature: natureToSave 
        });
      }

      if (res.success) {
        setShowModal(false);
        setEditingId(null);
        setFormData({ code: '', name: '', nameAr: '', type: 'Asset', nature: 'Debit', description: '', parentId: '' });
      } else {
        alert(res.error);
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const { id, name } = deleteConfirm;
    
    try {
      setIsDeleting(id);
      setDeleteConfirm(null); // Close modal
      setDebugMessage(`Trying to delete ${name} (${id})...`);
      
      const res = await deleteAccount(id);
      if (!res.success) {
        setDebugMessage(`Error: ${res.error}`);
        alert(res.error);
      } else {
        setDebugMessage(`Successfully deleted ${name}`);
      }
    } catch (err: any) {
      console.error("Delete call failed:", err);
      setDebugMessage(`Technical error: ${err.message}`);
      alert(lang === 'ar' ? "حدث خطأ أثناء المحاولة" : "An error occurred during the attempt");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSeed = () => {
    startTransition(async () => {
      const res = await seedProfessionalAccounts();
      if (!res.success) {
        alert(res.error);
      }
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedParents(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const openAddChildModal = (parent: Account) => {
    setEditingId(null);
    let nextCode = parent.code + '01';
    if (parent.children && parent.children.length > 0) {
      const childCodes = parent.children.map(c => Number(c.code)).filter(n => !isNaN(n));
      if (childCodes.length > 0) {
        nextCode = String(Math.max(...childCodes) + 1);
      }
    }
    setFormData({ 
      code: nextCode, 
      name: '', 
      nameAr: '', 
      type: parent.type, 
      nature: parent.nature, 
      description: '', 
      parentId: parent.id 
    });
    setShowModal(true);
  };

  const openAddParentModal = () => {
    setEditingId(null);
    setFormData({ code: '', name: '', nameAr: '', type: 'Asset', nature: 'Debit', description: '', parentId: '' });
    setShowModal(true);
  };

  const openEditModal = (acc: Account) => {
    setEditingId(acc.id);
    setFormData({ 
      code: acc.code, 
      name: acc.name, 
      nameAr: acc.nameAr || '', 
      type: acc.type, 
      nature: acc.nature, 
      description: acc.description || '', 
      parentId: acc.parentId || '' 
    });
    setShowModal(true);
  };

  const translateType = (type: string) => {
    if (lang !== 'ar') return type;
    switch(type) {
      case 'Asset': return 'أصول';
      case 'Liability': return 'خصوم';
      case 'Equity': return 'حقوق ملكية';
      case 'Revenue': return 'إيرادات';
      case 'Expense': return 'مصروفات';
      default: return type;
    }
  };

  const translateNature = (nature: string) => {
    if (lang !== 'ar') return nature;
    return nature === 'Debit' ? 'مدين' : 'دائن';
  };

  const getBadgeClass = (type: string) => {
    switch(type) {
      case 'Asset': return 'status paid'; 
      case 'Liability': return 'status pending'; 
      case 'Equity': return 'status'; 
      case 'Revenue': return 'status paid';
      case 'Expense': return 'status overdue'; 
      default: return 'status';
    }
  };

  const renderRow = (acc: Account, depth = 0) => {
    const hasChildren = acc.children && acc.children.length > 0;
    const isExpanded = expandedParents[acc.id];

    return (
      <React.Fragment key={acc.id}>
        <tr style={{ background: depth > 0 ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
          <td style={{ display: 'flex', alignItems: 'center', paddingLeft: `${depth * 1.5 + 1}rem` }}>
            {hasChildren ? (
              <button 
                onClick={() => toggleExpand(acc.id)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginRight: '0.5rem', width: '20px' }}
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            ) : (
              <span style={{ width: '28px' }}></span>
            )}
            {depth > 0 && <span style={{ color: 'var(--glass-border)', marginRight: '0.5rem' }}>└─</span>}
            <span style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{acc.code}</span>
          </td>
          <td style={{ fontWeight: depth > 0 ? 'normal' : '600' }}>{lang === 'ar' && acc.nameAr ? acc.nameAr : acc.name}</td>
          <td>
            <span className={getBadgeClass(acc.type)}>{translateType(acc.type)}</span>
          </td>
          <td style={{ textAlign: 'center' }}>
            <span style={{ 
                color: acc.nature === 'Debit' ? 'var(--accent-success)' : 'var(--accent-danger)',
                fontWeight: '500',
                fontSize: '0.85rem'
            }}>
                {translateNature(acc.nature)}
            </span>
          </td>
          <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {acc.description || '—'}
          </td>
          <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
            <a 
              href={`/financial?tab=ledger&accountId=${acc.id}`}
              style={{ 
                fontWeight: '700', 
                color: acc.balance < 0 ? 'var(--accent-danger)' : 'var(--accent-primary)',
                textDecoration: 'none',
                borderBottom: '1px dashed currentColor',
                cursor: 'pointer'
              }}
              title={lang === 'ar' ? 'فتح كشف الحساب' : 'Open Account Statement'}
            >
              {acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </a>
          </td>
          <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            {(acc.totalDebit > 0 || acc.totalCredit > 0) ? '✓' : '—'}
          </td>
          <td>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button 
                onClick={() => openAddChildModal(acc)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-tertiary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                title="Add Sub-Account"
              >
                {dict.subAccount}
              </button>
              <button 
                onClick={() => openEditModal(acc)}
                disabled={isPending}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                title={lang === 'ar' ? 'تعديل' : 'Edit'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button 
                onClick={() => handleDelete(acc.id, lang === 'ar' && acc.nameAr ? acc.nameAr : acc.name)}
                disabled={isDeleting === acc.id}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: isDeleting === acc.id ? 'not-allowed' : 'pointer', 
                  color: isDeleting === acc.id ? 'var(--text-secondary)' : 'var(--accent-danger)',
                  opacity: isDeleting === acc.id ? 0.5 : 1
                }}
                title={lang === 'ar' ? 'حذف الحساب' : "Delete Account"}
              >
                {isDeleting === acc.id ? '...' : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                )}
              </button>
            </div>
          </td>
        </tr>
        {isExpanded && acc.children && acc.children.map(child => renderRow(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="page-content">
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">{dict.title}</h1>
          <p className="page-subtitle">{dict.subtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {initialAccounts.length === 0 && (
            <button className="btn-secondary" onClick={handleSeed} disabled={isPending}>
              {isPending ? dict.generating : dict.generatePro}
            </button>
          )}
          <button className="btn-primary" onClick={openAddParentModal}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            {dict.newAccount}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{dict.allAccounts}</h2>
          <div className="search-container" style={{ width: '250px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder={dict.search} />
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{dict.code}</th>
                <th>{dict.name}</th>
                <th>{dict.type}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'طبيعة الحساب' : 'Nature'}</th>
                <th>{lang === 'ar' ? 'الوصف' : 'Description'}</th>
                <th style={{ textAlign: 'right', paddingRight: '1rem' }}>{lang === 'ar' ? 'الرصيد' : 'Balance'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'حركات' : 'Tx'}</th>
                <th>{dict.actions}</th>
              </tr>
            </thead>
            <tbody>
              {initialAccounts.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    {dict.noAccounts}
                  </td>
                </tr>
              )}
              {initialAccounts.map(acc => renderRow(acc, 0))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingId 
                  ? (lang === 'ar' ? 'تعديل الحساب' : 'Edit Account') 
                  : (formData.parentId ? dict.createSub : dict.createMain)}
              </h2>
              <button className="close-btn" onClick={() => { setShowModal(false); setEditingId(null); }} type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="form-group">
                  <label className="form-label" style={{ textAlign: lang === 'ar' ? 'right' : 'left', display: 'block', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'رقم الحساب' : 'Account Number'}
                  </label>
                  <input required type="text" className="form-input" style={{ border: '1.5px solid #204C6C', borderRadius: '8px' }} placeholder={lang === 'ar' ? "مثال: 1104" : "e.g., 1104"} value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                </div>
                
                <div className="form-group">
                  <label className="form-label" style={{ textAlign: lang === 'ar' ? 'right' : 'left', display: 'block', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'الاسم بالعربية' : 'Name in Arabic'}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
                    <input type="text" className="form-input" style={{ flex: 1, borderRadius: '8px' }} placeholder={lang === 'ar' ? "اسم الحساب بالعربية" : "Arabic Name"} value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} />
                    <button type="button" onClick={handleTranslateToAr} disabled={translatingAr || !formData.name} style={{ border: '1px solid #cbd5e0', background: '#f8fafc', borderRadius: '8px', padding: '0 0.8rem', cursor: (!translatingAr && formData.name) ? 'pointer' : 'not-allowed', opacity: (!formData.name || translatingAr) ? 0.5 : 1, color: '#3182ce' }} title={lang === 'ar' ? 'ترجمة من الإنجليزية' : 'Translate from English'}>
                      {translatingAr ? '...' : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ textAlign: lang === 'ar' ? 'right' : 'left', display: 'block', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'الاسم بالإنجليزية' : 'Name in English'}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
                    <input required type="text" className="form-input" style={{ flex: 1, borderRadius: '8px' }} placeholder={lang === 'ar' ? "اسم الحساب بالإنجليزية" : "English Name"} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <button type="button" onClick={handleTranslateToEn} disabled={translatingEn || !formData.nameAr} style={{ border: '1px solid #cbd5e0', background: '#f8fafc', borderRadius: '8px', padding: '0 0.8rem', cursor: (!translatingEn && formData.nameAr) ? 'pointer' : 'not-allowed', opacity: (!formData.nameAr || translatingEn) ? 0.5 : 1, color: '#3182ce' }} title={lang === 'ar' ? 'ترجمة من العربية' : 'Translate from Arabic'}>
                      {translatingEn ? '...' : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>}
                    </button>
                  </div>
                </div>

                {!formData.parentId && (
                  <div className="form-group">
                    <label className="form-label" style={{ textAlign: lang === 'ar' ? 'right' : 'left', display: 'block', color: 'var(--text-secondary)' }}>{dict.type}</label>
                    <select required className="form-select" style={{ borderRadius: '8px' }} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="Asset">{lang === 'ar' ? 'الأصول' : 'Asset'}</option>
                      <option value="Liability">{lang === 'ar' ? 'الخصوم' : 'Liability'}</option>
                      <option value="Equity">{lang === 'ar' ? 'حقوق الملكية' : 'Equity'}</option>
                      <option value="Revenue">{lang === 'ar' ? 'الإيرادات' : 'Revenue'}</option>
                      <option value="Expense">{lang === 'ar' ? 'المصروفات' : 'Expense'}</option>
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" style={{ textAlign: lang === 'ar' ? 'right' : 'left', display: 'block', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'طبيعة الحساب' : 'Account Nature'}
                  </label>
                  <select required className="form-select" style={{ borderRadius: '8px' }} value={formData.nature} onChange={e => setFormData({...formData, nature: e.target.value})}>
                    <option value="Debit">{lang === 'ar' ? 'مدين' : 'Debit'}</option>
                    <option value="Credit">{lang === 'ar' ? 'دائن' : 'Credit'}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ textAlign: lang === 'ar' ? 'right' : 'left', display: 'block', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'الوصف' : 'Description'}
                  </label>
                  <textarea 
                    className="form-input" 
                    style={{ borderRadius: '8px', minHeight: '80px', paddingTop: '0.5rem' }} 
                    placeholder={lang === 'ar' ? "وصف إضافي للحساب" : "Additional description"} 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                  />
                </div>
                
                <button type="submit" disabled={isPending} style={{ width: '100%', padding: '0.85rem', marginTop: '1rem', background: '#7D9BB3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {isPending ? dict.saving || 'Saving...' : (lang === 'ar' ? 'حفظ' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
            <div style={{ color: 'var(--accent-danger)', marginBottom: '1.5rem' }}>
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
                {lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                {lang === 'ar' 
                  ? `هل أنت متأكد من رغبتك في حذف الحساب "${deleteConfirm.name}"؟` 
                  : `Are you sure you want to delete "${deleteConfirm.name}"?`}
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={confirmDelete}
                style={{ flex: 1, padding: '0.75rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {lang === 'ar' ? 'نعم، حذف' : 'Yes, Delete'}
              </button>
              <button 
                onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, padding: '0.75rem', background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

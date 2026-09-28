'use client';

import React, { useState, useEffect } from 'react';
import { Lang } from '@/lib/i18n';
import Link from 'next/link';

interface AnalysisDimensionsClientProps {
  lang: Lang;
  dict: any;
  companyId: string;
}

export default function AnalysisDimensionsClient({ lang, dict, companyId }: AnalysisDimensionsClientProps) {
  const [dimensions, setDimensions] = useState<any[]>([]);
  const [selectedDimension, setSelectedDimension] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDimModalOpen, setIsDimModalOpen] = useState(false);
  const [editingDim, setEditingDim] = useState<any>(null);
  const [dimForm, setDimForm] = useState({ name: '', nameAr: '', isActive: true });

  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<any>(null);
  const [valueForm, setValueForm] = useState({ code: '', name: '', nameAr: '', isActive: true, parentId: null as string | null });
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const fetchDimensions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/settings/dimensions?companyId=${companyId}`);
      if (res.ok) {
        const data = await res.json();
        setDimensions(data);
        if (selectedDimension) {
          setSelectedDimension(data.find((d: any) => d.id === selectedDimension.id) || null);
        } else if (data.length > 0) {
          setSelectedDimension(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDimensions();
  }, [companyId]);

  // Dimension Handlers
  const openDimModal = (dim?: any) => {
    if (dim) {
      setEditingDim(dim);
      setDimForm({ name: dim.name, nameAr: dim.nameAr || '', isActive: dim.isActive });
    } else {
      setEditingDim(null);
      setDimForm({ name: '', nameAr: '', isActive: true });
    }
    setIsDimModalOpen(true);
  };

  const saveDim = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingDim ? `/api/v1/settings/dimensions/${editingDim.id}` : '/api/v1/settings/dimensions';
      const res = await fetch(url, {
        method: editingDim ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dimForm, companyId }),
      });
      if (res.ok) {
        fetchDimensions();
        setIsDimModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || 'Error saving dimension');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDim = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'تأكيد الحذف؟' : 'Confirm deletion?')) return;
    try {
      const res = await fetch(`/api/v1/settings/dimensions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedDimension(null);
        fetchDimensions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Value Handlers
  const openValueModal = (val?: any, parentId?: string | null) => {
    if (val) {
      setEditingValue(val);
      setValueForm({ code: val.code, name: val.name, nameAr: val.nameAr || '', isActive: val.isActive, parentId: val.parentId || null });
    } else {
      setEditingValue(null);
      let nextCode = '';
      if (selectedDimension && selectedDimension.values) {
        let baseCode = '';
        if (parentId) {
          const parent = selectedDimension.values.find((v: any) => v.id === parentId);
          if (parent) baseCode = parent.code;
        }
        const siblings = selectedDimension.values.filter((v: any) => v.parentId === (parentId || null));
        if (siblings.length === 0) {
          nextCode = baseCode ? `${baseCode}1` : '1';
        } else {
          let maxSuffix = 0;
          for (const sibling of siblings) {
            const code = sibling.code;
            if (baseCode && code.startsWith(baseCode)) {
              const suffix = parseInt(code.substring(baseCode.length), 10);
              if (!isNaN(suffix) && suffix > maxSuffix) maxSuffix = suffix;
            } else if (!baseCode) {
              const suffix = parseInt(code, 10);
              if (!isNaN(suffix) && suffix > maxSuffix) maxSuffix = suffix;
            }
          }
          nextCode = baseCode ? `${baseCode}${maxSuffix + 1}` : `${maxSuffix + 1}`;
        }
      }
      setValueForm({ code: nextCode, name: '', nameAr: '', isActive: true, parentId: parentId || null });
    }
    setIsValueModalOpen(true);
  };


  const handleParentChange = (newParentId: string | null) => {
    let nextCode = '';
    if (selectedDimension && selectedDimension.values) {
      let baseCode = '';
      if (newParentId) {
        const parent = selectedDimension.values.find((v: any) => v.id === newParentId);
        if (parent) baseCode = parent.code;
      }
      const siblings = selectedDimension.values.filter((v: any) => v.parentId === newParentId);
      if (siblings.length === 0) {
        nextCode = baseCode ? `${baseCode}1` : '1';
      } else {
        let maxSuffix = 0;
        for (const sibling of siblings) {
          const code = sibling.code;
          if (baseCode && code.startsWith(baseCode)) {
            const suffix = parseInt(code.substring(baseCode.length), 10);
            if (!isNaN(suffix) && suffix > maxSuffix) maxSuffix = suffix;
          } else if (!baseCode) {
            const suffix = parseInt(code, 10);
            if (!isNaN(suffix) && suffix > maxSuffix) maxSuffix = suffix;
          }
        }
        nextCode = baseCode ? `${baseCode}${maxSuffix + 1}` : `${maxSuffix + 1}`;
      }
    }
    setValueForm(prev => ({...prev, parentId: newParentId, code: nextCode}));
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({...prev, [nodeId]: !prev[nodeId]}));
  };

  const renderValuesTree = (values: any[], parentId: string | null = null, level: number = 0) => {
    const children = values.filter(v => v.parentId === parentId);
    if (children.length === 0) return null;
    
    return children.map(v => {
      const hasChildren = values.some(child => child.parentId === v.id);
      const isExpanded = expandedNodes[v.id];
      
      return (
        <React.Fragment key={v.id}>
          <tr>
            <td style={{ fontFamily: 'monospace', textAlign: lang === 'ar' ? 'right' : 'left', paddingLeft: lang === 'ar' ? 0 : `${level * 2}rem`, paddingRight: lang === 'ar' ? `${level * 2}rem` : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {hasChildren ? (
                  <button onClick={() => toggleNode(v.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    {isExpanded ? '▼' : (lang === 'ar' ? '◀' : '▶')}
                  </button>
                ) : <span style={{ width: '16px' }}></span>}
                {v.code}
              </div>
            </td>
            <td style={{ textAlign: 'center' }}>{lang === 'ar' ? (v.nameAr || v.name) : v.name}</td>
            <td style={{ textAlign: 'center' }}>
              <span className={`status ${v.isActive ? 'paid' : 'overdue'}`}>
                {v.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'غير نشط' : 'Inactive')}
              </span>
            </td>
            <td style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => openValueModal(null, v.id)}>{lang === 'ar' ? '+ تفريع' : '+ Child'}</button>
                <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => openValueModal(v)}>{lang === 'ar' ? 'تعديل' : 'Edit'}</button>
                <button style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => deleteValue(v.id)}>{lang === 'ar' ? 'حذف' : 'Delete'}</button>
              </div>
            </td>
          </tr>
          {isExpanded && renderValuesTree(values, v.id, level + 1)}
        </React.Fragment>
      );
    });
  };

  const saveValue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDimension) return;
    try {
      const url = editingValue 
        ? `/api/v1/settings/dimensions/${selectedDimension.id}/values/${editingValue.id}`
        : `/api/v1/settings/dimensions/${selectedDimension.id}/values`;
      
      const res = await fetch(url, {
        method: editingValue ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valueForm),
      });

      if (res.ok) {
        fetchDimensions();
        setIsValueModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || 'Error saving value');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteValue = async (valId: string) => {
    if (!confirm(lang === 'ar' ? 'تأكيد الحذف؟' : 'Confirm deletion?')) return;
    try {
      const res = await fetch(`/api/v1/settings/dimensions/${selectedDimension.id}/values/${valId}`, { method: 'DELETE' });
      if (res.ok) fetchDimensions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/settings" className="action-btn" title={lang === 'ar' ? 'العودة للإعدادات' : 'Back to Settings'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {lang === 'ar' ? <polyline points="15 18 9 12 15 6"></polyline> : <polyline points="9 18 15 12 9 6"></polyline>}
            </svg>
          </Link>
          <div>
            <h1 className="page-title">{dict.settings.analysisDimensions || (lang === 'ar' ? 'إعدادات الأبعاد (مراكز التكلفة)' : 'Dimensions Settings')}</h1>
            <p className="page-subtitle">{lang === 'ar' ? 'إدارة الأبعاد التحليلية (مراكز التكلفة) للحركات المالية' : 'Manage analytical dimensions for financial transactions'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/reports?tab=dimensions" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            {lang === 'ar' ? 'تقارير الأبعاد' : 'Dimensions Reports'}
          </Link>
          <button className="btn-primary" onClick={() => openDimModal()}>
            {lang === 'ar' ? '+ بُعد جديد' : '+ New Dimension'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading...</div>
      ) : (
        <div className="dimensions-grid">
          {/* Sidebar: Dimensions List */}
          <div className="card">
            <h2 className="card-title" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              {lang === 'ar' ? 'الأبعاد' : 'Dimensions'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {dimensions.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{lang === 'ar' ? 'لا يوجد أبعاد' : 'No dimensions'}</div>
              ) : (
                dimensions.map(d => (
                  <div 
                    key={d.id} 
                    className={`dim-item ${selectedDimension?.id === d.id ? 'active' : ''}`}
                    onClick={() => setSelectedDimension(d)}
                  >
                    <div>
                      <div style={{ fontWeight: '600' }}>{lang === 'ar' ? (d.nameAr || d.name) : d.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d.values.length} {lang === 'ar' ? 'قيمة' : 'Values'}</div>
                    </div>
                    <div className="dim-actions">
                      <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '0 5px' }} onClick={(e) => { e.stopPropagation(); openDimModal(d); }}>✎</button>
                      <button style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer', padding: '0 5px' }} onClick={(e) => { e.stopPropagation(); deleteDim(d.id); }}>🗑</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Main Area: Dimension Values */}
          <div className="card">
            {selectedDimension ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 className="card-title">{lang === 'ar' ? (selectedDimension.nameAr || selectedDimension.name) : selectedDimension.name}</h2>
                  <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => openValueModal(null, null)}>
                    {lang === 'ar' ? '+ إضافة مركز تكلفة' : '+ Add Cost Center'}
                  </button>
                </div>

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الرمز' : 'Code'}</th>
                        <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                        <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                        <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDimension.values.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            {lang === 'ar' ? 'لا يوجد قيم مضافة لهذا البعد' : 'No values added to this dimension'}
                          </td>
                        </tr>
                      ) : (
                        renderValuesTree(selectedDimension.values, null, 0)
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div style={{ height: '100%', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'اختر بُعداً لعرض قيمه' : 'Select a dimension to view its values'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dimension Modal */}
      {isDimModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-custom">
            <div className="modal-header-custom">
              <h2>{editingDim ? (lang === 'ar' ? 'تعديل البعد' : 'Edit Dimension') : (lang === 'ar' ? 'بعد جديد' : 'New Dimension')}</h2>
              <button className="close-btn" onClick={() => setIsDimModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={saveDim} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="custom-input-group">
                <label>{lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
                <input type="text" className="custom-input" value={dimForm.name} onChange={e => setDimForm({...dimForm, name: e.target.value})} required />
              </div>
              <div className="custom-input-group">
                <label>{lang === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
                <input type="text" className="custom-input" value={dimForm.nameAr} onChange={e => setDimForm({...dimForm, nameAr: e.target.value})} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '10px' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} checked={dimForm.isActive} onChange={e => setDimForm({...dimForm, isActive: e.target.checked})} />
                <span>{lang === 'ar' ? 'نشط' : 'Active'}</span>
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <button type="button" className="btn-cancel" onClick={() => setIsDimModalOpen(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary">{lang === 'ar' ? 'حفظ' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Value Modal */}
      {isValueModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-custom">
            <div className="modal-header-custom">
              <h2>{editingValue ? (lang === 'ar' ? 'تعديل مركز تكلفة' : 'Edit Cost Center') : (lang === 'ar' ? 'إضافة مركز تكلفة' : 'Add Cost Center')}</h2>
              <button className="close-btn" onClick={() => setIsValueModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={saveValue} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <div className="custom-input-group">
                <label>{lang === 'ar' ? 'المركز الرئيسي' : 'Parent Cost Center'}</label>
                <select className="custom-input" value={valueForm.parentId || ''} onChange={e => handleParentChange(e.target.value || null)}>
                  <option value="">{lang === 'ar' ? 'بدون (رئيسي)' : 'None (Root)'}</option>
                  {selectedDimension?.values.map((v: any) => (
                    <option key={v.id} value={v.id} disabled={editingValue?.id === v.id}>{v.code} - {lang === 'ar' ? (v.nameAr || v.name) : v.name}</option>
                  ))}
                </select>
              </div>

              <div className="custom-input-group">
                <label>{lang === 'ar' ? 'الرمز' : 'Code'}</label>
                <input type="text" className="custom-input" style={{ fontFamily: 'monospace' }} value={valueForm.code} onChange={e => setValueForm({...valueForm, code: e.target.value})} required />
              </div>
              <div className="custom-input-group">
                <label>{lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
                <input type="text" className="custom-input" value={valueForm.name} onChange={e => setValueForm({...valueForm, name: e.target.value})} required />
              </div>
              <div className="custom-input-group">
                <label>{lang === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
                <input type="text" className="custom-input" value={valueForm.nameAr} onChange={e => setValueForm({...valueForm, nameAr: e.target.value})} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '10px' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} checked={valueForm.isActive} onChange={e => setValueForm({...valueForm, isActive: e.target.checked})} />
                <span>{lang === 'ar' ? 'نشط' : 'Active'}</span>
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <button type="button" className="btn-cancel" onClick={() => setIsValueModalOpen(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary">{lang === 'ar' ? 'حفظ' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .dimensions-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .dimensions-grid {
            grid-template-columns: 1fr;
          }
        }
        .dim-item {
          padding: 1rem;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid transparent;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }
        .dim-item:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        .dim-item.active {
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.3);
        }
        .dim-actions {
          opacity: 0;
          transition: opacity 0.2s;
        }
        .dim-item:hover .dim-actions {
          opacity: 1;
        }
        
        /* Modal Custom Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        
        .modal-content-custom {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          width: 90%;
          max-width: 450px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease;
        }
        
        .modal-header-custom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--glass-border);
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%);
        }
        
        .modal-header-custom h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          color: white;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        
        .close-btn:hover {
          color: white;
        }
        
        .custom-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .custom-input-group label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        
        .custom-input {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.875rem 1rem;
          color: white;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
          width: 100%;
        }
        
        .custom-input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
        
        .btn-cancel {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

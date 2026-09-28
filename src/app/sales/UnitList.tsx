'use client';

import { useState } from 'react';
import { createUnit, updateUnit, translateText, deleteUnit } from './actions';

export default function UnitList({ units, lang }: { units: any[], lang: string }) {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    parentUnitId: '',
    conversionFactor: 1
  });

  const handleTranslateToAr = async () => {
    if (!formData.name?.trim()) {
      alert(lang === 'ar' ? 'يرجى إدخال الاسم بالإنجليزية أولاً' : 'Please enter English name first');
      return;
    }
    setIsTranslating(true);
    try {
      const res = await translateText(formData.name.trim(), 'en', 'ar');
      if (res?.success && res.text) {
        setFormData(prev => ({ ...prev, nameAr: res.text || '' }));
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateToEn = async () => {
    if (!formData.nameAr?.trim()) {
      alert(lang === 'ar' ? 'يرجى إدخال الاسم بالعربية أولاً' : 'Please enter Arabic name first');
      return;
    }
    setIsTranslating(true);
    try {
      const res = await translateText(formData.nameAr.trim(), 'ar', 'en');
      if (res?.success && res.text) {
        setFormData(prev => ({ ...prev, name: res.text || '' }));
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', nameAr: '', parentUnitId: '', conversionFactor: 1 });
    setShowModal(true);
  };

  const openEdit = (u: any) => {
    setEditingItem(u);
    setFormData({ 
      name: u.name, 
      nameAr: u.nameAr || '', 
      parentUnitId: u.parentUnitId || '', 
      conversionFactor: u.conversionFactor || 1 
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = editingItem ? await updateUnit(editingItem.id, formData) : await createUnit(formData);
    if (res.success) {
      setShowModal(false);
    } else {
      alert(res.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(lang === 'ar' ? `هل أنت متأكد من حذف وحدة القياس (${name})؟` : `Are you sure you want to delete unit (${name})?`)) {
      const res = await deleteUnit(id);
      if (!res.success) {
        alert(res.error);
      }
    }
  };


  return (
    <div className="units-management">
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">{lang === 'ar' ? 'إدارة وحدات القياس والتحويل' : 'Units of Measure & Conversion'}</h2>
          <button className="btn-primary" onClick={openAdd}>
            {lang === 'ar' ? '+ وحدة جديدة' : '+ New Unit'}
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead style={{ background: '#1e293b', borderBottom: '2px solid #0f172a' }}>
              <tr>
                <th style={{ color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'الوحدة' : 'Unit'}</th>
                <th style={{ color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'الاسم العربي' : 'Arabic Name'}</th>
                <th style={{ textAlign: 'center', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'العلاقة' : 'Relationship'}</th>
                <th style={{ textAlign: 'center', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'معامل التحويل' : 'Factor'}</th>
                <th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {(units || []).map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ fontWeight: 'bold' }}>{u.name}</td>
                  <td>{u.nameAr || '—'}</td>
                  <td style={{ textAlign: 'center' }}>
                    {u.parentUnit ? (
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            1 {u.name} = {u.conversionFactor} {u.parentUnit.name}
                        </span>
                    ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{lang === 'ar' ? 'وحدة أساسية' : 'Base Unit'}</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>{u.conversionFactor || 1}</td>
                  <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn-icon" onClick={() => openEdit(u)} title={lang === 'ar' ? 'تعديل' : 'Edit'}>✏️</button>
                    <button className="btn-icon delete-icon" onClick={() => handleDelete(u.id, lang === 'ar' ? (u.nameAr || u.name) : u.name)} title={lang === 'ar' ? 'حذف' : 'Delete'}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="pro-max-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>{editingItem ? (lang === 'ar' ? 'تعديل وحدة (Edit Unit)' : 'Edit Unit') : (lang === 'ar' ? 'إنشاء وحدة (Create Unit)' : 'Create Unit')}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-grid">
                
                <div className="input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>{lang === 'ar' ? 'اسم الوحدة (Unit Name EN)' : 'Unit Name (EN)'} <span style={{color:'#ef4444'}}>*</span></label>
                    <button type="button" onClick={handleTranslateToAr} disabled={isTranslating} className="btn-translate">
                      {isTranslating ? '...' : (lang === 'ar' ? '🔄 ترجمة للعربية' : '🔄 Translate to AR')}
                    </button>
                  </div>
                  <input 
                    type="text" 
                    className="pro-input" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Kilogram" 
                  />
                </div>

                <div className="input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>{lang === 'ar' ? 'الاسم بالعربية (Unit Name AR)' : 'Arabic Name'}</label>
                    <button type="button" onClick={handleTranslateToEn} disabled={isTranslating} className="btn-translate">
                      {isTranslating ? '...' : (lang === 'ar' ? '🔄 ترجمة للإنجليزية' : '🔄 Translate to EN')}
                    </button>
                  </div>
                  <input 
                    type="text" 
                    className="pro-input" 
                    value={formData.nameAr} 
                    onChange={e => setFormData({...formData, nameAr: e.target.value})} 
                    placeholder="مثال: كيلوجرام" 
                    dir="rtl"
                  />
                </div>

                <div className="input-group">
                  <label>{lang === 'ar' ? 'تعتمد على أي وحدة؟ (Type / Base Unit)' : 'Type / Base Unit'} <span style={{color:'#ef4444'}}>*</span></label>
                  <select 
                    className="pro-select"
                    value={formData.parentUnitId} 
                    onChange={e => setFormData({...formData, parentUnitId: e.target.value})}
                  >
                    <option value="">{lang === 'ar' ? 'وحدة أساسية (Base Unit)' : 'Base Unit'}</option>
                    {units.filter(u => u.id !== editingItem?.id).map(u => (
                      <option key={u.id} value={u.id}>{lang === 'ar' ? (u.nameAr || u.name) : u.name}</option>
                    ))}
                  </select>
                </div>

                {formData.parentUnitId && (
                  <div className="input-group conversion-box">
                    <label>{lang === 'ar' ? 'معامل التحويل (Conversion Ratio)' : 'Conversion Ratio'} <span style={{color:'#ef4444'}}>*</span></label>
                    <div className="conversion-input-wrapper">
                      <span className="unit-label">1 {formData.name || (lang === 'ar' ? 'الوحدة' : 'Unit')} = </span>
                      <input 
                        type="number" 
                        step="any"
                        required
                        min="0.00001"
                        className="pro-input ratio-input"
                        value={formData.conversionFactor} 
                        onChange={e => setFormData({...formData, conversionFactor: parseFloat(e.target.value) || 1})}
                      />
                      <span className="parent-unit-label">
                        {units.find(u => u.id === formData.parentUnitId)?.name || ''}
                      </span>
                    </div>
                    <p className="helper-text">
                      <span className="icon">ℹ️</span>
                      {lang === 'ar' 
                        ? 'أدخل الكمية التي تعادلها هذه الوحدة من الوحدة الأساسية (مثال: 1 كرتون = 12 حبة).' 
                        : 'Enter how much this unit equals in the base unit (e.g. 1 Dozen = 12 Pieces).'}
                    </p>
                  </div>
                )}
                
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  {lang === 'ar' ? 'إلغاء (Cancel)' : 'Cancel'}
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ الوحدة (Save Unit)' : 'Save Unit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .units-management {
          padding-bottom: 2rem;
        }

        /* Pro Max Modal Styles */
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
          width: 90%;
          max-width: 500px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          background: #ffffff;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #0f172a;
          font-weight: 700;
        }

        .btn-close {
          background: #f1f5f9;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 1.25rem;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-close:hover { 
          background: #e2e8f0;
          color: #0f172a; 
        }

        .btn-icon {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .btn-icon:hover { background: #e2e8f0; }
        .delete-icon:hover { background: #fee2e2; color: #ef4444; }

        .modal-body { padding: 1.5rem; }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
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
          background: #ffffff;
          width: 100%;
          box-sizing: border-box;
        }

        .pro-input:focus, .pro-select:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .btn-translate {
          font-size: 0.75rem;
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.1);
          border: none;
          padding: 0.25rem 0.75rem;
          border-radius: 99px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-translate:hover:not(:disabled) {
          background: rgba(79, 70, 229, 0.2);
        }
        .btn-translate:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Conversion Ratio Specific Styles */
        .conversion-box {
          background: #f8fafc;
          padding: 1.25rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-top: 0.5rem;
        }

        .conversion-input-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.02);
        }

        .unit-label {
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
        }

        .ratio-input {
          border: 1px solid #e2e8f0 !important;
          background: #f8fafc !important;
          color: #4f46e5 !important;
          font-weight: 700 !important;
          text-align: center;
          width: 100px;
          padding: 0.5rem !important;
          box-shadow: none !important;
        }
        .ratio-input:focus {
          border-color: #4f46e5 !important;
          background: white !important;
        }

        .parent-unit-label {
          color: #64748b;
          font-weight: 500;
          white-space: nowrap;
        }

        .helper-text {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0.75rem 0 0 0;
          display: flex;
          align-items: flex-start;
          gap: 0.35rem;
          line-height: 1.4;
        }

        .modal-footer {
          margin-top: 2rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1.25rem;
          border-top: 1px solid #f1f5f9;
        }

        .btn-secondary {
          background: white;
          color: #475569;
          border: 1px solid #cbd5e1;
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #f8fafc;
          color: #0f172a;
        }

        .btn-primary {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-primary:before {
          content: '✓';
          font-weight: 900;
        }

        .btn-primary:hover:not(:disabled) {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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

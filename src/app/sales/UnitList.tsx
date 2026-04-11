'use client';

import { useState } from 'react';
import { createUnit, updateUnit, translateText } from './actions';

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

  const handleTranslate = async () => {
    if (formData.name && !formData.nameAr) {
      setIsTranslating(true);
      const res = await translateText(formData.name, 'en', 'ar');
      if (res.success) setFormData({ ...formData, nameAr: res.text });
      setIsTranslating(false);
    } else if (formData.nameAr && !formData.name) {
      setIsTranslating(true);
      const res = await translateText(formData.nameAr, 'ar', 'en');
      if (res.success) setFormData({ ...formData, name: res.text });
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
            <thead>
              <tr>
                <th>{lang === 'ar' ? 'الوحدة' : 'Unit'}</th>
                <th>{lang === 'ar' ? 'الاسم العربي' : 'Arabic Name'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'العلاقة' : 'Relationship'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'معامل التحويل' : 'Factor'}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(units || []).map(u => (
                <tr key={u.id}>
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
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" onClick={() => openEdit(u)}>✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>{editingItem ? (lang === 'ar' ? 'تعديل وحدة' : 'Edit Unit') : (lang === 'ar' ? 'إضافة وحدة' : 'Add Unit')}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label>{lang === 'ar' ? 'اسم الوحدة (EN)' : 'Unit Name (EN)'}</label>
                        <button type="button" onClick={handleTranslate} disabled={isTranslating} style={{ fontSize: '0.7rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>
                            {isTranslating ? '...' : (lang === 'ar' ? '🔄 ترجمة' : '🔄 Translate')}
                        </button>
                    </div>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.6rem' }} />
                </div>
                <div>
                    <label>{lang === 'ar' ? 'اسم الوحدة (AR)' : 'Arabic Name'}</label>
                    <input value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} style={{ width: '100%', padding: '0.6rem' }} dir="rtl" />
                </div>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', marginTop: '0.5rem' }}>
                    <h4 style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#475569' }}>{lang === 'ar' ? 'إعدادات التحويل' : 'Conversion Settings'}</h4>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem' }}>{lang === 'ar' ? 'يساوي كم من' : 'Equal to how many of'}</label>
                        <select 
                            value={formData.parentUnitId} 
                            onChange={e => setFormData({...formData, parentUnitId: e.target.value})}
                            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        >
                            <option value="">-- {lang === 'ar' ? 'اختر الوحدة الصغرى' : 'Select Smaller Unit'} --</option>
                            {units.filter(u => u.id !== editingItem?.id).map(u => (
                                <option key={u.id} value={u.id}>{lang === 'ar' ? u.nameAr : u.name}</option>
                            ))}
                        </select>
                    </div>
                    {formData.parentUnitId && (
                        <div>
                            <label style={{ fontSize: '0.75rem' }}>{lang === 'ar' ? 'العدد (معامل التحويل)' : 'Quantity (Factor)'}</label>
                            <input 
                                type="number" 
                                step="any"
                                value={formData.conversionFactor} 
                                onChange={e => setFormData({...formData, conversionFactor: parseFloat(e.target.value) || 1})}
                                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                            />
                            <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>
                                Every 1 {formData.name || 'Unit'} will contain {formData.conversionFactor} of selected unit.
                            </p>
                        </div>
                    )}
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                   {isSubmitting ? '...' : (lang === 'ar' ? 'حفظ' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
        .modal-content { background: white; width: 100%; border-radius: 12px; }
        .modal-header { padding: 1.25rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
        input, select { border: 1px solid #ddd; border-radius: 6px; outline: none; }
      `}</style>
    </div>
  );
}

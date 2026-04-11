'use client';

import { useState } from 'react';
import { createProduct, updateProduct, deleteProduct, translateText, createUnit, bulkCreateProducts, deleteAllProducts } from './actions';
import * as XLSX from 'xlsx';

export default function ProductList({ products, units, lang, dict }: { products: any[], units: any[], lang: string, dict: any }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const [showUnitModal, setShowUnitModal] = useState(false);
  const [newUnit, setNewUnit] = useState({ name: '', nameAr: '' });
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    nameAr: '',
    classification: 'Finished Product', 
    costPrice: 0,
    salePrice: 0,
    unit: 'Piece',
    unitId: '',
    unitQuantity: 1,
    subUnitId: '',
    caloriesPer100g: 0,
    category: '',
    reorderPoint: 0,
    expiryDate: ''
  });

  const filtered = (products || []).filter(p => {
    const s = (searchTerm || '').toLowerCase();
    return (
      (p?.name || '').toLowerCase().includes(s) ||
      (p?.nameAr || '').toLowerCase().includes(s) ||
      (p?.sku || '').toLowerCase().includes(s)
    );
  });

  const openAdd = () => {
    setEditingItem(null);
    setFormData({
      sku: '', name: '', nameAr: '', classification: 'Finished Product',
      costPrice: 0, salePrice: 0, unit: 'Piece', unitId: units[0]?.id || '', subUnitId: '', caloriesPer100g: 0,
      category: '', reorderPoint: 0, unitQuantity: 1, expiryDate: ''
    });
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditingItem(p);
    setFormData({
      sku: p.sku, 
      name: p.name, 
      nameAr: p.nameAr || '', 
      classification: p.classification || 'Finished Product',
      costPrice: p.costPrice || 0, 
      salePrice: p.salePrice || 0, 
      unit: p.unit || 'Piece',
      unitId: p.unitId || '',
      caloriesPer100g: p.caloriesPer100g || 0,
      category: p.category || '',
      reorderPoint: p.reorderPoint || 0,
      unitQuantity: p.unitQuantity || 1,
      subUnitId: p.subUnitId || '',
      expiryDate: p.expiryDate ? new Date(p.expiryDate).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let res;
      if (editingItem) {
        res = await updateProduct(editingItem.id, formData);
      } else {
        res = await createProduct(formData);
      }
      
      if (res.success) {
        setShowModal(false);
      } else {
        alert(res.error || (lang === 'ar' ? 'فشلت العملية' : 'Operation failed'));
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من الحذف؟ سيتم حذف كافة الارتباطات لهذا الصنف.' : 'Are you sure? This will delete all relations.')) {
      const res = await deleteProduct(id, lang);
      if (!res.success) {
        alert(res.error);
      }
    }
  };

  const getClassificationLabel = (val: string) => {
    if (lang === 'ar') {
      if (val === 'Raw Material') return 'مادة خام';
      if (val === 'Semi-finished') return 'منتج شبه تام';
      if (val === 'Finished Product') return 'منتج تام';
      return val || 'غير مصنف';
    }
    return val || 'N/A';
  };

  return (
    <div className="products-module" suppressHydrationWarning={true}>
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">{lang === 'ar' ? 'مركز تكلفة الأصناف والمنتجات' : 'Products Cost Center'}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-primary no-print" onClick={openAdd}>
                {lang === 'ar' ? '+ صنف جديد' : '+ New Item'}
              </button>
          </div>
        </div>

        <div className="filter-bar no-print" style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
           <input 
             type="text" 
             placeholder={lang === 'ar' ? "البحث عن صنف (الاسم، الكود)..." : "Search items (Name, SKU)..."}
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="search-input"
             style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '8px' }}
           />
        </div>

        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'رقم الصنف' : 'SKU / Code'}</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'اسم الصنف' : 'Name'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'التصنيف' : 'Classification'}</th>
                <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'التكلفة' : 'Cost'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'السعرات' : 'Calories'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'وحدة القياس' : 'Unit'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry'}</th>
                <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الكمية' : 'Stock'}</th>
                <th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {(filtered || []).map(p => (
                <tr key={p.id}>
                  <td><code>{p.sku}</code></td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{lang === 'ar' && p.nameAr ? p.nameAr : p.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{p.category}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ 
                        padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', 
                        background: p.classification === 'Raw Material' ? 'rgba(234, 179, 8, 0.1)' : 
                                   p.classification === 'Semi-finished' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                        color: p.classification === 'Raw Material' ? '#ca8a04' : 
                                p.classification === 'Semi-finished' ? '#2563eb' : '#16a34a'
                    }}>
                        {getClassificationLabel(p.classification)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '500' }}>
                    {(p.costPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {p.caloriesPer100g > 0 ? (
                        <div style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold', display: 'inline-block' }}>
                            {p.caloriesPer100g.toFixed(1)} <small>kcal</small>
                        </div>
                    ) : (
                        <span style={{ color: '#cbd5e1' }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span className="badge">
                            {lang === 'ar' ? (p.unitRef?.nameAr || p.unit) : (p.unitRef?.name || p.unit)}
                        </span>
                        {p.subUnitId && (
                            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '500' }}>
                                1 {lang === 'ar' ? (p.unitRef?.nameAr || p.unit) : (p.unitRef?.name || p.unit)} = {p.unitQuantity} {lang === 'ar' ? (p.subUnitRef?.nameAr || 'غم') : (p.subUnitRef?.name || 'g')}
                            </div>
                        )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '0.8rem', color: p.expiryDate && new Date(p.expiryDate) < new Date() ? 'var(--accent-danger)' : 'inherit' }}>
                    {p.expiryDate ? new Date(p.expiryDate).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US') : '—'}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: (p.stockQuantity || 0) <= (p.reorderPoint || 0) ? '#dc2626' : 'inherit' }}>
                    {(p.stockQuantity || 0).toLocaleString(undefined, { minimumFractionDigits: 1 })}
                  </td>
                  <td className="no-print" style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn-icon" onClick={() => openEdit(p)}>✏️</button>
                        <button className="btn-icon delete" onClick={() => handleDelete(p.id)}>🗑️</button>
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
          <div className="modal-content" style={{ maxWidth: '650px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3>{editingItem ? (lang === 'ar' ? 'تعديل صنف' : 'Edit Item') : (lang === 'ar' ? 'صنف جديد' : 'New Item')}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="product-form" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="modal-body-scroll" style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                <div className="form-grid">
                    <div className="form-group">
                    <label>{lang === 'ar' ? 'رقم الصنف (اتركه فارغاً للتوليد التلقائي)' : 'SKU / Code (Leave empty to auto-generate)'}</label>
                    <input value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                    </div>
                    <div className="form-group">
                    <label>{lang === 'ar' ? 'تاريخ انتهاء الصلاحية' : 'Expiry Date'}</label>
                    <input type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label>{lang === 'ar' ? 'الاسم الأصلي (AR)' : 'Arabic Name (AR)'}</label>
                            <button type="button" onClick={handleTranslate} disabled={isTranslating} style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                {isTranslating ? '...' : (lang === 'ar' ? '🔄 ترجمة للإنجليزية' : '🔄 Translate to EN')}
                            </button>
                        </div>
                    <input required value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} dir="rtl" />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>{lang === 'ar' ? 'الاسم بالإنجليزية (EN)' : 'English Name (EN)'}</label>
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                    <label>{lang === 'ar' ? 'القسم' : 'Category'}</label>
                    <input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                    </div>
                    <div className="form-group">
                    <label>{lang === 'ar' ? 'التصنيف' : 'Classification'}</label>
                    <select value={formData.classification} onChange={e => setFormData({...formData, classification: e.target.value})}>
                        <option value="Raw Material">{lang === 'ar' ? 'مادة خام' : 'Raw Material'}</option>
                        <option value="Semi-finished">{lang === 'ar' ? 'منتج شبه تام' : 'Semi-finished'}</option>
                        <option value="Finished Product">{lang === 'ar' ? 'منتج تام' : 'Finished Product'}</option>
                    </select>
                    </div>
                    <div className="form-group">
                        <label>{lang === 'ar' ? 'وحدة القياس' : 'Unit'}</label>
                        <select value={formData.unitId} onChange={e => setFormData({...formData, unitId: e.target.value})}>
                            <option value="">-- {lang === 'ar' ? 'الوحدة' : 'Unit'} --</option>
                            {units.map(u => (<option key={u.id} value={u.id}>{lang === 'ar' ? u.nameAr : u.name}</option>))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{lang === 'ar' ? 'الوحدة الصغرى' : 'Sub-Unit'}</label>
                        <select value={formData.subUnitId} onChange={e => setFormData({...formData, subUnitId: e.target.value})}>
                            <option value="">-- {lang === 'ar' ? 'الوحدة الصغرى' : 'Sub-Unit'} --</option>
                            {units.map(u => (<option key={u.id} value={u.id}>{lang === 'ar' ? u.nameAr : u.name}</option>))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{lang === 'ar' ? 'الكمية في الوحدة الكبرى' : 'Sub-Units in Main'}</label>
                        <input type="number" step="any" value={formData.unitQuantity} onChange={e => setFormData({...formData, unitQuantity: parseFloat(e.target.value) || 1})} />
                    </div>
                    <div className="form-group">
                    <label>{lang === 'ar' ? 'سعر التكلفة' : 'Cost Price'}</label>
                    <input 
                        type="number" step="0.0001" value={formData.costPrice} 
                        onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})} 
                        disabled={formData.classification !== 'Raw Material'}
                        style={{ background: formData.classification !== 'Raw Material' ? '#f1f5f9' : 'white' }}
                    />
                    </div>
                    <div className="form-group">
                        <label>{lang === 'ar' ? 'سعر البيع' : 'Sale Price'}</label>
                        <input type="number" step="0.01" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: parseFloat(e.target.value)})} />
                    </div>
                    <div className="form-group">
                    <label>{lang === 'ar' ? 'السعرات/100جم' : 'Calories/100g'}</label>
                    <input 
                        type="number" step="0.1" value={formData.caloriesPer100g} 
                        onChange={e => setFormData({...formData, caloriesPer100g: parseFloat(e.target.value)})} 
                        disabled={formData.classification !== 'Raw Material'}
                        style={{ background: formData.classification !== 'Raw Material' ? '#f1f5f9' : 'white' }}
                    />
                    </div>
                </div>
              </div>
              <div className="modal-footer" style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .products-module { color: #ffffff; }
        .table-container th { background: #1e293b; color: #ffffff; padding: 12px; }
        .table-container td { padding: 12px; border-bottom: 1px solid #334155; }
        .btn-icon { background: none; border: none; cursor: pointer; padding: 4px; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: #fff; border-radius: 12px; }
        .modal-header { padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.3rem; }
        .form-group label { font-size: 0.8rem; font-weight: bold; color: #475569; }
        .form-group input, .form-group select { padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 6px; }
      `}</style>
    </div>
  );
}

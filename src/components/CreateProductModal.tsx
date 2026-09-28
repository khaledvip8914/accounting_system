'use client';

import { useState, useEffect } from 'react';
import { getProductFormData, translateText } from '@/app/sales/actions';

export default function CreateProductModal({
  lang,
  onClose,
  onSave
}: {
  lang: string,
  onClose: () => void,
  onSave: (data: any) => Promise<any>
}) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    nameAr: '',
    classification: 'Finished Product',
    costPrice: 0,
    salePrice: 0,
    unitId: '',
    unitQuantity: 1,
    subUnitId: '',
    categoryId: '',
    caloriesPer100g: 0,
    reorderPoint: 0,
    expiryDate: '',
    supplierId: ''
  });
  
  const [isPending, setIsPending] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [units, setUnits] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getProductFormData();
        if (res.success) {
          setUnits(res.units || []);
          setCategories(res.categories || []);
          setSuppliers(res.suppliers || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingData(false);
      }
    }
    loadData();
  }, []);

  const handleTranslate = async () => {
    const hasAr = formData.nameAr && formData.nameAr.trim().length > 0;
    const hasEn = formData.name && formData.name.trim().length > 0;

    if (!hasAr && !hasEn) {
      alert(lang === 'ar' ? 'يرجى إدخال اسم واحد على الأقل للترجمة' : 'Please enter at least one name to translate');
      return;
    }
    if (hasAr && hasEn) {
      alert(lang === 'ar' ? 'كلا الحقلين ممتلئين، يرجى مسح أحدهما للترجمة' : 'Both fields are filled. Clear one to translate');
      return;
    }

    setIsTranslating(true);
    try {
      if (hasAr && !hasEn) {
        // Translate Ar to En
        const res = await translateText(formData.nameAr.trim(), 'ar', 'en');
        if (res?.success && res.text) {
          setFormData(prev => ({ ...prev, name: res.text }));
        } else {
          alert(lang === 'ar' ? 'فشلت الترجمة، قد تكون الخدمة محظورة مؤقتاً' : 'Translation failed, service may be temporarily blocked');
        }
      } else if (hasEn && !hasAr) {
        // Translate En to Ar
        const res = await translateText(formData.name.trim(), 'en', 'ar');
        if (res?.success && res.text) {
          setFormData(prev => ({ ...prev, nameAr: res.text }));
        } else {
          alert(lang === 'ar' ? 'فشلت الترجمة، قد تكون الخدمة محظورة مؤقتاً' : 'Translation failed, service may be temporarily blocked');
        }
      }
    } catch (err) {
      console.error(err);
      alert(lang === 'ar' ? 'حدث خطأ في الترجمة' : 'Translation error occurred');
    } finally {
      setIsTranslating(false);
    }
  };

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
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h3>{lang === 'ar' ? 'صنف جديد' : 'New Item'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        {isLoadingData ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
        ) : (
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <label style={{ margin: 0, fontWeight: 600 }}>{lang === 'ar' ? 'الاسم الأصلي (AR)' : 'Arabic Name (AR)'}</label>
                          <button 
                            type="button" 
                            onClick={handleTranslate} 
                            disabled={isTranslating} 
                            style={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.75rem', 
                              fontWeight: 600,
                              color: isTranslating ? '#94a3b8' : '#2563eb', 
                              background: '#eff6ff', 
                              border: '1px solid #bfdbfe', 
                              borderRadius: '6px',
                              padding: '2px 8px',
                              cursor: isTranslating ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                              {isTranslating ? (lang === 'ar' ? '⏳ جاري الترجمة...' : '⏳ Translating...') : (lang === 'ar' ? '🔄 ترجمة ذكية' : '🔄 Smart Translate')}
                          </button>
                      </div>
                      <input required value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} dir="rtl" placeholder={lang === 'ar' ? 'مثال: قهوة عربي مختصة' : 'Arabic Name'} />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <label style={{ margin: 0, fontWeight: 600 }}>{lang === 'ar' ? 'الاسم بالإنجليزية (EN)' : 'English Name (EN)'}</label>
                      </div>
                      <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder={lang === 'ar' ? 'مثال: Special Arabic Coffee' : 'English Name'} />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                     <label>{lang === 'ar' ? 'القسم (نظامي)' : 'Category (System)'}</label>
                     <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                         <option value="">-- {lang === 'ar' ? 'اختر القسم' : 'Select Category'} --</option>
                         {categories.map(c => (<option key={c.id} value={c.id}>{lang === 'ar' ? c.nameAr || c.name : c.name}</option>))}
                     </select>
                  </div>
                  <div className="form-group">
                  <label>{lang === 'ar' ? 'التصنيف' : 'Classification'}</label>
                  <select value={formData.classification} onChange={e => setFormData({...formData, classification: e.target.value})}>
                      <option value="Raw Material">{lang === 'ar' ? 'مادة خام' : 'Raw Material'}</option>
                      <option value="Semi-finished">{lang === 'ar' ? 'منتج شبه تام' : 'Semi-finished'}</option>
                      <option value="Finished Product">{lang === 'ar' ? 'منتج تام' : 'Finished Product'}</option>
                      <option value="Service">{lang === 'ar' ? 'خدمة' : 'Service'}</option>
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
                  <label>{lang === 'ar' ? 'سعر التكلفة (شامل الضريبة)' : 'Cost Price (Inc. VAT)'}</label>
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
                    <label>{lang === 'ar' ? 'أقل كمية للطلب (التنبيه)' : 'Minimum Order Qty (Alert)'}</label>
                    <input 
                        type="number" step="0.01" value={formData.reorderPoint} 
                        onChange={e => setFormData({...formData, reorderPoint: parseFloat(e.target.value) || 0})} 
                    />
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
                  <div className="form-group">
                    <label>{lang === 'ar' ? 'المورد الافتراضي' : 'Default Supplier'}</label>
                    <select value={formData.supplierId} onChange={e => setFormData({...formData, supplierId: e.target.value})}>
                        <option value="">-- {lang === 'ar' ? 'اختر المورد' : 'Select Supplier'} --</option>
                        {suppliers.map(s => (<option key={s.id} value={s.id}>{lang === 'ar' ? s.nameAr || s.name : s.name}</option>))}
                    </select>
                  </div>
              </div>
            </div>
            <div className="modal-footer" style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" className="btn-secondary" onClick={onClose} disabled={isPending}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button type="submit" className="btn-primary" disabled={isPending}>
                {isPending ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ' : 'Save')}
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content { background: #fff; border-radius: 12px; color: #1e293b; }
        .modal-header { padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { margin: 0; font-size: 1.25rem; color: #0f172a; }
        .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-weight: 600; font-size: 0.85rem; color: #475569; }
        input, select { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; font-size: 0.9rem; }
        input:focus, select:focus { border-color: #2563eb; }
        .btn-primary { background: #2563eb; color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .btn-secondary { background: white; color: #475569; border: 1px solid #cbd5e1; padding: 0.6rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-secondary:hover { background: #f8fafc; }
      `}</style>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { createCostCenter, updateCostCenter, deleteCostCenter } from './actions';
import { useRouter } from 'next/navigation';

function SearchableProductSelect({ products, value, onChange, lang }: { products: any[], value: string, onChange: (val: string) => void, lang: string }) {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    
    const selectedProduct = products.find(p => p.id === value);
    const displayName = selectedProduct ? (lang === 'ar' && selectedProduct.nameAr ? selectedProduct.nameAr : selectedProduct.name) : '';

    const filtered = products.filter(p => {
        const name = (p.name || '').toLowerCase();
        const nameAr = (p.nameAr || '').toLowerCase();
        const sku = (p.sku || '').toLowerCase();
        const q = search.toLowerCase();
        return name.includes(q) || nameAr.includes(q) || sku.includes(q);
    });

    return (
        <div className="searchable-select-container">
            <input 
                type="text" 
                className="search-select-input"
                placeholder={displayName || (lang === 'ar' ? 'ابحث عن صنف...' : 'Search product...')}
                value={isOpen ? search : displayName}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => { setIsOpen(true); setSearch(''); }}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            />
            {isOpen && (
                <div className="search-results-dropdown no-print">
                    {filtered.slice(0, 50).map(p => (
                        <div 
                            key={p.id} 
                            className="search-result-item" 
                            onClick={() => {
                                onChange(p.id);
                                setIsOpen(false);
                            }}
                        >
                            <span style={{ fontWeight: 'bold', marginRight: '5px' }}>{p.sku}</span>
                            {lang === 'ar' && p.nameAr ? p.nameAr : p.name}
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="search-result-item" style={{ color: '#94a3b8', textAlign: 'center' }}>
                            {lang === 'ar' ? 'لا توجد نتائج' : 'No results'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function CostCenterList({ costCenters, products, units, lang }: { costCenters: any[], products: any[], units: any[], lang: string }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({ 
    code: '', 
    name: '', 
    nameAr: '', 
    description: '',
    productId: '',
    yieldWeight: 0,
    items: [] as any[]
  });

  const [finishedProduct, setFinishedProduct] = useState<any | null>(null);

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ code: '', name: '', nameAr: '', description: '', productId: '', yieldWeight: 0, items: [] });
    setFinishedProduct(null);
    setShowModal(true);
  };

  const openEdit = (cc: any) => {
    setEditingItem(cc);
    setFormData({ 
      code: cc.code, 
      name: cc.name, 
      nameAr: cc.nameAr || '', 
      description: cc.description || '',
      productId: cc.productId || '',
      yieldWeight:  (() => {
          // Convert stored GRAMS back to UNIT terms for display
          const prod = cc.product || products.find(p => p.id === cc.productId);
          const unitWeightG = getWeightInGrams(1, prod?.unitId, prod?.id);
          return unitWeightG > 0 ? (cc.yieldWeight / unitWeightG) : cc.yieldWeight;
      })(),
      items: cc.items.map((it: any) => ({
         id: it.id,
         productId: it.productId,
         quantity: it.quantity,
         costPrice: it.costPrice,
         unitId: it.unitId || it.product?.unitId || '',
         product: it.product
      }))
    });
    setFinishedProduct(cc.product || null);
    setShowModal(true);
  };

  const handleFinishedProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setFinishedProduct(product);
      setFormData({
        ...formData,
        productId,
        code: product.sku,
        name: product.name,
        nameAr: product.nameAr || '',
        description: product.description || ''
      });
    } else {
      setFinishedProduct(null);
      setFormData({ ...formData, productId: '' });
    }
  };

  const addRow = () => {
    const defaultProduct = products[0];
    const newItems = [...formData.items, { 
      productId: defaultProduct?.id || '', 
      quantity: 0, 
      costPrice: defaultProduct?.costPrice || 0,
      unitId: defaultProduct?.unitId || '',
      product: defaultProduct 
    }];
    setFormData({ ...formData, items: newItems });
  };

  const removeRow = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const getWeightInGrams = (qty: number, unitId: string, productId?: string): number => {
    if (!qty) return 0;
    const u = units.find(unit => unit.id === unitId);
    
    const name = (u?.name || '').toLowerCase().trim();
    const nameAr = (u?.nameAr || '').trim();
    
    if (name === 'kilogram' || name === 'kg' || nameAr === 'كيلو' || nameAr === 'كجم') return qty * 1000;
    if (name === 'gram' || name === 'g' || name === 'gm' || nameAr === 'جرام' || nameAr === 'جم') return qty;
    if (name === 'liter' || name === 'ltr' || name === 'l' || nameAr === 'لتر') return qty * 1000;
    if (name === 'milliliter' || name === 'ml' || nameAr === 'ملي') return qty;
    
    if (name.includes('kilogram') || name.includes('كيلو')) return qty * 1000;
    if (name.includes('liter') || name.includes('لتر')) return qty * 1000;

    // Resolve product-specific unit quantities
    if (productId) {
        const prod = products.find(p => p.id === productId);
        if (prod && unitId === prod.unitId && prod.subUnitId) {
            // It's the main unit pointing to a sub-unit
            const subWeight = getWeightInGrams(1, prod.subUnitId);
            return qty * (prod.unitQuantity || 1) * subWeight;
        }
    }

    if (u?.conversionFactor && u.conversionFactor > 1 && !name.includes('gram') && !name.includes('ml')) {
        return qty * u.conversionFactor;
    }

    return qty;
  };

  const updateRow = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    const currentRow = newItems[index];

    if (field === 'productId') {
        const prod = products.find(p => p.id === value);
        newItems[index] = { 
          ...currentRow, 
          productId: value, 
          product: prod, 
          costPrice: prod?.costPrice || 0,
          unitId: prod?.unitId || ''
        };
    } else if (field === 'unitId') {
        const prod = currentRow.product;
        let price = prod?.costPrice || 0;

        if (prod) {
            const mainUnitWeight = getWeightInGrams(1, prod.unitId, prod.id);
            const targetUnitWeight = getWeightInGrams(1, value, prod.id);
            
            if (mainUnitWeight > 0) {
                price = (prod.costPrice / mainUnitWeight) * targetUnitWeight;
            } else {
                price = prod.costPrice;
            }
        }
        const precisePrice = Math.floor(price * 10000) / 10000;
        newItems[index] = { ...currentRow, unitId: value, costPrice: precisePrice };
    } else {
        newItems[index] = { ...currentRow, [field]: value };
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotalCost = (items: any[]) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
  };

  const calculateTotalWeight = (items: any[]) => {
    return items.reduce((sum, item) => sum + getWeightInGrams(item.quantity, item.unitId, item.productId), 0);
  };

  const calculateTotalCalories = (items: any[]) => {
    return items.reduce((sum, item) => {
        const weight = getWeightInGrams(item.quantity, item.unitId, item.productId);
        const cal = (item.product?.caloriesPer100g || 0);
        return sum + ((cal / 100) * weight);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = formData.items.filter(item => item.productId);
    if (validItems.length === 0) {
      alert(lang === 'ar' ? 'يرجى إضافة مكونات للوصفة أولاً' : 'Please add ingredients to the recipe first');
      return;
    }

    const rawTotalCost = calculateTotalCost(validItems);
    const totalCalories = calculateTotalCalories(validItems);
    const rawWeight = calculateTotalWeight(validItems);
    
    // yieldWeight in formData is now in UNIT terms, convert to GRAMS for storage if needed
    const unitWeightG = getWeightInGrams(1, finishedProduct?.unitId || finishedProduct?.unitRef?.id, finishedProduct?.id);
    const yieldGrams = formData.yieldWeight > 0 ? (formData.yieldWeight * unitWeightG) : rawWeight;
    
    // 1. Calculate Cost Per Gram of finished product
    const costPerGram = yieldGrams > 0 ? (rawTotalCost / yieldGrams) : 0;
    
    // 2. Normalized Unit Cost = cost per gram * weight of one unit (e.g. 1000g for 1kg)
    const normalizedUnitCost = costPerGram * unitWeightG;
    
    const calPer100g = yieldGrams > 0 ? (totalCalories / yieldGrams) * 100 : 0;

    const itemsWithRatio = validItems.map(item => ({
      ...item,
      ratio: rawWeight > 0 ? (getWeightInGrams(item.quantity, item.unitId, item.productId) / rawWeight) * 100 : 0
    }));

    const dataToSend = {
      ...formData,
      yieldWeight: yieldGrams, // Store in grams
      items: itemsWithRatio,
      totalCost: normalizedUnitCost,
      caloriesPer100g: calPer100g
    };

    let result: any;
    if (editingItem) {
      result = await updateCostCenter(editingItem.id, dataToSend);
    } else {
      result = await createCostCenter(dataToSend);
    }

    if (result?.success === false) {
      alert((lang === 'ar' ? 'خطأ في الحفظ: ' : 'Save error: ') + (result.error || 'Unknown error'));
      return;
    }

    router.refresh();
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
     if (confirm(lang === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?')) {
        await deleteCostCenter(id);
     }
  };

  return (
    <div className="cost-centers-module">
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 className="card-title">{lang === 'ar' ? 'نظام تكاليف الإنتاج (Recipe BOM)' : 'Production Costing (Recipe BOM)'}</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'تحديد مكونات المنتج وحساب تكلفة الإنتاج الكلية' : 'Define product ingredients and calculate total production costs'}
                </p>
            </div>
            <button className="btn-primary" onClick={openAdd}>
                {lang === 'ar' ? '+ إضافة وصفة إنتاج' : '+ Create New Recipe'}
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
             <thead style={{ background: '#1e293b', borderBottom: '2px solid #0f172a' }}>
                <tr>
                   <th style={{ padding: '15px 12px', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'المنتج النهائي' : 'Finished Product'}</th>
                   <th style={{ textAlign: 'center', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'المكونات' : 'Items'}</th>
                   <th style={{ textAlign: 'center', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'وزن الخلطة' : 'Batch Wt.'}</th>
                   <th style={{ textAlign: 'center', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'وزن المنتج' : 'Yield Wt.'}</th>
                   <th style={{ textAlign: 'right', color: '#ffffff', fontWeight: '900', background: 'rgba(99,102,241,0.1)' }}>{lang === 'ar' ? 'تكلفة الوصفة' : 'Recipe Cost'}</th>
                   <th style={{ textAlign: 'right', color: '#ffffff', fontWeight: '900', background: 'rgba(16,185,129,0.1)' }}>{lang === 'ar' ? 'تكلفة الوحدة' : 'Unit Cost'}</th>
                   <th style={{ width: '80px' }}></th>
                </tr>
             </thead>
             <tbody>
                {(costCenters || []).map(cc => {
                    const totalCost = calculateTotalCost(cc.items);
                    return (
                        <tr key={cc.id}>
                            <td style={{ padding: '15px 12px' }}>
                                <div style={{ fontWeight: '800', color: '#ffffff', fontSize: '1.1rem' }}>{lang === 'ar' && cc.nameAr ? cc.nameAr : cc.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#fbbf24', marginTop: '2px', fontWeight: 'bold' }}>SKU: {cc.code}</div>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                                    {cc.items.length} {lang === 'ar' ? 'صنف' : 'Items'}
                                </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <span style={{ background: '#f8fafc', color: '#1e293b', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '800', border: '1px solid #cbd5e1' }}>
                                    {calculateTotalWeight(cc.items).toFixed(0)} g
                                </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '800', border: '1px solid #bbf7d0' }}>
                                    {(() => {
                                        const unitWeightG = getWeightInGrams(1, cc.product?.unitId, cc.productId);
                                        const val = cc.yieldWeight || calculateTotalWeight(cc.items);
                                        if (unitWeightG > 0 && unitWeightG !== 1) {
                                            return (val / unitWeightG).toFixed(2) + ' ' + (cc.product?.unit || '');
                                        }
                                        return val.toFixed(0) + ' g';
                                    })()}
                                </span>
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: '700', color: '#94a3b8', fontSize: '0.9rem', background: 'rgba(99,102,241,0.05)' }}>
                                {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: '900', color: '#10b981', fontSize: '1.1rem', background: 'rgba(16,185,129,0.05)' }}>
                                {(() => {
                                     const costPerGram = cc.yieldWeight > 0 ? (totalCost / cc.yieldWeight) : 0;
                                     const unitWeightG = getWeightInGrams(1, cc.product?.unitId, cc.productId);
                                     return (costPerGram * unitWeightG).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                 })()}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <button className="btn-icon" onClick={() => openEdit(cc)}>✏️</button>
                                <button className="btn-icon delete" onClick={() => handleDelete(cc.id)}>🗑️</button>
                            </td>
                        </tr>
                    );
                })}
             </tbody>
          </table>
        </div>
      </div>

      {showModal && (
         <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '1000px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
               <div className="modal-header">
                  <h3 style={{ margin: 0 }}>{editingItem ? (lang === 'ar' ? 'تعديل وصفة الإنتاج' : 'Edit Production Recipe') : (lang === 'ar' ? 'أضف وصفة إنتاج جديدة' : 'New Production Recipe')}</h3>
                  <button className="close-btn" onClick={() => setShowModal(false)} style={{ lineHeight: 1 }}>&times;</button>
               </div>
               
               <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                  <div className="modal-body-scroll" style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.4rem', display: 'block', color: '#475569' }}>
                                {lang === 'ar' ? 'المنتج النهائي (المستهدف)' : 'Target Finished Product'}
                            </label>
                            {editingItem ? (
                                <div style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>
                                    {finishedProduct?.sku} - {lang === 'ar' && finishedProduct?.nameAr ? finishedProduct?.nameAr : finishedProduct?.name}
                                </div>
                            ) : (
                                <select 
                                    required 
                                    value={formData.productId} 
                                    onChange={e => handleFinishedProductChange(e.target.value)}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                                >
                                    <option value="">{lang === 'ar' ? '-- اختر المنتج النهائي --' : '-- Select Finished Product --'}</option>
                                    {products.filter(p => p.classification === 'Finished Product' || p.classification === 'Semi-finished').map(p => (
                                        <option key={p.id} value={p.id}>{p.sku} - {lang === 'ar' && p.nameAr ? p.nameAr : p.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.4rem', display: 'block', color: '#475569' }}>
                                {lang === 'ar' ? 'الوصف / ملاحظات إضافية' : 'Description / Additional Notes'}
                            </label>
                            <textarea 
                                value={formData.description} 
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', minHeight: '60px', fontFamily: 'inherit' }}
                                placeholder={lang === 'ar' ? 'تفاصيل إضافية للوصفة...' : 'Additional recipe details...'}
                            />
                        </div>
                      </div>

                      {finishedProduct && (
                          <div className="recipe-section">
                            {/* Compact Audit Dashboard */}
                            <div style={{ 
                                padding: '1rem', 
                                background: '#f8fafc', 
                                borderRadius: '10px', 
                                border: '1px solid #e2e8f0', 
                                display: 'flex', 
                                gap: '1.2rem', 
                                flexWrap: 'wrap', 
                                alignItems: 'center',
                                marginBottom: '1.5rem',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderRight: '1px solid #e2e8f0', paddingRight: '1.2rem' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 'bold' }}>{lang === 'ar' ? 'إجمالي تكلفة الخلطة' : 'Total Batch Cost'}</span>
                                    <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#14532d' }}>{calculateTotalCost(formData.items).toFixed(2)} <small>SAR</small></span>
                                    <span style={{ fontSize: '0.6rem', color: '#15803d' }}>{lang === 'ar' ? 'وزن المكونات:' : 'Weight:'} <b>{calculateTotalWeight(formData.items).toFixed(0)}g</b></span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '0 1.2rem', borderRight: '1px solid #e2e8f0' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 'bold' }}>{lang === 'ar' ? 'سعر الجرام الواحد' : 'Cost per Gram'}</span>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                                            <span style={{ fontSize: '1.45rem', fontWeight: '900', color: '#166534' }}>
                                                {(() => {
                                                    const rawCost = calculateTotalCost(formData.items);
                                                    const rawW = calculateTotalWeight(formData.items);
                                                    const unitG = getWeightInGrams(1, finishedProduct?.unitId, finishedProduct?.id);
                                                    const yieldG = formData.yieldWeight > 0 ? (formData.yieldWeight * unitG) : rawW;
                                                    return yieldG > 0 ? (rawCost / yieldG) : 0;
                                                })().toFixed(6)}
                                            </span>
                                            <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 'bold' }}>{lang === 'ar' ? 'ريال' : 'SAR'}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center', background: '#f0fdf4', padding: '8px 12px', borderRadius: '10px', display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 'bold' }}>{lang === 'ar' ? 'سعر الكيلو (1000جم)' : 'Cost per KG (1000g)'}</span>
                                        <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#16a34a' }}>
                                            {(() => {
                                                const rawCost = calculateTotalCost(formData.items);
                                                const rawW = calculateTotalWeight(formData.items);
                                                const unitG = getWeightInGrams(1, finishedProduct?.unitId, finishedProduct?.id);
                                                const yieldG = formData.yieldWeight > 0 ? (formData.yieldWeight * unitG) : rawW;
                                                const costGram = yieldG > 0 ? (rawCost / yieldG) : 0;
                                                return (costGram * 1000).toFixed(2);
                                            })()} SAR
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '220px' }}>
                                      <div style={{ 
                                          background: '#fffbeb', 
                                          padding: '8px 12px', 
                                          borderRadius: '8px', 
                                          border: '1px solid #fbbf24',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '4px'
                                      }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                  <div style={{ fontSize: '0.65rem', color: '#92400e', fontWeight: 'bold', textTransform: 'uppercase' }}>{lang === 'ar' ? 'إجمالي سعرات الوصفة' : 'Total Recipe Cals'}</div>
                                                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#d97706' }}>{calculateTotalCalories(formData.items).toFixed(0)} <small>kcal</small></div>
                                              </div>
                                              <div style={{ width: '1px', height: '30px', background: '#fde68a' }}></div>
                                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                  <div style={{ fontSize: '0.65rem', color: '#92400e', fontWeight: 'bold', textTransform: 'uppercase' }}>{lang === 'ar' ? 'لكل 100 جم' : 'per 100g'}</div>
                                                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#d97706' }}>
                                                      {(() => {
                                                          const cals = calculateTotalCalories(formData.items);
                                                          const rawW = calculateTotalWeight(formData.items);
                                                          const unitG = getWeightInGrams(1, finishedProduct?.unitId, finishedProduct?.id);
                                                          const yieldG = formData.yieldWeight > 0 ? (formData.yieldWeight * unitG) : rawW;
                                                          return yieldG > 0 ? (cals / yieldG) * 100 : 0;
                                                       })().toFixed(1)} <small>kcal</small>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div style={{ fontSize: '0.7rem', color: '#166534', textAlign: 'center', background: '#f0fdf4', padding: '4px', borderRadius: '6px' }}>
                                           {lang === 'ar' ? 'وزن المنتج (النهائي):' : 'Final Product Yield:'} <br/>
                                           <b style={{ fontSize: '1rem' }}>
                                               {formData.yieldWeight > 0 ? formData.yieldWeight : (calculateTotalWeight(formData.items) / (getWeightInGrams(1, finishedProduct?.unitId, finishedProduct?.id) || 1)).toFixed(2)} 
                                               {finishedProduct?.unit || 'g'}
                                           </b>
                                      </div>
                                 </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <h4 style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>{lang === 'ar' ? 'مكونات الوصفة' : 'Recipe Ingredients'}</h4>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', padding: '6px 12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>
                                            {lang === 'ar' ? `وزن المنتج النهائي (${finishedProduct?.unit || 'جم'}):` : `Finished Product Yield (${finishedProduct?.unit || 'g'}):`}
                                        </label>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            value={formData.yieldWeight} 
                                            onChange={e => setFormData({ ...formData, yieldWeight: parseFloat(e.target.value) || 0 })}
                                            style={{ width: '80px', padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}
                                        />
                                        <button type="button" onClick={() => {
                                            const rawG = calculateTotalWeight(formData.items);
                                            const unitG = getWeightInGrams(1, finishedProduct?.unitId, finishedProduct?.id);
                                            setFormData({ ...formData, yieldWeight: unitG > 0 ? (rawG / unitG) : rawG });
                                        }} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>🔄</button>
                                    </div>
                                    <button type="button" className="btn-primary" onClick={addRow} style={{ padding: '8px 20px', fontSize: '0.85rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                        {lang === 'ar' ? '+ إضافة مادة خام' : '+ Add Raw Material'}
                                    </button>
                                </div>
                            </div>

                            <div className="recipe-table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: '#1e293b', color: '#ffffff' }}>
                                        <tr>
                                            <th style={{ width: '28%', padding: '10px', textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '0.8rem' }}>{lang === 'ar' ? 'المادة الخام' : 'Item'}</th>
                                            <th style={{ width: '10%', textAlign: 'center', fontSize: '0.8rem' }}>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                                            <th style={{ width: '12%', textAlign: 'center', fontSize: '0.8rem' }}>{lang === 'ar' ? 'الوحدة' : 'Unit'}</th>
                                            <th style={{ width: '14%', textAlign: 'center', fontSize: '0.8rem', background: 'rgba(99,102,241,0.3)', color: '#c7d2fe' }}>{lang === 'ar' ? 'نسبة المادة الخام' : 'Raw %'}</th>
                                            <th style={{ width: '8%', textAlign: 'center', fontSize: '0.8rem' }}>{lang === 'ar' ? 'السعرات' : 'Cal'}</th>
                                            <th style={{ width: '14%', textAlign: 'right', fontSize: '0.8rem' }}>{lang === 'ar' ? 'سعر الوحدة' : 'Price'}</th>
                                            <th style={{ width: '14%', textAlign: 'right', fontSize: '0.8rem' }}>{lang === 'ar' ? 'التكلفة' : 'Cost'}</th>
                                            <th style={{ width: '35px' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            const totalWeightG = calculateTotalWeight(formData.items);
                                            return formData.items.map((item, idx) => {
                                                const weightG = getWeightInGrams(item.quantity, item.unitId || item.product?.unitId, item.productId);
                                                const cals = ((item.product?.caloriesPer100g || 0) / 100) * weightG;
                                                const rawPct = totalWeightG > 0 ? (weightG / totalWeightG) * 100 : 0;
                                                return (
                                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                        <td style={{ padding: '6px 8px' }}><SearchableProductSelect products={products} value={item.productId} onChange={val => updateRow(idx, 'productId', val)} lang={lang} /></td>
                                                        <td style={{ textAlign: 'center' }}><input type="number" step="0.001" value={item.quantity} onChange={e => updateRow(idx, 'quantity', parseFloat(e.target.value) || 0)} style={{ width: '100%', textAlign: 'center', padding: '0.4rem', border: '1px solid #e2e8f0' }} /></td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <select value={item.unitId || ''} onChange={e => updateRow(idx, 'unitId', e.target.value)} style={{ width: '100%', padding: '0.3rem', fontSize: '0.8rem' }}>
                                                                <option value="">—</option>
                                                                {units.map(u => (<option key={u.id} value={u.id}>{lang === 'ar' ? u.nameAr : u.name}</option>))}
                                                            </select>
                                                        </td>
                                                        <td style={{ textAlign: 'center', padding: '6px 8px' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                                                                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: rawPct >= 50 ? '#6366f1' : rawPct >= 20 ? '#8b5cf6' : '#a78bfa' }}>
                                                                    {rawPct.toFixed(1)}%
                                                                </span>
                                                                <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                                                                    <div style={{ height: '100%', width: `${Math.min(rawPct, 100)}%`, background: rawPct >= 50 ? 'linear-gradient(90deg,#6366f1,#818cf8)' : 'linear-gradient(90deg,#8b5cf6,#a78bfa)', borderRadius: '999px', transition: 'width 0.3s ease' }} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ textAlign: 'center', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold' }}>{cals.toFixed(0)}</td>
                                                        <td style={{ textAlign: 'right' }}><input type="number" step="0.0001" value={item.costPrice} onChange={e => updateRow(idx, 'costPrice', parseFloat(e.target.value) || 0)} style={{ width: '100%', textAlign: 'right', padding: '0.4rem', border: '1px solid #e2e8f0' }} /></td>
                                                        <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '0.85rem' }}>{(item.quantity * item.costPrice).toFixed(4)}</td>
                                                        <td style={{ textAlign: 'center' }}><button type="button" onClick={() => removeRow(idx)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button></td>
                                                    </tr>
                                                );
                                            });
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                          </div>
                      )}
                  </div>

                  <div className="modal-footer" style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold' }}>{lang === 'ar' ? 'إجمالي تكلفة الوصفة' : 'Total Recipe Cost'}</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>{calculateTotalCost(formData.items).toFixed(2)} SAR</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold' }}>{lang === 'ar' ? 'تكلفة الوحدة' : 'Unit Cost'}</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>
                                {(() => {
                                    const rawCost = calculateTotalCost(formData.items);
                                    const rawW = calculateTotalWeight(formData.items);
                                    const unitWeightG = getWeightInGrams(1, finishedProduct?.unitId, finishedProduct?.id);
                                    const yieldG = formData.yieldWeight > 0 ? (formData.yieldWeight * unitWeightG) : rawW;
                                    const costPerGram = yieldG > 0 ? (rawCost / yieldG) : 0;
                                    return (costPerGram * unitWeightG).toFixed(2);
                                })()} SAR
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ padding: '0.7rem 1.5rem' }}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                        <button type="submit" className="btn-primary" disabled={!formData.productId || formData.items.length === 0} style={{ padding: '0.7rem 2rem' }}>
                            {lang === 'ar' ? 'حفظ الوصفة' : 'Save Recipe'}
                        </button>
                    </div>
                  </div>
               </form>
            </div>
         </div>
      )}
      <style jsx>{`
        .searchable-select-container { position: relative; width: 100%; }
        .search-select-input { width: 100%; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; }
        .search-results-dropdown { position: absolute; top: 100%; left: 0; right: 0; z-index: 50; background: white; border: 1px solid #e2e8f0; border-radius: 8px; max-height: 200px; overflow-y: auto; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .search-result-item { padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; }
        .search-result-item:hover { background: #f8fafc; color: #3b82f6; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(8px); }
        .modal-content { background: white; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; }
        .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .close-btn { background: none; border: none; font-size: 1.8rem; cursor: pointer; color: #94a3b8; }
        
        .btn-icon { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; color: #94a3b8; }
        .btn-icon:hover { background: #f1f5f9; color: #3b82f6; }
        .btn-icon.delete:hover { color: #ef4444; background: #fef2f2; }
      `}</style>
    </div>
  );
}

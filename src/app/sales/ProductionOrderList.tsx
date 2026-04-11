'use client';

import { useState, useMemo } from 'react';
import { createProductionOrder, updateProductionOrder, deleteProductionOrder, finalizeProductionOrder } from './actions';
import { useRouter } from 'next/navigation';

export default function ProductionOrderList({ orders, products, warehouses, units, costCenters, lang }: { orders: any[], products: any[], warehouses: any[], units: any[], costCenters: any[], lang: string }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [printOrder, setPrintOrder] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    warehouseId: warehouses[0]?.id || '',
    notes: ''
  });

  const selectedProduct = useMemo(() => products.find(p => p.id === formData.productId), [formData.productId, products]);
  
  const selectedRecipe = useMemo(() => {
    if (!formData.productId) return null;
    return (costCenters || []).find(cc => cc.productId === formData.productId) || null;
  }, [formData.productId, costCenters]);

  const openAdd = () => {
    setEditingOrder(null);
    setFormData({
      productId: '',
      quantity: 0,
      warehouseId: warehouses[0]?.id || '',
      notes: ''
    });
    setShowModal(true);
  };

  const openEdit = (order: any) => {
    setEditingOrder(order);
    setFormData({
      productId: order.productId,
      quantity: order.quantity,
      warehouseId: order.warehouseId,
      notes: order.notes || ''
    });
    setShowModal(true);
  };

  const handleProductChange = (productId: string) => {
    setFormData({ ...formData, productId });
  };

  const getWeightInGrams = (qty: number, unitId: string): number => {
    if (!qty) return 0;
    const u = (units || []).find(unit => unit.id === unitId);
    if (!u) return qty;
    
    const name = (u.name || '').toLowerCase().trim();
    const nameAr = (u.nameAr || '').trim();
    
    if (name === 'kilogram' || name === 'kg' || nameAr === 'كيلو' || nameAr === 'كجم') return qty * 1000;
    if (name === 'gram' || name === 'g' || nameAr === 'جرام' || nameAr === 'جم') return qty;
    if (name === 'liter' || name === 'ltr' || name === 'l' || nameAr === 'لتر') return qty * 1000;
    
    if (u.conversionFactor && u.conversionFactor > 1) return qty * u.conversionFactor;
    return qty;
  };

  const getUnitWeightInGrams = (qty: number, unitId: string, pId?: string): number => {
      const prodId = pId || formData.productId;
      const prod = products.find(p => p.id === prodId);
      if (!prod) return getWeightInGrams(qty, unitId);
      
      const u = (units || []).find(u => u.id === unitId);
      if (!u) return qty;

      if (unitId === prod.unitId && prod.subUnitId) {
          const subWeight = getWeightInGrams(1, prod.subUnitId);
          return qty * (prod.unitQuantity || 1) * subWeight;
      }
      return getWeightInGrams(qty, unitId);
  };

  const calculateRecipeTotalWeight = (recipe: any) => {
    if (!recipe) return 0;
    return (recipe.items || []).reduce((sum: number, it: any) => sum + getWeightInGrams(it.quantity, it.unitId || it.product?.unitId), 0);
  };

  const getScalingFactor = (qtyOverride?: number, pId?: string, recipeOverride?: any) => {
    const recipe = recipeOverride || selectedRecipe;
    if (!recipe) return 0;
    
    const prodId = pId || formData.productId;
    const prod = products.find(p => p.id === prodId);
    if (!prod) return 1; // Fallback to 1 if product not found

    const qty = qtyOverride !== undefined ? qtyOverride : formData.quantity;
    
    const requestedWeightG = getUnitWeightInGrams(qty, prod?.unitId || '', prodId);
    const recipeYieldG = recipe.yieldWeight || calculateRecipeTotalWeight(recipe);
    
    if (recipeYieldG === 0) return 0;
    return requestedWeightG / recipeYieldG;
  };

  const calculateTotalCost = () => {
    if (!selectedRecipe) return 0;
    const factor = getScalingFactor();
    return (selectedRecipe.items || []).reduce((sum: number, it: any) => sum + (it.quantity * factor * (it.costPrice || 0)), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      let res;
      if (editingOrder) {
        res = await updateProductionOrder(editingOrder.id, formData);
      } else {
        res = await createProductionOrder(formData);
      }

      if (res.success) {
        setShowModal(false);
        router.refresh();
      } else {
        alert(res.error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) {
      await deleteProductionOrder(id);
      router.refresh();
    }
  };

  const handleComplete = async (id: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من اعتماد الإنتاج؟ سيتم تحديث المخزون.' : 'Are you sure? This will update stock.')) {
        setIsSubmitting(true);
        try {
            const res = await finalizeProductionOrder(id);
            if (res.success) {
                router.refresh();
            } else {
                alert(res.error);
            }
        } finally {
            setIsSubmitting(false);
        }
    }
  };

  const handleShowPrint = (o: any) => {
      // Logic for printing: use items if they exist, otherwise use recipe lookup
      let printItems = [];
      if (o.items && o.items.length > 0) {
          printItems = o.items;
      } else {
          const recipe = (costCenters || []).find(cc => cc.productId === o.productId);
          if (recipe) {
              const factor = getScalingFactor(o.quantity, o.productId, recipe);
              printItems = recipe.items.map((ri: any) => ({
                  ...ri,
                  quantity: ri.quantity * factor
              }));
          }
      }

      setPrintOrder({ ...o, items: printItems });
  };

  return (
    <div className="production-orders-module">
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title">{lang === 'ar' ? 'أوامر الإنتاج' : 'Production Orders'}</h2>
            <button className="btn-primary" onClick={openAdd}>{lang === 'ar' ? '+ أمر جديد' : '+ New Order'}</button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead style={{ background: '#1e293b', borderBottom: '2px solid #0f172a' }}>
              <tr>
                <th style={{ color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'رقم الأمر' : 'Order #'}</th>
                <th style={{ color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'المنتج النهائي' : 'Product'}</th>
                <th style={{ textAlign: 'center', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                <th style={{ textAlign: 'center', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'المستودع' : 'Warehouse'}</th>
                <th style={{ textAlign: 'center', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {(orders || []).map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td><code>{o.orderNumber}</code></td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '800', color: '#ffffff', fontSize: '1.05rem' }}>{lang === 'ar' && o.product?.nameAr ? o.product.nameAr : o.product?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 'bold' }}>{o.product?.sku}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                        {(o.items?.length || 0) > 0 ? o.items.length : ((costCenters || []).find(cc => cc.productId === o.productId)?.items?.length || 0)} {lang === 'ar' ? 'مكونات' : 'Ingredients'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '900', color: '#fbbf24', fontSize: '1.2rem' }}>
                    {o.quantity} <small style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      {lang === 'ar' ? (o.product?.unitRef?.nameAr || o.product?.unit) : (o.product?.unitRef?.name || o.product?.unit)}
                    </small>
                  </td>
                  <td style={{ textAlign: 'center', color: '#f8fafc' }}>{lang === 'ar' ? (o.warehouse?.nameAr || o.warehouse?.name) : o.warehouse?.name}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ 
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold',
                        background: o.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: o.status === 'Completed' ? '#10b981' : '#fbbf24',
                        border: `1px solid ${o.status === 'Completed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                    }}>
                        {lang === 'ar' ? (o.status === 'Completed' ? 'مكتمل' : 'مسودة') : o.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }} className="no-print">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn-icon" onClick={() => handleShowPrint(o)} title={lang === 'ar' ? 'عرض المكونات والطباعة' : 'Show Components & Print'}>
                            📋
                        </button>
                        {o.status === 'Draft' && (
                            <>
                                <button 
                                    className="btn-secondary" 
                                    onClick={() => handleComplete(o.id)} 
                                    disabled={isSubmitting}
                                    style={{ padding: '4px 10px', fontSize: '0.8rem', background: '#ecfdf5', color: '#059669', borderColor: '#a7f3d0' }}
                                >
                                    {isSubmitting ? '...' : (lang === 'ar' ? 'اعتماد' : 'Finalize')}
                                </button>
                                <button className="btn-icon" onClick={() => openEdit(o)} title={lang === 'ar' ? 'تعديل' : 'Edit'}>
                                    ✏️
                                </button>
                                <button className="btn-icon delete" onClick={() => handleDelete(o.id)} title={lang === 'ar' ? 'حذف' : 'Delete'} style={{ color: '#dc2626' }}>
                                    🗑️
                                </button>
                            </>
                        )}
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
          <div className="modal-content" style={{ maxWidth: '900px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>{editingOrder ? (lang === 'ar' ? 'تعديل أمر الإنتاج' : 'Edit Production Order') : (lang === 'ar' ? 'إنشاء أمر إنتاج' : 'Create Production Order')}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)} style={{ lineHeight: 1 }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
               <div className="modal-body-scroll" style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                          <label>{lang === 'ar' ? 'المنتج النهائي' : 'Finished Product'}</label>
                          <select required value={formData.productId} onChange={e => handleProductChange(e.target.value)}>
                              <option value="">-- {lang === 'ar' ? 'اختر المنتج' : 'Select Product'} --</option>
                              {products.filter(p => p.classification === 'Finished Product' || p.classification === 'Semi-finished').map(p => (
                                  <option key={p.id} value={p.id}>{p.sku} - {lang === 'ar' && p.nameAr ? p.nameAr : p.name}</option>
                              ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>{lang === 'ar' ? 'الكمية المطلوب إنتاجها' : 'Quantity to Produce'}</label>
                          <input type="number" step="0.01" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})} />
                        </div>
                        <div className="form-group">
                          <label>{lang === 'ar' ? 'المستودع' : 'Warehouse'}</label>
                          <select value={formData.warehouseId} onChange={e => setFormData({...formData, warehouseId: e.target.value})}>
                              {warehouses.map(w => (
                                  <option key={w.id} value={w.id}>{lang === 'ar' ? (w.nameAr || w.name) : w.name}</option>
                              ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>{lang === 'ar' ? 'ملاحظات' : 'Notes'}</label>
                          <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                        </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#475569', fontSize: '0.95rem' }}>{lang === 'ar' ? 'مكونات الإنتاج المطلوبة' : 'Required Components'}</h4>
                        {selectedRecipe ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflow: 'hidden' }}>
                                <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
                                    {(selectedRecipe.items || []).map((it: any, i: number) => {
                                        const factor = getScalingFactor();
                                        const recipeTotal = calculateRecipeTotalWeight(selectedRecipe);
                                        const itWeightG = getWeightInGrams(it.quantity, it.unitId || it.product?.unitId);
                                        const percentage = recipeTotal > 0 ? (itWeightG / recipeTotal) * 100 : 0;
                                        
                                        return (
                                          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                                              <div style={{ flex: 1 }}>
                                                  <div style={{ fontWeight: '600' }}>{lang === 'ar' && (it.product?.nameAr || it.nameAr) ? (it.product?.nameAr || it.nameAr) : (it.product?.name || it.name)}</div>
                                                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                                      {it.product?.sku || it.sku} • <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>{percentage.toFixed(1)}%</span>
                                                  </div>
                                              </div>
                                              <div style={{ textAlign: 'right' }}>
                                                  <div style={{ fontWeight: '800', color: '#2563eb' }}>
                                                       {(it.quantity * factor).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 3 })} <small>
                                                         {lang === 'ar' ? (it.unit?.nameAr || it.unit?.name || it.product?.unit || it.unit) : (it.unit?.name || it.product?.unit || it.unit)}
                                                       </small>
                                                  </div>
                                                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{lang === 'ar' ? 'سعر الوحدة:' : 'Unit Cost:'} {(it.costPrice || 0).toFixed(4)}</div>
                                              </div>
                                          </div>
                                        );
                                    })}
                                </div>
                                <div className="total-weight-box">
                                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontSize: '0.8rem', color: '#115e59', fontWeight: 'bold' }}>{lang === 'ar' ? 'إجمالي وزن المكونات:' : 'Total Output weight:'}</span>
                                      <span style={{ fontWeight: '900', color: '#0f766e', fontSize: '1rem' }}>
                                          {(() => {
                                              const prod = products.find(p => p.id === formData.productId);
                                              const reqVal = getUnitWeightInGrams(formData.quantity, prod?.unitId || '');
                                              return reqVal.toLocaleString();
                                          })()} g
                                      </span>
                                   </div>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-recipe">{lang === 'ar' ? '⚠️ لا توجد وصفة مختارة' : '⚠️ No recipe found'}</div>
                        )}
                    </div>
                  </div>
               </div>
               <div className="modal-footer">
                    {selectedRecipe && (
                        <button type="button" className="btn-secondary" onClick={() => {
                            const factor = getScalingFactor();
                            setPrintOrder({ 
                                ...formData, 
                                product: products.find(p => p.id === formData.productId), 
                                items: selectedRecipe.items.map((it: any) => ({ ...it, quantity: it.quantity * factor })) 
                            });
                        }} style={{ background: '#fffbeb', color: '#92400e', borderColor: '#fcd34d' }}>
                           {lang === 'ar' ? '🖨️ معاينة الطباعة' : '🖨️ Print Preview'}
                        </button>
                    )}
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                    <button type="submit" className="btn-primary" disabled={isSubmitting || !selectedRecipe}>
                        {isSubmitting ? '...' : (lang === 'ar' ? 'حفظ وإرسال للإنتاج' : 'Save & Submit')}
                    </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {printOrder && (
          <div className="print-preview-overlay">
              <div className="print-paper">
                  <div className="print-actions no-print">
                      <button className="btn-primary" onClick={() => window.print()}>{lang === 'ar' ? 'طباعة الآن' : 'Print Now'}</button>
                      <button className="btn-secondary" onClick={() => setPrintOrder(null)}>{lang === 'ar' ? 'إغلاق' : 'Close'}</button>
                  </div>
                  
                  <div className="print-header">
                      <div className="company-info">
                          <h1 style={{ margin: 0, color: '#1e293b' }}>{lang === 'ar' ? 'أمر تشغيل إنتاج' : 'Production Work Order'}</h1>
                          <p>{new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="order-meta">
                          {printOrder.orderNumber && <p><strong># {printOrder.orderNumber}</strong></p>}
                          <p>{lang === 'ar' ? 'الحالة:' : 'Status:'} {printOrder.status || '-'}</p>
                      </div>
                  </div>

                  <div className="print-summary">
                      <div className="summary-item">
                          <label>{lang === 'ar' ? 'المنتج النهائي:' : 'Finished Product:'}</label>
                          <div className="value">{lang === 'ar' && (printOrder.product?.nameAr || printOrder.nameAr) ? (printOrder.product.nameAr || printOrder.nameAr) : (printOrder.product?.name || printOrder.name)}</div>
                          <small>{printOrder.product?.sku || printOrder.sku}</small>
                      </div>
                      <div className="summary-item">
                          <label>{lang === 'ar' ? 'الكمية المطلوبة:' : 'Target Qty:'}</label>
                          <div className="value" style={{ fontSize: '1.5rem' }}>
                              {(parseFloat(printOrder.quantity) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                              {' '}{lang === 'ar' ? (printOrder.product?.unitRef?.nameAr || printOrder.product?.unit) : (printOrder.product?.unitRef?.name || printOrder.product?.unit)}
                          </div>
                      </div>
                  </div>

                  <div className="print-body">
                      <h3>{lang === 'ar' ? 'المكونات والمواد الخام المطلوبة' : 'Required Raw Materials'}</h3>
                      <table className="print-table">
                          <thead>
                               <tr>
                                  <th>{lang === 'ar' ? 'الصنف' : 'Ingredient'}</th>
                                  <th>{lang === 'ar' ? 'SKU' : 'SKU'}</th>
                                  <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                                  <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الوحدة' : 'Unit'}</th>
                              </tr>
                          </thead>
                          <tbody>
                              {(printOrder.items || []).map((it: any, i: number) => {
                                  const unit = (units || []).find(u => u.id === it.unitId);
                                  const itemName = lang === 'ar' ? (it.product?.nameAr || it.nameAr) : (it.product?.name || it.name);
                                  const itemSku = it.product?.sku || it.sku;
                                  const itemUnit = lang === 'ar' ? (unit?.nameAr || unit?.name || it.product?.unit || it.unit) : (unit?.name || it.product?.unit || it.unit);
                                  
                                  return (
                                    <tr key={i}>
                                        <td>{itemName || it.id}</td>
                                        <td><code>{itemSku || 'N/A'}</code></td>
                                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{(it.quantity || 0).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 3 })}</td>
                                        <td style={{ textAlign: 'center' }}>{itemUnit || '-'}</td>
                                    </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>

                  <div className="print-footer">
                      <div className="signature-box">
                          <p>{lang === 'ar' ? 'توقيع المسؤول:' : 'Supervisor Signature:'}</p>
                          <div className="line"></div>
                      </div>
                      <div className="signature-box">
                          <p>{lang === 'ar' ? 'المستخرج بواسطة:' : 'Extracted By:'}</p>
                          <div className="line"></div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <style jsx>{`
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(8px); }
        .modal-content { background: white; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; }
        .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .close-btn { background: none; border: none; font-size: 1.8rem; cursor: pointer; color: #94a3b8; }
        
        .btn-icon { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; color: #94a3b8; }
        .btn-icon:hover { background: #f1f5f9; color: #3b82f6; }
        .btn-icon.delete:hover { color: #dc2626; background: #fef2f2; }

        .form-group label { display: block; margin-bottom: 0.5rem; color: #475569; font-weight: 600; }
        .form-group select, .form-group input, .form-group textarea { width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1; font-family: inherit; }
        
        .total-weight-box { marginTop: 0.5rem; padding: 12px; background: #f0fdfa; borderRadius: 10px; border: 1px solid #ccfbf1; }
        .empty-recipe { textAlign: center; padding: 3rem; color: #94a3b8; fontSize: 0.9rem; background: #ffffff; borderRadius: 8px; border: 1px dashed #cbd5e1; }
        .modal-footer { padding: 1.25rem 1.5rem; background: #f8fafc; borderTop: 1px solid #e2e8f0; display: flex; justifyContent: flex-end; gap: 1rem; }

        /* Print Preview Styles */
        .print-preview-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 2000; overflow-y: auto; padding: 2rem; display: flex; justify-content: center; }
        .print-paper { background: white; color: #1e293b; width: 210mm; min-height: 297mm; padding: 20mm; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
        .print-header { display: flex; justify-content: space-between; border-bottom: 2px solid #1e293b; padding-bottom: 1rem; margin-bottom: 2rem; }
        .print-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #e2e8f0; }
        .summary-item label { display: block; font-size: 0.75rem; color: #64748b; font-weight: bold; text-transform: uppercase; margin-bottom: 0.25rem; }
        .summary-item .value { font-size: 1.2rem; font-weight: 800; color: #1e293b; }
        .print-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .print-table th { background: #f1f5f9; padding: 12px; text-align: left; font-size: 0.85rem; border: 1px solid #e2e8f0; color: #475569; }
        .print-table td { padding: 12px; border: 1px solid #e2e8f0; font-size: 0.95rem; color: #1e293b; }
        .print-footer { margin-top: 4rem; display: flex; justify-content: space-between; gap: 4rem; }
        .signature-box { flex: 1; }
        .signature-box p { font-size: 0.85rem; font-weight: bold; color: #475569; margin-bottom: 2rem; }
        .signature-box .line { border-bottom: 1px solid #cbd5e1; }
        
        @media print {
            .no-print { display: none !important; }
            .print-preview-overlay { position: static; padding: 0; background: none; }
            .print-paper { box-shadow: none; width: 100%; height: auto; padding: 0; }
        }
      `}</style>
    </div>
  );
}

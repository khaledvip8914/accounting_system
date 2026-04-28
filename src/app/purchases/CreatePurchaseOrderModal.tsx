'use client';

import { useState } from 'react';
import SearchableSelect from '@/components/SearchableSelect';

interface Product {
  id: string;
  sku: string;
  name: string;
  nameAr?: string;
  costPrice: number;
  stockQuantity: number;
  reorderPoint?: number;
  unit: string;
  unitId?: string;
  unitRef?: { name: string; nameAr?: string };
  supplierId?: string;
}

interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  nameAr?: string;
  quantity: number;
  unitId?: string;
  unit?: string;
  supplierId?: string;
  unitPrice: number;
  total: number;
}

export default function CreatePurchaseOrderModal({
  orderToEdit,
  suppliers,
  products,
  warehouses,
  lang,
  onClose,
  onSave
}: {
  orderToEdit?: any;
  suppliers: any[];
  products: Product[];
  warehouses: any[];
  lang: string;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [formData, setFormData] = useState({
    supplierId: orderToEdit?.supplierId || '',
    warehouseId: orderToEdit?.warehouseId || '',
    date: orderToEdit?.date ? new Date(orderToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    notes: orderToEdit?.notes || '',
    status: orderToEdit?.status || 'Pending',
    isTaxInclusive: orderToEdit?.isTaxInclusive ?? true,
    items: orderToEdit?.items?.map((i: any) => ({
      productId: i.productId,
      sku: i.product?.sku,
      name: i.product?.name,
      nameAr: i.product?.nameAr,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      unitId: i.unitId,
      unit: i.product?.unit,
      supplierId: i.product?.supplierId,
      total: i.total
    })) || (products.filter(p => p.stockQuantity <= 0).map(p => ({
      productId: p.id,
      sku: p.sku,
      name: p.name,
      nameAr: p.nameAr,
      quantity: Math.max(1, (p.reorderPoint || 1)),
      unitPrice: p.costPrice || 0,
      unitId: p.unitId,
      unit: p.unit,
      supplierId: p.supplierId,
      total: Math.max(1, (p.reorderPoint || 1)) * (p.costPrice || 0)
    })))
  });

  const [isSaving, setIsSaving] = useState(false);
  const [autoImportType, setAutoImportType] = useState<'out' | 'low' | 'both'>('out');

  const populateItems = (type: 'out' | 'low' | 'both') => {
    const newItems = products.filter(p => {
        if (type === 'out') return p.stockQuantity <= 0;
        if (type === 'low') return p.stockQuantity > 0 && p.stockQuantity <= (p.reorderPoint || 0);
        if (type === 'both') return p.stockQuantity <= (p.reorderPoint || 0);
        return false;
    }).map(p => {
      let qty = 1;
      if (type === 'out') qty = Math.max(1, (p.reorderPoint || 1));
      else qty = Math.max(1, (p.reorderPoint || 0) - p.stockQuantity);
      
      return {
        productId: p.id,
        sku: p.sku,
        name: p.name,
        nameAr: p.nameAr,
        quantity: qty,
        unitPrice: p.costPrice || 0,
        unitId: p.unitId,
        unit: p.unit,
        supplierId: p.supplierId,
        total: qty * (p.costPrice || 0)
      };
    });
    
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleAddItem = (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;
    if (formData.items.find((i:OrderItem) => i.productId === productId)) return;

    const newItem: OrderItem = {
      productId: p.id,
      sku: p.sku,
      name: p.name,
      nameAr: p.nameAr,
      quantity: 1,
      unitPrice: p.costPrice || 0,
      unitId: p.unitId,
      unit: p.unit,
      supplierId: p.supplierId,
      total: p.costPrice || 0
    };

    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const updateItem = (index: number, updates: Partial<OrderItem>) => {
    const newItems = [...formData.items];
    const item = { ...newItems[index], ...updates };
    item.total = (item.quantity || 0) * (item.unitPrice || 0);
    newItems[index] = item;
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index: number) => {
    setFormData({ ...formData, items: formData.items.filter((_:any, i:number) => i !== index) });
  };

  const netAmount = formData.items.reduce((s:number, i:OrderItem) => s + i.total, 0);
  const subtotal = netAmount / 1.15;
  const taxAmount = netAmount - subtotal;

  const handleSave = async () => {
    if (formData.items.length === 0) return alert(lang === 'ar' ? 'يرجى إضافة أصناف' : 'Please add items');
    
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        subtotal,
        taxAmount,
        discount: 0,
        netAmount
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '1000px', width: '95%', maxHeight: '95vh' }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{orderToEdit ? (lang === 'ar' ? 'تعديل طلب شراء' : 'Edit Purchase Order') : (lang === 'ar' ? 'إنشاء طلب شراء جديد' : 'New Purchase Order')}</h2>
            <div style={{ color: 'red', fontSize: '0.7rem', fontWeight: 'bold' }}>VERSION: 2.1 - CORRECTED COLUMNS</div>
          </div>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <div className="modal-body" style={{ padding: '1.5rem', overflowY: 'auto' }}>
           <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>{lang === 'ar' ? 'المورد' : 'Supplier'}</label>
                <SearchableSelect 
                  options={suppliers}
                  value={formData.supplierId}
                  onChange={(val) => setFormData({...formData, supplierId: val})}
                  lang={lang}
                />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'التاريخ' : 'Date'}</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'المخزن' : 'Warehouse'}</label>
                <select value={formData.warehouseId} onChange={e => setFormData({...formData, warehouseId: e.target.value})}>
                   <option value="">{lang === 'ar' ? 'اختر المخزن...' : 'Select Warehouse...'}</option>
                   {warehouses.map(w => <option key={w.id} value={w.id}>{lang === 'ar' ? w.nameAr || w.name : w.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'الحالة' : 'Status'}</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                   <option value="Pending">{lang === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
                   <option value="Ordered">{lang === 'ar' ? 'تم الطلب' : 'Ordered'}</option>
                   <option value="Closed">{lang === 'ar' ? 'مغلق' : 'Closed'}</option>
                   <option value="Cancelled">{lang === 'ar' ? 'ملغي' : 'Cancelled'}</option>
                </select>
              </div>
           </div>

           {!orderToEdit && (
               <div style={{ marginBottom: '1.5rem', background: '#e0f2fe', padding: '1rem', borderRadius: '8px', border: '1px solid #bae6fd', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label style={{ fontWeight: '600', color: '#0369a1' }}>{lang === 'ar' ? 'استيراد النواقص:' : 'Import Shortages:'}</label>
                  <select 
                    value={autoImportType} 
                    onChange={e => {
                        const type = e.target.value as 'out' | 'low' | 'both';
                        setAutoImportType(type);
                        if (confirm(lang === 'ar' ? 'هل أنت متأكد؟ سيتم استبدال القائمة الحالية.' : 'Are you sure? Current list will be replaced.')) {
                           populateItems(type);
                        } else {
                           // User chose not to update list.
                        }
                    }}
                    style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #7dd3fc', background: 'white', outline: 'none' }}
                  >
                     <option value="out">{lang === 'ar' ? 'المنتجات التي نفدت (رصيد 0 أو أقل)' : 'Out of Stock (0 qty)'}</option>
                     <option value="low">{lang === 'ar' ? 'المنتجات التي أوشكت على النفاذ' : 'Low Stock Products'}</option>
                     <option value="both">{lang === 'ar' ? 'كلاهما معاً' : 'Both (Out & Low Stock)'}</option>
                  </select>
                  <button type="button" onClick={() => populateItems(autoImportType)} className="btn-secondary" style={{ padding: '0.4rem 1rem', background: 'white', color: '#0369a1', borderColor: '#7dd3fc' }}>
                     {lang === 'ar' ? 'تحديث القائمة' : 'Update List'}
                  </button>
               </div>
           )}

           <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{lang === 'ar' ? 'إضافة صنف للطلب:' : 'Add item to order:'}</label>
              <SearchableSelect 
                options={products}
                value=""
                onChange={handleAddItem}
                lang={lang}
                placeholder={lang === 'ar' ? "ابحث عن صنف..." : "Search product..."}
              />
           </div>

           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                 <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>#</th>
                    <th style={{ padding: '0.75rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'الصنف' : 'Product'}</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>{lang === 'ar' ? 'السعر' : 'Price'}</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>{lang === 'ar' ? 'المورد' : 'Supplier'}</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                    <th></th>
                 </tr>
              </thead>
              <tbody>
                 {formData.items.map((item:OrderItem, idx:number) => (
                   <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.75rem' }}>{idx + 1}</td>
                      <td style={{ padding: '0.75rem' }}>
                         <div style={{ fontWeight: '600' }}>{lang === 'ar' ? item.nameAr || item.name : item.name}</div>
                         <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.sku}</div>
                      </td>
                      <td style={{ padding: '0.75rem', width: '100px' }}>
                         <input type="number" className="qty-input" value={item.quantity} onChange={e => updateItem(idx, { quantity: parseFloat(e.target.value) || 0 })} />
                      </td>
                      <td style={{ padding: '0.75rem', width: '100px' }}>
                         <input type="number" className="qty-input" value={item.unitPrice} onChange={e => updateItem(idx, { unitPrice: parseFloat(e.target.value) || 0 })} />
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                          <select 
                            value={item.supplierId || ''} 
                            onChange={e => updateItem(idx, { supplierId: e.target.value })}
                            style={{ width: '100%', padding: '0.3rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.8rem' }}
                          >
                             <option value="">--</option>
                             {suppliers.map(s => <option key={s.id} value={s.id}>{lang === 'ar' ? s.nameAr || s.name : s.name}</option>)}
                          </select>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>{(Number(item.total) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                         <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>

           <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                 <span style={{ color: '#64748b' }}>{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                 <span style={{ fontWeight: '600' }}>{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', gap: '2rem' }}>
                 <span style={{ color: '#64748b' }}>{lang === 'ar' ? 'الضريبة (15%):' : 'VAT (15%):'}</span>
                 <span style={{ fontWeight: '600' }}>{taxAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', gap: '2rem', fontSize: '1.25rem', borderTop: '2px solid #e2e8f0', paddingTop: '0.5rem' }}>
                 <span style={{ fontWeight: 'bold' }}>{lang === 'ar' ? 'الإجمالي الكلي:' : 'Grand Total:'}</span>
                 <span style={{ fontWeight: 'bold', color: '#059669' }}>{netAmount.toLocaleString()} SAR</span>
              </div>
           </div>

           <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>{lang === 'ar' ? 'ملاحظات' : 'Notes'}</label>
              <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
           </div>
        </div>

        <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
           <button className="btn-secondary" onClick={onClose} disabled={isSaving}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
           <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ طلب الشراء' : 'Save Order')}
           </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .modal-content { background: white; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; color: #1e293b; }
        .modal-header { padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; }
        .form-group label { display: block; margin-bottom: 0.4rem; font-size: 0.875rem; font-weight: 500; color: #475569; }
        .form-group input, .form-group select { width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; }
        .qty-input { width: 100%; padding: 0.4rem; border: 1px solid #cbd5e1; border-radius: 6px; text-align: center; }
        .btn-primary { background: #059669; color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .btn-secondary { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0.6rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}

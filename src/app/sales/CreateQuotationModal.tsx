'use client';

import { useState, useMemo } from 'react';

type Product = {
  id: string;
  sku: string;
  name: string;
  nameAr: string | null;
  salePrice: number;
  stockQuantity: number;
};

type Customer = {
  id: string;
  code: string;
  name: string;
  nameAr: string | null;
  balance: number;
};

type Warehouse = {
  id: string;
  code: string;
  name: string;
  nameAr: string | null;
};

type QuotationItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export default function CreateQuotationModal({
  quotationToEdit,
  customers,
  products,
  onClose,
  lang,
  onSave,
  warehouses
}: {
  quotationToEdit?: any,
  customers: Customer[],
  products: Product[],
  onClose: () => void,
  lang: string,
  onSave: (data: any) => Promise<void>,
  warehouses: Warehouse[]
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(quotationToEdit?.customerId || '');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(quotationToEdit?.warehouseId || '');
  const [quotationDate, setQuotationDate] = useState(
    quotationToEdit ? new Date(quotationToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [validUntil, setValidUntil] = useState(
    quotationToEdit?.validUntil ? new Date(quotationToEdit.validUntil).toISOString().split('T')[0] : ''
  );
  
  const [items, setItems] = useState<QuotationItem[]>(
    quotationToEdit && quotationToEdit.items ? quotationToEdit.items.map((i: any) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      total: i.total
    })) : [{ productId: '', quantity: 1, unitPrice: 0, total: 0 }]
  );
  
  const [discount, setDiscount] = useState(quotationToEdit?.discount || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        item.unitPrice = product.salePrice;
      }
    }
    
    item.total = item.quantity * item.unitPrice;
    newItems[index] = item;
    setItems(newItems);
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = 0.15; // 15% VAT
    const taxAmount = (subtotal - discount) * taxRate;
    const netAmount = (subtotal - discount) + taxAmount;
    return { subtotal, taxAmount, netAmount };
  }, [items, discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || items.some(i => !i.productId)) {
        alert(lang === 'ar' ? 'يرجى اختيار العميل وإضافة الأصناف بصورة صحيحة' : 'Please select a customer and add items correctly');
        return;
    }

    setIsSubmitting(true);
    try {
        await onSave({
            customerId: selectedCustomerId,
            warehouseId: selectedWarehouseId || null,
            date: quotationDate,
            validUntil: validUntil || null,
            items,
            discount,
            ...totals,
            status: quotationToEdit?.status || 'Draft'
        });
        onClose();
    } catch (error) {
        console.error(error);
        alert('Error saving quotation');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content quotation-modal">
        <div className="modal-header" style={{ borderBottomColor: '#fde68a' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="modal-icon" style={{ background: '#fffbeb', border: '1.5px solid #fde68a', color: '#ca8a04' }}>📄</div>
              <div>
                <h2 className="modal-title">
                  {quotationToEdit 
                    ? (lang === 'ar' ? `تعديل عرض سعر #${quotationToEdit.quotationNumber}` : `Edit Quotation #${quotationToEdit.quotationNumber}`)
                    : (lang === 'ar' ? 'تسعيرة / عرض سعر جديد' : 'New Sales Quotation')}
                </h2>
                <p className="text-sub">
                  {quotationToEdit 
                    ? (lang === 'ar' ? 'تعديل بيانات عرض السعر المحدد' : 'Modify the selected price estimate') 
                    : (lang === 'ar' ? 'إضافة عرض سعر جديد للعميل' : 'Create a new price estimate for the customer')}
                </p>
              </div>
           </div>
           <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="quotation-form-grid">
            <div className="form-group">
              <label>{lang === 'ar' ? 'العميل' : 'Customer'}</label>
              <select 
                value={selectedCustomerId} 
                onChange={e => setSelectedCustomerId(e.target.value)}
                required
              >
                <option value="">{lang === 'ar' ? '--- اختر عميلاً ---' : '--- Select Customer ---'}</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {lang === 'ar' && c.nameAr ? c.nameAr : c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'تاريخ العرض' : 'Quotation Date'}</label>
              <input 
                type="date" 
                value={quotationDate} 
                onChange={e => setQuotationDate(e.target.value)} 
                required
              />
            </div>

            <div className="form-group">
                <label>{lang === 'ar' ? 'مستودع العرض (اختياري)' : 'Warehouse (Optional)'}</label>
                <select value={selectedWarehouseId} onChange={e => setSelectedWarehouseId(e.target.value)}>
                    <option value="">{lang === 'ar' ? '--- بدون مستودع ---' : '--- No Warehouse ---'}</option>
                    {warehouses.map(w => (
                        <option key={w.id} value={w.id}>{lang === 'ar' && w.nameAr ? w.nameAr : w.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>{lang === 'ar' ? 'صلاحية العرض حتى' : 'Valid Until'}</label>
                <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} />
            </div>
          </div>

          <div className="items-section" style={{ background: '#fffbeb', borderColor: '#fef3c7' }}>
            <div className="items-header">
               <span style={{ color: '#854d0e' }}>{lang === 'ar' ? 'الأصناف المسعرة' : 'Quoted Items'}</span>
               <button type="button" className="btn-add-item" style={{ background: '#ca8a04' }} onClick={addItem}>
                 {lang === 'ar' ? '+ إضافة صنف' : '+ Add Item'}
               </button>
            </div>
            
            <div className="items-table-wrapper">
               <table className="form-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>{lang === 'ar' ? 'الصنف' : 'Product'}</th>
                      <th>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                      <th>{lang === 'ar' ? 'سعر الوحدة' : 'Unit Price'}</th>
                      <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td>
                           <select 
                             value={item.productId} 
                             onChange={e => updateItem(index, 'productId', e.target.value)}
                             required
                           >
                             <option value="">{lang === 'ar' ? 'اختر صنفاً...' : 'Select item...'}</option>
                             {products.map(p => (
                               <option key={p.id} value={p.id}>
                                 {p.sku} - {lang === 'ar' && p.nameAr ? p.nameAr : p.name}
                               </option>
                             ))}
                           </select>
                        </td>
                        <td>
                          <input 
                            type="number" 
                            min="1" 
                            step="any"
                            value={item.quantity} 
                            onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            step="0.01"
                            value={item.unitPrice} 
                            onChange={e => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)} 
                          />
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: '600' }}>
                           {item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td>
                           {items.length > 1 && (
                             <button type="button" className="btn-remove" onClick={() => removeItem(index)}>&times;</button>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>

          <div className="invoice-footer">
             <div className="extra-notes">
                 <label>{lang === 'ar' ? 'شروط عرض السعر' : 'Quotation Terms'}</label>
                 <textarea placeholder={lang === 'ar' ? "أدخل أي شروط (مثل مدة التوريد، طريقة الدفع)..." : "Enter any terms (e.g., delivery time, payment terms)..."}></textarea>
             </div>
             
             <div className="totals-summary">
                <div className="total-row">
                   <span>{lang === 'ar' ? 'المجموع' : 'Subtotal'}</span>
                   <span>{totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="total-row">
                   <span>{lang === 'ar' ? 'الخصم' : 'Discount'}</span>
                   <input 
                     type="number" 
                     className="discount-input"
                     value={discount} 
                     onChange={e => setDiscount(parseFloat(e.target.value) || 0)} 
                   />
                </div>
                <div className="total-row">
                   <span>{lang === 'ar' ? 'الضريبة (15%)' : 'Tax (15%)'}</span>
                   <span>{totals.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="total-row net-total" style={{ borderTopColor: '#fde68a' }}>
                   <span>{lang === 'ar' ? 'إجمالي العرض' : 'Net Total'}</span>
                   <span style={{ color: '#ca8a04' }}>{totals.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR</span>
                </div>
             </div>
          </div>

          <div className="modal-actions" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button type="submit" className="btn-primary" style={{ background: '#ca8a04' }} disabled={isSubmitting}>
                {isSubmitting 
                  ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                  : (lang === 'ar' ? 'حفظ عرض السعر 📄' : 'Save Quotation 📄')}
              </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .quotation-modal { max-width: 900px; max-height: 90vh; overflow-y: auto; background: white; border-radius: 1.25rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); padding: 2.5rem; width: 100%; }
        .quotation-form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem 2.5rem; margin-bottom: 2.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem; }
        .items-section { padding: 1.5rem; border-radius: 12px; margin-bottom: 2.5rem; border: 1px solid; }
        .items-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 700; }
        .btn-add-item { color: white; border: none; padding: 0.4rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600; }
        .form-table { width: 100%; border-collapse: collapse; }
        .form-table th { text-align: left; font-size: 0.75rem; text-transform: uppercase; color: #92400e; padding-bottom: 0.5rem; }
        .form-table td { padding: 0.5rem 0; }
        input, select, textarea { width: 100%; padding: 0.625rem; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; font-size: 0.875rem; transition: border-color 0.2s; }
        input:focus, select:focus { border-color: #ca8a04; }
        .btn-remove { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .invoice-footer { display: flex; gap: 3rem; justify-content: space-between; }
        .extra-notes { flex: 1; }
        .extra-notes textarea { height: 100px; margin-top: 0.5rem; resize: none; }
        .totals-summary { min-width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 0.5rem 0; color: #64748b; font-size: 0.9rem; }
        .net-total { border-top: 2px solid; margin-top: 1rem; padding-top: 1rem; font-size: 1.25rem; font-weight: 900; color: #1e293b; }
        .discount-input { width: 80px; padding: 2px 8px; text-align: right; }
        .modal-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
      `}</style>
    </div>
  );
}

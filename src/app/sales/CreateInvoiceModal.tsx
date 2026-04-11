'use client';

import { useState, useMemo, useEffect } from 'react';

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

type InvoiceItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type Account = { id: string; code: string; name: string; nameAr: string | null; type: string };

export default function CreateInvoiceModal({
  invoiceToEdit,
  customers,
  products,
  accounts,
  onClose,
  lang,
  onSave,
  warehouses
}: {
  invoiceToEdit?: any,
  customers: Customer[],
  products: Product[],
  accounts: Account[],
  onClose: () => void,
  lang: string,
  onSave: (data: any) => Promise<void>,
  warehouses: Warehouse[]
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(invoiceToEdit?.customerId || '');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(invoiceToEdit?.warehouseId || '');
  const [invoiceDate, setInvoiceDate] = useState(
    invoiceToEdit ? new Date(invoiceToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  
  const [items, setItems] = useState<InvoiceItem[]>(
    invoiceToEdit && invoiceToEdit.items ? invoiceToEdit.items.map((i: any) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      total: i.total
    })) : [{ productId: '', quantity: 1, unitPrice: 0, total: 0 }]
  );
  
  const [discount, setDiscount] = useState(invoiceToEdit?.discount || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentType, setPaymentType] = useState<'paid' | 'credit'>(invoiceToEdit?.status === 'Paid' ? 'paid' : 'credit');
  const [receiptAccountId, setReceiptAccountId] = useState('');
  const [accountSearch, setAccountSearch] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const filteredAccounts = useMemo(() => {
    const q = accountSearch.toLowerCase();
    return (accounts || []).filter(a =>
      (a?.code || '').toLowerCase().includes(q) ||
      (a?.name || '').toLowerCase().includes(q) ||
      (a?.nameAr && a.nameAr.toLowerCase().includes(q))
    ).slice(0, 50) || [];
  }, [accounts, accountSearch]);

  const selectedAccount = accounts?.find(a => a.id === receiptAccountId);

  const getAccountTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      Asset: lang === 'ar' ? 'أصول' : 'Asset',
      Liability: lang === 'ar' ? 'التزامات' : 'Liability',
    };
    return map[type] || type;
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
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
    if (!selectedCustomerId || items.some(i => !i.productId) || !selectedWarehouseId) {
        alert(lang === 'ar' ? 'يرجى اختيار العميل وإضافة الأصناف بصورة صحيحة' : 'Please select a customer, warehouse, and add items correctly');
        return;
    }
    if (paymentType === 'paid' && !receiptAccountId) {
      alert(lang === 'ar' ? 'يرجى تحديد حساب القبض' : 'Please select a receipt account');
      return;
    }

    setIsSubmitting(true);
    try {
        await onSave({
            customerId: selectedCustomerId,
            warehouseId: selectedWarehouseId,
            date: invoiceDate,
            items,
            discount,
            ...totals,
            status: paymentType === 'paid' ? 'Paid' : 'Partially Paid',
            paymentType,
            receiptAccountId: paymentType === 'paid' ? receiptAccountId : null,
        });
        onClose();
    } catch (error) {
        console.error(error);
        alert('Error saving invoice');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content invoice-modal">
        <div className="modal-header">
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="modal-icon">🧾</div>
              <div>
                <h2 className="modal-title">
                  {invoiceToEdit 
                    ? (lang === 'ar' ? `تعديل الفاتورة #${invoiceToEdit.invoiceNumber}` : `Edit Invoice #${invoiceToEdit.invoiceNumber}`)
                    : (lang === 'ar' ? 'فاتورة مبيعات جديدة' : 'New Sales Invoice')}
                </h2>
                <p className="text-sub">
                  {invoiceToEdit 
                    ? (lang === 'ar' ? 'تعديل بيانات الفاتورة المحددة' : 'Modify the selected invoice data') 
                    : (lang === 'ar' ? 'إضافة فاتورة حديثة مرتبطة بالمخزن والمحاسبة' : 'Modern invoice entry with inventory & accounting link')}
                </p>
              </div>
           </div>
           <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="invoice-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
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
              {selectedCustomer && (
                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#2563eb', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  <span>{lang === 'ar' ? 'الرصيد المديوني الحالي:' : 'Current Balance (Receivables):'}</span>
                  <span style={{ color: selectedCustomer.balance > 0 ? '#dc2626' : '#059669' }}>
                    {selectedCustomer.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'مستودع الصرف' : 'Issuing Warehouse'}</label>
              <select 
                value={selectedWarehouseId} 
                onChange={e => setSelectedWarehouseId(e.target.value)}
                required
              >
                <option value="">{lang === 'ar' ? '--- اختر مستودعاً ---' : '--- Select Warehouse ---'}</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.code} - {lang === 'ar' && w.nameAr ? w.nameAr : w.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>{lang === 'ar' ? 'تاريخ الفاتورة' : 'Invoice Date'}</label>
              <input 
                type="date" 
                value={invoiceDate} 
                onChange={e => setInvoiceDate(e.target.value)} 
                required
              />
            </div>
          </div>

          {/* Row 2: Payment Type */}
          <div className="payment-section">
            <div className="payment-section-header">
              <span>{lang === 'ar' ? '💳 طريقة الدفع' : '💳 Payment Method'}</span>
            </div>

            <div className="payment-type-tabs">
              <button
                type="button"
                className={`payment-tab ${paymentType === 'credit' ? 'active credit' : ''}`}
                onClick={() => setPaymentType('credit')}
              >
                <span>📋</span>
                {lang === 'ar' ? 'آجل (ذمة عميل)' : 'On Credit (Receivable)'}
              </button>
              <button
                type="button"
                className={`payment-tab ${paymentType === 'paid' ? 'active paid' : ''}`}
                onClick={() => setPaymentType('paid')}
              >
                <span>💵</span>
                {lang === 'ar' ? 'دفع فوري (استلام)' : 'Immediate Payment'}
              </button>
            </div>

            {paymentType === 'credit' && (
              <div className="credit-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                {lang === 'ar'
                  ? (selectedCustomer 
                      ? `سيتم تسجيل المبلغ كذمة مدينة (آجل) على العميل: ${selectedCustomer.nameAr || selectedCustomer.name}` 
                      : 'يرجى اختيار العميل من القائمة أعلاه لتسجيل الذمة عليه.')
                  : (selectedCustomer
                      ? `The amount will be posted to Accounts Receivable for: ${selectedCustomer.name}`
                      : 'Please select a customer above to post the receivable.')}
              </div>
            )}

            {paymentType === 'paid' && (
              <div className="account-selector-wrapper">
                <label className="account-label">
                  {lang === 'ar' ? 'حساب القبض / الصندوق' : 'Receipt Account / Cash'} <span className="required" style={{ color: '#dc2626' }}>*</span>
                </label>

                <div className="account-search-container" onClick={() => setShowAccountDropdown(true)}>
                  <div className="account-trigger">
                    {selectedAccount ? (
                      <div className="selected-account">
                        <span className="acc-code-badge">{selectedAccount.code}</span>
                        <span className="acc-name">{lang === 'ar' && selectedAccount.nameAr ? selectedAccount.nameAr : selectedAccount.name}</span>
                        <span className="acc-type-badge">{getAccountTypeLabel(selectedAccount.type)}</span>
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>
                        {lang === 'ar' ? '--- ابحث واختر حساب القبض ---' : '--- Search and select receipt account ---'}
                      </span>
                    )}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                  </div>

                  {showAccountDropdown && (
                    <div className="account-dropdown">
                      <div className="account-search-input-wrap">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <input
                          autoFocus
                          type="text"
                          placeholder={lang === 'ar' ? 'ابحث بالكود أو الاسم...' : 'Search by code or name...'}
                          value={accountSearch}
                          onChange={e => setAccountSearch(e.target.value)}
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                      <div className="account-options">
                        {filteredAccounts.length === 0 ? (
                          <div className="no-accounts">{lang === 'ar' ? 'لا توجد حسابات مطابقة' : 'No matching accounts'}</div>
                        ) : (
                          filteredAccounts.map(acc => (
                            <div
                              key={acc.id}
                              className={`account-option ${receiptAccountId === acc.id ? 'selected' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setReceiptAccountId(acc.id);
                                setAccountSearch('');
                                setShowAccountDropdown(false);
                              }}
                            >
                              <span className="acc-code-badge">{acc.code}</span>
                              <span style={{ flex: 1, color: '#1e293b' }}>{lang === 'ar' && acc.nameAr ? acc.nameAr : acc.name}</span>
                              <span className={`acc-type-badge type-${acc.type.toLowerCase()}`}>{getAccountTypeLabel(acc.type)}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {showAccountDropdown && (
                  <div className="dropdown-backdrop" onClick={() => setShowAccountDropdown(false)} />
                )}
              </div>
            )}
          </div>

          <div className="items-section">
            <div className="items-header">
               <span>{lang === 'ar' ? 'الأصناف' : 'Products / Items'}</span>
               <button type="button" className="btn-add-item" onClick={addItem}>
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
                                 {p.sku} - {lang === 'ar' && p.nameAr ? p.nameAr : p.name} ({p.stockQuantity})
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
                 <label>{lang === 'ar' ? 'ملاحظات إضافية' : 'Terms & Remarks'}</label>
                 <textarea placeholder={lang === 'ar' ? "أدخل أي شروط أو ملاحظات..." : "Enter any terms or notes..."}></textarea>
             </div>
             
             <div className="totals-summary">
                <div className="total-row">
                   <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
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
                   <span>{lang === 'ar' ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'}</span>
                   <span>{totals.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="total-row net-total">
                   <span>{lang === 'ar' ? 'الإجمالي النهائي' : 'Net Total'}</span>
                   <span>{totals.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR</span>
                </div>

                {/* Payment Summary */}
                <div className={`payment-summary ${paymentType}`}>
                  {paymentType === 'credit' ? (
                    <>
                      <span>📋 {lang === 'ar' ? 'سيُضاف لذمة العميل' : 'Added to Customer Receivable'}</span>
                      <span style={{ fontWeight: 700 }}>{totals.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR</span>
                    </>
                  ) : (
                    <>
                      <span>💵 {lang === 'ar' ? 'سيُحصل في' : 'Received in'}: {selectedAccount ? `${selectedAccount.code} — ${lang === 'ar' && selectedAccount.nameAr ? selectedAccount.nameAr : selectedAccount.name}` : '—'}</span>
                      <span style={{ fontWeight: 700 }}>{totals.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR</span>
                    </>
                  )}
                </div>
             </div>
          </div>

          <div className="modal-actions" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting 
                  ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                  : invoiceToEdit 
                    ? (lang === 'ar' ? 'حفظ التعديلات 💾' : 'Save Changes 💾')
                    : (lang === 'ar' ? 'حفظ وترحيل الفاتورة 🚀' : 'Save & Post Invoice 🚀')}
              </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .invoice-modal {
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 1.25rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          padding: 2.5rem;
          width: 100%;
        }
        .invoice-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }
        .items-section {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2.5rem;
          border: 1px solid #e2e8f0;
        }
        .items-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-weight: 700;
          color: #1e293b;
        }
        .btn-add-item {
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .form-table {
          width: 100%;
          border-collapse: collapse;
        }
        .form-table th {
          text-align: left;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #64748b;
          padding-bottom: 0.5rem;
        }
        .form-table td {
          padding: 0.5rem 0;
        }
        input, select, textarea {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          outline: none;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }
        input:focus, select:focus {
          border-color: #2563eb;
        }
        .btn-remove {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .invoice-footer {
          display: flex;
          gap: 3rem;
          justify-content: space-between;
        }
        .extra-notes {
          flex: 1;
        }
        .extra-notes textarea {
          height: 100px;
          margin-top: 0.5rem;
          resize: none;
        }
        .totals-summary {
          min-width: 300px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          color: #64748b;
          font-size: 0.9rem;
        }
        .net-total {
          border-top: 2px solid #e2e8f0;
          margin-top: 1rem;
          padding-top: 1rem;
          font-size: 1.25rem;
          font-weight: 900;
          color: #1e293b;
        }
        .discount-input {
          width: 80px;
          padding: 2px 8px;
          text-align: right;
        }

        /* Payment Section Styles */
        .payment-section { background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.5rem; margin-bottom: 2.5rem; }
        .payment-section-header { font-weight: 700; color: #1e293b; margin-bottom: 1rem; font-size: 0.95rem; }
        .payment-type-tabs { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
        .payment-tab { flex: 1; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 10px; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 600; font-size: 0.875rem; color: #64748b; transition: all 0.2s; }
        .payment-tab:hover { border-color: #94a3b8; color: #1e293b; }
        .payment-tab.active.credit { border-color: #6366f1; background: #eff6ff; color: #4338ca; }
        .payment-tab.active.paid { border-color: #2563eb; background: #eff6ff; color: #1d4ed8; }
        .credit-info { display: flex; align-items: flex-start; gap: 0.5rem; background: #eff6ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 0.75rem 1rem; color: #4338ca; font-size: 0.85rem; line-height: 1.5; }

        /* Account Selector Styles */
        .account-selector-wrapper { position: relative; }
        .account-label { display: block; font-weight: 600; font-size: 0.875rem; color: #374151; margin-bottom: 0.4rem; }
        .account-search-container { position: relative; z-index: 100; }
        .account-trigger { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.625rem 0.875rem; border: 1.5px solid #e2e8f0; border-radius: 8px; cursor: pointer; background: white; min-height: 44px; }
        .account-trigger:hover { border-color: #2563eb; }
        .selected-account { display: flex; align-items: center; gap: 0.5rem; flex: 1; }
        .acc-code-badge { background: #dbeafe; color: #1e40af; padding: 0.15rem 0.5rem; border-radius: 5px; font-weight: 700; font-size: 0.8rem; font-family: monospace; white-space: nowrap; }
        .acc-name { font-weight: 600; color: #1e293b; font-size: 0.875rem; }
        .acc-type-badge { font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 5px; font-weight: 600; white-space: nowrap; }
        .type-asset { background: #dbeafe; color: #1d4ed8; }
        .type-liability { background: #fce7f3; color: #9d174d; }
        .account-dropdown { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.12); z-index: 200; overflow: hidden; }
        .account-search-input-wrap { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border-bottom: 1px solid #f1f5f9; }
        .account-search-input-wrap input { border: none; outline: none; padding: 0; width: 100%; font-size: 0.875rem; }
        .account-options { max-height: 240px; overflow-y: auto; }
        .account-option { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 1rem; cursor: pointer; transition: background 0.15s; font-size: 0.875rem; }
        .account-option:hover { background: #f8fafc; }
        .account-option.selected { background: #eff6ff; }
        .no-accounts { padding: 1.5rem; text-align: center; color: #94a3b8; font-size: 0.875rem; }
        .dropdown-backdrop { position: fixed; inset: 0; z-index: 99; }

        .payment-summary { display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; padding: 0.6rem 0.875rem; border-radius: 8px; font-size: 0.8rem; }
        .payment-summary.credit { background: #eff6ff; color: #4338ca; }
        .payment-summary.paid { background: #eff6ff; color: #1d4ed8; }
      `}</style>
    </div>
  );
}

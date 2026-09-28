'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { createSupplier, uploadAttachmentBase64 } from './actions';
import { createWarehouse } from '../warehouses/actions';
import CreateSupplierModal from '@/components/CreateSupplierModal';
import CreateWarehouseModal from '@/components/CreateWarehouseModal';
import SearchableSelect from '@/components/SearchableSelect';
import DimensionSelector from '@/components/DimensionSelector';

type Account = { id: string; code: string; name: string; nameAr: string | null; type: string };

type Currency = {
  id: string;
  code: string;
  name: string;
  nameAr: string | null;
  exchangeRate: number;
  isDefault: boolean;
};

export default function CreatePurchaseModal({
  invoiceToEdit,
  suppliers,
  products,
  accounts,
  warehouses,
  inventoryUnits,
  currencies,
  onClose,
  lang,
  onSave
}: {
  invoiceToEdit?: any,
  suppliers: any[],
  products: any[],
  accounts: Account[],
  warehouses: any[],
  inventoryUnits: any[],
  currencies?: Currency[],
  onClose: () => void,
  lang: string,
  onSave: (data: any) => Promise<void>
}) {
  const [selectedSupplierId, setSelectedSupplierId] = useState(invoiceToEdit?.supplierId || '');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(invoiceToEdit?.warehouseId || '');
  const [invoiceDate, setInvoiceDate] = useState(
    invoiceToEdit ? new Date(invoiceToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [isTaxInclusive, setIsTaxInclusive] = useState(false);
  const [taxRates, setTaxRates] = useState<any[]>([]);
  const [selectedTaxRate, setSelectedTaxRate] = useState<number>(0.15);
  const [paymentType, setPaymentType] = useState<'paid' | 'credit'>(invoiceToEdit?.status === 'Paid' ? 'paid' : 'credit');
  const [paymentAccountId, setPaymentAccountId] = useState('');
  const [accountSearch, setAccountSearch] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  
  const defaultCurrency = currencies?.find(c => c.isDefault)?.code || 'SAR';
  const defaultExchangeRate = currencies?.find(c => c.isDefault)?.exchangeRate || 1.0;

  const [currency, setCurrency] = useState(invoiceToEdit?.currency || defaultCurrency);
  const [exchangeRate, setExchangeRate] = useState<number>(invoiceToEdit?.exchangeRate || defaultExchangeRate);
  
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showQuickAddWarehouse, setShowQuickAddWarehouse] = useState(false);
  
  const [items, setItems] = useState<any[]>(
    invoiceToEdit && invoiceToEdit.items ? invoiceToEdit.items.map((i: any) => ({
      productId: i.productId,
      unitId: i.unitId,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      total: i.total
    })) : [{ productId: '', unitId: '', quantity: 1, unitPrice: 0, total: 0 }]
  );
  
  const [discount, setDiscount] = useState(invoiceToEdit?.discount || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom Fields & Dimensions
  const [customFieldsConfig, setCustomFieldsConfig] = useState<any[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>(
    invoiceToEdit?.customFields ? (typeof invoiceToEdit.customFields === 'string' ? JSON.parse(invoiceToEdit.customFields) : invoiceToEdit.customFields) : {}
  );
  const [dimensionsConfig, setDimensionsConfig] = useState<any[]>([]);
  const [dimensionValues, setDimensionValues] = useState<any[]>(
    invoiceToEdit?.dimensionValues ? (typeof invoiceToEdit.dimensionValues === 'string' ? JSON.parse(invoiceToEdit.dimensionValues) : invoiceToEdit.dimensionValues) : []
  );
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState(invoiceToEdit?.attachmentUrl || '');
  
  const [notes, setNotes] = useState('');
  
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/taxes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTaxRates(data);
          const defaultTax = data.find((t: any) => t.isDefault);
          if (defaultTax) {
            setSelectedTaxRate(defaultTax.rate);
          } else if (data.length > 0) {
            setSelectedTaxRate(data[0].rate);
          }
        }
      })
      .catch(err => console.error('Failed to fetch taxes:', err));

    // Fetch Custom Fields
    fetch('/api/v1/settings/custom-fields?module=PurchaseInvoice')
      .then(res => res.json())
      .then(data => Array.isArray(data) && setCustomFieldsConfig(data))
      .catch(err => console.error('Failed to fetch custom fields:', err));

    // Fetch Dimensions
    fetch('/api/v1/settings/dimensions')
      .then(res => res.json())
      .then(data => Array.isArray(data) && setDimensionsConfig(data))
      .catch(err => console.error('Failed to fetch dimensions:', err));
  }, []);

  // Filter accounts for searchable dropdown
  const filteredAccounts = useMemo(() => {
    const q = accountSearch.toLowerCase();
    return (accounts || []).filter(a =>
      (a?.code || '').toLowerCase().includes(q) ||
      (a?.name || '').toLowerCase().includes(q) ||
      (a?.nameAr || '').toLowerCase().includes(q)
    ).slice(0, 50);
  }, [accounts, accountSearch]);

  const selectedAccount = accounts.find(a => a.id === paymentAccountId);
  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);

  const addItem = () => {
    setItems([...items, { productId: '', unitId: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        item.unitPrice = product.costPrice;
        item.unitId = product.unitId;
      }
    }
    item.total = item.quantity * item.unitPrice;
    newItems[index] = item;
    setItems(newItems);
  };

  const totals = useMemo(() => {
    const rawSubtotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const rawTaxRate = selectedTaxRate;
    const taxRate = rawTaxRate > 1 ? rawTaxRate / 100 : rawTaxRate;
    
    if (isTaxInclusive) {
      const netAmount = rawSubtotal - discount;
      const subtotal = netAmount / (1 + taxRate);
      const taxAmount = netAmount - subtotal;
      return { subtotal, taxAmount, netAmount };
    } else {
      const subtotal = rawSubtotal;
      const taxAmount = (subtotal - discount) * taxRate;
      const netAmount = (subtotal - discount) + taxAmount;
      return { subtotal, taxAmount, netAmount };
    }
  }, [items, discount, isTaxInclusive, selectedTaxRate]);

  const handleQuickAdd = async (data: any) => {
    return createSupplier(data);
  };

  const handleQuickAddWarehouse = async (data: any) => {
    const res = await createWarehouse(data);
    if (res.success && res.warehouse) {
      setSelectedWarehouseId(res.warehouse.id);
    }
    return res;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || !selectedWarehouseId || items.some(i => !i.productId)) {
      alert(lang === 'ar' ? 'يرجى اختيار المورد والمستودع وإضافة الأصناف' : 'Please select supplier, warehouse and add items');
      return;
    }
    if (paymentType === 'paid' && !paymentAccountId) {
      alert(lang === 'ar' ? 'يرجى تحديد حساب الدفع' : 'Please select a payment account');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalAttachmentUrl = attachmentUrl;

      if (attachmentFile) {
        const compressImage = (file: File): Promise<string> => {
          return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
              URL.revokeObjectURL(url);
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              const maxDim = 1200; // max width or height

              if (width > height) {
                if (width > maxDim) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                }
              } else {
                if (height > maxDim) {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (!ctx) return reject(new Error('Canvas not supported'));
              
              ctx.drawImage(img, 0, 0, width, height);
              // Compress to JPEG with 0.7 quality
              const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
              resolve(dataUrl);
            };
            img.onerror = () => {
              URL.revokeObjectURL(url);
              // If it's a PDF or unrecognized, fallback to standard FileReader
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(new Error('Failed to read file'));
              reader.readAsDataURL(file);
            };
            img.src = url;
          });
        };

        const base64String = await compressImage(attachmentFile);
        
        const uploadData = await uploadAttachmentBase64({
          name: attachmentFile.name.replace(/\.[^/.]+$/, "") + ".jpg", // Force jpg extension if compressed
          base64: base64String
        });
        if (uploadData.success) {
          finalAttachmentUrl = uploadData.url;
        } else {
          alert((lang === 'ar' ? 'فشل رفع المرفق: ' : 'Failed to upload attachment: ') + uploadData.error);
          setIsSubmitting(false);
          return;
        }
      }

      await onSave({
        orderId: invoiceToEdit?.orderId,
        supplierId: selectedSupplierId,
        warehouseId: selectedWarehouseId,
        isTaxInclusive,
        date: invoiceDate,
        currency,
        exchangeRate,
        items,
        discount,
        customFields: customFieldValues,
        dimensionValues: dimensionValues,
        notes,
        attachmentUrl: finalAttachmentUrl,
        ...totals,
        status: paymentType === 'paid' ? 'Paid' : 'Partially Paid',
        paymentType,
        paymentAccountId: paymentType === 'paid' ? paymentAccountId : null,
      });
      onClose();
    } catch (error: any) {
      console.error(error);
      alert((lang === 'ar' ? 'خطأ في حفظ الفاتورة: ' : 'Error saving purchase: ') + (error?.message || error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAccountTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      Asset: lang === 'ar' ? 'أصول' : 'Asset',
      Liability: lang === 'ar' ? 'التزامات' : 'Liability',
    };
    return map[type] || type;
  };

  return (
    <div className="modal-overlay">
      <div className="purchase-modal">
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="modal-icon" style={{ background: '#d1fae5', color: '#059669', fontSize: '1.5rem', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📥</div>
            <div>
              <h2 className="modal-title">
                {invoiceToEdit 
                  ? (lang === 'ar' ? `تعديل الفاتورة #${invoiceToEdit.invoiceNumber}` : `Edit Purchase #${invoiceToEdit.invoiceNumber}`)
                  : (lang === 'ar' ? 'فاتورة مشتريات جديدة' : 'New Purchase Invoice')}
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                {invoiceToEdit
                  ? (lang === 'ar' ? 'تعديل بيانات الفاتورة المحددة' : 'Modify the selected invoice data')
                  : (lang === 'ar' ? 'تسجيل توريد بضاعة وتكاليف المشتريات' : 'Record goods receipt and procurement costs')}
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Supplier + Warehouse */}
          <div className="form-grid-2">
            <div className="form-group">
              <label>{lang === 'ar' ? 'المورد' : 'Supplier'} <span className="required">*</span></label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select value={selectedSupplierId} onChange={e => setSelectedSupplierId(e.target.value)} required style={{ flex: 1 }}>
                  <option value="">{lang === 'ar' ? '--- اختر مورداً ---' : '--- Select Supplier ---'}</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.code} — {lang === 'ar' && s.nameAr ? s.nameAr : s.name}</option>
                  ))}
                </select>
                <button 
                  type="button" 
                  className="btn-quick-add" 
                  onClick={() => setShowQuickAdd(true)}
                  title={lang === 'ar' ? 'إضافة مورد سريع' : 'Quick Add Supplier'}
                >
                  +
                </button>
              </div>
              {selectedSupplier && (
                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#059669', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  <span>{lang === 'ar' ? 'الرصيد الدائن الحالي (المستحق):' : 'Current Payable Balance:'}</span>
                  <span style={{ color: selectedSupplier.balance > 0 ? '#dc2626' : '#059669' }}>
                    {(selectedSupplier?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'المستودع (وجهة التوريد)' : 'Warehouse (Destination)'} <span className="required">*</span></label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select value={selectedWarehouseId} onChange={e => setSelectedWarehouseId(e.target.value)} required style={{ flex: 1 }}>
                  <option value="">{lang === 'ar' ? '--- اختر المستودع ---' : '--- Select Warehouse ---'}</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.code} — {lang === 'ar' && w.nameAr ? w.nameAr : w.name}</option>
                  ))}
                </select>
                <button 
                  type="button" 
                  className="btn-quick-add" 
                  onClick={() => setShowQuickAddWarehouse(true)}
                  title={lang === 'ar' ? 'إضافة مستودع سريع' : 'Quick Add Warehouse'}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="form-grid-2" style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>{lang === 'ar' ? 'تاريخ الفاتورة' : 'Purchase Date'} <span className="required">*</span></label>
              <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'العملة' : 'Currency'}</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  value={currency} 
                  onChange={e => {
                    const selectedCurr = currencies?.find(c => c.code === e.target.value);
                    setCurrency(e.target.value);
                    if (selectedCurr) setExchangeRate(selectedCurr.exchangeRate);
                  }}
                  required
                >
                  {currencies?.map(c => (
                    <option key={c.id} value={c.code}>
                      {c.code} - {lang === 'ar' && c.nameAr ? c.nameAr : c.name}
                    </option>
                  )) || <option value="SAR">SAR - Saudi Riyal</option>}
                </select>
              </div>
            </div>

            {exchangeRate !== 1 && (
              <div className="form-group">
                <label>{lang === 'ar' ? 'سعر الصرف (مقابل العملة الأساسية)' : 'Exchange Rate'}</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={exchangeRate} 
                  onChange={e => setExchangeRate(parseFloat(e.target.value) || 1)} 
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>{lang === 'ar' ? 'نسبة الضريبة' : 'Tax Rate'}</label>
              <select
                value={selectedTaxRate}
                onChange={(e) => setSelectedTaxRate(parseFloat(e.target.value))}
              >
                {taxRates.map((tr: any) => (
                  <option key={tr.id} value={tr.rate}>
                    {lang === 'ar' && tr.nameAr ? tr.nameAr : tr.name} ({tr.rate < 1 && tr.rate > 0 ? tr.rate * 100 : tr.rate}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.8rem' }}>
              <input 
                type="checkbox" 
                id="isTaxInclusive" 
                checked={isTaxInclusive} 
                onChange={e => setIsTaxInclusive(e.target.checked)}
                style={{ width: 'auto', cursor: 'pointer' }}
              />
              <label htmlFor="isTaxInclusive" style={{ margin: '0 0 0 0.5rem', cursor: 'pointer', fontWeight: 700, color: '#2563eb' }}>
                {lang === 'ar' ? 'الأسعار شاملة الضريبة' : 'Prices include tax'}
              </label>
            </div>
          </div>

          {/* Dynamic Settings: Custom Fields & Dimensions */}
          {(customFieldsConfig.length > 0 || dimensionsConfig.length > 0) && (
            <div className="dynamic-settings-section" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
                {lang === 'ar' ? 'معلومات إضافية وأبعاد تحليلية' : 'Additional Info & Dimensions'}
              </h3>
              <div className="invoice-form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: 0 }}>
                {/* Dimensions */}
                {dimensionsConfig.length > 0 && (
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#475569', fontWeight: 600 }}>
                      {lang === 'ar' ? 'الأبعاد التحليلية (مراكز التكلفة) للفاتورة (مراكز التكلفة)' : 'Invoice Dimensions'}
                    </label>
                    <DimensionSelector
                      companyId={""}
                      lang={lang}
                      value={dimensionValues}
                      onChange={setDimensionValues}
                      inline={true}
                    />
                  </div>
                )}
                
                {/* Custom Fields */}
                {customFieldsConfig.filter(f => f.isActive).map(field => {
                  const val = customFieldValues[field.name] || '';
                  return (
                    <div className="form-group" key={field.id}>
                      <label>
                        {lang === 'ar' ? (field.labelAr || field.label) : field.label}
                        {field.isRequired && <span style={{color: '#dc2626'}}> *</span>}
                      </label>
                      {field.type === 'Select' ? (
                        <select 
                          value={val} 
                          onChange={e => setCustomFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                          required={field.isRequired}
                        >
                          <option value="">{lang === 'ar' ? '--- اختر ---' : '--- Select ---'}</option>
                          {Array.isArray(field.options) && field.options.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'Checkbox' ? (
                        <div style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
                          <input 
                            type="checkbox" 
                            checked={!!val}
                            onChange={e => setCustomFieldValues(prev => ({ ...prev, [field.name]: e.target.checked }))}
                            style={{ width: 'auto', cursor: 'pointer' }}
                          />
                        </div>
                      ) : (
                        <input 
                          type={field.type === 'Number' ? 'number' : field.type === 'Date' ? 'date' : 'text'}
                          value={val}
                          onChange={e => setCustomFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                          required={field.isRequired}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Row 2: Payment Type */}
          <div className="payment-section">
            <div className="payment-section-header">
              <span>{lang === 'ar' ? '💳 طريقة السداد' : '💳 Payment Method'}</span>
            </div>

            <div className="payment-type-tabs">
              <button
                type="button"
                className={`payment-tab ${paymentType === 'credit' ? 'active credit' : ''}`}
                onClick={() => setPaymentType('credit')}
              >
                <span>📋</span>
                {lang === 'ar' ? 'آجل (ذمة مورد)' : 'On Credit (Payable)'}
              </button>
              <button
                type="button"
                className={`payment-tab ${paymentType === 'paid' ? 'active paid' : ''}`}
                onClick={() => setPaymentType('paid')}
              >
                <span>💵</span>
                {lang === 'ar' ? 'دفع فوري' : 'Immediate Payment'}
              </button>
            </div>

            {paymentType === 'credit' && (
              <div className="credit-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                {lang === 'ar'
                  ? (selectedSupplier
                      ? `سيتم تسجيل المبلغ كالتزام دائن (آجل) للمورد: ${selectedSupplier.nameAr || selectedSupplier.name}`
                      : 'يرجى اختيار المورد من القائمة أعلاه لتسجيل الالتزام الدائن له.')
                  : (selectedSupplier
                      ? `The amount will be posted to Accounts Payable for: ${selectedSupplier.name}`
                      : 'Please select a supplier above to post the payable.')}
              </div>
            )}

            {paymentType === 'paid' && (
              <div className="account-selector-wrapper">
                <label className="account-label">
                  {lang === 'ar' ? 'حساب الدفع' : 'Payment Account'} <span className="required">*</span>
                </label>

                {/* Searchable Account Dropdown */}
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
                        {lang === 'ar' ? '--- ابحث واختر حساب الدفع ---' : '--- Search and select payment account ---'}
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
                              className={`account-option ${paymentAccountId === acc.id ? 'selected' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPaymentAccountId(acc.id);
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

          {/* Items Section */}
          <div className="items-section">
            <div className="items-header">
              <span>{lang === 'ar' ? '📦 الأصناف المشتراة' : '📦 Purchased Items'}</span>
              <button type="button" className="btn-add-item" onClick={addItem}>
                {lang === 'ar' ? '+ إضافة صنف' : '+ Add Item'}
              </button>
            </div>

            <div className="items-table-wrapper">
              <table className="form-table">
                <thead>
                  <tr>
                    <th style={{ width: '38%' }}>{lang === 'ar' ? 'الصنف' : 'Product'}</th>
                    <th style={{ width: '18%' }}>{lang === 'ar' ? 'الوحدة' : 'Unit'}</th>
                    <th>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                    <th>{lang === 'ar' ? 'التكلفة' : 'Cost'}</th>
                    <th style={{ width: '15%' }}>{lang === 'ar' ? 'مركز التكلفة' : 'Cost Center'}</th>
                    <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <SearchableSelect
                          options={products}
                          value={item.productId}
                          onChange={(value) => updateItem(index, 'productId', value)}
                          lang={lang}
                          placeholder={lang === 'ar' ? 'اختر صنفاً...' : 'Select item...'}
                        />
                        {item.productId && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
                            {lang === 'ar' ? 'المخزون الحالي: ' : 'Current Stock: '}
                            <span style={{ 
                              color: (products.find(p => p.id === item.productId)?.stockQuantity || 0) <= (products.find(p => p.id === item.productId)?.reorderPoint || 0) ? '#ef4444' : '#059669',
                              background: (products.find(p => p.id === item.productId)?.stockQuantity || 0) <= (products.find(p => p.id === item.productId)?.reorderPoint || 0) ? '#fee2e2' : '#dcfce7',
                              padding: '1px 4px',
                              borderRadius: '4px'
                            }}>
                              {products.find(p => p.id === item.productId)?.stockQuantity || 0}
                            </span>
                          </div>
                        )}
                      </td>
                      <td>
                        <select value={item.unitId || ''} onChange={e => updateItem(index, 'unitId', e.target.value)} required>
                          <option value="">—</option>
                          {(inventoryUnits || []).map((u: any) => (
                            <option key={u.id} value={u.id}>{lang === 'ar' ? u.nameAr : u.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input type="number" min="0.01" step="any" value={item.quantity} onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)} />
                      </td>
                      <td>
                        <input type="number" step="0.01" min="0" value={item.unitPrice} onChange={e => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)} />
                      </td>
                      <td>
                        <DimensionSelector
                          companyId={""}
                          lang={lang}
                          value={item.dimensionValues || []}
                          onChange={(vals) => updateItem(index, 'dimensionValues', vals)}
                          inline={true}
                        />
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}</td>
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

          {/* Footer: Notes + Totals */}
          <div className="invoice-footer">
            <div className="extra-notes">
              <label>{lang === 'ar' ? 'ملاحظات' : 'Notes'}</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={lang === 'ar' ? 'أي ملاحظات خاصة بالأمر...' : 'Any special notes...'}
              />
              
              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.4rem' }}>
                  {lang === 'ar' ? 'إرفاق صورة الفاتورة' : 'Attach Invoice Image'}
                </label>
                
                {!attachmentFile && !attachmentUrl ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      type="button" 
                      onClick={() => cameraInputRef.current?.click()}
                      style={{ flex: 1, padding: '0.75rem', background: '#eff6ff', color: '#2563eb', border: '1.5px dashed #93c5fd', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                    >
                      📷 {lang === 'ar' ? 'تصوير الفاتورة' : 'Camera'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      style={{ flex: 1, padding: '0.75rem', background: '#f8fafc', color: '#475569', border: '1.5px dashed #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                    >
                      📁 {lang === 'ar' ? 'استوديو / ملفات' : 'Gallery / Files'}
                    </button>
                    <input 
                      type="file" 
                      accept="image/*"
                      capture="environment"
                      ref={cameraInputRef}
                      onChange={e => setAttachmentFile(e.target.files?.[0] || null)}
                      style={{ display: 'none' }}
                    />
                    <input 
                      type="file" 
                      accept="image/*,application/pdf"
                      ref={fileInputRef}
                      onChange={e => setAttachmentFile(e.target.files?.[0] || null)}
                      style={{ display: 'none' }}
                    />
                  </div>
                ) : (
                  <div style={{ padding: '0.75rem', background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                      <span style={{ fontSize: '1.25rem' }}>✅</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#065f46', fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '180px' }}>
                          {attachmentFile ? attachmentFile.name : (lang === 'ar' ? 'يوجد مرفق محفوظ' : 'Attachment saved')}
                        </span>
                        {attachmentUrl && !attachmentFile && (
                          <a href={attachmentUrl} target="_blank" rel="noreferrer" style={{ color: '#059669', fontSize: '0.75rem', textDecoration: 'underline' }}>
                            {lang === 'ar' ? 'عرض المرفق' : 'View attachment'}
                          </a>
                        )}
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { setAttachmentFile(null); setAttachmentUrl(''); if (cameraInputRef.current) cameraInputRef.current.value = ''; if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      style={{ color: '#ef4444', background: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, padding: '0.4rem 0.75rem' }}
                    >
                      {lang === 'ar' ? 'إزالة' : 'Remove'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="totals-summary">
              <div className="total-row">
                <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              {discount > 0 && (
                <div className="total-row" style={{ color: '#dc2626' }}>
                  <span>{lang === 'ar' ? 'الخصم' : 'Discount'}</span>
                  <span>−{discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="total-row">
                <span>{lang === 'ar' ? `ضريبة القيمة المضافة ${selectedTaxRate < 1 && selectedTaxRate > 0 ? selectedTaxRate * 100 : selectedTaxRate}%` : `VAT ${selectedTaxRate < 1 && selectedTaxRate > 0 ? selectedTaxRate * 100 : selectedTaxRate}%`}</span>
                <span>{totals.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="total-row net-total" style={{ color: '#047857' }}>
                <span>{lang === 'ar' ? 'الإجمالي الصافي' : 'Net Total'}</span>
                <div style={{ textAlign: 'right' }}>
                  <div>{totals.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}</div>
                  {exchangeRate !== 1 && (
                    <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal', marginTop: '4px' }}>
                      {lang === 'ar' ? 'يعادل' : 'Equals'} {(totals.netAmount * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2 })} {currencies?.find(c=>c.isDefault)?.code || 'SAR'}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className={`payment-summary ${paymentType}`}>
                {paymentType === 'credit' ? (
                  <>
                    <span>📋 {lang === 'ar' ? 'سيُضاف لذمم المورد' : 'Added to Supplier Payable'}</span>
                    <span style={{ fontWeight: 700 }}>{totals.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}</span>
                  </>
                ) : (
                  <>
                    <span>💵 {lang === 'ar' ? 'سيُخصم من' : 'Paid from'}: {selectedAccount ? `${selectedAccount.code} — ${lang === 'ar' && selectedAccount.nameAr ? selectedAccount.nameAr : selectedAccount.name}` : '—'}</span>
                    <span style={{ fontWeight: 700 }}>{totals.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" className="btn-primary purchase-submit" disabled={isSubmitting}>
              {isSubmitting
                ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                : invoiceToEdit
                  ? (lang === 'ar' ? 'حفظ التعديلات 💾' : 'Save Changes 💾')
                  : (lang === 'ar' ? '📦 حفظ وترحيل' : '📦 Save & Post')}
            </button>
          </div>
        </form>

        {showQuickAdd && (
          <CreateSupplierModal
            lang={lang}
            onClose={() => setShowQuickAdd(false)}
            onSave={handleQuickAdd}
          />
        )}

        {showQuickAddWarehouse && (
          <CreateWarehouseModal
            lang={lang}
            onClose={() => setShowQuickAddWarehouse(false)}
            onSave={handleQuickAddWarehouse}
          />
        )}
      </div>

      {/* Click-outside backdrop for dropdown */}
      <style jsx>{`
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .purchase-modal { max-width: 940px; max-height: 92vh; overflow-y: auto; background: #fff; border-radius: 1.5rem; padding: 2.5rem; width: 100%; box-shadow: 0 30px 60px -12px rgba(0,0,0,0.3); }
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        .modal-title { margin: 0 0 0.2rem; font-size: 1.3rem; color: #0f172a; font-weight: 800; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.4rem; font-weight: 600; color: #374151; font-size: 0.875rem; }
        .required { color: #dc2626; }
        input, select, textarea { width: 100%; padding: 0.625rem 0.875rem; border: 1.5px solid #e2e8f0; border-radius: 8px; outline: none; font-size: 0.875rem; transition: border-color 0.2s; box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: #059669; }

        /* Payment Section */
        .payment-section { background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.5rem; margin-bottom: 1.75rem; }
        .payment-section-header { font-weight: 700; color: #1e293b; margin-bottom: 1rem; font-size: 0.95rem; }
        .payment-type-tabs { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
        .payment-tab { flex: 1; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 10px; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 600; font-size: 0.875rem; color: #64748b; transition: all 0.2s; }
        .payment-tab:hover { border-color: #94a3b8; color: #1e293b; }
        .payment-tab.active.credit { border-color: #6366f1; background: #eff6ff; color: #4338ca; }
        .payment-tab.active.paid { border-color: #059669; background: #ecfdf5; color: #047857; }
        .credit-info { display: flex; align-items: flex-start; gap: 0.5rem; background: #eff6ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 0.75rem 1rem; color: #4338ca; font-size: 0.85rem; line-height: 1.5; }

        /* Account Selector */
        .account-selector-wrapper { position: relative; }
        .account-label { display: block; font-weight: 600; font-size: 0.875rem; color: #374151; margin-bottom: 0.4rem; }
        .account-search-container { position: relative; z-index: 100; }
        .account-trigger { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.625rem 0.875rem; border: 1.5px solid #e2e8f0; border-radius: 8px; cursor: pointer; background: white; min-height: 44px; }
        .account-trigger:hover { border-color: #059669; }
        .selected-account { display: flex; align-items: center; gap: 0.5rem; flex: 1; }
        .acc-code-badge { background: #dcfce7; color: #166534; padding: 0.15rem 0.5rem; border-radius: 5px; font-weight: 700; font-size: 0.8rem; font-family: monospace; white-space: nowrap; }
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
        .account-option.selected { background: #ecfdf5; }
        .no-accounts { padding: 1.5rem; text-align: center; color: #94a3b8; font-size: 0.875rem; }
        .dropdown-backdrop { position: fixed; inset: 0; z-index: 99; }

        .btn-quick-add {
          background: #059669;
          color: white;
          border: none;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .btn-quick-add:hover { background: #047857; }

        .sub-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
        }
        .sub-modal-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .sub-modal-content h3 { margin-bottom: 1.5rem; color: #1e293b; }
        .sub-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .sub-modal-actions button {
          padding: 0.5rem 1.25rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        /* Items */
        .items-section { padding: 1.5rem; border-radius: 12px; margin-bottom: 1.75rem; border: 1.5px solid #a7f3d0; background: #f0fdf4; }
        .items-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; font-weight: 700; color: #065f46; }
        .btn-add-item { background: #059669; color: white; border: none; padding: 0.4rem 1rem; border-radius: 7px; cursor: pointer; font-size: 0.875rem; font-weight: 600; }
        .form-table { width: 100%; border-collapse: collapse; }
        .form-table th { text-align: left; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; padding: 0 0 0.75rem; font-weight: 600; }
        .form-table td { padding: 0.35rem 0.4rem 0.35rem 0; }
        .btn-remove { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; width: 26px; height: 26px; border-radius: 50%; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; }
        
        /* Footer */
        .invoice-footer { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; margin-bottom: 1.75rem; }
        .extra-notes label { display: block; font-weight: 600; font-size: 0.875rem; color: #374151; margin-bottom: 0.4rem; }
        .extra-notes textarea { height: 100px; resize: none; }
        .totals-summary { }
        .total-row { display: flex; justify-content: space-between; padding: 0.45rem 0; color: #64748b; font-size: 0.875rem; border-bottom: 1px solid #f1f5f9; }
        .net-total { border-top: 2px solid #e2e8f0; border-bottom: none; margin-top: 0.5rem; padding-top: 0.75rem; font-size: 1.1rem; font-weight: 900; color: #047857; }
        .payment-summary { display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; padding: 0.6rem 0.875rem; border-radius: 8px; font-size: 0.8rem; }
        .payment-summary.credit { background: #eff6ff; color: #4338ca; }
        .payment-summary.paid { background: #ecfdf5; color: #047857; }

        /* Actions */
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1rem; border-top: 1px solid #f1f5f9; }
        .purchase-submit { background: #059669; color: white; border: none; padding: 0.75rem 2rem; border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
        .purchase-submit:hover:not(:disabled) { background: #047857; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(5,150,105,0.35); }
        .purchase-submit:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

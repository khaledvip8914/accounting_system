'use client';

import { useState, useMemo, useEffect } from 'react';
import { createCustomer, updateCustomer, createProduct } from './actions';
import CreateCustomerModal from '@/components/CreateCustomerModal';
import CreateProductModal from '@/components/CreateProductModal';
import SearchableSelect from '@/components/SearchableSelect';
import DimensionSelector from '@/components/DimensionSelector';

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
  dimensionValues?: any[];
};

type Account = { id: string; code: string; name: string; nameAr: string | null; type: string };

type Currency = {
  id: string;
  code: string;
  name: string;
  nameAr: string | null;
  exchangeRate: number;
  isDefault: boolean;
};

type PaymentMethod = {
  id: string;
  name: string;
  nameAr: string | null;
  code: string | null;
  type: string;
  accountId: string | null;
  isActive: boolean;
  isDefault: boolean;
  account?: Account | null;
};

export default function CreateInvoiceModal({
  invoiceToEdit,
  customers,
  products,
  accounts,
  onClose,
  lang,
  onSave,
  warehouses,
  currencies,
  paymentMethods: initialPaymentMethods,
  branches = []
}: {
  branches?: any[];
  invoiceToEdit?: any;
  customers: Customer[];
  products: Product[];
  accounts: Account[];
  currencies?: Currency[];
  onClose: () => void;
  lang: string;
  onSave: (data: any) => Promise<void>;
  warehouses: Warehouse[];
  paymentMethods?: PaymentMethod[];
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(invoiceToEdit?.customerId || '');
  const [selectedBranchId, setSelectedBranchId] = useState(invoiceToEdit?.branchId || (branches.length === 1 ? branches[0].id : ''));
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(invoiceToEdit?.warehouseId || '');
  const [invoiceDate, setInvoiceDate] = useState(
    invoiceToEdit ? new Date(invoiceToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [isTaxInclusive, setIsTaxInclusive] = useState(invoiceToEdit?.isTaxInclusive || false);

  const defaultCurrency = currencies?.find(c => c.isDefault)?.code || 'SAR';
  const defaultExchangeRate = currencies?.find(c => c.isDefault)?.exchangeRate || 1.0;

  const [currency, setCurrency] = useState(invoiceToEdit?.currency || defaultCurrency);
  const [exchangeRate, setExchangeRate] = useState<number>(invoiceToEdit?.exchangeRate || defaultExchangeRate);

  const [items, setItems] = useState<InvoiceItem[]>(
    invoiceToEdit && invoiceToEdit.items
      ? invoiceToEdit.items.map((i: any) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          total: i.total
        }))
      : [{ productId: '', quantity: 1, unitPrice: 0, total: 0 }]
  );

  const [discount, setDiscount] = useState(invoiceToEdit?.discount || 0);
  const [notes, setNotes] = useState(invoiceToEdit?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment Methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods || []);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(invoiceToEdit?.paymentMethodId || '');

  // Custom Fields & Dimensions
  const [customFieldsConfig, setCustomFieldsConfig] = useState<any[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>(
    invoiceToEdit?.customFields
      ? typeof invoiceToEdit.customFields === 'string'
        ? JSON.parse(invoiceToEdit.customFields)
        : invoiceToEdit.customFields
      : {}
  );
  const [dimensionsConfig, setDimensionsConfig] = useState<any[]>([]);
  const [dimensionValues, setDimensionValues] = useState<any[]>(
    invoiceToEdit?.dimensionValues
      ? typeof invoiceToEdit.dimensionValues === 'string'
        ? JSON.parse(invoiceToEdit.dimensionValues)
        : invoiceToEdit.dimensionValues
      : []
  );
  const [taxRates, setTaxRates] = useState<any[]>([]);
  const [selectedTaxRate, setSelectedTaxRate] = useState<number>(0.15);
  const [paymentType, setPaymentType] = useState<'paid' | 'credit'>(
    invoiceToEdit?.status === 'Paid' ? 'paid' : 'credit'
  );
  const [receiptAccountId, setReceiptAccountId] = useState('');
  const [accountSearch, setAccountSearch] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showQuickAddProduct, setShowQuickAddProduct] = useState(false);
  const [activeItemIndexForQuickAdd, setActiveItemIndexForQuickAdd] = useState<number | null>(null);

  const [localProducts, setLocalProducts] = useState<Product[]>(products);

  useEffect(() => {
    fetch('/api/taxes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTaxRates(data);
          const defaultTax = data.find(t => t.isDefault);
          if (defaultTax) {
            setSelectedTaxRate(defaultTax.rate);
          } else if (data.length > 0) {
            setSelectedTaxRate(data[0].rate);
          }
        }
      })
      .catch(err => console.error('Failed to fetch taxes:', err));

    // Fetch Custom Fields
    fetch('/api/v1/settings/custom-fields?module=SalesInvoice')
      .then(res => res.json())
      .then(data => Array.isArray(data) && setCustomFieldsConfig(data))
      .catch(err => console.error('Failed to fetch custom fields:', err));

    // Fetch Dimensions
    fetch('/api/v1/settings/dimensions')
      .then(res => res.json())
      .then(data => Array.isArray(data) && setDimensionsConfig(data))
      .catch(err => console.error('Failed to fetch dimensions:', err));

    // Fallback fetch payment methods if not passed
    if (!initialPaymentMethods || initialPaymentMethods.length === 0) {
      fetch('/api/payment-methods')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPaymentMethods(data);
          }
        })
        .catch(err => console.error('Failed to fetch payment methods:', err));
    }
  }, [initialPaymentMethods]);

  // Sync selected payment method and receipt account
  useEffect(() => {
    if (paymentMethods.length > 0) {
      if (!selectedPaymentMethodId) {
        const defaultMethod = paymentMethods.find(m => m.isDefault) || paymentMethods[0];
        if (defaultMethod) {
          setSelectedPaymentMethodId(defaultMethod.id);
          if (defaultMethod.accountId) {
            setReceiptAccountId(defaultMethod.accountId);
          }
        }
      } else {
        const curr = paymentMethods.find(m => m.id === selectedPaymentMethodId);
        if (curr?.accountId && !receiptAccountId) {
          setReceiptAccountId(curr.accountId);
        }
      }
    }
  }, [paymentMethods, selectedPaymentMethodId, receiptAccountId]);

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethodId(method.id);
    if (method.accountId) {
      setReceiptAccountId(method.accountId);
    }
  };

  const filteredAccounts = useMemo(() => {
    const q = accountSearch.toLowerCase();
    return (
      (accounts || [])
        .filter(
          a =>
            (a?.code || '').toLowerCase().includes(q) ||
            (a?.name || '').toLowerCase().includes(q) ||
            (a?.nameAr && a.nameAr.toLowerCase().includes(q))
        )
        .slice(0, 50) || []
    );
  }, [accounts, accountSearch]);

  const selectedAccount = accounts?.find(a => a.id === receiptAccountId);

  const getAccountTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      Asset: lang === 'ar' ? 'أصول' : 'Asset',
      Liability: lang === 'ar' ? 'التزامات' : 'Liability'
    };
    return map[type] || type;
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, unitPrice: 0, total: 0, dimensionValues: [] }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };

    if (field === 'productId') {
      const product = localProducts.find(p => p.id === value);
      if (product) {
        item.unitPrice = product.salePrice;
      }
    }

    item.total = (item.quantity || 0) * (item.unitPrice || 0);
    newItems[index] = item;
    setItems(newItems);
  };

  const totals = useMemo(() => {
    const rawSubtotal = items.reduce((sum, item) => sum + item.total, 0);
    const rawTaxRate = selectedTaxRate;
    const taxRate = rawTaxRate > 1 ? rawTaxRate / 100 : rawTaxRate;

    if (isTaxInclusive) {
      const netAmount = Math.max(0, rawSubtotal - discount);
      const subtotal = netAmount / (1 + taxRate);
      const taxAmount = netAmount - subtotal;
      return { subtotal, taxAmount, netAmount };
    } else {
      const subtotal = rawSubtotal;
      const taxAmount = Math.max(0, subtotal - discount) * taxRate;
      const netAmount = Math.max(0, subtotal - discount) + taxAmount;
      return { subtotal, taxAmount, netAmount };
    }
  }, [items, discount, isTaxInclusive, selectedTaxRate]);

  const handleQuickAdd = async (data: any) => {
    return createCustomer(data);
  };

  const handleQuickAddProduct = async (data: any) => {
    return createProduct(data);
  };

  const needsWarehouse = items.some(item => {
    const p = products.find(prod => prod.id === item.productId);
    return p && p.classification !== 'Service';
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (!selectedCustomerId || items.some(i => !i.productId) || (needsWarehouse && !selectedWarehouseId) || (!selectedBranchId && branches.length > 0)) {
      alert(lang === 'ar' ? 'الرجاء تعبئة جميع الحقول الإلجباري واختيار المستودع والفرع (للمنتجات)' : 'Please fill all required fields and select warehouse/branch (for products)');
      return;
    }
    if (paymentType === 'paid' && !receiptAccountId) {
      alert(lang === 'ar' ? 'يرجى تحديد حساب القبض أو طريقة الدفع' : 'Please select a receipt account or payment method');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        branchId: selectedBranchId,
        customerId: selectedCustomerId,
        warehouseId: selectedWarehouseId,
        date: invoiceDate,
        isTaxInclusive,
        currency,
        exchangeRate,
        items,
        discount,
        notes: notes.trim(),
        paymentMethodId: paymentType === 'paid' ? selectedPaymentMethodId || null : null,
        customFields: customFieldValues,
        dimensionValues: dimensionValues,
        ...totals,
        status: paymentType === 'paid' ? 'Paid' : 'Partially Paid',
        paymentType,
        receiptAccountId: paymentType === 'paid' ? receiptAccountId : null
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert(lang === 'ar' ? 'حدث خطأ أثناء حفظ الفاتورة' : 'Error saving invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'Cash':
        return '💵';
      case 'Card':
        return '💳';
      case 'Bank':
        return '🏦';
      default:
        return '🌐';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="invoice-modal-pro">
        {/* Luxury Header */}
        <div className="invoice-pro-header">
          <div className="header-left">
            <div className="invoice-badge-icon">🧾</div>
            <div>
              <div className="header-title-row">
                <h2 className="header-title">
                  {invoiceToEdit
                    ? lang === 'ar'
                      ? `تعديل الفاتورة #${invoiceToEdit.invoiceNumber}`
                      : `Edit Invoice #${invoiceToEdit.invoiceNumber}`
                    : lang === 'ar'
                    ? 'فاتورة مبيعات جديدة'
                    : 'New Sales Invoice'}
                </h2>
                <span className="executive-badge">
                  {invoiceToEdit ? (lang === 'ar' ? 'تعديل مسودة' : 'Edit Draft') : lang === 'ar' ? 'معتمدة محاسبياً' : 'Official Entry'}
                </span>
              </div>
              <p className="header-subtitle">
                {lang === 'ar'
                  ? 'إصدار وتوثيق فاتورة ضريبية رسمية مرتبطة آلياً بالمخازن والقيود المحاسبية وطرق السداد'
                  : 'Official tax invoice entry with automated inventory, ledger posting & payment methods'}
              </p>
            </div>
          </div>
          <button className="pro-close-btn" onClick={onClose} title={lang === 'ar' ? 'إغلاق' : 'Close'}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="invoice-pro-form">
          <div className="invoice-pro-body">
            {/* 1. Master Info Section */}
            <div className="pro-card">
              <div className="pro-card-header">
                <span className="pro-card-title">
                  👤 {lang === 'ar' ? 'البيانات الأساسية للفاتورة' : 'Master Invoice Details'}
                </span>
                <span className="pro-card-pill">
                  {invoiceDate}
                </span>
              </div>

              <div className="pro-grid-3">
                {/* Customer */}
                <div className="pro-form-group">
                  <label>
                    {lang === 'ar' ? 'العميل' : 'Customer'} <span className="req">*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select
                      value={selectedCustomerId}
                      onChange={e => setSelectedCustomerId(e.target.value)}
                      required
                      style={{ flex: 1 }}
                    >
                      <option value="">{lang === 'ar' ? '--- اختر عميلاً ---' : '--- Select Customer ---'}</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.code} - {lang === 'ar' && c.nameAr ? c.nameAr : c.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn-pro-add"
                      onClick={() => setShowQuickAdd(true)}
                      title={lang === 'ar' ? 'إضافة عميل سريع' : 'Quick Add Customer'}
                    >
                      +
                    </button>
                  </div>
                  {selectedCustomer && (
                    <div className="customer-balance-chip">
                      <span>{lang === 'ar' ? 'الرصيد المديوني:' : 'Balance:'}</span>
                      <strong style={{ color: selectedCustomer.balance > 0 ? '#dc2626' : '#059669' }}>
                        {selectedCustomer.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR
                      </strong>
                    </div>
                  )}
                </div>

                {/* Branch */}
                {branches.length > 1 && (
                  <div className="pro-form-group">
                    <label>
                      {lang === 'ar' ? 'الفرع' : 'Branch'} <span className="req">*</span>
                    </label>
                    <select
                      value={selectedBranchId}
                      onChange={e => setSelectedBranchId(e.target.value)}
                      required
                    >
                      <option value="">{lang === 'ar' ? '--- اختر الفرع ---' : '--- Select Branch ---'}</option>
                      {branches.map((b: any) => (
                        <option key={b.id} value={b.id}>
                          {lang === 'ar' && b.nameAr ? b.nameAr : b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Warehouse */}
                <div className="pro-form-group">
                  <label>
                    {lang === 'ar' ? 'مستودع الصرف' : 'Issuing Warehouse'} {needsWarehouse && <span className="req">*</span>}
                  </label>
                  <select
                    value={selectedWarehouseId}
                    onChange={e => setSelectedWarehouseId(e.target.value)}
                    required={needsWarehouse}
                  >
                    <option value="">{lang === 'ar' ? '--- اختر مستودعاً ---' : '--- Select Warehouse ---'}</option>
                    {warehouses.filter((w: any) => !selectedBranchId || w.branchId === selectedBranchId || !w.branchId).map((w: any) => (
                      <option key={w.id} value={w.id}>
                        {w.code} - {lang === 'ar' && w.nameAr ? w.nameAr : w.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="pro-form-group">
                  <label>
                    {lang === 'ar' ? 'تاريخ الفاتورة' : 'Invoice Date'} <span className="req">*</span>
                  </label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={e => setInvoiceDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pro-grid-3" style={{ marginTop: '1.5rem' }}>
                {/* Currency */}
                <div className="pro-form-group">
                  <label>{lang === 'ar' ? 'العملة' : 'Currency'}</label>
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

                {/* Tax Rate */}
                <div className="pro-form-group">
                  <label>{lang === 'ar' ? 'نسبة الضريبة' : 'VAT Rate'}</label>
                  <select
                    value={selectedTaxRate}
                    onChange={e => setSelectedTaxRate(parseFloat(e.target.value))}
                  >
                    {taxRates.map((tr: any) => (
                      <option key={tr.id} value={tr.rate}>
                        {lang === 'ar' && tr.nameAr ? tr.nameAr : tr.name} ({tr.rate < 1 && tr.rate > 0 ? tr.rate * 100 : tr.rate}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tax Inclusive Toggle */}
                <div className="pro-form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <label
                    htmlFor="isTaxInclusive"
                    className={`tax-inclusive-pill ${isTaxInclusive ? 'active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      id="isTaxInclusive"
                      checked={isTaxInclusive}
                      onChange={e => setIsTaxInclusive(e.target.checked)}
                    />
                    <span>{isTaxInclusive ? '✓ ' : ''}{lang === 'ar' ? 'الأسعار شاملة الضريبة' : 'Prices include tax'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 2. Payment Methods & Accounting Link Section */}
            <div className="pro-card payment-card">
              <div className="pro-card-header">
                <span className="pro-card-title">
                  💳 {lang === 'ar' ? 'طريقة السداد والتوجيه المحاسبي' : 'Payment Method & Ledger Posting'}
                </span>
                <span className="pro-badge-soft">
                  {paymentType === 'paid' ? (lang === 'ar' ? 'سداد فوري' : 'Paid') : (lang === 'ar' ? 'آجل' : 'On Credit')}
                </span>
              </div>

              {/* Type Switcher */}
              <div className="payment-toggle-grid">
                <button
                  type="button"
                  className={`payment-toggle-btn ${paymentType === 'paid' ? 'selected' : ''}`}
                  onClick={() => setPaymentType('paid')}
                >
                  <span className="toggle-icon">💵</span>
                  <div>
                    <div className="toggle-title">{lang === 'ar' ? 'دفع فوري / نقدي' : 'Immediate Payment'}</div>
                    <div className="toggle-sub">{lang === 'ar' ? 'تسديد الفاتورة وتوريدها لحساب مالي' : 'Direct payment to cash/bank'}</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`payment-toggle-btn ${paymentType === 'credit' ? 'selected' : ''}`}
                  onClick={() => setPaymentType('credit')}
                >
                  <span className="toggle-icon">📋</span>
                  <div>
                    <div className="toggle-title">{lang === 'ar' ? 'آجل (ذمة عميل)' : 'On Credit (Receivable)'}</div>
                    <div className="toggle-sub">{lang === 'ar' ? 'تسجيل المبلغ مديونية على حساب العميل' : 'Post to customer receivable account'}</div>
                  </div>
                </button>
              </div>

              {paymentType === 'credit' ? (
                <div className="credit-callout">
                  <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
                  <div>
                    <strong>{lang === 'ar' ? 'القيد المحاسبي للذمم المدينة:' : 'Receivables Posting:'}</strong>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem' }}>
                      {selectedCustomer
                        ? lang === 'ar'
                          ? `سيتم قيد صافي الفاتورة كذمة مدينة على العميل: ${selectedCustomer.nameAr || selectedCustomer.name}`
                          : `The total amount will be debited to Accounts Receivable for: ${selectedCustomer.name}`
                        : lang === 'ar'
                        ? 'يرجى اختيار العميل لتسجيل الذمة عليه.'
                        : 'Please select a customer.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="paid-methods-container">
                  <div className="methods-label">
                    {lang === 'ar' ? 'اختر وسيلة الدفع المعتمدة:' : 'Select Payment Method:'}
                  </div>

                  {paymentMethods.length > 0 ? (
                    <div className="payment-methods-grid">
                      {paymentMethods.map(pm => {
                        const isSelected = selectedPaymentMethodId === pm.id;
                        const acc = pm.account || accounts.find(a => a.id === pm.accountId);
                        return (
                          <div
                            key={pm.id}
                            className={`pm-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSelectPaymentMethod(pm)}
                          >
                            <div className="pm-card-top">
                              <span className="pm-icon">{getMethodIcon(pm.type)}</span>
                              <span className="pm-name">
                                {lang === 'ar' ? (pm.nameAr || pm.name) : pm.name}
                              </span>
                              {isSelected && <span className="pm-check">✓</span>}
                            </div>
                            {acc && (
                              <div className="pm-account-pill">
                                <span className="acc-code">{acc.code}</span>
                                <span className="acc-name">{lang === 'ar' && acc.nameAr ? acc.nameAr : acc.name}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ padding: '0.5rem 0', color: '#64748b', fontSize: '0.85rem' }}>
                      {lang === 'ar' ? 'لم يتم العثور على وسائل دفع محددة، يمكنك اختيار الحساب أدناه:' : 'No configured payment methods found, select account below:'}
                    </div>
                  )}

                  {/* HIDDEN: Account Selector & Override
                  <div className="account-override-row">
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                      {lang === 'ar' ? 'حساب القبض / الخزينة المعتمد للقيد المحاسبي:' : 'Debit Receipt Account (General Ledger):'}{' '}
                      <span className="req">*</span>
                    </label>

                    <div className="account-search-container" onClick={() => setShowAccountDropdown(true)}>
                      <div className="account-trigger">
                        {selectedAccount ? (
                          <div className="selected-account">
                            <span className="acc-code-badge">{selectedAccount.code}</span>
                            <span className="acc-name">
                              {lang === 'ar' && selectedAccount.nameAr ? selectedAccount.nameAr : selectedAccount.name}
                            </span>
                            <span className="acc-type-badge">{getAccountTypeLabel(selectedAccount.type)}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>
                            {lang === 'ar' ? '--- ابحث واختر حساب القبض ---' : '--- Search and select receipt account ---'}
                          </span>
                        )}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>

                      {showAccountDropdown && (
                        <div className="account-dropdown">
                          <div className="account-search-input-wrap">
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
                                  onClick={e => {
                                    e.stopPropagation();
                                    setReceiptAccountId(acc.id);
                                    setAccountSearch('');
                                    setShowAccountDropdown(false);
                                  }}
                                >
                                  <span className="acc-code-badge">{acc.code}</span>
                                  <span style={{ flex: 1, color: '#1e293b' }}>
                                    {lang === 'ar' && acc.nameAr ? acc.nameAr : acc.name}
                                  </span>
                                  <span className="acc-type-badge">{getAccountTypeLabel(acc.type)}</span>
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
                  */}
                </div>
              )}
            </div>

            {/* Dynamic Dimensions & Custom Fields */}
            {(customFieldsConfig.length > 0 || dimensionsConfig.length > 0) && (
              <div className="pro-card">
                <div className="pro-card-header">
                  <span className="pro-card-title">
                    📐 {lang === 'ar' ? 'مراكز التكلفة والحقول الإضافية' : 'Dimensions & Custom Fields'}
                  </span>
                </div>
                <div className="pro-grid-3">
                  {dimensionsConfig.length > 0 && (
                    <div className="pro-form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>{lang === 'ar' ? 'الأبعاد التحليلية (مراكز التكلفة) للفاتورة' : 'Invoice Dimensions'}</label>
                      <DimensionSelector
                        companyId={''}
                        lang={lang}
                        value={dimensionValues}
                        onChange={setDimensionValues}
                        inline={true}
                      />
                    </div>
                  )}

                  {customFieldsConfig.filter(f => f.isActive).map(field => {
                    const val = customFieldValues[field.name] || '';
                    return (
                      <div className="pro-form-group" key={field.id}>
                        <label>
                          {lang === 'ar' ? field.labelAr || field.label : field.label}
                          {field.isRequired && <span className="req"> *</span>}
                        </label>
                        {field.type === 'Select' ? (
                          <select
                            value={val}
                            onChange={e => setCustomFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                            required={field.isRequired}
                          >
                            <option value="">{lang === 'ar' ? '--- اختر ---' : '--- Select ---'}</option>
                            {Array.isArray(field.options) &&
                              field.options.map((opt: string) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                          </select>
                        ) : field.type === 'Checkbox' ? (
                          <div style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
                            <input
                              type="checkbox"
                              checked={!!val}
                              onChange={e =>
                                setCustomFieldValues(prev => ({ ...prev, [field.name]: e.target.checked }))
                              }
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

            {/* 3. Items Data Grid */}
            <div className="pro-card items-card">
              <div className="pro-card-header">
                <span className="pro-card-title">
                  📦 {lang === 'ar' ? 'الأصناف والبنود' : 'Items & Products'}
                </span>
                <button type="button" className="btn-pro-action" onClick={addItem}>
                  + {lang === 'ar' ? 'إضافة صنف للفاتورة' : 'Add Item'}
                </button>
              </div>

              <div className="table-responsive">
                <table className="pro-table">
                  <thead>
                    <tr>
                      <th style={{ width: '38%' }}>{lang === 'ar' ? 'الصنف' : 'Item / Product'}</th>
                      <th style={{ width: '12%' }}>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                      <th style={{ width: '16%' }}>{lang === 'ar' ? 'سعر الوحدة' : 'Unit Price'}</th>
                      <th style={{ width: '18%' }}>{lang === 'ar' ? 'مركز التكلفة' : 'Cost Center'}</th>
                      <th style={{ width: '12%', textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                      <th style={{ width: '4%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      const prod = localProducts.find(p => p.id === item.productId);
                      const inStock = prod ? (prod.stockQuantity || 0) > 0 : false;
                      return (
                        <tr key={index}>
                          <td>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <SearchableSelect
                                  options={localProducts}
                                  value={item.productId}
                                  onChange={val => updateItem(index, 'productId', val)}
                                  lang={lang}
                                  placeholder={lang === 'ar' ? 'ابحث عن صنف...' : 'Search product...'}
                                />
                              </div>
                              <button
                                type="button"
                                className="btn-pro-add"
                                style={{ height: '38px', width: '38px' }}
                                onClick={() => {
                                  setActiveItemIndexForQuickAdd(index);
                                  setShowQuickAddProduct(true);
                                }}
                                title={lang === 'ar' ? 'إضافة صنف سريع' : 'Quick Add Product'}
                              >
                                +
                              </button>
                            </div>
                            {item.productId && (
                              <div className="stock-tag-row">
                                <span>{lang === 'ar' ? 'المخزون المتاح:' : 'Available:'}</span>
                                <span className={`stock-badge ${inStock ? 'in-stock' : 'out-stock'}`}>
                                  {prod?.stockQuantity || 0}
                                </span>
                              </div>
                            )}
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0.01"
                              step="any"
                              value={item.quantity}
                              onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={e => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              required
                            />
                          </td>
                          <td>
                            <DimensionSelector
                              companyId={''}
                              lang={lang}
                              value={item.dimensionValues || []}
                              onChange={vals => updateItem(index, 'dimensionValues', vals)}
                              inline={true}
                            />
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                            {item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{currency}</span>
                          </td>
                          <td>
                            {items.length > 1 && (
                              <button
                                type="button"
                                className="btn-pro-remove"
                                onClick={() => removeItem(index)}
                                title={lang === 'ar' ? 'حذف البند' : 'Remove item'}
                              >
                                &times;
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Notes & Financial Summary */}
            <div className="invoice-bottom-grid">
              {/* Notes Card */}
              <div className="pro-card notes-card">
                <div className="pro-card-header">
                  <span className="pro-card-title">
                    📝 {lang === 'ar' ? 'ملاحظات وشروط الفاتورة' : 'Terms & Remarks'}
                  </span>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
                  {lang === 'ar'
                    ? 'ستظهر هذه الملاحظات في الفاتورة المطبوعة وفي ملف الـ PDF الرسمي للعميل.'
                    : 'These notes will appear on the official printed invoice and PDF export.'}
                </p>
                <textarea
                  className="notes-textarea"
                  rows={4}
                  placeholder={
                    lang === 'ar'
                      ? 'أدخل أي شروط دفع، ضمانات، أو ملاحظات خاصة بالعميل...'
                      : 'Enter payment terms, warranty info, or customer instructions...'
                  }
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              {/* Financial Totals Card */}
              <div className="pro-card totals-card">
                <div className="pro-card-header">
                  <span className="pro-card-title">
                    📊 {lang === 'ar' ? 'الملخص المالي للفاتورة' : 'Financial Summary'}
                  </span>
                </div>

                <div className="totals-table">
                  <div className="totals-line">
                    <span className="line-label">{lang === 'ar' ? 'المجموع قبل الضريبة' : 'Subtotal'}:</span>
                    <span className="line-val">{totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}</span>
                  </div>

                  <div className="totals-line">
                    <span className="line-label">{lang === 'ar' ? 'الخصم المباشر' : 'Discount'}:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="discount-input-pro"
                        value={discount}
                        onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                      />
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{currency}</span>
                    </div>
                  </div>

                  <div className="totals-line">
                    <span className="line-label">
                      {lang === 'ar'
                        ? `ضريبة القيمة المضافة (${selectedTaxRate < 1 && selectedTaxRate > 0 ? selectedTaxRate * 100 : selectedTaxRate}%)`
                        : `VAT (${selectedTaxRate < 1 && selectedTaxRate > 0 ? selectedTaxRate * 100 : selectedTaxRate}%)`}
                      :
                    </span>
                    <span className="line-val">{totals.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}</span>
                  </div>

                  <div className="totals-line net-line">
                    <span className="net-label">{lang === 'ar' ? 'الإجمالي النهائي المطلوب' : 'Net Total Due'}:</span>
                    <div style={{ textAlign: 'right' }}>
                      <span className="net-val">
                        {totals.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
                        <small style={{ fontSize: '0.9rem' }}>{currency}</small>
                      </span>
                      {exchangeRate !== 1 && (
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                          {lang === 'ar' ? 'يعادل' : 'Equals'} {(totals.netAmount * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Accounting destination chip */}
                <div className={`posting-status-chip ${paymentType}`}>
                  {paymentType === 'paid' ? (
                    <div>
                      <span>💵 {lang === 'ar' ? 'توريد مباشر إلى:' : 'Posted directly to:'} </span>
                      <strong>
                        {selectedAccount
                          ? `${selectedAccount.code} — ${lang === 'ar' && selectedAccount.nameAr ? selectedAccount.nameAr : selectedAccount.name}`
                          : '—'}
                      </strong>
                    </div>
                  ) : (
                    <div>
                      <span>📋 {lang === 'ar' ? 'قيد محاسبي كذمة على:' : 'Posted as receivable for:'} </span>
                      <strong>{selectedCustomer ? (selectedCustomer.nameAr || selectedCustomer.name) : '—'}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Luxury Actions Footer */}
          <div className="invoice-pro-footer">
            <button type="button" className="btn-pro-secondary" onClick={onClose} disabled={isSubmitting}>
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button type="submit" className="btn-pro-primary" disabled={isSubmitting}>
              {isSubmitting
                ? lang === 'ar'
                  ? 'جاري حفظ وترحيل الفاتورة...'
                  : 'Posting Invoice...'
                : invoiceToEdit
                ? lang === 'ar'
                  ? 'حفظ التعديلات 💾'
                  : 'Save Changes 💾'
                : lang === 'ar'
                ? 'حفظ وترحيل الفاتورة الرسمية 🚀'
                : 'Post Official Invoice 🚀'}
            </button>
          </div>
        </form>

        {showQuickAdd && (
          <CreateCustomerModal
            lang={lang}
            onClose={() => setShowQuickAdd(false)}
            onSave={handleQuickAdd}
          />
        )}
        {showQuickAddProduct && (
          <CreateProductModal
            lang={lang}
            onClose={() => setShowQuickAddProduct(false)}
            onSave={async data => {
              const res = await handleQuickAddProduct(data);
              if (res.success && activeItemIndexForQuickAdd !== null) {
                const product = res.product;
                if (product) {
                  setLocalProducts(prev => [...prev, product]);
                  updateItem(activeItemIndexForQuickAdd, 'productId', product.id);
                }
              }
              return res;
            }}
          />
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }
        .invoice-modal-pro {
          max-width: 1060px;
          max-height: 94vh;
          width: 100%;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.35);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(226, 232, 240, 0.8);
          animation: modalAppear 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Header */
        .invoice-pro-header {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .invoice-badge-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        .header-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .header-title {
          margin: 0;
          font-size: 1.45rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
        }
        .executive-badge {
          background: rgba(59, 130, 246, 0.25);
          border: 1px solid rgba(96, 165, 250, 0.4);
          color: #93c5fd;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 9999px;
        }
        .header-subtitle {
          margin: 4px 0 0 0;
          font-size: 0.85rem;
          color: #94a3b8;
        }
        .pro-close-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          font-size: 1.6rem;
          line-height: 1;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pro-close-btn:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #fca5a5;
          border-color: rgba(239, 68, 68, 0.4);
        }

        /* Form Body */
        .invoice-pro-form {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }
        .invoice-pro-body {
          padding: 1.75rem 2rem;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: #f8fafc;
        }

        /* Cards */
        .pro-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.04);
        }
        .pro-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .pro-card-title {
          font-size: 1rem;
          font-weight: 800;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pro-card-pill {
          background: #f1f5f9;
          color: #475569;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 6px;
          font-family: monospace;
        }
        .pro-badge-soft {
          background: #dbeafe;
          color: #1d4ed8;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
        }

        /* Grid */
        .pro-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .pro-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .pro-form-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
        }
        .req {
          color: #ef4444;
        }

        /* Inputs */
        input, select, textarea {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          outline: none;
          font-size: 0.9rem;
          background: #ffffff;
          color: #0f172a;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        input:focus, select:focus, textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .customer-balance-chip {
          margin-top: 4px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tax-inclusive-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f1f5f9;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          padding: 0.65rem 1rem;
          cursor: pointer;
          width: 100%;
          font-weight: 700;
          font-size: 0.85rem;
          color: #475569;
          transition: all 0.2s;
        }
        .tax-inclusive-pill.active {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #1d4ed8;
        }
        .tax-inclusive-pill input {
          width: auto;
          margin: 0;
          cursor: pointer;
        }

        /* Buttons */
        .btn-pro-add {
          background: #2563eb;
          color: #fff;
          border: none;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          font-size: 1.3rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-pro-add:hover {
          background: #1d4ed8;
        }

        .btn-pro-action {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-pro-action:hover {
          background: #dbeafe;
        }

        /* Payment Section */
        .payment-toggle-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .payment-toggle-btn {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          text-align: inherit;
          transition: all 0.2s;
        }
        .payment-toggle-btn.selected {
          border-color: #2563eb;
          background: #eff6ff;
        }
        .toggle-icon {
          font-size: 1.6rem;
        }
        .toggle-title {
          font-weight: 800;
          font-size: 0.95rem;
          color: #0f172a;
        }
        .toggle-sub {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 2px;
        }

        .credit-callout {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #166534;
        }

        .paid-methods-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .methods-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
        }
        .payment-methods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 0.85rem;
        }
        .pm-card {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.85rem 1rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pm-card:hover {
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }
        .pm-card.selected {
          border-color: #2563eb;
          background: #eff6ff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
        }
        .pm-card-top {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pm-icon {
          font-size: 1.2rem;
        }
        .pm-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: #0f172a;
          flex: 1;
        }
        .pm-check {
          color: #2563eb;
          font-weight: 800;
          font-size: 0.9rem;
        }
        .pm-account-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: #64748b;
          background: rgba(255, 255, 255, 0.7);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .pm-account-pill .acc-code {
          font-family: monospace;
          font-weight: 700;
          color: #0369a1;
        }

        .account-override-row {
          margin-top: 0.5rem;
          padding-top: 1rem;
          border-top: 1px dashed #e2e8f0;
        }

        /* Account Selector */
        .account-search-container {
          position: relative;
          margin-top: 6px;
        }
        .account-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 1rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          cursor: pointer;
          background: #ffffff;
        }
        .selected-account {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        .acc-code-badge {
          background: #e0f2fe;
          color: #0369a1;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
          font-family: monospace;
          font-size: 0.8rem;
        }
        .acc-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: #0f172a;
        }
        .acc-type-badge {
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          background: #f1f5f9;
          color: #475569;
        }
        .account-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
          z-index: 200;
          overflow: hidden;
        }
        .account-search-input-wrap {
          padding: 8px 10px;
          border-bottom: 1px solid #f1f5f9;
        }
        .account-options {
          max-height: 220px;
          overflow-y: auto;
        }
        .account-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .account-option:hover {
          background: #f8fafc;
        }
        .account-option.selected {
          background: #eff6ff;
        }
        .no-accounts {
          padding: 1rem;
          text-align: center;
          color: #94a3b8;
          font-size: 0.85rem;
        }
        .dropdown-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
        }

        /* Items Table */
        .table-responsive {
          overflow: visible;
        }
        .pro-table {
          width: 100%;
          border-collapse: collapse;
        }
        .pro-table th {
          text-align: inherit;
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          padding: 0.75rem 0.5rem;
          border-bottom: 1.5px solid #e2e8f0;
        }
        .pro-table td {
          padding: 0.75rem 0.5rem;
          vertical-align: top;
          border-bottom: 1px solid #f1f5f9;
        }
        .stock-tag-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 4px;
        }
        .stock-badge {
          padding: 1px 6px;
          border-radius: 4px;
          font-weight: 700;
        }
        .stock-badge.in-stock {
          background: #dcfce7;
          color: #166534;
        }
        .stock-badge.out-stock {
          background: #fee2e2;
          color: #991b1b;
        }
        .btn-pro-remove {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .btn-pro-remove:hover {
          background: #fecaca;
        }

        /* Bottom Section */
        .invoice-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .notes-textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.5;
        }
        .totals-table {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .totals-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.92rem;
          color: #475569;
        }
        .line-val {
          font-weight: 700;
          color: #1e293b;
        }
        .discount-input-pro {
          width: 90px;
          text-align: right;
          padding: 4px 8px;
          border-radius: 6px;
        }
        .net-line {
          border-top: 2px solid #e2e8f0;
          padding-top: 0.85rem;
          margin-top: 0.25rem;
        }
        .net-label {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
        }
        .net-val {
          font-size: 1.35rem;
          font-weight: 900;
          color: #1d4ed8;
        }

        .posting-status-chip {
          margin-top: 1rem;
          padding: 0.65rem 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          line-height: 1.4;
        }
        .posting-status-chip.paid {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
        }
        .posting-status-chip.credit {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        /* Footer */
        .invoice-pro-footer {
          background: #ffffff;
          padding: 1.25rem 2rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          border-top: 1px solid #e2e8f0;
        }
        .btn-pro-secondary {
          padding: 10px 24px;
          border-radius: 10px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-pro-secondary:hover {
          background: #e2e8f0;
        }
        .btn-pro-primary {
          padding: 10px 28px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border: none;
          color: #ffffff;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-pro-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
        }
        .btn-pro-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .pro-grid-3, .invoice-bottom-grid, .payment-toggle-grid {
            grid-template-columns: 1fr;
          }
          .invoice-pro-header {
            padding: 1rem;
          }
          .invoice-pro-body {
            padding: 1rem;
          }
          .invoice-pro-footer {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

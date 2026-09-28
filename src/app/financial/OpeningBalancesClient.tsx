import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveOpeningBalances, saveCustomerOpeningBalances, saveSupplierOpeningBalances, saveProductOpeningBalances } from './actions';

// Pro Max Premium SVG Icons
const Icons = {
  accounts: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="14" width="4" height="7" rx="1" />
      <rect x="10" y="3" width="4" height="18" rx="1" />
      <rect x="17" y="8" width="4" height="13" rx="1" />
    </svg>
  ),
  products: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  customers: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  suppliers: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
};

export default function OpeningBalancesClient({ 
  lang, accounts = [], customers = [], suppliers = [], products = [], warehouses = []
}: { 
  lang: string, accounts?: any[], customers?: any[], suppliers?: any[], products?: any[], warehouses?: any[]
}) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Shared Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [primaryAccountId, setPrimaryAccountId] = useState('');
  
  // Tables State
  const [rows, setRows] = useState([{ id: 1, accountId: '', balance: '' }]);
  const [customerRows, setCustomerRows] = useState([{ id: 1, customerId: '', balance: '' }]);
  const [supplierRows, setSupplierRows] = useState([{ id: 1, supplierId: '', balance: '' }]);
  const [productRows, setProductRows] = useState([{ id: 1, productId: '', warehouseId: '', quantity: '', unitCost: '' }]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const types = [
    { id: 'accounts', label: lang === 'ar' ? 'الحسابات العامة' : 'Accounts', icon: Icons.accounts, desc: lang === 'ar' ? 'إدخال أرصدة الصناديق، البنوك، وغيرها' : 'Cash, Bank, Assets balances' },
    { id: 'customers', label: lang === 'ar' ? 'ذمم العملاء' : 'Customers', icon: Icons.customers, desc: lang === 'ar' ? 'إدخال الأرصدة المستحقة على عملائك' : 'Receivables from your clients' },
    { id: 'suppliers', label: lang === 'ar' ? 'ذمم الموردين' : 'Suppliers', icon: Icons.suppliers, desc: lang === 'ar' ? 'إدخال الأرصدة المستحقة لمورديك' : 'Payables to your vendors' },
    { id: 'products', label: lang === 'ar' ? 'المخزون والمنتجات' : 'Products & Stock', icon: Icons.products, desc: lang === 'ar' ? 'إدخال كميات المخزون وتكلفتها' : 'Inventory opening stock and costs' },
  ];

  // Helper function to reset shared inputs
  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setPrimaryAccountId('');
  };

  const renderTopForm = (title: string) => (
    <div className="pro-max-header">
       <button className="btn-back" onClick={() => setSelectedType(null)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={lang === 'ar' ? "M5 12h14M5 12l6-6M5 12l6 6" : "M19 12H5M19 12l-6-6M19 12l-6 6"}/></svg>
          <span>{lang === 'ar' ? 'رجوع' : 'Back'}</span>
       </button>
       <div className="header-content">
          <h2>{title}</h2>
          <p>{lang === 'ar' ? 'أدخل التفاصيل الأساسية لقيد الأرصدة الافتتاحية' : 'Enter the basic details for the opening balance journal entry'}</p>
       </div>

       <div className="pro-max-top-form">
          {error && <div className="alert-error">{error}</div>}
          <div className="form-grid">
              <div className="input-group">
                  <label>{lang === 'ar' ? 'تاريخ السحب' : 'Date'}</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="pro-input" />
              </div>
              <div className="input-group">
                  <label>{lang === 'ar' ? 'وصف القيد' : 'Description'}</label>
                  <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="pro-input" placeholder={lang === 'ar' ? 'مثال: رصيد افتتاحي 2024...' : 'e.g. Opening Balance 2024...'} />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label>{lang === 'ar' ? 'حساب التسوية (رأس المال / الأرباح المبقاة)' : 'Equity Account (Retained Earnings / Capital)'}</label>
                  <select value={primaryAccountId} onChange={e => setPrimaryAccountId(e.target.value)} className="pro-select">
                      <option value="">{lang === 'ar' ? 'اختر حساب حقوق الملكية...' : 'Select Equity Account...'}</option>
                       {(accounts || []).filter(a => a.type === 'Equity').map(a => <option key={a.id} value={a.id}>{a.code} - {lang === 'ar' && a.nameAr ? a.nameAr : a.name}</option>)}
                  </select>
              </div>
          </div>
       </div>
    </div>
  );

  // ---------- SAVE HANDLERS ----------

  const handleSaveAccounts = async () => {
    try {
      setLoading(true); setError('');
      const validRows = rows.filter(r => r.accountId && r.balance && !isNaN(parseFloat(r.balance)));
      if (!validRows.length) throw new Error(lang === 'ar' ? 'يرجى إدخال حساب واحد على الأقل' : 'Please fill at least one row');
      if (!primaryAccountId) throw new Error(lang === 'ar' ? 'يرجى اختيار حساب التسوية' : 'Please select the equity account');
      
      const res = await saveOpeningBalances({ date, description, primaryAccountId, rows: validRows.map(r => ({ accountId: r.accountId, balance: parseFloat(r.balance) })) });
      if (!res.success) throw new Error(res.error);
      
      alert(lang === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved successfully!');
      router.refresh(); resetForm(); setRows([{ id: Date.now(), accountId: '', balance: '' }]);
    } catch (err: any) { setError(err.message || 'Error'); } finally { setLoading(false); }
  };

  const handleSaveCustomers = async () => {
    try {
      setLoading(true); setError('');
      const validRows = customerRows.filter(r => r.customerId && r.balance && parseFloat(r.balance) > 0);
      if (!validRows.length) throw new Error(lang === 'ar' ? 'يرجى إدخال عميل واحد على الأقل مع رصيد صالح' : 'Please fill at least one valid row');
      if (!primaryAccountId) throw new Error(lang === 'ar' ? 'يرجى اختيار حساب التسوية' : 'Please select the equity account');
      const recAcc = accounts.find(a => a.code === '1130' || a.name?.includes('Receivable') || a.nameAr?.includes('عملاء'));
      if (!recAcc) throw new Error(lang === 'ar' ? 'حساب ذمم العملاء غير موجود' : 'Accounts Receivable not found');

      const res = await saveCustomerOpeningBalances({ date, description, primaryAccountId, receivablesAccountId: recAcc.id, rows: validRows.map(r => ({ customerId: r.customerId, balance: parseFloat(r.balance) })) });
      if (!res.success) throw new Error(res.error);
      alert(lang === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved successfully!');
      router.refresh(); resetForm(); setCustomerRows([{ id: Date.now(), customerId: '', balance: '' }]);
    } catch (err: any) { setError(err.message || 'Error'); } finally { setLoading(false); }
  };

  const handleSaveSuppliers = async () => {
    try {
      setLoading(true); setError('');
      const validRows = supplierRows.filter(r => r.supplierId && r.balance && parseFloat(r.balance) > 0);
      if (!validRows.length) throw new Error(lang === 'ar' ? 'يرجى إدخال مورد واحد على الأقل مع رصيد صالح' : 'Please fill at least one valid row');
      if (!primaryAccountId) throw new Error(lang === 'ar' ? 'يرجى اختيار حساب التسوية' : 'Please select the equity account');
      const payAcc = accounts.find(a => a.code === '2150' || a.name?.includes('Payable') || a.nameAr?.includes('موردون'));
      if (!payAcc) throw new Error(lang === 'ar' ? 'حساب ذمم الموردين غير موجود' : 'Accounts Payable not found');

      const res = await saveSupplierOpeningBalances({ date, description, primaryAccountId, payablesAccountId: payAcc.id, rows: validRows.map(r => ({ supplierId: r.supplierId, balance: parseFloat(r.balance) })) });
      if (!res.success) throw new Error(res.error);
      alert(lang === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved successfully!');
      router.refresh(); resetForm(); setSupplierRows([{ id: Date.now(), supplierId: '', balance: '' }]);
    } catch (err: any) { setError(err.message || 'Error'); } finally { setLoading(false); }
  };

  const handleSaveProducts = async () => {
    try {
      setLoading(true); setError('');
      const validRows = productRows.filter(r => r.productId && r.warehouseId && r.quantity && r.unitCost && parseFloat(r.quantity) > 0 && parseFloat(r.unitCost) >= 0);
      if (!validRows.length) throw new Error(lang === 'ar' ? 'يرجى إدخال منتج واحد على الأقل مع كمية وتكلفة صالحة' : 'Please fill at least one valid row');
      if (!primaryAccountId) throw new Error(lang === 'ar' ? 'يرجى اختيار حساب التسوية' : 'Please select the equity account');
      const invAcc = accounts.find(a => a.code === '1140' || a.name?.includes('Inventory') || a.nameAr?.includes('مخزون'));
      if (!invAcc) throw new Error(lang === 'ar' ? 'حساب المخزون غير موجود' : 'Inventory account not found');

      const res = await saveProductOpeningBalances({ date, description, primaryAccountId, inventoryAccountId: invAcc.id, rows: validRows.map(r => ({ productId: r.productId, warehouseId: r.warehouseId, quantity: parseFloat(r.quantity), unitCost: parseFloat(r.unitCost) })) });
      if (!res.success) throw new Error(res.error);
      alert(lang === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved successfully!');
      router.refresh(); resetForm(); setProductRows([{ id: Date.now(), productId: '', warehouseId: '', quantity: '', unitCost: '' }]);
    } catch (err: any) { setError(err.message || 'Error'); } finally { setLoading(false); }
  };

  // ---------- RENDER FUNCTIONS ----------

  if (selectedType === 'accounts') return (
    <div className="pro-max-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {renderTopForm(lang === 'ar' ? 'الأرصدة الافتتاحية للحسابات' : 'Accounts Opening Balances')}
      <div className="pro-max-card">
          <div className="table-wrapper">
              <table className="pro-table">
                  <thead><tr><th>{lang === 'ar' ? 'الحساب' : 'Account'}</th><th>{lang === 'ar' ? 'الرصيد' : 'Balance'}</th><th></th></tr></thead>
                  <tbody>
                      {rows.map(row => (
                          <tr key={row.id}>
                              <td>
                                  <select className="table-select" value={row.accountId} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, accountId: e.target.value } : r))}>
                                      <option value="">{lang === 'ar' ? 'اختر الحساب...' : 'Select account...'}</option>
                                      {accounts.map(a => <option key={a.id} value={a.id}>{a.code} - {lang === 'ar' && a.nameAr ? a.nameAr : a.name}</option>)}
                                  </select>
                              </td>
                              <td><input type="number" className="table-input" value={row.balance} onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, balance: e.target.value } : r))} placeholder="0.00" /></td>
                              <td className="actions-cell">
                                  {rows.length > 1 && <button className="btn-icon-danger" onClick={() => setRows(rows.filter(r => r.id !== row.id))} title={lang === 'ar' ? 'حذف' : 'Delete'}>×</button>}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          <div className="card-footer">
              <button className="btn-ghost" onClick={() => setRows([...rows, { id: Date.now(), accountId: '', balance: '' }])}>+ {lang === 'ar' ? 'سطر جديد' : 'Add Row'}</button>
              <button className="btn-primary" disabled={loading} onClick={handleSaveAccounts}>{loading ? <span className="spinner"></span> : (lang === 'ar' ? 'حفظ الأرصدة' : 'Save Balances')}</button>
          </div>
      </div>
      <StyleBlock />
    </div>
  );

  if (selectedType === 'customers') return (
    <div className="pro-max-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {renderTopForm(lang === 'ar' ? 'الأرصدة الافتتاحية للعملاء' : 'Customers Opening Balances')}
      <div className="pro-max-card">
          <div className="table-wrapper">
              <table className="pro-table">
                  <thead><tr><th>{lang === 'ar' ? 'العميل' : 'Customer'}</th><th>{lang === 'ar' ? 'المبلغ المستحق لك' : 'Due Amount'}</th><th></th></tr></thead>
                  <tbody>
                      {customerRows.map(row => (
                          <tr key={row.id}>
                              <td>
                                  <select className="table-select" value={row.customerId} onChange={e => setCustomerRows(customerRows.map(r => r.id === row.id ? { ...r, customerId: e.target.value } : r))}>
                                      <option value="">{lang === 'ar' ? 'اختر العميل...' : 'Select customer...'}</option>
                                      {customers.map(c => <option key={c.id} value={c.id}>{lang === 'ar' && c.nameAr ? c.nameAr : c.name}</option>)}
                                  </select>
                              </td>
                              <td><input type="number" min="0" className="table-input" value={row.balance} onChange={e => setCustomerRows(customerRows.map(r => r.id === row.id ? { ...r, balance: e.target.value } : r))} placeholder="0.00" /></td>
                              <td className="actions-cell">
                                  {customerRows.length > 1 && <button className="btn-icon-danger" onClick={() => setCustomerRows(customerRows.filter(r => r.id !== row.id))}>×</button>}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          <div className="card-footer">
              <button className="btn-ghost" onClick={() => setCustomerRows([...customerRows, { id: Date.now(), customerId: '', balance: '' }])}>+ {lang === 'ar' ? 'عميل جديد' : 'Add Customer'}</button>
              <button className="btn-primary" disabled={loading} onClick={handleSaveCustomers}>{loading ? <span className="spinner"></span> : (lang === 'ar' ? 'حفظ الأرصدة' : 'Save Balances')}</button>
          </div>
      </div>
      <StyleBlock />
    </div>
  );

  if (selectedType === 'suppliers') return (
    <div className="pro-max-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {renderTopForm(lang === 'ar' ? 'الأرصدة الافتتاحية للموردين' : 'Suppliers Opening Balances')}
      <div className="pro-max-card">
          <div className="table-wrapper">
              <table className="pro-table">
                  <thead><tr><th>{lang === 'ar' ? 'المورد' : 'Supplier'}</th><th>{lang === 'ar' ? 'المبلغ المستحق للمورد' : 'Payable Amount'}</th><th></th></tr></thead>
                  <tbody>
                      {supplierRows.map(row => (
                          <tr key={row.id}>
                              <td>
                                  <select className="table-select" value={row.supplierId} onChange={e => setSupplierRows(supplierRows.map(r => r.id === row.id ? { ...r, supplierId: e.target.value } : r))}>
                                      <option value="">{lang === 'ar' ? 'اختر المورد...' : 'Select supplier...'}</option>
                                      {suppliers.map(c => <option key={c.id} value={c.id}>{lang === 'ar' && c.nameAr ? c.nameAr : c.name}</option>)}
                                  </select>
                              </td>
                              <td><input type="number" min="0" className="table-input" value={row.balance} onChange={e => setSupplierRows(supplierRows.map(r => r.id === row.id ? { ...r, balance: e.target.value } : r))} placeholder="0.00" /></td>
                              <td className="actions-cell">
                                  {supplierRows.length > 1 && <button className="btn-icon-danger" onClick={() => setSupplierRows(supplierRows.filter(r => r.id !== row.id))}>×</button>}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          <div className="card-footer">
              <button className="btn-ghost" onClick={() => setSupplierRows([...supplierRows, { id: Date.now(), supplierId: '', balance: '' }])}>+ {lang === 'ar' ? 'مورد جديد' : 'Add Supplier'}</button>
              <button className="btn-primary" disabled={loading} onClick={handleSaveSuppliers}>{loading ? <span className="spinner"></span> : (lang === 'ar' ? 'حفظ الأرصدة' : 'Save Balances')}</button>
          </div>
      </div>
      <StyleBlock />
    </div>
  );

  if (selectedType === 'products') return (
    <div className="pro-max-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {renderTopForm(lang === 'ar' ? 'الأرصدة الافتتاحية للمخزون' : 'Inventory Opening Balances')}
      <div className="pro-max-card">
          <div className="table-wrapper">
              <table className="pro-table">
                  <thead><tr>
                      <th>{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                      <th>{lang === 'ar' ? 'المستودع' : 'Warehouse'}</th>
                      <th style={{width: '120px'}}>{lang === 'ar' ? 'الكمية' : 'Quantity'}</th>
                      <th style={{width: '150px'}}>{lang === 'ar' ? 'تكلفة الوحدة' : 'Unit Cost'}</th>
                      <th style={{width: '150px'}}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                      <th></th>
                  </tr></thead>
                  <tbody>
                      {productRows.map(row => {
                          const total = (parseFloat(row.quantity) || 0) * (parseFloat(row.unitCost) || 0);
                          return (
                          <tr key={row.id}>
                              <td>
                                  <select className="table-select" value={row.productId} onChange={e => setProductRows(productRows.map(r => r.id === row.id ? { ...r, productId: e.target.value } : r))}>
                                      <option value="">{lang === 'ar' ? 'المنتج...' : 'Product...'}</option>
                                      {products.map(c => <option key={c.id} value={c.id}>{c.sku} - {lang === 'ar' && c.nameAr ? c.nameAr : c.name}</option>)}
                                  </select>
                              </td>
                              <td>
                                  <select className="table-select" value={row.warehouseId} onChange={e => setProductRows(productRows.map(r => r.id === row.id ? { ...r, warehouseId: e.target.value } : r))}>
                                      <option value="">{lang === 'ar' ? 'المستودع...' : 'Warehouse...'}</option>
                                      {warehouses.map(c => <option key={c.id} value={c.id}>{lang === 'ar' && c.nameAr ? c.nameAr : c.name}</option>)}
                                  </select>
                              </td>
                              <td><input type="number" min="0" className="table-input" value={row.quantity} onChange={e => setProductRows(productRows.map(r => r.id === row.id ? { ...r, quantity: e.target.value } : r))} placeholder="0" /></td>
                              <td><input type="number" min="0" step="0.01" className="table-input" value={row.unitCost} onChange={e => setProductRows(productRows.map(r => r.id === row.id ? { ...r, unitCost: e.target.value } : r))} placeholder="0.00" /></td>
                              <td>
                                  <div className="total-display">{total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                              </td>
                              <td className="actions-cell">
                                  {productRows.length > 1 && <button className="btn-icon-danger" onClick={() => setProductRows(productRows.filter(r => r.id !== row.id))}>×</button>}
                              </td>
                          </tr>
                      )})}
                  </tbody>
              </table>
          </div>
          <div className="card-footer">
              <button className="btn-ghost" onClick={() => setProductRows([...productRows, { id: Date.now(), productId: '', warehouseId: '', quantity: '', unitCost: '' }])}>+ {lang === 'ar' ? 'منتج جديد' : 'Add Product'}</button>
              <button className="btn-primary" disabled={loading} onClick={handleSaveProducts}>{loading ? <span className="spinner"></span> : (lang === 'ar' ? 'حفظ الأرصدة' : 'Save Balances')}</button>
          </div>
      </div>
      <StyleBlock />
    </div>
  );

  return (
    <div className="pro-max-menu-wrapper" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="menu-header">
        <div className="badge">{lang === 'ar' ? 'التهيئة المحاسبية' : 'Accounting Setup'}</div>
        <h2>{lang === 'ar' ? 'إدارة الأرصدة الافتتاحية' : 'Opening Balances Management'}</h2>
        <p>{lang === 'ar' ? 'اختر القسم الذي ترغب بإدخال أرصدته لبدء العمل على النظام' : 'Select the module you want to initialize'}</p>
      </div>
      
      <div className="menu-grid">
        {types.map((type) => (
          <button key={type.id} className="menu-card" onClick={() => setSelectedType(type.id)}>
            <div className={`card-icon-wrap icon-${type.id}`}>
              {type.icon}
            </div>
            <div className="card-content">
              <h3>{type.label}</h3>
              <p>{type.desc}</p>
            </div>
            <div className="card-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={lang === 'ar' ? "M19 12H5M5 12l7-7M5 12l7 7" : "M5 12h14M19 12l-7-7M19 12l-7 7"}/>
              </svg>
            </div>
          </button>
        ))}
      </div>
      <StyleBlock />
    </div>
  );
}

// Global CSS Block for UI UX Pro Max Styling
const StyleBlock = () => (
  <style dangerouslySetInnerHTML={{__html: `
    .pro-max-container, .pro-max-menu-wrapper {
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --surface: #ffffff;
      --surface-hover: #f8fafc;
      --background: #f1f5f9;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --danger: #ef4444;
      --danger-bg: #fef2f2;
      --success: #10b981;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --radius-lg: 1rem;
      --radius-md: 0.75rem;
      --radius-sm: 0.5rem;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* --- MENU STYLES --- */
    .pro-max-menu-wrapper {
      max-width: 900px;
      margin: 2rem auto;
      padding: 0 1rem;
      font-family: 'Inter', system-ui, sans-serif;
    }
    .menu-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    .menu-header .badge {
      display: inline-block;
      padding: 0.25rem 1rem;
      background: #e0e7ff;
      color: #3730a3;
      border-radius: 999px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .menu-header h2 {
      font-size: 2.25rem;
      color: var(--text-main);
      margin: 0 0 0.5rem 0;
      font-weight: 700;
      letter-spacing: -0.025em;
    }
    .menu-header p {
      color: var(--text-muted);
      font-size: 1.1rem;
      margin: 0;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .menu-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      text-align: right;
      cursor: pointer;
      transition: var(--transition);
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
      outline: none;
    }
    [dir="ltr"] .menu-card { text-align: left; }
    
    .menu-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: #cbd5e1;
    }

    .card-icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: white;
      transition: var(--transition);
    }
    .icon-accounts { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .icon-customers { background: linear-gradient(135deg, #10b981, #047857); }
    .icon-suppliers { background: linear-gradient(135deg, #f59e0b, #b45309); }
    .icon-products { background: linear-gradient(135deg, #8b5cf6, #5b21b6); }

    .menu-card:hover .card-icon-wrap {
      transform: scale(1.05);
    }

    .card-content h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.25rem;
      color: var(--text-main);
      font-weight: 600;
    }
    .card-content p {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.9rem;
      line-height: 1.4;
    }
    .card-arrow {
      margin-inline-start: auto;
      color: #94a3b8;
      transition: var(--transition);
    }
    .menu-card:hover .card-arrow {
      color: var(--primary);
      transform: translateX(var(--arrow-dir, -5px));
    }
    [dir="ltr"] .menu-card:hover .card-arrow {
      transform: translateX(5px);
    }

    /* --- DETAILS VIEW STYLES --- */
    .pro-max-container {
      max-width: 1100px;
      margin: 2rem auto;
      padding: 0 1rem;
      font-family: 'Inter', system-ui, sans-serif;
      animation: fadeIn 0.4s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .pro-max-header {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: 2rem;
      box-shadow: var(--shadow-sm);
      margin-bottom: 1.5rem;
      position: relative;
    }

    .btn-back {
      position: absolute;
      top: 2rem;
      inset-inline-start: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      color: var(--text-muted);
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
    }
    .btn-back:hover {
      background: var(--surface-hover);
      color: var(--text-main);
    }

    .header-content {
      text-align: center;
      margin-bottom: 2rem;
    }
    .header-content h2 {
      font-size: 1.8rem;
      color: var(--text-main);
      margin: 0 0 0.5rem 0;
    }
    .header-content p {
      color: var(--text-muted);
      margin: 0;
    }

    .pro-max-top-form {
      max-width: 800px;
      margin: 0 auto;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .input-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .pro-input, .pro-select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      font-size: 1rem;
      background: #f8fafc;
      color: #0f172a !important;
      transition: var(--transition);
      outline: none;
    }
    .pro-input:focus, .pro-select:focus {
      background: var(--surface);
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    /* --- TABLE STYLES --- */
    .pro-max-card {
      background: var(--surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      border: 1px solid var(--border);
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
    }

    .pro-table {
      width: 100%;
      border-collapse: collapse;
      text-align: right;
    }
    [dir="ltr"] .pro-table { text-align: left; }

    .pro-table th {
      background: #f8fafc;
      color: var(--text-muted);
      font-weight: 600;
      padding: 1rem 1.5rem;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border);
    }

    .pro-table td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }

    .pro-table tr:last-child td {
      border-bottom: none;
    }

    .pro-table tr:hover td {
      background: #fbfcfd;
    }

    .table-select, .table-input {
      width: 100%;
      padding: 0.6rem 0.75rem;
      border: 1px solid transparent;
      border-radius: var(--radius-sm);
      background: transparent;
      font-size: 0.95rem;
      color: #0f172a !important;
      transition: var(--transition);
      outline: none;
    }
    .table-select:hover, .table-input:hover {
      border-color: var(--border);
      background: var(--surface);
    }
    .table-select:focus, .table-input:focus {
      border-color: var(--primary);
      background: var(--surface);
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    }

    .total-display {
      font-weight: 600;
      color: var(--primary);
      font-size: 1.1rem;
    }

    .actions-cell {
      width: 60px;
      text-align: center;
    }

    .btn-icon-danger {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.5rem;
      line-height: 1;
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
    }
    .btn-icon-danger:hover {
      background: var(--danger-bg);
      color: var(--danger);
    }

    /* --- FOOTER & BUTTONS --- */
    .card-footer {
      padding: 1.5rem;
      background: #f8fafc;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .btn-ghost {
      background: none;
      border: none;
      color: var(--primary);
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      transition: var(--transition);
    }
    .btn-ghost:hover {
      background: rgba(79, 70, 229, 0.1);
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 150px;
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
    }
    .btn-primary:hover:not(:disabled) {
      background: var(--primary-hover);
      transform: translateY(-1px);
      box-shadow: 0 6px 8px -1px rgba(79, 70, 229, 0.4);
    }
    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .alert-error {
      background: var(--danger-bg);
      color: var(--danger);
      padding: 1rem;
      border-radius: var(--radius-md);
      margin-bottom: 1.5rem;
      font-weight: 500;
      border: 1px solid #fecaca;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `}} />
);

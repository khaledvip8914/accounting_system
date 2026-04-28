import { useState, useRef } from 'react';
import { getDictionary } from '@/lib/i18n';
import SearchableSelect from '@/components/SearchableSelect';

interface Product {
  id: string;
  sku: string;
  name: string;
  nameAr?: string;
  category?: string;
  stockQuantity: number;
  reorderPoint: number;
  costPrice: number;
  unit: string;
  unitRef?: { name: string; nameAr?: string };
}

interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  nameAr?: string;
  quantity: number;
  price: number;
  unit: string;
  supplierId?: string;
}

export default function PurchaseOrderList({ 
  products, 
  suppliers,
  lang 
}: { 
  products: Product[], 
  suppliers: any[],
  lang: string 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const summaryRef = useRef<HTMLDivElement>(null);
  
  const dict = getDictionary(lang);

  // Filter products that reached minimum quantity
  const lowStockProducts = products.filter(p => 
    (p.reorderPoint > 0 && p.stockQuantity <= p.reorderPoint)
  );

  const filtered = lowStockProducts.filter(p => {
    const s = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(s) ||
      (p.nameAr || '').toLowerCase().includes(s) ||
      p.sku.toLowerCase().includes(s)
    );
  });

  const handleAddLowStockToOrder = () => {
    const items = lowStockProducts.map(p => ({
      productId: p.id,
      sku: p.sku,
      name: p.name,
      nameAr: p.nameAr,
      quantity: Math.max(0, p.reorderPoint - p.stockQuantity),
      price: p.costPrice || 0,
      unit: lang === 'ar' ? (p.unitRef?.nameAr || p.unit) : (p.unitRef?.name || p.unit),
      supplierId: (p as any).supplierId
    }));
    setOrderItems(items);
    setShowOrderModal(true);
  };

  const handleAddItemManually = (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;
    
    // Check if already in list
    if (orderItems.find(item => item.productId === productId)) return;

    setOrderItems([...orderItems, {
      productId: p.id,
      sku: p.sku,
      name: p.name,
      nameAr: p.nameAr,
      quantity: 1,
      price: p.costPrice || 0,
      unit: lang === 'ar' ? (p.unitRef?.nameAr || p.unit) : (p.unitRef?.name || p.unit),
      supplierId: (p as any).supplierId
    }]);
  };

  const updateItemQty = (index: number, qty: number) => {
    const newItems = [...orderItems];
    newItems[index].quantity = qty;
    setOrderItems(newItems);
  };

  const updateItemPrice = (index: number, price: number) => {
    const newItems = [...orderItems];
    newItems[index].price = price;
    setOrderItems(newItems);
  };
  
  const updateItemSupplier = (index: number, supplierId: string) => {
    const newItems = [...orderItems];
    newItems[index].supplierId = supplierId;
    setOrderItems(newItems);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.price) || 0)), 0);

  const handlePrintSummary = () => {
     window.print();
  };

  return (
    <div className="purchase-orders-module">
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">
            {lang === 'ar' ? 'نواقص المخزون' : 'Stock Shortages'}
            <span style={{ 
              marginLeft: '10px', 
              fontSize: '0.9rem', 
              background: '#ef4444', 
              color: 'white', 
              padding: '2px 8px', 
              borderRadius: '12px',
              verticalAlign: 'middle'
            }}>
              {lowStockProducts.length}
            </span>
          </h2>
          <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" onClick={() => window.print()}>
              {lang === 'ar' ? '🖨️ طباعة القائمة' : '🖨️ Print List'}
            </button>
          </div>
        </div>

        <div className="filter-bar no-print" style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
           <input 
             type="text" 
             placeholder={lang === 'ar' ? "البحث في النواقص..." : "Search shortages..."}
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
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'رقم الصنف' : 'SKU'}</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'اسم الصنف' : 'Name'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الوحدة' : 'Unit'}</th>
                <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الكمية الحالية' : 'Current Stock'}</th>
                <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الحد الأدنى' : 'Min. Order Qty'}</th>
                <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'العجز' : 'Shortage'}</th>
                <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'المورد' : 'Supplier'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    {lang === 'ar' ? 'لا توجد أصناف تحت الحد الأدنى حالياً' : 'No items currently below minimum quantity'}
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const shortage = Math.max(0, (p.reorderPoint || 0) - (p.stockQuantity || 0));
                  return (
                    <tr key={p.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{p.sku}</td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{lang === 'ar' && p.nameAr ? p.nameAr : p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{p.category}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge">
                          {lang === 'ar' ? (p.unitRef?.nameAr || p.unit) : (p.unitRef?.name || p.unit)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', color: '#ef4444', fontWeight: 'bold' }}>
                        {p.stockQuantity.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '500' }}>
                        {p.reorderPoint.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ color: shortage > 0 ? '#ef4444' : '#64748b', fontWeight: 'bold', fontSize: '1.1rem' }}>
                          {shortage.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                          ({lang === 'ar' ? 'الحد:' : 'Min:'} {p.reorderPoint} | {lang === 'ar' ? 'الحالي:' : 'Stock:'} {p.stockQuantity})
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                           {suppliers.find(s => s.id === (p as any).supplierId)?.nameAr || suppliers.find(s => s.id === (p as any).supplierId)?.name || '—'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '0.75rem',
                          background: p.stockQuantity <= 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                          color: p.stockQuantity <= 0 ? '#ef4444' : '#f97316',
                          fontWeight: 'bold'
                        }}>
                          {p.stockQuantity <= 0 
                            ? (lang === 'ar' ? 'نفد المخزون' : 'Out of Stock') 
                            : (lang === 'ar' ? 'على وشك النفاد' : 'Near depletion')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Creation Modal */}
      {showOrderModal && (
        <div className="modal-overlay no-print">
          <div className="modal-content" style={{ maxWidth: '900px', width: '95%', maxHeight: '90vh' }}>
            <div className="modal-header">
              <div>
              <h3 style={{ margin: 0 }}>{lang === 'ar' ? 'إنشاء طلب شراء (نواقص)' : 'Create Purchase Order (Shortages)'}</h3>
              <div style={{ color: 'red', fontSize: '0.7rem', fontWeight: 'bold' }}>VERSION: 2.1 - CORRECTED</div>
            </div>
              <button className="close-btn" onClick={() => setShowOrderModal(false)}>&times;</button>
            </div>
            <div className="modal-body" style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
               <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569' }}>
                    {lang === 'ar' ? 'إضافة صنف للطلب:' : 'Add item to order:'}
                  </label>
                  <SearchableSelect 
                    options={products.map(p => ({ 
                      id: p.id, 
                      sku: p.sku, 
                      name: p.name, 
                      nameAr: p.nameAr 
                    }))}
                    value=""
                    onChange={(val) => handleAddItemManually(val)}
                    lang={lang}
                    placeholder={lang === 'ar' ? "اختر صنفاً..." : "Select item..."}
                  />
               </div>

               <div className="order-items-table">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'الصنف' : 'Item'}</th>
                        <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                        <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'السعر' : 'Price'}</th>
                        <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'المورد' : 'Supplier'}</th>
                        <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, index) => (
                        <tr key={item.productId}>
                          <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{index + 1}</td>
                          <td>
                            <div style={{ fontWeight: '600', color: '#1e293b' }}>{lang === 'ar' ? item.nameAr : item.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.sku} | {item.unit}</div>
                          </td>
                          <td style={{ width: '120px' }}>
                            <input 
                              type="number" 
                              className="qty-input"
                              value={item.quantity} 
                              onChange={(e) => updateItemQty(index, parseFloat(e.target.value) || 0)} 
                            />
                          </td>
                          <td style={{ width: '120px' }}>
                            <input 
                              type="number" 
                              className="qty-input"
                              value={item.price} 
                              onChange={(e) => updateItemPrice(index, parseFloat(e.target.value) || 0)} 
                            />
                          </td>
                          <td style={{ textAlign: 'right' }}>
                             <select 
                               value={item.supplierId || ''} 
                               onChange={(e) => updateItemSupplier(index, e.target.value)}
                               style={{ width: '100%', padding: '0.2rem', fontSize: '0.8rem' }}
                             >
                                <option value="">--</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{lang === 'ar' ? s.nameAr || s.name : s.name}</option>)}
                             </select>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: '600', color: '#1e293b' }}>
                            {((Number(item.quantity) || 0) * (Number(item.price) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="remove-btn" onClick={() => removeItem(index)}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                      {orderItems.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                            {lang === 'ar' ? 'لم يتم إضافة أصناف بعد' : 'No items added yet'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </div>
            <div className="modal-footer" style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>
                  {lang === 'ar' ? 'إجمالي الطلب:' : 'Order Total:'} {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
               </div>
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" onClick={() => setShowOrderModal(false)}>
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button className="btn-primary" onClick={() => { setShowOrderModal(false); setShowSummary(true); }} disabled={orderItems.length === 0}>
                    {lang === 'ar' ? 'إتمام وعرض التفاصيل' : 'Finish and View Details'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary View Modal */}
      {showSummary && (
        <div className="modal-overlay summary-overlay">
          <div className="modal-content summary-content" style={{ maxWidth: '850px', width: '95%', background: 'white', color: 'black' }}>
            <div className="modal-header no-print">
              <h3>{lang === 'ar' ? 'تفاصيل طلب الشراء' : 'Purchase Order Details'}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-secondary" style={{ color: 'black', borderColor: '#ccc' }} onClick={handlePrintSummary}>🖨️ {lang === 'ar' ? 'طباعة' : 'Print'}</button>
                <button className="close-btn" style={{ color: 'black' }} onClick={() => setShowSummary(false)}>&times;</button>
              </div>
            </div>
            <div className="print-area" style={{ padding: '3rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #333', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <h1 style={{ fontSize: '2rem', margin: 0 }}>{lang === 'ar' ? 'طلب شراء' : 'PURCHASE ORDER'}</h1>
                    <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>{new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'long' })}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{lang === 'ar' ? 'النظام المحاسبي' : 'Accounting System'}</div>
                    <div style={{ color: '#666' }}>{lang === 'ar' ? 'إدارة المخازن' : 'Inventory Management'}</div>
                  </div>
               </div>

               <table className="summary-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #333' }}>
                      <th style={{ padding: '0.8rem', textAlign: 'center', width: '50px' }}>#</th>
                      <th style={{ padding: '0.8rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'اسم الصنف' : 'Item Name'}</th>
                      <th style={{ padding: '0.8rem', textAlign: 'center' }}>{lang === 'ar' ? 'الكمية' : 'Quantity'}</th>
                      <th style={{ padding: '0.8rem', textAlign: 'right' }}>{lang === 'ar' ? 'سعر الوحدة' : 'Unit Price'}</th>
                      <th style={{ padding: '0.8rem', textAlign: 'right' }}>{lang === 'ar' ? 'المورد' : 'Supplier'}</th>
                      <th style={{ padding: '0.8rem', textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ padding: '1rem' }}>
                           <div style={{ fontWeight: 'bold' }}>{lang === 'ar' ? item.nameAr : item.name}</div>
                           <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.sku}</div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>{item.quantity} {item.unit}</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                           {suppliers.find(s => s.id === item.supplierId)?.nameAr || suppliers.find(s => s.id === item.supplierId)?.name || '—'}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>{(item.quantity * item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>

               <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ width: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                       <span>{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                       <span>{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontWeight: 'bold', fontSize: '1.3rem', borderBottom: '3px double #333' }}>
                       <span>{lang === 'ar' ? 'الإجمالي الكلي:' : 'GRAND TOTAL:'}</span>
                       <span>{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
               </div>

               <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ textAlign: 'center', width: '200px' }}>
                    <div style={{ borderTop: '1px solid #333', paddingTop: '0.5rem' }}>{lang === 'ar' ? 'توقيع الموظف' : 'Employee Signature'}</div>
                  </div>
                  <div style={{ textAlign: 'center', width: '200px' }}>
                    <div style={{ borderTop: '1px solid #333', paddingTop: '0.5rem' }}>{lang === 'ar' ? 'اعتماد المدير' : 'Manager Approval'}</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .purchase-orders-module { color: #ffffff; }
        .card { background: var(--card-bg); border-radius: 12px; border: 1px solid var(--glass-border); overflow: hidden; }
        .card-header { padding: 1.5rem; border-bottom: 1px solid var(--glass-border); background: rgba(255,255,255,0.02); }
        .card-title { font-size: 1.25rem; font-weight: 700; display: flex; align-items: center; }
        .table-container { overflow-x: auto; }
        table th { background: rgba(255,255,255,0.03); color: #94a3b8; padding: 1rem; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
        table td { padding: 1rem; border-bottom: 1px solid var(--glass-border); font-size: 0.9rem; }
        .badge { background: rgba(99, 102, 241, 0.1); color: #818cf8; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
        .search-input { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; outline: none; transition: all 0.2s; }
        .search-input:focus { border-color: #6366f1; background: rgba(255,255,255,0.08); }
        .btn-secondary { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s; }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); }
        .btn-primary { background: #6366f1; color: white; border: none; padding: 0.5rem 1.2rem; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s; }
        .btn-primary:hover { background: #4f46e5; }
        .btn-primary:disabled { background: #475569; cursor: not-allowed; opacity: 0.7; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .modal-content { background: white; border-radius: 12px; color: #1e293b; overflow: hidden; display: flex; flex-direction: column; }
        .modal-header { padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; }
        
        .order-items-table th { background: #f1f5f9; color: #475569; border-bottom: 2px solid #e2e8f0; }
        .order-items-table td { border-bottom: 1px solid #f1f5f9; }
        .qty-input { width: 100%; padding: 0.4rem; border: 1px solid #cbd5e1; border-radius: 6px; text-align: center; }
        .remove-btn { background: none; border: none; cursor: pointer; font-size: 1.1rem; }
        
        @media print {
           .no-print { display: none !important; }
           .modal-overlay { position: absolute; background: white; }
           .modal-content { border: none; width: 100%; max-width: none; }
           .summary-overlay { background: white; }
           .summary-content { width: 100%; box-shadow: none; }
           .print-area { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function WarehouseStockList({ stocks, lang }: { stocks: any[], lang: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('all');

  const warehouses = Array.from(new Set((stocks || []).filter(s => s?.warehouse?.id).map(s => s?.warehouse?.id))).map(id => {
    return (stocks || []).find(s => s?.warehouse?.id === id)?.warehouse;
  }).filter(Boolean) || [];

  const filtered = (stocks || []).filter(s => {
    const searchTermLower = (searchTerm || '').toLowerCase();
    const product = s?.product || {};
    const matchesSearch = (product.name || '').toLowerCase().includes(searchTermLower) ||
                        (product.nameAr || '').toLowerCase().includes(searchTermLower) ||
                        (product.sku || '').toLowerCase().includes(searchTermLower);
    const matchesWarehouse = selectedWarehouseId === 'all' || s?.warehouse?.id === selectedWarehouseId;
    return matchesSearch && matchesWarehouse;
  });

  return (
    <div className="warehouse-stock-module">
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">{lang === 'ar' ? 'جرد المخزون حسب المستودع' : 'Stock Inventory by Warehouse'}</h2>
          <div className="filters no-print" style={{ display: 'flex', gap: '1rem' }}>
             <select 
               value={selectedWarehouseId} 
               onChange={e => setSelectedWarehouseId(e.target.value)}
               className="select-input"
               style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
             >
                <option value="all">{lang === 'ar' ? 'جميع المستودعات' : 'All Warehouses'}</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{lang === 'ar' && w.nameAr ? w.nameAr : w.name}</option>
                ))}
             </select>
             <input 
               type="text" 
               placeholder={lang === 'ar' ? "البحث عن صنف..." : "Search items..."}
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="search-input"
               style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
             />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{lang === 'ar' ? 'المستودع' : 'Warehouse'}</th>
                <th>{lang === 'ar' ? 'رقم الصنف' : 'SKU'}</th>
                <th>{lang === 'ar' ? 'الاسم' : 'Product Name'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الوحدة' : 'Unit'}</th>
                <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الكمية الحالية' : 'Current Stock'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td><span className="badge-side" style={{ fontSize: '0.75rem', background: '#f3f4f6' }}>{lang === 'ar' && s.warehouse.nameAr ? s.warehouse.nameAr : s.warehouse.name}</span></td>
                  <td><code>{s.product.sku}</code></td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{lang === 'ar' && s.product.nameAr ? s.product.nameAr : s.product.name}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>{s.product.unit}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    {s.quantity.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

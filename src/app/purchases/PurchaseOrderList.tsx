'use client';

import { useState } from 'react';

export default function PurchaseOrderList({
  orders,
  lang,
  onNewOrder,
  onEditOrder,
  onDeleteOrder
}: {
  orders: any[];
  lang: string;
  onNewOrder: () => void;
  onEditOrder: (order: any) => void;
  onDeleteOrder: (id: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.supplier?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
           <input 
             type="text" 
             placeholder={lang === 'ar' ? 'بحث برقم الطلب أو المورد...' : 'Search order no or supplier...'}
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '300px' }}
           />
        </div>
        <button className="btn-add" onClick={onNewOrder}>
          {lang === 'ar' ? '➕ طلب شراء جديد' : '➕ New Purchase Order'}
        </button>
      </div>

      <div className="table-container">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'رقم الطلب' : 'Order No'}</th>
              <th style={{ padding: '1rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'المورد' : 'Supplier'}</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th style={{ padding: '1rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{order.orderNumber}</td>
                <td style={{ padding: '1rem' }}>{lang === 'ar' ? order.supplier?.nameAr || order.supplier?.name : order.supplier?.name}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>{new Date(order.date).toLocaleDateString()}</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>{order.netAmount.toLocaleString()} SAR</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                   <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                   </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                   <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button onClick={() => onEditOrder(order)} className="action-btn edit">✏️</button>
                      <button onClick={() => { if(confirm(lang==='ar'?'هل أنت متأكد؟':'Are you sure?')) onDeleteOrder(order.id) }} className="action-btn delete">🗑️</button>
                   </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  {lang === 'ar' ? 'لا توجد طلبات شراء' : 'No purchase orders found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .btn-add { background: #059669; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .status-badge { padding: 4px 10px; border-radius: 20px; fontSize: 0.75rem; font-weight: bold; }
        .status-badge.pending { background: #fef3c7; color: #92400e; }
        .status-badge.ordered { background: #dcfce7; color: #15803d; }
        .status-badge.closed { background: #f1f5f9; color: #475569; }
        .status-badge.cancelled { background: #fee2e2; color: #991b1b; }
        
        .action-btn { background: none; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 8px; cursor: pointer; transition: all 0.2s; }
        .action-btn:hover { background: #f8fafc; }
        .action-btn.delete:hover { border-color: #ef4444; }
      `}</style>
    </div>
  );
}

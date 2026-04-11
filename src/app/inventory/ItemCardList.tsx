'use client';

import React, { useState, useEffect } from 'react';
import { getItemCard } from './actions';

export default function ItemCardList({ products, lang }: { products: any[], lang: string }) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProductId) {
      fetchLogs();
    } else {
      setLogs([]);
    }
  }, [selectedProductId]);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await getItemCard(selectedProductId);
    setLogs(data);
    setLoading(false);
  };

  const getStats = () => {
    let totalIn = 0;
    let totalOut = 0;
    logs.forEach(log => {
      if (log.changeType === 'IN' || log.changeType === 'ADJUST_UP' || log.changeType === 'PRODUCTION_IN') {
        totalIn += log.quantity;
      } else {
        totalOut += log.quantity;
      }
    });
    return { totalIn, totalOut, balance: totalIn - totalOut };
  };

  const stats = getStats();
  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="item-card-container">
      <div className="card filter-card">
        <div className="form-group" style={{ maxWidth: '400px' }}>
          <label>{lang === 'ar' ? 'اختر الصنف' : 'Select Item'}</label>
          <select 
            value={selectedProductId} 
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="form-control"
          >
            <option value="">{lang === 'ar' ? '--- اختر من القائمة ---' : '--- Select Item ---'}</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.nameAr || p.name} ({p.sku || 'N/A'})</option>
            ))}
          </select>
        </div>
      </div>

      {selectedProductId && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">{lang === 'ar' ? 'إجمالي الوارد' : 'Total In'}</span>
              <span className="stat-value text-success">+{stats.totalIn.toLocaleString()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">{lang === 'ar' ? 'إجمالي الصادر' : 'Total Out'}</span>
              <span className="stat-value text-danger">-{stats.totalOut.toLocaleString()}</span>
            </div>
            <div className="stat-card highlight">
              <span className="stat-label">{lang === 'ar' ? 'الرصيد الحالي' : 'Current Balance'}</span>
              <span className="stat-value">{stats.balance.toLocaleString()} {selectedProduct?.unitRef?.nameAr || selectedProduct?.unitRef?.name}</span>
            </div>
          </div>

          <div className="card table-card">
            <div className="table-header">
               <h3>{lang === 'ar' ? 'سجل الحركات التفصيلي' : 'Detailed Transaction History'}</h3>
               <button className="btn-secondary no-print" onClick={() => window.print()}>{lang === 'ar' ? 'طباعة' : 'Print'}</button>
            </div>
            
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
            ) : logs.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>{lang === 'ar' ? 'لا توجد حركات لهذا الصنف' : 'No movements found for this item'}</div>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                      <th>{lang === 'ar' ? 'نوع الحركة' : 'Type'}</th>
                      <th>{lang === 'ar' ? 'المستودع' : 'Warehouse'}</th>
                      <th>{lang === 'ar' ? 'الوارد' : 'In'}</th>
                      <th>{lang === 'ar' ? 'الصادر' : 'Out'}</th>
                      <th>{lang === 'ar' ? 'ملاحظات' : 'Reference'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => {
                      const isIn = log.changeType === 'IN' || log.changeType === 'ADJUST_UP' || log.changeType === 'PRODUCTION_IN';
                      return (
                        <tr key={log.id}>
                          <td style={{ fontSize: '0.85rem' }}>
                            {new Date(log.createdAt).toLocaleDateString()}
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(log.createdAt).toLocaleTimeString()}</div>
                          </td>
                          <td>
                            <span className={`badge ${isIn ? 'success' : 'danger'}`}>
                              {log.changeType}
                            </span>
                          </td>
                          <td>{log.warehouse?.nameAr || log.warehouse?.name || '---'}</td>
                          <td className="text-success">{isIn ? `+${log.quantity}` : ''}</td>
                          <td className="text-danger">{!isIn ? `-${log.quantity}` : ''}</td>
                          <td style={{ fontSize: '0.8rem' }}>{log.reference || '---'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        .item-card-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .filter-card { padding: 1.5rem; border: 1px solid var(--glass-border); background: var(--glass-bg); }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .stat-card.highlight { background: #1e293b; color: white; }
        .stat-card.highlight .stat-label { color: #94a3b8; }
        .stat-label { font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; }
        .stat-value { font-size: 1.8rem; font-weight: 700; }
        .table-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #e2e8f0; }
        .table-card { padding: 0; background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .badge { padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: bold; }
        .badge.success { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
        .badge.danger { background: rgba(239, 68, 68, 0.1); color: #dc2626; }
        .text-success { color: #16a34a; font-weight: 600; }
        .text-danger { color: #dc2626; font-weight: 600; }
      `}</style>
    </div>
  );
}

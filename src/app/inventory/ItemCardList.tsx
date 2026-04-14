'use client';

import React, { useState, useEffect } from 'react';
import { getItemCard } from './actions';
import SearchableSelect from '@/components/SearchableSelect';

export default function ItemCardList({ products, lang, initialProductId }: { products: any[], lang: string, initialProductId?: string | null }) {
  const [selectedProductId, setSelectedProductId] = useState(initialProductId || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    }
  }, [initialProductId]);

  useEffect(() => {
    if (selectedProductId) {
      fetchLogs();
    } else {
      setLogs([]);
    }
  }, [selectedProductId]);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await getItemCard(selectedProductId, startDate, endDate);
    setLogs(data);
    setLoading(false);
  };

  const getStats = () => {
    let balance = 0;
    logs.forEach(log => {
      balance += log.quantity || 0;
    });
    
    // We'll calculate In/Out separately just for the summary cards
    const totalIn = logs.filter(l => l.quantity > 0).reduce((sum, l) => sum + l.quantity, 0);
    const totalOut = logs.filter(l => l.quantity < 0).reduce((sum, l) => sum + Math.abs(l.quantity), 0);
    
    return { totalIn, totalOut, balance };
  };

  const stats = getStats();
  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="item-card-container">
      <div className="card filter-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', flex: 1 }}>
            <div className="form-group" style={{ flex: '1', minWidth: '300px' }}>
              <label>{lang === 'ar' ? 'اختر الصنف' : 'Select Item'}</label>
              <SearchableSelect 
                 options={products} 
                 value={selectedProductId} 
                 onChange={setSelectedProductId} 
                 lang={lang} 
                 placeholder={lang === 'ar' ? '--- ابحث واختر الصنف ---' : '--- Search & Select ---'} 
              />
            </div>
  
            <div className="form-group" style={{ width: '160px' }}>
              <label>{lang === 'ar' ? 'من تاريخ' : 'From Date'}</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="form-control" />
            </div>
  
            <div className="form-group" style={{ width: '160px' }}>
              <label>{lang === 'ar' ? 'إلى تاريخ' : 'To Date'}</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="form-control" />
            </div>
          </div>

          <button className="btn-primary" onClick={fetchLogs} style={{ height: '42px', padding: '0 1.5rem', background: '#1e293b' }}>
            {lang === 'ar' ? 'تصفية' : 'Filter'} 🔍
          </button>
        </div>
      </div>

      {/* Print-only period header */}
      {(startDate || endDate) && (
        <div className="print-only-info" style={{ display: 'none', textAlign: 'center', marginBottom: '1rem', fontStyle: 'italic', fontSize: '1.1rem' }}>
          {lang === 'ar' ? 'تقرير عن الفترة من: ' : 'Report Period: '} 
          {startDate || '...'} 
          {lang === 'ar' ? ' إلى: ' : ' To: '} 
          {endDate || '...'}
        </div>
      )}

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
              <div className="balance-main">
                <span className="stat-value">
                  {stats.balance.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 3 })}
                  <span className="unit-label">
                     {selectedProduct?.unitRef?.nameAr || selectedProduct?.unitRef?.name}
                  </span>
                </span>
              </div>
              
              {/* Added: Equivalent display for balances less than 1 unit */}
              {stats.balance > 0 && stats.balance < 1 && selectedProduct?.unitQuantity && selectedProduct?.subUnitRef && (
                <div className="equivalent-box">
                  <span className="eq-label">{lang === 'ar' ? 'ما يعادل:' : 'Equivalent to:'}</span>
                  <span className="eq-value">
                    {(stats.balance * selectedProduct.unitQuantity).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                    {' '}{selectedProduct.subUnitRef.nameAr || selectedProduct.subUnitRef.name}
                  </span>
                </div>
              )}
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
                      const isIn = log.quantity > 0;
                      const absQty = Math.abs(log.quantity);
                      const baseUnitName = selectedProduct?.unitRef?.nameAr || selectedProduct?.unitRef?.name || '';
                      
                      const typeMap: any = {
                        'Production Output': lang === 'ar' ? 'إنتاج تام' : 'Production Output',
                        'Production Usage': lang === 'ar' ? 'استهلاك خامات' : 'Production Usage',
                        'Issue': lang === 'ar' ? 'صرف' : 'Issue',
                        'Receipt': lang === 'ar' ? 'استلام' : 'Receipt',
                        'Initial': lang === 'ar' ? 'رصيد أول' : 'Initial',
                        'Adjustment': lang === 'ar' ? 'تسوية' : 'Adjustment',
                        'Disposal': lang === 'ar' ? 'إتلاف صنف' : 'Disposal'
                      };

                      // Calculate exact sub-unit equivalent if decimal exists and sub-unit exists
                      let subtitleEquivalent = '';
                      if (absQty % 1 !== 0 && selectedProduct?.unitQuantity && selectedProduct?.subUnitRef) {
                         const subQty = absQty * selectedProduct.unitQuantity;
                         subtitleEquivalent = `( ${lang === 'ar' ? 'يعادل' : 'eq.'} ${subQty.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${selectedProduct.subUnitRef.nameAr || selectedProduct.subUnitRef.name} )`;
                      }

                      return (
                        <tr key={log.id}>
                          <td className="date-cell">
                            {new Date(log.date || log.createdAt).toLocaleDateString()}
                            <div className="time-sub">{new Date(log.date || log.createdAt).toLocaleTimeString()}</div>
                          </td>
                          <td>
                            <span className={`txn-badge ${isIn ? 'txn-success' : 'txn-danger'}`}>
                              {typeMap[log.type] || log.type}
                            </span>
                          </td>
                          <td className="warehouse-cell">{log.warehouse?.nameAr || log.warehouse?.name || '---'}</td>
                          <td className="qty-in-cell">
                            {isIn ? `+${absQty.toLocaleString()} ${baseUnitName}` : ''}
                            {isIn && subtitleEquivalent && <div className="sub-qty-info">{subtitleEquivalent}</div>}
                          </td>
                          <td className="qty-out-cell">
                            {!isIn ? `-${absQty.toLocaleString()} ${baseUnitName}` : ''}
                            {!isIn && subtitleEquivalent && <div className="sub-qty-info">{subtitleEquivalent}</div>}
                          </td>
                          <td className="ref-cell-info">
                            <div className="ref-id-val">{log.referenceId || '---'}</div>
                            <div className="ref-desc-val">{log.description || ''}</div>
                          </td>
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
        .item-card-container { display: flex; flex-direction: column; gap: 1.5rem; color: #1e293b; }
        .filter-card { padding: 1.5rem; border: 1px solid var(--glass-border); background: var(--glass-bg); }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        
        .stat-card { 
          background: white; 
          padding: 1.5rem; 
          border-radius: 12px; 
          border: 1px solid #e2e8f0; 
          display: flex; 
          flex-direction: column; 
          gap: 0.5rem; 
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
          color: #1e293b;
        }
        
        .stat-card.highlight { 
          background: #1e293b; 
          color: #ffffff; 
          border: none;
        }
        
        .stat-card.highlight .stat-label { color: #94a3b8; }
        .stat-label { font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.025em; }
        .stat-value { font-size: 1.8rem; font-weight: 700; display: flex; align-items: baseline; gap: 0.5rem; }
        
        .unit-label { font-size: 0.9rem; color: #94a3b8; font-weight: 500; }
        .stat-card.highlight .unit-label { color: #64748b; }

        .equivalent-box {
          margin-top: 0.25rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          gap: 0.5rem;
          font-size: 0.85rem;
        }
        .eq-label { color: #94a3b8; }
        .eq-value { font-weight: 600; color: #fbbf24; }

        .table-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #e2e8f0; }
        .table-card { padding: 0; background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        
        table { width: 100%; border-collapse: collapse; }
        th { background: #f8fafc; padding: 1rem; text-align: ${lang === 'ar' ? 'right' : 'left'}; font-size: 0.85rem; font-weight: 700; color: #0f172a; border-bottom: 2px solid #e2e8f0; }
        td { padding: 1rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; color: #0f172a !important; }
        
        .date-cell { font-size: 0.9rem; font-weight: 500; color: #0f172a !important; }
        .time-sub { font-size: 0.75rem; color: #475569; margin-top: 2px; }
        
        .txn-badge { 
          padding: 6px 12px; 
          border-radius: 20px; 
          font-size: 0.75rem; 
          font-weight: 700; 
          display: inline-block;
          text-align: center;
          min-width: 90px;
          position: static; /* Overriding potential global absolute badge */
        }
        .txn-success { background: #dcfce7 !important; color: #166534 !important; border: 1px solid #bbf7d0; }
        .txn-danger { background: #fee2e2 !important; color: #991b1b !important; border: 1px solid #fecaca; }
        
        .warehouse-cell { font-weight: 600; color: #1e293b !important; }
        
        .qty-in-cell { color: #15803d !important; font-weight: 700; font-size: 1.05rem; }
        .qty-out-cell { color: #b91c1c !important; font-weight: 700; font-size: 1.05rem; }
        .sub-qty-info { font-size: 0.75rem; font-weight: 500; color: #4b5563; margin-top: 4px; font-style: italic; }
        
        .ref-cell-info { max-width: 250px; }
        .ref-id-val { font-weight: 700; color: #0f172a !important; font-size: 0.9rem; }
        .ref-desc-val { font-size: 0.8rem; color: #475569; margin-top: 4px; line-height: 1.4; }

        @media print {
          .no-print { display: none !important; }
          .filter-card { display: none !important; }
          .print-only-info { display: block !important; }
          .item-card-container { gap: 0; padding: 0; }
          .card { border: none; box-shadow: none; }
          .stats-grid { grid-template-columns: repeat(3, 1fr); margin-bottom: 2rem; border-bottom: 2px solid #000; padding-bottom: 1rem; }
          .stat-card { border: none !important; padding: 0.5rem !important; }
          .stat-card.highlight { color: black !important; background: white !important; border: 1px solid #ccc !important; }
          .table-header h3 { font-size: 1.5rem; text-align: center; width: 100%; border-bottom: 1px solid #000; padding-bottom: 10px; }
          th, td { border: 1px solid #000 !important; padding: 8px !important; color: black !important; background: white !important; }
          .txn-badge { border: 1px solid #000 !important; background: transparent !important; color: black !important; }
        }
      `}</style>
    </div>
  );
}

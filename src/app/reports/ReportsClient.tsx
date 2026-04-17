'use client';

import React, { useState, useEffect } from 'react';
import { getSalesReport, getPurchaseReport, getReturnsReport } from './actions';

type ReportItem = { name: string; nameAr: string | null; balance: number };
type ReportPL = { revenue: ReportItem[]; expenses: ReportItem[]; totalRevenue: number; totalExpenses: number; netIncome: number };
type ReportBS = { assets: ReportItem[]; liabilities: ReportItem[]; equity: ReportItem[]; totalAssets: number; totalLiabilities: number; totalEquity: number };

export default function ReportsClient({ 
  balances, 
  profitLoss, 
  balanceSheet, 
  dict, 
  lang,
  defaultTab = 'trial'
}: { 
  balances: any[], 
  profitLoss: ReportPL, 
  balanceSheet: ReportBS, 
  dict: any, 
  lang: string,
  defaultTab?: string
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [purchasesData, setPurchasesData] = useState<any[]>([]);
  const [returnsData, setReturnsData] = useState<{sales: any[], purchases: any[]}>({sales: [], purchases: []});
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return '$ ' + amount.toLocaleString(undefined, { minimumFractionDigits: 2 });
  };

  const getLocalizedName = (item: any) => lang === 'ar' && item.nameAr ? item.nameAr : item.name;

  const handleFetchReport = async () => {
    setLoading(true);
    if (activeTab === 'sales') {
      const res = await getSalesReport(startDate, endDate);
      if (res.success) setSalesData(res.data || []);
    } else if (activeTab === 'purchases') {
      const res = await getPurchaseReport(startDate, endDate);
      if (res.success) setPurchasesData(res.data || []);
    } else if (activeTab === 'returns') {
      const res = await getReturnsReport(startDate, endDate);
      if (res.success) setReturnsData({ sales: res.salesReturns || [], purchases: res.purchaseReturns || [] });
    }
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-module">
      <div className="page-header no-print" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">{dict.title}</h1>
        <p className="page-subtitle">{dict.subtitle}</p>
      </div>

      <div className="tabs-container no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
        {['trial', 'pl', 'bs', 'sales', 'purchases', 'returns'].map((tab) => (
          <button 
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '0.75rem 1.25rem', 
              background: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s',
              fontSize: '0.9rem'
            }}
          >
            {tab === 'trial' ? dict.trialBalance : 
             tab === 'pl' ? dict.profitLoss : 
             tab === 'bs' ? dict.balanceSheet : 
             tab === 'sales' ? (lang === 'ar' ? 'تقرير المبيعات' : 'Sales Report') :
             tab === 'purchases' ? (lang === 'ar' ? 'تقرير المشتريات' : 'Purchases Report') :
             (lang === 'ar' ? 'تقرير المرتجعات' : 'Returns Report')}
          </button>
        ))}
      </div>

      {(activeTab === 'sales' || activeTab === 'purchases' || activeTab === 'returns') && (
        <div className="filter-bar card no-print animate-in" style={{ marginBottom: '2rem', padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'من تاريخ' : 'From Date'}</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.6rem', color: 'white' }} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'إلى تاريخ' : 'To Date'}</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.6rem', color: 'white' }} />
          </div>
          <button onClick={handleFetchReport} disabled={loading} className="btn-primary" style={{ height: '42px', padding: '0 2rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}>
            {loading ? (lang === 'ar' ? 'جاري التحميل...' : 'Loading...') : (lang === 'ar' ? 'عرض التقرير' : 'View Report')}
          </button>
          <button onClick={handlePrint} className="btn-secondary" style={{ height: '42px', padding: '0 1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}>
            {lang === 'ar' ? 'طباعة التقرير' : 'Print Report'}
          </button>
        </div>
      )}

      {activeTab === 'trial' && (
        <div className="card animate-in">
          <div className="card-header no-print">
            <h2 className="card-title">{dict.trialBalance}</h2>
            <button onClick={handlePrint} className="btn-secondary" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white', fontSize: '0.8rem' }}>
              {lang === 'ar' ? 'طباعة' : 'Print'}
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{dict.code}</th>
                  <th>{dict.account}</th>
                  <th style={{ textAlign: 'right' }}>{dict.debit}</th>
                  <th style={{ textAlign: 'right' }}>{dict.credit}</th>
                </tr>
              </thead>
              <tbody>
                {(balances || []).map(acc => (
                  <tr key={acc.id}>
                    <td className="text-sub" style={{ fontWeight: '600' }}>{acc.code}</td>
                    <td>{getLocalizedName(acc)}</td>
                    <td style={{ textAlign: 'right' }}>{acc.totalDebit > 0 ? formatCurrency(acc.totalDebit) : '-'}</td>
                    <td style={{ textAlign: 'right' }}>{acc.totalCredit > 0 ? formatCurrency(acc.totalCredit) : '-'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: 'bold', background: 'var(--glass-bg)' }}>
                  <td colSpan={2} style={{ textAlign: 'right' }}>{dict.total}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(balances.reduce((s, a) => s + a.totalDebit, 0))}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(balances.reduce((s, a) => s + a.totalCredit, 0))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pl' && (
        <div className="card animate-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-header no-print" style={{ textAlign: 'center', flexDirection: 'column' }}>
            <h2 className="card-title">{dict.profitLoss}</h2>
            <button onClick={handlePrint} className="btn-secondary" style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white', fontSize: '0.8rem' }}>
              {lang === 'ar' ? 'طباعة' : 'Print'}
            </button>
          </div>
          
          <div className="report-section" style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--accent-primary)', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{dict.revenue}</h3>
            {(profitLoss?.revenue || []).map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                <span>{getLocalizedName(item)}</span>
                <span style={{ fontWeight: '500' }}>{formatCurrency(item.balance || 0)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontWeight: 'bold' }}>
              <span>{dict.total} {dict.revenue}</span>
              <span>{formatCurrency(profitLoss?.totalRevenue || 0)}</span>
            </div>

            <h3 style={{ color: 'var(--accent-danger)', borderBottom: '2px solid var(--accent-danger)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2.5rem' }}>{dict.expenses}</h3>
            {(profitLoss?.expenses || []).map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                <span>{getLocalizedName(item)}</span>
                <span style={{ fontWeight: '500' }}>{formatCurrency(item.balance)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontWeight: 'bold' }}>
              <span>{dict.total} {dict.expenses}</span>
              <span>{formatCurrency(profitLoss.totalExpenses)}</span>
            </div>

            <div style={{ 
              marginTop: '3rem', 
              padding: '1.5rem', 
              background: profitLoss.netIncome >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)', 
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: `1px solid ${profitLoss.netIncome >= 0 ? '#4CAF50' : '#F44336'}`
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{dict.netIncome}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: profitLoss.netIncome >= 0 ? '#2E7D32' : '#C62828' }}>
                {formatCurrency(profitLoss.netIncome)}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bs' && (
        <div className="card animate-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-header no-print" style={{ textAlign: 'center', flexDirection: 'column' }}>
            <h2 className="card-title">{dict.balanceSheet}</h2>
            <button onClick={handlePrint} className="btn-secondary" style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white', fontSize: '0.8rem' }}>
              {lang === 'ar' ? 'طباعة' : 'Print'}
            </button>
          </div>

          <div className="report-section" style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--accent-primary)', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{dict.assets}</h3>
            {(balanceSheet?.assets || []).map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                <span>{getLocalizedName(item)}</span>
                <span>{formatCurrency(item.balance || 0)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontWeight: 'bold', background: 'var(--glass-bg)', borderRadius: '4px', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <span>{dict.total} {dict.assets}</span>
              <span>{formatCurrency(balanceSheet.totalAssets)}</span>
            </div>

            <h3 style={{ color: 'var(--accent-secondary)', borderBottom: '2px solid var(--accent-secondary)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2.5rem' }}>{dict.liabilities}</h3>
            {(balanceSheet?.liabilities || []).map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                <span>{getLocalizedName(item)}</span>
                <span>{formatCurrency(item.balance || 0)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontWeight: 'bold', background: 'var(--glass-bg)', borderRadius: '4px', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <span>{dict.total} {dict.liabilities}</span>
              <span>{formatCurrency(balanceSheet.totalLiabilities)}</span>
            </div>

            <h3 style={{ color: 'var(--accent-tertiary)', borderBottom: '2px solid var(--accent-tertiary)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2.5rem' }}>{dict.equity}</h3>
            {balanceSheet.equity.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                <span style={{ fontStyle: (item.name || '').includes('Net Income') ? 'italic' : 'normal' }}>{getLocalizedName(item)}</span>
                <span>{formatCurrency(item.balance)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontWeight: 'bold', background: 'var(--glass-bg)', borderRadius: '4px', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <span>{dict.total} {dict.equity}</span>
              <span>{formatCurrency(balanceSheet.totalEquity)}</span>
            </div>

            <div style={{ 
              marginTop: '3rem', 
              padding: '1rem', 
              background: 'var(--glass-bg)', 
              borderRadius: '8px', 
              textAlign: 'center',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              border: '1px dashed var(--glass-border)'
            }}>
              {dict.assets} ({formatCurrency(balanceSheet.totalAssets)}) = 
              {dict.liabilities} + {dict.equity} ({formatCurrency(balanceSheet.totalLiabilities + balanceSheet.totalEquity)})
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="card animate-in">
          <div className="card-header">
            <h2 className="card-title">{lang === 'ar' ? 'تقرير المبيعات التفصيلي' : 'Detailed Sales Report'}</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'رقم الفاتورة' : 'Invoice No.'}</th>
                  <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th>{lang === 'ar' ? 'اسم العميل' : 'Customer'}</th>
                  <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                </tr>
              </thead>
              <tbody>
                {salesData.length > 0 ? salesData.map(inv => (
                  <tr key={inv.id}>
                    <td>{inv.invoiceNumber}</td>
                    <td>{new Date(inv.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</td>
                    <td>{lang === 'ar' ? inv.customer?.nameAr || inv.customer?.name : inv.customer?.name}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(inv.netAmount)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لا توجد بيانات للفترة المحددة' : 'No data for specified period'}</td></tr>
                )}
              </tbody>
              {salesData.length > 0 && (
                <tfoot>
                  <tr style={{ fontWeight: 'bold', background: 'var(--glass-bg)' }}>
                    <td colSpan={3} style={{ textAlign: 'right' }}>{dict.total}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(salesData.reduce((s, a) => s + a.netAmount, 0))}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {activeTab === 'purchases' && (
        <div className="card animate-in">
          <div className="card-header">
            <h2 className="card-title">{lang === 'ar' ? 'تقرير المشتريات التفصيلي' : 'Detailed Purchases Report'}</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'رقم الفاتورة' : 'Invoice No.'}</th>
                  <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th>{lang === 'ar' ? 'اسم المورد' : 'Supplier'}</th>
                  <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                </tr>
              </thead>
              <tbody>
                {purchasesData.length > 0 ? purchasesData.map(inv => (
                  <tr key={inv.id}>
                    <td>{inv.invoiceNumber}</td>
                    <td>{new Date(inv.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</td>
                    <td>{lang === 'ar' ? inv.supplier?.nameAr || inv.supplier?.name : inv.supplier?.name}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(inv.netAmount)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لا توجد بيانات للفترة المحددة' : 'No data for specified period'}</td></tr>
                )}
              </tbody>
              {purchasesData.length > 0 && (
                <tfoot>
                  <tr style={{ fontWeight: 'bold', background: 'var(--glass-bg)' }}>
                    <td colSpan={3} style={{ textAlign: 'right' }}>{dict.total}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(purchasesData.reduce((s, a) => s + a.netAmount, 0))}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {activeTab === 'returns' && (
        <div className="animate-in">
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <h2 className="card-title">{lang === 'ar' ? 'مرتجعات المبيعات' : 'Sales Returns'}</h2>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>{lang === 'ar' ? 'رقم الفاتورة' : 'Invoice No.'}</th>
                    <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                    <th>{lang === 'ar' ? 'اسم العميل' : 'Customer'}</th>
                    <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                  </tr>
                </thead>
                <tbody>
                  {returnsData.sales.length > 0 ? returnsData.sales.map(inv => (
                    <tr key={inv.id}>
                      <td>{inv.invoiceNumber}</td>
                      <td>{new Date(inv.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</td>
                      <td>{lang === 'ar' ? inv.customer?.nameAr || inv.customer?.name : inv.customer?.name}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(inv.netAmount)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لا توجد مرتجعات مبيعات' : 'No sales returns found'}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{lang === 'ar' ? 'مرتجعات المشتريات' : 'Purchase Returns'}</h2>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>{lang === 'ar' ? 'رقم الفاتورة' : 'Invoice No.'}</th>
                    <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                    <th>{lang === 'ar' ? 'اسم المورد' : 'Supplier'}</th>
                    <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                  </tr>
                </thead>
                <tbody>
                  {returnsData.purchases.length > 0 ? returnsData.purchases.map(inv => (
                    <tr key={inv.id}>
                      <td>{inv.invoiceNumber}</td>
                      <td>{new Date(inv.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</td>
                      <td>{lang === 'ar' ? inv.supplier?.nameAr || inv.supplier?.name : inv.supplier?.name}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(inv.netAmount)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لا توجد مرتجعات مشتريات' : 'No purchase returns found'}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .reports-module { color: inherit; }
        .page-title { color: var(--text-primary) !important; }
        .page-subtitle { color: var(--text-secondary) !important; }
        .card { background: rgba(15, 23, 42, 0.4) !important; color: inherit !important; backdrop-filter: blur(12px); border: 1px solid var(--glass-border); }
        .card-title { color: var(--text-primary) !important; font-weight: 700 !important; }
        .table-container th { color: var(--text-secondary) !important; background: rgba(255, 255, 255, 0.05); border-bottom: 1px solid var(--glass-border); text-align: right; }
        .table-container td { color: inherit !important; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .report-section h3 { font-weight: 700 !important; }
        .report-section span { color: inherit !important; }
        
        @media print {
          .reports-module { background: white !important; color: black !important; padding: 0 !important; }
          .card { background: white !important; color: black !important; border: 1px solid #000 !important; box-shadow: none !important; }
          .card-title, .report-section h3, .report-section span, .table-container th, .table-container td { color: black !important; }
          .tab-btn, .no-print { display: none !important; }
          .table-container th, .table-container td { border: 1px solid #000 !important; }
        }
      `}</style>
    </div>
  );
}

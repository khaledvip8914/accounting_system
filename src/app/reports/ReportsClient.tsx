'use client';

import React, { useState } from 'react';

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
  const [activeTab, setActiveTab] = useState(defaultTab); // 'trial', 'pl', 'bs'

  const formatCurrency = (amount: number) => {
    return '$ ' + amount.toLocaleString(undefined, { minimumFractionDigits: 2 });
  };

  const getLocalizedName = (item: any) => lang === 'ar' && item.nameAr ? item.nameAr : item.name;

  return (
    <div className="reports-module">
      <div className="page-header no-print" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">{dict.title}</h1>
        <p className="page-subtitle">{dict.subtitle}</p>
      </div>

      <div className="tabs-container" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
        <button 
          className={`tab-btn ${activeTab === 'trial' ? 'active' : ''}`} 
          onClick={() => setActiveTab('trial')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: activeTab === 'trial' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'trial' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          {dict.trialBalance}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'pl' ? 'active' : ''}`} 
          onClick={() => setActiveTab('pl')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: activeTab === 'pl' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'pl' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          {dict.profitLoss}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'bs' ? 'active' : ''}`} 
          onClick={() => setActiveTab('bs')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: activeTab === 'bs' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'bs' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          {dict.balanceSheet}
        </button>
      </div>

      {activeTab === 'trial' && (
        <div className="card animate-in">
          <div className="card-header no-print">
            <h2 className="card-title">{dict.trialBalance}</h2>
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
          </div>


          <div className="report-section" style={{ padding: '1.5rem' }}>
            {/* Assets */}
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

            {/* Liabilities */}
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

            {/* Equity */}
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

            {/* Check */}
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

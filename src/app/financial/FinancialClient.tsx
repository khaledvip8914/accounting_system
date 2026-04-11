'use client';

import { useState, useMemo, useEffect } from 'react';
import LedgerClient from '../ledger/LedgerClient';
import AccountsClient from '../accounts/AccountsClient';
import ReportsClient from '../reports/ReportsClient';
import LedgerReport from './LedgerReport';
import VouchersClient from './VouchersClient';
import OpeningBalancesClient from './OpeningBalancesClient';
import { Lang, getDictionary } from '@/lib/i18n';

export default function FinancialClient({ 
  lang, 
  initialLedgerData, 
  initialAccountsData, 
  initialReportsData,
  accountsForLedger,
  initialTransactionVouchers,
  companyProfile
}: { 
  lang: string, 
  initialLedgerData: any,
  initialAccountsData: any,
  initialReportsData: any,
  accountsForLedger: any[],
  initialTransactionVouchers: any[],
  companyProfile: any
}) {
  const [activeTab, setActiveTab] = useState('journal');
  const [tempStartDate, setTempStartDate] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
  const [tempEndDate, setTempEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState(tempStartDate);
  const [endDate, setEndDate] = useState(tempEndDate);
  const [selectedLedgerAccountId, setSelectedLedgerAccountId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const accId = params.get('accountId');
    if (tab) {
      setActiveTab(tab);
    }
    if (accId) {
      setSelectedLedgerAccountId(accId);
    }
  }, []);
  const dict = getDictionary(lang);

  const applyFilters = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };

  const tabs = [
    { id: 'journal', label: dict.financial.journalEntries, icon: '📖' },
    { id: 'accounts', label: dict.financial.accounts, icon: '📋' },
    { id: 'opening_balances', label: lang === 'ar' ? 'أرصدة افتتاحية' : 'Opening Balances', icon: '⚖️' },
    { id: 'reports', label: lang === 'ar' ? 'التقارير المالية' : 'Financial Reports', icon: '📊' },
    { id: 'ledger', label: dict.financial.generalLedger, icon: '📇' },
    { id: 'receipt_vouchers', label: lang === 'ar' ? 'سندات القبض' : 'Receipt Vouchers', icon: '📥' },
    { id: 'payment_vouchers', label: lang === 'ar' ? 'سندات الصرف' : 'Payment Vouchers', icon: '📤' },
  ];

  // Global filtered data based on date range
  const filteredVouchers = useMemo(() => {
    return (initialLedgerData || []).filter((v: any) => {
      const d = new Date(v.date).toISOString().split('T')[0];
      return d >= startDate && d <= endDate;
    });
  }, [initialLedgerData, startDate, endDate]);

  // Re-calculate Trial Balance based on date range
  const filteredTrialBalance = useMemo(() => {
    const accountBalances: Record<string, { debit: number, credit: number }> = {};
    
    filteredVouchers.forEach((v: any) => {
      v.entries.forEach((e: any) => {
        if (!accountBalances[e.accountId]) accountBalances[e.accountId] = { debit: 0, credit: 0 };
        accountBalances[e.accountId].debit += e.debit;
        accountBalances[e.accountId].credit += e.credit;
      });
    });

    return (initialReportsData?.trialBalance || []).map((acc: any) => {
      const b = accountBalances[acc.id] || { debit: 0, credit: 0 };
      let balance = 0;
      if (['Asset', 'Expense'].includes(acc?.type)) {
        balance = b.debit - b.credit;
      } else {
        balance = b.credit - b.debit;
      }
      return {
        ...acc,
        totalDebit: b.debit,
        totalCredit: b.credit,
        balance: balance
      };
    });
  }, [initialReportsData.trialBalance, filteredVouchers]);

  // Re-calculate Profit & Loss
  const filteredPL = useMemo(() => {
    const report = {
      revenue: [] as any[],
      expenses: [] as any[],
      totalRevenue: 0,
      totalExpenses: 0,
      netIncome: 0
    };

    filteredTrialBalance.forEach((acc: any) => {
      if (acc.type === 'Revenue') {
        report.revenue.push({ name: acc.name, nameAr: acc.nameAr, balance: acc.balance });
        report.totalRevenue += acc.balance;
      } else if (acc.type === 'Expense') {
        report.expenses.push({ name: acc.name, nameAr: acc.nameAr, balance: acc.balance });
        report.totalExpenses += acc.balance;
      }
    });
    report.netIncome = report.totalRevenue - report.totalExpenses;
    return report;
  }, [filteredTrialBalance]);

  const handleExportExcel = () => {
    let csvContent = "\uFEFF"; 
    let filename = `Report_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;

    const wrap = (val: any) => `"${(val || '').toString().replace(/"/g, '""')}"`;

    if (activeTab === 'journal') {
      csvContent += `${wrap('Date')},${wrap('Reference')},${wrap('Description')},${wrap('Total Debit')},${wrap('Total Credit')},${wrap('Status')}\n`;
      filteredVouchers.forEach((v: any) => {
        const totalDebit = v.entries.reduce((sum: number, e: any) => sum + e.debit, 0);
        const totalCredit = v.entries.reduce((sum: number, e: any) => sum + e.credit, 0);
        csvContent += `${wrap(new Date(v.date).toLocaleDateString())},${wrap(v.reference)},${wrap(v.description)},${wrap(totalDebit)},${wrap(totalCredit)},${wrap(v.status)}\n`;
      });
    } else if (activeTab === 'accounts') {
      csvContent += `${wrap('Code')},${wrap('Name')},${wrap('Type')},${wrap('Transactions')}\n`;
      const flatten = (items: any[]) => {
        items.forEach(item => {
          csvContent += `${wrap(item.code)},${wrap(item.name || '')},${wrap(item.type)},${wrap(item.balance)}\n`;
          if (item.children) flatten(item.children);
        });
      };
      flatten(initialAccountsData);
    } else if (activeTab === 'trial') {
      csvContent += `${wrap('Code')},${wrap('Account')},${wrap('Debit')},${wrap('Credit')},${wrap('Balance')}\n`;
      filteredTrialBalance.forEach((acc: any) => {
        csvContent += `${wrap(acc.code)},${wrap(acc.name)},${wrap(acc.totalDebit)},${wrap(acc.totalCredit)},${wrap(acc.balance)}\n`;
      });
    } else if (activeTab === 'income') {
        csvContent += `${wrap('Type')},${wrap('Account')},${wrap('Amount')}\n`;
        filteredPL.revenue.forEach(r => csvContent += `${wrap('Revenue')},${wrap(r.name)},${wrap(r.balance)}\n`);
        filteredPL.expenses.forEach(e => csvContent += `${wrap('Expense')},${wrap(e.name)},${wrap(e.balance)}\n`);
        csvContent += `${wrap('Total Revenue')},,${wrap(filteredPL.totalRevenue)}\n`;
        csvContent += `${wrap('Total Expenses')},,${wrap(filteredPL.totalExpenses)}\n`;
        csvContent += `${wrap('Net Income')},,${wrap(filteredPL.netIncome)}\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    
    // Small delay to ensure browser captures the download before cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="financial-module">
      {/* Print-only Report Header */}
      <div className="print-report-header" style={{ display: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '2px solid #333', paddingBottom: '1.5rem' }}>
          {companyProfile?.logo && (
            <img src={companyProfile.logo} alt="Logo" style={{ height: '100px', objectFit: 'contain', marginBottom: '1.5rem' }} />
          )}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '28px', margin: '0', color: '#1a1a1a', fontWeight: '800' }}>
              {lang === 'ar' ? companyProfile?.nameAr : companyProfile?.name}
            </h1>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '8px', fontSize: '13px', color: '#444' }}>
              {companyProfile?.taxNumber && (
                <span>{lang === 'ar' ? 'الرقم الضريبي:' : 'Tax No:'} {companyProfile.taxNumber}</span>
              )}
              {companyProfile?.email && <span>{companyProfile.email}</span>}
              {companyProfile?.phone && <span>{companyProfile.phone}</span>}
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', textAlign: 'center', width: '100%' }}>
            <h2 style={{ fontSize: '22px', color: '#000000', margin: '0 0 10px', paddingBottom: '5px', borderBottom: '2px solid #000', display: 'inline-block', fontWeight: '800' }}>
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <div style={{ fontSize: '14px', color: '#000000', fontWeight: '700' }}>
              {lang === 'ar' ? `الفترة من ${new Date(startDate).toLocaleDateString('ar-EG')} إلى ${new Date(endDate).toLocaleDateString('ar-EG')}` 
                             : `Period from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`}
            </div>
          </div>
        </div>
      </div>

      <div className="financial-header no-print">
        <div className="header-left">
          <div className="tabs-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="header-right">
          <div className="date-filters">
            <div className="date-input-group">
              <label>{lang === 'ar' ? 'من' : 'From'}</label>
              <input type="date" value={tempStartDate} onChange={e => setTempStartDate(e.target.value)} />
            </div>
            <div className="date-input-group">
              <label>{lang === 'ar' ? 'إلى' : 'To'}</label>
              <input type="date" value={tempEndDate} onChange={e => setTempEndDate(e.target.value)} />
            </div>
            <button className="btn-filter" onClick={applyFilters}>
              {lang === 'ar' ? 'فلترة' : 'Filter'} 🔍
            </button>
          </div>

          <div className="header-actions">
            <button className="btn-export pdf" onClick={() => window.print()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              PDF
            </button>
            <button className="btn-export excel" onClick={handleExportExcel}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              Excel
            </button>
          </div>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'journal' && (
          <LedgerClient 
            vouchers={filteredVouchers} 
            accounts={accountsForLedger} 
            lang={lang} 
            dict={dict.ledger}
            financialDict={dict.financial}
          />
        )}
        {activeTab === 'accounts' && (
          <AccountsClient 
            initialAccounts={initialAccountsData} 
            lang={lang} 
            dict={dict.accounts}
          />
        )}
        {activeTab === 'reports' && (
          <ReportsClient 
            key={`fin-reports-${startDate}-${endDate}`}
            balances={filteredTrialBalance}
            profitLoss={filteredPL} 
            balanceSheet={initialReportsData.balanceSheet}
            lang={lang} 
            dict={dict.reports}
            defaultTab="trial"
          />
        )}
        {(activeTab === 'receipt_vouchers' || activeTab === 'payment_vouchers') && (
          <VouchersClient 
            key={activeTab}
            type={activeTab === 'receipt_vouchers' ? 'RECEIPT' : 'PAYMENT'}
            initialVouchers={initialTransactionVouchers.filter(v => v.type === (activeTab === 'receipt_vouchers' ? 'RECEIPT' : 'PAYMENT'))}
            accounts={accountsForLedger}
            lang={lang}
            dict={dict}
          />
        )}
        {activeTab === 'opening_balances' && (
          <OpeningBalancesClient lang={lang} accounts={accountsForLedger} />
        )}
        {activeTab === 'ledger' && (
          <div className="ledger-container">
             <div className="account-selector no-print" style={{ 
               marginBottom: '1.5rem', 
               display: 'flex', 
               alignItems: 'center', 
               gap: '1rem', 
               background: '#f8fafc', 
               padding: '1rem', 
               borderRadius: '12px', 
               border: '1px solid #e2e8f0',
               position: 'relative',
               zIndex: 20, /* Higher than tab content but lower than header maybe? Header is 10 */
               overflow: 'visible'
             }}>
                <span style={{ fontWeight: '600', color: '#64748b' }}>
                  {lang === 'ar' ? 'اختر الحساب:' : 'Select Account:'}
                </span>
                <div style={{ minWidth: '300px', position: 'relative' }}>
                  <AccountSelectorInternal 
                    accounts={accountsForLedger} 
                    selectedId={selectedLedgerAccountId} 
                    onSelect={setSelectedLedgerAccountId} 
                    lang={lang} 
                    dict={dict.ledger}
                  />
                </div>
                {selectedLedgerAccountId && (
                  <button onClick={() => setSelectedLedgerAccountId('')} className="btn-secondary" style={{ padding: '0.4rem 1rem' }}>
                    {lang === 'ar' ? 'إعادة تعيين' : 'Reset'}
                  </button>
                )}
             </div>

             <LedgerReport 
                selectedAccount={accountsForLedger.find(a => a.id === selectedLedgerAccountId) || null}
                vouchers={initialLedgerData}
                startDate={startDate}
                endDate={endDate}
                dict={dict.reports}
                lang={lang}
             />
          </div>
        )}
      </div>

      <style jsx>{`
        .financial-module { color: inherit; }
        .financial-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(15, 23, 42, 0.4);
          padding: 0.5rem 1.5rem;
          border-bottom: 1px solid var(--glass-border);
          margin: -1.5rem -1.5rem 1.5rem -1.5rem;
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(12px);
        }
        .header-left {
          display: flex;
          align-items: center;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .date-filters {
          display: flex;
          gap: 1rem;
          align-items: center;
          background: var(--glass-bg);
          padding: 0.4rem 0.8rem;
          border-radius: 0.6rem;
          border: 1px solid var(--glass-border);
        }
        .date-input-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 600;
        }
        .date-input-group input {
          border: 1px solid var(--glass-border);
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 0.8rem;
          outline: none;
          color: var(--text-primary);
          background: var(--glass-bg);
        }
        .tabs-container {
          display: flex;
          gap: 1.5rem;
        }
        .tab-item {
          padding: 1rem 0;
          border: none;
          background: none;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          transition: all 0.2s;
        }
        .tab-item.active {
          color: var(--accent-primary);
        }
        .tab-item:hover {
          color: var(--text-primary);
        }
        .tab-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--accent-primary);
        }
        .tab-icon {
          font-size: 1.1rem;
        }
        .header-actions {
          display: flex;
          gap: 0.75rem;
        }
        .btn-export {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          color: var(--text-primary);
        }
        .btn-filter {
          background: var(--accent-primary);
          color: white;
          border: none;
          padding: 0.4rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.8rem;
          transition: background 0.2s;
        }
        .btn-filter:hover {
          background: var(--accent-tertiary);
        }
        .btn-export.pdf {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .btn-export.pdf:hover {
          background: rgba(239, 68, 68, 0.2);
        }
        .btn-export.excel {
          background: rgba(16, 185, 129, 0.1);
          color: #86efac;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .btn-export.excel:hover {
          background: rgba(16, 185, 129, 0.2);
        }
        
        @media print {
          .financial-header, .btn-export, .btn-filter, .tabs-container { display: none !important; }
          .financial-module { background: white !important; color: black !important; padding: 0 !important; }
          .tab-content { padding: 0 !important; }
          .ledger-container { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
}

function AccountSelectorInternal({ 
  accounts, 
  selectedId, 
  onSelect, 
  dict, 
  lang 
}: { 
  accounts: any[], 
  selectedId: string, 
  onSelect: (id: string) => void, 
  dict: any, 
  lang: string 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedAccount = useMemo(() => 
    accounts.find(a => a.id === selectedId), [accounts, selectedId]);

  const filteredAccounts = useMemo(() => {
    if (!Array.isArray(accounts)) return [];
    const lower = searchTerm.toLowerCase();
    return accounts.filter(acc => 
      (acc.code && acc.code.toLowerCase().includes(lower)) || 
      (acc.name && acc.name.toLowerCase().includes(lower)) || 
      (acc.nameAr && acc.nameAr.toLowerCase().includes(lower))
    ).slice(0, 100); 
  }, [accounts, searchTerm]);

  const getLocalizedName = (acc: any) => 
    lang === 'ar' && acc.nameAr ? acc.nameAr : acc.name;

  return (
    <div className="searchable-select-container" style={{ position: 'relative' }}>
      <div 
        className={`select-trigger ${!selectedId ? 'placeholder' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.625rem 0.75rem',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          minHeight: '2.5rem',
          userSelect: 'none',
          color: selectedAccount ? '#1e293b' : '#94a3b8'
        }}
      >
        <span>
          {selectedAccount 
            ? `${selectedAccount.code} - ${getLocalizedName(selectedAccount)}` 
            : dict.selectAccount || (lang === 'ar' ? 'اختر حساباً...' : 'Select an account...')}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>

      {isOpen && (
        <div className="dropdown-panel" style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '300px'
        }}>
          <div className="search-input-wrapper" style={{ padding: '8px', borderBottom: '1px solid #f3f4f6' }}>
            <input 
              autoFocus
              type="text" 
              className="drop-search" 
              placeholder={lang === 'ar' ? "بحث في الحسابات..." : "Search accounts..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                outline: 'none',
                fontSize: '0.875rem',
                color: '#1e293b'
              }}
            />
          </div>
          <div className="options-list" style={{ overflowY: 'auto', flex: 1 }}>
            {filteredAccounts.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>No accounts found</div>
            ) : (
              filteredAccounts.map(acc => (
                <div 
                  key={acc.id} 
                  className={`option-item ${selectedId === acc.id ? 'selected' : ''}`}
                  onClick={() => {
                    onSelect(acc.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'flex',
                    gap: '8px',
                    background: selectedId === acc.id ? '#eff6ff' : 'transparent',
                    color: selectedId === acc.id ? '#2563eb' : '#1e293b'
                  }}
                >
                  <span style={{ fontWeight: '600', minWidth: '45px' }}>{acc.code}</span>
                  <span>{getLocalizedName(acc)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {isOpen && <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'transparent' }} />}
    </div>
  );
}

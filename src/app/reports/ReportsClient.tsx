'use client';

import React, { useState, useEffect } from 'react';
import { getTrialBalance, getProfitLoss, getBalanceSheet, getSalesReport, getPurchaseReport, getReturnsReport, getVatReturnReport, getAgingReport, getDimensionReport, getCashFlowReport, getGeneralJournal, getBankReconciliationReport, getBankAccountsList , getEquityChanges , getItemProfitabilityReport, getCustomersList, getSuppliersList, getPerformanceComparison } from './actions';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getInventoryValuation, getStockMovement, getLowStockAlerts, getExpiryTracking } from './inventory-actions';
import LedgerModal from './LedgerModal';
import ContactStatementModal from './ContactStatementModal';
import SingleDimensionFilter from '@/components/SingleDimensionFilter';

type ReportItem = { id?: string; code?: string; name: string; nameAr: string | null; balance: number };
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
  const [activeCategory, setActiveCategory] = useState(() => {
    if (['trial', 'pl', 'bs', 'aging', 'cash-flow', 'general-journal', 'bank-reconciliation', 'equity-changes'].includes(defaultTab)) return 'financial';
    if (['sales', 'purchases', 'returns', 'item-profitability', 'customer-statement', 'supplier-statement'].includes(defaultTab)) return 'sales';
    if (['inventory-valuation', 'stock-movement', 'low-stock', 'expiry-tracking'].includes(defaultTab)) return 'inventory';
    if (['dimensions', 'performance'].includes(defaultTab)) return 'analytical';
    if (['vat'].includes(defaultTab)) return 'tax';
    return 'financial';
  });
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [datePeriod, setDatePeriod] = useState('custom');

  const handlePeriodChange = (period: string) => {
    setDatePeriod(period);
    const year = new Date().getFullYear();
    if (period === 'q1') {
      setStartDate(`${year}-01-01`);
      setEndDate(`${year}-03-31`);
    } else if (period === 'q2') {
      setStartDate(`${year}-04-01`);
      setEndDate(`${year}-06-30`);
    } else if (period === 'q3') {
      setStartDate(`${year}-07-01`);
      setEndDate(`${year}-09-30`);
    } else if (period === 'q4') {
      setStartDate(`${year}-10-01`);
      setEndDate(`${year}-12-31`);
    }
  };
  const [salesData, setSalesData] = useState<any[]>([]);
  const [itemProfitData, setItemProfitData] = useState<any[]>([]);
  const [purchasesData, setPurchasesData] = useState<any[]>([]);
  const [returnsData, setReturnsData] = useState<{sales: any[], purchases: any[]}>({sales: [], purchases: []});
  const [returnType, setReturnType] = useState<'all' | 'sales' | 'purchases'>('all');
  const [selectedLedgerAccount, setSelectedLedgerAccount] = useState<{id: string, name: string, code: string} | null>(null);
  const [vatData, setVatData] = useState<any>(null);
  const [agingData, setAgingData] = useState<any[]>([]);
  const [agingType, setAgingType] = useState<'receivables' | 'payables'>('receivables');
  
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [dimensionsData, setDimensionsData] = useState<any[]>([]);
  const [dimensionValueId, setDimensionValueId] = useState('');
  const [cashFlowData, setCashFlowData] = useState<any>(null);
  const [equityChangesData, setEquityChangesData] = useState<any>(null);
  const [generalJournalData, setGeneralJournalData] = useState<any[]>([]);
  const [bankReconData, setBankReconData] = useState<any>(null);
  const [bankAccountId, setBankAccountId] = useState('');
  const [bankAccountsList, setBankAccountsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [trialBalancesData, setTrialBalancesData] = useState<any[]>(balances);
  const [trialBalanceViewMode, setTrialBalanceViewMode] = useState<'balances' | 'detailed'>('balances');
  const [plData, setPlData] = useState<ReportPL>(profitLoss);
  const [bsData, setBsData] = useState<ReportBS>(balanceSheet);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [performancePeriod, setPerformancePeriod] = useState<'month' | 'year'>('month');

  const [customers, setCustomers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactType, setContactType] = useState<'customer'|'supplier'>('customer');

  useEffect(() => {
    getBankAccountsList().then(res => {
      if (res.success) setBankAccountsList(res.data || []);
    });
    getCustomersList().then(res => {
      if (res.success) setCustomers(res.data || []);
    });
    getSuppliersList().then(res => {
      if (res.success) setSuppliers(res.data || []);
    });
  }, []);

  const formatCurrency = (amount: number) => {
    return '$ ' + amount.toLocaleString(undefined, { minimumFractionDigits: 2 });
  };

  const getLocalizedName = (item: any) => lang === 'ar' && item.nameAr ? item.nameAr : item.name;

  const handleFetchReport = async (reportType?: string) => {
    setLoading(true);
    try {
      if (activeTab === 'trial') {
        const res = await getTrialBalance(startDate, endDate, dimensionValueId);
        setTrialBalancesData(res);
      } else if (activeTab === 'pl') {
        const res = await getProfitLoss(startDate, endDate, dimensionValueId);
        setPlData(res);
      } else if (activeTab === 'bs') {
        const res = await getBalanceSheet(startDate, endDate, dimensionValueId);
        setBsData(res);
      } else if (activeTab === 'sales') {
        const res = await getSalesReport(startDate, endDate);
        if (res.success) setSalesData(res.data || []);
        else alert('Error: ' + res.error);
      } else if (activeTab === 'purchases') {
        const res = await getPurchaseReport(startDate, endDate);
        if (res.success) setPurchasesData(res.data || []);
        else alert('Error: ' + res.error);
      } else if (activeTab === 'returns') {
        const res = await getReturnsReport(startDate, endDate);
        if (res.success) setReturnsData({ sales: res.salesReturns || [], purchases: res.purchaseReturns || [] });
      } else if (activeTab === 'item-profitability') {
        const res = await getItemProfitabilityReport(startDate, endDate);
        if (res.success) setItemProfitData(res.data || []);
        else alert('Error: ' + res.error);
      } else if (activeTab === 'customer-statement' || activeTab === 'supplier-statement') {
        if (!selectedContact) {
          alert(lang === 'ar' ? 'الرجاء اختيار جهة الاتصال' : 'Please select a contact');
        } else {
          setShowContactModal(true);
        }
      } else if (activeTab === 'vat') {
        const res = await getVatReturnReport(startDate, endDate);
        if (res.success) setVatData(res.data);
        else alert('Error: ' + res.error);
      } else if (activeTab === 'aging') {
        const res = await getAgingReport(agingType, endDate);
        if (res.success) setAgingData(res.data || []);
        else alert('Error: ' + res.error);
      } else if (activeTab === 'inventory-valuation') {
        const res = await getInventoryValuation();
        if (res.success) setInventoryData(res.data || []);
        else alert('Error: ' + res.error);
      } else if (activeTab === 'stock-movement') {
        const res = await getStockMovement(startDate, endDate);
        if (res.success) setInventoryData(res.data || []);
        else alert('Error: ' + res.error);
      } else if (activeTab === 'low-stock') {
        const res = await getLowStockAlerts();
        if (res.success) setInventoryData(res.data || []);
        else alert('Error: ' + res.error);
      } else if (activeTab === 'expiry-tracking') {
        const res = await getExpiryTracking();
        if (res.success) setInventoryData(res.data || []);
        else alert('Error: ' + res.error);
      } else if (activeTab === 'performance') {
        const res = await getPerformanceComparison(performancePeriod);
        if (res.success) setPerformanceData(res.data);
        else alert('Error: ' + res.error);
      } else if (activeTab === 'dimensions') {
        if (!dimensionValueId) {
          alert(lang === 'ar' ? 'الرجاء اختيار قيمة البعد التحليلي' : 'Please select an analytical dimension value');
          return;
        }
        const res = await getDimensionReport(startDate, endDate, dimensionValueId);
        if (res.success) setDimensionsData(res.data || []);
        else alert('Error: ' + res.error);
      } else if (activeTab === 'cash-flow') {
        const res = await getCashFlowReport(startDate, endDate);
        if (res.success) setCashFlowData(res.data);
        else alert('Error: ' + res.error);
      } else if (activeTab === 'general-journal') {
        const res = await getGeneralJournal(startDate, endDate);
        if (res.success) setGeneralJournalData(res.data || []);
        else alert('Error: ' + res.error);
      } else if (activeTab === 'bank-reconciliation') {
        if (!bankAccountId) {
          alert(lang === 'ar' ? 'الرجاء اختيار الحساب البنكي' : 'Please select a bank account');
          return;
        }
        const res = await getBankReconciliationReport(bankAccountId, startDate, endDate);
        if (res.success) setBankReconData(res.data);
        else alert('Error: ' + res.error);
      } else if (activeTab === 'equity-changes') {
        const res = await getEquityChanges(startDate, endDate);
        if (res.success) setEquityChangesData(res.data);
        else alert('Error: ' + res.error);
      }
    } catch (e: any) {
      alert('Client Error: ' + e.message);
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

      <div className="categories-container no-print" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {[
          { id: 'financial', label: lang === 'ar' ? 'التقارير المالية' : 'Financial Reports', icon: '📊' },
          { id: 'sales', label: lang === 'ar' ? 'المبيعات والمشتريات' : 'Sales & Purchases', icon: '🛒' },
          { id: 'inventory', label: lang === 'ar' ? 'تقارير المخزون' : 'Inventory Reports', icon: '📦' },
          { id: 'tax', label: lang === 'ar' ? 'التقارير الضريبية' : 'Tax Reports', icon: '🏛️' },
          { id: 'analytical', label: lang === 'ar' ? 'تقارير تحليلية' : 'Analytical Reports', icon: '📈' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setInventoryData([]);
              setDimensionsData([]);
              if (cat.id === 'financial') setActiveTab('trial');
              else if (cat.id === 'sales') setActiveTab('sales');
              else if (cat.id === 'inventory') setActiveTab('inventory-valuation');
              else if (cat.id === 'analytical') setActiveTab('dimensions');
              else if (cat.id === 'tax') setActiveTab('vat');
              else setActiveTab('');
            }}
            style={{
              flex: '1',
              minWidth: '180px',
              padding: '1.25rem 1rem',
              background: activeCategory === cat.id ? 'var(--accent-primary)' : 'var(--card-bg)',
              color: activeCategory === cat.id ? 'white' : 'var(--text-primary)',
              border: `1px solid ${activeCategory === cat.id ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              boxShadow: activeCategory === cat.id ? '0 8px 20px rgba(37, 99, 235, 0.25)' : '0 2px 6px rgba(0,0,0,0.03)'
            }}
            className="animate-in"
          >
            <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="subtabs-container no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        {activeCategory === 'financial' && [
          { id: 'trial', label: dict.trialBalance },
          { id: 'pl', label: dict.profitLoss },
          { id: 'bs', label: dict.balanceSheet },
          { id: 'aging', label: lang === 'ar' ? 'أعمار الديون' : 'Aging of Debts' },
          { id: 'cash-flow', label: lang === 'ar' ? 'التدفقات النقدية' : 'Cash Flow' },
          { id: 'general-journal', label: lang === 'ar' ? 'دفتر اليومية العامة' : 'General Journal' },
          { id: 'bank-reconciliation', label: lang === 'ar' ? 'تسوية البنوك' : 'Bank Reconciliation' },
          { id: 'equity-changes', label: lang === 'ar' ? 'قائمة التغيرات في حقوق الملكية' : 'Statement of Changes in Equity' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} style={{ padding: '0.5rem 1.25rem', background: activeTab === tab.id ? 'var(--accent-secondary)' : 'var(--chip-bg)', color: activeTab === tab.id ? 'white' : 'var(--text-secondary)', border: `1px solid ${activeTab === tab.id ? 'var(--accent-secondary)' : 'var(--glass-border)'}`, borderRadius: '20px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', fontSize: '0.9rem' }}>
            {tab.label}
          </button>
        ))}
        {activeCategory === 'sales' && [
          { id: 'sales', label: lang === 'ar' ? 'تقرير المبيعات' : 'Sales Report' },
          { id: 'purchases', label: lang === 'ar' ? 'تقرير المشتريات' : 'Purchases Report' },
          { id: 'returns', label: lang === 'ar' ? 'تقرير المرتجعات' : 'Returns Report' },
          { id: 'item-profitability', label: lang === 'ar' ? 'أرباح الأصناف' : 'Item Profitability' },
          { id: 'customer-statement', label: lang === 'ar' ? 'كشف حساب عميل' : 'Customer Statement' },
          { id: 'supplier-statement', label: lang === 'ar' ? 'كشف حساب مورد' : 'Supplier Statement' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} style={{ padding: '0.5rem 1.25rem', background: activeTab === tab.id ? 'var(--accent-secondary)' : 'var(--chip-bg)', color: activeTab === tab.id ? 'white' : 'var(--text-secondary)', border: `1px solid ${activeTab === tab.id ? 'var(--accent-secondary)' : 'var(--glass-border)'}`, borderRadius: '20px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', fontSize: '0.9rem' }}>
            {tab.label}
          </button>
        ))}
        {activeCategory === 'analytical' && [
          { id: 'dimensions', label: lang === 'ar' ? 'الأبعاد التحليلية (مراكز التكلفة)' : 'Dimensions' },
          { id: 'performance', label: lang === 'ar' ? 'مقارنة الأداء' : 'Performance Comparison' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} style={{ padding: '0.5rem 1.25rem', background: activeTab === tab.id ? 'var(--accent-secondary)' : 'var(--chip-bg)', color: activeTab === tab.id ? 'white' : 'var(--text-secondary)', border: `1px solid ${activeTab === tab.id ? 'var(--accent-secondary)' : 'var(--glass-border)'}`, borderRadius: '20px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', fontSize: '0.9rem' }}>
            {tab.label}
          </button>
        ))}
        {activeCategory === 'tax' && [
          { id: 'vat', label: lang === 'ar' ? 'الإقرار الضريبي (VAT)' : 'VAT Return' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} style={{ padding: '0.5rem 1.25rem', background: activeTab === tab.id ? 'var(--accent-secondary)' : 'var(--chip-bg)', color: activeTab === tab.id ? 'white' : 'var(--text-secondary)', border: `1px solid ${activeTab === tab.id ? 'var(--accent-secondary)' : 'var(--glass-border)'}`, borderRadius: '20px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', fontSize: '0.9rem' }}>
            {tab.label}
          </button>
        ))}
        {activeCategory === 'inventory' && [
          { id: 'inventory-valuation', label: lang === 'ar' ? 'تقييم المخزون' : 'Inventory Valuation' },
          { id: 'stock-movement', label: lang === 'ar' ? 'حركة المخزون' : 'Stock Movement' },
          { id: 'low-stock', label: lang === 'ar' ? 'نواقص المخزون' : 'Low Stock Alerts' },
          { id: 'expiry-tracking', label: lang === 'ar' ? 'تواريخ الصلاحية' : 'Expiry Tracking' }
        ].map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setInventoryData([]); }} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} style={{ padding: '0.5rem 1.25rem', background: activeTab === tab.id ? 'var(--accent-secondary)' : 'var(--chip-bg)', color: activeTab === tab.id ? 'white' : 'var(--text-secondary)', border: `1px solid ${activeTab === tab.id ? 'var(--accent-secondary)' : 'var(--glass-border)'}`, borderRadius: '20px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', fontSize: '0.9rem' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {(activeTab === 'sales' || activeTab === 'purchases' || activeTab === 'returns' || activeTab === 'item-profitability' || activeTab === 'vat' || activeTab === 'aging' || activeCategory === 'inventory' || activeCategory === 'analytical' || activeCategory === 'financial' || activeTab === 'cash-flow' || activeTab === 'general-journal' || activeTab === 'bank-reconciliation' || activeTab === 'equity-changes' || activeTab === 'customer-statement' || activeTab === 'supplier-statement') && (
        <div className="card glass-panel no-print" style={{ marginBottom: '2rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {activeTab === 'vat' && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: lang === 'ar' ? '0' : '1rem', marginLeft: lang === 'ar' ? '1rem' : '0' }}>
                {lang === 'ar' ? 'الفترة:' : 'Period:'}
              </span>
              {[
                { id: 'q1', label: lang === 'ar' ? 'الربع الأول' : 'Q1' },
                { id: 'q2', label: lang === 'ar' ? 'الربع الثاني' : 'Q2' },
                { id: 'q3', label: lang === 'ar' ? 'الربع الثالث' : 'Q3' },
                { id: 'q4', label: lang === 'ar' ? 'الربع الرابع' : 'Q4' },
                { id: 'custom', label: lang === 'ar' ? 'مخصص' : 'Custom' }
              ].map(period => (
                <button
                  key={period.id}
                  onClick={() => handlePeriodChange(period.id)}
                  className={`btn ${datePeriod === period.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    background: datePeriod === period.id ? 'var(--accent-primary)' : 'var(--chip-bg)',
                    border: datePeriod === period.id ? 'none' : '1px solid var(--glass-border)',
                    color: datePeriod === period.id ? 'white' : 'var(--text-primary)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                >
                  {period.label}
                </button>
              ))}
            </div>
          )}


          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {(activeCategory === 'analytical' || ['trial', 'pl'].includes(activeTab)) && (
            <div className="filter-group">
              <label className="filter-label">{lang === 'ar' ? 'البعد التحليلي (مركز التكلفة)' : 'Cost Center / Dimension'}</label>
              <SingleDimensionFilter lang={lang} valueId={dimensionValueId} onChange={setDimensionValueId} />
            </div>
          )}
            {activeTab === 'bank-reconciliation' && (
              <div style={{ flex: '2', minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {lang === 'ar' ? 'اختر الحساب البنكي' : 'Select Bank Account'}
                </label>
                <select 
                  value={bankAccountId} 
                  onChange={(e) => setBankAccountId(e.target.value)}
                  className="form-input" 
                  style={{ width: '100%', background: 'var(--chip-bg)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                >
                  <option value="">{lang === 'ar' ? '-- اختر الحساب --' : '-- Select Account --'}</option>
                  {bankAccountsList.map(b => (
                    <option key={b.id} value={b.id} style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>{b.accountNumber} - {lang === 'ar' && b.bankNameAr ? b.bankNameAr : b.bankName}</option>
                  ))}
                </select>
              </div>
            )}
            {(activeTab !== 'vat' || datePeriod === 'custom') && !['inventory-valuation', 'low-stock', 'expiry-tracking'].includes(activeTab) && (
              <>
                <div style={{ flex: '1', minWidth: '150px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {lang === 'ar' ? 'من تاريخ' : 'Start Date'}
                  </label>
                  <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setDatePeriod('custom'); }} className="form-input" style={{ width: '100%', background: 'var(--chip-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }} />
                </div>
                <div style={{ flex: '1', minWidth: '150px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {lang === 'ar' ? 'إلى تاريخ' : 'End Date'}
                  </label>
                  <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setDatePeriod('custom'); }} className="form-input" style={{ width: '100%', background: 'var(--chip-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }} />
                </div>
                {(activeTab === 'returns' || activeTab === 'item-profitability') && (
                  <div style={{ flex: '1', minWidth: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {lang === 'ar' ? 'نوع المرتجعات' : 'Return Type'}
                    </label>
                    <select 
                      value={returnType} 
                      onChange={(e) => setReturnType(e.target.value as any)}
                      className="form-input" 
                      style={{ width: '100%', background: 'var(--chip-bg)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                    >
                      <option value="all" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>{lang === 'ar' ? 'الكل' : 'All'}</option>
                      <option value="sales" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>{lang === 'ar' ? 'مردودات مبيعات' : 'Sales Returns'}</option>
                      <option value="purchases" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>{lang === 'ar' ? 'مردودات مشتريات' : 'Purchases Returns'}</option>
                    </select>
                  </div>
                )}
                {(activeTab === 'customer-statement' || activeTab === 'supplier-statement') && (
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {activeTab === 'customer-statement' ? (lang === 'ar' ? 'العميل' : 'Customer') : (lang === 'ar' ? 'المورد' : 'Supplier')}
                    </label>
                    <select value={selectedContact?.id || ''} onChange={(e) => {
                      const list = activeTab === 'customer-statement' ? customers : suppliers;
                      const contact = list.find(c => c.id === e.target.value);
                      setSelectedContact(contact || null);
                      setContactType(activeTab === 'customer-statement' ? 'customer' : 'supplier');
                    }} className="form-input" style={{ width: '100%', background: 'var(--chip-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}>
                      <option value="" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>{lang === 'ar' ? 'اختر...' : 'Select...'}</option>
                      {(activeTab === 'customer-statement' ? customers : suppliers).map((c: any) => (
                        <option key={c.id} value={c.id} style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>{c.code} - {lang === 'ar' && c.nameAr ? c.nameAr : c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
            
            <div style={{ flex: datePeriod === 'custom' ? '0' : '1', display: 'flex', justifyContent: datePeriod === 'custom' ? 'flex-start' : 'flex-end' }}>
              <button onClick={() => handleFetchReport()} disabled={loading} className="btn btn-primary" style={{ height: '42px', padding: '0 2rem', fontWeight: 'bold', minWidth: '150px' }}>
                {loading ? (lang === 'ar' ? 'جاري التحميل...' : 'Loading...') : 
                 ((activeTab === 'customer-statement' || activeTab === 'supplier-statement') ? (lang === 'ar' ? 'عرض كشف الحساب' : 'Show Statement') : (lang === 'ar' ? 'تحديث التقرير' : 'Update Report'))}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vat' && vatData && (
        <div className="report-section animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="card glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: 'white' }}>
                  {lang === 'ar' ? 'الإقرار الضريبي (VAT Return)' : 'VAT Return'}
                </h3>
                <div style={{ color: 'var(--accent-secondary)', fontSize: '1rem' }}>
                  {datePeriod === 'q1' ? (lang === 'ar' ? `عن الربع الأول ${new Date(startDate).getFullYear()}` : `for Q1 ${new Date(startDate).getFullYear()}`) :
                   datePeriod === 'q2' ? (lang === 'ar' ? `عن الربع الثاني ${new Date(startDate).getFullYear()}` : `for Q2 ${new Date(startDate).getFullYear()}`) :
                   datePeriod === 'q3' ? (lang === 'ar' ? `عن الربع الثالث ${new Date(startDate).getFullYear()}` : `for Q3 ${new Date(startDate).getFullYear()}`) :
                   datePeriod === 'q4' ? (lang === 'ar' ? `عن الربع الرابع ${new Date(startDate).getFullYear()}` : `for Q4 ${new Date(startDate).getFullYear()}`) :
                   (lang === 'ar' ? `للفترة من ${startDate} إلى ${endDate}` : `for period ${startDate} to ${endDate}`)}
                </div>
              </div>
              <div className="no-print">
                <button onClick={handlePrint} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🖨️</span> {lang === 'ar' ? 'طباعة' : 'Print'}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-primary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📥</span> {lang === 'ar' ? 'ضريبة المخرجات (المبيعات)' : 'Output VAT (Sales)'}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#94a3b8' }}>
                  <span>{lang === 'ar' ? 'مبيعات خاضعة للضريبة' : 'Taxable Sales'}</span>
                  <span>{formatCurrency(vatData.sales.taxable)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#94a3b8' }}>
                  <span>{lang === 'ar' ? 'مبيعات نسبة الصفر / معفاة' : 'Zero-Rated/Exempt Sales'}</span>
                  <span>{formatCurrency(vatData.sales.zeroRated)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <span>{lang === 'ar' ? 'إجمالي ضريبة المخرجات' : 'Total Output VAT'}</span>
                  <span style={{ color: '#4ade80' }}>{formatCurrency(vatData.sales.vat)}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-secondary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📤</span> {lang === 'ar' ? 'ضريبة المدخلات (المشتريات)' : 'Input VAT (Purchases)'}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#94a3b8' }}>
                  <span>{lang === 'ar' ? 'مشتريات خاضعة للضريبة' : 'Taxable Purchases'}</span>
                  <span>{formatCurrency(vatData.purchases.taxable)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#94a3b8' }}>
                  <span>{lang === 'ar' ? 'مشتريات نسبة الصفر / معفاة' : 'Zero-Rated/Exempt Purchases'}</span>
                  <span>{formatCurrency(vatData.purchases.zeroRated)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <span>{lang === 'ar' ? 'إجمالي ضريبة المدخلات' : 'Total Input VAT'}</span>
                  <span style={{ color: '#f87171' }}>{formatCurrency(vatData.purchases.vat)}</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.2), rgba(var(--accent-secondary-rgb), 0.2))', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '1.4rem' }}>
                  {lang === 'ar' ? 'صافي الضريبة المستحقة' : 'Net VAT Due'}
                </h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  {vatData.netVatDue > 0 
                    ? (lang === 'ar' ? 'المبلغ المستحق الدفع لهيئة الزكاة والضريبة' : 'Amount payable to ZATCA') 
                    : (lang === 'ar' ? 'المبلغ المسترد (رصيد دائن)' : 'Refundable amount (Credit)')}
                </p>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: vatData.netVatDue > 0 ? '#4ade80' : '#f87171', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                {formatCurrency(Math.abs(vatData.netVatDue))}
              </div>
            </div>
            
            <div style={{ marginTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              {lang === 'ar' ? '* هذا التقرير استرشادي ولا يغني عن الإقرار الرسمي المقدم في منصة الإيرادات.' : '* This report is for guidance and does not replace the official return submitted on the ZATCA portal.'}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trial' && (
        <div className="card animate-in">
          <div className="card-header no-print">
            <h2 className="card-title">{dict.trialBalance}</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', background: 'var(--chip-bg)', borderRadius: '8px', padding: '0.25rem', border: '1px solid var(--glass-border)' }}>
                <button 
                  onClick={() => setTrialBalanceViewMode('balances')}
                  style={{
                    padding: '0.5rem 1rem',
                    background: trialBalanceViewMode === 'balances' ? 'var(--accent-primary)' : 'transparent',
                    color: trialBalanceViewMode === 'balances' ? 'white' : 'var(--text-primary)',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {lang === 'ar' ? 'بالأرصدة' : 'By Balances'}
                </button>
                <button 
                  onClick={() => setTrialBalanceViewMode('detailed')}
                  style={{
                    padding: '0.5rem 1rem',
                    background: trialBalanceViewMode === 'detailed' ? 'var(--accent-primary)' : 'transparent',
                    color: trialBalanceViewMode === 'detailed' ? 'white' : 'var(--text-primary)',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {lang === 'ar' ? 'بالمجاميع والأرصدة' : 'By Totals & Balances'}
                </button>
              </div>
              <button onClick={handlePrint} className="btn-secondary" style={{ padding: '0.5rem 1.25rem', background: 'var(--chip-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                {lang === 'ar' ? 'طباعة' : 'Print'}
              </button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{dict.code}</th>
                  <th>{dict.account}</th>
                  {trialBalanceViewMode === 'detailed' && (
                    <>
                      <th style={{ textAlign: 'center' }} colSpan={2}>{lang === 'ar' ? 'الرصيد الافتتاحي' : 'Opening Balance'}</th>
                      <th style={{ textAlign: 'center' }} colSpan={2}>{lang === 'ar' ? 'الحركات خلال الفترة' : 'Period Movements'}</th>
                    </>
                  )}
                  <th style={{ textAlign: 'center' }} colSpan={trialBalanceViewMode === 'detailed' ? 2 : 1}>{trialBalanceViewMode === 'detailed' ? (lang === 'ar' ? 'الرصيد النهائي' : 'Ending Balance') : ''}</th>
                </tr>
                {trialBalanceViewMode === 'detailed' && (
                  <tr>
                    <th></th>
                    <th></th>
                    <th style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dict.debit}</th>
                    <th style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dict.credit}</th>
                    <th style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dict.debit}</th>
                    <th style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dict.credit}</th>
                    <th style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dict.debit}</th>
                    <th style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dict.credit}</th>
                  </tr>
                )}
                {trialBalanceViewMode === 'balances' && (
                  <tr>
                    <th></th>
                    <th></th>
                    <th style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dict.debit}</th>
                    <th style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dict.credit}</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {(trialBalancesData || []).map(acc => {
                  const finalBal = acc.endingBalance !== undefined ? acc.endingBalance : acc.balance;
                  const finalDebit = finalBal > 0 ? finalBal : 0;
                  const finalCredit = finalBal < 0 ? Math.abs(finalBal) : 0;
                  
                  return (
                    <tr key={acc.id} onClick={() => setSelectedLedgerAccount({ id: acc.id, name: getLocalizedName(acc), code: acc.code || '' })} style={{ cursor: "pointer" }} className="hover-row">
                      <td className="text-sub" style={{ fontWeight: '600' }}>{acc.code}</td>
                      <td>{getLocalizedName(acc)}</td>
                      
                      {trialBalanceViewMode === 'detailed' && (
                        <>
                          <td style={{ textAlign: 'right' }}>{acc.openingBalance > 0 ? formatCurrency(acc.openingBalance) : '-'}</td>
                          <td style={{ textAlign: 'right' }}>{acc.openingBalance < 0 ? formatCurrency(Math.abs(acc.openingBalance)) : '-'}</td>
                          <td style={{ textAlign: 'right' }}>{acc.periodDebit > 0 ? formatCurrency(acc.periodDebit) : '-'}</td>
                          <td style={{ textAlign: 'right' }}>{acc.periodCredit > 0 ? formatCurrency(acc.periodCredit) : '-'}</td>
                        </>
                      )}
                      
                      {trialBalanceViewMode === 'detailed' ? (
                        <>
                          <td style={{ textAlign: 'right', fontWeight: finalDebit > 0 ? 'bold' : 'normal', color: finalDebit > 0 ? 'var(--accent-primary)' : 'inherit' }}>{finalDebit > 0 ? formatCurrency(finalDebit) : '-'}</td>
                          <td style={{ textAlign: 'right', fontWeight: finalCredit > 0 ? 'bold' : 'normal', color: finalCredit > 0 ? 'var(--accent-primary)' : 'inherit' }}>{finalCredit > 0 ? formatCurrency(finalCredit) : '-'}</td>
                        </>
                      ) : (
                        <>
                          <td style={{ textAlign: 'right', fontWeight: finalDebit > 0 ? 'bold' : 'normal', color: finalDebit > 0 ? 'var(--accent-primary)' : 'inherit' }}>{finalDebit > 0 ? formatCurrency(finalDebit) : '-'}</td>
                          <td style={{ textAlign: 'right', fontWeight: finalCredit > 0 ? 'bold' : 'normal', color: finalCredit > 0 ? 'var(--accent-primary)' : 'inherit' }}>{finalCredit > 0 ? formatCurrency(finalCredit) : '-'}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: 'bold', background: 'var(--glass-bg)' }}>
                  <td colSpan={2} style={{ textAlign: 'right' }}>{dict.total}</td>
                  {trialBalanceViewMode === 'detailed' && (
                    <>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(trialBalancesData.reduce((s, a) => s + (a.openingBalance > 0 ? a.openingBalance : 0), 0))}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(trialBalancesData.reduce((s, a) => s + (a.openingBalance < 0 ? Math.abs(a.openingBalance) : 0), 0))}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(trialBalancesData.reduce((s, a) => s + (a.periodDebit || 0), 0))}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(trialBalancesData.reduce((s, a) => s + (a.periodCredit || 0), 0))}</td>
                    </>
                  )}
                  <td style={{ textAlign: 'right' }}>{formatCurrency(trialBalancesData.reduce((s, a) => { const f = a.endingBalance !== undefined ? a.endingBalance : a.balance; return s + (f > 0 ? f : 0); }, 0))}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(trialBalancesData.reduce((s, a) => { const f = a.endingBalance !== undefined ? a.endingBalance : a.balance; return s + (f < 0 ? Math.abs(f) : 0); }, 0))}</td>
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
            <button onClick={handlePrint} className="btn-secondary" style={{ marginTop: '0.5rem', padding: '0.5rem 1.25rem', background: 'var(--chip-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
              {lang === 'ar' ? 'طباعة' : 'Print'}
            </button>
          </div>
          
          <div className="report-section" style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--accent-primary)', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{dict.revenue}</h3>
            {(profitLoss?.revenue || []).map((item, i) => (
              <div key={i} onClick={() => item.id && setSelectedLedgerAccount({ id: item.id, name: getLocalizedName(item), code: '' })} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--glass-border)", cursor: item.id ? "pointer" : "default" }} className={item.id ? "hover-row" : ""}>
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
              <div key={i} onClick={() => item.id && setSelectedLedgerAccount({ id: item.id, name: getLocalizedName(item), code: '' })} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--glass-border)", cursor: item.id ? "pointer" : "default" }} className={item.id ? "hover-row" : ""}>
                <span>{getLocalizedName(item)}</span>
                <span style={{ fontWeight: '500' }}>{formatCurrency(item.balance)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontWeight: 'bold' }}>
              <span>{dict.total} {dict.expenses}</span>
              <span>{formatCurrency(plData.totalExpenses)}</span>
            </div>

            <div style={{ 
              marginTop: '3rem', 
              padding: '1.5rem', 
              background: plData.netIncome >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)', 
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: `1px solid ${plData.netIncome >= 0 ? '#4CAF50' : '#F44336'}`
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{dict.netIncome}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: plData.netIncome >= 0 ? '#2E7D32' : '#C62828' }}>
                {formatCurrency(plData.netIncome)}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bs' && (
        <div className="card animate-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-header no-print" style={{ textAlign: 'center', flexDirection: 'column' }}>
            <h2 className="card-title">{dict.balanceSheet}</h2>
            <button onClick={handlePrint} className="btn-secondary" style={{ marginTop: '0.5rem', padding: '0.5rem 1.25rem', background: 'var(--chip-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
              {lang === 'ar' ? 'طباعة' : 'Print'}
            </button>
          </div>

          <div className="report-section" style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--accent-primary)', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{dict.assets}</h3>
            {(bsData?.assets || []).map((item, i) => (
              <div key={i} onClick={() => item.id && setSelectedLedgerAccount({ id: item.id, name: getLocalizedName(item), code: '' })} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--glass-border)", cursor: item.id ? "pointer" : "default" }} className={item.id ? "hover-row" : ""}>
                <span>{getLocalizedName(item)}</span>
                <span>{formatCurrency(item.balance || 0)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontWeight: 'bold', background: 'var(--glass-bg)', borderRadius: '4px', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <span>{dict.total} {dict.assets}</span>
              <span>{formatCurrency(bsData.totalAssets)}</span>
            </div>

            <h3 style={{ color: 'var(--accent-secondary)', borderBottom: '2px solid var(--accent-secondary)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2.5rem' }}>{dict.liabilities}</h3>
            {(bsData?.liabilities || []).map((item, i) => (
              <div key={i} onClick={() => item.id && setSelectedLedgerAccount({ id: item.id, name: getLocalizedName(item), code: '' })} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--glass-border)", cursor: item.id ? "pointer" : "default" }} className={item.id ? "hover-row" : ""}>
                <span>{getLocalizedName(item)}</span>
                <span>{formatCurrency(item.balance || 0)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontWeight: 'bold', background: 'var(--glass-bg)', borderRadius: '4px', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <span>{dict.total} {dict.liabilities}</span>
              <span>{formatCurrency(bsData.totalLiabilities)}</span>
            </div>

            <h3 style={{ color: 'var(--accent-tertiary)', borderBottom: '2px solid var(--accent-tertiary)', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2.5rem' }}>{dict.equity}</h3>
            {bsData.equity.map((item, i) => (
              <div key={i} onClick={() => item.id && setSelectedLedgerAccount({ id: item.id, name: getLocalizedName(item), code: '' })} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--glass-border)", cursor: item.id ? "pointer" : "default" }} className={item.id ? "hover-row" : ""}>
                <span style={{ fontStyle: (item.name || '').includes('Net Income') ? 'italic' : 'normal' }}>{getLocalizedName(item)}</span>
                <span>{formatCurrency(item.balance)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontWeight: 'bold', background: 'var(--glass-bg)', borderRadius: '4px', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <span>{dict.total} {dict.equity}</span>
              <span>{formatCurrency(bsData.totalEquity)}</span>
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
              {dict.assets} ({formatCurrency(bsData.totalAssets)}) = 
              {dict.liabilities} + {dict.equity} ({formatCurrency(bsData.totalLiabilities + bsData.totalEquity)})
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
          {(returnType === 'all' || returnType === 'sales') && (
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

          )}

          {(returnType === 'all' || returnType === 'purchases') && (
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
          )}
        </div>
      )}
      {activeTab === 'item-profitability' && (
        <div className="animate-in">
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <h2 className="card-title">{lang === 'ar' ? 'ربحية المبيعات حسب الصنف' : 'Item Profitability'}</h2>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>{lang === 'ar' ? 'رمز الصنف' : 'SKU'}</th>
                    <th>{lang === 'ar' ? 'اسم الصنف' : 'Item Name'}</th>
                    <th>{lang === 'ar' ? 'الكمية المباعة' : 'Qty Sold'}</th>
                    <th style={{ textAlign: 'left' }}>{lang === 'ar' ? 'المبيعات' : 'Sales'}</th>
                    <th style={{ textAlign: 'left' }}>{lang === 'ar' ? 'التكلفة' : 'Cost'}</th>
                    <th style={{ textAlign: 'left' }}>{lang === 'ar' ? 'الربح' : 'Profit'}</th>
                    <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'الهامش %' : 'Margin %'}</th>
                  </tr>
                </thead>
                <tbody>
                  {itemProfitData.map((item, i) => (
                    <tr key={i} className="hover-row">
                      <td className="text-sub">{item.sku}</td>
                      <td>{lang === 'ar' && item.nameAr ? item.nameAr : item.name}</td>
                      <td>{item.quantity.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}</td>
                      <td style={{ textAlign: 'left' }}>{formatCurrency(item.salesValue)}</td>
                      <td style={{ textAlign: 'left' }}>{formatCurrency(item.costValue)}</td>
                      <td style={{ color: item.profit >= 0 ? '#4ade80' : '#f87171', fontWeight: 'bold', textAlign: 'left' }}>{formatCurrency(item.profit)}</td>
                      <td style={{ color: item.margin >= 0 ? '#4ade80' : '#f87171', textAlign: 'center' }}>{item.margin.toFixed(2)}%</td>
                    </tr>
                  ))}
                  {itemProfitData.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>{lang === 'ar' ? 'لا توجد بيانات' : 'No data available'}</td>
                    </tr>
                  )}
                </tbody>
                {itemProfitData.length > 0 && (
                  <tfoot>
                    <tr style={{ fontWeight: 'bold', background: 'rgba(255,255,255,0.05)' }}>
                      <td colSpan={3} style={{ textAlign: 'right', padding: '1.2rem 1rem' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</td>
                      <td style={{ textAlign: 'left', padding: '1.2rem 1rem' }}>{formatCurrency(itemProfitData.reduce((s, item) => s + item.salesValue, 0))}</td>
                      <td style={{ textAlign: 'left', padding: '1.2rem 1rem' }}>{formatCurrency(itemProfitData.reduce((s, item) => s + item.costValue, 0))}</td>
                      <td style={{ color: '#4ade80', textAlign: 'left', padding: '1.2rem 1rem' }}>{formatCurrency(itemProfitData.reduce((s, item) => s + item.profit, 0))}</td>
                      <td style={{ textAlign: 'center', padding: '1.2rem 1rem' }}>
                        {(() => {
                          const totalSales = itemProfitData.reduce((s, item) => s + item.salesValue, 0);
                          const totalProfit = itemProfitData.reduce((s, item) => s + item.profit, 0);
                          return totalSales > 0 ? (totalProfit / totalSales * 100).toFixed(2) + '%' : '0.00%';
                        })()}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'aging' && (
        <div className="report-section animate-in" style={{ animationDelay: '0.1s' }}>
          
          <div className="no-print" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => { setAgingType('receivables'); setAgingData([]); }}
              className={`btn ${agingType === 'receivables' ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                flex: '1', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold',
                background: agingType === 'receivables' ? 'var(--accent-primary)' : 'var(--chip-bg)',
                color: agingType === 'receivables' ? 'white' : 'var(--text-primary)', border: agingType === 'receivables' ? 'none' : '1px solid var(--glass-border)',
                cursor: 'pointer'
              }}
            >
              {lang === 'ar' ? 'العملاء (Receivables)' : 'Receivables'}
            </button>
            <button
              onClick={() => { setAgingType('payables'); setAgingData([]); }}
              className={`btn ${agingType === 'payables' ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                flex: '1', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold',
                background: agingType === 'payables' ? 'var(--accent-primary)' : 'var(--chip-bg)',
                color: agingType === 'payables' ? 'white' : 'var(--text-primary)', border: agingType === 'payables' ? 'none' : '1px solid var(--glass-border)',
                cursor: 'pointer'
              }}
            >
              {lang === 'ar' ? 'الموردين (Payables)' : 'Payables'}
            </button>
          </div>

          {agingData.length > 0 ? (
            <>
              <div className="grid-summary no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid var(--accent-primary)' }}>
                  <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{lang === 'ar' ? 'إجمالي الديون' : 'Total Outstanding'}</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>
                    {formatCurrency(agingData.reduce((acc, curr) => acc + curr.total, 0))}
                  </p>
                </div>
                <div className="card glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid #10b981' }}>
                  <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{lang === 'ar' ? '1-30 يوم' : '1-30 Days'}</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#10b981' }}>
                    {formatCurrency(agingData.reduce((acc, curr) => acc + curr['1-30'], 0))}
                  </p>
                </div>
                <div className="card glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid #f59e0b' }}>
                  <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{lang === 'ar' ? '31-60 يوم' : '31-60 Days'}</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#f59e0b' }}>
                    {formatCurrency(agingData.reduce((acc, curr) => acc + curr['31-60'], 0))}
                  </p>
                </div>
                <div className="card glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid #f97316' }}>
                  <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{lang === 'ar' ? '61-90 يوم' : '61-90 Days'}</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#f97316' }}>
                    {formatCurrency(agingData.reduce((acc, curr) => acc + curr['61-90'], 0))}
                  </p>
                </div>
                <div className="card glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid #ef4444' }}>
                  <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{lang === 'ar' ? '+90 يوم' : '+90 Days'}</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#ef4444' }}>
                    {formatCurrency(agingData.reduce((acc, curr) => acc + curr['90+'], 0))}
                  </p>
                </div>
              </div>

              <div className="card glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? 'تقرير أعمار الديون' : 'Aging of Debts Report'} 
                      <span style={{ fontSize: '1rem', color: 'var(--accent-secondary)', marginLeft: '1rem' }}>
                        ({agingType === 'receivables' ? (lang === 'ar' ? 'العملاء' : 'Receivables') : (lang === 'ar' ? 'الموردين' : 'Payables')})
                      </span>
                    </h3>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                      {lang === 'ar' ? `حتى تاريخ ${endDate}` : `As of ${endDate}`}
                    </div>
                  </div>
                  <div className="no-print">
                    <button onClick={handlePrint} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>🖨️</span> {lang === 'ar' ? 'طباعة' : 'Print'}
                    </button>
                  </div>
                </div>

                <div className="table-container" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '1rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                        <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? '1-30 يوم' : '1-30 Days'}</th>
                        <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? '31-60 يوم' : '31-60 Days'}</th>
                        <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? '61-90 يوم' : '61-90 Days'}</th>
                        <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? '+90 يوم' : '+90 Days'}</th>
                        <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--accent-secondary)' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agingData.map(item => (
                        <tr key={item.id}>
                          <td style={{ padding: '1rem', fontWeight: 'bold' }}>{getLocalizedName(item)}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>{formatCurrency(item['1-30'])}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>{formatCurrency(item['31-60'])}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>{formatCurrency(item['61-90'])}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>{formatCurrency(item['90+'])}</td>
                          <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot style={{ borderTop: '2px solid var(--glass-border)' }}>
                      <tr>
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'الإجمالي العام' : 'Grand Total'}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#10b981' }}>{formatCurrency(agingData.reduce((acc, curr) => acc + curr['1-30'], 0))}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#f59e0b' }}>{formatCurrency(agingData.reduce((acc, curr) => acc + curr['31-60'], 0))}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#f97316' }}>{formatCurrency(agingData.reduce((acc, curr) => acc + curr['61-90'], 0))}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#ef4444' }}>{formatCurrency(agingData.reduce((acc, curr) => acc + curr['90+'], 0))}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{formatCurrency(agingData.reduce((acc, curr) => acc + curr.total, 0))}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="card glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                {lang === 'ar' ? 'يرجى الضغط على "تحديث التقرير" لجلب البيانات' : 'Click "Update Report" to fetch data'}
              </p>
            </div>
          )}
        </div>
      )}

      {activeCategory === 'inventory' && inventoryData && (
        <div className="report-section animate-in" style={{ animationDelay: '0.1s' }}>
          {activeTab === 'inventory-valuation' && (
            <div className="card glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h3 className="card-title" style={{ fontSize: '1.2rem', margin: 0 }}>{lang === 'ar' ? 'تقييم المخزون' : 'Inventory Valuation'}</h3>
                <button onClick={handlePrint} className="btn btn-secondary no-print" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🖨️ {lang === 'ar' ? 'طباعة' : 'Print'}
                </button>
              </div>
              <div className="table-container" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '1rem' }}>{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                      <th style={{ padding: '1rem' }}>{lang === 'ar' ? 'رمز SKU' : 'SKU'}</th>
                      <th style={{ padding: '1rem' }}>{lang === 'ar' ? 'التصنيف' : 'Category'}</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? 'الكمية' : 'Quantity'}</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? 'التكلفة' : 'Cost Price'}</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? 'إجمالي التكلفة' : 'Total Cost Value'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.length > 0 ? inventoryData.map(item => (
                      <tr key={item.id}>
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{getLocalizedName(item)}</td>
                        <td style={{ padding: '1rem' }}>{item.sku}</td>
                        <td style={{ padding: '1rem' }}>{item.category}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>{item.stockQuantity}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>{formatCurrency(item.costPrice)}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{formatCurrency(item.totalCostValue)}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لا توجد بيانات أو يرجى الضغط على تحديث التقرير' : 'No data or click Update Report to fetch'}</td></tr>
                    )}
                  </tbody>
                  <tfoot style={{ borderTop: '2px solid var(--glass-border)' }}>
                    <tr>
                      <td colSpan={5} style={{ padding: '1rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'إجمالي قيمة المخزون' : 'Total Inventory Value'}</td>
                      <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{formatCurrency(inventoryData.reduce((acc, curr) => acc + curr.totalCostValue, 0))}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'stock-movement' && (
            <div className="card glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h3 className="card-title" style={{ fontSize: '1.2rem', margin: 0 }}>{lang === 'ar' ? 'حركة المخزون' : 'Stock Movement'}</h3>
                <button onClick={handlePrint} className="btn btn-secondary no-print" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🖨️ {lang === 'ar' ? 'طباعة' : 'Print'}
                </button>
              </div>
              <div className="table-container" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '1rem' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                      <th style={{ padding: '1rem' }}>{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                      <th style={{ padding: '1rem' }}>{lang === 'ar' ? 'نوع الحركة' : 'Movement Type'}</th>
                      <th style={{ padding: '1rem' }}>{lang === 'ar' ? 'المستودع' : 'Warehouse'}</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? 'الكمية' : 'Quantity'}</th>
                      <th style={{ padding: '1rem' }}>{lang === 'ar' ? 'البيان' : 'Description'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.length > 0 ? inventoryData.map(item => (
                      <tr key={item.id}>
                        <td style={{ padding: '1rem' }}>{new Date(item.date).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{lang === 'ar' && item.productNameAr ? item.productNameAr : item.productName}</td>
                        <td style={{ padding: '1rem' }}>{item.type}</td>
                        <td style={{ padding: '1rem' }}>{lang === 'ar' && item.warehouseNameAr ? item.warehouseNameAr : item.warehouseName}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: item.quantity > 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }} dir="ltr">
                          {item.quantity > 0 ? '+' : ''}{item.quantity}
                        </td>
                        <td style={{ padding: '1rem', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لا توجد بيانات أو يرجى الضغط على تحديث التقرير' : 'No data or click Update Report to fetch'}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'low-stock' && (
            <div className="card glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h3 className="card-title" style={{ fontSize: '1.2rem', margin: 0 }}>{lang === 'ar' ? 'نواقص المخزون' : 'Low Stock Alerts'}</h3>
                <button onClick={handlePrint} className="btn btn-secondary no-print" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🖨️ {lang === 'ar' ? 'طباعة' : 'Print'}
                </button>
              </div>
              <div className="table-container" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '1rem' }}>{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                      <th style={{ padding: '1rem' }}>{lang === 'ar' ? 'رمز SKU' : 'SKU'}</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? 'حد الطلب' : 'Reorder Point'}</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? 'الرصيد الحالي' : 'Current Stock'}</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? 'النقص' : 'Deficit'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.length > 0 ? inventoryData.map(item => (
                      <tr key={item.id}>
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{getLocalizedName(item)}</td>
                        <td style={{ padding: '1rem' }}>{item.sku}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>{item.reorderPoint}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#ef4444', fontWeight: 'bold' }}>{item.stockQuantity}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#ef4444', fontWeight: 'bold' }}>{item.deficit}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لا توجد بيانات أو يرجى الضغط على تحديث التقرير' : 'No data or click Update Report to fetch'}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'expiry-tracking' && (
            <div className="card glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h3 className="card-title" style={{ fontSize: '1.2rem', margin: 0 }}>{lang === 'ar' ? 'تواريخ الصلاحية' : 'Expiry Tracking'}</h3>
                <button onClick={handlePrint} className="btn btn-secondary no-print" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🖨️ {lang === 'ar' ? 'طباعة' : 'Print'}
                </button>
              </div>
              <div className="table-container" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '1rem' }}>{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                      <th style={{ padding: '1rem' }}>{lang === 'ar' ? 'رمز SKU' : 'SKU'}</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? 'الأيام المتبقية' : 'Days Left'}</th>
                      <th style={{ padding: '1rem', textAlign: 'center' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.length > 0 ? inventoryData.map(item => {
                      let statusColor = '#10b981';
                      if (item.daysToExpiry === null) statusColor = '#64748b'; // Gray for Not Available
                      else if (item.daysToExpiry < 0) statusColor = '#ef4444';
                      else if (item.daysToExpiry <= 30) statusColor = '#f97316';
                      else if (item.daysToExpiry <= 90) statusColor = '#f59e0b';
                      return (
                        <tr key={item.id}>
                          <td style={{ padding: '1rem', fontWeight: 'bold' }}>{getLocalizedName(item)}</td>
                          <td style={{ padding: '1rem' }}>{item.sku}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : (lang === 'ar' ? 'غير متوفر' : 'N/A')}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: statusColor }}>
                            {item.daysToExpiry !== null ? item.daysToExpiry : '-'}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: statusColor }}>
                            {lang === 'ar' ? (
                              item.daysToExpiry === null ? 'غير متوفر' :
                              item.daysToExpiry < 0 ? 'منتهي الصلاحية' :
                              item.daysToExpiry <= 30 ? 'ينتهي قريباً (30 يوم)' :
                              item.daysToExpiry <= 90 ? 'ينتهي قريباً (90 يوم)' : 'صالح'
                            ) : item.status}
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لا توجد بيانات أو يرجى الضغط على تحديث التقرير' : 'No data or click Update Report to fetch'}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeCategory === 'analytical' && activeTab === 'dimensions' && dimensionsData && (
        <div className="report-section animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="card" style={{ 
            background: 'rgba(15, 23, 42, 0.6)', 
            backdropFilter: 'blur(16px)', 
            borderRadius: '16px', 
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}>
            {/* Header Area */}
            <div style={{ 
              padding: '1.5rem 2rem', 
              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '8px', color: '#818cf8', display: 'flex' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                  </span>
                  {lang === 'ar' ? 'تقرير البعد التحليلي' : 'Analytical Dimension Report'}
                </h2>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'تفاصيل الحركات المالية للبعد المحدد' : 'Financial transaction details for the selected dimension'}
                </p>
              </div>
              
              <button onClick={() => window.print()} className="btn-secondary" style={{ 
                padding: '0.5rem 1rem', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '8px', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                {lang === 'ar' ? 'طباعة التقرير' : 'Print Report'}
              </button>
            </div>

            <div className="table-responsive" style={{ padding: '0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                    <th style={{ padding: '1.25rem 2rem', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>{lang === 'ar' ? 'الرمز' : 'Code'}</th>
                    <th style={{ padding: '1.25rem 1rem', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>{lang === 'ar' ? 'اسم الحساب' : 'Account Name'}</th>
                    <th style={{ padding: '1.25rem 1rem', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>{lang === 'ar' ? 'إجمالي المدين' : 'Total Debit'}</th>
                    <th style={{ padding: '1.25rem 1rem', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>{lang === 'ar' ? 'إجمالي الدائن' : 'Total Credit'}</th>
                    <th style={{ padding: '1.25rem 2rem', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>{lang === 'ar' ? 'الرصيد' : 'Balance'}</th>
                  </tr>
                </thead>
                <tbody>
                  {dimensionsData.length > 0 ? dimensionsData.map((item, idx) => (
                    <tr key={item.id} style={{ 
                      transition: 'background 0.2s',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                      borderBottom: '1px solid rgba(255,255,255,0.05)'
                    }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'} onMouseOut={(e) => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}>
                      <td style={{ padding: '1.25rem 2rem', fontFamily: 'monospace', fontSize: '0.9rem', color: '#cbd5e1' }}>
                        <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {item.code}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1rem', fontWeight: '500', color: '#f8fafc' }}>{lang === 'ar' && item.nameAr ? item.nameAr : item.name}</td>
                      <td style={{ padding: '1.25rem 1rem', color: '#4ade80', fontWeight: '500' }}>{formatCurrency(item.totalDebit)}</td>
                      <td style={{ padding: '1.25rem 1rem', color: '#f87171', fontWeight: '500' }}>{formatCurrency(item.totalCredit)}</td>
                      <td style={{ padding: '1.25rem 2rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', borderRadius: '8px', background: item.balance > 0 ? 'rgba(74, 222, 128, 0.1)' : item.balance < 0 ? 'rgba(248, 113, 113, 0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${item.balance > 0 ? 'rgba(74, 222, 128, 0.2)' : item.balance < 0 ? 'rgba(248, 113, 113, 0.2)' : 'rgba(255,255,255,0.1)'}` }}>
                          <span style={{ fontWeight: 'bold', color: item.balance > 0 ? '#4ade80' : item.balance < 0 ? '#f87171' : '#cbd5e1' }}>
                            {formatCurrency(Math.abs(item.balance))}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '2px 6px', borderRadius: '4px', background: item.balance > 0 ? '#4ade80' : item.balance < 0 ? '#f87171' : '#cbd5e1', color: item.balance !== 0 ? '#000' : '#1e293b' }}>
                            {item.balance > 0 ? (lang === 'ar' ? 'مدين' : 'Dr') : item.balance < 0 ? (lang === 'ar' ? 'دائن' : 'Cr') : '-'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="8"></circle>
                              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                          </div>
                          <div style={{ color: 'var(--text-secondary)' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>{lang === 'ar' ? 'لا توجد بيانات' : 'No Data Found'}</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{lang === 'ar' ? 'يرجى تحديد البعد والضغط على تحديث التقرير' : 'Please select a dimension and click Update Report'}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                {dimensionsData.length > 0 && (
                  <tfoot>
                    <tr style={{ background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0.15) 100%)' }}>
                      <td colSpan={2} style={{ padding: '1.5rem 2rem', textAlign: lang === 'ar' ? 'left' : 'right', fontWeight: 'bold', color: 'white', borderTop: '2px solid rgba(99, 102, 241, 0.3)' }}>
                        {lang === 'ar' ? 'الإجمالي الكلي:' : 'Grand Total:'}
                      </td>
                      <td style={{ padding: '1.5rem 1rem', color: '#4ade80', fontWeight: 'bold', fontSize: '1.1rem', borderTop: '2px solid rgba(99, 102, 241, 0.3)' }}>
                        {formatCurrency(dimensionsData.reduce((sum, item) => sum + item.totalDebit, 0))}
                      </td>
                      <td style={{ padding: '1.5rem 1rem', color: '#f87171', fontWeight: 'bold', fontSize: '1.1rem', borderTop: '2px solid rgba(99, 102, 241, 0.3)' }}>
                        {formatCurrency(dimensionsData.reduce((sum, item) => sum + item.totalCredit, 0))}
                      </td>
                      <td style={{ padding: '1.5rem 2rem', borderTop: '2px solid rgba(99, 102, 241, 0.3)' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', background: dimensionsData.reduce((sum, item) => sum + item.balance, 0) > 0 ? 'rgba(74, 222, 128, 0.2)' : dimensionsData.reduce((sum, item) => sum + item.balance, 0) < 0 ? 'rgba(248, 113, 113, 0.2)' : 'rgba(255,255,255,0.1)', border: `1px solid ${dimensionsData.reduce((sum, item) => sum + item.balance, 0) > 0 ? 'rgba(74, 222, 128, 0.4)' : dimensionsData.reduce((sum, item) => sum + item.balance, 0) < 0 ? 'rgba(248, 113, 113, 0.4)' : 'rgba(255,255,255,0.2)'}` }}>
                          <span style={{ fontWeight: '900', fontSize: '1.1rem', color: dimensionsData.reduce((sum, item) => sum + item.balance, 0) > 0 ? '#4ade80' : dimensionsData.reduce((sum, item) => sum + item.balance, 0) < 0 ? '#f87171' : 'white' }}>
                            {formatCurrency(Math.abs(dimensionsData.reduce((sum, item) => sum + item.balance, 0)))}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      )}


      {activeTab === 'cash-flow' && cashFlowData && (
        <div className="report-section animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="card glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>{lang === 'ar' ? 'قائمة التدفقات النقدية' : 'Cash Flow Statement'}</h3>
              <button onClick={handlePrint} className="btn btn-secondary no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🖨️ {lang === 'ar' ? 'طباعة' : 'Print'}</button>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', marginBottom: '1rem' }}>{lang === 'ar' ? 'الأنشطة التشغيلية' : 'Operating Activities'}</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                <tbody>
                  {cashFlowData.operating.map((item: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem' }}>{lang === 'ar' ? (item.nameAr || item.name) : item.name}</td>
                      <td style={{ padding: '1rem', color: item.amount >= 0 ? '#4ade80' : '#f87171', fontWeight: 'bold', textAlign: lang === 'ar' ? 'left' : 'right' }}>
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--accent-secondary)', fontSize: '1.2rem', marginBottom: '1rem' }}>{lang === 'ar' ? 'الأنشطة الاستثمارية' : 'Investing Activities'}</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                <tbody>
                  {cashFlowData.investing.map((item: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem' }}>{lang === 'ar' ? (item.nameAr || item.name) : item.name}</td>
                      <td style={{ padding: '1rem', color: item.amount >= 0 ? '#4ade80' : '#f87171', fontWeight: 'bold', textAlign: lang === 'ar' ? 'left' : 'right' }}>
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                  {cashFlowData.investing.length === 0 && <tr><td colSpan={2} style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لا توجد حركات' : 'No transactions'}</td></tr>}
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: '#eab308', fontSize: '1.2rem', marginBottom: '1rem' }}>{lang === 'ar' ? 'الأنشطة التمويلية' : 'Financing Activities'}</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                <tbody>
                  {cashFlowData.financing.map((item: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem' }}>{lang === 'ar' ? (item.nameAr || item.name) : item.name}</td>
                      <td style={{ padding: '1rem', color: item.amount >= 0 ? '#4ade80' : '#f87171', fontWeight: 'bold', textAlign: lang === 'ar' ? 'left' : 'right' }}>
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                  {cashFlowData.financing.length === 0 && <tr><td colSpan={2} style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لا توجد حركات' : 'No transactions'}</td></tr>}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '1.5rem', background: cashFlowData.netCashFlow >= 0 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${cashFlowData.netCashFlow >= 0 ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}` }}>
              <h3 style={{ margin: 0, color: 'white' }}>{lang === 'ar' ? 'صافي التدفقات النقدية' : 'Net Cash Flow'}</h3>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: cashFlowData.netCashFlow >= 0 ? '#4ade80' : '#f87171' }}>
                {formatCurrency(cashFlowData.netCashFlow)}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'general-journal' && generalJournalData && (
        <div className="report-section animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="card glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>{lang === 'ar' ? 'دفتر اليومية العامة' : 'General Journal'}</h3>
              <button onClick={handlePrint} className="btn btn-secondary no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🖨️ {lang === 'ar' ? 'طباعة' : 'Print'}</button>
            </div>
            
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{lang === 'ar' ? 'المرجع' : 'Reference'}</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{lang === 'ar' ? 'الحساب' : 'Account'}</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{lang === 'ar' ? 'البيان' : 'Description'}</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{lang === 'ar' ? 'مدين' : 'Debit'}</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{lang === 'ar' ? 'دائن' : 'Credit'}</th>
                  </tr>
                </thead>
                <tbody>
                  {generalJournalData.length > 0 ? generalJournalData.map((entry, idx) => (
                    <tr key={entry.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{new Date(entry.date).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>{entry.reference}</td>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{entry.accountCode} - {lang === 'ar' ? (entry.accountNameAr || entry.accountName) : entry.accountName}</td>
                      <td style={{ padding: '1rem', color: '#cbd5e1' }}>{entry.description}</td>
                      <td style={{ padding: '1rem', color: entry.debit > 0 ? '#4ade80' : 'inherit', fontWeight: entry.debit > 0 ? 'bold' : 'normal' }}>
                        {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                      </td>
                      <td style={{ padding: '1rem', color: entry.credit > 0 ? '#f87171' : 'inherit', fontWeight: entry.credit > 0 ? 'bold' : 'normal' }}>
                        {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لا توجد قيود يومية في هذه الفترة' : 'No journal entries in this period'}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bank-reconciliation' && bankReconData && (
        <div className="report-section animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="card glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>{lang === 'ar' ? 'تسوية الحسابات البنكية' : 'Bank Reconciliation'}</h3>
              <button onClick={handlePrint} className="btn btn-secondary no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🖨️ {lang === 'ar' ? 'طباعة' : 'Print'}</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'رصيد الدفاتر (النظام)' : 'System Balance'}</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{formatCurrency(bankReconData.systemBalance)}</div>
              </div>
              <div style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#fca5a5' }}>{lang === 'ar' ? 'مبالغ معلقة (غير مسواة)' : 'Uncleared Amount'}</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f87171' }}>{formatCurrency(bankReconData.unclearedAmount)}</div>
              </div>
              <div style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.2)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#86efac' }}>{lang === 'ar' ? 'الرصيد البنكي المعدل' : 'Adjusted Bank Balance'}</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' }}>{formatCurrency(bankReconData.systemBalance - bankReconData.unclearedAmount)}</div>
              </div>
            </div>

            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>{lang === 'ar' ? 'الحركات المعلقة' : 'Uncleared Transactions'}</h4>
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{lang === 'ar' ? 'المرجع' : 'Reference'}</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{lang === 'ar' ? 'البيان' : 'Description'}</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{lang === 'ar' ? 'إيداع' : 'Deposit'}</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{lang === 'ar' ? 'سحب' : 'Withdrawal'}</th>
                  </tr>
                </thead>
                <tbody>
                  {bankReconData.unclearedTransactions.length > 0 ? bankReconData.unclearedTransactions.map((t: any) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{new Date(t.date).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>{t.reference}</td>
                      <td style={{ padding: '1rem' }}>{t.description}</td>
                      <td style={{ padding: '1rem', color: t.debit > 0 ? '#4ade80' : 'inherit' }}>{t.debit > 0 ? formatCurrency(t.debit) : '-'}</td>
                      <td style={{ padding: '1rem', color: t.credit > 0 ? '#f87171' : 'inherit' }}>{t.credit > 0 ? formatCurrency(t.credit) : '-'}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#4ade80' }}>{lang === 'ar' ? 'لا توجد حركات معلقة! الحساب مطابق.' : 'No uncleared transactions! Account is matched.'}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      
      {/* <!-- EQUITY CHANGES START --> */}
      {activeTab === 'equity-changes' && equityChangesData && (
        <div className="card animate-in" style={{ marginBottom: '2rem' }}>
          <div className="card-header no-print">
            <h2 className="card-title">{lang === 'ar' ? 'قائمة التغيرات في حقوق الملكية' : 'Statement of Changes in Equity'}</h2>
            <button onClick={handlePrint} className="btn-secondary" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white', fontSize: '0.8rem' }}>
              {lang === 'ar' ? 'طباعة' : 'Print'}
            </button>
            <div className="dropdown">
              <button className="btn-secondary" onClick={() => handleFetchReport()}>{lang === 'ar' ? 'تحديث' : 'Refresh'}</button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'رمز الحساب' : 'Account Code'}</th>
                  <th>{lang === 'ar' ? 'اسم الحساب' : 'Account Name'}</th>
                  <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الرصيد الافتتاحي' : 'Opening Balance'}</th>
                  <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الإضافات / الأرباح' : 'Additions / Earnings'}</th>
                  <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الاستقطاعات / المسحوبات' : 'Deductions / Drawings'}</th>
                  <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الرصيد الختامي' : 'Ending Balance'}</th>
                </tr>
              </thead>
              <tbody>
                {equityChangesData.accounts.map((acc: any) => (
                  <tr key={acc.id} style={{ background: acc.id === 'net-income' ? 'rgba(var(--accent-primary-rgb), 0.05)' : 'transparent', fontWeight: acc.id === 'net-income' ? 'bold' : 'normal' }}>
                    <td>{acc.code}</td>
                    <td>{lang === 'ar' && acc.nameAr ? acc.nameAr : acc.name}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(acc.openingBalance)}</td>
                    <td style={{ textAlign: 'right', color: acc.additions > 0 ? '#4ade80' : 'inherit' }}>{formatCurrency(acc.additions)}</td>
                    <td style={{ textAlign: 'right', color: acc.deductions > 0 ? '#f87171' : 'inherit' }}>{formatCurrency(acc.deductions)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(acc.endingBalance)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: 'rgba(255,255,255,0.05)', fontWeight: 'bold' }}>
                  <td colSpan={2}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(equityChangesData.totalOpening)}</td>
                  <td style={{ textAlign: 'right', color: '#4ade80' }}>{formatCurrency(equityChangesData.totalAdditions)}</td>
                  <td style={{ textAlign: 'right', color: '#f87171' }}>{formatCurrency(equityChangesData.totalDeductions)}</td>
                  <td style={{ textAlign: 'right', color: 'var(--accent-secondary)' }}>{formatCurrency(equityChangesData.totalEnding)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
      {/* <!-- EQUITY CHANGES END --> */}

      {/* <!-- PERFORMANCE COMPARISON START --> */}
      {activeTab === 'performance' && (
        <div className="card animate-in">
          <div className="card-header no-print">
            <h2 className="card-title">{lang === 'ar' ? 'تقرير مقارنة الأداء' : 'Performance Comparison Report'}</h2>
            <div className="card-actions">
              <select 
                className="input-field" 
                value={performancePeriod}
                onChange={(e) => setPerformancePeriod(e.target.value as 'month' | 'year')}
                style={{ width: '150px', color: '#fff', backgroundColor: '#1e293b' }}
              >
                <option value="month">{lang === 'ar' ? 'شهري' : 'Monthly'}</option>
                <option value="year">{lang === 'ar' ? 'سنوي' : 'Yearly'}</option>
              </select>
              <button className="btn-secondary" onClick={() => handleFetchReport()}>
                {lang === 'ar' ? 'تحديث' : 'Refresh'}
              </button>
              <button className="btn-primary" onClick={handlePrint}>
                {lang === 'ar' ? 'طباعة' : 'Print'}
              </button>
            </div>
          </div>
          
          {performanceData && (
            <div className="table-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { 
                      name: lang === 'ar' ? 'الإيرادات' : 'Revenue', 
                      Current: performanceData.current.revenue, 
                      Previous: performanceData.previous.revenue 
                    },
                    { 
                      name: lang === 'ar' ? 'المصروفات' : 'Expenses', 
                      Current: performanceData.current.expense, 
                      Previous: performanceData.previous.expense 
                    },
                    { 
                      name: lang === 'ar' ? 'صافي الربح' : 'Net Profit', 
                      Current: performanceData.current.netProfit, 
                      Previous: performanceData.previous.netProfit 
                    },
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" tickFormatter={(value) => `${(value / 1000)}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                    <Legend />
                    <Bar dataKey="Current" name={lang === 'ar' ? 'الفترة الحالية' : 'Current Period'} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Previous" name={lang === 'ar' ? 'الفترة السابقة' : 'Previous Period'} fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>{lang === 'ar' ? 'البيان' : 'Description'}</th>
                    <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الفترة الحالية' : 'Current Period'}</th>
                    <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الفترة السابقة' : 'Previous Period'}</th>
                    <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'التغير' : 'Variance'}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: lang === 'ar' ? 'الإيرادات' : 'Revenue', key: 'revenue' },
                    { label: lang === 'ar' ? 'المصروفات' : 'Expenses', key: 'expense' },
                    { label: lang === 'ar' ? 'صافي الربح' : 'Net Profit', key: 'netProfit' },
                  ].map(metric => {
                    const currentVal = performanceData.current[metric.key];
                    const prevVal = performanceData.previous[metric.key];
                    const diff = currentVal - prevVal;
                    const percentChange = prevVal === 0 ? (currentVal > 0 ? 100 : 0) : (diff / prevVal) * 100;
                    
                    return (
                      <tr key={metric.key}>
                        <td><strong>{metric.label}</strong></td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(currentVal)}</td>
                        <td style={{ textAlign: 'right' }}>{formatCurrency(prevVal)}</td>
                        <td style={{ textAlign: 'right', color: diff >= 0 ? '#10b981' : '#f43f5e' }}>
                          {formatCurrency(diff)} ({diff >= 0 ? '+' : ''}{percentChange.toFixed(1)}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* <!-- PERFORMANCE COMPARISON END --> */}

      {selectedLedgerAccount && (
        <LedgerModal
          accountId={selectedLedgerAccount.id}
          accountName={selectedLedgerAccount.name}
          accountCode={selectedLedgerAccount.code}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setSelectedLedgerAccount(null)}
          lang={lang}
          dict={dict}
        />
      )}

      {showContactModal && selectedContact && (
        <ContactStatementModal
          contact={selectedContact}
          type={contactType}
          startDate={startDate}
          endDate={endDate}
          lang={lang}
          dict={dict}
          onClose={() => setShowContactModal(false)}
        />
      )}


      <style jsx>{`
        .reports-module { color: inherit; }
        .page-title { 
          color: var(--text-primary) !important; 
        }
        .page-subtitle { 
          color: var(--text-secondary) !important; 
        }
        .card { 
          background: var(--card-bg) !important; 
          color: var(--text-primary) !important; 
          backdrop-filter: blur(12px); 
          border: 1px solid var(--glass-border) !important;
          box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.04);
        }
        .card-title { 
          color: var(--text-primary) !important; 
          font-weight: 800 !important; 
        }
        .table-container {
          border-radius: 8px;
          overflow-x: auto;
        }
        .table-container table {
          width: 100%;
          border-collapse: collapse;
        }
        .table-container th { 
          color: var(--text-secondary) !important; 
          background: var(--chip-bg, #f8fafc) !important; 
          border-bottom: 2px solid var(--glass-border) !important; 
          text-align: right; 
          font-weight: 700 !important;
          padding: 1rem !important;
          font-size: 0.9rem !important;
        }
        .table-container td { 
          color: var(--text-primary) !important; 
          border-bottom: 1px solid var(--glass-border) !important; 
          padding: 0.85rem 1rem !important;
        }
        .hover-row:hover td { 
          background: var(--glass-hover) !important; 
        }
        .report-section h3, .report-section h4 { 
          font-weight: 800 !important; 
          color: var(--text-primary);
        }
        .report-section span { 
          color: inherit !important; 
        }
        .filter-label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 600;
        }
        .form-input {
          background: var(--chip-bg) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--glass-border) !important;
          padding: 0.6rem 0.85rem !important;
          border-radius: 8px !important;
          outline: none;
        }
        .form-input:focus {
          border-color: var(--accent-primary) !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
        }
        
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

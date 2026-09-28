'use client';

import React from 'react';
import Link from 'next/link';
import WelcomePopup from './WelcomePopup';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function DashboardClient({
  dict,
  lang,
  stats,
  recentTransactions,
  recentSalesInvoices = [],
  recentPurchaseInvoices = [],
  topExpenses = [],
  pendingInvoicesCount,
  pendingInvoicesAmount,
  chartData,
  monthlyPerformance,
  yearlyPerformance
}: {
  dict: any;
  lang: string;
  stats: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    cashBalance: number;
    receivables: number;
    payables: number;
  };
  recentTransactions: any[];
  recentSalesInvoices: any[];
  recentPurchaseInvoices: any[];
  topExpenses: any[];
  pendingInvoicesCount: number;
  pendingInvoicesAmount: number;
  chartData: any[];
  monthlyPerformance?: any;
  yearlyPerformance?: any;
}) {
  const [perfPeriod, setPerfPeriod] = React.useState<'month' | 'year'>('month');
  const currentPerfData = perfPeriod === 'month' ? monthlyPerformance : yearlyPerformance;
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2
    });
  };

  const revenueLabel = lang === 'ar' ? 'الإيرادات' : 'Revenue';
  const expensesLabel = lang === 'ar' ? 'المصروفات' : 'Expenses';
  const COLORS = ['#f43f5e', '#f97316', '#eab308', '#8b5cf6', '#0ea5e9'];

  return (
    <div className="dashboard-module">
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{dict.title || (lang === 'ar' ? 'لوحة التحكم' : 'Dashboard')}</h1>
          <p className="page-subtitle">{dict.subtitle || (lang === 'ar' ? 'نظرة عامة على الأداء المالي' : 'Financial Performance Overview')}</p>
        </div>
        
        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/sales" className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            {lang === 'ar' ? 'فواتير المبيعات' : 'Sales Invoices'}
          </Link>
          <Link href="/financial" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            {lang === 'ar' ? 'القيود المحاسبية' : 'Journal Entries'}
          </Link>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: '2rem' }}>
        {/* Revenue */}
        <div className="stat-card" style={{ '--stat-color': '#10b981', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' } as React.CSSProperties}>
          <div className="stat-top">
            <span className="stat-label">{dict.revenue || revenueLabel}</span>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
          </div>
          <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
          <div className="stat-bottom">
            <span className="trend-text" style={{ color: '#10b981' }}>{lang === 'ar' ? 'للسنة المالية الحالية' : 'For current fiscal year'}</span>
          </div>
        </div>

        {/* Expenses */}
        <div className="stat-card" style={{ '--stat-color': '#f43f5e', background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)' } as React.CSSProperties}>
          <div className="stat-top">
            <span className="stat-label">{dict.expenses || expensesLabel}</span>
            <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="12" y1="14" x2="12" y2="10"></line></svg>
            </div>
          </div>
          <div className="stat-value">{formatCurrency(stats.totalExpenses)}</div>
          <div className="stat-bottom">
            <span className="trend-text" style={{ color: '#f43f5e' }}>{lang === 'ar' ? 'للسنة المالية الحالية' : 'For current fiscal year'}</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="stat-card" style={{ '--stat-color': stats.netProfit >= 0 ? '#3b82f6' : '#f43f5e', background: stats.netProfit >= 0 ? 'rgba(59, 130, 246, 0.05)' : 'rgba(244, 63, 94, 0.05)', border: `1px solid ${stats.netProfit >= 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(244, 63, 94, 0.2)'}` } as React.CSSProperties}>
          <div className="stat-top">
            <span className="stat-label">{dict.netProfit || (lang === 'ar' ? 'صافي الربح' : 'Net Profit')}</span>
            <div className="stat-icon" style={{ background: stats.netProfit >= 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(244, 63, 94, 0.1)', color: stats.netProfit >= 0 ? '#3b82f6' : '#f43f5e' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
          </div>
          <div className="stat-value">{formatCurrency(stats.netProfit)}</div>
          <div className="stat-bottom">
            <span className="trend-text" style={{ color: stats.netProfit >= 0 ? '#3b82f6' : '#f43f5e' }}>{lang === 'ar' ? 'الإيرادات ناقص المصروفات' : 'Revenue minus expenses'}</span>
          </div>
        </div>
        
        {/* Cash Balance */}
        <div className="stat-card" style={{ '--stat-color': '#0ea5e9', background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)' } as React.CSSProperties}>
          <div className="stat-top">
            <span className="stat-label">{lang === 'ar' ? 'السيولة النقدية والبنوك' : 'Cash & Banks'}</span>
            <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
            </div>
          </div>
          <div className="stat-value">{formatCurrency(stats.cashBalance)}</div>
          <div className="stat-bottom">
            <span className="trend-text" style={{ color: '#0ea5e9' }}>{lang === 'ar' ? 'إجمالي الأرصدة النقدية' : 'Total cash balances'}</span>
          </div>
        </div>

        {/* Receivables */}
        <div className="stat-card" style={{ '--stat-color': '#8b5cf6', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' } as React.CSSProperties}>
          <div className="stat-top">
            <span className="stat-label">{lang === 'ar' ? 'ديون العملاء (ذمم مدينة)' : 'Receivables'}</span>
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>
          <div className="stat-value">{formatCurrency(stats.receivables)}</div>
          <div className="stat-bottom">
            <span className="trend-text" style={{ color: '#8b5cf6' }}>{lang === 'ar' ? 'مبالغ مستحقة للشركة' : 'Amounts owed to company'}</span>
          </div>
        </div>

        {/* Payables */}
        <div className="stat-card" style={{ '--stat-color': '#f97316', background: 'rgba(249, 115, 22, 0.05)', border: '1px solid rgba(249, 115, 22, 0.2)' } as React.CSSProperties}>
          <div className="stat-top">
            <span className="stat-label">{lang === 'ar' ? 'التزامات الموردين (ذمم دائنة)' : 'Payables'}</span>
            <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
          </div>
          <div className="stat-value">{formatCurrency(stats.payables)}</div>
          <div className="stat-bottom">
            <span className="trend-text" style={{ color: '#f97316' }}>{lang === 'ar' ? 'مبالغ مستحقة على الشركة' : 'Amounts owed by company'}</span>
          </div>
        </div>
      </div>

      {/* Performance Comparison Widget */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="card-title" style={{ margin: 0 }}>{lang === 'ar' ? 'مقارنة الأداء' : 'Performance Comparison'}</h2>
          <select 
            className="input-field" 
            style={{ width: 'auto', padding: '0.4rem 1rem', backgroundColor: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            value={perfPeriod}
            onChange={(e) => setPerfPeriod(e.target.value as 'month' | 'year')}
          >
            <option value="month" style={{ color: '#fff', backgroundColor: '#1e293b' }}>{lang === 'ar' ? 'شهري' : 'Monthly'}</option>
            <option value="year" style={{ color: '#fff', backgroundColor: '#1e293b' }}>{lang === 'ar' ? 'سنوي' : 'Yearly'}</option>
          </select>
        </div>
        
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { label: lang === 'ar' ? 'الإيرادات' : 'Revenue', key: 'revenue', color: '#10b981' },
            { label: lang === 'ar' ? 'المصروفات' : 'Expenses', key: 'expense', color: '#f43f5e' },
            { label: lang === 'ar' ? 'صافي الربح' : 'Net Profit', key: 'netProfit', color: '#3b82f6' },
          ].map(metric => {
            const currentVal = currentPerfData?.current?.[metric.key] || 0;
            const prevVal = currentPerfData?.previous?.[metric.key] || 0;
            const diff = currentVal - prevVal;
            const percentChange = prevVal === 0 ? (currentVal > 0 ? 100 : 0) : (diff / prevVal) * 100;
            const isPositive = diff >= 0;
            const trendColor = metric.key === 'expense' ? (isPositive ? '#f43f5e' : '#10b981') : (isPositive ? '#10b981' : '#f43f5e');

            return (
              <div key={metric.key} style={{ padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '0.75rem', border: `1px solid ${metric.color}33` }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{metric.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: metric.color }}>
                  {formatCurrency(currentVal)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'السابق:' : 'Prev:'} {formatCurrency(prevVal)}</span>
                  <span style={{ color: trendColor, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {isPositive ? '▲' : '▼'} {Math.abs(percentChange).toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h2 className="card-title">{lang === 'ar' ? 'تحليل الإيرادات والمصروفات' : 'Revenue & Expenses Analysis'}</h2>
          </div>
          <div className="chart-area" style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.7)'}} />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)" 
                    tick={{fill: 'rgba(255,255,255,0.7)'}}
                    tickFormatter={(value) => `${(value / 1000)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any) => [formatCurrency(Number(value)), '']}
                  />
                  <Legend />
                  <Area type="monotone" name={revenueLabel} dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" name={expensesLabel} dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'لا توجد بيانات كافية للرسم البياني' : 'Not enough data for chart'}
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h2 className="card-title">{lang === 'ar' ? 'تحليل المصروفات (أعلى 5)' : 'Top 5 Expenses'}</h2>
          </div>
          <div className="chart-area" style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            {topExpenses && topExpenses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topExpenses}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="amount"
                    nameKey={lang === 'ar' ? 'nameAr' : 'name'}
                  >
                    {topExpenses.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any) => [formatCurrency(Number(value)), '']}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'لا توجد مصروفات' : 'No expenses found'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        
        {/* Recent Sales Invoices */}
        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h2 className="card-title">{lang === 'ar' ? 'أحدث المبيعات' : 'Recent Sales'}</h2>
            <Link href="/sales" className="card-actions">{dict.viewAll || (lang === 'ar' ? 'عرض الكل' : 'View All')}</Link>
          </div>
          <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody>
                {recentSalesInvoices.length === 0 && (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'لا توجد فواتير مبيعات' : 'No sales invoices'}
                    </td>
                  </tr>
                )}
                {recentSalesInvoices.map((inv: any) => (
                  <tr key={inv.id}>
                    <td>
                      <div className="flex-cell">
                        <div className="txn-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        </div>
                        <div className="flex-col">
                          <span style={{ fontWeight: '500' }}>{lang === 'ar' ? inv.customer.nameAr || inv.customer.name : inv.customer.name}</span>
                          <span className="text-sub">{inv.invoiceNumber} • <span suppressHydrationWarning>{new Date(inv.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span></span>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      <span suppressHydrationWarning>{formatCurrency(inv.netAmount)}</span>
                      <div style={{ fontSize: '0.75rem', fontWeight: 'normal', color: inv.status === 'Paid' || inv.status === 'مدفوعة' ? '#10b981' : '#f59e0b' }}>
                        {inv.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Purchase Invoices */}
        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h2 className="card-title">{lang === 'ar' ? 'أحدث المشتريات' : 'Recent Purchases'}</h2>
            <Link href="/purchases" className="card-actions">{dict.viewAll || (lang === 'ar' ? 'عرض الكل' : 'View All')}</Link>
          </div>
          <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'المورد' : 'Supplier'}</th>
                  <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody>
                {recentPurchaseInvoices.length === 0 && (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'لا توجد فواتير مشتريات' : 'No purchase invoices'}
                    </td>
                  </tr>
                )}
                {recentPurchaseInvoices.map((inv: any) => (
                  <tr key={inv.id}>
                    <td>
                      <div className="flex-cell">
                        <div className="txn-icon" style={{ color: '#f43f5e', background: 'rgba(244, 63, 94, 0.1)' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>
                        </div>
                        <div className="flex-col">
                          <span style={{ fontWeight: '500' }}>{inv.supplier ? (lang === 'ar' ? inv.supplier.nameAr || inv.supplier.name : inv.supplier.name) : '---'}</span>
                          <span className="text-sub">{inv.invoiceNumber} • <span suppressHydrationWarning>{new Date(inv.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span></span>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      <span suppressHydrationWarning>{formatCurrency(inv.netAmount)}</span>
                      <div style={{ fontSize: '0.75rem', fontWeight: 'normal', color: inv.status === 'Paid' || inv.status === 'مدفوعة' ? '#10b981' : '#f59e0b' }}>
                        {inv.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions (Journals) */}
        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h2 className="card-title">{dict.recentTx || (lang === 'ar' ? 'القيود المحاسبية' : 'Journal Entries')}</h2>
            <Link href="/financial" className="card-actions">{dict.viewAll || (lang === 'ar' ? 'عرض الكل' : 'View All')}</Link>
          </div>
          <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>{dict.recentTx || (lang === 'ar' ? 'العملية' : 'Transaction')}</th>
                  <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      {dict.noTx || (lang === 'ar' ? 'لا توجد حركات مؤخراً' : 'No recent transactions')}
                    </td>
                  </tr>
                )}
                {recentTransactions.map((jv: any) => {
                  const total = jv.entries.reduce((s: number, e: any) => s + e.debit, 0);
                  return (
                    <tr key={jv.id}>
                      <td>
                        <div className="flex-cell">
                          <div className="txn-icon" style={{ color: 'var(--accent-primary)', background: 'rgba(59, 130, 246, 0.1)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                          </div>
                          <div className="flex-col">
                            <span style={{ fontWeight: '500' }}>{jv.description}</span>
                            <span className="text-sub">{jv.reference} • <span suppressHydrationWarning>{new Date(jv.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span></span>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        <span suppressHydrationWarning>{formatCurrency(total)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <WelcomePopup lang={lang} />
    </div>
  );
}

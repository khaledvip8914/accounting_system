'use client';

import React, { useState, useEffect } from 'react';
import SalaryRecords from './SalaryRecords';
import PayrollRun from './PayrollRun';
import PayrollHistory from './PayrollHistory';

export default function SalariesClient({ lang, companyName, companyLogo }: { lang: string, companyName?: string, companyLogo?: string | null }) {
  const [activeTab, setActiveTab] = useState<'records' | 'run' | 'history'>('records');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'records' || tabParam === 'run' || tabParam === 'history') {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleTabChange = (tab: 'records' | 'run' | 'history') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('tab', tab);
      window.history.replaceState({}, '', newUrl);
    }
  };

  return (
    <div className="page-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="page-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        background: 'var(--glass-bg)',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2.2rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {lang === 'ar' ? 'مسير الرواتب' : 'Payroll'}
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>
            {lang === 'ar' ? 'سجلات الرواتب وإصدار مسيرات الرواتب الشهرية' : 'Salary records and monthly payroll run'}
          </p>
        </div>
      </div>

      <div className="tabs-container no-print" style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        background: 'rgba(255,255,255,0.03)',
        padding: '0.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '2rem',
        overflowX: 'auto'
      }}>
        <button 
          onClick={() => handleTabChange('records')}
          style={{
            flex: '1',
            padding: '1rem 1.5rem',
            background: activeTab === 'records' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'records' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: activeTab === 'records' ? 'bold' : 'normal',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
        >
          {lang === 'ar' ? 'سجلات الرواتب' : 'Salary Records'}
        </button>
        <button 
          onClick={() => handleTabChange('run')}
          style={{
            flex: '1',
            padding: '1rem 1.5rem',
            background: activeTab === 'run' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'run' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: activeTab === 'run' ? 'bold' : 'normal',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
        >
          {lang === 'ar' ? 'إصدار مسير الرواتب' : 'Run Payroll'}
        </button>
        <button 
          onClick={() => handleTabChange('history')}
          style={{
            flex: '1',
            padding: '1rem 1.5rem',
            background: activeTab === 'history' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'history' ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: activeTab === 'history' ? 'bold' : 'normal',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
        >
          {lang === 'ar' ? 'سجل المسيرات' : 'Payroll History'}
        </button>
      </div>

      <div className="tab-content animate-in">
        {activeTab === 'records' && (
          <SalaryRecords 
            lang={lang} 
            companyName={companyName} 
            companyLogo={companyLogo} 
            defaultMonth={selectedMonth || undefined} 
            defaultYear={selectedYear || undefined} 
          />
        )}
        {activeTab === 'run' && (
          <PayrollRun lang={lang} companyName={companyName} companyLogo={companyLogo} />
        )}
        {activeTab === 'history' && (
          <PayrollHistory 
            lang={lang} 
            companyName={companyName}
            companyLogo={companyLogo}
          />
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PayrollSettingsClient({ initialSettings, initialAllowances, initialDeductions, accounts, lang }: any) {
  const [activeTab, setActiveTab] = useState('accounts');
  const [settings, setSettings] = useState(initialSettings);
  const [allowances, setAllowances] = useState(initialAllowances);
  const [deductions, setDeductions] = useState(initialDeductions);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Modals state
  const [isAllowanceModalOpen, setIsAllowanceModalOpen] = useState(false);
  const [currentAllowance, setCurrentAllowance] = useState<any>(null);
  
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
  const [currentDeduction, setCurrentDeduction] = useState<any>(null);

  const t = {
    title: lang === 'ar' ? 'إعدادات الرواتب' : 'Payroll Settings',
    subtitle: lang === 'ar' ? 'إدارة ربط الحسابات، التأمينات، والبدلات للرواتب' : 'Manage account mapping, GOSI, and allowances for payroll',
    tabs: {
      accounts: lang === 'ar' ? 'ربط الحسابات' : 'Account Mapping',
      gosi: lang === 'ar' ? 'التأمينات والمخصصات' : 'GOSI & Provisions',
      general: lang === 'ar' ? 'إعدادات عامة' : 'General Settings',
      allowances: lang === 'ar' ? 'أنواع البدلات' : 'Allowances Types',
      deductions: lang === 'ar' ? 'أنواع الخصومات' : 'Deductions Types'
    },
    save: lang === 'ar' ? 'حفظ الإعدادات' : 'Save Settings',
    addAllowance: lang === 'ar' ? '+ إضافة بدل' : '+ Add Allowance',
    addDeduction: lang === 'ar' ? '+ إضافة خصم' : '+ Add Deduction'
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setSettings((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const saveSettings = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/v1/settings/payroll', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setMessage({ type: 'success', text: lang === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully' });
      } else {
        setMessage({ type: 'error', text: lang === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving settings' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Error saving settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const openAllowanceModal = (allowance: any = null) => {
    setCurrentAllowance(allowance || { name: '', nameAr: '', type: 'Fixed', isGosiTaxable: false, defaultAmount: 0, overrideAccountId: '', isActive: true });
    setIsAllowanceModalOpen(true);
  };

  const saveAllowance = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !currentAllowance.id;
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/v1/settings/payroll/allowances' : `/api/v1/settings/payroll/allowances/${currentAllowance.id}`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentAllowance)
      });
      if (res.ok) {
        const saved = await res.json();
        if (isNew) {
          setAllowances([saved, ...allowances]);
        } else {
          setAllowances(allowances.map((a: any) => a.id === saved.id ? saved : a));
        }
        setIsAllowanceModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openDeductionModal = (deduction: any = null) => {
    setCurrentDeduction(deduction || { name: '', nameAr: '', type: 'FixedAmount', overrideAccountId: '', isActive: true });
    setIsDeductionModalOpen(true);
  };

  const saveDeduction = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !currentDeduction.id;
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/v1/settings/payroll/deductions' : `/api/v1/settings/payroll/deductions/${currentDeduction.id}`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentDeduction)
      });
      if (res.ok) {
        const saved = await res.json();
        if (isNew) {
          setDeductions([saved, ...deductions]);
        } else {
          setDeductions(deductions.map((d: any) => d.id === saved.id ? saved : d));
        }
        setIsDeductionModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderAccountSelect = (name: string, label: string) => (
    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
      <label>{label}</label>
      <select className="form-control" name={name} value={settings[name] || ''} onChange={handleSettingsChange}>
        <option value="">{lang === 'ar' ? '--- اختر حساباً ---' : '--- Select Account ---'}</option>
        {accounts.map((a: any) => (
          <option key={a.id} value={a.id}>{a.code} - {lang === 'ar' ? (a.nameAr || a.name) : a.name}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="page-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/settings" className="back-btn" style={{ textDecoration: 'none', background: 'var(--glass-bg)', padding: '0.5rem', borderRadius: '50%', display: 'flex', border: '1px solid var(--glass-border)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {lang === 'ar' ? <polyline points="15 18 9 12 15 6"></polyline> : <polyline points="9 18 15 12 9 6"></polyline>}
            </svg>
          </Link>
          <div>
            <h1 className="page-title">{t.title}</h1>
            <p className="page-subtitle">{t.subtitle}</p>
          </div>
        </div>
        
        {['accounts', 'gosi', 'general'].includes(activeTab) && (
          <button className="btn-primary" onClick={saveSettings} disabled={isLoading}>
            {isLoading ? '...' : t.save}
          </button>
        )}
        {activeTab === 'allowances' && (
          <button className="btn-primary" onClick={() => openAllowanceModal()}>{t.addAllowance}</button>
        )}
        {activeTab === 'deductions' && (
          <button className="btn-primary" onClick={() => openDeductionModal()}>{t.addDeduction}</button>
        )}
      </div>

      {message.text && (
        <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '8px', background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: message.type === 'error' ? '#ef4444' : '#22c55e', border: `1px solid ${message.type === 'error' ? '#ef4444' : '#22c55e'}` }}>
          {message.text}
        </div>
      )}

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '2rem', overflowX: 'auto' }}>
        {Object.entries(t.tabs).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === key ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === key ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: activeTab === key ? '600' : '400',
              whiteSpace: 'nowrap'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {activeTab === 'accounts' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>{lang === 'ar' ? 'حسابات الرواتب الأساسية' : 'Basic Salary Accounts'}</h3>
              {renderAccountSelect('basicSalaryAccountId', lang === 'ar' ? 'حساب الرواتب الأساسية (مصروف)' : 'Basic Salary (Expense)')}
              {renderAccountSelect('allowancesAccountId', lang === 'ar' ? 'حساب البدلات (مصروف)' : 'Allowances (Expense)')}
              {renderAccountSelect('deductionsAccountId', lang === 'ar' ? 'حساب الخصومات (إيراد/تخفيض مصروف)' : 'Deductions (Income/Expense reduction)')}
              {renderAccountSelect('employeeLoansAccountId', lang === 'ar' ? 'حساب سلف الموظفين (أصل متداول)' : 'Employee Loans (Asset)')}
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>{lang === 'ar' ? 'حسابات الالتزامات والتأمينات' : 'Liabilities & GOSI'}</h3>
              {renderAccountSelect('accruedSalariesAccountId', lang === 'ar' ? 'حساب الرواتب المستحقة (التزام)' : 'Accrued Salaries (Liability)')}
              {renderAccountSelect('gosiCompanyExpenseAccountId', lang === 'ar' ? 'مصروف التأمينات - حصة الشركة' : 'GOSI Company Share (Expense)')}
              {renderAccountSelect('gosiPayableAccountId', lang === 'ar' ? 'التأمينات المستحقة الدفع (التزام)' : 'GOSI Payable (Liability)')}
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>{lang === 'ar' ? 'حسابات المخصصات' : 'Provisions Accounts'}</h3>
              {renderAccountSelect('endOfServiceExpenseAccountId', lang === 'ar' ? 'مصروف نهاية الخدمة' : 'EOS Expense')}
              {renderAccountSelect('endOfServiceProvisionAccountId', lang === 'ar' ? 'مخصص نهاية الخدمة (التزام)' : 'EOS Provision (Liability)')}
              {renderAccountSelect('vacationExpenseAccountId', lang === 'ar' ? 'مصروف الإجازات' : 'Vacation Expense')}
              {renderAccountSelect('vacationProvisionAccountId', lang === 'ar' ? 'مخصص الإجازات (التزام)' : 'Vacation Provision (Liability)')}
            </div>
          </div>
        )}

        {activeTab === 'gosi' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>{lang === 'ar' ? 'إعدادات التأمينات الاجتماعية (GOSI)' : 'GOSI Settings'}</h3>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{lang === 'ar' ? 'نسبة استقطاع الموظف (%)' : 'Employee Deduction Ratio (%)'}</label>
                <input type="number" step="0.01" className="form-control" name="gosiEmployeeRatio" value={settings.gosiEmployeeRatio} onChange={handleSettingsChange} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{lang === 'ar' ? 'نسبة مساهمة الشركة (%)' : 'Company Contribution Ratio (%)'}</label>
                <input type="number" step="0.01" className="form-control" name="gosiCompanyRatio" value={settings.gosiCompanyRatio} onChange={handleSettingsChange} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{lang === 'ar' ? 'الحد الأعلى للراتب الخاضع للتأمينات' : 'Maximum GOSI Salary Cap'}</label>
                <input type="number" className="form-control" name="gosiMaxSalary" value={settings.gosiMaxSalary} onChange={handleSettingsChange} />
              </div>
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>{lang === 'ar' ? 'تفعيل المخصصات الشهرية' : 'Monthly Provisions Activation'}</h3>
              <div className="form-group" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="enableEndOfServiceProvision" checked={settings.enableEndOfServiceProvision} onChange={handleSettingsChange} style={{ width: '20px', height: '20px' }} />
                <label style={{ margin: 0 }}>{lang === 'ar' ? 'احتساب وإنشاء قيد مخصص نهاية الخدمة آلياً مع كل مسير' : 'Automatically calculate and accrue EOS provision with each payroll'}</label>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="enableVacationProvision" checked={settings.enableVacationProvision} onChange={handleSettingsChange} style={{ width: '20px', height: '20px' }} />
                <label style={{ margin: 0 }}>{lang === 'ar' ? 'احتساب وإنشاء قيد مخصص الإجازات آلياً مع كل مسير' : 'Automatically calculate and accrue Vacation provision with each payroll'}</label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>{lang === 'ar' ? 'دورة مسير الرواتب' : 'Payroll Cycle'}</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>{lang === 'ar' ? 'يوم بداية الدورة' : 'Cycle Start Day'}</label>
                  <input type="number" min="1" max="31" className="form-control" name="payrollCycleStartDay" value={settings.payrollCycleStartDay} onChange={handleSettingsChange} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>{lang === 'ar' ? 'يوم نهاية الدورة' : 'Cycle End Day'}</label>
                  <input type="number" min="1" max="31" className="form-control" name="payrollCycleEndDay" value={settings.payrollCycleEndDay} onChange={handleSettingsChange} />
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                {lang === 'ar' ? 'مثال: من يوم 25 إلى يوم 24 من الشهر التالي.' : 'Example: From 25th to 24th of the following month.'}
              </p>
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>{lang === 'ar' ? 'الإجازات السنوية' : 'Annual Leaves'}</h3>
              <div className="form-group">
                <label>{lang === 'ar' ? 'رصيد الإجازة السنوي الافتراضي (أيام)' : 'Default Annual Leave Balance (Days)'}</label>
                <input type="number" className="form-control" name="defaultAnnualLeaveDays" value={settings.defaultAnnualLeaveDays} onChange={handleSettingsChange} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'allowances' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                  <th>{lang === 'ar' ? 'النوع' : 'Type'}</th>
                  <th>{lang === 'ar' ? 'يخضع للتأمينات' : 'GOSI Taxable'}</th>
                  <th>{lang === 'ar' ? 'المبلغ الافتراضي' : 'Default Amount'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {allowances.map((a: any) => (
                  <tr key={a.id}>
                    <td>{lang === 'ar' ? (a.nameAr || a.name) : a.name}</td>
                    <td>{a.type === 'Fixed' ? (lang === 'ar' ? 'ثابت' : 'Fixed') : (lang === 'ar' ? 'متغير' : 'Variable')}</td>
                    <td>{a.isGosiTaxable ? (lang === 'ar' ? 'نعم' : 'Yes') : (lang === 'ar' ? 'لا' : 'No')}</td>
                    <td>{a.defaultAmount}</td>
                    <td>
                      <span className={`status ${a.isActive ? 'paid' : 'overdue'}`}>{a.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'غير نشط' : 'Inactive')}</span>
                    </td>
                    <td>
                      <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }} onClick={() => openAllowanceModal(a)}>
                        {lang === 'ar' ? 'تعديل' : 'Edit'}
                      </button>
                    </td>
                  </tr>
                ))}
                {allowances.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center' }}>{lang === 'ar' ? 'لا توجد بدلات مضافة' : 'No allowances added'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'deductions' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                  <th>{lang === 'ar' ? 'النوع' : 'Type'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {deductions.map((d: any) => (
                  <tr key={d.id}>
                    <td>{lang === 'ar' ? (d.nameAr || d.name) : d.name}</td>
                    <td>{d.type === 'FixedAmount' ? (lang === 'ar' ? 'مبلغ ثابت' : 'Fixed Amount') : (d.type === 'Days' ? (lang === 'ar' ? 'أيام' : 'Days') : (lang === 'ar' ? 'ساعات' : 'Hours'))}</td>
                    <td>
                      <span className={`status ${d.isActive ? 'paid' : 'overdue'}`}>{d.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'غير نشط' : 'Inactive')}</span>
                    </td>
                    <td>
                      <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }} onClick={() => openDeductionModal(d)}>
                        {lang === 'ar' ? 'تعديل' : 'Edit'}
                      </button>
                    </td>
                  </tr>
                ))}
                {deductions.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center' }}>{lang === 'ar' ? 'لا توجد خصومات مضافة' : 'No deductions added'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Allowance Modal */}
      {isAllowanceModalOpen && currentAllowance && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              {currentAllowance.id ? (lang === 'ar' ? 'تعديل البدل' : 'Edit Allowance') : (lang === 'ar' ? 'إضافة بدل' : 'Add Allowance')}
            </h2>
            <form onSubmit={saveAllowance}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{lang === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
                <input type="text" className="form-control" required value={currentAllowance.nameAr || ''} onChange={e => setCurrentAllowance({...currentAllowance, nameAr: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
                <input type="text" className="form-control" required value={currentAllowance.name || ''} onChange={e => setCurrentAllowance({...currentAllowance, name: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{lang === 'ar' ? 'النوع' : 'Type'}</label>
                <select className="form-control" value={currentAllowance.type} onChange={e => setCurrentAllowance({...currentAllowance, type: e.target.value})}>
                  <option value="Fixed">{lang === 'ar' ? 'ثابت' : 'Fixed'}</option>
                  <option value="Variable">{lang === 'ar' ? 'متغير' : 'Variable'}</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{lang === 'ar' ? 'المبلغ الافتراضي' : 'Default Amount'}</label>
                <input type="number" step="0.01" className="form-control" value={currentAllowance.defaultAmount} onChange={e => setCurrentAllowance({...currentAllowance, defaultAmount: parseFloat(e.target.value)})} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" style={{ width: '20px', height: '20px' }} checked={currentAllowance.isGosiTaxable} onChange={e => setCurrentAllowance({...currentAllowance, isGosiTaxable: e.target.checked})} />
                <label style={{ margin: 0 }}>{lang === 'ar' ? 'يخضع للتأمينات الاجتماعية' : 'Subject to GOSI'}</label>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" style={{ width: '20px', height: '20px' }} checked={currentAllowance.isActive} onChange={e => setCurrentAllowance({...currentAllowance, isActive: e.target.checked})} />
                <label style={{ margin: 0 }}>{lang === 'ar' ? 'نشط' : 'Active'}</label>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsAllowanceModalOpen(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary">{lang === 'ar' ? 'حفظ' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deduction Modal */}
      {isDeductionModalOpen && currentDeduction && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              {currentDeduction.id ? (lang === 'ar' ? 'تعديل الخصم' : 'Edit Deduction') : (lang === 'ar' ? 'إضافة خصم' : 'Add Deduction')}
            </h2>
            <form onSubmit={saveDeduction}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{lang === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
                <input type="text" className="form-control" required value={currentDeduction.nameAr || ''} onChange={e => setCurrentDeduction({...currentDeduction, nameAr: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
                <input type="text" className="form-control" required value={currentDeduction.name || ''} onChange={e => setCurrentDeduction({...currentDeduction, name: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{lang === 'ar' ? 'النوع' : 'Type'}</label>
                <select className="form-control" value={currentDeduction.type} onChange={e => setCurrentDeduction({...currentDeduction, type: e.target.value})}>
                  <option value="FixedAmount">{lang === 'ar' ? 'مبلغ ثابت' : 'Fixed Amount'}</option>
                  <option value="Days">{lang === 'ar' ? 'أيام' : 'Days'}</option>
                  <option value="Hours">{lang === 'ar' ? 'ساعات' : 'Hours'}</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" style={{ width: '20px', height: '20px' }} checked={currentDeduction.isActive} onChange={e => setCurrentDeduction({...currentDeduction, isActive: e.target.checked})} />
                <label style={{ margin: 0 }}>{lang === 'ar' ? 'نشط' : 'Active'}</label>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsDeductionModalOpen(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary">{lang === 'ar' ? 'حفظ' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


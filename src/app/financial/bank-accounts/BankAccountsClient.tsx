'use client';

import { useState } from 'react';
import { Lang } from '@/lib/i18n';
import { createBankAccount, updateBankAccount, deleteBankAccount } from './actions';
import SearchableSelect from '@/components/SearchableSelect';

export default function BankAccountsClient({ lang, initialBankAccounts, ledgerAccounts, currencies }: { lang: Lang, initialBankAccounts: any[], ledgerAccounts: any[], currencies: any[] }) {
  const [bankAccounts, setBankAccounts] = useState(initialBankAccounts);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    bankName: '',
    bankNameAr: '',
    accountNumber: '',
    currency: currencies.find(c => c.isDefault)?.code || 'SAR',
    initialBalance: 0,
    linkedAccountId: ''
  });

  const openNew = () => {
    setEditingAccount(null);
    setFormData({
      bankName: '',
      bankNameAr: '',
      accountNumber: '',
      currency: currencies.find(c => c.isDefault)?.code || 'SAR',
      initialBalance: 0,
      linkedAccountId: ''
    });
    setShowModal(true);
  };

  const openEdit = (account: any) => {
    setEditingAccount(account);
    setFormData({
      bankName: account.bankName,
      bankNameAr: account.bankNameAr || '',
      accountNumber: account.accountNumber,
      currency: account.currency,
      initialBalance: account.initialBalance,
      linkedAccountId: account.linkedAccountId || ''
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let res;
    if (editingAccount) {
      res = await updateBankAccount(editingAccount.id, formData);
    } else {
      res = await createBankAccount(formData);
    }

    if (res.success) {
      if (editingAccount) {
        setBankAccounts(bankAccounts.map(a => a.id === editingAccount.id ? res.bankAccount : a));
      } else {
        setBankAccounts([res.bankAccount, ...bankAccounts]);
      }
      setShowModal(false);
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return;
    const res = await deleteBankAccount(id);
    if (res.success) {
      setBankAccounts(bankAccounts.filter(a => a.id !== id));
    } else {
      alert(res.error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'الحسابات البنكية' : 'Bank Accounts'}</h1>
        <button onClick={openNew} className="btn-primary">
          {lang === 'ar' ? '+ إضافة حساب بنكي' : '+ Add Bank Account'}
        </button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'اسم البنك' : 'Bank Name'}</th>
              <th>{lang === 'ar' ? 'رقم الحساب / الآيبان' : 'Account / IBAN'}</th>
              <th>{lang === 'ar' ? 'العملة' : 'Currency'}</th>
              <th>{lang === 'ar' ? 'الرصيد الحالي' : 'Current Balance'}</th>
              <th>{lang === 'ar' ? 'حساب الدفتر المرتبط' : 'Linked Ledger Account'}</th>
              <th>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {bankAccounts.map(account => {
              const linked = ledgerAccounts.find(la => la.id === account.linkedAccountId);
              return (
                <tr key={account.id}>
                  <td style={{ fontWeight: 600 }}>{lang === 'ar' && account.bankNameAr ? account.bankNameAr : account.bankName}</td>
                  <td><span className="badge">{account.accountNumber}</span></td>
                  <td>{account.currency}</td>
                  <td style={{ fontWeight: 'bold', color: account.currentBalance < 0 ? '#ef4444' : '#059669' }}>
                    {account.currentBalance.toLocaleString()}
                  </td>
                  <td>{linked ? `${linked.code} - ${lang === 'ar' && linked.nameAr ? linked.nameAr : linked.name}` : '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(account)} className="btn-secondary" style={{ padding: '0.4rem', border: 'none' }}>✏️</button>
                      <button onClick={() => handleDelete(account.id)} className="btn-secondary" style={{ padding: '0.4rem', border: 'none', background: '#fee2e2' }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {bankAccounts.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  {lang === 'ar' ? 'لا توجد حسابات بنكية' : 'No bank accounts found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingAccount ? (lang === 'ar' ? 'تعديل حساب' : 'Edit Account') : (lang === 'ar' ? 'حساب جديد' : 'New Account')}</h2>
            <form onSubmit={handleSave} className="form-grid">
              <div className="form-group">
                <label>{lang === 'ar' ? 'اسم البنك' : 'Bank Name'} (EN)</label>
                <input type="text" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'اسم البنك' : 'Bank Name'} (AR)</label>
                <input type="text" value={formData.bankNameAr} onChange={e => setFormData({...formData, bankNameAr: e.target.value})} />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'رقم الحساب / الآيبان' : 'Account Number / IBAN'}</label>
                <input type="text" value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} required style={{ direction: 'ltr' }} />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'العملة' : 'Currency'}</label>
                <select value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} required>
                  {currencies.length > 0 ? (
                    currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {lang === 'ar' && c.nameAr ? c.nameAr : c.name}</option>)
                  ) : (
                    <option value="SAR">SAR - {lang === 'ar' ? 'ريال سعودي' : 'Saudi Riyal'}</option>
                  )}
                </select>
              </div>
              
              {!editingAccount && (
                <div className="form-group">
                  <label>{lang === 'ar' ? 'الرصيد الافتتاحي' : 'Initial Balance'}</label>
                  <input type="number" step="0.01" value={formData.initialBalance} onChange={e => setFormData({...formData, initialBalance: parseFloat(e.target.value) || 0})} required />
                </div>
              )}

              <div className="form-group" style={{ gridColumn: '1 / -1', position: 'relative' }}>
                <label>{lang === 'ar' ? 'ربط بحساب الدفتر (اختياري)' : 'Link to Ledger Account (Optional)'}</label>
                <SearchableSelect
                  options={ledgerAccounts.map(a => ({ ...a, sku: a.code }))}
                  value={formData.linkedAccountId}
                  onChange={(val) => setFormData({...formData, linkedAccountId: val})}
                  lang={lang}
                />
              </div>

              <div className="modal-actions" style={{ gridColumn: '1 / -1' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary">{lang === 'ar' ? 'حفظ' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { background: #f8fafc; padding: 1rem; text-align: start; font-size: 0.875rem; color: #475569; font-weight: 600; border-bottom: 1px solid #e2e8f0; }
        .data-table td { padding: 1rem; border-bottom: 1px solid #e2e8f0; font-size: 0.875rem; color: #1e293b; }
        .badge { background: #f1f5f9; padding: 0.25rem 0.5rem; border-radius: 6px; font-weight: 600; font-size: 0.75rem; color: #475569; border: 1px solid #cbd5e1; letter-spacing: 1px; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; }
        .modal-content { background: white; padding: 2rem; border-radius: 12px; width: 100%; max-width: 600px; min-height: 550px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; flex: 1; align-content: start; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.875rem; color: #475569; }
        .form-group input, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; transition: all 0.2s; }
        .form-group input:focus, .form-group select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
        
        .btn-primary { background: #059669; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #047857; }
        .btn-secondary { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-secondary:hover { background: #e2e8f0; }
      `}</style>
    </div>
  );
}

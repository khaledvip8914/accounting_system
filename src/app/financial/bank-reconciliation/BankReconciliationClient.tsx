'use client';

import { useState } from 'react';
import { Lang } from '@/lib/i18n';
import { createBankReconciliation, completeReconciliation } from './actions';

export default function BankReconciliationClient({ lang, initialReconciliations, bankAccounts }: { lang: Lang, initialReconciliations: any[], bankAccounts: any[] }) {
  const [reconciliations, setReconciliations] = useState(initialReconciliations);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    bankAccountId: '',
    statementDate: new Date().toISOString().split('T')[0],
    statementBalance: 0
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createBankReconciliation(formData);

    if (res.success) {
      setReconciliations([res.reconciliation, ...reconciliations]);
      setShowModal(false);
      // In a real app, we would redirect to a detailed reconciliation page where we match items
    } else {
      alert(res.error);
    }
  };

  const handleComplete = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'تأكيد اكتمال التسوية؟' : 'Confirm complete reconciliation?')) return;
    const res = await completeReconciliation(id);
    if (res.success) {
      setReconciliations(reconciliations.map(r => r.id === id ? res.reconciliation : r));
    } else {
      alert(res.error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'التسويات البنكية' : 'Bank Reconciliations'}</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          {lang === 'ar' ? '+ تسوية جديدة' : '+ New Reconciliation'}
        </button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
              <th>{lang === 'ar' ? 'الحساب البنكي' : 'Bank Account'}</th>
              <th>{lang === 'ar' ? 'رصيد الكشف' : 'Statement Balance'}</th>
              <th>{lang === 'ar' ? 'رصيد الدفاتر' : 'System Balance'}</th>
              <th>{lang === 'ar' ? 'الفرق' : 'Difference'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {reconciliations.map(rec => {
              const account = bankAccounts.find(a => a.id === rec.bankAccountId);
              return (
                <tr key={rec.id}>
                  <td>{new Date(rec.statementDate).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600 }}>{account?.bankName} - {account?.accountNumber}</td>
                  <td>{rec.statementBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>{rec.systemBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td style={{ color: rec.difference === 0 ? '#059669' : '#ef4444', fontWeight: 'bold' }}>
                    {rec.difference.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span className={`status-badge ${rec.status === 'Completed' ? 'success' : 'pending'}`}>
                      {rec.status === 'Completed' ? (lang === 'ar' ? 'مكتمل' : 'Completed') : (lang === 'ar' ? 'مسودة' : 'Draft')}
                    </span>
                  </td>
                  <td>
                    {rec.status === 'Draft' && (
                      <button onClick={() => handleComplete(rec.id)} className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                        {lang === 'ar' ? 'اعتماد' : 'Complete'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {reconciliations.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  {lang === 'ar' ? 'لا توجد تسويات بنكية' : 'No bank reconciliations found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{lang === 'ar' ? 'إنشاء تسوية جديدة' : 'New Reconciliation'}</h2>
            <form onSubmit={handleSave} className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>{lang === 'ar' ? 'الحساب البنكي' : 'Bank Account'}</label>
                <select value={formData.bankAccountId} onChange={e => setFormData({...formData, bankAccountId: e.target.value})} required>
                  <option value="">{lang === 'ar' ? 'اختر الحساب...' : 'Select Account...'}</option>
                  {bankAccounts.map(a => (
                    <option key={a.id} value={a.id}>{a.bankName} - {a.accountNumber}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'تاريخ كشف الحساب' : 'Statement Date'}</label>
                <input type="date" value={formData.statementDate} onChange={e => setFormData({...formData, statementDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'رصيد كشف الحساب' : 'Statement Balance'}</label>
                <input type="number" step="0.01" value={formData.statementBalance} onChange={e => setFormData({...formData, statementBalance: parseFloat(e.target.value) || 0})} required />
              </div>
              <div className="modal-actions" style={{ gridColumn: '1 / -1' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary">{lang === 'ar' ? 'إنشاء التسوية' : 'Create Reconciliation'}</button>
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
        
        .status-badge { padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .status-badge.success { background: #dcfce7; color: #166534; }
        .status-badge.pending { background: #fef9c3; color: #854d0e; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; }
        .modal-content { background: white; padding: 2rem; border-radius: 12px; width: 100%; max-width: 500px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
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

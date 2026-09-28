'use client';

import React, { useState, useEffect } from 'react';
import { getPaymentAccounts } from './actions';

export default function PayPayrollModal({
  lang,
  totalNetSalary,
  onClose,
  onPay
}: {
  lang: string;
  totalNetSalary: number;
  onClose: () => void;
  onPay: (methods: { accountId: string; amount: number }[], notes: string, reference: string) => Promise<void>;
}) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [methods, setMethods] = useState<{ accountId: string; amount: number | '' }[]>([
    { accountId: '', amount: totalNetSalary }
  ]);
  const [notes, setNotes] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPaymentAccounts().then(setAccounts);
  }, []);

  const totalAdded = methods.reduce((s, m) => s + (Number(m.amount) || 0), 0);
  const remaining = totalNetSalary - totalAdded;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Math.abs(remaining) > 0.1) {
      alert(lang === 'ar' ? 'يجب أن يكون إجمالي الدفع مساوياً لصافي الرواتب' : 'Total payment must equal net salaries');
      return;
    }
    if (methods.some(m => !m.accountId)) {
      alert(lang === 'ar' ? 'الرجاء اختيار الحساب لكل طريقة دفع' : 'Please select an account for each payment method');
      return;
    }

    setLoading(true);
    await onPay(methods as any, notes, reference);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 2500, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="modal-content" style={{ maxWidth: '600px', width: '90%', background: 'white', borderRadius: '12px' }}>
        <div className="modal-header" style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="modal-title" style={{ margin: 0 }}>{lang === 'ar' ? 'صرف الرواتب المحددة' : 'Pay Selected Salaries'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }} type="button">×</button>
        </div>
        
        <form onSubmit={handlePay}>
          <div className="modal-body" style={{ padding: '1.5rem' }}>
            
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{lang === 'ar' ? 'إجمالي الرواتب المحددة' : 'Total Selected Net Salary'}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{totalNetSalary.toLocaleString()} SAR</div>
              </div>
              <div style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>
                <div style={{ fontSize: '0.85rem', color: remaining === 0 ? '#10b881' : '#ef4444', fontWeight: 600 }}>{lang === 'ar' ? 'المتبقي' : 'Remaining'}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: remaining === 0 ? '#10b881' : '#ef4444' }}>{remaining.toLocaleString()} SAR</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>{lang === 'ar' ? 'رقم الحوالة / المرجع' : 'Transfer No / Reference'}</label>
                <input type="text" className="form-control" value={reference} onChange={e => setReference(e.target.value)} placeholder={lang === 'ar' ? 'اختياري...' : 'Optional...'} />
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label>{lang === 'ar' ? 'ملاحظات الصرف' : 'Payment Notes'}</label>
                <input type="text" className="form-control" value={notes} onChange={e => setNotes(e.target.value)} placeholder={lang === 'ar' ? 'راتب شهر...' : 'Salary for...'} />
              </div>
            </div>

            <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>{lang === 'ar' ? 'طرق الدفع' : 'Payment Methods'}</h4>
            
            {methods.map((method, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ flex: 2 }}>
                  <select 
                    className="form-control" 
                    value={method.accountId} 
                    onChange={e => {
                      const newM = [...methods];
                      newM[idx].accountId = e.target.value;
                      setMethods(newM);
                    }}
                    required
                  >
                    <option value="">{lang === 'ar' ? 'اختر حساب الدفع...' : 'Select payment account...'}</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{lang === 'ar' && acc.nameAr ? acc.nameAr : acc.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-control" 
                    value={method.amount} 
                    onChange={e => {
                      const newM = [...methods];
                      newM[idx].amount = e.target.value === '' ? '' : parseFloat(e.target.value);
                      setMethods(newM);
                    }}
                    required
                    min="0.01"
                  />
                </div>
                {methods.length > 1 && (
                  <button type="button" onClick={() => setMethods(methods.filter((_, i) => i !== idx))} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '0.6rem 0.8rem', cursor: 'pointer' }}>
                    ×
                  </button>
                )}
              </div>
            ))}
            
            <button 
              type="button" 
              onClick={() => setMethods([...methods, { accountId: '', amount: remaining > 0 ? remaining : 0 }])}
              style={{ background: '#f1f5f9', color: '#0f172a', border: '1px dashed #cbd5e1', width: '100%', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              + {lang === 'ar' ? 'إضافة طريقة دفع' : 'Add Payment Method'}
            </button>
            
          </div>
          <div className="modal-footer" style={{ padding: '1.5rem', textAlign: lang === 'ar' ? 'left' : 'right', borderTop: '1px solid #e2e8f0', background: '#f8fafc', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ margin: lang === 'ar' ? '0 0 0 1rem' : '0 1rem 0 0' }} disabled={loading}>
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button type="submit" className="btn-primary" style={{ background: '#10b881', color: 'white' }} disabled={loading || Math.abs(remaining) > 0.1}>
              {loading ? '...' : (lang === 'ar' ? 'تأكيد الصرف واعتماد القيد' : 'Confirm Payment & Generate JV')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

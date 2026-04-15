'use client';

import React, { useState, useTransition } from 'react';
import { saveTransactionVoucher, deleteTransactionVoucher } from './actions';

// We reuse the AccountSelectorInternal component idea from FinancialClient or build a simple searchable select
function AccountSelect({ accounts, selectedId, onSelect, lang, label, placeholder }: any) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const selected = accounts.find((a: any) => a.id === selectedId);
  const filtered = (accounts || []).filter((a: any) => 
    (a?.code || '').toLowerCase().includes(search.toLowerCase()) || 
    (a?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (a?.nameAr && a.nameAr.toLowerCase().includes(search.toLowerCase()))
  ).slice(0, 50);

  return (
    <div className="account-select-wrapper" style={{ position: 'relative' }}>
      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'inherit' }}>{label}</label>
      <div 
        onClick={() => setIsOpen(true)}
        style={{ padding: '0.6rem', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: 'pointer', background: 'var(--glass-bg)', minHeight: '40px', display: 'flex', alignItems: 'center' }}
      >
        {selected ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>{selected.code} - {lang === 'ar' && selected.nameAr ? selected.nameAr : selected.name}</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
               <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>{lang === 'ar' ? 'الرصيد الحالي' : 'Current Balance'}</span>
               <span style={{ fontSize: '0.85rem', color: selected.balance < 0 ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                  {selected.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
               </span>
            </div>
          </div>
        ) : (
          <span style={{ color: '#94a3b8' }}>{placeholder}</span>
        )}
      </div>

      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '4px', zIndex: 100, maxHeight: '250px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '8px' }}>
            <input 
              autoFocus
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث...' : 'Search...'}
              style={{ width: '100%', padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none' }}
            />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.map((acc: any) => (
              <div 
                key={acc.id}
                onClick={() => { onSelect(acc.id); setIsOpen(false); setSearch(''); }}
                style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                className="acc-option"
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontWeight: 600, color: '#3b82f6', minWidth: '40px' }}>{acc.code}</span>
                  <span>{lang === 'ar' && acc.nameAr ? acc.nameAr : acc.name}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: acc.balance < 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                   {acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {isOpen && <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />}
      
      <style jsx>{`.acc-option:hover { background: #f8fafc; }`}</style>
    </div>
  );
}

export default function VouchersClient({ type, initialVouchers, accounts, lang, dict }: any) {
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    primaryAccountId: '',
    relatedAccountId: ''
  });

  const isReceipt = type === 'RECEIPT';
  const title = isReceipt ? (lang === 'ar' ? 'سندات القبض' : 'Receipt Vouchers') : (lang === 'ar' ? 'سندات الصرف' : 'Payment Vouchers');
  const btnText = isReceipt ? (lang === 'ar' ? 'سند قبض جديد +' : 'New Receipt +') : (lang === 'ar' ? 'سند صرف جديد +' : 'New Payment +');

  const primaryLabel = isReceipt ? (lang === 'ar' ? 'حساب الاستلام (صندوق / بنك)' : 'Receiving Account (Cash/Bank)') : (lang === 'ar' ? 'حساب الدفع (صندوق / بنك)' : 'Payment Account (Cash/Bank)');
  const relatedLabel = isReceipt ? (lang === 'ar' ? 'مقبوض من (العميل / الإيراد)' : 'Received From (Customer/Revenue)') : (lang === 'ar' ? 'يُصرف إلى (المورد / المصروف)' : 'Paid To (Supplier/Expense)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.primaryAccountId || !formData.relatedAccountId) {
      alert(lang === 'ar' ? 'الرجاء اختيار الحسابات.' : 'Please select accounts.');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert(lang === 'ar' ? 'المبلغ غير صحيح.' : 'Invalid amount.');
      return;
    }

    startTransition(async () => {
      const data = {
        type,
        date: formData.date,
        amount: parseFloat(formData.amount),
        description: formData.description,
        primaryAccountId: formData.primaryAccountId,
        relatedAccountId: formData.relatedAccountId,
        id: editingId || undefined
      };
      
      const res = await saveTransactionVoucher(data);
      if (res.success) {
        if (editingId) {
          setVouchers(vouchers.map((v: any) => v.id === editingId ? res.voucher : v));
        } else {
          setVouchers([res.voucher, ...vouchers]);
        }
        setShowModal(false);
      } else {
        alert('Error: ' + res.error);
      }
    });
  };

  const openNew = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      description: '',
      primaryAccountId: '',
      relatedAccountId: ''
    });
    setShowModal(true);
  };

  const openEdit = (v: any) => {
    setEditingId(v.id);
    setFormData({
      date: new Date(v.date).toISOString().split('T')[0],
      amount: v.amount.toString(),
      description: v.description || '',
      primaryAccountId: v.primaryAccountId,
      relatedAccountId: v.relatedAccountId
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من الحذف؟ سيتم مسح القيود المحاسبية المرتبطة.' : 'Are you sure? Linked journal entries will be deleted.')) return;
    startTransition(async () => {
      const res = await deleteTransactionVoucher(id);
      if (res.success) {
        setVouchers(vouchers.filter((v: any) => v.id !== id));
      } else {
        alert('Error: ' + res.error);
      }
    });
  };

  return (
    <div className="vouchers-container">
      <div className="flex-between">
        <h2 style={{ fontSize: '1.25rem', color: '#1e293b' }}>{title}</h2>
        <button className="btn-primary" onClick={openNew}>{btnText}</button>
      </div>

      <div className="table-responsive" style={{ marginTop: '1.5rem' }}>
        <table className="data-table">
          <thead style={{ background: '#1e293b', borderBottom: '2px solid #0f172a' }}>
            <tr>
              <th style={{ textAlign: lang === 'ar' ? 'right' : 'left', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'رقم السند' : 'Voucher No.'}</th>
              <th style={{ textAlign: lang === 'ar' ? 'right' : 'left', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
              <th style={{ textAlign: lang === 'ar' ? 'right' : 'left', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'البيان' : 'Description'}</th>
              <th style={{ textAlign: lang === 'ar' ? 'right' : 'left', color: '#ffffff', fontWeight: '900' }}>{primaryLabel.split('(')[0]}</th>
              <th style={{ textAlign: lang === 'ar' ? 'right' : 'left', color: '#ffffff', fontWeight: '900' }}>{relatedLabel.split('(')[0]}</th>
              <th style={{ textAlign: 'right', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
              <th style={{ width: '80px', textAlign: 'center', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  {lang === 'ar' ? 'لا توجد سندات' : 'No vouchers found'}
                </td>
              </tr>
            ) : (
              vouchers.map((v: any) => {
                const dateObj = new Date(v.date);
                const createdAtObj = new Date(v.createdAt);
                const timeStr = createdAtObj.toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600, color: '#3b82f6' }}>{v.voucherNumber}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span>{mounted ? dateObj.toLocaleDateString() : '...'}</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{mounted ? timeStr : '...'}</span>
                      </div>
                    </td>
                    <td>{v.description}</td>
                    <td>{lang === 'ar' && v.primaryAccount.nameAr ? v.primaryAccount.nameAr : v.primaryAccount.name}</td>
                    <td>{lang === 'ar' && v.relatedAccount.nameAr ? v.relatedAccount.nameAr : v.relatedAccount.name}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: isReceipt ? '#16a34a' : '#dc2626' }}>
                      {v.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => openEdit(v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>✏️</button>
                        <button onClick={() => handleDelete(v.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? (lang === 'ar' ? 'تعديل السند' : 'Edit Voucher') : btnText}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)} type="button">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</label>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>{lang === 'ar' ? 'المبلغ' : 'Amount'}</label>
                    <input 
                      type="number" 
                      required
                      step="0.01"
                      min="0.01"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                      placeholder="0.00"
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', textAlign: 'right' }}
                    />
                  </div>
                </div>

                <div>
                  <AccountSelect 
                    accounts={accounts}
                    selectedId={formData.primaryAccountId}
                    onSelect={(id: string) => setFormData({...formData, primaryAccountId: id})}
                    lang={lang}
                    label={primaryLabel}
                    placeholder={lang === 'ar' ? '--- اختر حساب النقدية ---' : '--- Select Cash Account ---'}
                  />
                </div>

                <div>
                  <AccountSelect 
                    accounts={accounts}
                    selectedId={formData.relatedAccountId}
                    onSelect={(id: string) => setFormData({...formData, relatedAccountId: id})}
                    lang={lang}
                    label={relatedLabel}
                    placeholder={lang === 'ar' ? '--- اختر الحساب المقابل ---' : '--- Select Counterpart Account ---'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>{lang === 'ar' ? 'البيان (الوصف)' : 'Description'}</label>
                  <input 
                    type="text" 
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder={lang === 'ar' ? 'لصالح دفعة مبدئية...' : 'Advance payment for...'}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
                  />
                </div>

              </div>
              <div className="modal-actions" style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={isPending}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary" disabled={isPending}>{isPending ? '⏳...' : (lang === 'ar' ? 'حفظ السند' : 'Save Voucher')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .vouchers-container { color: inherit; }
        .flex-between h2 { color: var(--text-primary) !important; }
        .data-table { width: 100%; border-collapse: collapse; background: transparent; border-radius: 8px; overflow: hidden; }
        .data-table th, .data-table td { padding: 1rem; border-bottom: 1px solid var(--glass-border); text-align: right; }
        .data-table th { background: rgba(255, 255, 255, 0.05); font-weight: 600; color: var(--text-secondary); font-size: 0.85rem; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.8); z-index: 2000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
        .modal-content { background: white; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); color: #000000 !important; }
        .modal-content label, .modal-content h2, .modal-content span, .modal-content input { color: #0f172a !important; }
        .modal-header { padding: 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .modal-title { font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0; }
        .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; }
      `}</style>
    </div>
  );
}

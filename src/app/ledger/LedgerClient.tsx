'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { saveJournalVoucher, setupDefaultAccounts, deleteJournalVoucher, updateJournalVoucher } from './actions';
import DimensionSelector from '@/components/DimensionSelector';

type Account = { id: string; code: string; name: string; nameAr: string | null; type: string };
type JournalEntry = {
  id: string;
  date: Date;
  description: string;
  debit: number;
  credit: number;
  accountId: string;
  account: Account;
};

type JournalVoucher = {
  id: string;
  reference: string;
  date: Date | string;
  description: string;
  status: string;
  createdAt: string | Date;
  entries: JournalEntry[];
};

export default function LedgerClient({ 
  accounts, 
  vouchers = [],
  dict,
  financialDict,
  lang
}: { 
  accounts: Account[], 
  vouchers: JournalVoucher[],
  dict: any,
  financialDict: any,
  lang: string
}) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editVoucher, setEditVoucher] = useState<JournalVoucher | null>(null);
  const [viewVoucher, setViewVoucher] = useState<JournalVoucher | null>(null);
  const [mounted, setMounted] = React.useState(false);
  
  // Dimensions modal state
  const [dimModalLine, setDimModalLine] = useState<number | null>(null);
  const [dimModalLineEdit, setDimModalLineEdit] = useState<number | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Voucher Form State (New)
  const [voucherData, setVoucherData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    lines: [
      { accountId: '', debit: 0, credit: 0, dimensionValues: [] },
      { accountId: '', debit: 0, credit: 0, dimensionValues: [] }
    ] as { accountId: string; debit: number; credit: number; dimensionValues?: any[] }[]
  });

  // Edit Voucher Form State
  const [editData, setEditData] = useState({
    date: '',
    description: '',
    lines: [] as { accountId: string; debit: number; credit: number; dimensionValues?: any[] }[]
  });

  const openEdit = (v: JournalVoucher) => {
    setEditVoucher(v);
    setEditData({
      date: new Date(v.date).toISOString().split('T')[0],
      description: v.description,
      lines: v.entries.map(e => ({ accountId: e.accountId, debit: e.debit, credit: e.credit, dimensionValues: (e as any).dimensionValues || [] }))
    });
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteId(null);
    startTransition(async () => {
      const res = await deleteJournalVoucher(id);
      if (!res.success) alert(res.error || 'Delete failed');
    });
  };

  const totalEditDebit = editData.lines.reduce((s, l) => s + (l.debit || 0), 0);
  const totalEditCredit = editData.lines.reduce((s, l) => s + (l.credit || 0), 0);
  const isEditBalanced = Math.abs(totalEditDebit - totalEditCredit) < 0.01 && totalEditDebit > 0;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVoucher || !isEditBalanced) return;
    startTransition(async () => {
      const res = await updateJournalVoucher(editVoucher.id, editData);
      if (res.success) { setEditVoucher(null); }
      else { alert(res.error || 'Update failed'); }
    });
  };

  const handlePrintVoucher = (voucher: JournalVoucher) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
          <head>
            <title>${voucher.reference}</title>
            <style>
              @page { size: A4; margin: 20mm; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 0; color: #1a1a1a; margin: 0; }
              .header { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #000; padding-bottom: 15px; }
              .header h1 { font-size: 24px; margin: 0 0 10px; }
              .header h2 { font-size: 18px; color: #444; margin: 0; font-weight: normal; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; font-size: 14px; }
              .info-card { padding: 12px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa; }
              .info-card strong { color: #555; display: block; margin-bottom: 4px; font-size: 12px; text-transform: uppercase; }
              .desc-box { margin-bottom: 25px; font-size: 14px; padding: 12px; border-left: 4px solid #2563eb; background: #f0f9ff; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: ${lang === 'ar' ? 'right' : 'left'}; font-size: 14px; }
              th { background-color: #f8fafc; font-weight: 600; color: #333; border-bottom: 2px solid #cbd5e1; }
              .totals { display: flex; justify-content: flex-end; margin-top: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
              .totals-content { display: flex; gap: 40px; font-weight: bold; font-size: 16px; }
              .totals-content > div { display: flex; flex-direction: column; }
              .totals-content span { font-size: 12px; color: #64748b; font-weight: normal; margin-bottom: 4px; text-transform: uppercase; }
              .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
              .status.posted { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
              .status.draft { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
              .status.reversed { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
              @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${lang === 'ar' ? 'قيد يومية عامة' : 'General Journal Voucher'}</h1>
              <h2># ${voucher.reference}</h2>
            </div>
            
            <div class="info-grid">
              <div class="info-card">
                <strong>${dict.date}</strong>
                <div>${new Date(voucher.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</div>
              </div>
              <div class="info-card">
                <strong>${dict.status || 'Status'}</strong>
                <div><span class="status ${voucher.status.toLowerCase()}">${financialDict[voucher.status.toLowerCase()] || voucher.status}</span></div>
              </div>
            </div>

            <div class="desc-box">
              <strong>${dict.description}:</strong><br/>
              ${voucher.description || '-'}
            </div>

            <table>
              <thead>
                <tr>
                  <th>${lang === 'ar' ? 'رمز الحساب' : 'Code'}</th>
                  <th>${dict.account}</th>
                  <th>${dict.debit}</th>
                  <th>${dict.credit}</th>
                </tr>
              </thead>
              <tbody>
                ${voucher.entries.map(e => `
                  <tr>
                    <td style="font-family: monospace;">${e.account.code}</td>
                    <td>${lang === 'ar' && e.account.nameAr ? e.account.nameAr : e.account.name}</td>
                    <td style="color: #16a34a; font-weight: 600;">${e.debit > 0 ? e.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
                    <td style="color: #dc2626; font-weight: 600;">${e.credit > 0 ? e.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div class="totals-content">
                <div>
                  <span>${dict.totalDebit || 'Total Debit'}</span>
                  <div style="color: #16a34a;">${voucher.entries.reduce((sum, e) => sum + e.debit, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <span>${dict.totalCredit || 'Total Credit'}</span>
                  <div style="color: #dc2626;">${voucher.entries.reduce((sum, e) => sum + e.credit, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const updateEditLine = (idx: number, field: string, value: any) => {
    const newLines = [...editData.lines];
    (newLines[idx] as any)[field] = field === 'accountId' ? value : parseFloat(value || 0);
    if (field === 'debit' && parseFloat(value) > 0) newLines[idx].credit = 0;
    if (field === 'credit' && parseFloat(value) > 0) newLines[idx].debit = 0;
    setEditData({ ...editData, lines: newLines });
  };

  const filteredVouchers = useMemo(() => {
    const list = vouchers.filter(v => {
      const matchesFilter = filter === 'All' || v.status === filter;
      const searchLower = search.toLowerCase();
      const matchesSearch = (v.reference || '').toLowerCase().includes(searchLower) || 
                           (v.description || '').toLowerCase().includes(searchLower);
      return matchesFilter && matchesSearch;
    });
    
    // Use createdAt for precise chronological sorting (newest first)
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [vouchers, filter, search]);

  const totalLinesDebit = voucherData.lines.reduce((sum, l) => sum + (l.debit || 0), 0);
  const totalLinesCredit = voucherData.lines.reduce((sum, l) => sum + (l.credit || 0), 0);
  const isBalanced = Math.abs(totalLinesDebit - totalLinesCredit) < 0.01 && totalLinesDebit > 0;

  const handleAddLine = () => {
    setVoucherData({
      ...voucherData,
      lines: [...voucherData.lines, { accountId: '', debit: 0, credit: 0 }]
    });
  };

  const handleRemoveLine = (index: number) => {
    if (voucherData.lines.length <= 2) return;
    const newLines = [...voucherData.lines];
    newLines.splice(index, 1);
    setVoucherData({ ...voucherData, lines: newLines });
  };

  const updateLine = (index: number, field: string, value: any) => {
    const newLines = [...voucherData.lines];
    (newLines[index] as any)[field] = field === 'accountId' ? value : parseFloat(value || 0);
    
    if (field === 'debit' && parseFloat(value) > 0) newLines[index].credit = 0;
    if (field === 'credit' && parseFloat(value) > 0) newLines[index].debit = 0;

    setVoucherData({ ...voucherData, lines: newLines });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) return;

    startTransition(async () => {
      const res = await saveJournalVoucher(voucherData);
      if (res.success) {
        setShowModal(false);
        setVoucherData({
          date: new Date().toISOString().split('T')[0],
          description: '',
          lines: [{ accountId: '', debit: 0, credit: 0 }, { accountId: '', debit: 0, credit: 0 }]
        });
      } else {
        alert(res.error || 'Failed to save');
      }
    });
  };

  const getLocalizedName = (acc: Account) => lang === 'ar' && acc.nameAr ? acc.nameAr : acc.name;

  return (
    <div className="ledger-container">
      {/* Top Controls: Export and New Voucher already in FinancialClient's header theoretically 
          but the image shows them as part of the page tools. 
      */}
      
      <div className="ledger-toolbar">
         <div className="search-box">
             <input suppressHydrationWarning
                type="text" 
                placeholder={financialDict.searchPlaceholder} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
             <span className="search-icon">🔍</span>
         </div>
         
         <div className="filter-tabs">
             {['All', 'Posted', 'Draft', 'Reversed'].map(f => (
               <button suppressHydrationWarning
                  key={f} 
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
               >
                 {financialDict[f.toLowerCase()] || f}
               </button>
             ))}
         </div>
         
         <div className="toolbar-actions">
            <button suppressHydrationWarning className="btn-primary" onClick={() => {
              setVoucherData({
                date: new Date().toISOString().split('T')[0],
                description: '',
                lines: [{ accountId: '', debit: 0, credit: 0 }, { accountId: '', debit: 0, credit: 0 }]
              });
              setShowModal(true);
            }}>
              + {financialDict.newEntry}
            </button>
         </div>
      </div>

      {/* Delete Confirm Dialog */}
      {confirmDeleteId && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ margin: '0 0 0.75rem', color: '#1e293b' }}>{lang === 'ar' ? 'تأكيد حذف القيد' : 'Delete Voucher?'}</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              {lang === 'ar' ? 'سيتم حذف القيد وجميع بنوده نهائياً. لا يمكن التراجع.' : 'This will permanently delete the voucher and all its entries. This cannot be undone.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => setConfirmDeleteId(null)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button onClick={() => handleDelete(confirmDeleteId)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.625rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                {lang === 'ar' ? 'حذف نهائياً' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Voucher Modal */}
      {editVoucher && (
        <div className="modal-overlay" style={{ zIndex: 1500 }}>
          <div className="modal-content" style={{ maxWidth: '900px', width: '95%' }}>
            <div className="modal-header">
              <h2 className="modal-title">{lang === 'ar' ? `تعديل القيد: ${editVoucher.reference}` : `Edit Voucher: ${editVoucher.reference}`}</h2>
              <button className="close-btn" onClick={() => setEditVoucher(null)} type="button">×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-row" style={{ marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">{dict.date}</label>
                    <input required type="date" className="form-input" value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ flex: 2 }}>
                    <label className="form-label">{dict.description}</label>
                    <input required type="text" className="form-input" value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} />
                  </div>
                </div>
                <div className="voucher-lines" style={{ padding: '0 1rem', paddingBottom: '20rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', fontWeight: 'bold', color: '#475569', fontSize: '0.9rem', padding: '0 0.5rem' }}>
                    <div style={{ flex: '6' }}>{dict.account}</div>
                    <div style={{ flex: '2', textAlign: 'center' }}>{dict.debit}</div>
                    <div style={{ flex: '2', textAlign: 'center' }}>{dict.credit}</div>
                    <div style={{ width: '40px' }}></div>
                  </div>
                  {editData.lines.map((line, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                      <div style={{ flex: '6' }}>
                        <SearchableAccountSelect accounts={accounts} selectedId={line.accountId} onSelect={(id) => updateEditLine(idx, 'accountId', id)} dict={dict} lang={lang} />
                        <button type="button" onClick={() => setDimModalLineEdit(idx)} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', marginTop: '0.25rem', background: line.dimensionValues?.length ? 'var(--accent-primary)' : '#f1f5f9', color: line.dimensionValues?.length ? 'white' : '#64748b', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}>
                          {lang === 'ar' ? 'الأبعاد' : 'Dimensions'} {(line.dimensionValues?.length || 0) > 0 ? `(${line.dimensionValues?.length})` : ''}
                        </button>
                      </div>
                      <div style={{ flex: '2' }}>
                        <input type="number" step="0.01" className="form-input" style={{ width: '100%', textAlign: 'right' }} value={line.debit || ''} onChange={e => updateEditLine(idx, 'debit', e.target.value)} placeholder="0.00" />
                      </div>
                      <div style={{ flex: '2' }}>
                        <input type="number" step="0.01" className="form-input" style={{ width: '100%', textAlign: 'right' }} value={line.credit || ''} onChange={e => updateEditLine(idx, 'credit', e.target.value)} placeholder="0.00" />
                      </div>
                      <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                        {editData.lines.length > 2 && (
                          <button type="button" onClick={() => { const l=[...editData.lines]; l.splice(idx,1); setEditData({...editData, lines:l}); }} style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer', fontSize: '1.5rem', padding: '0' }}>×</button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', alignItems: 'center' }}>
                    <div style={{ flex: '6' }}>
                      <button type="button" onClick={() => setEditData({ ...editData, lines: [...editData.lines, { accountId: '', debit: 0, credit: 0 }] })} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>{dict.addLine}</button>
                    </div>
                    <div style={{ flex: '2', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{totalEditDebit.toFixed(2)}</div>
                    <div style={{ flex: '2', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{totalEditCredit.toFixed(2)}</div>
                    <div style={{ width: '40px' }}></div>
                  </div>
                </div>
                {!isEditBalanced && totalEditDebit > 0 && (
                  <div style={{ color: 'var(--accent-danger)', fontSize: '0.875rem', textAlign: 'center', marginTop: '1rem' }}>{dict.unbalanced}</div>
                )}
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', marginBottom: '1.5rem', padding: '0 3rem' }}>
                <button type="button" className="btn-secondary" style={{ padding: '0.625rem 1.5rem', background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setEditVoucher(null)}>{dict.cancel}</button>
                <button type="submit" className="btn-primary" disabled={isPending || !isEditBalanced} style={{ padding: '0.625rem 2rem', borderRadius: '8px', fontWeight: 600 }}>
                  {isPending ? dict.saving : (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Voucher Modal (Modern Design) */}
      {viewVoucher && (
        <div className="modal-overlay" style={{ zIndex: 1500, backdropFilter: 'blur(8px)', background: 'rgba(15, 23, 42, 0.4)' }} onClick={() => setViewVoucher(null)}>
          <div className="modal-content" style={{ maxWidth: '850px', width: '95%', padding: '0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(to right, #1e293b, #0f172a)', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
              <div>
                <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'تفاصيل القيد' : 'Voucher Details'}</h2>
                <div style={{ opacity: 0.8, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{viewVoucher.reference}</span>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }}></span>
                  <span>{new Date(viewVoucher.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }}></span>
                  <span className={`badge-status ${viewVoucher.status.toLowerCase()}`} style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                    {financialDict[viewVoucher.status.toLowerCase()] || viewVoucher.status}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => handlePrintVoucher(viewVoucher)} title={lang === 'ar' ? 'طباعة' : 'Print'} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                </button>
                <button className="close-btn" onClick={() => setViewVoucher(null)} type="button" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
            
            <div style={{ padding: '2rem', background: '#f8fafc' }}>
              {/* Description Box */}
              <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#f1f5f9', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{dict.description}</div>
                  <div style={{ color: '#1e293b', fontSize: '1.05rem', lineHeight: '1.5' }}>{viewVoucher.description}</div>
                </div>
              </div>

              {/* Entries Table */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#475569', fontWeight: '700' }}>{lang === 'ar' ? 'الحساب' : 'Account'}</th>
                      <th style={{ padding: '1rem', textAlign: 'right', color: '#475569', fontWeight: '700' }}>{dict.debit}</th>
                      <th style={{ padding: '1rem', textAlign: 'right', color: '#475569', fontWeight: '700' }}>{dict.credit}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewVoucher.entries.map((e, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>{getLocalizedName(e.account)}</span>
                            <span style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px', fontFamily: 'monospace' }}>{e.account.code}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', color: '#16a34a', fontWeight: '700', fontSize: '0.95rem' }}>
                          {e.debit > 0 ? e.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', color: '#dc2626', fontWeight: '700', fontSize: '0.95rem' }}>
                          {e.credit > 0 ? e.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#475569' }}>{lang === 'ar' ? 'الإجمالي' : 'Total'}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#16a34a', fontWeight: '800', fontSize: '1.05rem' }}>
                        {viewVoucher.entries.reduce((sum, e) => sum + e.debit, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#dc2626', fontWeight: '800', fontSize: '1.05rem' }}>
                        {viewVoucher.entries.reduce((sum, e) => sum + e.credit, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div style={{ background: 'white', padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" className="btn-secondary" style={{ padding: '0.625rem 2rem', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setViewVoucher(null)}>{lang === 'ar' ? 'إغلاق' : 'Close'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table>
            <thead style={{ background: '#1e293b', borderBottom: '2px solid #0f172a' }}>
              <tr>
                <th style={{ width: '40px', color: '#ffffff' }}><input type="checkbox" /></th>
                <th style={{ color: '#ffffff', fontWeight: '900' }}>{dict.reference || 'Ref'}</th>
                <th style={{ color: '#ffffff', fontWeight: '900' }}>{dict.date}</th>
                <th style={{ width: '28%', color: '#ffffff', fontWeight: '900' }}>{dict.description}</th>
                <th style={{ color: '#ffffff', fontWeight: '900' }}>{financialDict.period}</th>
                <th style={{ textAlign: 'right', color: '#ffffff', fontWeight: '900' }}>{dict.debit}</th>
                <th style={{ textAlign: 'right', color: '#ffffff', fontWeight: '900' }}>{dict.credit}</th>
                <th style={{ color: '#ffffff', fontWeight: '900' }}>{dict.status || 'Status'}</th>
                <th className="no-print" style={{ width: '100px', textAlign: 'center', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    {dict.noEntries}
                  </td>
                </tr>
              )}
              {filteredVouchers.map((v) => {
                const totalDebit = v.entries.reduce((sum, e) => sum + e.debit, 0);
                const totalCredit = v.entries.reduce((sum, e) => sum + e.credit, 0);
                const dateObj = new Date(v.date);
                const period = dateObj.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' });

                
                const formatDate = (date: Date, createdAt: string | Date) => {
                  const d = String(date.getDate()).padStart(2, '0');
                  const m = String(date.getMonth() + 1).padStart(2, '0');
                  const y = date.getFullYear();
                  
                  // Extract time from createdAt
                  const cAt = new Date(createdAt);
                  const time = cAt.toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span>{`${d}/${m}/${y}`}</span>
                      {mounted && (
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{time}</span>
                      )}
                    </div>
                  );
                };

                return (
                  <React.Fragment key={v.id}>
                    <tr style={{ transition: 'background 0.2s', cursor: 'pointer' }} className="hover-row">
                      <td><input type="checkbox" onClick={(e) => e.stopPropagation()} /></td>
                      <td className="text-primary font-bold" onClick={() => setViewVoucher(v)}>{v.reference}</td>
                      <td className="text-sub" onClick={() => setViewVoucher(v)}>{formatDate(dateObj, v.createdAt)}</td>
                      <td onClick={() => setViewVoucher(v)}>{v.description}</td>
                      <td className="text-sub" onClick={() => setViewVoucher(v)}>{period}</td>
                      <td style={{ textAlign: 'right', fontWeight: '600' }} onClick={() => setViewVoucher(v)}>
                        {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '600' }} onClick={() => setViewVoucher(v)}>
                        {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td onClick={() => setViewVoucher(v)}>
                        <span className={`badge-status ${v.status.toLowerCase()}`}>
                          {financialDict[v.status.toLowerCase()] || v.status}
                        </span>
                      </td>
                      <td className="no-print">
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button suppressHydrationWarning title={lang === 'ar' ? 'عرض القيد' : 'View Voucher'} className="action-icon-btn view" onClick={(e) => { e.stopPropagation(); setViewVoucher(v); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                          <button suppressHydrationWarning title={lang === 'ar' ? 'طباعة القيد' : 'Print Voucher'} className="action-icon-btn view" style={{ background: '#f8fafc', borderColor: '#cbd5e1', color: '#475569' }} onClick={(e) => { e.stopPropagation(); handlePrintVoucher(v); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                          </button>
                          <button suppressHydrationWarning title={lang === 'ar' ? 'تعديل' : 'Edit'} className="action-icon-btn edit" onClick={(e) => { e.stopPropagation(); openEdit(v); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button suppressHydrationWarning title={lang === 'ar' ? 'حذف' : 'Delete'} className="action-icon-btn delete" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(v.id); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '900px', width: '95%' }}>
            <div className="modal-header">
              <h2 className="modal-title">{dict.newVoucher || dict.newEntryTitle}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)} type="button">X</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row" style={{ marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">{dict.date}</label>
                    <input required type="date" className="form-input" value={voucherData.date} onChange={e => setVoucherData({...voucherData, date: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 2 }}>
                    <label className="form-label">{dict.description}</label>
                    <input required type="text" className="form-input" value={voucherData.description} onChange={e => setVoucherData({...voucherData, description: e.target.value})} placeholder="Voucher description..." />
                  </div>
                </div>

                <div className="voucher-lines" style={{ marginBottom: '1rem', padding: '0 1rem', paddingBottom: '20rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', fontWeight: 'bold', color: '#475569', fontSize: '0.9rem', padding: '0 0.5rem' }}>
                    <div style={{ flex: '6' }}>{dict.account}</div>
                    <div style={{ flex: '2', textAlign: 'center' }}>{dict.debit}</div>
                    <div style={{ flex: '2', textAlign: 'center' }}>{dict.credit}</div>
                    <div style={{ width: '40px' }}></div>
                  </div>
                  {voucherData.lines.map((line, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                      <div style={{ flex: '6' }}>
                        <SearchableAccountSelect 
                          accounts={accounts} 
                          selectedId={line.accountId} 
                          onSelect={(id) => updateLine(idx, 'accountId', id)}
                          dict={dict}
                          lang={lang}
                        />
                        <button type="button" onClick={() => setDimModalLine(idx)} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', marginTop: '0.25rem', background: line.dimensionValues?.length ? 'var(--accent-primary)' : '#f1f5f9', color: line.dimensionValues?.length ? 'white' : '#64748b', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}>
                          {lang === 'ar' ? 'الأبعاد' : 'Dimensions'} {(line.dimensionValues?.length || 0) > 0 ? `(${line.dimensionValues?.length})` : ''}
                        </button>
                      </div>
                      <div style={{ flex: '2' }}>
                        <input type="number" step="0.01" className="form-input" style={{ width: '100%', textAlign: 'right' }} value={line.debit || ''} onChange={e => updateLine(idx, 'debit', e.target.value)} placeholder="0.00" />
                      </div>
                      <div style={{ flex: '2' }}>
                        <input type="number" step="0.01" className="form-input" style={{ width: '100%', textAlign: 'right' }} value={line.credit || ''} onChange={e => updateLine(idx, 'credit', e.target.value)} placeholder="0.00" />
                      </div>
                      <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                        <button type="button" onClick={() => handleRemoveLine(idx)} style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer', fontSize: '1.5rem', padding: '0' }}>×</button>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', alignItems: 'center' }}>
                    <div style={{ flex: '6' }}>
                      <button type="button" onClick={handleAddLine} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>{dict.addLine}</button>
                    </div>
                    <div style={{ flex: '2', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{totalLinesDebit.toFixed(2)}</div>
                    <div style={{ flex: '2', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{totalLinesCredit.toFixed(2)}</div>
                    <div style={{ width: '40px' }}></div>
                  </div>
                </div>

                {!isBalanced && totalLinesDebit > 0 && (
                  <div style={{ color: 'var(--accent-danger)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1rem' }}>
                    {dict.unbalanced}
                  </div>
                )}
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', marginBottom: '1.5rem', padding: '0 3rem' }}>
                <button type="button" className="btn-secondary" style={{ padding: '0.625rem 1.5rem', background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setShowModal(false)}>{dict.cancel}</button>
                <button type="submit" className="btn-primary" disabled={isPending || !isBalanced} style={{ padding: '0.625rem 2rem', borderRadius: '8px', fontWeight: 600 }}>{isPending ? dict.saving : dict.postEntry}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dimension Selector Modal for New Voucher */}
      {dimModalLine !== null && (
        <div className="modal-overlay" style={{ zIndex: 2500 }}>
          <div className="modal-content" style={{ maxWidth: '500px', width: '90%' }}>
            <div className="modal-header">
              <h2 className="modal-title">{lang === 'ar' ? 'الأبعاد التحليلية (مراكز التكلفة)' : 'Analytical Dimensions (Cost Centers)'}</h2>
              <button className="close-btn" onClick={() => setDimModalLine(null)} type="button">×</button>
            </div>
            <div className="modal-body">
              <DimensionSelector 
                companyId=""
                lang={lang} 
                value={voucherData.lines[dimModalLine]?.dimensionValues || []} 
                onChange={(val) => {
                  const l = [...voucherData.lines];
                  l[dimModalLine].dimensionValues = val;
                  setVoucherData({ ...voucherData, lines: l });
                }} 
              />
            </div>
            <div className="modal-footer" style={{ padding: '1.5rem', textAlign: 'right' }}>
              <button type="button" className="btn-primary" onClick={() => setDimModalLine(null)}>{lang === 'ar' ? 'تم' : 'Done'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Dimension Selector Modal for Edit Voucher */}
      {dimModalLineEdit !== null && (
        <div className="modal-overlay" style={{ zIndex: 2500 }}>
          <div className="modal-content" style={{ maxWidth: '500px', width: '90%' }}>
            <div className="modal-header">
              <h2 className="modal-title">{lang === 'ar' ? 'الأبعاد التحليلية (مراكز التكلفة)' : 'Analytical Dimensions (Cost Centers)'}</h2>
              <button className="close-btn" onClick={() => setDimModalLineEdit(null)} type="button">×</button>
            </div>
            <div className="modal-body">
              <DimensionSelector 
                companyId="" 
                lang={lang} 
                value={editData.lines[dimModalLineEdit]?.dimensionValues || []} 
                onChange={(val) => {
                  const l = [...editData.lines];
                  l[dimModalLineEdit].dimensionValues = val;
                  setEditData({ ...editData, lines: l });
                }} 
              />
            </div>
            <div className="modal-footer" style={{ padding: '1.5rem', textAlign: 'right' }}>
              <button type="button" className="btn-primary" onClick={() => setDimModalLineEdit(null)}>{lang === 'ar' ? 'تم' : 'Done'}</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .ledger-toolbar { display: flex; gap: 1.5rem; align-items: center; margin-bottom: 2rem; background: white; padding: 1rem; border-radius: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .search-box { position: relative; flex: 1; }
        .search-box input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 1px solid #e5e7eb; border-radius: 0.75rem; outline: none; }
        .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #9ca3af; }
        .filter-tabs { display: flex; background: #f3f4f6; padding: 0.25rem; border-radius: 0.75rem; gap: 0.25rem; }
        .filter-btn { padding: 0.5rem 1rem; border: none; background: none; cursor: pointer; border-radius: 0.5rem; font-weight: 500; color: #6b7280; transition: all 0.2s; }
        .filter-btn.active { background: #2563eb; color: white; }
        .badge-status { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .badge-status.posted { background: #dcfce7; color: #166534; }
        .badge-status.draft { background: #fef3c7; color: #92400e; }
        .badge-status.reversed { background: #fee2e2; color: #991b1b; }
        .font-bold { font-weight: 700; }
        .text-primary { color: #2563eb; }
        .action-icon-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .action-icon-btn.view { background: #f0f9ff; border-color: #bae6fd; color: #0284c7; }
        .action-icon-btn.view:hover { background: #0284c7; color: white; }
        .action-icon-btn.edit { background: #fefce8; border-color: #fde047; color: #ca8a04; }
        .action-icon-btn.edit:hover { background: #ca8a04; color: white; }
        .action-icon-btn.delete { background: #fff1f2; border-color: #fca5a5; color: #dc2626; }
        .action-icon-btn.delete:hover { background: #dc2626; color: white; }
      `}</style>
    </div>
  );
}

const normalizeArabic = (text: string) => {
  if (!text) return '';
  return text
    .replace(/[أإآا]/g, 'ا')
    .replace(/[ةه]/g, 'ه')
    .replace(/[يى]/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '');
};

function SearchableAccountSelect({ 
  accounts, 
  selectedId, 
  onSelect, 
  dict, 
  lang 
}: { 
  accounts: Account[], 
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
    const lower = normalizeArabic(searchTerm.toLowerCase());
    return accounts.filter(acc => 
      (acc.code && normalizeArabic(acc.code.toLowerCase()).includes(lower)) || 
      (acc.name && normalizeArabic(acc.name.toLowerCase()).includes(lower)) || 
      (acc.nameAr && normalizeArabic(acc.nameAr.toLowerCase()).includes(lower))
    ); 
  }, [accounts, searchTerm]);

  const getLocalizedName = (acc: Account) => 
    lang === 'ar' && acc.nameAr ? acc.nameAr : acc.name;

  return (
    <div className="searchable-select-container">
      <div 
        className={`select-trigger ${!selectedId ? 'placeholder' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedAccount 
            ? `${selectedAccount.code} - ${getLocalizedName(selectedAccount)}` 
            : dict.selectAccount}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>

      {isOpen && (
        <div className="dropdown-panel">
          <div className="search-input-wrapper">
            <input 
              autoFocus
              type="text" 
              className="drop-search" 
              placeholder={lang === 'ar' ? "بحث في الحسابات..." : "Search accounts..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="options-list">
            {filteredAccounts.length === 0 ? (
              <div className="no-options">No accounts found</div>
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
                >
                  <span className="acc-code">{acc.code}</span>
                  <span className="acc-name">{getLocalizedName(acc)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Global click-outside handler as a full-screen invisible div for simplicity in vanilla */}
      {isOpen && <div className="click-outside-overlay" onClick={() => setIsOpen(false)} />}

      <style jsx>{`
        .searchable-select-container {
          position: relative;
          width: 100%;
        }
        .select-trigger {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.625rem 0.75rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          min-height: 2.5rem;
          user-select: none;
          color: #1e293b;
        }
        .select-trigger.placeholder {
          color: #9ca3af;
        }
        .dropdown-panel {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          max-height: 300px;
        }
        .search-input-wrapper {
          padding: 8px;
          border-bottom: 1px solid #f3f4f6;
        }
        .drop-search {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          outline: none;
          font-size: 0.875rem;
          color: #1e293b;
        }
        .drop-search:focus {
          border-color: #2563eb;
        }
        .options-list {
          overflow-y: auto;
          flex: 1;
        }
        .option-item {
          padding: 8px 12px;
          cursor: pointer;
          font-size: 0.875rem;
          display: flex;
          gap: 8px;
          color: #1e293b;
        }
        .option-item:hover {
          background: #f3f4f6;
        }
        .option-item.selected {
          background: #eff6ff;
          color: #2563eb;
        }
        .acc-code {
          font-weight: 600;
          min-width: 45px;
        }
        .no-options {
          padding: 20px;
          text-align: center;
          color: #9ca3af;
          font-size: 0.875rem;
        }
        .click-outside-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: transparent;
        }
      `}</style>
    </div>
  );
}

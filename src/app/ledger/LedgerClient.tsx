'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { saveJournalVoucher, setupDefaultAccounts, deleteJournalVoucher, updateJournalVoucher } from './actions';

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Voucher Form State (New)
  const [voucherData, setVoucherData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    lines: [
      { accountId: '', debit: 0, credit: 0 },
      { accountId: '', debit: 0, credit: 0 }
    ]
  });

  // Edit Voucher Form State
  const [editData, setEditData] = useState({
    date: '',
    description: '',
    lines: [] as { accountId: string; debit: number; credit: number }[]
  });

  const openEdit = (v: JournalVoucher) => {
    setEditVoucher(v);
    setEditData({
      date: new Date(v.date).toISOString().split('T')[0],
      description: v.description,
      lines: v.entries.map(e => ({ accountId: e.accountId, debit: e.debit, credit: e.credit }))
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
             <input 
                type="text" 
                placeholder={financialDict.searchPlaceholder} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
             <span className="search-icon">🔍</span>
         </div>
         
         <div className="filter-tabs">
             {['All', 'Posted', 'Draft', 'Reversed'].map(f => (
               <button 
                  key={f} 
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
               >
                 {financialDict[f.toLowerCase()] || f}
               </button>
             ))}
         </div>
         
         <div className="toolbar-actions">
            <button className="btn-primary" onClick={() => setShowModal(true)}>
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
                <div className="voucher-lines">
                  <table style={{ borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                    <thead>
                      <tr style={{ background: 'transparent' }}>
                        <th style={{ width: '40%' }}>{dict.account}</th>
                        <th>{dict.debit}</th>
                        <th>{dict.credit}</th>
                        <th style={{ width: '40px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {editData.lines.map((line, idx) => (
                        <tr key={idx} style={{ background: 'var(--glass-bg)' }}>
                          <td style={{ position: 'relative' }}>
                            <SearchableAccountSelect accounts={accounts} selectedId={line.accountId} onSelect={(id) => updateEditLine(idx, 'accountId', id)} dict={dict} lang={lang} />
                          </td>
                          <td><input type="number" step="0.01" className="form-input" style={{ textAlign: 'right' }} value={line.debit || ''} onChange={e => updateEditLine(idx, 'debit', e.target.value)} placeholder="0.00" /></td>
                          <td><input type="number" step="0.01" className="form-input" style={{ textAlign: 'right' }} value={line.credit || ''} onChange={e => updateEditLine(idx, 'credit', e.target.value)} placeholder="0.00" /></td>
                          <td>
                            {editData.lines.length > 2 && (
                              <button type="button" onClick={() => { const l=[...editData.lines]; l.splice(idx,1); setEditData({...editData, lines:l}); }} style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer', fontSize: '1.25rem' }}>×</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td><button type="button" onClick={() => setEditData({ ...editData, lines: [...editData.lines, { accountId: '', debit: 0, credit: 0 }] })} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>{dict.addLine}</button></td>
                        <td style={{ textAlign: 'right', padding: '1rem', fontWeight: 'bold' }}>{totalEditDebit.toFixed(2)}</td>
                        <td style={{ textAlign: 'right', padding: '1rem', fontWeight: 'bold' }}>{totalEditCredit.toFixed(2)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                {!isEditBalanced && totalEditDebit > 0 && (
                  <div style={{ color: 'var(--accent-danger)', fontSize: '0.875rem', textAlign: 'center', marginTop: '1rem' }}>{dict.unbalanced}</div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setEditVoucher(null)}>{dict.cancel}</button>
                <button type="submit" className="btn-primary" disabled={isPending || !isEditBalanced}>
                  {isPending ? dict.saving : (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px' }}><input type="checkbox" /></th>
                <th>{dict.reference || 'Ref'}</th>
                <th>{dict.date}</th>
                <th style={{ width: '28%' }}>{dict.description}</th>
                <th>{financialDict.period}</th>
                <th style={{ textAlign: 'right' }}>{dict.debit}</th>
                <th style={{ textAlign: 'right' }}>{dict.credit}</th>
                <th>{dict.status || 'Status'}</th>
                <th className="no-print" style={{ width: '100px', textAlign: 'center' }}>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
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
                const isExpanded = expandedId === v.id;
                
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
                    <tr style={{ background: isExpanded ? '#f8fafc' : undefined, transition: 'background 0.2s', cursor: 'pointer' }}>
                      <td><input type="checkbox" /></td>
                      <td className="text-primary font-bold" onClick={() => setExpandedId(isExpanded ? null : v.id)}>{v.reference}</td>
                      <td className="text-sub" onClick={() => setExpandedId(isExpanded ? null : v.id)}>{formatDate(dateObj, v.createdAt)}</td>
                      <td onClick={() => setExpandedId(isExpanded ? null : v.id)}>{v.description}</td>
                      <td className="text-sub" onClick={() => setExpandedId(isExpanded ? null : v.id)}>{period}</td>
                      <td style={{ textAlign: 'right', fontWeight: '600' }} onClick={() => setExpandedId(isExpanded ? null : v.id)}>
                        {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '600' }} onClick={() => setExpandedId(isExpanded ? null : v.id)}>
                        {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td onClick={() => setExpandedId(isExpanded ? null : v.id)}>
                        <span className={`badge-status ${v.status.toLowerCase()}`}>
                          {financialDict[v.status.toLowerCase()] || v.status}
                        </span>
                      </td>
                      <td className="no-print">
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button title={lang === 'ar' ? 'عرض' : 'Expand'} className="action-icon-btn view" onClick={() => setExpandedId(isExpanded ? null : v.id)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                          <button title={lang === 'ar' ? 'تعديل' : 'Edit'} className="action-icon-btn edit" onClick={() => openEdit(v)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button title={lang === 'ar' ? 'حذف' : 'Delete'} className="action-icon-btn delete" onClick={() => setConfirmDeleteId(v.id)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${v.id}-exp`}>
                        <td colSpan={9} style={{ padding: 0, background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                          <div style={{ padding: '1rem 2rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                              <thead>
                                <tr style={{ background: '#e2e8f0' }}>
                                  <th style={{ padding: '0.4rem 0.5rem', textAlign: 'left' }}>{lang === 'ar' ? 'الحساب' : 'Account'}</th>
                                  <th style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>{dict.debit}</th>
                                  <th style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>{dict.credit}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {v.entries.map((e, i) => (
                                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '0.4rem 0.5rem' }}>
                                      <span style={{ fontWeight: 600, color: '#6366f1' }}>{e.account.code}</span> — {getLocalizedName(e.account)}
                                    </td>
                                    <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>
                                      {e.debit > 0 ? e.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'}
                                    </td>
                                    <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>
                                      {e.credit > 0 ? e.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
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

                <div className="voucher-lines" style={{ marginBottom: '1rem' }}>
                  <table style={{ borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                    <thead>
                      <tr style={{ background: 'transparent' }}>
                        <th style={{ width: '40%' }}>{dict.account}</th>
                        <th>{dict.debit}</th>
                        <th>{dict.credit}</th>
                        <th style={{ width: '40px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {voucherData.lines.map((line, idx) => (
                        <tr key={idx} style={{ background: 'var(--glass-bg)' }}>
                          <td style={{ position: 'relative' }}>
                            <SearchableAccountSelect 
                              accounts={accounts} 
                              selectedId={line.accountId} 
                              onSelect={(id) => updateLine(idx, 'accountId', id)}
                              dict={dict}
                              lang={lang}
                            />
                          </td>
                          <td>
                            <input type="number" step="0.01" className="form-input" style={{ textAlign: 'right' }} value={line.debit || ''} onChange={e => updateLine(idx, 'debit', e.target.value)} placeholder="0.00" />
                          </td>
                          <td>
                            <input type="number" step="0.01" className="form-input" style={{ textAlign: 'right' }} value={line.credit || ''} onChange={e => updateLine(idx, 'credit', e.target.value)} placeholder="0.00" />
                          </td>
                          <td>
                            <button type="button" onClick={() => handleRemoveLine(idx)} style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer' }}>×</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={1}>
                          <button type="button" onClick={handleAddLine} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>{dict.addLine}</button>
                        </td>
                        <td style={{ textAlign: 'right', padding: '1rem', fontWeight: 'bold' }}>{totalLinesDebit.toFixed(2)}</td>
                        <td style={{ textAlign: 'right', padding: '1rem', fontWeight: 'bold' }}>{totalLinesCredit.toFixed(2)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {!isBalanced && totalLinesDebit > 0 && (
                  <div style={{ color: 'var(--accent-danger)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1rem' }}>
                    {dict.unbalanced}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>{dict.cancel}</button>
                <button type="submit" className="btn-primary" disabled={isPending || !isBalanced}>{isPending ? dict.saving : dict.postEntry}</button>
              </div>
            </form>
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
    const lower = searchTerm.toLowerCase();
    return accounts.filter(acc => 
      (acc.code && acc.code.toLowerCase().includes(lower)) || 
      (acc.name && acc.name.toLowerCase().includes(lower)) || 
      (acc.nameAr && acc.nameAr.toLowerCase().includes(lower))
    ).slice(0, 100); 
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

'use client';

import React, { useState, useMemo } from 'react';

type Entry = {
  id: string;
  date: Date | string;
  description: string;
  debit: number;
  credit: number;
  reference: string;
};

type Account = {
  id: string;
  code: string;
  name: string;
  nameAr: string | null;
  type: string;
};

export default function LedgerReport({
  selectedAccount,
  vouchers,
  startDate,
  endDate,
  dict,
  lang
}: {
  selectedAccount: Account | null;
  vouchers: any[];
  startDate: string;
  endDate: string;
  dict: any;
  lang: string;
}) {
  const getLocalizedName = (acc: Account) => lang === 'ar' && acc.nameAr ? acc.nameAr : acc.name;

  const ledgerData = useMemo(() => {
    if (!selectedAccount) return null;

    // 1. Get all entries for this account
    const allEntries: Entry[] = [];
    vouchers.forEach(v => {
      v.entries.forEach((e: any) => {
        if (e.accountId === selectedAccount.id) {
          allEntries.push({
            id: e.id,
            date: v.date,
            description: v.description,
            debit: e.debit,
            credit: e.credit,
            reference: v.reference
          });
        }
      });
    });

    // 2. Sort by date
    allEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 3. Calculate Opening Balance (entries before startDate)
    let openingBalance = 0;
    const periodEntries: any[] = [];
    
    allEntries.forEach(e => {
      const d = new Date(e.date).toISOString().split('T')[0];
      if (d < startDate) {
        openingBalance += (e.debit - e.credit);
      } else if (d >= startDate && d <= endDate) {
        periodEntries.push(e);
      }
    });

    // Handle Asset/Liability normal balance sign if needed (usually Debit - Credit is standard for everything except Revenue/Equity/Liab)
    // Actually, in many systems, we just show numbers. But let's adjust based on type if we want 
    // "Balance" for Assets/Expenses = Debit - Credit. 
    // "Balance" for Liab/Equity/Rev = Credit - Debit.
    const isCreditNormal = ['Liability', 'Equity', 'Revenue'].includes(selectedAccount.type);
    
    let runningBalance = openingBalance;
    const rows = periodEntries.map(e => {
      runningBalance += (e.debit - e.credit);
      return { ...e, balance: runningBalance };
    });

    return {
      openingBalance,
      rows,
      totalDebit: periodEntries.reduce((s, e) => s + e.debit, 0),
      totalCredit: periodEntries.reduce((s, e) => s + e.credit, 0),
      finalBalance: runningBalance
    };
  }, [selectedAccount, vouchers, startDate, endDate]);

  if (!selectedAccount) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          {lang === 'ar' ? 'يرجى اختيار حساب من القائمة لعرض كشف حسابه' : 'Please select an account from the list to view its ledger'}
        </p>
      </div>
    );
  }

  const report = ledgerData!;

  return (
    <div className="ledger-report-container">
       <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
               <h2 className="card-title" style={{ color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
                 {getLocalizedName(selectedAccount)} ({selectedAccount.code})
               </h2>
               <p className="text-sub">
                 {lang === 'ar' ? 'كشف حساب تفصيلي' : 'Detailed Account Ledger'}
               </p>
            </div>
            <div style={{ textAlign: 'right' }}>
               <span className="badge" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                 {lang === 'ar' ? selectedAccount.type : selectedAccount.type}
               </span>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{dict.date}</th>
                  <th>{dict.reference || 'Ref'}</th>
                  <th style={{ width: '40%' }}>{dict.description}</th>
                  <th style={{ textAlign: 'right' }}>{dict.debit}</th>
                  <th style={{ textAlign: 'right' }}>{dict.credit}</th>
                  <th style={{ textAlign: 'right' }}>{dict.balance || 'Balance'}</th>
                </tr>
              </thead>
              <tbody>
                {/* Opening Balance Row */}
                <tr style={{ background: 'rgba(255,255,255,0.02)', fontWeight: '600' }}>
                   <td colSpan={3} style={{ fontStyle: 'italic' }}>
                     {lang === 'ar' ? 'الرصيد الافتتاحي' : 'Opening Balance'}
                   </td>
                   <td colSpan={2}></td>
                   <td style={{ textAlign: 'right' }}>
                     {report.openingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                   </td>
                </tr>

                {report.rows.length === 0 && (
                   <tr>
                     <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                       {lang === 'ar' ? 'لا توجد حركات لهذه الفترة' : 'No transactions for this period'}
                     </td>
                   </tr>
                )}

                {report.rows.map((row) => (
                  <tr key={row.id}>
                    <td className="text-sub">{new Date(row.date).toLocaleDateString()}</td>
                    <td style={{ fontWeight: '500' }}>{row.reference}</td>
                    <td>{row.description}</td>
                    <td style={{ textAlign: 'right' }}>{row.debit > 0 ? row.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
                    <td style={{ textAlign: 'right' }}>{row.credit > 0 ? row.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {row.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: '900', background: 'var(--glass-bg)' }}>
                  <td colSpan={3} style={{ textAlign: 'right' }}>{lang === 'ar' ? 'المجموع / الرصيد النهائي' : 'Totals / Closing Balance'}</td>
                  <td style={{ textAlign: 'right' }}>{report.totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>{report.totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right', color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
                    {report.finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
       </div>
    </div>
  );
}

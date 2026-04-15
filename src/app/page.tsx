import { prisma } from '../lib/db';
import { cookies } from 'next/headers';
import { getDictionary } from '../lib/i18n';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'en';
  const dict = getDictionary(lang).dashboard;

  const invoices = await prisma.salesInvoice.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const accounts = await prisma.account.findMany({
    include: {
      entries: true
    }
  });

  let totalRevenue = 0;
  let totalExpenses = 0;

  accounts.forEach((acc: any) => {
    const totalDebit = acc.entries.reduce((sum: number, e: any) => sum + e.debit, 0);
    const totalCredit = acc.entries.reduce((sum: number, e: any) => sum + e.credit, 0);

    if (acc.type === 'Revenue') {
      totalRevenue += (totalCredit - totalDebit);
    } else if (acc.type === 'Expense') {
      totalExpenses += (totalDebit - totalCredit);
    }
  });

  const pendingAmount = invoices
    .filter((inv: any) => inv.status === 'Pending' || inv.status === 'معلق')
    .reduce((sum: number, inv: any) => sum + inv.netAmount, 0);

  const pendingCount = invoices.filter((inv: any) => inv.status === 'Pending' || inv.status === 'معلق').length;

  const netProfit = totalRevenue - totalExpenses;

  // Recent journal vouchers
  const recentJV = await prisma.journalVoucher.findMany({
    orderBy: { createdAt: 'desc' },
    take: 4,
    include: { entries: { include: { account: true } } }
  });


  return (
    <div className="dashboard-module">
      <div className="page-header">
        <div>
          <h1 className="page-title">{dict.title}</h1>
          <p className="page-subtitle">{dict.subtitle}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ '--stat-color': 'var(--accent-primary)' } as React.CSSProperties}>
          <div className="stat-top">
            <span className="stat-label">{dict.revenue}</span>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
          </div>
          <div className="stat-value">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="stat-bottom">
            <span className="trend-text">{dict.liveFromDb}</span>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--accent-danger)' } as React.CSSProperties}>
          <div className="stat-top">
            <span className="stat-label">{dict.expenses}</span>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="12" y1="14" x2="12" y2="10"></line></svg>
            </div>
          </div>
          <div className="stat-value">${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="stat-bottom">
            <span className="trend-text">{dict.mockData}</span>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--accent-success)' } as React.CSSProperties}>
          <div className="stat-top">
            <span className="stat-label">{dict.netProfit}</span>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
          </div>
          <div className="stat-value">${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="stat-bottom">
            <span className="trend-text">{dict.calculatedLive}</span>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--accent-warning)' } as React.CSSProperties}>
          <div className="stat-top">
            <span className="stat-label">{dict.pending}</span>
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-bottom">
            <span className="trend-text">{dict.totalValue} ${pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">{dict.cashFlow}</h2>
            <div className="card-actions">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
            </div>
          </div>
          <div className="chart-area">
            <div className="chart-lines">
              <div className="chart-line"></div>
              <div className="chart-line"></div>
              <div className="chart-line"></div>
              <div className="chart-line"></div>
              <div className="chart-line"></div>
            </div>
            
            {/* Visual simulation of bar chart */}
            <div className="bar" style={{ height: '40%' }} title="Jan: $40k"></div>
            <div className="bar bar-2" style={{ height: '25%' }} title="Jan Exp: $25k"></div>
            <div style={{ width: '10px' }}></div>
            <div className="bar" style={{ height: '60%' }} title="Feb: $60k"></div>
            <div className="bar bar-2" style={{ height: '35%' }} title="Feb Exp: $35k"></div>
            <div style={{ width: '10px' }}></div>
            <div className="bar" style={{ height: '45%' }} title="Mar: $45k"></div>
            <div className="bar bar-2" style={{ height: '25%' }} title="Mar Exp: $25k"></div>
            <div style={{ width: '10px' }}></div>
            <div className="bar" style={{ height: '70%' }} title="Apr: $70k"></div>
            <div className="bar bar-2" style={{ height: '40%' }} title="Apr Exp: $40k"></div>
            <div style={{ width: '10px' }}></div>
            <div className="bar" style={{ height: '85%' }} title="May: $85k"></div>
            <div className="bar bar-2" style={{ height: '45%' }} title="May Exp: $45k"></div>
            <div style={{ width: '10px' }}></div>
            <div className="bar" style={{ height: '65%' }} title="Jun: $65k"></div>
            <div className="bar bar-2" style={{ height: '30%' }} title="Jun Exp: $30k"></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">{dict.recentTx}</h2>
            <div className="card-actions">{dict.viewAll}</div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{dict.recentTx}</th>
                  <th>{lang === 'ar' ? 'المرجع' : 'Reference'}</th>
                  <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody>
                {recentJV.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>
                      {dict.noTx}
                    </td>
                  </tr>
                )}
                {recentJV.map((jv: any) => {
                  const total = jv.entries.reduce((s: number, e: any) => s + e.debit, 0);
                  return (
                    <tr key={jv.id}>
                      <td>
                        <div className="flex-cell">
                          <div className="txn-icon" style={{ color: 'var(--accent-primary)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                          </div>
                          <div className="flex-col">
                            <span>{jv.description}</span>
                            <span className="text-sub" suppressHydrationWarning>{new Date(jv.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db' }}>{jv.reference}</span></td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        <span suppressHydrationWarning>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

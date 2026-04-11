import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveOpeningBalances } from './actions';

// SVG Icons
const Icons = {
  accounts: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="14" width="4" height="7"/><rect x="10" y="3" width="4" height="18"/><rect x="17" y="8" width="4" height="13"/></svg>,
  products: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19 12h2"/><path d="M3 12h2"/><path d="M12 3v2"/><path d="M12 19v2"/><path d="M16.95 7.05l1.41-1.41"/><path d="M5.64 18.36l1.41-1.41"/><path d="M16.95 16.95l1.41 1.41"/><path d="M5.64 5.64l1.41 1.41"/></svg>,
  customers: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><text x="12" y="15" fill="#3b82f6" fontSize="10" strokeWidth="0" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">$</text></svg>,
  suppliers: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><text x="12" y="15" fill="#94a3b8" fontSize="10" strokeWidth="0" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">$</text></svg>
};

export default function OpeningBalancesClient({ lang, accounts = [] }: { lang: string, accounts?: any[] }) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [primaryAccountId, setPrimaryAccountId] = useState('');
  const [rows, setRows] = useState([{ id: 1, accountId: '', balance: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const types = [
    { id: 'accounts', label: lang === 'ar' ? 'الحسابات' : 'Accounts', icon: Icons.accounts },
    { id: 'products', label: lang === 'ar' ? 'المنتجات والتكاليف' : 'Products and Costs', icon: Icons.products },
    { id: 'customers', label: lang === 'ar' ? 'العملاء' : 'Customers', icon: Icons.customers },
    { id: 'suppliers', label: lang === 'ar' ? 'الموردين' : 'Suppliers', icon: Icons.suppliers },
  ];

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      
      const validRows = rows.filter(r => r.accountId && r.balance && !isNaN(parseFloat(r.balance)));
      if (validRows.length === 0) {
        throw new Error(lang === 'ar' ? 'يرجى إدخال الحسابات والأرصدة' : 'Please fill at least one row');
      }

      const res = await saveOpeningBalances({
        date,
        description,
        primaryAccountId,
        rows: validRows.map(r => ({ accountId: r.accountId, balance: parseFloat(r.balance) }))
      });

      if (!res.success) {
        throw new Error(res.error);
      }

      alert(lang === 'ar' ? 'تم حفظ الأرصدة الافتتاحية بنجاح!' : 'Opening balances saved successfully!');
      
      router.refresh(); // Crucial to update the parent FinancialClient's initialLedgerData

      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setPrimaryAccountId('');
      setRows([{ id: Date.now(), accountId: '', balance: '' }]);
      
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  if (selectedType === 'accounts') {
    return (
      <div className="opening-balances-detail" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <button className="btn-secondary" onClick={() => setSelectedType(null)}>
                {lang === 'ar' ? '→ رجوع' : '← Back'}
             </button>
             <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>
               {lang === 'ar' ? 'الأرصدة الافتتاحية للحسابات' : 'Accounts Opening Balances'}
             </h2>
        </div>

        <div className="card" style={{ padding: '30px', background: 'white' }}>
            {error && <div style={{ padding: '10px', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}
            <div className="top-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '200px', fontWeight: '500', color: '#475569', fontSize: '0.95rem' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-control" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '200px', fontWeight: '500', color: '#475569', fontSize: '0.95rem' }}>{lang === 'ar' ? 'الوصف' : 'Description'}</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="form-control" placeholder={lang === 'ar' ? 'رصيد افتتاحي...' : 'Opening Balance...'} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '200px', fontWeight: '500', color: '#475569', fontSize: '0.95rem' }}>{lang === 'ar' ? 'حساب الرصيد الافتتاحي' : 'Opening Bal. Account'}</label>
                    <select value={primaryAccountId} onChange={e => setPrimaryAccountId(e.target.value)} className="form-control">
                        <option value="">{lang === 'ar' ? 'اختر الحساب...' : 'Select account...'}</option>
                         {(accounts || [])
                             .filter(a => ['3101', '3102', '3201', '3301', '3302', '3401'].includes(String(a?.code || '')))
                             .map(a => <option key={a.id} value={a.id}>{a?.code || ''} - {lang === 'ar' && a.nameAr ? a.nameAr : a.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="table-responsive" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <table className="form-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 16px', textAlign: lang === 'ar' ? 'right' : 'left', width: '60%', color: '#334155', fontWeight: '600', borderInlineEnd: '1px solid #e2e8f0' }}>{lang === 'ar' ? 'اسم الحساب' : 'Account Name'}</th>
                            <th style={{ padding: '12px 16px', textAlign: lang === 'ar' ? 'right' : 'left', width: '40%', color: '#334155', fontWeight: '600' }}>{lang === 'ar' ? 'الرصيد الافتتاحي' : 'Opening Balance'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '10px 16px', borderInlineEnd: '1px solid #e2e8f0' }}>
                                    <select 
                                        className="form-control" 
                                        style={{ border: '1px solid #e2e8f0' }}
                                        value={row.accountId}
                                        onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, accountId: e.target.value } : r))}
                                    >
                                        <option value="">{lang === 'ar' ? 'اختر الحساب...' : 'Select account...'}</option>
                                        {accounts.map(a => <option key={a.id} value={a.id}>{a.code} - {lang === 'ar' && a.nameAr ? a.nameAr : a.name}</option>)}
                                    </select>
                                </td>
                                <td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        style={{ border: '1px solid #e2e8f0' }} 
                                        value={row.balance}
                                        onChange={e => setRows(rows.map(r => r.id === row.id ? { ...r, balance: e.target.value } : r))}
                                    />
                                    {rows.length > 1 && (
                                        <button onClick={() => setRows(rows.filter(r => r.id !== row.id))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem', padding: '0 8px' }}>×</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
                <button disabled={loading} className="btn-submit" onClick={handleSave} style={{ background: '#1e3a8a', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.7 : 1 }}>
                    {loading ? '...' : (lang === 'ar' ? 'متابعة' : 'Continue')}
                </button>
                <button onClick={() => setRows([...rows, { id: Date.now(), accountId: '', balance: '' }])} className="btn-add-row" style={{ background: '#1e3a8a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{lang === 'ar' ? 'إضافة سطر' : 'Add Row'}</span>
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span>
                </button>
            </div>
        </div>

        <style jsx>{`
            .form-control {
                flex: 1;
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                font-size: 0.95rem;
                outline: none;
                transition: border-color 0.2s;
                background: #ffffff;
            }
            .form-control:focus {
                border-color: #3b82f6;
            }
            .btn-add-row:hover, .btn-submit:hover {
                background: #1e40af !important;
            }
        `}</style>
      </div>
    );
  }

  if (selectedType) {
    return (
      <div className="opening-balances-detail">
        <div className="flex-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <button className="btn-secondary" onClick={() => setSelectedType(null)}>
                {lang === 'ar' ? '→ رجوع' : '← Back'}
             </button>
             <h2>{types.find(t => t.id === selectedType)?.label} - {lang === 'ar' ? 'أرصدة افتتاحية' : 'Opening Balances'}</h2>
        </div>
        <div className="card text-center" style={{ padding: '40px' }}>
            <p>{lang === 'ar' ? 'هذه الخاصية قيد التطوير وسيتم تفعيل الإدخال قريباً.' : 'This feature is under development and input will be activated soon.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="opening-balances-menu" style={{ padding: '3rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.75rem', color: '#1e293b', fontWeight: '500' }}>
        {lang === 'ar' ? 'اختر نوع القيد' : 'Choose Entry Type'}
      </h2>
      
      <div className="types-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        justifyContent: 'center'
      }}>
        {types.map((type) => (
          <button 
            key={type.id}
            className="type-card"
            onClick={() => setSelectedType(type.id)}
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              padding: '2.5rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: '#ffffff'
            }}
          >
            <div>{type.icon}</div>
            <div style={{ fontWeight: '500', color: '#475569', fontSize: '1rem' }}>{type.label}</div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .type-card:hover {
          border-color: #cbd5e1;
          background-color: #f8fafc !important;
        }
      `}</style>
    </div>
  );
}

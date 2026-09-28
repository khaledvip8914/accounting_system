'use client';

import { useState } from 'react';
import { Lang } from '@/lib/i18n';
import Link from 'next/link';
import CreateTaxModal from './CreateTaxModal';

interface Account {
  id: string;
  code: string;
  name: string;
  nameAr: string | null;
}

interface TaxRate {
  id: string;
  name: string;
  nameAr: string | null;
  rate: number;
  code: string;
  exemptionReasonCode: string | null;
  exemptionReasonText: string | null;
  isDefault: boolean;
  isActive: boolean;
  outputAccountId: string | null;
  inputAccountId: string | null;
}

interface TaxesClientProps {
  lang: Lang;
  dict: any;
  initialTaxes: TaxRate[];
  accounts: Account[];
}

export default function TaxesClient({ lang, dict, initialTaxes, accounts }: TaxesClientProps) {
  const [taxes, setTaxes] = useState<TaxRate[]>(initialTaxes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxRate | null>(null);

  const fetchTaxes = async () => {
    try {
      const res = await fetch('/api/taxes');
      if (res.ok) {
        const data = await res.json();
        setTaxes(data);
      }
    } catch (err) {
      console.error('Error fetching taxes', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الضريبة؟' : 'Are you sure you want to delete this tax rate?')) {
      return;
    }
    try {
      const res = await fetch(`/api/taxes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTaxes();
      } else {
        const data = await res.json();
        alert(data.error || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  return (
    <div className="taxes-module">
      <div className="page-header">
        <div>
          <Link href="/settings" className="back-link">
            &larr; {lang === 'ar' ? 'العودة للإعدادات' : 'Back to Settings'}
          </Link>
          <h1 className="page-title">{lang === 'ar' ? 'إعدادات الضرائب' : 'Tax Settings'}</h1>
          <p className="page-subtitle">{lang === 'ar' ? 'إدارة نسب الضرائب وأنواعها وربطها بهيئة الزكاة والدخل.' : 'Manage tax rates, types, and ZATCA mappings.'}</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => { setEditingTax(null); setIsModalOpen(true); }}
        >
          + {lang === 'ar' ? 'إضافة ضريبة' : 'Add Tax Rate'}
        </button>
      </div>

      <div className="card list-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ar' ? 'اسم الضريبة' : 'Tax Name'}</th>
                <th>{lang === 'ar' ? 'النسبة' : 'Rate'}</th>
                <th>{lang === 'ar' ? 'كود ZATCA' : 'ZATCA Code'}</th>
                <th>{lang === 'ar' ? 'حالة الضريبة' : 'Status'}</th>
                <th>{lang === 'ar' ? 'الافتراضي' : 'Default'}</th>
                <th className="text-right">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {taxes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center empty-state">
                    {lang === 'ar' ? 'لا توجد ضرائب معرفة' : 'No tax rates defined'}
                  </td>
                </tr>
              ) : (
                taxes.map(tax => (
                  <tr key={tax.id}>
                    <td>
                      <div className="font-semibold">{lang === 'ar' ? (tax.nameAr || tax.name) : tax.name}</div>
                      {(tax.exemptionReasonCode) && (
                        <div className="text-xs text-gray-500 mt-1">{tax.exemptionReasonCode}</div>
                      )}
                    </td>
                    <td>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#dbeafe', color: '#1e40af' }}>
                        {tax.rate < 1 && tax.rate > 0 ? tax.rate * 100 : tax.rate}%
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#f3f4f6', color: '#1f2937', fontFamily: 'monospace' }}>
                        {tax.code}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: tax.isActive ? '#dcfce7' : '#fee2e2', color: tax.isActive ? '#166534' : '#991b1b' }}>
                        {tax.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'غير نشط' : 'Inactive')}
                      </span>
                    </td>
                    <td>
                      {tax.isDefault && (
                        <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#f3e8ff', color: '#6b21a8' }}>
                          {lang === 'ar' ? 'افتراضي' : 'Default'}
                        </span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button className="action-btn edit" onClick={() => { setEditingTax(tax); setIsModalOpen(true); }} title={lang === 'ar' ? 'تعديل' : 'Edit'}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(tax.id)} title={lang === 'ar' ? 'حذف' : 'Delete'} disabled={tax.isDefault}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CreateTaxModal 
          lang={lang} 
          dict={dict} 
          accounts={accounts}
          initialData={editingTax}
          onClose={() => setIsModalOpen(false)} 
          onSaved={() => {
            setIsModalOpen(false);
            fetchTaxes();
          }}
        />
      )}

      <style jsx>{`
        .back-link { display: inline-block; margin-bottom: 1rem; color: var(--accent-primary); text-decoration: none; font-weight: 500; }
        .back-link:hover { text-decoration: underline; }
        .list-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .table-responsive { overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: center; padding: 1rem; border-bottom: 2px solid #f1f5f9; color: #64748b; font-weight: 600; font-size: 0.875rem; }
        .data-table td { text-align: center; padding: 1rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; color: #1e293b; font-weight: 500; }
        [dir="rtl"] .data-table th, [dir="rtl"] .data-table td { text-align: center; }
        .badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .bg-blue-100 { background-color: #dbeafe; } .text-blue-800 { color: #1e40af; }
        .bg-gray-100 { background-color: #f3f4f6; } .text-gray-800 { color: #1f2937; }
        .bg-green-100 { background-color: #dcfce7; } .text-green-800 { color: #166534; }
        .bg-red-100 { background-color: #fee2e2; } .text-red-800 { color: #991b1b; }
        .bg-purple-100 { background-color: #f3e8ff; } .text-purple-800 { color: #6b21a8; }
        .action-buttons { display: flex; gap: 0.5rem; justify-content: flex-end; }
        .action-btn { background: none; border: 1px solid #e2e8f0; border-radius: 6px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: all 0.2s; }
        .action-btn:hover { background: #f8fafc; color: var(--accent-primary); border-color: var(--accent-primary); }
        .action-btn.delete:hover:not(:disabled) { background: #fef2f2; color: #ef4444; border-color: #ef4444; }
        .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

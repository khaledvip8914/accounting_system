'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateYearModal from './CreateYearModal';
import Link from 'next/link';

export default function FinancialYearsClient({
  initialYears,
  lang,
  dict
}: {
  initialYears: any[];
  lang: 'ar' | 'en';
  dict: any;
}) {
  const [years, setYears] = useState(initialYears);
  const [showModal, setShowModal] = useState(false);
  const [editingYear, setEditingYear] = useState<any>(null);
  const router = useRouter();

  const handleSave = async (data: any) => {
    try {
      if (editingYear) {
        const res = await fetch(`/api/settings/financial-years/${editingYear.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json();
          alert(err.error || 'Error updating year');
          return;
        }
      } else {
        const res = await fetch('/api/settings/financial-years', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json();
          alert(err.error || 'Error creating year');
          return;
        }
      }
      
      const res = await fetch('/api/settings/financial-years');
      const latest = await res.json();
      setYears(latest);
      setShowModal(false);
      setEditingYear(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Network Error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه السنة المالية؟' : 'Are you sure you want to delete this year?')) return;
    
    try {
      const res = await fetch(`/api/settings/financial-years/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Error deleting year');
        return;
      }
      setYears(years.filter((y) => y.id !== id));
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Network Error');
    }
  };

  const handleCloseYear = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'تنبيه هام جداً: إغلاق السنة المالية يعني توليد قيود الإقفال ونقل الأرباح ولن تتمكن من إضافة أي عملية جديدة في هذه السنة. هل تريد المتابعة؟' : 'CRITICAL WARNING: Closing the year will generate closing entries, transfer profits to retained earnings, and you will not be able to add any new transactions in this year. Continue?')) return;

    try {
      const res = await fetch(`/api/settings/financial-years/${id}/close`, {
        method: 'POST',
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Error closing year');
        return;
      }
      
      const responseData = await res.json();
      alert(lang === 'ar' ? `تم الإغلاق بنجاح! صافي الأرباح: ${responseData.netProfit}` : `Year closed successfully! Net Profit: ${responseData.netProfit}`);
      
      const refresh = await fetch('/api/settings/financial-years');
      setYears(await refresh.json());
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Network Error');
    }
  };

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/settings" className="btn-back" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={lang === 'ar' ? "M5 12h14M5 12l6-6M5 12l6 6" : "M19 12H5M19 12l-6-6M19 12l-6 6"}/></svg>
            <span>{lang === 'ar' ? 'العودة للإعدادات' : 'Back to Settings'}</span>
          </Link>
          <div>
            <h2 className="card-title">{lang === 'ar' ? 'السنوات المالية' : 'Financial Years'}</h2>
            <p className="card-desc">{lang === 'ar' ? 'إدارة الفترات المالية المحاسبية والإقفال السنوي' : 'Manage accounting periods and annual closing'}</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingYear(null); setShowModal(true); }}>
          <span className="icon">+</span> {lang === 'ar' ? 'سنة مالية جديدة' : 'New Financial Year'}
        </button>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'اسم السنة' : 'Name'}</th>
              <th>{lang === 'ar' ? 'من تاريخ' : 'Start Date'}</th>
              <th>{lang === 'ar' ? 'إلى تاريخ' : 'End Date'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'افتراضية' : 'Default'}</th>
              <th>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {years.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                  {lang === 'ar' ? 'لا يوجد سنوات مالية. أضف سنة جديدة للبدء.' : 'No financial years. Add a new year to start.'}
                </td>
              </tr>
            ) : years.map((year) => (
              <tr key={year.id}>
                <td style={{ fontWeight: 600 }}>{year.name}</td>
                <td>{new Date(year.startDate).toLocaleDateString()}</td>
                <td>{new Date(year.endDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${year.status === 'Open' ? 'badge-success' : 'badge-danger'}`}>
                    {year.status === 'Open' ? (lang === 'ar' ? 'مفتوحة' : 'Open') : (lang === 'ar' ? 'مغلقة' : 'Closed')}
                  </span>
                </td>
                <td>
                  {year.isActive && (
                    <span className="badge badge-info">{lang === 'ar' ? 'نعم' : 'Yes'}</span>
                  )}
                </td>
                <td>
                  <div className="actions-group">
                    {year.status === 'Open' && (
                      <>
                        <button className="btn-icon text-primary" onClick={() => { setEditingYear(year); setShowModal(true); }} title={lang === 'ar' ? 'تعديل' : 'Edit'}>
                          ✎
                        </button>
                        <button className="btn-icon text-danger" onClick={() => handleDelete(year.id)} title={lang === 'ar' ? 'حذف' : 'Delete'}>
                          🗑
                        </button>
                        <button className="btn-action text-warning" onClick={() => handleCloseYear(year.id)}>
                          🔒 {lang === 'ar' ? 'إغلاق السنة' : 'Close Year'}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CreateYearModal
          yearToEdit={editingYear}
          lang={lang}
          onClose={() => { setShowModal(false); setEditingYear(null); }}
          onSave={handleSave}
        />
      )}

      <style jsx>{`
        .actions-group { display: flex; gap: 0.5rem; align-items: center; justify-content: center; }
        .btn-action { background: none; border: 1px solid #f59e0b; color: #d97706; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem; font-weight: 600; }
        .btn-action:hover { background: #fef3c7; }
        .badge-danger { background: #fee2e2; color: #991b1b; }
        th, td { text-align: center !important; vertical-align: middle !important; }
      `}</style>
    </div>
  );
}

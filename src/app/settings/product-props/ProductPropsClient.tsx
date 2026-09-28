'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CreateProductPropModal from './CreateProductPropModal';

export default function ProductPropsClient({
  initialProps,
  lang,
  dict
}: {
  initialProps: any[];
  lang: 'ar' | 'en';
  dict: any;
}) {
  const [propsList, setPropsList] = useState(initialProps);
  const [showModal, setShowModal] = useState(false);
  const [editingProp, setEditingProp] = useState<any>(null);
  const router = useRouter();

  const handleSave = async (data: any) => {
    try {
      if (editingProp) {
        const res = await fetch(`/api/settings/product-props/${editingProp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json();
          alert(err.error || 'Error updating prop');
          return;
        }
      } else {
        const res = await fetch('/api/settings/product-props', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json();
          alert(err.error || 'Error creating prop');
          return;
        }
      }
      
      const res = await fetch('/api/settings/product-props');
      const latest = await res.json();
      setPropsList(latest);
      setShowModal(false);
      setEditingProp(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Network Error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الخاصية؟' : 'Are you sure you want to delete this property?')) return;
    
    try {
      const res = await fetch(`/api/settings/product-props/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Error deleting prop');
        return;
      }
      setPropsList(propsList.filter((p) => p.id !== id));
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Network Error');
    }
  };

  const translateType = (type: string) => {
    if (lang === 'en') return type.charAt(0).toUpperCase() + type.slice(1);
    switch (type) {
      case 'text': return 'نص (Text)';
      case 'number': return 'رقم (Number)';
      case 'select': return 'قائمة منسدلة (Select)';
      case 'boolean': return 'نعم/لا (Boolean)';
      default: return type;
    }
  };

  return (
    <div className="pro-max-container">
      <div className="pro-max-card">
        <div className="card-header">
          <div className="header-info">
            <Link href="/settings" className="btn-back">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={lang === 'ar' ? "M5 12h14M5 12l6-6M5 12l6 6" : "M19 12H5M19 12l-6-6M19 12l-6 6"}/></svg>
              <span>{lang === 'ar' ? 'العودة للإعدادات' : 'Back to Settings'}</span>
            </Link>
            <div className="header-text">
              <h2>{lang === 'ar' ? 'خصائص المنتجات' : 'Product Characteristics'}</h2>
              <p>{lang === 'ar' ? 'إضافة أبعاد وخصائص مخصصة للأصناف (لون، مقاس، الخ)' : 'Add custom dimensions and characteristics for products (color, size, etc)'}</p>
            </div>
          </div>
          <button className="btn-primary" onClick={() => { setEditingProp(null); setShowModal(true); }}>
            <span className="icon">+</span> {lang === 'ar' ? 'إضافة خاصية' : 'New Characteristic'}
          </button>
        </div>

        <div className="table-wrapper">
          <table className="pro-table">
            <thead>
              <tr>
                <th>{lang === 'ar' ? 'اسم الخاصية' : 'Name'}</th>
                <th>{lang === 'ar' ? 'الاسم بالإنجليزية' : 'Name (En)'}</th>
                <th>{lang === 'ar' ? 'النوع' : 'Type'}</th>
                <th>{lang === 'ar' ? 'إلزامي؟' : 'Required?'}</th>
                <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                <th>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {propsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    {lang === 'ar' ? 'لا توجد خصائص. أضف خاصية جديدة للبدء.' : 'No characteristics. Add a new one to start.'}
                  </td>
                </tr>
              ) : propsList.map((prop) => (
                <tr key={prop.id}>
                  <td className="font-semibold">{prop.name}</td>
                  <td>{prop.nameAr || '-'}</td>
                  <td>
                    <span className="type-badge">{translateType(prop.type)}</span>
                  </td>
                  <td>{prop.isRequired ? (lang === 'ar' ? 'نعم' : 'Yes') : (lang === 'ar' ? 'لا' : 'No')}</td>
                  <td>
                    <span className={`status-badge ${prop.isActive ? 'active' : 'inactive'}`}>
                      {prop.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'غير نشط' : 'Inactive')}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon edit" onClick={() => { setEditingProp(prop); setShowModal(true); }} title={lang === 'ar' ? 'تعديل' : 'Edit'}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(prop.id)} title={lang === 'ar' ? 'حذف' : 'Delete'}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <CreateProductPropModal
          propToEdit={editingProp}
          lang={lang}
          onClose={() => { setShowModal(false); setEditingProp(null); }}
          onSave={handleSave}
        />
      )}

      <style jsx>{`
        .pro-max-container {
          --primary: #4f46e5;
          --primary-hover: #4338ca;
          --surface: #ffffff;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --radius-lg: 16px;
          --radius-md: 8px;
          --radius-sm: 6px;
          --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .pro-max-card {
          background: var(--surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border);
          background: #f8fafc;
        }

        .header-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: var(--transition);
          background: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          width: fit-content;
        }

        .btn-back:hover {
          color: var(--text-main);
          border-color: #cbd5e1;
          box-shadow: var(--shadow-sm);
        }

        .header-text h2 {
          margin: 0 0 0.25rem 0;
          font-size: 1.5rem;
          color: var(--text-main);
        }

        .header-text p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-primary:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        .table-wrapper {
          overflow-x: auto;
          padding: 1rem;
        }

        .pro-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .pro-table th {
          background: #f1f5f9;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 1rem;
          text-align: right;
          border-bottom: 2px solid var(--border);
        }
        
        [dir="ltr"] .pro-table th { text-align: left; }

        .pro-table td {
          padding: 1rem;
          color: var(--text-main);
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }

        .pro-table tbody tr:hover td {
          background: #f8fafc;
        }

        .font-semibold { font-weight: 600; }

        .empty-state {
          text-align: center !important;
          padding: 3rem !important;
          color: var(--text-muted) !important;
        }

        .type-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #475569;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.inactive {
          background: #f1f5f9;
          color: #475569;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-icon.edit { color: var(--primary); }
        .btn-icon.edit:hover { background: #e0e7ff; }
        .btn-icon.delete { color: #ef4444; }
        .btn-icon.delete:hover { background: #fee2e2; }
      `}</style>
    </div>
  );
}

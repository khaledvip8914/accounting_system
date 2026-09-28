'use client';

import { useState, useEffect } from 'react';
import { Lang } from '@/lib/i18n';
import Link from 'next/link';

interface AdditionalFieldsClientProps {
  lang: Lang;
  dict: any;
  companyId: string;
}

const MODULES = [
  { id: 'SalesInvoice', label: 'Sales Invoice', labelAr: 'فاتورة مبيعات' },
  { id: 'PurchaseInvoice', label: 'Purchase Invoice', labelAr: 'فاتورة مشتريات' },
  { id: 'Customer', label: 'Customer', labelAr: 'عميل' },
  { id: 'Supplier', label: 'Supplier', labelAr: 'مورد' },
  { id: 'Product', label: 'Product', labelAr: 'صنف' },
  { id: 'Employee', label: 'Employee', labelAr: 'موظف' },
];

const FIELD_TYPES = [
  { id: 'Text', label: 'Text', labelAr: 'نص' },
  { id: 'Number', label: 'Number', labelAr: 'رقم' },
  { id: 'Date', label: 'Date', labelAr: 'تاريخ' },
  { id: 'Select', label: 'Dropdown / Select', labelAr: 'قائمة منسدلة' },
  { id: 'Checkbox', label: 'Checkbox', labelAr: 'مربع اختيار' },
];

export default function AdditionalFieldsClient({ lang, dict, companyId }: AdditionalFieldsClientProps) {
  const [fields, setFields] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);

  const [formData, setFormData] = useState({
    module: 'SalesInvoice',
    name: '',
    label: '',
    labelAr: '',
    type: 'Text',
    options: '', 
    isRequired: false,
    showInPrint: false,
    isActive: true,
  });

  const fetchFields = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/settings/custom-fields?companyId=${companyId}`);
      if (res.ok) {
        const data = await res.json();
        setFields(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [companyId]);

  const handleOpenModal = (field?: any) => {
    if (field) {
      setEditingField(field);
      setFormData({
        module: field.module,
        name: field.name,
        label: field.label,
        labelAr: field.labelAr || '',
        type: field.type,
        options: field.options ? field.options.join(', ') : '',
        isRequired: field.isRequired,
        showInPrint: field.showInPrint,
        isActive: field.isActive,
      });
    } else {
      setEditingField(null);
      setFormData({
        module: 'SalesInvoice',
        name: '',
        label: '',
        labelAr: '',
        type: 'Text',
        options: '',
        isRequired: false,
        showInPrint: false,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      companyId,
      options: formData.type === 'Select' && formData.options ? formData.options.split(',').map(o => o.trim()) : null,
    };

    try {
      const url = editingField 
        ? `/api/v1/settings/custom-fields/${editingField.id}`
        : '/api/v1/settings/custom-fields';
      
      const method = editingField ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchFields();
        setIsModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || 'Error saving field');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return;
    try {
      const res = await fetch(`/api/v1/settings/custom-fields/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchFields();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/settings" className="action-btn" title={lang === 'ar' ? 'العودة للإعدادات' : 'Back to Settings'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {lang === 'ar' ? <polyline points="15 18 9 12 15 6"></polyline> : <polyline points="9 18 15 12 9 6"></polyline>}
            </svg>
          </Link>
          <div>
            <h1 className="page-title">{dict.settings.additionalFields || (lang === 'ar' ? 'الحقول الإضافية' : 'Additional Fields')}</h1>
            <p className="page-subtitle">{lang === 'ar' ? 'إدارة وتخصيص الحقول الإضافية للنظام' : 'Manage and customize additional system fields'}</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          {lang === 'ar' ? '+ حقل جديد' : '+ New Field'}
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading...</div>
      ) : (
        <div className="card table-container">
          <table>
            <thead>
              <tr>
                <th>{lang === 'ar' ? 'الاسم البرمجي' : 'Name'}</th>
                <th>{lang === 'ar' ? 'الاسم الظاهر' : 'Label'}</th>
                <th>{lang === 'ar' ? 'النموذج' : 'Module'}</th>
                <th>{lang === 'ar' ? 'النوع' : 'Type'}</th>
                <th>{lang === 'ar' ? 'إلزامي' : 'Required'}</th>
                <th>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {fields.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                    {lang === 'ar' ? 'لا يوجد حقول إضافية' : 'No additional fields found'}
                  </td>
                </tr>
              ) : (
                fields.map((f) => {
                  const mod = MODULES.find(m => m.id === f.module);
                  const typ = FIELD_TYPES.find(t => t.id === f.type);
                  return (
                    <tr key={f.id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--accent-primary)' }}>{f.name}</td>
                      <td>{lang === 'ar' ? (f.labelAr || f.label) : f.label}</td>
                      <td>
                        <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.8rem' }}>
                          {lang === 'ar' ? mod?.labelAr : mod?.label}
                        </span>
                      </td>
                      <td>{lang === 'ar' ? typ?.labelAr : typ?.label}</td>
                      <td>{f.isRequired ? '✅' : '❌'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => handleOpenModal(f)}>
                            {lang === 'ar' ? 'تعديل' : 'Edit'}
                          </button>
                          <button style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => handleDelete(f.id)}>
                            {lang === 'ar' ? 'حذف' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-custom wide-modal">
            <div className="modal-header-custom">
              <h2>
                {editingField 
                  ? (lang === 'ar' ? 'تعديل حقل' : 'Edit Field') 
                  : (lang === 'ar' ? 'إنشاء حقل جديد' : 'Create New Field')}
              </h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-row-custom">
                <div className="custom-input-group">
                  <label>{lang === 'ar' ? 'النموذج المستهدف' : 'Target Module'}</label>
                  <select 
                    className="custom-input"
                    value={formData.module}
                    onChange={(e) => setFormData({...formData, module: e.target.value})}
                    disabled={!!editingField}
                  >
                    {MODULES.map(m => (
                      <option key={m.id} value={m.id} style={{ background: '#1e1e1e', color: 'white' }}>{lang === 'ar' ? m.labelAr : m.label}</option>
                    ))}
                  </select>
                </div>
                <div className="custom-input-group">
                  <label>{lang === 'ar' ? 'الاسم البرمجي (بدون مسافات)' : 'System Name'}</label>
                  <input 
                    type="text" 
                    className="custom-input"
                    style={{ fontFamily: 'monospace', color: 'var(--accent-primary)' }}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value.replace(/\s+/g, '_').toLowerCase()})}
                    disabled={!!editingField}
                    placeholder="e.g. tracking_number"
                    required
                  />
                </div>
              </div>

              <div className="form-row-custom">
                <div className="custom-input-group">
                  <label>{lang === 'ar' ? 'الاسم الظاهر (إنجليزي)' : 'Label (English)'}</label>
                  <input 
                    type="text" 
                    className="custom-input"
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    placeholder="e.g. Tracking Number"
                    required
                  />
                </div>
                <div className="custom-input-group">
                  <label>{lang === 'ar' ? 'الاسم الظاهر (عربي)' : 'Label (Arabic)'}</label>
                  <input 
                    type="text" 
                    className="custom-input"
                    value={formData.labelAr}
                    onChange={(e) => setFormData({...formData, labelAr: e.target.value})}
                    placeholder="مثل: رقم التتبع"
                  />
                </div>
              </div>

              <div className="form-row-custom">
                <div className="custom-input-group">
                  <label>{lang === 'ar' ? 'نوع الحقل' : 'Field Type'}</label>
                  <select 
                    className="custom-input"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    {FIELD_TYPES.map(t => (
                      <option key={t.id} value={t.id} style={{ background: '#1e1e1e', color: 'white' }}>{lang === 'ar' ? t.labelAr : t.label}</option>
                    ))}
                  </select>
                </div>
                
                {formData.type === 'Select' && (
                  <div className="custom-input-group">
                    <label>{lang === 'ar' ? 'الخيارات (مفصولة بفاصلة)' : 'Options (comma separated)'}</label>
                    <input 
                      type="text" 
                      className="custom-input"
                      value={formData.options}
                      onChange={(e) => setFormData({...formData, options: e.target.value})}
                      placeholder="Red, Blue, Green"
                      required
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                <label className="checkbox-card">
                  <input 
                    type="checkbox" 
                    className="custom-checkbox"
                    checked={formData.isRequired}
                    onChange={(e) => setFormData({...formData, isRequired: e.target.checked})}
                  />
                  <span>{lang === 'ar' ? 'حقل إلزامي' : 'Required Field'}</span>
                </label>
                
                <label className="checkbox-card">
                  <input 
                    type="checkbox" 
                    className="custom-checkbox"
                    checked={formData.showInPrint}
                    onChange={(e) => setFormData({...formData, showInPrint: e.target.checked})}
                  />
                  <span>{lang === 'ar' ? 'إظهار في الطباعة' : 'Show in Print'}</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="btn-primary">
                  {lang === 'ar' ? 'حفظ الحقل' : 'Save Field'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Modal Custom Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        
        .modal-content-custom {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          width: 90%;
          max-width: 450px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease;
        }
        
        .modal-content-custom.wide-modal {
          max-width: 650px;
        }
        
        .modal-header-custom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--glass-border);
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%);
        }
        
        .modal-header-custom h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          color: white;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        
        .close-btn:hover {
          color: white;
        }
        
        .form-row-custom {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        
        @media (max-width: 600px) {
          .form-row-custom {
            grid-template-columns: 1fr;
          }
        }
        
        .custom-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .custom-input-group label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        
        .custom-input {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.875rem 1rem;
          color: white;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
          width: 100%;
          appearance: none;
        }
        
        .custom-input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
        
        .custom-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .checkbox-card {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--glass-border);
          background: rgba(0, 0, 0, 0.2);
          flex: 1;
          transition: all 0.2s;
        }
        
        .checkbox-card:hover {
          background: rgba(0, 0, 0, 0.4);
        }
        
        .custom-checkbox {
          width: 18px;
          height: 18px;
          accent-color: var(--accent-primary);
        }
        
        .btn-cancel {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

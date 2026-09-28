'use client';

import { useState } from 'react';
import { Lang } from '@/lib/i18n';

interface Account {
  id: string;
  code: string;
  name: string;
  nameAr: string | null;
}

interface TaxRate {
  id?: string;
  name: string;
  nameAr?: string | null;
  rate: number;
  code: string;
  exemptionReasonCode?: string | null;
  exemptionReasonText?: string | null;
  isDefault: boolean;
  isActive: boolean;
  outputAccountId?: string | null;
  inputAccountId?: string | null;
}

interface CreateTaxModalProps {
  lang: Lang;
  dict: any;
  accounts: Account[];
  initialData?: TaxRate | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function CreateTaxModal({ lang, dict, accounts, initialData, onClose, onSaved }: CreateTaxModalProps) {
  const [formData, setFormData] = useState<TaxRate>(initialData || {
    name: '',
    nameAr: '',
    rate: 15,
    code: 'S',
    exemptionReasonCode: '',
    exemptionReasonText: '',
    isDefault: false,
    isActive: true,
    outputAccountId: '',
    inputAccountId: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const zatcaCodes = [
    { code: 'S', label: lang === 'ar' ? 'النسبة الأساسية (Standard)' : 'Standard Rate' },
    { code: 'Z', label: lang === 'ar' ? 'نسبة الصفر (Zero Rated)' : 'Zero Rated' },
    { code: 'E', label: lang === 'ar' ? 'معفاة (Exempt)' : 'Exempt' },
    { code: 'O', label: lang === 'ar' ? 'خارج النطاق (Out of Scope)' : 'Out of Scope' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const url = initialData?.id ? `/api/taxes/${initialData.id}` : '/api/taxes';
      const method = initialData?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save tax rate');
      }

      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="modal-header">
          <h2>{initialData ? (lang === 'ar' ? 'تعديل الضريبة' : 'Edit Tax Rate') : (lang === 'ar' ? 'إضافة ضريبة جديدة' : 'Add New Tax Rate')}</h2>
          <button type="button" className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>{lang === 'ar' ? 'اسم الضريبة (إنجليزي)' : 'Tax Name (English)'} *</label>
              <input 
                type="text" 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Standard VAT 15%"
              />
            </div>
            <div className="form-group">
              <label>{lang === 'ar' ? 'اسم الضريبة (عربي)' : 'Tax Name (Arabic)'}</label>
              <input 
                type="text" 
                value={formData.nameAr || ''} 
                onChange={e => setFormData({...formData, nameAr: e.target.value})} 
                placeholder="مثال: ضريبة القيمة المضافة 15%"
              />
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'نسبة الضريبة (%)' : 'Tax Rate (%)'} *</label>
              <input 
                type="number" 
                step="0.01" 
                min="0"
                required 
                value={formData.rate} 
                onChange={e => setFormData({...formData, rate: parseFloat(e.target.value)})} 
              />
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'كود الفئة (ZATCA)' : 'Category Code (ZATCA)'} *</label>
              <select 
                required 
                value={formData.code} 
                onChange={e => setFormData({...formData, code: e.target.value})}
              >
                {zatcaCodes.map(zc => (
                  <option key={zc.code} value={zc.code}>{zc.code} - {zc.label}</option>
                ))}
              </select>
            </div>

            {(formData.code === 'Z' || formData.code === 'E') && (
              <>
                <div className="form-group">
                  <label>{lang === 'ar' ? 'كود سبب الإعفاء (ZATCA)' : 'Exemption Reason Code'} *</label>
                  <input 
                    type="text" 
                    required={formData.code === 'Z' || formData.code === 'E'} 
                    value={formData.exemptionReasonCode || ''} 
                    onChange={e => setFormData({...formData, exemptionReasonCode: e.target.value})} 
                    placeholder="e.g. VATEX-SA-29"
                  />
                </div>
                <div className="form-group">
                  <label>{lang === 'ar' ? 'نص سبب الإعفاء' : 'Exemption Reason Text'}</label>
                  <input 
                    type="text" 
                    value={formData.exemptionReasonText || ''} 
                    onChange={e => setFormData({...formData, exemptionReasonText: e.target.value})} 
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>{lang === 'ar' ? 'حساب المبيعات (ضريبة المخرجات)' : 'Sales Account (Output VAT)'}</label>
              <select 
                value={formData.outputAccountId || ''} 
                onChange={e => setFormData({...formData, outputAccountId: e.target.value})}
              >
                <option value="">{lang === 'ar' ? 'اختر الحساب...' : 'Select account...'}</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.code} - {lang === 'ar' ? (acc.nameAr || acc.name) : acc.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'حساب المشتريات (ضريبة المدخلات)' : 'Purchases Account (Input VAT)'}</label>
              <select 
                value={formData.inputAccountId || ''} 
                onChange={e => setFormData({...formData, inputAccountId: e.target.value})}
              >
                <option value="">{lang === 'ar' ? 'اختر الحساب...' : 'Select account...'}</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.code} - {lang === 'ar' ? (acc.nameAr || acc.name) : acc.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={formData.isDefault} 
                  onChange={e => setFormData({...formData, isDefault: e.target.checked})} 
                />
                {lang === 'ar' ? 'تعيين كضريبة افتراضية للمنتجات والفواتير' : 'Set as default tax for products and invoices'}
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {dict.common?.cancel || (lang === 'ar' ? 'إلغاء' : 'Cancel')}
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (dict.common?.save || (lang === 'ar' ? 'حفظ' : 'Save'))}
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 12px; width: 100%; max-width: 600px; padding: 2rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; }
        .modal-header h2 { margin: 0; font-size: 1.25rem; color: #0f172a; }
        .close-btn { background: none; border: none; font-size: 1.5rem; color: #64748b; cursor: pointer; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .checkbox-group { grid-column: 1 / -1; }
        .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 500; }
        label { font-weight: 600; font-size: 0.875rem; color: #334155; }
        input:not([type="checkbox"]), select { padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
        input[type="checkbox"] { width: 1.25rem; height: 1.25rem; cursor: pointer; }
        input:focus, select:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid #f1f5f9; padding-top: 1.5rem; }
        .btn-primary { background: var(--accent-primary); color: white; padding: 0.75rem 1.5rem; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; }
        .btn-secondary { background: white; color: #475569; padding: 0.75rem 1.5rem; border-radius: 8px; border: 1px solid #cbd5e1; font-weight: 600; cursor: pointer; }
        .error-message { background: #fee2e2; color: #b91c1c; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; font-size: 0.875rem; }
      `}</style>
    </div>
  );
}

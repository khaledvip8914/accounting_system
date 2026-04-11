'use client';

import { useState, useTransition } from 'react';
import { Lang } from '@/lib/i18n';
import { updateCompanyProfile } from '../actions';

export default function GeneralSettingsClient({ lang, dict, initialProfile }: { lang: Lang, dict: any, initialProfile: any }) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState(initialProfile || {
    name: 'عسيف',
    nameAr: 'عسيف',
    email: '',
    phone: '',
    logo: '',
    streetName: '',
    buildingNumber: '',
    city: '',
    district: '',
    postalCode: '',
    country: 'SA',
    currency: 'SAR',
    taxNumber: '',
    taxSupplyDateType: 'issue',
    separateTaxAccounts: false
  });
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for base64 storage
        alert(lang === 'ar' ? 'حجم الملف كبير جداً (الحد الأقصى 1 ميجابايت)' : 'File is too large (max 1MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const res = await updateCompanyProfile(formData);
      if (res.success) {
        setMessage({ type: 'success', text: lang === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to save' });
      }
    });
  };

  return (
    <div className="general-settings-container">
      <div className="settings-header">
        <h2 className="title">{lang === 'ar' ? 'الإعدادات العامة' : 'General Settings'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="logo-upload-section">
           <div className="logo-preview-box">
             <div className="logo-placeholder">
                {formData.logo ? (
                  <img src={formData.logo} alt="Company Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                )}
             </div>
             <div className="upload-options">
                <input type="file" id="logo-input" className="hidden-input" accept="image/*" onChange={handleLogoChange} />
                <label htmlFor="logo-input" className="upload-label">{lang === 'ar' ? 'رفع الشعار' : 'Upload Logo'}</label>
                {formData.logo && (
                  <button type="button" onClick={() => setFormData({...formData, logo: ''})} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block', width: '100%', textAlign: 'center' }}>
                    {lang === 'ar' ? 'إزالة الشعار' : 'Remove Logo'}
                  </button>
                )}
             </div>
           </div>
        </div>

        <div className="form-main-content">
          <div className="form-group-horizontal">
            <label>{lang === 'ar' ? 'اسم المنشأة' : 'Company Name'}</label>
            <input 
              type="text" 
              className="ui-input" 
              value={formData.name || ''} 
              onChange={e => setFormData({...formData, name: e.target.value, nameAr: e.target.value})} 
            />
          </div>

          <div className="form-group-horizontal">
            <label>{lang === 'ar' ? 'البريد الإلكتروني للمنشأة' : 'Company Email'}</label>
            <input 
              type="email" 
              className="ui-input" 
              value={formData.email || ''} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              placeholder="example@gmail.com"
            />
          </div>

          <div className="form-group-horizontal">
            <label>{lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
            <input 
              type="text" 
              className="ui-input text-right" 
              value={formData.phone || ''} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
              placeholder="+966501234567"
            />
          </div>

          <div className="form-group-horizontal align-top">
            <label>{lang === 'ar' ? 'العنوان' : 'Address'}</label>
            <div className="address-grid">
               <input type="text" placeholder={lang === 'ar' ? "اسم الشارع" : "Street"} value={formData.streetName || ''} onChange={e => setFormData({...formData, streetName: e.target.value})} />
               <input type="text" placeholder={lang === 'ar' ? "رقم المبنى" : "Bldg No"} value={formData.buildingNumber || ''} onChange={e => setFormData({...formData, buildingNumber: e.target.value})} />
               <input type="text" placeholder={lang === 'ar' ? "المدينة" : "City"} value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} />
               <input type="text" placeholder={lang === 'ar' ? "الحي" : "District"} value={formData.district || ''} onChange={e => setFormData({...formData, district: e.target.value})} />
               <input type="text" placeholder={lang === 'ar' ? "الرمز البريدي" : "Postal Code"} value={formData.postalCode || ''} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
               <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})}>
                  <option value="SA">{lang === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</option>
                  <option value="AE">{lang === 'ar' ? 'الإمارات العربية المتحدة' : 'UAE'}</option>
               </select>
            </div>
          </div>

          <div className="form-group-horizontal">
            <label>{lang === 'ar' ? 'العملة' : 'Currency'}</label>
            <select className="ui-input" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}>
               <option value="SAR">{lang === 'ar' ? 'ريال سعودي' : 'Saudi Riyal'}</option>
               <option value="USD">{lang === 'ar' ? 'دولار أمريكي' : 'US Dollar'}</option>
            </select>
          </div>

          <div className="form-group-horizontal">
            <label>{lang === 'ar' ? 'الرقم الضريبي' : 'Tax Number'}</label>
            <input 
              type="text" 
              className="ui-input" 
              value={formData.taxNumber || ''} 
              onChange={e => setFormData({...formData, taxNumber: e.target.value})} 
            />
          </div>

          <div className="tax-preference-row">
             <label>{lang === 'ar' ? 'تاريخ التوريد المستخدم في الإقرار الضريبي' : 'Tax supply date preference'}</label>
             <div className="radio-group">
                <label>
                   <input 
                      type="radio" 
                      name="taxDate" 
                      checked={formData.taxSupplyDateType === 'issue'} 
                      onChange={() => setFormData({...formData, taxSupplyDateType: 'issue'})}
                   />
                   {lang === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}
                </label>
                <label>
                   <input 
                      type="radio" 
                      name="taxDate" 
                      checked={formData.taxSupplyDateType === 'due'} 
                      onChange={() => setFormData({...formData, taxSupplyDateType: 'due'})}
                   />
                   {lang === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}
                </label>
             </div>
          </div>

          <div className="checkbox-row">
             <input 
                type="checkbox" 
                checked={formData.separateTaxAccounts} 
                onChange={e => setFormData({...formData, separateTaxAccounts: e.target.checked})} 
             />
             <label>{lang === 'ar' ? 'التفريق بين ضريبة المبيعات وضريبة الشراء' : 'Separate sales and purchase tax accounts'}</label>
          </div>
        </div>

        <div className="form-footer">
           <div className="footer-title">{lang === 'ar' ? 'إعدادات ترقيم المستندات' : 'Document Numbering Settings'}</div>
           <div className="save-btn-container">
              <button type="submit" className="save-btn" disabled={isPending}>
                 {isPending ? '⏳' : (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes')}
              </button>
           </div>
        </div>
      </form>

      {message && (
        <div className={`status-msg ${message.type}`}>
           {message.text}
        </div>
      )}

      <style jsx>{`
        .general-settings-container {
          background: white;
          color: #334155;
          min-height: 100vh;
          padding: 2rem;
          font-family: inherit;
        }
        .settings-header {
          border-bottom: 2px solid #f1f5f9;
          margin-bottom: 3rem;
          padding-bottom: 1rem;
          display: flex;
          justify-content: flex-end;
        }
        .title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e3a8a;
        }
        .settings-form {
          max-width: 900px;
          margin: 0 auto;
        }
        .logo-upload-section {
          display: flex;
          justify-content: center;
          margin-bottom: 3rem;
        }
        .logo-preview-box {
          border: 1px solid #e2e8f0;
          padding: 2rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          background: #f8fafc;
        }
        .logo-placeholder {
          width: 150px;
          height: 100px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed #cbd5e0;
        }
        .upload-label {
          background: #10b981;
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .hidden-input { display: none; }
        
        .form-group-horizontal {
          display: flex;
          align-items: center;
          margin-bottom: 1.25rem;
          gap: 2rem;
        }
        .form-group-horizontal label {
          width: 250px;
          text-align: right;
          font-weight: 600;
          font-size: 0.9rem;
          color: #475569;
        }
        .align-top { align-items: flex-start; }
        
        .ui-input, .address-grid input, .address-grid select {
          flex: 1;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 0.6rem 0.75rem;
          font-size: 0.9rem;
          outline: none;
          transition: border 0.2s;
        }
        .ui-input:focus { border-color: #2563eb; }
        .text-right { text-align: right; }
        
        .address-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.5rem;
        }
        
        .tax-preference-row {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 2rem;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
        }
        .tax-preference-row label { font-weight: 600; font-size: 0.85rem; color: #475569; }
        .radio-group { display: flex; gap: 1rem; }
        .radio-group label { display: flex; align-items: center; gap: 0.4rem; font-weight: 400; cursor: pointer; }
        
        .checkbox-row {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 4rem;
        }
        .checkbox-row label { font-size: 0.85rem; font-weight: 600; color: #475569; cursor: pointer; }
        
        .form-footer {
          border-top: 2px solid #f1f5f9;
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-title {
          font-weight: 700;
          color: #1e3a8a;
          font-size: 1.1rem;
        }
        .save-btn {
          background: #1e3a8a;
          color: white;
          border: none;
          padding: 0.75rem 2.5rem;
          border-radius: 4px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .save-btn:hover { background: #1e40af; }
        
        .status-msg {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          padding: 1rem 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          font-weight: 600;
          z-index: 100;
        }
        .status-msg.success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .status-msg.error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

        /* RTL Specifics */
        :global(html[dir="rtl"]) .text-right { text-align: left; }
      `}</style>
    </div>
  );
}

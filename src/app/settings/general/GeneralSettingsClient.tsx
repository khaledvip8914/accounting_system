'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Lang } from '@/lib/i18n';
import { updateCompanyProfile } from '../actions';

export default function GeneralSettingsClient({ lang, dict, initialProfile }: { lang: Lang, dict: any, initialProfile: any }) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState(initialProfile || {
    name: '',
    nameAr: '',
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
    commercialRegister: '',
    taxSupplyDateType: 'issue',
    separateTaxAccounts: false
  });
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
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
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to save' });
      }
    });
  };

  return (
    <div className="pro-max-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="pro-max-header">
        <Link href="/settings" className="btn-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={lang === 'ar' ? "M5 12h14M5 12l6-6M5 12l6 6" : "M19 12H5M19 12l-6-6M19 12l-6 6"}/></svg>
          <span>{lang === 'ar' ? 'العودة للإعدادات' : 'Back to Settings'}</span>
        </Link>
        <div className="header-content">
          <h2>{lang === 'ar' ? 'الإعدادات العامة للمنشأة' : 'General Company Settings'}</h2>
          <p>{lang === 'ar' ? 'إدارة تفاصيل شركتك، الشعار، الأرقام الضريبية، والعناوين' : 'Manage your company details, logo, tax numbers, and addresses'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="pro-max-content">
        
        {/* Section 1: Logo & Basic Info */}
        <div className="pro-max-card">
          <div className="card-header">
            <h3>{lang === 'ar' ? 'الهوية والمعلومات الأساسية' : 'Identity & Basic Info'}</h3>
            <p>{lang === 'ar' ? 'يظهر الشعار والاسم في الفواتير والتقارير' : 'Logo and name appear on invoices and reports'}</p>
          </div>
          <div className="card-body">
            <div className="logo-upload-section">
              <div className="logo-dropzone">
                {formData.logo ? (
                  <div className="logo-preview">
                    <img src={formData.logo} alt="Company Logo" />
                    <button type="button" className="btn-remove-logo" onClick={() => setFormData({...formData, logo: ''})}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ) : (
                  <div className="logo-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <span>{lang === 'ar' ? 'اسحب أو اضغط لرفع الشعار' : 'Click or drag to upload logo'}</span>
                    <small>{lang === 'ar' ? 'الحد الأقصى 1 ميجابايت' : 'Max size 1MB'}</small>
                  </div>
                )}
                <input type="file" className="hidden-input" accept="image/*" onChange={handleLogoChange} />
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>{lang === 'ar' ? 'اسم المنشأة' : 'Company Name'}</label>
                <input type="text" className="pro-input" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value, nameAr: e.target.value})} placeholder={lang === 'ar' ? 'شركة التقنية الحديثة' : 'Modern Tech Inc.'} required />
              </div>
              <div className="input-group">
                <label>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input type="email" className="pro-input" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="info@company.com" />
              </div>
              <div className="input-group">
                <label>{lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                <input type="text" className="pro-input ltr-input" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+966 5X XXX XXXX" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Address */}
        <div className="pro-max-card">
          <div className="card-header">
            <h3>{lang === 'ar' ? 'العنوان الوطني' : 'National Address'}</h3>
            <p>{lang === 'ar' ? 'العنوان الرسمي كما يظهر في السجلات' : 'Official address as registered'}</p>
          </div>
          <div className="card-body">
            <div className="form-grid address-grid">
              <div className="input-group">
                <label>{lang === 'ar' ? 'اسم الشارع' : 'Street Name'}</label>
                <input type="text" className="pro-input" value={formData.streetName || ''} onChange={e => setFormData({...formData, streetName: e.target.value})} placeholder={lang === 'ar' ? 'طريق الملك فهد' : 'King Fahd Rd'} />
              </div>
              <div className="input-group">
                <label>{lang === 'ar' ? 'رقم المبنى' : 'Building No.'}</label>
                <input type="text" className="pro-input" value={formData.buildingNumber || ''} onChange={e => setFormData({...formData, buildingNumber: e.target.value})} placeholder="1234" />
              </div>
              <div className="input-group">
                <label>{lang === 'ar' ? 'الحي' : 'District'}</label>
                <input type="text" className="pro-input" value={formData.district || ''} onChange={e => setFormData({...formData, district: e.target.value})} placeholder={lang === 'ar' ? 'العليا' : 'Olaya'} />
              </div>
              <div className="input-group">
                <label>{lang === 'ar' ? 'المدينة' : 'City'}</label>
                <input type="text" className="pro-input" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} placeholder={lang === 'ar' ? 'الرياض' : 'Riyadh'} />
              </div>
              <div className="input-group">
                <label>{lang === 'ar' ? 'الرمز البريدي' : 'Postal Code'}</label>
                <input type="text" className="pro-input" value={formData.postalCode || ''} onChange={e => setFormData({...formData, postalCode: e.target.value})} placeholder="12345" />
              </div>
              <div className="input-group">
                <label>{lang === 'ar' ? 'الدولة' : 'Country'}</label>
                <select className="pro-select" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})}>
                  <option value="SA">{lang === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</option>
                  <option value="AE">{lang === 'ar' ? 'الإمارات العربية المتحدة' : 'UAE'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Financial & Tax */}
        <div className="pro-max-card">
          <div className="card-header">
            <h3>{lang === 'ar' ? 'الإعدادات المالية والضريبية' : 'Financial & Tax Settings'}</h3>
            <p>{lang === 'ar' ? 'العملة الأساسية وأرقام التسجيل الضريبي' : 'Base currency and VAT registration'}</p>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="input-group">
                <label>{lang === 'ar' ? 'العملة الأساسية' : 'Base Currency'}</label>
                <select className="pro-select" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}>
                  <option value="SAR">{lang === 'ar' ? 'ريال سعودي (SAR)' : 'Saudi Riyal (SAR)'}</option>
                  <option value="USD">{lang === 'ar' ? 'دولار أمريكي (USD)' : 'US Dollar (USD)'}</option>
                </select>
              </div>
              <div className="input-group">
                <label>{lang === 'ar' ? 'الرقم الضريبي (VAT)' : 'Tax Number (VAT)'}</label>
                <input type="text" className="pro-input" value={formData.taxNumber || ''} onChange={e => setFormData({...formData, taxNumber: e.target.value})} placeholder="300000000000003" />
              </div>
              <div className="input-group">
                <label>{lang === 'ar' ? 'رقم السجل التجاري (CR)' : 'Commercial Register (CR)'}</label>
                <input type="text" className="pro-input" value={formData.commercialRegister || ''} onChange={e => setFormData({...formData, commercialRegister: e.target.value})} placeholder="1010000000" />
              </div>
            </div>

            <div className="tax-preferences">
              <div className="preference-item">
                <div className="preference-text">
                  <h4>{lang === 'ar' ? 'تاريخ التوريد المعتمد ضريبياً' : 'Tax Supply Date'}</h4>
                  <p>{lang === 'ar' ? 'تاريخ احتساب الفاتورة ضمن الإقرار الضريبي' : 'Date used for VAT return calculations'}</p>
                </div>
                <div className="pro-radio-group">
                  <label className={`radio-label ${formData.taxSupplyDateType === 'issue' ? 'active' : ''}`}>
                    <input type="radio" name="taxDate" checked={formData.taxSupplyDateType === 'issue'} onChange={() => setFormData({...formData, taxSupplyDateType: 'issue'})} />
                    <span>{lang === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}</span>
                  </label>
                  <label className={`radio-label ${formData.taxSupplyDateType === 'due' ? 'active' : ''}`}>
                    <input type="radio" name="taxDate" checked={formData.taxSupplyDateType === 'due'} onChange={() => setFormData({...formData, taxSupplyDateType: 'due'})} />
                    <span>{lang === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}</span>
                  </label>
                </div>
              </div>

              <div className="preference-item">
                <div className="preference-text">
                  <h4>{lang === 'ar' ? 'حسابات الضرائب' : 'Tax Accounts'}</h4>
                  <p>{lang === 'ar' ? 'هل تريد فصل ضريبة المبيعات عن ضريبة المشتريات في شجرة الحسابات؟' : 'Separate sales tax from purchase tax in the chart of accounts?'}</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={formData.separateTaxAccounts} onChange={e => setFormData({...formData, separateTaxAccounts: e.target.checked})} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? <span className="spinner"></span> : (lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
          </button>
        </div>
      </form>

      {message && (
        <div className={`pro-toast ${message.type}`}>
          {message.type === 'success' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          )}
          <span>{message.text}</span>
        </div>
      )}

      <style jsx>{`
        /* Global Pro Max Variables */
        .pro-max-container {
          --primary: #4f46e5;
          --primary-hover: #4338ca;
          --surface: #ffffff;
          --background: #f8fafc;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --border-focus: #818cf8;
          --danger: #ef4444;
          --success: #10b981;
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --radius-lg: 1rem;
          --radius-md: 0.75rem;
          --radius-sm: 0.5rem;
          --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pro-max-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1rem;
          font-family: 'Inter', system-ui, sans-serif;
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .pro-max-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }
        .btn-back {
          position: absolute;
          top: 0;
          inset-inline-start: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          background: white;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        .btn-back:hover {
          color: var(--primary);
          border-color: var(--primary);
        }
        .header-content h2 {
          font-size: 2rem;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          font-weight: 700;
        }
        .header-content p {
          color: #e2e8f0;
          margin: 0;
          font-size: 1.1rem;
        }

        /* Cards */
        .pro-max-card {
          background: var(--surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
          margin-bottom: 2rem;
          overflow: hidden;
        }
        .card-header {
          background: #f8fafc;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border);
        }
        .card-header h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.25rem;
          color: var(--text-main);
          font-weight: 600;
        }
        .card-header p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .card-body {
          padding: 2rem;
        }

        /* Form Elements */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .address-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .pro-input, .pro-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 1rem;
          color: #0f172a !important;
          background: #fbfcfd;
          transition: var(--transition);
          outline: none;
        }
        .pro-input:focus, .pro-select:focus {
          background: var(--surface);
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        .ltr-input {
          text-align: left;
          direction: ltr;
        }

        /* Logo Dropzone */
        .logo-upload-section {
          margin-bottom: 2rem;
        }
        .logo-dropzone {
          position: relative;
          width: fit-content;
        }
        .hidden-input {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          opacity: 0; cursor: pointer;
        }
        .logo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 250px;
          height: 150px;
          border: 2px dashed #cbd5e1;
          border-radius: var(--radius-md);
          background: #f8fafc;
          color: var(--text-muted);
          transition: var(--transition);
        }
        .logo-dropzone:hover .logo-placeholder {
          border-color: var(--primary);
          color: var(--primary);
          background: #f1f5f9;
        }
        .logo-preview {
          position: relative;
          width: 250px;
          height: 150px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1rem;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-preview img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .btn-remove-logo {
          position: absolute;
          top: -10px;
          right: -10px;
          background: var(--surface);
          color: var(--danger);
          border: 1px solid var(--border);
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }
        .btn-remove-logo:hover {
          background: var(--danger);
          color: white;
        }

        /* Preferences & Toggles */
        .tax-preferences {
          margin-top: 2rem;
          border-top: 1px solid var(--border);
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .preference-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }
        .preference-text h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          color: var(--text-main);
        }
        .preference-text p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        
        .pro-radio-group {
          display: flex;
          gap: 1rem;
          background: #f1f5f9;
          padding: 0.25rem;
          border-radius: var(--radius-md);
        }
        .radio-label {
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          color: var(--text-muted);
          transition: var(--transition);
        }
        .radio-label input { display: none; }
        .radio-label.active {
          background: white;
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 28px;
        }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #cbd5e1;
          transition: .4s;
          border-radius: 34px;
        }
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .toggle-slider { background-color: var(--primary); }
        input:checked + .toggle-slider:before { transform: translateX(22px); }

        /* Actions */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 2rem;
        }
        .btn-primary {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.8rem 2.5rem;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 180px;
        }
        .btn-primary:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 8px -1px rgba(79, 70, 229, 0.4);
        }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Toast */
        .pro-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          box-shadow: var(--shadow-lg);
          animation: slideUp 0.3s ease-out;
          z-index: 1000;
        }
        .pro-toast.success { background: #10b981; color: white; }
        .pro-toast.error { background: #ef4444; color: white; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* RTL Specifics */
        :global(html[dir="rtl"]) .toggle-slider:before { left: auto; right: 4px; }
        :global(html[dir="rtl"]) input:checked + .toggle-slider:before { transform: translateX(-22px); }
      `}</style>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AttachmentsClient({
  initialSettings,
  lang,
  dict
}: {
  initialSettings: any;
  lang: 'ar' | 'en';
  dict: any;
}) {
  const [formData, setFormData] = useState({
    maxSizeMB: initialSettings.maxSizeMB || 5,
    allowedTypes: initialSettings.allowedTypes || ['pdf', 'jpg', 'png', 'jpeg'],
    enableZatcaArchive: initialSettings.enableZatcaArchive !== false,
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const availableTypes = ['pdf', 'jpg', 'png', 'jpeg', 'docx', 'xlsx', 'csv', 'zip'];

  const handleTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      allowedTypes: prev.allowedTypes.includes(type)
        ? prev.allowedTypes.filter((t: string) => t !== type)
        : [...prev.allowedTypes, type]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    
    try {
      const res = await fetch('/api/settings/attachments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error('Error saving settings');
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Error saving settings');
    } finally {
      setLoading(false);
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
              <h2>{lang === 'ar' ? 'إعدادات المرفقات' : 'Attachments Settings'}</h2>
              <p>{lang === 'ar' ? 'التحكم في سياسات الملفات المرفقة والتخزين السحابي' : 'Manage file attachment policies and cloud storage'}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-body">
          <div className="settings-section">
            <h3>{lang === 'ar' ? 'سياسة حجم الملفات' : 'File Size Policy'}</h3>
            <div className="input-group max-w-sm">
              <label>{lang === 'ar' ? 'الحد الأقصى لحجم الملف (ميجابايت)' : 'Max File Size (MB)'}</label>
              <input 
                type="number" 
                className="pro-input"
                min="1"
                max="50"
                value={formData.maxSizeMB}
                onChange={e => setFormData({...formData, maxSizeMB: parseInt(e.target.value) || 1})}
              />
              <p className="hint">{lang === 'ar' ? 'توصي هيئة الزكاة بألا يتجاوز حجم الفاتورة المرفقة 5 ميجابايت' : 'ZATCA recommends keeping invoice attachments under 5MB'}</p>
            </div>
          </div>

          <div className="settings-section">
            <h3>{lang === 'ar' ? 'أنواع الملفات المسموحة' : 'Allowed File Types'}</h3>
            <div className="checkbox-grid">
              {availableTypes.map(type => (
                <label key={type} className="custom-checkbox">
                  <input 
                    type="checkbox"
                    checked={formData.allowedTypes.includes(type)}
                    onChange={() => handleTypeToggle(type)}
                  />
                  <span className="checkmark"></span>
                  <span className="type-label">.{type.toUpperCase()}</span>
                </label>
              ))}
            </div>
            <p className="hint mt-2">{lang === 'ar' ? 'يمنع النظام بشكل تلقائي رفع الملفات التنفيذية (.exe, .bat) لحماية السيرفر' : 'The system automatically blocks executable files (.exe, .bat) to protect the server'}</p>
          </div>

          <div className="settings-section">
            <h3>{lang === 'ar' ? 'الأرشفة والفوترة الإلكترونية (ZATCA)' : 'Archiving & ZATCA'}</h3>
            <label className="switch-card">
              <div className="switch-info">
                <h4>{lang === 'ar' ? 'الأرشفة التلقائية لملفات XML' : 'Auto-archive XML files'}</h4>
                <p>{lang === 'ar' ? 'الاحتفاظ التلقائي بنسخة XML و PDF/A3 لكل فاتورة ضريبية متوافقة مع هيئة الزكاة والضريبة والجمارك.' : 'Automatically retain XML and PDF/A3 copies for each ZATCA compliant tax invoice.'}</p>
              </div>
              <div className="switch-wrapper">
                <input 
                  type="checkbox"
                  checked={formData.enableZatcaArchive}
                  onChange={e => setFormData({...formData, enableZatcaArchive: e.target.checked})}
                />
                <span className="slider"></span>
              </div>
            </label>
          </div>

          <div className="form-actions">
            {saved && <span className="success-msg">{lang === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved successfully!'}</span>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ الإعدادات' : 'Save Settings')}
            </button>
          </div>
        </form>
      </div>

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
          --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          max-width: 1000px;
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

        .card-body {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .settings-section h3 {
          font-size: 1.1rem;
          color: var(--text-main);
          margin: 0 0 1rem 0;
          font-weight: 600;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .max-w-sm { max-width: 300px; }

        .input-group label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-main);
        }

        .pro-input {
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.95rem;
          color: #0f172a;
          transition: var(--transition);
        }

        .pro-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .hint {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 0;
        }
        .mt-2 { margin-top: 0.5rem; }

        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
        }

        .custom-checkbox {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          transition: var(--transition);
        }

        .custom-checkbox:hover { background: #f8fafc; }

        .custom-checkbox input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid #cbd5e1;
          border-radius: 4px;
          display: inline-block;
          position: relative;
          transition: var(--transition);
        }

        .custom-checkbox input:checked ~ .checkmark {
          background-color: var(--primary);
          border-color: var(--primary);
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
          left: 6px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .custom-checkbox input:checked ~ .checkmark:after { display: block; }

        .type-label {
          font-weight: 500;
          color: var(--text-main);
        }

        .switch-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
        }

        .switch-card:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .switch-info h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          color: var(--text-main);
        }

        .switch-info p {
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .switch-wrapper {
          position: relative;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }

        .switch-wrapper input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #cbd5e1;
          transition: .4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider { background-color: var(--primary); }
        input:checked + .slider:before { transform: translateX(20px); }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }

        .success-msg {
          color: #16a34a;
          font-weight: 500;
          font-size: 0.9rem;
          animation: fadeIn 0.3s ease;
        }

        .btn-primary {
          padding: 0.75rem 2rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-primary:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

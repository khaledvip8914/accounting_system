'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApiClient({ lang, dict, initialToken }: { lang: string, dict: any, initialToken: string | null }) {
  const [token, setToken] = useState<string | null>(initialToken);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const generateToken = async () => {
    if (token && !confirm(lang === 'ar' ? 'تحذير: سيتم إبطال المفتاح الحالي. هل أنت متأكد؟' : 'Warning: Current token will be revoked. Are you sure?')) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/settings/generate-token', { method: 'POST' });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="api-settings-module">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'ar' ? 'ربط API (الأنظمة الخارجية)' : 'API Integration (External Systems)'}</h1>
          <p className="page-subtitle">
            {lang === 'ar' 
              ? 'توليد وإدارة مفتاح API الخاص بك للربط مع أنظمة نقاط البيع (POS) أو تخطيط موارد المؤسسات (ERP).'
              : 'Generate and manage your API Key to integrate with POS or ERP systems.'}
          </p>
        </div>
      </div>

      <div className="card max-w-2xl mt-6">
        <h3 className="text-xl font-bold mb-4">{lang === 'ar' ? 'مفتاح الربط (API Token)' : 'API Token'}</h3>
        
        {token ? (
          <div className="token-display-container">
            <div className="token-box">
              <code>{token}</code>
              <button 
                className={`copy-btn ${copied ? 'copied' : ''}`} 
                onClick={copyToClipboard}
              >
                {copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ' : 'Copy')}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {lang === 'ar' 
                ? 'احتفظ بهذا المفتاح سرياً، لا تقم بمشاركته مع أي شخص لا تثق به.' 
                : 'Keep this token secret. Do not share it with anyone you do not trust.'}
            </p>
          </div>
        ) : (
          <div className="no-token-container">
            <p className="text-gray-500 mb-4">
              {lang === 'ar' 
                ? 'ليس لديك مفتاح ربط نشط حالياً.' 
                : 'You do not have an active API token currently.'}
            </p>
          </div>
        )}

        <div className="mt-6 border-t border-gray-100 pt-6">
          <button 
            className="btn btn-primary" 
            onClick={generateToken} 
            disabled={loading}
          >
            {loading ? (lang === 'ar' ? 'جاري التوليد...' : 'Generating...') : (
              token ? (lang === 'ar' ? 'توليد مفتاح جديد' : 'Generate New Token') : (lang === 'ar' ? 'توليد مفتاح API' : 'Generate API Token')
            )}
          </button>
        </div>
        
        <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="font-bold text-blue-800 mb-2">{lang === 'ar' ? 'كيف يعمل؟' : 'How it works?'}</h4>
          <p className="text-sm text-blue-700 leading-relaxed" dir="ltr" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
            {lang === 'ar'
              ? 'يمكنك استخدام هذا المفتاح لإرسال فواتير المبيعات من أنظمتك الخارجية عن طريق إرسال طلب POST إلى الرابط: /api/v1/invoices وإرفاق المفتاح في الترويسة Authorization: Bearer <token>'
              : 'You can use this token to send sales invoices from your external systems by making a POST request to /api/v1/invoices and attaching the token in the header Authorization: Bearer <token>'}
          </p>
        </div>
      </div>

      <style jsx>{`
        .api-settings-module {
          padding-bottom: 2rem;
        }
        .max-w-2xl {
          max-width: 42rem;
        }
        .token-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 1rem;
          border-radius: 8px;
          word-break: break-all;
        }
        .token-box code {
          font-family: monospace;
          font-size: 0.95rem;
          color: #0f172a;
          margin-right: 1rem;
        }
        .copy-btn {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .copy-btn:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }
        .copy-btn.copied {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }
      `}</style>
    </div>
  );
}

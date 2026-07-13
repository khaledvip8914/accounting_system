'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function WelcomePopup({ lang = 'ar' }: { lang?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get('welcome') === 'true') {
      setShow(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setShow(false);
    // Remove 'welcome=true' from URL without refreshing the page
    const newUrl = window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  };

  if (!show) return null;

  return (
    <>
      <style>{`
        .welcome-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.3s ease-out;
        }

        .welcome-modal {
          background: linear-gradient(145deg, #1e293b, #0f172a);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          width: 100%;
          max-width: 480px;
          color: #ffffff;
          text-align: center;
          position: relative;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .welcome-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #eab308, #ca8a04);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 25px rgba(234, 179, 8, 0.3);
        }

        .welcome-title {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.025em;
          color: #ffffff;
        }

        .welcome-message {
          color: #cbd5e1;
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .welcome-highlight {
          color: #eab308;
          font-weight: 600;
        }

        .welcome-btn {
          width: 100%;
          padding: 1rem;
          background: #ffffff;
          color: #0f172a;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .welcome-btn:hover {
          background: #f8fafc;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        [dir="rtl"] .close-btn {
          right: auto;
          left: 1rem;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
      `}</style>

      <div className="welcome-overlay" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="welcome-modal">
          <button className="close-btn" onClick={handleClose} aria-label="Close">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <div className="welcome-icon">
            <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          
          <h2 className="welcome-title">
            {lang === 'ar' ? 'تم إنشاء حسابك بنجاح!' : 'Account Created Successfully!'}
          </h2>
          
          <p className="welcome-message">
            {lang === 'ar' ? (
              <>
                يرجى مراجعة <span className="welcome-highlight">صندوق البريد الإلكتروني</span> الخاص بك للحصول على <strong>معرف النظام (Company ID)</strong> وبيانات تسجيل الدخول الخاصة بك للاحتفاظ بها.
                <br/><br/>
                <small style={{ color: '#94a3b8' }}>* في حال لم تجد الرسالة في صندوق الوارد، يرجى تفقد مجلد <strong>الرسائل غير المرغوب فيها (Spam / Junk)</strong>.</small>
              </>
            ) : (
              <>
                Please check your <span className="welcome-highlight">email inbox</span> to get your <strong>Company ID</strong> and login credentials for your records.
                <br/><br/>
                <small style={{ color: '#94a3b8' }}>* If you don't see the email in your inbox, please check your <strong>Spam or Junk</strong> folder.</small>
              </>
            )}
          </p>
          
          <button className="welcome-btn" onClick={handleClose}>
            {lang === 'ar' ? 'حسناً، فهمت' : 'Got it'}
          </button>
        </div>
      </div>
    </>
  );
}

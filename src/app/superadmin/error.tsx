'use client';

import React from 'react';

export default function SuperAdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <style>{`
        .error-page {
          background: linear-gradient(-45deg, #0f172a, #1e1b4b, #312e81, #1e1b4b);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-geist-sans), sans-serif;
          padding: 2rem;
        }

        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .error-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border-radius: 24px;
          padding: 3.5rem 3rem;
          width: 100%;
          max-width: 480px;
          color: #ffffff;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .error-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #eab308, #ca8a04);
        }

        .icon-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(234, 179, 8, 0.1);
          border: 2px solid rgba(234, 179, 8, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: #eab308;
        }

        .icon-container svg {
          width: 40px;
          height: 40px;
        }

        .error-title {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #ffffff;
          letter-spacing: -0.025em;
        }

        .error-message {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }

        .return-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .return-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.6);
        }
      `}</style>

      <div className="error-page" dir="rtl">
        <div className="error-card">
          <div className="icon-container">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h1 className="error-title">عذراً، الوصول غير مصرح</h1>
          <p className="error-message">
            هذه الصفحة مخصصة للإدارة العليا ومؤسسي النظام فقط. ليس لديك الصلاحيات الكافية لاستعراض هذا المحتوى.
          </p>
          <a href="/" className="return-btn">
            العودة للصفحة الرئيسية
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}

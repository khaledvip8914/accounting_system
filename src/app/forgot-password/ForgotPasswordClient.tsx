'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordClient({ lang = 'ar' }: { lang?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(lang === 'ar' ? data.errorAr || 'فشل إرسال الرابط' : data.errorEn || 'Failed to send link');
      }
    } catch (err) {
      setError(lang === 'ar' ? 'حدث خطأ في الاتصال' : 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* UI UX Pro Max - Glassmorphism & Animated Gradient */
        .auth-page {
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

        .auth-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 450px;
          color: #ffffff;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .auth-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6);
        }

        .auth-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .auth-header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.025em;
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95rem;
          text-align: center;
          margin: 0;
        }

        .form-group {
          margin-bottom: 1.5rem;
          position: relative;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          letter-spacing: 0.05em;
        }

        .form-group input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .form-group input:focus {
          background: rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05);
        }

        .submit-btn {
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
          position: relative;
          overflow: hidden;
          margin-top: 1rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.6);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .back-link {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
        }

        .back-link a {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }

        .back-link a:hover {
          color: #93c5fd;
        }

        .error-msg, .success-msg {
          padding: 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .error-msg {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }
        
        .success-msg {
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        }
        
        .spinner {
          display: inline-block;
          width: 1.5rem;
          height: 1.5rem;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1>{lang === 'ar' ? 'استعادة كلمة المرور' : 'Forgot Password'}</h1>
            <p>{lang === 'ar' ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور' : 'Enter your email and we will send you a reset link'}</p>
          </div>

          {success ? (
            <div className="success-msg">
              {lang === 'ar' ? 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح.' : 'Password reset link has been sent to your email successfully.'}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@company.com"
                  required
                  dir="ltr"
                />
              </div>

              {error && <div className="error-msg">{error}</div>}

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  lang === 'ar' ? 'إرسال رابط الاستعادة' : 'Send Reset Link'
                )}
              </button>
            </form>
          )}

          <div className="back-link">
            <a href="/login">{lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}</a>
          </div>
        </div>
      </div>
    </>
  );
}

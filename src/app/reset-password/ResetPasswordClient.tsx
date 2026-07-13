'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordClient({ lang = 'ar', token }: { lang?: string, token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!token) {
      setError(lang === 'ar' ? 'الرابط غير صالح أو مفقود' : 'Invalid or missing token');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        const data = await res.json();
        setError(lang === 'ar' ? data.errorAr || 'فشل إعادة التعيين' : data.errorEn || 'Failed to reset password');
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
            <h1>{lang === 'ar' ? 'تعيين كلمة مرور جديدة' : 'Set New Password'}</h1>
            <p>{lang === 'ar' ? 'الرجاء إدخال كلمة المرور الجديدة لحسابك' : 'Please enter a new password for your account'}</p>
          </div>

          {success ? (
            <div className="success-msg">
              {lang === 'ar' ? 'تم تغيير كلمة المرور بنجاح! سيتم تحويلك لتسجيل الدخول...' : 'Password changed successfully! Redirecting to login...'}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  required
                  dir="ltr"
                />
              </div>

              <div className="form-group">
                <label>{lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="••••••••"
                  required
                  dir="ltr"
                />
              </div>

              {error && <div className="error-msg">{error}</div>}

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  lang === 'ar' ? 'حفظ كلمة المرور' : 'Save Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

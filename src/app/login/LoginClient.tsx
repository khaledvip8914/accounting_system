'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage({ lang = 'ar' }: { lang?: string }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        setError(lang === 'ar' ? data.errorAr || 'فشل تسجيل الدخول' : data.errorEn || 'Login failed');
      }
    } catch (err) {
      setError(lang === 'ar' ? 'حدث خطأ في الاتصال' : 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-circle">N</div>
            <h1>{lang === 'ar' ? 'مرحباً بك مجدداً' : 'Welcome Back'}</h1>
            <p>{lang === 'ar' ? 'سجل دخولك للوصول إلى حساباتك' : 'Sign in to access your accounts'}</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>{lang === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder={lang === 'ar' ? 'أدخل اسم المستخدم' : 'Enter username'}
                required
              />
            </div>

            <div className="form-group">
              <label>{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
              />
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? (
                <span className="spinner"></span>
              ) : (
                lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'
              )}
            </button>
          </form>

          <footer className="login-footer">
            <p>&copy; 2026 NexAccount. {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</p>
          </footer>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          font-family: inherit;
          padding: 20px;
        }
        .login-container {
          width: 100%;
          max-width: 440px;
          perspective: 1000px;
        }
        .login-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) rotateX(-10deg); }
          to { opacity: 1; transform: translateY(0) rotateX(0); }
        }
        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .logo-circle {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 2rem;
          font-weight: 800;
          color: white;
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
        }
        h1 { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; color: white; letter-spacing: -0.025em; }
        p { color: #94a3b8; font-size: 0.95rem; }
        .login-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        label { font-size: 0.875rem; font-weight: 600; color: #cbd5e1; margin-left: 0.25rem; }
        input {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0.875rem 1.25rem;
          color: white;
          font-size: 1rem;
          transition: all 0.2s;
        }
        input:focus {
          outline: none;
          border-color: #6366f1;
          background: rgba(0, 0, 0, 0.3);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        .error-msg { color: #f87171; font-size: 0.875rem; text-align: center; background: rgba(248, 113, 113, 0.1); padding: 0.75rem; border-radius: 8px; }
        .login-btn {
          margin-top: 1rem;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }
        .login-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4); filter: brightness(1.1); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-footer { margin-top: 3rem; text-align: center; font-size: 0.8rem; color: #64748b; }
        .spinner {
          width: 20px; height: 20px; border: 3px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: white; animation: spin 1s ease-in-out infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

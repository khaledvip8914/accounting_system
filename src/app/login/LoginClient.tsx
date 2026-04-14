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
            <div className="logo-circle-login">N</div>
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

            {error && <div className="error-msg-login">{error}</div>}

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? (
                <span className="spinner-login"></span>
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
    </div>
  );
}

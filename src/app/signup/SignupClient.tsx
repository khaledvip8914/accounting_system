'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupClient({ lang = 'ar' }: { lang?: string }) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, username, email, phone, password }),
      });

      if (res.ok) {
        router.push('/?welcome=true');
        router.refresh();
      } else {
        const data = await res.json();
        setError(lang === 'ar' ? data.errorAr || 'فشل إنشاء الحساب' : data.errorEn || 'Signup failed');
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
        .signup-page {
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

        .signup-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 500px;
          color: #ffffff;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .signup-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6);
        }

        .signup-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }

        .signup-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.025em;
          margin-bottom: 0.5rem;
        }

        .signup-header p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95rem;
          text-align: center;
          margin: 0;
        }

        .trial-badge {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 1rem;
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3); }
          50% { transform: scale(1.05); box-shadow: 0 4px 20px rgba(16, 185, 129, 0.5); }
          100% { transform: scale(1); box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3); }
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
          position: relative;
        }

        .form-group.full-width {
          grid-column: span 2;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.4rem;
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
          font-size: 0.95rem;
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

        .signup-btn {
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

        .signup-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.6);
        }

        .signup-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .signup-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: all 0.5s ease;
        }

        .signup-btn:hover::after {
          left: 100%;
        }

        .login-link {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .login-link a {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }

        .login-link a:hover {
          color: #93c5fd;
        }

        .error-msg {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.9rem;
          text-align: center;
          margin-bottom: 1.5rem;
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
        
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-group.full-width {
            grid-column: span 1;
          }
        }
      `}</style>

      <div className="signup-page">
        <div className="signup-card">
          <div className="signup-header">
            <h1>{lang === 'ar' ? 'إنشاء حساب جديد' : 'Create an Account'}</h1>
            <p>{lang === 'ar' ? 'انضم إلينا وابدأ إدارة أعمالك باحترافية' : 'Join us and start managing your business professionally'}</p>
            <div className="trial-badge">
              {lang === 'ar' ? '🎁 احصل على 15 يوم تجربة مجانية!' : '🎁 Get a 15-day free trial!'}
            </div>
          </div>

          <form onSubmit={handleSignup}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>{lang === 'ar' ? 'اسم الشركة' : 'Company Name'}</label>
                <input 
                  type="text" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)} 
                  placeholder={lang === 'ar' ? 'أدخل اسم شركتك' : 'Enter your company name'}
                  required
                />
              </div>

              <div className="form-group">
                <label>{lang === 'ar' ? 'اسم المستخدم (للمدير)' : 'Username (Admin)'}</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="admin123"
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

              <div className="form-group">
                <label>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>{lang === 'ar' ? 'رقم الجوال' : 'Phone Number'}</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder={lang === 'ar' ? 'مثال: 05xxxxxxxxx' : 'e.g. 05xxxxxxxxx'}
                  required
                  dir="ltr"
                />
              </div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button type="submit" disabled={loading} className="signup-btn">
              {loading ? (
                <span className="spinner"></span>
              ) : (
                lang === 'ar' ? 'إنشاء الحساب الآن' : 'Sign Up Now'
              )}
            </button>
          </form>

          <div className="login-link">
            {lang === 'ar' ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
            <a href="/login">{lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</a>
          </div>
        </div>
      </div>
    </>
  );
}

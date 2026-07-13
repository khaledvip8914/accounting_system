'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage({ lang = 'ar' }: { lang?: string }) {
  const router = useRouter();
  const [companyId, setCompanyId] = useState('');
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
        body: JSON.stringify({ companyId, username, password }),
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
    <>
      <style>{`
        .login-page {
          background-color: #020b22; 
          background-image: radial-gradient(circle at 70% 30%, #061b4a 0%, #020b22 60%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-tajawal), var(--font-geist-sans), sans-serif;
          direction: rtl; 
          padding: 2rem;
        }

        .layout-wrapper {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1200px;
          gap: 4rem;
        }

        .promo-section {
          flex: 1;
          color: white;
          padding: 2rem;
        }
        
        .security-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(30, 64, 175, 0.3);
          color: #60a5fa;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 2rem;
          border: 1px solid rgba(37, 99, 235, 0.5);
        }

        .promo-title {
          font-size: 2.8rem;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: 1.5rem;
          color: #ffffff;
        }
        
        .promo-title-highlight {
          color: #facc15; /* Yellow text */
        }

        .promo-description {
          font-size: 1.1rem;
          color: #94a3b8;
          line-height: 1.8;
          margin-bottom: 2.5rem;
          max-width: 90%;
        }

        .compliance-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          max-width: 420px;
          transition: all 0.3s ease;
        }
        
        .compliance-box:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .compliance-box-icon {
          color: #facc15;
          font-size: 1.5rem;
          background: rgba(250, 204, 21, 0.1);
          padding: 0.75rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .compliance-box-text h4 {
          margin: 0 0 0.35rem 0;
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
        }

        .compliance-box-text p {
          margin: 0;
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .features-list li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          color: #cbd5e1;
        }

        .features-list li::before {
          content: '✓';
          color: #facc15;
          font-weight: bold;
        }

        .discover-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .discover-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* Form Section */
        .form-section {
          flex: 0 0 420px;
        }

        .login-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 2.5rem;
          width: 100%;
          color: #0f172a;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }

        .login-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .login-header p {
          color: #64748b;
          font-size: 0.9rem;
          text-align: center;
          margin: 0;
        }

        .logo-container {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: #f8fafc;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1.25rem;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #0f172a;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          outline: none;
        }

        .form-group input:focus {
          background: #ffffff;
          border-color: #061b4a;
          box-shadow: 0 0 0 3px rgba(6, 27, 74, 0.1);
        }

        .login-btn {
          width: 100%;
          padding: 0.875rem;
          background: #020b22;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }

        .login-btn:hover:not(:disabled) {
          background: #061b4a;
        }

        .auth-links {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.85rem;
          color: #64748b;
        }

        .auth-links a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .auth-links a:hover {
          text-decoration: underline;
        }

        .forgot-pass-link {
          display: block;
          text-align: left;
          margin-top: 0.5rem;
          font-size: 0.8rem;
        }
        
        [dir="rtl"] .forgot-pass-link {
          text-align: left;
        }

        .error-msg-login {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          text-align: center;
          margin-bottom: 1.25rem;
        }
        
        .spinner-login {
          display: inline-block;
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .discover-section {
          background-color: #f8fafc;
          min-height: 100vh;
          padding: 5rem 2rem;
          direction: rtl;
          font-family: var(--font-tajawal), sans-serif;
          color: #0f172a;
        }

        .discover-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .discover-badge {
          display: inline-block;
          color: #2563eb;
          border: 1px solid #bfdbfe;
          background-color: #eff6ff;
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .discover-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .discover-subtitle {
          font-size: 1.1rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .dark-banner {
          background-color: #020b22;
          border-radius: 20px;
          padding: 3rem 4rem;
          color: white;
          max-width: 1200px;
          margin: 0 auto 4rem auto;
          box-shadow: 0 20px 40px rgba(2, 11, 34, 0.15);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: right;
        }

        .banner-badge {
          color: #facc15;
          border: 1px solid rgba(250, 204, 21, 0.3);
          background: rgba(250, 204, 21, 0.1);
          padding: 0.4rem 1.25rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .banner-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .banner-text {
          color: #94a3b8;
          font-size: 1.1rem;
          max-width: 700px;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .banner-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          align-items: flex-start;
        }

        .banner-features li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #cbd5e1;
          font-size: 1.05rem;
        }

        .banner-features li svg {
          color: #facc15;
          flex-shrink: 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #f1f5f9;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.06);
        }

        .feature-icon-wrapper {
          width: 50px;
          height: 50px;
          background: #fffbeb;
          border-radius: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1.5rem;
          color: #d97706;
        }

        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }

        .feature-card p {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.7;
          margin: 0;
        }

        @media (max-width: 900px) {
          .layout-wrapper {
            flex-direction: column;
            gap: 2rem;
          }
          .form-section {
            width: 100%;
            max-width: 420px;
          }
          .promo-section {
            text-align: center;
            padding: 1rem;
          }
          .compliance-box {
            margin: 0 auto 2rem auto;
            text-align: right;
          }
          .features-list {
            justify-content: center;
          }
          .discover-btn {
            margin: 0 auto;
          }
          .dark-banner {
            padding: 2rem;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="layout-wrapper">
          
          <div className="promo-section">
            <div className="security-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              الفوترة الإلكترونية، المرحلة الثانية
            </div>
            
            <h2 className="promo-title">
              اربط شركتك بمنظومة <br/> فاتورة <br/>
              وأصدر فواتيرك الإلكترونية <br/>
              <span className="promo-title-highlight">بثقة</span>
            </h2>
            
            <p className="promo-description">
              قيد إكس متوافق مع هيئة الزكاة والضريبة والجمارك، نربطك بالمرحلة الثانية بتوقيع رقمي ورمز QR وملف XML تلقائياً بدون أي جهد يدوي.
            </p>

            <div className="compliance-box">
              <div className="compliance-box-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
              </div>
              <div className="compliance-box-text">
                <h4>متوافق مع هيئة الزكاة والضريبة والجمارك</h4>
                <p>المرحلتان الأولى والثانية - PEPPOL API مباشر</p>
              </div>
            </div>

            <ul className="features-list">
              <li>توقيع رقمي وQR وXML تلقائياً</li>
              <li>ربط مباشر بمنظومة فاتورة</li>
              <li>15 يوماً مجاناً</li>
            </ul>

            <button type="button" className="discover-btn" onClick={() => document.getElementById('discover-section')?.scrollIntoView({ behavior: 'smooth' })}>
              اكتشف كيف يعمل
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          <div className="form-section">
            <div className="login-card">
              <div className="login-header">
                <div className="logo-container">
                  <img src="/qaydx-logo.png?v=3" alt="QaydX" style={{ width: '145%', height: '145%', maxWidth: 'none', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                </div>
                <h1>{lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</h1>
                <p>{lang === 'ar' ? 'سجل دخولك للوصول إلى حساباتك بأمان' : 'Sign in securely to access your accounts'}</p>
              </div>

              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <label>{lang === 'ar' ? 'معرف النظام (Tenant ID)' : 'Company ID'}</label>
                  <input 
                    type="text" 
                    value={companyId} 
                    onChange={(e) => setCompanyId(e.target.value)} 
                    placeholder={lang === 'ar' ? 'مثال: T-XXXXX' : 'Example: T-XXXXX'}
                    required
                    suppressHydrationWarning
                    dir="ltr"
                    style={{ fontFamily: 'monospace', textAlign: 'left' }}
                  />
                </div>

                <div className="form-group">
                  <label>{lang === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder={lang === 'ar' ? 'أدخل اسم المستخدم' : 'Enter username'}
                    required
                    suppressHydrationWarning
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
                    suppressHydrationWarning
                  />
                  <div className="forgot-pass-link">
                    <a href="/forgot-password" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>
                      {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                    </a>
                  </div>
                </div>

                {error && <div className="error-msg-login">{error}</div>}

                <button type="submit" disabled={loading} className="login-btn" suppressHydrationWarning>
                  {loading ? (
                    <span className="spinner-login"></span>
                  ) : (
                    <>
                      {lang === 'ar' ? 'سجل الآن' : 'Sign In'}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </>
                  )}
                </button>
                
                <div className="auth-links">
                  <div>
                    {lang === 'ar' ? 'ليس لديك حساب؟ ' : 'Don\'t have an account? '}
                    <a href="/signup">{lang === 'ar' ? 'قم بإنشاء حساب جديد' : 'Sign Up'}</a>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>

      <div id="discover-section" className="discover-section">
        <div className="discover-header">
          <div className="discover-badge">ما يقدمه قيد إكس للفوترة الإلكترونية</div>
          <h2 className="discover-title">ربط كامل مع منظومة فاتورة بدون تعقيد تقني</h2>
          <p className="discover-subtitle">من الشهادة الرقمية حتى إرسال الفاتورة والتأكيد، قيد إكس يتكفل بكل خطوة.</p>
        </div>

        <div className="dark-banner">
          <div className="banner-badge">متوافق مع هيئة الزكاة والضريبة والجمارك</div>
          <h3 className="banner-title">ربط تقني مباشر مع منظومة فاتورة، بدون وسيط</h3>
          <p className="banner-text">قيد إكس يُرسل كل فاتورة مباشرة لمنظومة فاتورة عبر بروتوكول PEPPOL المعتمد، بتوقيع رقمي ورمز QR وملف XML في كل فاتورة B2B و B2C.</p>
          <ul className="banner-features">
            <li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> توقيع رقمي معتمد + رمز XML + QR تلقائياً</li>
            <li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> ربط مباشر بلا وسيط ولا خطوات يدوية</li>
            <li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> تأكيد فوري من الهيئة بعد كل إرسال</li>
          </ul>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h3>فاتورة PDF/A3 + XML مطابقة</h3>
            <p>كل فاتورة تُولَّد بصيغة XML المتوافقة مع هيئة الزكاة والضريبة والجمارك مع نسخة PDF/A3 للحفظ والإرسال للعميل، في آنٍ واحد.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="7" y1="7" x2="7" y2="7"></line><line x1="17" y1="7" x2="17" y2="7"></line><line x1="17" y1="17" x2="17" y2="17"></line><line x1="7" y1="17" x2="7" y2="17"></line></svg>
            </div>
            <h3>رمز QR تلقائي في كل فاتورة</h3>
            <p>رمز QR مشفّر بمعيار TLV يظهر تلقائياً في كل فاتورة B2C، قابل للمسح والتحقق الفوري من قِبل العميل أو الهيئة.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
            </div>
            <h3>توقيع رقمي معتمد</h3>
            <p>كل فاتورة تُوقّع إلكترونياً بشهادة GAZT المعتمدة، لا يمكن التلاعب بها وتجتاز تدقيق الهيئة بدون أي إجراء يدوي.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
            <h3>تنبيهات الفشل والإعادة التلقائية</h3>
            <p>إذا فشل إرسال أي فاتورة لأي سبب تقني، يُنبهك قيد إكس فوراً ويُعيد الإرسال تلقائياً، لا فاتورة تضيع بصمت.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            </div>
            <h3>ربط API مع أنظمتك الحالية</h3>
            <p>لديك نظام ERP أو POS؟ قيد إكس يوفر لك API مفتوح يُتيح إرسال الفواتير من أي نظام مباشرة لمنظومة فاتورة.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="10" x2="16" y2="10"></line><line x1="8" y1="14" x2="16" y2="14"></line></svg>
            </div>
            <h3>سجل كامل لكل فاتورة مُرسلة</h3>
            <p>سجل تدقيق شامل يحتفظ بحالة كل فاتورة ووقت الإرسال وإقرار الهيئة، جاهز لأي تفتيش أو مراجعة ضريبية.</p>
          </div>
        </div>
      </div>
    </>
  );
}


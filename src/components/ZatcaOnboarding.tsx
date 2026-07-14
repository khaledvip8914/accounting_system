'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { onboardZatcaDevice } from '@/app/superadmin/companies/zatca-actions';
import { ShieldCheck, KeyRound, Server, Activity, AlertCircle, CheckCircle2, ChevronRight, Lock, X } from 'lucide-react';

interface Props {
  companyId: string;
  currentStatus: string;
  onClose: () => void;
}

export default function ZatcaOnboarding({ companyId, currentStatus, onClose }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<'auth' | 'onboard'>('auth');
  const [adminPassword, setAdminPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [environment, setEnvironment] = useState<'Sandbox' | 'Simulation' | 'Production'>('Simulation');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | '', text: string }>({ type: '', text: '' });
  const [mounted, setMounted] = useState(false);

  // The secret password for administration
  const SECRET_ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ZATCA_PASSWORD || 'zatcaAdmin';

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleVerifyPassword = () => {
    if (adminPassword === SECRET_ADMIN_PASSWORD) {
      setStep('onboard');
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'كلمة المرور غير صحيحة' });
    }
  };

  const handleOnboard = async () => {
    if (!otp) {
      setMessage({ type: 'error', text: 'الرجاء إدخال كود التوثيق (OTP) من منصة فاتورة.' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await onboardZatcaDevice(companyId, otp, environment);
      if (res.success) {
        setMessage({ type: 'success', text: 'تم ربط الجهاز وإصدار الختم الرقمي بنجاح!' });
        setTimeout(() => {
          onClose();
          router.refresh();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: `خطأ: ${res.message}` });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: `حدث خطأ غير متوقع: ${err.message}` });
    }
    setLoading(false);
  };

  const isSuccess = currentStatus !== 'Not Onboarded' || message.type === 'success';

  const modalContent = (
    <div className="zatca-modal-overlay" dir="rtl">
      <div className="zatca-modal-container">
        <button onClick={onClose} className="zatca-close-btn">
          <X size={20} />
        </button>

        {step === 'auth' ? (
          <>
            <div className="zatca-header">
              <h2>صلاحية الإدارة (ZATCA)</h2>
              <p>هذه الصفحة مخصصة للإدارة فقط. يرجى إدخال كلمة المرور للمتابعة.</p>
            </div>
            <div className="zatca-body">
              <div className="zatca-form-group">
                <label>كلمة المرور <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <Lock className="env-icon" size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="zatca-otp-input"
                    style={{ paddingRight: '48px', textAlign: 'right', letterSpacing: 'normal' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyPassword()}
                    dir="rtl"
                  />
                </div>
              </div>
              
              {message.text && (
                <div className={`zatca-message ${message.type}`}>
                  {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                  <span>{message.text}</span>
                </div>
              )}

              <div className="zatca-actions">
                <button onClick={onClose} className="zatca-btn-cancel">إلغاء</button>
                <button 
                  onClick={handleVerifyPassword} 
                  disabled={!adminPassword}
                  className="zatca-btn-submit"
                >
                  دخول
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="zatca-header">
              <h2>إعدادات الربط والتكامل مع ZATCA</h2>
              <p>أدخل البيانات المطلوبة لضمان استقرار الخدمة والربط المباشر مع منصة فاتورة.</p>
            </div>

            <div className="zatca-body">
              <div className={`zatca-status-banner ${isSuccess ? 'success' : 'warning'}`}>
                <div className="zatca-status-icon">
                  {isSuccess ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
                </div>
                <div className="zatca-status-text">
                  <h4>حالة الربط الحالية</h4>
                  <p>{isSuccess ? 'تم الربط بنجاح والنظام جاهز لإرسال الفواتير.' : 'النظام غير مربوط حالياً بهيئة الزكاة والضريبة والجمارك.'}</p>
                </div>
              </div>
              
              <div className="zatca-form-group">
                <label>بيئة العمل <span className="required">*</span></label>
                <div className="zatca-env-options">
                  <button
                    onClick={() => setEnvironment('Sandbox')}
                    className={`zatca-env-btn ${environment === 'Sandbox' ? 'active' : ''}`}
                  >
                    <Server size={24} className="env-icon" />
                    <h4>بيئة المطورين (Sandbox)</h4>
                    <p>للتجارب التقنية دون أثر ضريبي.</p>
                  </button>

                  <button
                    onClick={() => setEnvironment('Simulation')}
                    className={`zatca-env-btn ${environment === 'Simulation' ? 'active' : ''}`}
                  >
                    <Activity size={24} className="env-icon" />
                    <h4>بيئة المحاكاة (Simulation)</h4>
                    <p>لمحاكاة الفواتير الرسمية للتجربة.</p>
                  </button>

                  <button
                    onClick={() => setEnvironment('Production')}
                    className={`zatca-env-btn ${environment === 'Production' ? 'active' : ''}`}
                  >
                    <ShieldCheck size={24} className="env-icon" />
                    <h4>بيئة الإنتاج (Production)</h4>
                    <p>الفواتير معتمدة قانونياً بشكل مباشر.</p>
                  </button>
                </div>
              </div>

              <div className="zatca-form-group">
                <label>كود التوثيق (OTP) <span className="required">*</span></label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                  placeholder="أدخل الكود المكون من 6 أرقام"
                  className="zatca-otp-input"
                  dir="ltr"
                />
                <p className="zatca-hint">يمكنك الحصول على الكود من منصة فاتورة (صالح لمدة ساعة واحدة)</p>
              </div>

              {message.text && (
                <div className={`zatca-message ${message.type}`}>
                  {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                  <span>{message.text}</span>
                </div>
              )}

              <div className="zatca-actions">
                <button onClick={() => setStep('auth')} className="zatca-btn-cancel">رجوع</button>
                <button 
                  onClick={handleOnboard} 
                  disabled={loading || otp.length < 5}
                  className="zatca-btn-submit"
                >
                  {loading ? 'جاري التحقق...' : 'تأكيد وحفظ'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .zatca-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          font-family: inherit;
        }
        .zatca-modal-container {
          position: relative;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          background-color: #131722;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 1px solid #2a2e39;
          margin: 16px;
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .zatca-close-btn {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 20;
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: #9ca3af;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .zatca-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .zatca-header {
          background-color: #1a1e29;
          padding: 32px;
          border-bottom: 1px solid #2a2e39;
          text-align: center;
        }
        .zatca-header h2 {
          color: #fff;
          font-size: 1.5rem;
          margin: 0 0 8px 0;
        }
        .zatca-header p {
          color: #9ca3af;
          font-size: 0.875rem;
          margin: 0;
        }
        .zatca-body {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .zatca-status-banner {
          display: flex;
          align-items: center;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid transparent;
        }
        .zatca-status-banner.success {
          background-color: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.2);
        }
        .zatca-status-banner.warning {
          background-color: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.2);
        }
        .zatca-status-icon {
          padding: 8px;
          border-radius: 8px;
          margin-left: 16px;
        }
        .zatca-status-banner.success .zatca-status-icon {
          background-color: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }
        .zatca-status-banner.warning .zatca-status-icon {
          background-color: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
        }
        .zatca-status-text h4 {
          margin: 0 0 4px 0;
          font-size: 0.875rem;
        }
        .zatca-status-banner.success h4 { color: #34d399; }
        .zatca-status-banner.warning h4 { color: #fbbf24; }
        .zatca-status-text p {
          margin: 0;
          font-size: 0.75rem;
        }
        .zatca-status-banner.success p { color: #10b981; }
        .zatca-status-banner.warning p { color: rgba(245, 158, 11, 0.8); }
        
        .zatca-form-group label {
          display: block;
          color: #d1d5db;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .required { color: #ef4444; }
        .zatca-env-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .zatca-env-btn {
          background-color: #1a1e29;
          border: 1px solid #2a2e39;
          border-radius: 12px;
          padding: 16px;
          text-align: right;
          cursor: pointer;
          transition: all 0.2s;
        }
        .zatca-env-btn:hover { border-color: #374151; }
        .zatca-env-btn.active {
          background-color: rgba(245, 179, 1, 0.1);
          border-color: #f5b301;
        }
        .env-icon { margin-bottom: 12px; color: #6b7280; }
        .zatca-env-btn.active .env-icon { color: #f5b301; }
        .zatca-env-btn h4 {
          color: #e5e7eb;
          font-size: 0.875rem;
          margin: 0 0 4px 0;
        }
        .zatca-env-btn p {
          color: #6b7280;
          font-size: 0.75rem;
          margin: 0;
        }
        
        .zatca-otp-input {
          width: 100%;
          padding: 16px;
          background-color: #1a1e29;
          border: 1px solid #2a2e39;
          border-radius: 12px;
          color: #fff;
          font-family: monospace;
          font-size: 1.25rem;
          text-align: center;
          letter-spacing: 0.25em;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .zatca-otp-input:focus { border-color: #f5b301; }
        .zatca-hint {
          text-align: center;
          color: #6b7280;
          font-size: 0.75rem;
          margin-top: 8px;
        }
        
        .zatca-message {
          padding: 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .zatca-message.error {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
        }
        .zatca-message.success {
          background-color: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #34d399;
        }
        
        .zatca-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 24px;
          border-top: 1px solid #2a2e39;
        }
        .zatca-btn-cancel {
          padding: 12px 24px;
          background-color: #1a1e29;
          color: #d1d5db;
          border: 1px solid #374151;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .zatca-btn-cancel:hover { background-color: #1f2937; }
        
        .zatca-btn-submit {
          padding: 12px 32px;
          background-color: #f5b301;
          color: #131722;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }
        .zatca-btn-submit:hover:not(:disabled) {
          background-color: #ffc107;
          box-shadow: 0 0 15px rgba(245, 179, 1, 0.3);
        }
        .zatca-btn-submit:disabled {
          background-color: #4b5563;
          color: #9ca3af;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .zatca-env-options { grid-template-columns: 1fr; }
          .zatca-body { padding: 24px; }
          .zatca-header { padding: 24px; }
        }
      `}</style>
    </div>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}


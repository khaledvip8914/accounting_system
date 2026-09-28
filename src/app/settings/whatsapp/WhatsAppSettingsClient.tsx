'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WhatsAppSettingsClient({ lang }: { lang: string }) {
  const [status, setStatus] = useState<string>('LOADING');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/settings/whatsapp/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
        if (data.qr) {
          setQrCode(data.qr);
        } else {
          setQrCode(null);
        }
        setError(null);
      } else {
        setStatus('ERROR');
        setError('تعذر الاتصال بخدمة واتساب. تأكد من تشغيلها في الخادم.');
      }
    } catch (err) {
      setStatus('ERROR');
      setError('خطأ في الاتصال بالخادم.');
    }
  };

  useEffect(() => {
    fetchStatus();
    // Poll every 5 seconds if not connected
    const interval = setInterval(() => {
      if (status !== 'CONNECTED' && status !== 'ERROR') {
        fetchStatus();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [status]);

  const handleReconnect = async () => {
    setIsProcessing(true);
    try {
      await fetch('/api/settings/whatsapp/reconnect', { method: 'POST' });
      setStatus('STARTING');
      setQrCode(null);
      setTimeout(fetchStatus, 2000);
    } catch (err) {
      console.error(err);
    }
    setIsProcessing(false);
  };

  const handleLogout = async () => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to log out?')) return;
    setIsProcessing(true);
    try {
      await fetch('/api/settings/whatsapp/logout', { method: 'POST' });
      setStatus('DISCONNECTED');
      setQrCode(null);
      setTimeout(fetchStatus, 2000);
    } catch (err) {
      console.error(err);
    }
    setIsProcessing(false);
  };

  return (
    <div className="whatsapp-settings-container">
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/settings" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px', fontSize: '0.85rem' }}>
              {lang === 'ar' ? '← عودة' : '← Back'}
            </Link>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#25D366' }}>💬</span>
              {lang === 'ar' ? 'إعدادات ربط واتساب' : 'WhatsApp Integration Settings'}
            </h2>
          </div>
        </div>

        <div className="card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          
          {status === 'LOADING' && (
            <div style={{ color: '#64748b' }}>{lang === 'ar' ? 'جاري التحقق من حالة الواتساب...' : 'Checking WhatsApp status...'}</div>
          )}

          {status === 'ERROR' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ef4444', fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ color: '#ef4444' }}>{lang === 'ar' ? 'خطأ في الاتصال' : 'Connection Error'}</h3>
              <p style={{ color: '#64748b', marginTop: '0.5rem' }}>{error}</p>
            </div>
          )}

          {status === 'STARTING' && (
            <div style={{ textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #25D366', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ color: '#64748b' }}>{lang === 'ar' ? 'جاري تجهيز خدمة واتساب...' : 'Starting WhatsApp Service...'}</p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {status === 'QR_READY' && qrCode && (
            <div style={{ textAlign: 'center', background: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>
                {lang === 'ar' ? 'امسح الرمز ضوئياً للاتصال' : 'Scan the QR code to connect'}
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '400px' }}>
                {lang === 'ar' 
                  ? 'افتح تطبيق واتساب على هاتفك، اذهب إلى الأجهزة المرتبطة، ثم امسح هذا الرمز.' 
                  : 'Open WhatsApp on your phone, go to Linked Devices, and scan this code.'}
              </p>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', display: 'inline-block', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <img src={qrCode} alt="WhatsApp QR Code" style={{ width: '256px', height: '256px' }} />
              </div>
              <div style={{ marginTop: '2rem' }}>
                <button className="btn-secondary" onClick={handleReconnect} disabled={isProcessing}>
                  {lang === 'ar' ? 'تحديث الرمز 🔄' : 'Refresh QR 🔄'}
                </button>
              </div>
            </div>
          )}

          {status === 'CONNECTED' && (
            <div style={{ textAlign: 'center', background: '#dcfce7', padding: '3rem', borderRadius: '16px', border: '1px solid #86efac', width: '100%', maxWidth: '500px' }}>
              <div style={{ color: '#16a34a', fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ color: '#16a34a', marginBottom: '0.5rem' }}>
                {lang === 'ar' ? 'متصل بنجاح!' : 'Successfully Connected!'}
              </h2>
              <p style={{ color: '#15803d', marginBottom: '2rem' }}>
                {lang === 'ar' 
                  ? 'خدمة واتساب تعمل الآن ويمكنك إرسال الفواتير للعملاء بنقرة واحدة.' 
                  : 'WhatsApp service is running. You can now send invoices to customers with one click.'}
              </p>
              <button className="btn-danger" onClick={handleLogout} disabled={isProcessing} style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                {lang === 'ar' ? 'تسجيل الخروج من واتساب' : 'Logout from WhatsApp'}
              </button>
            </div>
          )}

          {status === 'DISCONNECTED' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#64748b', fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h3 style={{ color: '#475569' }}>{lang === 'ar' ? 'الواتساب غير متصل' : 'WhatsApp is disconnected'}</h3>
              <div style={{ marginTop: '2rem' }}>
                <button className="btn-primary" onClick={handleReconnect} disabled={isProcessing} style={{ padding: '0.75rem 2rem', fontSize: '1rem', background: '#25D366', borderColor: '#25D366' }}>
                  {lang === 'ar' ? 'الاتصال الآن' : 'Connect Now'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

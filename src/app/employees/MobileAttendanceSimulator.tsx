'use client';

import React, { useState, useEffect } from 'react';
import { getClientDeviceId, getClientDeviceInfo } from '@/lib/deviceFingerprint';

export default function MobileAttendanceSimulator() {
  const [employeeCode, setEmployeeCode] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [empInfo, setEmpInfo] = useState<any>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [deviceInfo, setDeviceInfo] = useState<string>('');

  useEffect(() => {
    setDeviceId(getClientDeviceId());
    setDeviceInfo(getClientDeviceInfo());
  }, []);

  // Auto-get GPS location
  useEffect(() => {
    if ('geolocation' in navigator) {
      const id = navigator.geolocation.watchPosition(
        pos => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        err => {
          console.warn('Geolocation watch error:', err.message);
        },
        { enableHighAccuracy: true }
      );
      setWatchId(id);
      return () => navigator.geolocation.clearWatch(id);
    }
  }, []);

  const fetchEmployeeStatus = async () => {
    if (!employeeCode.trim()) return;
    try {
      const res = await fetch(`/api/v1/attendance/punch?employeeCode=${encodeURIComponent(employeeCode.trim())}`);
      const data = await res.json();
      if (data.success) {
        setEmpInfo(data);
      } else {
        setEmpInfo(null);
      }
    } catch {
      setEmpInfo(null);
    }
  };

  const handlePunch = async (action: 'CHECK_IN' | 'CHECK_OUT' | 'AUTO') => {
    if (!employeeCode.trim()) {
      setStatusMsg('يرجى إدخال كود الموظف أولاً');
      setIsSuccess(false);
      return;
    }

    if (!coords) {
      setStatusMsg('جاري التقاط إحداثيات GPS، تأكد من تفعيل خدمة الموقع بالهاتف...');
      setIsSuccess(false);
      return;
    }

    const currentDevId = deviceId || getClientDeviceId();
    const currentDevInfo = deviceInfo || getClientDeviceInfo();

    setLoading(true);
    setStatusMsg('');
    try {
      const res = await fetch('/api/v1/attendance/punch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeCode: employeeCode.trim(),
          lat: coords.lat,
          lng: coords.lng,
          action,
          deviceId: currentDevId,
          deviceInfo: currentDevInfo
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setStatusMsg(`✅ ${data.message} (${data.punchType === 'CHECK_IN' ? 'تسجيل حضور' : 'تسجيل انصراف'}). المسافة لمقر العمل: ${data.distance} م.`);
        fetchEmployeeStatus();
      } else {
        setIsSuccess(false);
        setStatusMsg(`❌ ${data.error}`);
      }
    } catch (err: any) {
      setIsSuccess(false);
      setStatusMsg(`❌ فشل الاتصال بالخادم: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '2rem auto',
      padding: '2rem',
      background: '#0f172a',
      borderRadius: '28px',
      color: '#ffffff',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      fontFamily: 'system-ui, sans-serif',
      direction: 'rtl'
    }}>
      {/* Mobile Frame Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>📱</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>بصمة الحضور الذكية</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>نظام الحضور الجغرافي (Geofencing)</div>
          </div>
        </div>
        <div style={{
          fontSize: '0.7rem',
          padding: '4px 8px',
          borderRadius: '20px',
          background: coords ? '#065f46' : '#7f1d1d',
          color: coords ? '#6ee7b7' : '#fca5a5',
          fontWeight: 700
        }}>
          {coords ? '🛰️ GPS متصل' : '⚠️ بانتظار GPS'}
        </div>
      </div>

      {/* Employee ID Input */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.5rem', fontWeight: 600 }}>
          كود الموظف
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="مثال: EMP-001"
            value={employeeCode}
            onChange={e => setEmployeeCode(e.target.value)}
            onBlur={fetchEmployeeStatus}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 600,
              outline: 'none'
            }}
          />
          <button
            type="button"
            onClick={fetchEmployeeStatus}
            style={{
              padding: '0 16px',
              borderRadius: '12px',
              border: 'none',
              background: '#3b82f6',
              color: 'white',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            تحقق
          </button>
        </div>
      </div>

      {/* Employee info card if recognized */}
      {empInfo?.employee && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '1rem',
          borderRadius: '16px',
          marginBottom: '1.25rem',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#60a5fa' }}>
            {empInfo.employee.nameAr || empInfo.employee.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
            {empInfo.employee.department || 'موظف'} • كود: {empInfo.employee.code}
            {empInfo.employee.branch && ` • الفرع: ${empInfo.employee.branch.nameAr || empInfo.employee.branch.name}`}
          </div>

          {/* Device Security Status */}
          <div style={{ marginTop: '8px', padding: '6px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600, background: empInfo.isDeviceBound ? (empInfo.boundDeviceId === deviceId ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.15)') : 'rgba(59,130,246,0.12)', border: empInfo.isDeviceBound ? (empInfo.boundDeviceId === deviceId ? '1px solid #10b981' : '1px solid #ef4444') : '1px solid #3b82f6', color: empInfo.isDeviceBound ? (empInfo.boundDeviceId === deviceId ? '#6ee7b7' : '#fca5a5') : '#93c5fd' }}>
            {empInfo.isDeviceBound ? (
              empInfo.boundDeviceId === deviceId ? (
                <span>🔒 هذا الهاتف معتمد وموثق لتسجيل حضورك ({empInfo.boundDeviceInfo || deviceInfo})</span>
              ) : (
                <span>⚠️ تنبيه: الحساب موثق على جهاز آخر ({empInfo.boundDeviceInfo || 'هاتف آخر'}). لا يمكن التسجيل من هذا الجهاز!</span>
              )
            ) : (
              <span>💡 سيتم توثيق وقفل الحساب على هاتفك الحالي تلقائياً عند أول تسجيل حضور</span>
            )}
          </div>

          {empInfo.effectiveLocation && (
            <div style={{ marginTop: '6px', fontSize: '0.75rem', color: empInfo.effectiveLocation.lat ? '#38bdf8' : '#fbbf24' }}>
              📍 {empInfo.effectiveLocation.lat 
                ? `مقر العمل المعتمد: ${empInfo.effectiveLocation.source === 'BRANCH' ? (empInfo.employee.branch?.nameAr || 'الفرع') : 'موقع مخصص'} (نطاق: ${empInfo.effectiveLocation.radius}م)` 
                : 'تنبيه: لم يتم تعيين إحداثيات GPS لفرع هذا الموظف بعد'}
            </div>
          )}
          {empInfo.todayAttendance && (
            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#34d399' }}>
              حالة اليوم: {empInfo.todayAttendance.checkIn ? `حضر الساعة ${new Date(empInfo.todayAttendance.checkIn).toLocaleTimeString('ar-SA')}` : 'لم يحضر بعد'}
              {empInfo.todayAttendance.checkOut && ` • انصرف ${new Date(empInfo.todayAttendance.checkOut).toLocaleTimeString('ar-SA')}`}
            </div>
          )}
        </div>
      )}

      {/* Device & GPS info */}
      <div style={{
        background: 'rgba(0,0,0,0.25)',
        borderRadius: '12px',
        padding: '0.75rem 1rem',
        fontSize: '0.78rem',
        color: '#94a3b8',
        marginBottom: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📱 جهازك الحالي:</span>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{deviceInfo || 'جاري التعرف...'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🛰️ إحداثيات GPS:</span>
          <span style={{ fontFamily: 'monospace', color: coords ? '#38bdf8' : '#94a3b8' }}>
            {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'جاري التحديد...'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <button
          onClick={() => handlePunch('CHECK_IN')}
          disabled={loading}
          style={{
            padding: '1rem',
            borderRadius: '16px',
            border: 'none',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
            opacity: loading ? 0.7 : 1
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>🟢</span>
          <span>تسجيل حضور</span>
        </button>

        <button
          onClick={() => handlePunch('CHECK_OUT')}
          disabled={loading}
          style={{
            padding: '1rem',
            borderRadius: '16px',
            border: 'none',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(239,68,68,0.35)',
            opacity: loading ? 0.7 : 1
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>🔴</span>
          <span>تسجيل انصراف</span>
        </button>
      </div>

      <button
        onClick={() => handlePunch('AUTO')}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.05)',
          color: '#e2e8f0',
          fontWeight: 700,
          fontSize: '0.9rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '1rem'
        }}
      >
        ⚡ تسجيل ذكي تلقائي (دخول / خروج)
      </button>

      {/* Status Messages */}
      {statusMsg && (
        <div style={{
          padding: '1rem',
          borderRadius: '14px',
          fontSize: '0.85rem',
          fontWeight: 600,
          lineHeight: '1.5',
          background: isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: isSuccess ? '1px solid #10b981' : '1px solid #ef4444',
          color: isSuccess ? '#6ee7b7' : '#fca5a5'
        }}>
          {statusMsg}
        </div>
      )}
    </div>
  );
}

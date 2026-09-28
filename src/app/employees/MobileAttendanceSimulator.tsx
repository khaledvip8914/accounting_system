'use client';

import React, { useState, useEffect } from 'react';
import { getClientDeviceId, getClientDeviceInfo } from '@/lib/deviceFingerprint';

export default function MobileAttendanceSimulator() {
  const [activeTab, setActiveTab] = useState<'punch' | 'leave'>('punch');
  const [employeeCode, setEmployeeCode] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [empInfo, setEmpInfo] = useState<any>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [deviceInfo, setDeviceInfo] = useState<string>('');

  // Leave Request State
  const [leaveType, setLeaveType] = useState('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveMsg, setLeaveMsg] = useState('');
  const [leaveMsgSuccess, setLeaveMsgSuccess] = useState<boolean | null>(null);
  const [myLeaves, setMyLeaves] = useState<any[]>([]);
  const [loadingMyLeaves, setLoadingMyLeaves] = useState(false);

  useEffect(() => {
    setDeviceId(getClientDeviceId());
    setDeviceInfo(getClientDeviceInfo());
    
    // Auto-load remembered employee code
    try {
      const savedCode = localStorage.getItem('QYEDX_MOBILE_EMP_CODE');
      if (savedCode) {
        setEmployeeCode(savedCode);
        fetchEmployeeStatus(savedCode);
        fetchMyLeaves(savedCode);
      }
    } catch {}
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

  const fetchEmployeeStatus = async (codeToUse?: string) => {
    const code = (codeToUse !== undefined ? codeToUse : employeeCode).trim();
    if (!code) return;
    try {
      const res = await fetch(`/api/v1/attendance/punch?employeeCode=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.success) {
        setEmpInfo(data);
        try { localStorage.setItem('QYEDX_MOBILE_EMP_CODE', code); } catch {}
      } else {
        setEmpInfo(null);
      }
    } catch {
      setEmpInfo(null);
    }
  };

  const fetchMyLeaves = async (codeToUse?: string) => {
    const code = (codeToUse !== undefined ? codeToUse : employeeCode).trim();
    if (!code) return;
    setLoadingMyLeaves(true);
    try {
      const res = await fetch(`/api/v1/attendance/permissions?employeeCode=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.success) {
        setMyLeaves(data.leaves || []);
      }
    } catch {
      setMyLeaves([]);
    } finally {
      setLoadingMyLeaves(false);
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

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeCode.trim()) {
      setLeaveMsg('يرجى إدخال كود الموظف أولاً');
      setLeaveMsgSuccess(false);
      return;
    }

    if (!startDate) {
      setLeaveMsg('يرجى تحديد تاريخ بداية الإجازة');
      setLeaveMsgSuccess(false);
      return;
    }

    const finalEndDate = endDate || startDate;
    if (new Date(startDate) > new Date(finalEndDate)) {
      setLeaveMsg('تاريخ بداية الإجازة يجب أن يكون قبل أو يطابق تاريخ النهاية');
      setLeaveMsgSuccess(false);
      return;
    }

    setLeaveLoading(true);
    setLeaveMsg('');
    try {
      const res = await fetch('/api/v1/attendance/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeCode: employeeCode.trim(),
          type: leaveType,
          startDate,
          endDate: finalEndDate,
          startTime: leaveType === 'Permission' ? startTime : undefined,
          endTime: leaveType === 'Permission' ? endTime : undefined,
          reason: reason.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setLeaveMsgSuccess(true);
        setLeaveMsg(`✅ ${data.message}`);
        setReason('');
        setStartDate('');
        setEndDate('');
        setStartTime('');
        setEndTime('');
        fetchMyLeaves();
      } else {
        setLeaveMsgSuccess(false);
        setLeaveMsg(`❌ ${data.error || 'فشل إرسال الطلب'}`);
      }
    } catch (err: any) {
      setLeaveMsgSuccess(false);
      setLeaveMsg(`❌ خطأ في الاتصال بالخادم: ${err.message}`);
    } finally {
      setLeaveLoading(false);
    }
  };

  // Helper for leave duration
  const getDaysCount = () => {
    if (!startDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate || startDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const leaveTypes = [
    { value: 'Annual', label: '🏖️ إجازة سنوية', desc: 'إجازة اعتيادية براتب' },
    { value: 'Sick', label: '🤒 إجازة مرضية', desc: 'مرفقة بتقرير طبي معتمد' },
    { value: 'Emergency', label: '🚨 إجازة طارئة / عارضة', desc: 'للحالات المستعجلة والظروف الطارئة' },
    { value: 'Permission', label: '🕒 استئذان ساعي', desc: 'مغادرة لساعات محددة خلال الدوام' },
    { value: 'Unpaid', label: '📄 إجازة بدون راتب', desc: 'إجازة استثنائية' },
    { value: 'Maternity', label: '🍼 أمومة / رعاية', desc: 'إجازة رعاية عائلية' },
    { value: 'Other', label: '📌 أخرى', desc: 'طلب خاص' }
  ];

  return (
    <div style={{
      maxWidth: '480px',
      width: '100%',
      margin: '1rem auto',
      padding: '1.75rem',
      background: 'linear-gradient(180deg, #0f172a 0%, #090d16 100%)',
      borderRadius: '28px',
      color: '#ffffff',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      direction: 'rtl',
      border: '1px solid rgba(255,255,255,0.08)'
    }}>
      {/* Mobile Frame Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>📱</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.3px' }}>خدمات الموظف الذكية</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>قيود إكس - الحضور والإجازات الذاتية</div>
          </div>
        </div>
        <div style={{
          fontSize: '0.7rem',
          padding: '4px 10px',
          borderRadius: '20px',
          background: coords ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: coords ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
          color: coords ? '#6ee7b7' : '#fca5a5',
          fontWeight: 700
        }}>
          {coords ? '🛰️ GPS متصل' : '⚠️ بانتظار GPS'}
        </div>
      </div>

      {/* Tabs Switcher: Punch vs Leave */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '6px',
        background: 'rgba(255,255,255,0.05)',
        padding: '4px',
        borderRadius: '16px',
        marginBottom: '1.5rem',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('punch')}
          style={{
            padding: '10px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'punch' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent',
            color: activeTab === 'punch' ? '#ffffff' : '#94a3b8',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: activeTab === 'punch' ? '0 4px 12px rgba(37,99,235,0.4)' : 'none'
          }}
        >
          📍 تسجيل البصمة
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('leave');
            if (employeeCode) fetchMyLeaves();
          }}
          style={{
            padding: '10px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'leave' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'transparent',
            color: activeTab === 'leave' ? '#ffffff' : '#94a3b8',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: activeTab === 'leave' ? '0 4px 12px rgba(217,119,6,0.4)' : 'none'
          }}
        >
          🏖️ تقديم طلب إجازة
        </button>
      </div>

      {/* Employee ID Input */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 700 }}>
          كود الموظف
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="مثال: EMP-001"
            value={employeeCode}
            onChange={e => setEmployeeCode(e.target.value)}
            onBlur={() => {
              fetchEmployeeStatus();
              fetchMyLeaves();
            }}
            style={{
              flex: 1,
              padding: '11px 14px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 600,
              outline: 'none'
            }}
          />
          <button
            type="button"
            onClick={() => {
              fetchEmployeeStatus();
              fetchMyLeaves();
            }}
            style={{
              padding: '0 16px',
              borderRadius: '12px',
              border: 'none',
              background: '#3b82f6',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.85rem',
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
          padding: '0.9rem 1rem',
          borderRadius: '16px',
          marginBottom: '1.25rem',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#60a5fa' }}>
              👤 {empInfo.employee.nameAr || empInfo.employee.name}
            </div>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '8px', background: 'rgba(59,130,246,0.15)', color: '#93c5fd', fontWeight: 700 }}>
              {empInfo.employee.code}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
            {empInfo.employee.department || 'موظف'}
            {empInfo.employee.branch && ` • الفرع: ${empInfo.employee.branch.nameAr || empInfo.employee.branch.name}`}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: PUNCH (تسجيل الحضور والانصراف) */}
      {/* ============================================================== */}
      {activeTab === 'punch' && (
        <div>
          {/* Device & Location details */}
          {empInfo?.employee && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ padding: '6px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600, background: empInfo.isDeviceBound ? (empInfo.boundDeviceId === deviceId ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.15)') : 'rgba(59,130,246,0.12)', border: empInfo.isDeviceBound ? (empInfo.boundDeviceId === deviceId ? '1px solid #10b981' : '1px solid #ef4444') : '1px solid #3b82f6', color: empInfo.isDeviceBound ? (empInfo.boundDeviceId === deviceId ? '#6ee7b7' : '#fca5a5') : '#93c5fd', marginBottom: '8px' }}>
                {empInfo.isDeviceBound ? (
                  empInfo.boundDeviceId === deviceId ? (
                    <span>🔒 هذا الهاتف موثق لحسابك ({empInfo.boundDeviceInfo || deviceInfo})</span>
                  ) : (
                    <span>⚠️ الحساب موثق على جهاز آخر ({empInfo.boundDeviceInfo || 'هاتف آخر'}). لا يمكن التسجيل من هذا الجهاز!</span>
                  )
                ) : (
                  <span>💡 سيتم توثيق حسابك على هذا الهاتف تلقائياً عند أول بصمة</span>
                )}
              </div>

              {empInfo.effectiveLocation && (
                <div style={{ fontSize: '0.75rem', color: empInfo.effectiveLocation.lat ? '#38bdf8' : '#fbbf24', marginBottom: '8px' }}>
                  📍 {empInfo.effectiveLocation.lat 
                    ? `مقر العمل: ${empInfo.effectiveLocation.source === 'BRANCH' ? (empInfo.employee.branch?.nameAr || 'الفرع') : 'موقع مخصص'} (نطاق ${empInfo.effectiveLocation.radius}م)` 
                    : 'تنبيه: لم يتم تعيين إحداثيات GPS لمقر العمل بعد'}
                </div>
              )}

              {empInfo.todayAttendance && (
                <div style={{ fontSize: '0.75rem', color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '6px 10px', borderRadius: '8px' }}>
                  حالة اليوم: {empInfo.todayAttendance.checkIn ? `حضر الساعة ${new Date(empInfo.todayAttendance.checkIn).toLocaleTimeString('ar-SA')}` : 'لم يحضر بعد'}
                  {empInfo.todayAttendance.checkOut && ` • انصرف ${new Date(empInfo.todayAttendance.checkOut).toLocaleTimeString('ar-SA')}`}
                </div>
              )}
            </div>
          )}

          {/* Device & GPS Info Card */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            fontSize: '0.76rem',
            color: '#94a3b8',
            marginBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📱 الجهاز:</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{deviceInfo || 'جاري التعرف...'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🛰️ الموقع الجغرافي:</span>
              <span style={{ fontFamily: 'monospace', color: coords ? '#38bdf8' : '#94a3b8' }}>
                {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'جاري التحديد...'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <button
              type="button"
              onClick={() => handlePunch('CHECK_IN')}
              disabled={loading}
              style={{
                padding: '1rem',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.95rem',
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
              type="button"
              onClick={() => handlePunch('CHECK_OUT')}
              disabled={loading}
              style={{
                padding: '1rem',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.95rem',
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
            type="button"
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
              fontSize: '0.88rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            ⚡ تسجيل ذكي تلقائي (دخول / خروج)
          </button>

          {/* Status message */}
          {statusMsg && (
            <div style={{
              padding: '0.9rem',
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
      )}

      {/* ============================================================== */}
      {/* TAB 2: LEAVE REQUESTS (تقديم ومتابعة طلبات الإجازة) */}
      {/* ============================================================== */}
      {activeTab === 'leave' && (
        <div>
          <form onSubmit={handleLeaveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Leave Type Select */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 700 }}>
                نوع الإجازة المطلوبة *
              </label>
              <select
                value={leaveType}
                onChange={e => setLeaveType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                {leaveTypes.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.label} - ({t.desc})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Pickers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 700 }}>
                  من تاريخ *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: '#1e293b',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 700 }}>
                  إلى تاريخ *
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  min={startDate}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: '#1e293b',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Duration preview */}
            {startDate && (
              <div style={{
                background: 'rgba(217, 119, 6, 0.12)',
                border: '1px solid rgba(217, 119, 6, 0.3)',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                color: '#fcd34d',
                fontWeight: 700,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>📅 المدة الإجمالية:</span>
                <span>{getDaysCount()} يوم عمل</span>
              </div>
            )}

            {/* Time inputs if Permission (استئذان ساعي) */}
            {leaveType === 'Permission' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 700 }}>
                    من الساعة
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: '#1e293b',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 700 }}>
                    إلى الساعة
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: '#1e293b',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 700 }}>
                السبب / تفاصيل الطلب
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="يرجى كتابة سبب الإجازة وأي تفاصيل ترغب بتوضيحها للإدارة..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={leaveLoading}
              style={{
                padding: '14px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: leaveLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(217,119,6,0.35)',
                opacity: leaveLoading ? 0.7 : 1
              }}
            >
              <span>{leaveLoading ? 'جاري إرسال الطلب...' : '📤 إرسال طلب الإجازة للمراجعة'}</span>
            </button>

            {/* Leave Message */}
            {leaveMsg && (
              <div style={{
                padding: '0.85rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: leaveMsgSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: leaveMsgSuccess ? '1px solid #10b981' : '1px solid #ef4444',
                color: leaveMsgSuccess ? '#6ee7b7' : '#fca5a5'
              }}>
                {leaveMsg}
              </div>
            )}
          </form>

          {/* ========================================================== */}
          {/* MY PAST LEAVE REQUESTS (سجل طلباتي السابقة وحالتها) */}
          {/* ========================================================== */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#e2e8f0' }}>
                📋 سجل طلبات الإجازة السابقة
              </div>
              <button
                type="button"
                onClick={() => fetchMyLeaves()}
                disabled={loadingMyLeaves}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#60a5fa',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {loadingMyLeaves ? 'جاري التحديث...' : '🔄 تحديث'}
              </button>
            </div>

            {myLeaves.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.82rem' }}>
                {loadingMyLeaves ? 'جاري جلب الطلبات...' : 'لا توجد طلبات إجازة مسجلة لك حتى الآن.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {myLeaves.map(leave => {
                  const s = new Date(leave.startDate).toLocaleDateString('ar-SA');
                  const e = new Date(leave.endDate).toLocaleDateString('ar-SA');
                  const typeLabel = leaveTypes.find(t => t.value === leave.type)?.label || leave.type;

                  return (
                    <div
                      key={leave.id}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        padding: '10px 14px',
                        borderRadius: '14px',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#f1f5f9' }}>
                          {typeLabel}
                        </span>
                        
                        {/* Status Badge */}
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          background: leave.status === 'Approved' ? 'rgba(16,185,129,0.18)' : leave.status === 'Rejected' ? 'rgba(239,68,68,0.18)' : 'rgba(245,158,11,0.18)',
                          color: leave.status === 'Approved' ? '#6ee7b7' : leave.status === 'Rejected' ? '#fca5a5' : '#fcd34d',
                          border: leave.status === 'Approved' ? '1px solid #10b981' : leave.status === 'Rejected' ? '1px solid #ef4444' : '1px solid #f59e0b'
                        }}>
                          {leave.status === 'Approved' ? '✅ معتمدة ومقبولة' : leave.status === 'Rejected' ? '❌ مرفوضة' : '⏳ قيد المراجعة'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        📅 من: <strong style={{ color: '#cbd5e1' }}>{s}</strong> إلى: <strong style={{ color: '#cbd5e1' }}>{e}</strong>
                      </div>

                      {leave.reason && (
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic' }}>
                          💬 {leave.reason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

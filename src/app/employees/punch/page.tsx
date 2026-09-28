import React from 'react';
import MobileAttendanceSimulator from '../MobileAttendanceSimulator';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function MobilePunchPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#020617', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '0.75rem', color: '#94a3b8' }}>
        <h1 style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px 0' }}>
          بوابة الموظف: الحضور وطلبات الإجازة
        </h1>
        <p style={{ fontSize: '0.82rem', margin: 0, color: '#64748b' }}>
          قيود إكس - تسجيل البصمة الجغرافية وتقديم ومتابعة الإجازات
        </p>
      </div>
      <MobileAttendanceSimulator />
    </div>
  );
}

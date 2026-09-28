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
    <div style={{ minHeight: '100vh', background: '#020617', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#94a3b8' }}>
        <h1 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 800 }}>نظام بصمة الحضور والانصراف الجغرافي</h1>
        <p style={{ fontSize: '0.85rem' }}>قيود إكس - بوابة تسجيل الحضور عبر موقع العمل المعتمد</p>
      </div>
      <MobileAttendanceSimulator />
    </div>
  );
}

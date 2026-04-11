'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton({ lang, label }: { lang: string, label: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <button className="nav-item logout-btn" onClick={handleLogout} style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}>
      <span className="nav-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
      </span>
      {label}
      <style jsx>{`
        .logout-btn:hover { color: #ef4444 !important; background: rgba(239, 68, 68, 0.05) !important; }
        .logout-btn:hover :global(svg) { color: #ef4444; }
      `}</style>
    </button>
  );
}

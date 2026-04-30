'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';
import LanguageSwitcher from './LanguageSwitcher';
import { hasPermission } from '@/lib/permissions';
import { UserProvider } from './UserContext';

interface AppShellProps {
  children: React.ReactNode;
  dict: any;
  user: any;
  lang: string;
}

export default function AppShell({ children, dict, user, lang }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Permissions check helper
  const canAccess = (module: any) => {
    // Admins have access to everything
    if (user.role === 'Admin') return true;
    return hasPermission(user.roleRef?.permissions || user.permissions, module, 'view');
  };

  // Close sidebar on route change (mobile) & fix hydration
  useEffect(() => {
    setMounted(true);
    setIsSidebarOpen(false);
  }, [pathname]);

  if (!mounted) return <div style={{ opacity: 0 }}>{children}</div>;

  return (
    <UserProvider user={user}>
      <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`} dir={dir}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
           <div className="logo-container">
             <div className="logo-icon">N</div>
             <div className="logo-text">{dict.sidebar.brand}</div>
           </div>
           <button className="mobile-close" onClick={() => setIsSidebarOpen(false)}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>
        </div>
        
        <nav className="nav-menu">
          <div className="nav-label">Main</div>
          <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            </span>
            {dict.sidebar.dashboard}
          </Link>
          {canAccess('accounting') && (
            <Link href="/financial" className={`nav-item ${pathname.startsWith('/financial') ? 'active' : ''}`}>
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M3 15h6"></path><path d="M3 18h6"></path></svg>
              </span>
              {dict.sidebar.financialMgmt}
            </Link>
          )}

          {(canAccess('quotations') || canAccess('invoices')) && (
            <Link href="/sales" className={`nav-item ${pathname.startsWith('/sales') ? 'active' : ''}`}>
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </span>
              {dict.sidebar.sales}
            </Link>
          )}

          {canAccess('inventory') && (
            <Link href="/inventory" className={`nav-item ${pathname.startsWith('/inventory') ? 'active' : ''}`}>
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              </span>
              {dict.sidebar.inventory}
            </Link>
          )}

          <div className="nav-label">Operations</div>
          
          {canAccess('purchases') && (
            <Link href="/purchases" className={`nav-item ${pathname.startsWith('/purchases') ? 'active' : ''}`}>
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              {dict.sidebar.purchases}
            </Link>
          )}

          {canAccess('inventory') && (
            <Link href="/warehouses" className={`nav-item ${pathname.startsWith('/warehouses') ? 'active' : ''}`}>
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </span>
              {dict.sidebar.warehouses}
            </Link>
          )}

          {canAccess('hr') && (
            <>
              <Link href="/employees" className={`nav-item ${pathname.startsWith('/employees') ? 'active' : ''}`}>
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </span>
                {dict.sidebar.employees}
              </Link>
              <Link href="/salaries" className={`nav-item ${pathname.startsWith('/salaries') ? 'active' : ''}`}>
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </span>
                {lang === 'ar' ? 'الرواتب' : 'Salaries'}
              </Link>
            </>
          )}

          <div className="nav-label">Analytics</div>
          {canAccess('reports') && (
            <Link href="/reports" className={`nav-item ${pathname.startsWith('/reports') ? 'active' : ''}`}>
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </span>
              {dict.sidebar.reports}
            </Link>
          )}
        </nav>
        
        <div className="nav-footer">
          {canAccess('settings') && (
            <Link href="/settings" className={`nav-item ${pathname.startsWith('/settings') ? 'active' : ''}`}>
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </span>
              {dict.sidebar.settings}
            </Link>
          )}
          <LogoutButton lang={lang} label={lang === 'ar' ? 'تسجيل الخروج' : 'Logout'} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-wrapper">
        <header className="header">
          <div className="header-mobile-toggle">
            <button className="hamburger" onClick={() => setIsSidebarOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="mobile-brand">{dict.sidebar.brand}</div>
          </div>

          <div className="search-container no-mobile-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder={dict.header.search} />
          </div>
          
          <div className="header-actions">
            <LanguageSwitcher currentLang={lang} />
            <button className="action-btn no-mobile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="badge">3</span>
            </button>
            
            <div className="user-profile">
              <div className="avatar">
                {user.name ? user.name[0].toUpperCase() : user.username[0].toUpperCase()}
              </div>
              <div className="user-info no-mobile">
                <span className="user-name">{user.name || user.username}</span>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>
      </main>

      <style jsx>{`
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 100;
        }

        .header-mobile-toggle {
          display: none;
          align-items: center;
          gap: 1rem;
        }

        .hamburger {
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 0.5rem;
        }

        .mobile-brand {
          font-weight: 700;
          font-size: 1.25rem;
          background: linear-gradient(to right, #fff, #a5b4fc);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 2rem;
        }

        .mobile-close {
           display: none;
           background: none;
           border: none;
           color: var(--text-secondary);
           cursor: pointer;
        }

        @media (max-width: 768px) {
          .header-mobile-toggle { display: flex; }
          .no-mobile-header { display: none; }
          .no-mobile { display: none; }
          .mobile-close { display: block; }
          
          .sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: ${lang === 'ar' ? 'auto' : '0'};
            right: ${lang === 'ar' ? '0' : 'auto'};
            width: 280px;
            z-index: 200;
            transform: translateX(${lang === 'ar' ? '100%' : '-100%'});
            transition: transform 0.3s ease;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          .sidebar.active {
            transform: translateX(0);
          }
          
          .main-wrapper {
            width: 100vw;
          }
        }
      `}</style>
      </div>
    </UserProvider>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  subscriptionEndsAt?: string | null;
  subscriptionPlan?: any;
  branches?: any[];
}

export default function AppShell({ children, dict, user, lang, subscriptionEndsAt, subscriptionPlan, branches = [] }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Calculate days left
  let daysLeft: number | null = null;
  if (subscriptionEndsAt) {
    const diff = new Date(subscriptionEndsAt).getTime() - new Date().getTime();
    daysLeft = Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  }

  // Permissions check helper
  const canAccess = (module: any) => {
    // Feature flag checks based on subscription plan
    if (subscriptionPlan) {
      if (module === 'sales' || module === 'purchases') {
         if (!subscriptionPlan.hasSalesAndPurchases) return false;
      }
      if (module === 'bankReconciliation') {
         if (!subscriptionPlan.hasBankReconciliation) return false;
      }
      if (module === 'fixedAssets') {
         if (!subscriptionPlan.hasFixedAssets) return false;
      }
      if (module === 'multiCurrency') {
         if (!subscriptionPlan.hasMultiCurrency) return false;
      }
      if (module === 'advancedReports') {
         if (!subscriptionPlan.hasAdvancedReports) return false;
      }
    }

    // Admins and SuperAdmins have access to everything
    if (user.role === 'Admin' || user.role === 'SuperAdmin') return true;
    return hasPermission(user.roleRef?.permissions || user.permissions, module, 'view');
  };

  // Close sidebar on route change (mobile) & fix hydration
  useEffect(() => {
    setMounted(true);
    setIsSidebarOpen(false);
    setIsNotificationsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mounted && canAccess('sales')) {
      fetch('/api/notifications')
        .then(res => res.json())
        .then(data => {
          if (data.notifications) {
            setNotifications(data.notifications);
          }
        })
        .catch(err => console.error('Error fetching notifications:', err));
    }
  }, [mounted, pathname]);

  // Handle click outside notifications dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);

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
           <div className="logo-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '1rem', marginTop: '1rem' }}>
             <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.5rem', background: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
               <img src="/qaydx-logo.png" alt="QaydX" style={{ width: '140%', height: '140%', objectFit: 'cover' }} />
             </div>
             <div className="logo-text" style={{ fontSize: '1.5rem', fontWeight: '900' }}>{dict.sidebar.brand}</div>
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
            <Link href="/financial" className={`nav-item ${pathname === '/financial' || (pathname.startsWith('/financial') && !pathname.includes('fixed-assets') && !pathname.includes('bank-reconciliation')) ? 'active' : ''}`}>
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M3 15h6"></path><path d="M3 18h6"></path></svg>
              </span>
              {dict.sidebar.financialMgmt}
            </Link>
          )}

          {canAccess('fixedAssets') && (
            <Link href="/financial/fixed-assets" className={`nav-item ${pathname.startsWith('/financial/fixed-assets') ? 'active' : ''}`}>
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </span>
              {lang === 'ar' ? 'الأصول الثابتة' : 'Fixed Assets'}
            </Link>
          )}

          {canAccess('bankReconciliation') && (
            <>
              <Link href="/financial/bank-accounts" className={`nav-item ${pathname.startsWith('/financial/bank-accounts') ? 'active' : ''}`}>
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"></rect><line x1="3" y1="12" x2="21" y2="12"></line></svg>
                </span>
                {lang === 'ar' ? 'الحسابات البنكية' : 'Bank Accounts'}
              </Link>
              <Link href="/financial/bank-reconciliation" className={`nav-item ${pathname.startsWith('/financial/bank-reconciliation') ? 'active' : ''}`}>
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                </span>
                {lang === 'ar' ? 'التسوية البنكية' : 'Bank Reconciliation'}
              </Link>
            </>
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

          {user.role === 'SuperAdmin' && (
            <>
              <div className="nav-label">System Administration</div>
              <Link href="/superadmin/companies" className={`nav-item ${pathname.startsWith('/superadmin/companies') ? 'active' : ''}`}>
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </span>
                {lang === 'ar' ? 'إدارة الشركات' : 'Companies'}
              </Link>
              <Link href="/superadmin/packages" className={`nav-item ${pathname.startsWith('/superadmin/packages') ? 'active' : ''}`}>
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                </span>
                {lang === 'ar' ? 'إدارة الباقات' : 'Packages'}
              </Link>
            </>
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
        {daysLeft !== null && daysLeft <= 30 && (
          <div className="subscription-warning bg-red-600/90 text-white text-center py-2 px-4 font-bold text-sm w-full shadow-md z-50 flex items-center justify-center gap-2">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            {lang === 'ar' 
              ? `تنبيه هام: اشتراكك ينتهي خلال ${daysLeft} يوم. يرجى التواصل مع الإدارة لتجديد الاشتراك لتجنب إيقاف النظام.`
              : `Important: Your subscription expires in ${daysLeft} days. Please contact management to renew and avoid service interruption.`}
          </div>
        )}
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
            {branches.length > 0 && (
              <div className="branch-switcher" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.25rem 0.75rem', borderRadius: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                <select 
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}
                  onChange={(e) => {
                    document.cookie = `NX_BRANCH=${e.target.value}; path=/; max-age=31536000`;
                    window.location.reload();
                  }}
                  defaultValue={typeof document !== 'undefined' ? (document.cookie.split('; ').find(row => row.startsWith('NX_BRANCH='))?.split('=')[1] || '') : ''}
                >
                  <option value="">{lang === 'ar' ? 'كل الفروع' : 'All Branches'}</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{lang === 'ar' ? (b.nameAr || b.name) : b.name}</option>
                  ))}
                </select>
              </div>
            )}
            <LanguageSwitcher currentLang={lang} />
            
            <div className="notifications-wrapper" ref={notificationsRef} style={{ position: 'relative' }}>
              <button 
                className={`action-btn no-mobile ${notifications.length > 0 ? 'has-notifications' : ''}`}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
              </button>
              
              {isNotificationsOpen && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h4>{lang === 'ar' ? 'التنبيهات' : 'Notifications'}</h4>
                    {notifications.length > 0 && <span className="notifications-count">{notifications.length}</span>}
                  </div>
                  <div className="notifications-list">
                    {notifications.length === 0 ? (
                      <div className="no-notifications">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        <p>{lang === 'ar' ? 'لا توجد تنبيهات جديدة' : 'No new notifications'}</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <Link href={notif.link || '#'} key={notif.id} className="notification-item">
                          <div className="notification-icon error">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                          </div>
                          <div className="notification-content">
                            <h5>{lang === 'ar' ? notif.titleAr : notif.title}</h5>
                            <p>{lang === 'ar' ? notif.messageAr : notif.message}</p>
                            <span className="notification-time">
                              {new Date(notif.date).toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
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

        .notifications-dropdown {
          position: absolute;
          top: 120%;
          left: ${lang === 'ar' ? '0' : 'auto'};
          right: ${lang === 'ar' ? 'auto' : '0'};
          width: 320px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.15);
          border: 1px solid #e2e8f0;
          z-index: 1000;
          overflow: hidden;
          transform-origin: top right;
          animation: dropIn 0.2s ease-out;
        }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .notifications-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
        }

        .notifications-header h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .notifications-count {
          background: #ef4444;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 50px;
        }

        .notifications-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .no-notifications {
          padding: 3rem 1.5rem;
          text-align: center;
          color: #94a3b8;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .notification-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #f1f5f9;
          text-decoration: none;
          transition: background 0.2s;
        }

        .notification-item:hover {
          background: #f8fafc;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }

        .notification-icon.error {
          background: #fef2f2;
          color: #ef4444;
        }

        .notification-content h5 {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
        }

        .notification-content p {
          margin: 0 0 0.5rem 0;
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.4;
        }

        .notification-time {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .action-btn.has-notifications {
          color: #0f172a;
          animation: ring 4s infinite;
        }

        @keyframes ring {
          0% { transform: rotate(0); }
          5% { transform: rotate(15deg); }
          10% { transform: rotate(-10deg); }
          15% { transform: rotate(5deg); }
          20% { transform: rotate(0); }
          100% { transform: rotate(0); }
        }
      `}</style>
      </div>
    </UserProvider>
  );
}

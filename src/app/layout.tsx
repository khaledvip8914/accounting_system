import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { cookies } from "next/headers";
import { getDictionary } from "../lib/i18n";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexAccount - Professional Accounting",
  description: "Comprehensive multi-currency accounting software",
};

import { ThemeProvider } from "../components/ThemeProvider";
import { getSession } from "../lib/auth";
import LogoutButton from "../components/LogoutButton";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'en';
  const dict = getDictionary(lang);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const session = await getSession();
  const user = session?.user;
  
  // A simple way to determine if we're on login page in server layout 
  // is to check if session doesn't exist and we're likely being redirected or children is LoginPage
  // But more robust is to just check if the children is specifically the login page or we provide a different layout for it.
  // For now, let's just make the sidebar/header conditional on session existence.
  const isAuthPage = !user;

  return (
    <html lang={lang} dir={dir} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {!user ? (
            <div className="auth-wrapper">
              {children}
            </div>
          ) : (
            <div className="app-container">
              {/* Sidebar */}
              <aside className="sidebar">
                <div className="logo-container">
                  <div className="logo-icon">N</div>
                  <div className="logo-text">{dict.sidebar.brand}</div>
                </div>
                
                <nav className="nav-menu">
                  <div className="nav-label">Main</div>
                  <Link href="/" className="nav-item">
                    <span className="nav-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                    </span>
                    {dict.sidebar.dashboard}
                  </Link>
                  <Link href="/financial" className="nav-item">
                    <span className="nav-icon">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M3 15h6"></path><path d="M3 18h6"></path></svg>
                    </span>
                    {dict.sidebar.financialMgmt}
                  </Link>
                  <Link href="/sales" className="nav-item">
                    <span className="nav-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    </span>
                    {dict.sidebar.sales}
                  </Link>

                  <Link href="/inventory" className="nav-item">
                    <span className="nav-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    </span>
                    {dict.sidebar.inventory}
                  </Link>

                  <div className="nav-label">Operations</div>
                  <Link href="/purchases" className="nav-item">
                    <span className="nav-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </span>
                    {dict.sidebar.purchases}
                  </Link>
                  <Link href="/warehouses" className="nav-item">
                    <span className="nav-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    </span>
                    {dict.sidebar.warehouses}
                  </Link>

                  <div className="nav-label">Analytics</div>
                  <Link href="/reports" className="nav-item">
                    <span className="nav-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    </span>
                    {dict.sidebar.reports}
                  </Link>
                </nav>
                
                <div className="nav-footer">
                  <Link href="/settings" className="nav-item">
                    <span className="nav-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </span>
                    {dict.sidebar.settings}
                  </Link>
                  <LogoutButton lang={lang} label={lang === 'ar' ? 'تسجيل الخروج' : 'Logout'} />
                </div>
              </aside>

              {/* Main Content Wrappper */}
              <main className="main-wrapper">
                {/* Header */}
                <header className="header" style={{ padding: '0 2rem' }}>
                  <div className="search-container">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder={dict.header.search} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '200px', marginLeft: '0.5rem' }} />
                  </div>
                  
                  <div className="header-actions">
                    <LanguageSwitcher currentLang={lang} />

                    <button className="action-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                      <span className="badge">3</span>
                    </button>
                    
                    <div className="user-profile">
                      <div className="avatar" style={{ background: 'var(--accent-primary)', color: 'white', fontWeight: 700 }}>
                        {user.name ? user.name[0].toUpperCase() : user.username[0].toUpperCase()}
                      </div>
                      <div className="user-info">
                        <span className="user-name">{user.name || user.username}</span>
                        <span className="user-role" style={{ textTransform: 'capitalize' }}>{user.role}</span>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Page Router Outlet */}
                <div className="page-content">
                  {children}
                </div>
              </main>
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}

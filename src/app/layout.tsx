import type { Metadata } from "next";
import { Geist, Geist_Mono, Tajawal } from "next/font/google";
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

const tajawal = Tajawal({
  weight: ['400', '500', '700', '800', '900'],
  subsets: ['arabic'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: "QaydX - Professional Accounting",
  description: "Comprehensive multi-currency accounting software",
};

import { ThemeProvider } from "../components/ThemeProvider";
import { getSession } from "../lib/auth";
import LogoutButton from "../components/LogoutButton";
import AppShell from "../components/AppShell";
import { UserProvider } from "../components/UserContext";
import { prisma } from "../lib/db";

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
  
  // Determine if it's an authenticated session
  const isAuthenticated = !!user;

  let subscriptionEndsAt = null;
  if (isAuthenticated && user.companyId && user.companyId !== 'default') {
    const company = await prisma.company.findUnique({
      where: { id: user.companyId },
      select: { subscriptionEndsAt: true }
    });
    if (company?.subscriptionEndsAt) {
      subscriptionEndsAt = company.subscriptionEndsAt.toISOString();
    }
  }

  return (
    <html lang={lang} dir={dir} className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(m) {
                m.addedNodes.forEach(function(node) {
                  if (node.nodeType === 1) {
                    node.removeAttribute && node.removeAttribute('fdprocessedid');
                    node.querySelectorAll && node.querySelectorAll('[fdprocessedid]').forEach(function(el) {
                      el.removeAttribute('fdprocessedid');
                    });
                  }
                });
              });
            });
            observer.observe(document.documentElement, { childList: true, subtree: true, attributes: false });
          })();
        ` }} />
      </head>
      <body suppressHydrationWarning>
        <UserProvider user={user}>
          <ThemeProvider>
            {!isAuthenticated ? (
              <div className="auth-wrapper">
                {children}
              </div>
            ) : (
              <AppShell dict={dict} user={user} lang={lang} subscriptionEndsAt={subscriptionEndsAt}>
                {children}
              </AppShell>
            )}
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}

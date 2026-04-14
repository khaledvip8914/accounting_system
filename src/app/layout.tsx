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
import AppShell from "../components/AppShell";

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
            <AppShell dict={dict} user={user} lang={lang}>
              {children}
            </AppShell>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}

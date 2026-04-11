'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'glass-dark' | 'pure-light' | 'deep-night' | 'royal-gold';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('glass-dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('NX_THEME') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('NX_THEME', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (!mounted) {
    return <div style={{ opacity: 0 }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme-wrapper ${theme}`}>
        {children}
      </div>
      <style jsx global>{`
        .theme-wrapper {
          min-height: 100vh;
          width: 100%;
          background: var(--bg-gradient);
          color: var(--text-primary);
          transition: background 0.5s ease, color 0.3s ease;
        }
      `}</style>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

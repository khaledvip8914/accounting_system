'use client';
import React, { useTransition } from 'react';
import { setLanguage } from '../app/actions';

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(async () => {
      await setLanguage(e.target.value);
    });
  };

  return (
    <select 
      value={currentLang} 
      onChange={handleSwitch} 
      disabled={isPending}
      style={{
        background: 'transparent',
        border: '1px solid var(--glass-border)',
        color: 'var(--text-primary)',
        padding: '0.25rem 0.5rem',
        borderRadius: '8px',
        outline: 'none',
        cursor: 'pointer'
      }}
    >
      <option value="en" style={{background: '#0f172a'}}>En</option>
      <option value="ar" style={{background: '#0f172a'}}>Ar</option>
    </select>
  );
}

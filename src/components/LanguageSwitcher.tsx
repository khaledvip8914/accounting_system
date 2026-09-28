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
      className="language-switcher-select"
      style={{
        background: 'var(--chip-bg)',
        border: '1px solid var(--glass-border)',
        color: 'var(--text-primary)',
        padding: '0.35rem 0.65rem',
        borderRadius: '10px',
        outline: 'none',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.85rem'
      }}
    >
      <option value="en" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>En</option>
      <option value="ar" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>Ar</option>
    </select>
  );
}

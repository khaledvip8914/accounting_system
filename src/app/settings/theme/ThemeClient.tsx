'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Lang } from '@/lib/i18n';

export default function ThemeClient({ lang }: { lang: Lang }) {
  const { theme, setTheme } = useTheme();

  const themes = [
    { 
      id: 'glass-dark', 
      nameAr: 'الداكن الزجاجي', 
      nameEn: 'Glass Dark', 
      descAr: 'النمط الافتراضي الفاخر مع تأثيرات الزجاج والشفافية',
      descEn: 'The premium default theme with glass and transparency effects',
      preview: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 100%)',
      accent: '#6366f1'
    },
    { 
      id: 'pure-light', 
      nameAr: 'الفاتح النقي', 
      nameEn: 'Pure Light', 
      descAr: 'نمط فاتح عصري، مريح جداً للقراءة والعمل النهاري',
      descEn: 'Modern light theme, perfect for reading and daytime work',
      preview: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
      accent: '#2563eb'
    },
    { 
      id: 'deep-night', 
      nameAr: 'منتصف الليل', 
      nameEn: 'Deep Night', 
      descAr: 'سواد حالك (OLED) مصمم للراحة القصوى للعين في الليل',
      descEn: 'Pitch black (OLED) designed for maximum eye comfort at night',
      preview: 'linear-gradient(135deg, #000000 0%, #111827 100%)',
      accent: '#4f46e5'
    },
    { 
      id: 'royal-gold', 
      nameAr: 'النمط الملكي', 
      nameEn: 'Royal Gold', 
      descAr: 'تدرجات بنفسجية وذهبية تمنح البرنامج طابعاً ملكياً خاصاً',
      descEn: 'Purple and gold gradients giving a unique royal character',
      preview: 'linear-gradient(135deg, #1a1c2c 0%, #1a1c2c 100%)',
      accent: '#eab308'
    }
  ];

  return (
    <div className="theme-settings">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/settings" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px', fontSize: '0.85rem' }}>
            {lang === 'ar' ? '← عودة' : '← Back'}
          </Link>
          <div>
            <h1 className="page-title">{lang === 'ar' ? 'تخصيص الأشكال' : 'Theme Settings'}</h1>
            <p className="page-subtitle">{lang === 'ar' ? 'اختر النمط المفضل لمظهر البرنامج' : 'Choose your preferred application look'}</p>
          </div>
        </div>
      </div>

      <div className="theme-grid">
        {themes.map((t) => (
          <div 
            key={t.id} 
            className={`theme-card ${theme === t.id ? 'active' : ''}`}
            onClick={() => setTheme(t.id as any)}
          >
            <div className="theme-preview" style={{ background: t.preview }}>
              <div className="preview-elements">
                <div className="preview-sidebar" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
                <div className="preview-main">
                  <div className="preview-header" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
                  <div className="preview-content">
                    <div className="preview-bar" style={{ width: '60%', background: t.accent }}></div>
                    <div className="preview-bar" style={{ width: '40%', background: 'rgba(255,255,255,0.1)' }}></div>
                  </div>
                </div>
              </div>
              {theme === t.id && (
                <div className="active-check">✓</div>
              )}
            </div>
            <div className="theme-info">
              <h3 className="theme-name">{lang === 'ar' ? t.nameAr : t.nameEn}</h3>
              <p className="theme-desc">{lang === 'ar' ? t.descAr : t.descEn}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .theme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        .theme-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .theme-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        .theme-card.active {
          border-color: var(--accent-primary);
          background: rgba(99, 102, 241, 0.05);
          box-shadow: 0 0 0 2px var(--accent-primary);
        }
        .theme-preview {
          height: 180px;
          position: relative;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .preview-elements {
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }
        .preview-sidebar { width: 25%; height: 100%; border-right: 1px solid rgba(255,255,255,0.05); }
        .preview-main { flex: 1; display: flex; flex-direction: column; }
        .preview-header { height: 20px; width: 100%; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .preview-content { padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .preview-bar { height: 8px; border-radius: 4px; }
        
        .active-check {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--accent-primary);
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .theme-info {
          padding: 1.5rem;
        }
        .theme-name {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        .theme-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

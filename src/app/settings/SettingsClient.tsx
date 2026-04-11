'use client';

import { Lang } from '@/lib/i18n';
import Link from 'next/link';

export default function SettingsClient({ lang, dict }: { lang: Lang, dict: any }) {
  const settingsCategories = [
    { id: 'general', href: '/settings/general', label: dict.settings.general, icon: '⚙️' },
    { id: 'financialYears', href: '/settings/financial-years', label: dict.settings.financialYears, icon: '📅' },
    { id: 'analysisDimensions', href: '/settings/analysis-dimensions', label: dict.settings.analysisDimensions, icon: '📐' },
    { id: 'theme', href: '/settings/theme', label: lang === 'ar' ? 'الأشكال' : 'Theme', icon: '🎨' },
    { id: 'subscription', href: '/settings/subscription', label: dict.settings.subscription, icon: '💳' },
    { id: 'zatca', href: '/settings/zatca', label: dict.settings.zatca, icon: '🔗' },
    { id: 'currencies', href: '/settings/currencies', label: dict.settings.currencies, icon: '💱' },
    { id: 'taxes', href: '/settings/taxes', label: dict.settings.taxes, icon: '⚖️' },
    { id: 'payroll', href: '/settings/payroll', label: dict.settings.payroll, icon: '💸' },
    { id: 'users', href: '/settings/users', label: dict.settings.users, icon: '👥' },
    { id: 'paymentTerms', href: '/settings/payment-terms', label: dict.settings.paymentTerms, icon: '📄' },
    { id: 'additionalFields', href: '/settings/additional-fields', label: dict.settings.additionalFields, icon: '📝' },
    { id: 'editProfile', href: '/settings/edit-profile', label: dict.settings.editProfile, icon: '👤' },
    { id: 'attachments', href: '/settings/attachments', label: dict.settings.attachments, icon: '📎' },
    { id: 'productProps', href: '/settings/product-props', label: dict.settings.productProps, icon: '📦' },
  ];

  return (
    <div className="settings-module">
      <div className="page-header">
        <div>
          <h1 className="page-title">{dict.settings.title}</h1>
          <p className="page-subtitle">{dict.settings.subtitle}</p>
        </div>
      </div>

      <div className="settings-grid">
        {settingsCategories.map((cat) => (
          <Link key={cat.id} href={cat.href}>
            <div className="card settings-card">
              <div className="settings-icon">{cat.icon}</div>
              <div className="settings-label">{cat.label}</div>
              <div className="settings-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {lang === 'ar' ? (
                    <polyline points="15 18 9 12 15 6"></polyline>
                  ) : (
                    <polyline points="9 18 15 12 9 6"></polyline>
                  )}
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        .settings-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .settings-card:hover {
          background: rgba(255, 255, 255, 0.06);
          transform: translateY(-2px);
          border-color: var(--accent-primary);
        }
        .settings-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .settings-label {
          font-weight: 600;
          font-size: 0.95rem;
          flex: 1;
        }
        .settings-arrow {
          color: var(--text-secondary);
          opacity: 0.5;
        }
        .settings-card:hover .settings-arrow {
          color: var(--accent-primary);
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

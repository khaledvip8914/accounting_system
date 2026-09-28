'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Lang } from '@/lib/i18n';
import Link from 'next/link';
import ZatcaOnboarding from '@/components/ZatcaOnboarding';
import { useUser } from '@/components/UserContext';
import { SETTINGS_EXPERT_GUIDES, SettingExpertGuide } from '@/lib/settingsGuide';

interface SettingsClientProps {
  lang: Lang;
  dict: any;
  companyId: string;
  zatcaStatus: string;
  hasZatcaPhase2: boolean;
}

interface PopoverPosition {
  left: number;
  top?: number;
  bottom?: number;
  arrowLeft: number;
  isAbove: boolean;
  width: number;
}

export default function SettingsClient({ lang, dict, companyId, zatcaStatus, hasZatcaPhase2 }: SettingsClientProps) {
  const [isZatcaModalOpen, setIsZatcaModalOpen] = useState(false);
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);
  const [popoverPos, setPopoverPos] = useState<PopoverPosition | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const { subscriptionPlan } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculatePosition = useCallback((triggerEl: HTMLElement): PopoverPosition => {
    const rect = triggerEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popoverWidth = Math.min(390, viewportWidth - 32);

    // Center of the trigger button
    const triggerCenterX = rect.left + rect.width / 2;

    // Ideal left coordinate (centered on button)
    let left = triggerCenterX - popoverWidth / 2;

    // Strictly clamp within viewport: at least 16px from left edge, and 16px from right edge
    left = Math.max(16, Math.min(left, viewportWidth - popoverWidth - 16));

    // Arrow position relative to the popover container
    const arrowLeft = Math.max(24, Math.min(triggerCenterX - left, popoverWidth - 24));

    // Vertical positioning: check space below vs space above
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const isAbove = spaceBelow < 420 && spaceAbove > 320;

    let top: number | undefined;
    let bottom: number | undefined;

    if (isAbove) {
      bottom = Math.max(16, viewportHeight - rect.top + 8);
    } else {
      top = Math.min(rect.bottom + 8, viewportHeight - 120);
    }

    return {
      left,
      top,
      bottom,
      arrowLeft,
      isAbove,
      width: popoverWidth,
    };
  }, []);

  // Update position on window resize or scroll
  useEffect(() => {
    function handleResizeOrScroll() {
      if (activeGuideId && activeTriggerRef.current) {
        setPopoverPos(calculatePosition(activeTriggerRef.current));
      }
    }
    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);
    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
    };
  }, [activeGuideId, calculatePosition]);

  // Close tooltip on click outside or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        !target.closest('.expert-popover-portal') &&
        !target.closest('.info-trigger-wrapper')
      ) {
        setActiveGuideId(null);
        setIsPinned(false);
        setPopoverPos(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveGuideId(null);
        setIsPinned(false);
        setPopoverPos(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const settingsCategories = [
    { id: 'general', href: '/settings/general', label: dict.settings.general, icon: '⚙️' },
    { id: 'financialYears', href: '/settings/financial-years', label: lang === 'ar' ? 'السنوات المالية' : 'Financial Years', icon: '📅' },
    { id: 'branches', href: '/settings/branches', label: lang === 'ar' ? 'إدارة الفروع' : 'Branches Management', icon: '🏢' },
    ...(subscriptionPlan?.hasAnalysisDimensions !== false ? [{ id: 'analysisDimensions', href: '/settings/analysis-dimensions', label: dict.settings.analysisDimensions, icon: '📐' }] : []),
    { id: 'theme', href: '/settings/theme', label: lang === 'ar' ? 'الأشكال والمظهر' : 'Theme & Appearance', icon: '🎨' },
    { id: 'subscription', href: '#', label: dict.settings.subscription, icon: '💳' },
    ...(hasZatcaPhase2 ? [{ id: 'zatca', href: '#', action: 'modal', label: dict.settings.zatca, icon: '🔗' }] : []),
    { id: 'currencies', href: '/settings/currencies', label: dict.settings.currencies, icon: '💱' },
    { id: 'taxes', href: '/settings/taxes', label: dict.settings.taxes, icon: '⚖️' },
    ...(subscriptionPlan?.hasHumanResources !== false ? [{ id: 'payroll', href: '/settings/payroll', label: dict.settings.payroll, icon: '💸' }] : []),
    { id: 'users', href: '/settings/users', label: dict.settings.users, icon: '👥' },
    { id: 'roles', href: '/settings/roles', label: lang === 'ar' ? 'الأدوار ومجموعات الصلاحيات' : 'Roles & Permission Groups', icon: '🛡️' },
    { id: 'paymentTerms', href: '/settings/payment-terms', label: dict.settings.paymentTerms, icon: '📄' },
    { id: 'paymentMethods', href: '/settings/payment-methods', label: lang === 'ar' ? 'طرق الدفع وربط الحسابات' : 'Payment Methods & Accounts', icon: '💳' },
    { id: 'additionalFields', href: '/settings/additional-fields', label: dict.settings.additionalFields, icon: '📝' },
    { id: 'editProfile', href: '#', label: dict.settings.editProfile, icon: '👤' },
    { id: 'attachments', href: '#', label: dict.settings.attachments, icon: '📎' },
    { id: 'productProps', href: '/settings/product-props', label: dict.settings.productProps, icon: '📦' },
    ...(subscriptionPlan?.hasApiIntegration !== false ? [{ id: 'api', href: '/settings/api', label: lang === 'ar' ? 'ربط API (الأنظمة الخارجية)' : 'API Integration', icon: '🔌' }] : []),
    ...(subscriptionPlan?.hasWhatsApp !== false ? [{ id: 'whatsapp', href: '/settings/whatsapp', label: lang === 'ar' ? 'إعدادات ربط واتساب' : 'WhatsApp Integration', icon: '💬' }] : []),
  ];

  // Filter categories by search query in name or guide description
  const filteredCategories = settingsCategories.filter(cat => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const guide = SETTINGS_EXPERT_GUIDES[cat.id];
    const matchLabel = cat.label.toLowerCase().includes(q);
    const matchGuide = guide && (
      guide.functionality.ar.toLowerCase().includes(q) ||
      guide.functionality.en.toLowerCase().includes(q) ||
      guide.accountingImpact.ar.toLowerCase().includes(q) ||
      guide.categoryBadge.ar.toLowerCase().includes(q)
    );
    return matchLabel || matchGuide;
  });

  const handleInfoMouseEnter = (e: React.MouseEvent<HTMLElement>, id: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    activeTriggerRef.current = e.currentTarget;
    setPopoverPos(calculatePosition(e.currentTarget));
    setActiveGuideId(id);
  };

  const handleInfoMouseLeave = (id: string) => {
    if (!isPinned) {
      closeTimeoutRef.current = setTimeout(() => {
        setActiveGuideId(null);
        setPopoverPos(null);
      }, 150);
    }
  };

  const handlePopoverMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handlePopoverMouseLeave = () => {
    if (!isPinned) {
      closeTimeoutRef.current = setTimeout(() => {
        setActiveGuideId(null);
        setPopoverPos(null);
      }, 150);
    }
  };

  const handleInfoClick = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeGuideId === id && isPinned) {
      setActiveGuideId(null);
      setIsPinned(false);
      setPopoverPos(null);
    } else {
      activeTriggerRef.current = e.currentTarget;
      setPopoverPos(calculatePosition(e.currentTarget));
      setActiveGuideId(id);
      setIsPinned(true);
    }
  };

  const handleCloseGuide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveGuideId(null);
    setIsPinned(false);
    setPopoverPos(null);
  };

  const currentGuide = activeGuideId ? SETTINGS_EXPERT_GUIDES[activeGuideId] : null;
  const currentCategory = activeGuideId ? settingsCategories.find(c => c.id === activeGuideId) : null;

  return (
    <div className="settings-module" ref={containerRef}>
      <div className="page-header settings-header">
        <div>
          <div className="title-row">
            <h1 className="page-title">{dict.settings.title}</h1>
            <span className="expert-badge">
              <span className="expert-pulse"></span>
              {lang === 'ar' ? 'مزوّد بدليل الخبير المحاسبي والبرمجي 💡' : 'Equipped with Accounting & Tech Expert Guide 💡'}
            </span>
          </div>
          <p className="page-subtitle">
            {lang === 'ar' 
              ? 'قم بتهيئة إعدادات المنشأة. يمكنك الوقوف على علامة التعجب (!) بجانب أي إعداد لقراءة الشرح والأثر المحاسبي والرقابي المفصل.' 
              : 'Configure company settings. Hover over the (!) badge next to any setting to inspect its detailed accounting & technical audit guide.'}
          </p>
        </div>

        {/* Live Search */}
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder={lang === 'ar' ? 'بحث سريع في الإعدادات والشرح المحاسبي...' : 'Search settings and accounting guides...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>
      </div>

      <div className="settings-grid">
        {filteredCategories.map((cat) => {
          const guide = SETTINGS_EXPERT_GUIDES[cat.id];
          const isTooltipActive = activeGuideId === cat.id;

          const cardContent = (
            <div className={`card settings-card ${isTooltipActive ? 'active-card' : ''}`}>
              <div className="settings-icon">{cat.icon}</div>
              <div className="settings-label">{cat.label}</div>

              {/* The Exclamation Mark (!) Button requested by user */}
              {guide && (
                <div 
                  className="info-trigger-wrapper"
                  onMouseEnter={(e) => handleInfoMouseEnter(e, cat.id)}
                  onMouseLeave={() => handleInfoMouseLeave(cat.id)}
                  onClick={(e) => handleInfoClick(e, cat.id)}
                >
                  <button
                    type="button"
                    className={`info-exclamation-btn ${isTooltipActive ? 'is-active' : ''}`}
                    title={lang === 'ar' ? 'قف هنا لقراءة شرح وظيفة الإعداد والأثر المحاسبي' : 'Hover to see accounting and technical explanation'}
                    aria-label={lang === 'ar' ? 'شرح الإعداد' : 'Setting Explanation'}
                  >
                    <span className="exclamation-char">!</span>
                    <span className="exclamation-halo"></span>
                  </button>
                </div>
              )}

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
          );

          if (cat.action === 'modal') {
            return (
              <div key={cat.id} className="grid-item-wrapper" onClick={() => setIsZatcaModalOpen(true)}>
                {cardContent}
              </div>
            );
          }

          return (
            <Link key={cat.id} href={cat.href || '#'} className="grid-item-wrapper">
              {cardContent}
            </Link>
          );
        })}
      </div>

      {/* Floating Expert Popover Portal - Rendered at root of DOM to prevent ANY clipping */}
      {mounted && activeGuideId && currentGuide && currentCategory && popoverPos && createPortal(
        <div 
          className="expert-popover-portal"
          style={{
            position: 'fixed',
            left: `${popoverPos.left}px`,
            top: popoverPos.top !== undefined ? `${popoverPos.top}px` : undefined,
            bottom: popoverPos.bottom !== undefined ? `${popoverPos.bottom}px` : undefined,
            width: `${popoverPos.width}px`,
            zIndex: 999999,
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Arrow pointing accurately at trigger button */}
          <div 
            className={`portal-arrow ${popoverPos.isAbove ? 'arrow-down' : 'arrow-up'}`}
            style={{ left: `${popoverPos.arrowLeft}px` }}
          />

          {/* Popover Header */}
          <div className="popover-header">
            <div className="header-left">
              <span className="popover-icon">{currentCategory.icon}</span>
              <div>
                <h4 className="popover-title">{currentCategory.label}</h4>
                <span 
                  className="category-pill"
                  style={{
                    color: currentGuide.categoryBadge.color,
                    backgroundColor: currentGuide.categoryBadge.bg,
                    borderColor: currentGuide.categoryBadge.border
                  }}
                >
                  {lang === 'ar' ? currentGuide.categoryBadge.ar : currentGuide.categoryBadge.en}
                </span>
              </div>
            </div>
            <button 
              className="close-popover-btn" 
              onClick={handleCloseGuide}
              title={lang === 'ar' ? 'إغلاق' : 'Close'}
            >
              ×
            </button>
          </div>

          {/* Popover Body */}
          <div className="popover-body">
            {/* Block 1: Technical & Software Functionality */}
            <div className="guide-section">
              <div className="section-label">
                <span className="label-icon">💡</span>
                <span>{lang === 'ar' ? 'الوظيفة البرمجية والتشغيلية' : 'Software & Operational Function'}</span>
              </div>
              <p className="section-text">
                {lang === 'ar' ? currentGuide.functionality.ar : currentGuide.functionality.en}
              </p>
            </div>

            {/* Block 2: Accounting & Audit Impact */}
            <div className="guide-section">
              <div className="section-label impact-label">
                <span className="label-icon">⚖️</span>
                <span>{lang === 'ar' ? 'الأثر المحاسبي والرقابي' : 'Accounting & Audit Impact'}</span>
              </div>
              <p className="section-text impact-text">
                {lang === 'ar' ? currentGuide.accountingImpact.ar : currentGuide.accountingImpact.en}
              </p>
            </div>

            {/* Block 3: Expert Pro-Tip */}
            <div className="protip-box">
              <div className="protip-header">
                <span className="protip-star">⭐</span>
                <span className="protip-title">{lang === 'ar' ? 'نصيحة الخبير المحاسبي' : 'Accounting Pro-Tip'}</span>
              </div>
              <p className="protip-text">
                {lang === 'ar' ? currentGuide.proTip.ar : currentGuide.proTip.en}
              </p>
            </div>
          </div>

          {/* Popover Footer Hint */}
          <div className="popover-footer">
            <span className="footer-hint">
              {isPinned 
                ? (lang === 'ar' ? '📌 الشرح مثبت — اضغط على زر الإغلاق أو خارج البطاقة لإلغاء التثبيت' : '📌 Pinned — click (×) or outside to unpin')
                : (lang === 'ar' ? '💡 انقر على علامة (!) لتثبيت الشرح، أو اضغط البطاقة لفتح الإعداد' : '💡 Click (!) to pin, or click card to open')}
            </span>
          </div>
        </div>,
        document.body
      )}

      {isZatcaModalOpen && (
        <ZatcaOnboarding 
          companyId={companyId} 
          currentStatus={zatcaStatus} 
          onClose={() => setIsZatcaModalOpen(false)} 
        />
      )}

      <style jsx>{`
        .settings-module {
          position: relative;
          padding-bottom: 3rem;
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 0.25rem;
        }

        .expert-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .expert-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: pulseHalo 2s infinite;
        }

        @keyframes pulseHalo {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 320px;
          background: var(--search-bg);
          border: 1px solid var(--search-border);
          border-radius: 12px;
          padding: 0.6rem 1rem;
          gap: 0.75rem;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .search-box:focus-within {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .search-box input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 0.875rem;
          width: 100%;
        }

        .search-box input::placeholder {
          color: var(--text-secondary);
          opacity: 0.7;
        }

        .clear-search {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 1.2rem;
          line-height: 1;
          padding: 0;
        }

        .clear-search:hover {
          color: var(--text-primary);
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 1.25rem;
          position: relative;
        }

        .grid-item-wrapper {
          text-decoration: none;
          color: inherit;
          display: block;
          position: relative;
        }

        .settings-card {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 1.25rem 1.25rem;
          cursor: pointer;
          transition: all 0.25s ease;
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          position: relative;
          border-radius: 14px;
        }

        .settings-card:hover {
          background: var(--glass-hover);
          transform: translateY(-2px);
          border-color: var(--accent-primary);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        }

        .settings-card.active-card {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25), 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .settings-icon {
          font-size: 1.5rem;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--chip-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          flex-shrink: 0;
        }

        .settings-label {
          font-weight: 700;
          font-size: 0.95rem;
          flex: 1;
          line-height: 1.4;
          color: var(--text-primary);
        }

        /* The Exclamation Button (!) */
        .info-trigger-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          margin-inline-end: 2px;
          z-index: 10;
        }

        .info-exclamation-btn {
          position: relative;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid rgba(59, 130, 246, 0.4);
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: help;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
          outline: none;
        }

        .info-exclamation-btn:hover,
        .info-exclamation-btn.is-active {
          background: var(--accent-primary, #2563eb);
          color: #ffffff;
          border-color: var(--accent-primary, #2563eb);
          transform: scale(1.15);
          box-shadow: 0 0 14px var(--accent-primary, #2563eb);
        }

        .exclamation-char {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-weight: 900;
          font-size: 0.95rem;
          line-height: 1;
        }

        .exclamation-halo {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1px solid rgba(59, 130, 246, 0.3);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .info-exclamation-btn:hover .exclamation-halo {
          opacity: 1;
          animation: ringPulse 1.5s infinite;
        }

        @keyframes ringPulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        .settings-arrow {
          color: var(--text-secondary);
          opacity: 0.5;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
        }

        .settings-card:hover .settings-arrow {
          color: var(--accent-primary);
          opacity: 1;
          transform: translateX(${lang === 'ar' ? '-4px' : '4px'});
        }

        @media (max-width: 640px) {
          .settings-header {
            flex-direction: column;
            align-items: stretch;
          }
          .search-box {
            min-width: 100%;
          }
        }
      `}</style>

      {/* Global styles for portal popover to ensure pristine rendering outside card trees */}
      <style jsx global>{`
        .expert-popover-portal {
          background: rgba(9, 14, 28, 0.97);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 18px;
          padding: 1.25rem;
          box-shadow: 0 24px 60px -10px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 28px rgba(59, 130, 246, 0.2);
          animation: portalPopIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          color: #f8fafc;
          text-align: start;
          cursor: default;
          box-sizing: border-box;
          max-height: min(520px, calc(100vh - 40px));
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }

        .expert-popover-portal::-webkit-scrollbar {
          width: 5px;
        }
        .expert-popover-portal::-webkit-scrollbar-track {
          background: transparent;
        }
        .expert-popover-portal::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }

        [data-theme="pure-light"] .expert-popover-portal {
          background: rgba(255, 255, 255, 0.98);
          border-color: rgba(226, 232, 240, 0.95);
          color: #0f172a;
          box-shadow: 0 24px 50px -10px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(226, 232, 240, 0.9);
        }

        [data-theme="emerald-luxury"] .expert-popover-portal {
          background: rgba(4, 25, 18, 0.98);
          border-color: rgba(16, 185, 129, 0.35);
          box-shadow: 0 24px 60px -10px rgba(0, 0, 0, 0.85), 0 0 28px rgba(16, 185, 129, 0.25);
        }

        [data-theme="ocean-sapphire"] .expert-popover-portal {
          background: rgba(4, 18, 38, 0.98);
          border-color: rgba(56, 189, 248, 0.35);
          box-shadow: 0 24px 60px -10px rgba(0, 0, 0, 0.85), 0 0 28px rgba(56, 189, 248, 0.25);
        }

        [data-theme="royal-gold"] .expert-popover-portal {
          background: rgba(26, 28, 44, 0.98);
          border-color: rgba(234, 179, 8, 0.35);
          box-shadow: 0 24px 60px -10px rgba(0, 0, 0, 0.85), 0 0 28px rgba(234, 179, 8, 0.25);
        }

        @keyframes portalPopIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .portal-arrow {
          position: absolute;
          width: 12px;
          height: 12px;
          background: inherit;
          border-style: solid;
          border-color: inherit;
          transform: rotate(45deg);
        }

        .portal-arrow.arrow-up {
          top: -7px;
          border-width: 1px 0 0 1px;
        }

        .portal-arrow.arrow-down {
          bottom: -7px;
          border-width: 0 1px 1px 0;
        }

        .popover-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.75rem;
          padding-bottom: 0.875rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 0.875rem;
        }

        [data-theme="pure-light"] .popover-header {
          border-bottom-color: #e2e8f0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .popover-icon {
          font-size: 1.5rem;
        }

        .popover-title {
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0 0 0.25rem 0;
          color: inherit;
        }

        .category-pill {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.15rem 0.6rem;
          border-radius: 9999px;
          border: 1px solid transparent;
        }

        .close-popover-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #94a3b8;
          border-radius: 50%;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
          line-height: 1;
        }

        .close-popover-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        [data-theme="pure-light"] .close-popover-btn {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #475569;
        }

        [data-theme="pure-light"] .close-popover-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .popover-body {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .guide-section {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #93c5fd;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        [data-theme="pure-light"] .section-label {
          color: #2563eb;
        }

        .section-label.impact-label {
          color: #34d399;
        }

        [data-theme="pure-light"] .section-label.impact-label {
          color: #059669;
        }

        .label-icon {
          font-size: 0.85rem;
        }

        .section-text {
          font-size: 0.825rem;
          line-height: 1.55;
          margin: 0;
          color: #cbd5e1;
        }

        [data-theme="pure-light"] .section-text {
          color: #334155;
        }

        .impact-text {
          color: #e2e8f0;
        }

        [data-theme="pure-light"] .impact-text {
          color: #1e293b;
        }

        .protip-box {
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 12px;
          padding: 0.75rem 0.875rem;
          margin-top: 0.25rem;
        }

        [data-theme="pure-light"] .protip-box {
          background: #fffbeb;
          border-color: #fde68a;
        }

        .protip-header {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 0.25rem;
        }

        .protip-star {
          font-size: 0.85rem;
        }

        .protip-title {
          font-size: 0.75rem;
          font-weight: 800;
          color: #fbbf24;
        }

        [data-theme="pure-light"] .protip-title {
          color: #b45309;
        }

        .protip-text {
          font-size: 0.8rem;
          line-height: 1.5;
          margin: 0;
          color: #fef3c7;
        }

        [data-theme="pure-light"] .protip-text {
          color: #78350f;
        }

        .popover-footer {
          margin-top: 0.875rem;
          padding-top: 0.65rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center;
        }

        [data-theme="pure-light"] .popover-footer {
          border-top-color: #f1f5f9;
        }

        .footer-hint {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

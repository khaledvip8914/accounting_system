'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Option {
  id: string;
  sku: string;
  name: string;
  nameAr?: string;
  [key: string]: any;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  lang: string;
  disabled?: boolean;
}

export default function SearchableSelect({ options, value, onChange, placeholder, lang, disabled }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.id === value);
  
  const filteredOptions = options.filter(o => {
    const s = searchTerm.toLowerCase();
    const sku = (o.sku || '').toLowerCase();
    const name = (o.name || '').toLowerCase();
    const nameAr = (o.nameAr || '').toLowerCase();
    return (
      sku.includes(s) ||
      name.includes(s) ||
      nameAr.includes(s)
    );
  }).slice(0, 50);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="searchable-select" ref={containerRef}>
      <div 
        className={`select-trigger ${disabled ? 'disabled' : ''}`} 
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="selected-text">
          {selectedOption ? 
            `${selectedOption.sku} - ${lang === 'ar' ? (selectedOption.nameAr || selectedOption.name) : selectedOption.name}` : 
            (placeholder || (lang === 'ar' ? 'اختر...' : 'Select...'))
          }
        </span>
        <span className="chevron">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="dropdown-panel">
          <div className="search-input-wrapper">
            <input 
              type="text" 
              autoFocus
              placeholder={lang === 'ar' ? 'بحث (الاسم أو الكود)...' : 'Search (Name or SKU)...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(o => (
                <div 
                  key={o.id} 
                  className={`option-item ${value === o.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(o.id)}
                >
                  <div className="option-sku">{o.sku}</div>
                  <div className="option-name">{lang === 'ar' ? (o.nameAr || o.name) : o.name}</div>
                </div>
              ))
            ) : (
              <div className="no-results">{lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}</div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .searchable-select { position: relative; width: 100%; font-family: inherit; }
        .select-trigger { 
          display: flex; justify-content: space-between; align-items: center; 
          padding: 0.75rem 1rem; background: white; border: 1px solid #cbd5e1; 
          border-radius: 8px; cursor: pointer; transition: all 0.2s; min-height: 42px;
        }
        .select-trigger:hover { border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6; }
        .select-trigger.disabled { background: #f1f5f9; cursor: not-allowed; opacity: 0.7; }
        .selected-text { font-size: 0.9rem; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .chevron { font-size: 0.7rem; color: #64748b; }
        
        .dropdown-panel { 
          position: absolute; top: calc(100% + 4px); left: 0; right: 0; 
          background: white; border: 1px solid #e2e8f0; border-radius: 12px; 
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); z-index: 2000; overflow: hidden;
          animation: slideDown 0.2s cubic-bezier(0, 0, 0.2, 1);
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .search-input-wrapper { padding: 8px; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; background: white; z-index: 1; }
        .search-input { width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0; outline: none; font-size: 0.85rem; }
        .search-input:focus { border-color: #3b82f6; }
        
        .options-list { max-height: 250px; overflow-y: auto; }
        .option-item { 
          padding: 10px 15px; cursor: pointer; display: flex; flex-direction: column; 
          transition: background 0.1s; border-bottom: 1px solid #f8fafc;
        }
        .option-item:last-child { border-bottom: none; }
        .option-item:hover { background: #eff6ff; }
        .option-item.selected { background: #3b82f6; color: white !important; }
        .option-item.selected .option-sku, .option-item.selected .option-name { color: white !important; }
        
        .option-sku { font-size: 0.7rem; font-weight: 700; color: #64748b; margin-bottom: 2px; }
        .option-name { font-size: 0.85rem; font-weight: 500; color: #1e293b; }
        
        .no-results { padding: 20px; text-align: center; color: #94a3b8; font-size: 0.85rem; }

        /* Theme Support */
        :global(.royal-gold) .select-trigger { background: rgba(30, 41, 59, 0.4); color: #fefce8; border-color: rgba(234, 179, 8, 0.2); }
        :global(.royal-gold) .dropdown-panel { background: #1a1c2c; border-color: rgba(234, 179, 8, 0.3); }
        :global(.royal-gold) .search-input { background: #0f172a; border-color: rgba(234, 179, 8, 0.3); color: #fff; }
        :global(.royal-gold) .option-item:hover { background: rgba(234, 179, 8, 0.1); }
        :global(.royal-gold) .option-name { color: #fefce8; }
        :global(.royal-gold) .search-input-wrapper { background: #1a1c2c; }
        
        :global(.deep-night) .select-trigger { background: #111827; color: #e2e8f0; border-color: #374151; }
        :global(.deep-night) .dropdown-panel { background: #111827; border-color: #374151; }
        :global(.deep-night) .search-input { background: #030712; border-color: #374151; color: #fff; }
        :global(.deep-night) .option-item:hover { background: #1f2937; }
        :global(.deep-night) .option-name { color: #e2e8f0; }
        :global(.deep-night) .search-input-wrapper { background: #111827; }
      `}</style>
    </div>
  );
}

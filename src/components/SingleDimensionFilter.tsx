'use client';

import React, { useState, useEffect } from 'react';

interface DimensionValue {
  id: string;
  code: string;
  name: string;
  nameAr?: string;
  isActive: boolean;
}

interface AccountingDimension {
  id: string;
  name: string;
  nameAr?: string;
  isActive: boolean;
  values: DimensionValue[];
}

interface SingleDimensionFilterProps {
  lang: string;
  valueId: string;
  onChange: (valueId: string) => void;
}

export default function SingleDimensionFilter({ lang, valueId, onChange }: SingleDimensionFilterProps) {
  const [dimensions, setDimensions] = useState<AccountingDimension[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDimId, setSelectedDimId] = useState<string>('');

  useEffect(() => {
    const fetchDimensions = async () => {
      try {
        const res = await fetch('/api/v1/settings/dimensions');
        if (res.ok) {
          const data = await res.json();
          // Only keep dimensions that are active and have at least one active value
          const activeDims = data.filter((d: any) => d.isActive && d.values.some((v: any) => v.isActive));
          setDimensions(activeDims);
          
          // Auto-select dimension if we have a valueId
          if (valueId && activeDims.length > 0) {
            const foundDim = activeDims.find((d: any) => d.values.some((v: any) => v.id === valueId));
            if (foundDim) {
              setSelectedDimId(foundDim.id);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching dimensions:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDimensions();
  }, [valueId]);

  const handleDimChange = (dimId: string) => {
    setSelectedDimId(dimId);
    onChange(''); // reset value when dimension changes
  };

  const handleValChange = (valId: string) => {
    onChange(valId);
  };

  if (isLoading) return <div style={{ fontSize: '0.8rem', color: '#666' }}>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;
  if (dimensions.length === 0) return <div style={{ fontSize: '0.8rem', color: '#666' }}>{lang === 'ar' ? 'لا توجد أبعاد تحليلية' : 'No dimensions found'}</div>;

  const selectedDim = dimensions.find(d => d.id === selectedDimId);
  const activeValues = selectedDim ? selectedDim.values.filter(v => v.isActive) : [];

  const selectStyle = {
    flex: 1,
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    color: '#334155',
    fontSize: '0.85rem',
    width: '100%'
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
          {lang === 'ar' ? 'البعد التحليلي' : 'Analytical Dimension'}
        </label>
        <select
          value={selectedDimId}
          onChange={(e) => handleDimChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">{lang === 'ar' ? '--- اختر البعد ---' : '--- Select Dimension ---'}</option>
          {dimensions.map(dim => (
            <option key={dim.id} value={dim.id}>
              {lang === 'ar' ? (dim.nameAr || dim.name) : dim.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
          {lang === 'ar' ? 'القيمة' : 'Value'}
        </label>
        <select
          value={valueId}
          onChange={(e) => handleValChange(e.target.value)}
          disabled={!selectedDimId}
          style={{...selectStyle, opacity: !selectedDimId ? 0.6 : 1, cursor: !selectedDimId ? 'not-allowed' : 'default'}}
        >
          <option value="">{lang === 'ar' ? '--- اختر القيمة ---' : '--- Select Value ---'}</option>
          {activeValues.map(val => (
            <option key={val.id} value={val.id}>
              {lang === 'ar' ? (val.nameAr || val.name) : val.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

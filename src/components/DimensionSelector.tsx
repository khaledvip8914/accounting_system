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

interface SelectedDimension {
  dimensionId: string;
  valueId: string;
}

interface DimensionSelectorProps {
  companyId: string;
  lang: string;
  value: SelectedDimension[];
  onChange: (value: SelectedDimension[]) => void;
  inline?: boolean;
}

export default function DimensionSelector({ companyId, lang, value, onChange, inline = false }: DimensionSelectorProps) {
  const [dimensions, setDimensions] = useState<AccountingDimension[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDimensions = async () => {
      try {
        const url = companyId ? `/api/v1/settings/dimensions?companyId=${companyId}` : `/api/v1/settings/dimensions`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          // Only keep dimensions that are active and have at least one active value
          setDimensions(data.filter((d: any) => d.isActive && d.values.some((v: any) => v.isActive)));
        }
      } catch (err) {
        console.error('Error fetching dimensions:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDimensions();
  }, [companyId]);

  const handleAddRow = () => {
    onChange([...(value || []), { dimensionId: '', valueId: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    const newValue = [...(value || [])];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleRowChange = (index: number, field: 'dimensionId' | 'valueId', val: string) => {
    const newValue = [...(value || [])];
    newValue[index] = { ...newValue[index], [field]: val };
    
    // If they changed the dimension, reset the valueId
    if (field === 'dimensionId') {
      newValue[index].valueId = '';
    }
    
    onChange(newValue);
  };

  if (isLoading) return <div style={{ fontSize: '0.8rem', color: '#666' }}>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;
  if (dimensions.length === 0) return null;

  const rows = value || [];

  const selectStyle = {
    flex: 1,
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    color: '#334155',
    fontSize: '0.85rem'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      {rows.map((row, index) => {
        const selectedDim = dimensions.find(d => d.id === row.dimensionId);
        const activeValues = selectedDim ? selectedDim.values.filter(v => v.isActive) : [];

        // Exclude dimensions that are already selected in OTHER rows
        const availableDimensions = dimensions.filter(d => 
          d.id === row.dimensionId || !rows.some(r => r.dimensionId === d.id)
        );

        return (
          <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: inline ? 'row' : 'column', gap: inline ? '0.5rem' : '0.25rem' }}>
              <select
                value={row.dimensionId}
                onChange={(e) => handleRowChange(index, 'dimensionId', e.target.value)}
                style={selectStyle}
              >
                <option value="">{lang === 'ar' ? '--- اختر البعد ---' : '--- Select Dimension ---'}</option>
                {availableDimensions.map(dim => (
                  <option key={dim.id} value={dim.id}>
                    {lang === 'ar' ? (dim.nameAr || dim.name) : dim.name}
                  </option>
                ))}
              </select>

              <select
                value={row.valueId}
                onChange={(e) => handleRowChange(index, 'valueId', e.target.value)}
                disabled={!row.dimensionId}
                style={{ ...selectStyle, opacity: !row.dimensionId ? 0.6 : 1 }}
              >
                <option value="">{lang === 'ar' ? '--- اختر القيمة ---' : '--- Select Value ---'}</option>
                {activeValues.map(val => (
                  <option key={val.id} value={val.id}>
                    {val.code} - {lang === 'ar' ? (val.nameAr || val.name) : val.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              type="button" 
              onClick={() => handleRemoveRow(index)}
              style={{ padding: '0.5rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              title={lang === 'ar' ? 'حذف' : 'Remove'}
            >
              ✕
            </button>
          </div>
        );
      })}

      {rows.length < dimensions.length && (
        <div>
          <button 
            type="button" 
            onClick={handleAddRow}
            style={{ 
              fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'transparent', 
              border: '1px dashed #cbd5e1', borderRadius: '6px', color: '#64748b', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' 
            }}
          >
            <span>+</span> {lang === 'ar' ? 'إضافة بُعد تحليلي' : 'Add Dimension'}
          </button>
        </div>
      )}
    </div>
  );
}

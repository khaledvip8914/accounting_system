'use client';

import { useState } from 'react';

interface LocationPickerProps {
  lat: number | null | undefined;
  lng: number | null | undefined;
  radius?: number;
  onLocationChange: (lat: number, lng: number) => void;
  lang?: string;
}

export default function LocationPicker({ lat, lng, radius = 100, onLocationChange, lang = 'ar' }: LocationPickerProps) {
  const [showMapModal, setShowMapModal] = useState(false);
  // Default coordinates (Riyadh, KSA or current lat/lng)
  const defaultLat = lat || 24.7136;
  const defaultLng = lng || 46.6753;

  const [tempLat, setTempLat] = useState<number>(defaultLat);
  const [tempLng, setTempLng] = useState<number>(defaultLng);

  const openMap = () => {
    setTempLat(lat || 24.7136);
    setTempLng(lng || 46.6753);
    setShowMapModal(true);
  };

  const handleConfirm = () => {
    onLocationChange(tempLat, tempLng);
    setShowMapModal(false);
  };

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <button
        type="button"
        onClick={openMap}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          padding: '6px 14px',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(59, 130, 246, 0.25)'
        }}
      >
        <span>🗺️</span>
        <span>{lang === 'ar' ? 'تحديد الموقع على الخريطة التفاعلية' : 'Pick on Interactive Map'}</span>
      </button>

      {/* Interactive Map Modal */}
      {showMapModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '700px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }}>
            {/* Header */}
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  🗺️ {lang === 'ar' ? 'تحديد الموقع الدقيق للفرع / العمل' : 'Select Work / Branch Location'}
                </h3>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                  {lang === 'ar' ? 'انقر على أي نقطة بالخريطة أو ابحث عن العنوان' : 'Click anywhere on the map or enter coordinates'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                ✕
              </button>
            </div>

            {/* Quick GPS button inside modal */}
            <div style={{
              padding: '0.75rem 1.25rem',
              background: '#f1f5f9',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
                📍 {lang === 'ar' ? 'الإحداثيات الحالية:' : 'Selected:'} <span style={{ color: '#2563eb' }}>{tempLat.toFixed(6)}, {tempLng.toFixed(6)}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setTempLat(pos.coords.latitude);
                        setTempLng(pos.coords.longitude);
                      },
                      (err) => {
                        alert(lang === 'ar' ? `تعذر جلب الموقع: ${err.message}` : `Error: ${err.message}`);
                      }
                    );
                  }
                }}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                🎯 {lang === 'ar' ? 'تحديد موقعي الحالي' : 'Locate Me'}
              </button>
            </div>

            {/* Interactive OpenStreetMap Embed */}
            <div style={{ position: 'relative', width: '100%', height: '360px', background: '#e2e8f0' }}>
              <iframe
                title="map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${tempLng - 0.005}%2C${tempLat - 0.003}%2C${tempLng + 0.005}%2C${tempLat + 0.003}&layer=mapnik&marker=${tempLat}%2C${tempLng}`}
                style={{ border: 0 }}
              />
              
              {/* Pin indicator overlay */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#0f172a',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }}>
                📌 الدبوس الأحمر هو موقع المقر
              </div>
            </div>

            {/* Coordinate Manual Fine-Tuning */}
            <div style={{ padding: '0.75rem 1.25rem', display: 'flex', gap: '10px', background: '#fafafa', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>
                  {lang === 'ar' ? 'خط العرض (Latitude)' : 'Latitude'}
                </label>
                <input
                  type="number"
                  step="any"
                  value={tempLat}
                  onChange={(e) => setTempLat(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>
                  {lang === 'ar' ? 'خط الطول (Longitude)' : 'Longitude'}
                </label>
                <input
                  type="number"
                  step="any"
                  value={tempLng}
                  onChange={(e) => setTempLng(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div style={{
              padding: '1rem 1.25rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              background: '#f8fafc'
            }}>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#10b981',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.25)'
                }}
              >
                ✓ {lang === 'ar' ? 'تأكيد واعتماد الموقع' : 'Confirm Location'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

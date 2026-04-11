'use client';

import { useState } from 'react';

export default function WarehouseList({ warehouses, lang }: { warehouses: any[], lang: string }) {
  return (
    <div className="warehouse-list-module">
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">{lang === 'ar' ? 'المستودعات والمخازن' : 'Warehouses & Storage'}</h2>
          <button className="btn-primary no-print" style={{ background: '#7c3aed' }}>
            {lang === 'ar' ? '+ مستودع جديد' : '+ New Warehouse'}
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{lang === 'ar' ? 'الكود' : 'Code'}</th>
                <th>{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                <th>{lang === 'ar' ? 'الموقع' : 'Location'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'عدد الأصناف' : 'Total Items'}</th>
                <th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map(w => (
                <tr key={w.id}>
                  <td><span className="badge" style={{ background: '#ede9fe', color: '#6d28d9' }}>{w.code}</span></td>
                  <td><strong>{lang === 'ar' && w.nameAr ? w.nameAr : w.name}</strong></td>
                  <td className="text-secondary">{w.location || '-'}</td>
                  <td style={{ textAlign: 'center' }}>{w.stockItems?.length || 0}</td>
                  <td className="no-print">
                     <button className="btn-text">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

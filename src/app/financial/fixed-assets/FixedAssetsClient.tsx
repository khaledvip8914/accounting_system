'use client';

import { useState } from 'react';
import { Lang, getDictionary } from '@/lib/i18n';
import { createFixedAsset, updateFixedAsset, deleteFixedAsset, runDepreciation } from './actions';

export default function FixedAssetsClient({ lang, initialAssets }: { lang: Lang, initialAssets: any[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [showModal, setShowModal] = useState(false);
  const [showDepreciationModal, setShowDepreciationModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const dict = getDictionary(lang);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    nameAr: '',
    description: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: 0,
    salvageValue: 0,
    usefulLifeYears: 1,
    depreciationMethod: 'Straight Line'
  });

  const [depreciationData, setDepreciationData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0
  });

  const openNew = () => {
    setEditingAsset(null);
    setFormData({
      code: `FA-${new Date().getFullYear()}-${Math.floor(Math.random()*1000).toString().padStart(3, '0')}`,
      name: '',
      nameAr: '',
      description: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasePrice: 0,
      salvageValue: 0,
      usefulLifeYears: 1,
      depreciationMethod: 'Straight Line'
    });
    setShowModal(true);
  };

  const openEdit = (asset: any) => {
    setEditingAsset(asset);
    setFormData({
      code: asset.code,
      name: asset.name,
      nameAr: asset.nameAr || '',
      description: asset.description || '',
      purchaseDate: new Date(asset.purchaseDate).toISOString().split('T')[0],
      purchasePrice: asset.purchasePrice,
      salvageValue: asset.salvageValue,
      usefulLifeYears: asset.usefulLifeYears,
      depreciationMethod: asset.depreciationMethod
    });
    setShowModal(true);
  };

  const openDepreciation = (asset: any) => {
    setSelectedAsset(asset);
    
    // Auto calculate Straight Line monthly amount
    let monthlyAmount = 0;
    if (asset.depreciationMethod === 'Straight Line' && asset.usefulLifeYears > 0) {
      const depreciableCost = asset.purchasePrice - asset.salvageValue;
      monthlyAmount = depreciableCost / (asset.usefulLifeYears * 12);
    }
    
    setDepreciationData({
      date: new Date().toISOString().split('T')[0],
      amount: Math.round(monthlyAmount * 100) / 100
    });
    setShowDepreciationModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let res;
    if (editingAsset) {
      res = await updateFixedAsset(editingAsset.id, formData);
    } else {
      res = await createFixedAsset(formData);
    }

    if (res.success) {
      if (editingAsset) {
        setAssets(assets.map(a => a.id === editingAsset.id ? res.asset : a));
      } else {
        setAssets([res.asset, ...assets]);
      }
      setShowModal(false);
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا الأصل؟' : 'Are you sure you want to delete this asset?')) return;
    const res = await deleteFixedAsset(id);
    if (res.success) {
      setAssets(assets.filter(a => a.id !== id));
    } else {
      alert(res.error);
    }
  };

  const handleRunDepreciation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    const res = await runDepreciation(selectedAsset.id, depreciationData.amount, depreciationData.date);
    if (res.success) {
      setAssets(assets.map(a => {
        if (a.id === selectedAsset.id) {
          return {
            ...a,
            accumulatedDepreciation: a.accumulatedDepreciation + depreciationData.amount,
            netBookValue: a.netBookValue - depreciationData.amount
          };
        }
        return a;
      }));
      setShowDepreciationModal(false);
    } else {
      alert(res.error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'الأصول الثابتة' : 'Fixed Assets'}</h1>
        <button onClick={openNew} className="btn-primary">
          {lang === 'ar' ? '+ إضافة أصل' : '+ Add Asset'}
        </button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'الكود' : 'Code'}</th>
              <th>{lang === 'ar' ? 'اسم الأصل' : 'Asset Name'}</th>
              <th>{lang === 'ar' ? 'تاريخ الشراء' : 'Purchase Date'}</th>
              <th>{lang === 'ar' ? 'القيمة الشرائية' : 'Purchase Price'}</th>
              <th>{lang === 'ar' ? 'مجمع الإهلاك' : 'Acc. Depreciation'}</th>
              <th>{lang === 'ar' ? 'القيمة الدفترية' : 'Net Book Value'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(asset => (
              <tr key={asset.id}>
                <td><span className="badge">{asset.code}</span></td>
                <td style={{ fontWeight: 600 }}>{lang === 'ar' && asset.nameAr ? asset.nameAr : asset.name}</td>
                <td>{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                <td>{asset.purchasePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td style={{ color: '#ef4444' }}>{asset.accumulatedDepreciation.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td style={{ fontWeight: 'bold', color: '#059669' }}>{asset.netBookValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td>{asset.status === 'Active' ? (lang === 'ar' ? 'نشط' : 'Active') : asset.status}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openDepreciation(asset)} title={lang === 'ar' ? 'إهلاك' : 'Depreciate'} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}>
                      📉
                    </button>
                    <button onClick={() => openEdit(asset)} title={lang === 'ar' ? 'تعديل' : 'Edit'} style={{ background: '#f1f5f9', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}>✏️</button>
                    <button onClick={() => handleDelete(asset.id)} title={lang === 'ar' ? 'حذف' : 'Delete'} style={{ background: '#fee2e2', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
            {assets.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  {lang === 'ar' ? 'لا توجد أصول ثابتة' : 'No fixed assets found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingAsset ? (lang === 'ar' ? 'تعديل أصل' : 'Edit Asset') : (lang === 'ar' ? 'أصل جديد' : 'New Asset')}</h2>
            <form onSubmit={handleSave} className="form-grid">
              <div className="form-group">
                <label>{lang === 'ar' ? 'كود الأصل' : 'Asset Code'}</label>
                <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required disabled={!!editingAsset} />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'الاسم' : 'Name'} (EN)</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'الاسم' : 'Name'} (AR)</label>
                <input type="text" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'تاريخ الشراء' : 'Purchase Date'}</label>
                <input type="date" value={formData.purchaseDate} onChange={e => setFormData({...formData, purchaseDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'القيمة الشرائية' : 'Purchase Price'}</label>
                <input type="number" step="0.01" min="0" value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: parseFloat(e.target.value) || 0})} required disabled={!!editingAsset} />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'القيمة التخريدية' : 'Salvage Value'}</label>
                <input type="number" step="0.01" min="0" value={formData.salvageValue} onChange={e => setFormData({...formData, salvageValue: parseFloat(e.target.value) || 0})} disabled={!!editingAsset} />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'العمر الافتراضي (سنوات)' : 'Useful Life (Years)'}</label>
                <input type="number" step="0.5" min="0" value={formData.usefulLifeYears} onChange={e => setFormData({...formData, usefulLifeYears: parseFloat(e.target.value) || 0})} required />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'طريقة الإهلاك' : 'Depreciation Method'}</label>
                <select value={formData.depreciationMethod} onChange={e => setFormData({...formData, depreciationMethod: e.target.value})}>
                  <option value="Straight Line">{lang === 'ar' ? 'القسط الثابت' : 'Straight Line'}</option>
                  <option value="Declining Balance">{lang === 'ar' ? 'القسط المتناقص' : 'Declining Balance'}</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>{lang === 'ar' ? 'الوصف' : 'Description'}</label>
                <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="modal-actions" style={{ gridColumn: '1 / -1' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary">{lang === 'ar' ? 'حفظ' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDepreciationModal && selectedAsset && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <h2>{lang === 'ar' ? 'إهلاك أصل' : 'Depreciate Asset'}</h2>
            <div style={{ marginBottom: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>{lang === 'ar' ? selectedAsset.nameAr || selectedAsset.name : selectedAsset.name}</p>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748b' }}>
                {lang === 'ar' ? 'القيمة الدفترية الحالية:' : 'Current Net Book Value:'} <span style={{ fontWeight: 'bold', color: '#059669' }}>{selectedAsset.netBookValue.toLocaleString()}</span>
              </p>
            </div>
            <form onSubmit={handleRunDepreciation}>
              <div className="form-group">
                <label>{lang === 'ar' ? 'تاريخ التسجيل' : 'Date'}</label>
                <input type="date" value={depreciationData.date} onChange={e => setDepreciationData({...depreciationData, date: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'مبلغ الإهلاك' : 'Depreciation Amount'}</label>
                <input type="number" step="0.01" min="0.01" max={selectedAsset.netBookValue - selectedAsset.salvageValue} value={depreciationData.amount} onChange={e => setDepreciationData({...depreciationData, amount: parseFloat(e.target.value) || 0})} required />
                <small style={{ color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
                  {lang === 'ar' ? 'الحد الأقصى المسموح:' : 'Max allowed:'} {(selectedAsset.netBookValue - selectedAsset.salvageValue).toLocaleString()}
                </small>
              </div>
              <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowDepreciationModal(false)} className="btn-secondary">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary" style={{ background: '#2563eb' }}>{lang === 'ar' ? 'تسجيل الإهلاك' : 'Record Depreciation'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { background: #f8fafc; padding: 1rem; text-align: start; font-size: 0.875rem; color: #475569; font-weight: 600; border-bottom: 1px solid #e2e8f0; }
        .data-table td { padding: 1rem; border-bottom: 1px solid #e2e8f0; font-size: 0.875rem; color: #1e293b; }
        .badge { background: #f1f5f9; padding: 0.25rem 0.5rem; border-radius: 6px; font-weight: 600; font-size: 0.75rem; color: #475569; border: 1px solid #cbd5e1; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; }
        .modal-content { background: white; padding: 2rem; border-radius: 12px; width: 100%; max-width: 600px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.875rem; color: #475569; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; transition: all 0.2s; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
        
        .btn-primary { background: #059669; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #047857; }
        .btn-secondary { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-secondary:hover { background: #e2e8f0; }
      `}</style>
    </div>
  );
}

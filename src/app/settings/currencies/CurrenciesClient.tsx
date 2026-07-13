'use client';

import { useState } from 'react';
import { Lang } from '@/lib/i18n';
import { saveCurrency, deleteCurrency } from './actions';

export default function CurrenciesClient({ initialCurrencies, lang, dict }: any) {
  const [currencies, setCurrencies] = useState(initialCurrencies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    nameAr: '',
    exchangeRate: '1.0',
    isDefault: false
  });

  const openModal = (currency?: any) => {
    if (currency) {
      setEditingCurrency(currency);
      setFormData({
        code: currency.code,
        name: currency.name,
        nameAr: currency.nameAr || '',
        exchangeRate: currency.exchangeRate.toString(),
        isDefault: currency.isDefault
      });
    } else {
      setEditingCurrency(null);
      setFormData({
        code: '',
        name: '',
        nameAr: '',
        exchangeRate: '1.0',
        isDefault: currencies.length === 0
      });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await saveCurrency({ ...formData, id: editingCurrency?.id });
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return;
    try {
      await deleteCurrency(id);
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{dict.settings.currencies}</h1>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          {lang === 'ar' ? 'إضافة عملة' : 'Add Currency'}
        </button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'الرمز' : 'Code'}</th>
              <th>{lang === 'ar' ? 'الاسم' : 'Name'}</th>
              <th>{lang === 'ar' ? 'سعر الصرف' : 'Exchange Rate'}</th>
              <th>{lang === 'ar' ? 'الافتراضية' : 'Default'}</th>
              <th className="actions-cell"></th>
            </tr>
          </thead>
          <tbody>
            {currencies.map((currency: any) => (
              <tr key={currency.id}>
                <td>{currency.code}</td>
                <td>{lang === 'ar' ? currency.nameAr || currency.name : currency.name}</td>
                <td>{currency.exchangeRate}</td>
                <td>
                  {currency.isDefault && (
                    <span className="badge bg-green-100 text-green-800">
                      {lang === 'ar' ? 'نعم' : 'Yes'}
                    </span>
                  )}
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button className="icon-btn edit" onClick={() => openModal(currency)}>✏️</button>
                    {!currency.isDefault && (
                      <button className="icon-btn delete" onClick={() => handleDelete(currency.id)}>🗑️</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {currencies.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-state text-center">
                  {lang === 'ar' ? 'لا توجد عملات مضافة' : 'No currencies added'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCurrency ? (lang === 'ar' ? 'تعديل عملة' : 'Edit Currency') : (lang === 'ar' ? 'إضافة عملة' : 'Add Currency')}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              {error && <div className="error-message mb-4 text-red-500">{error}</div>}
              
              <div className="form-group mb-4">
                <label>{lang === 'ar' ? 'رمز العملة (مثال: SAR)' : 'Currency Code (e.g. USD)'}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label>{lang === 'ar' ? 'الاسم بالإنجليزية' : 'Name (English)'}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label>{lang === 'ar' ? 'الاسم بالعربية' : 'Name (Arabic)'}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.nameAr}
                  onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                />
              </div>

              <div className="form-group mb-4">
                <label>{lang === 'ar' ? 'سعر الصرف (مقابل العملة الأساسية)' : 'Exchange Rate (vs Base Currency)'}</label>
                <input 
                  type="number" 
                  step="0.000001"
                  min="0.000001"
                  className="form-control" 
                  value={formData.exchangeRate}
                  onChange={(e) => setFormData({...formData, exchangeRate: e.target.value})}
                  required
                />
              </div>

              <div className="form-group mb-4 checkbox-group flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                />
                <label htmlFor="isDefault">{lang === 'ar' ? 'تعيين كعملة أساسية افتراضية' : 'Set as default base currency'}</label>
              </div>

              <div className="form-actions mt-6 flex justify-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? '...' : (lang === 'ar' ? 'حفظ' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

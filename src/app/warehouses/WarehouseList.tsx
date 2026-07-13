'use client';

import { useState } from 'react';
import { createWarehouse, updateWarehouse, deleteWarehouse } from './actions';
import { useRouter } from 'next/navigation';

export default function WarehouseList({ warehouses, lang }: { warehouses: any[], lang: string }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    nameAr: '',
    location: ''
  });

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ code: '', name: '', nameAr: '', location: '' });
    setShowModal(true);
  };

  const openEdit = (w: any) => {
    setEditingItem(w);
    setFormData({
      code: w.code || '',
      name: w.name || '',
      nameAr: w.nameAr || '',
      location: w.location || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let res;
      if (editingItem) {
        res = await updateWarehouse(editingItem.id, formData);
      } else {
        res = await createWarehouse(formData);
      }

      if (res.success) {
        setShowModal(false);
        router.refresh();
      } else {
        alert(res.error || (lang === 'ar' ? 'فشلت العملية' : 'Operation failed'));
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا المستودع؟' : 'Are you sure you want to delete this warehouse?')) {
      const res = await deleteWarehouse(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error);
      }
    }
  };

  return (
    <div className="warehouse-list-module">
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">{lang === 'ar' ? 'المستودعات والمخازن' : 'Warehouses & Storage'}</h2>
          <button className="btn-primary no-print" style={{ background: '#7c3aed' }} onClick={openAdd}>
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
                  <td className="no-print" style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn-icon" onClick={() => openEdit(w)}>✏️</button>
                        <button className="btn-icon delete" onClick={() => handleDelete(w.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {warehouses.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    {lang === 'ar' ? 'لا توجد مستودعات حتى الآن' : 'No warehouses found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px', width: '95%' }}>
            <div className="modal-header">
              <h3>{editingItem ? (lang === 'ar' ? 'تعديل مستودع' : 'Edit Warehouse') : (lang === 'ar' ? 'مستودع جديد' : 'New Warehouse')}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'كود المستودع (اتركه فارغاً للتوليد التلقائي)' : 'Warehouse Code (Leave empty to auto-generate)'}</label>
                  <input 
                    type="text" 
                    value={formData.code} 
                    onChange={e => setFormData({ ...formData, code: e.target.value })} 
                    style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    disabled={!!editingItem}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'اسم المستودع بالعربية' : 'Warehouse Name (AR)'}</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.nameAr} 
                    onChange={e => setFormData({ ...formData, nameAr: e.target.value })} 
                    style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'اسم المستودع بالإنجليزية' : 'Warehouse Name (EN)'}</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'الموقع / العنوان' : 'Location / Address'}</label>
                  <textarea 
                    value={formData.location} 
                    onChange={e => setFormData({ ...formData, location: e.target.value })} 
                    style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '60px' }}
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
        .modal-content { background: white; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; }
        .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; }
        .btn-icon { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; color: #94a3b8; font-size: 1.1rem; }
        .btn-icon:hover { background: #f1f5f9; color: #3b82f6; }
        .btn-icon.delete:hover { color: #ef4444; background: #fef2f2; }
      `}</style>
    </div>
  );
}

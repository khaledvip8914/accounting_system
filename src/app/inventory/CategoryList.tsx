'use client';

import { useState } from 'react';
import { saveCategory, deleteCategory } from './category-actions';

export default function CategoryList({ categories, lang }: { categories: any[], lang: string }) {
  const [items, setItems] = useState(categories);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', nameAr: '' });

  const handleOpen = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, nameAr: item.nameAr || '' });
    } else {
      setEditingItem(null);
      setFormData({ name: '', nameAr: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await saveCategory({ ...formData, id: editingItem?.id });
    if (res.success) {
      if (editingItem) {
        setItems(items.map(i => i.id === res.category!.id ? res.category : i));
      } else {
        setItems([res.category, ...items]);
      }
      setShowModal(false);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من حذف القسم؟' : 'Are you sure you want to delete this category?')) {
      const res = await deleteCategory(id);
      if (res.success) {
        setItems(items.filter(i => i.id !== id));
      } else {
        alert(res.error);
      }
    }
  };

  return (
    <div className="category-list">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn-primary" onClick={() => handleOpen()}>
          {lang === 'ar' ? '+ قسم جديد' : '+ New Category'}
        </button>
      </div>

      <div className="table-container">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'الاسم' : 'Name'}</th>
              <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'الاسم (EN)' : 'Name (EN)'}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id}>
                <td>{i.nameAr || i.name}</td>
                <td>{i.name}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-icon" onClick={() => handleOpen(i)}>✏️</button>
                  <button className="btn-icon delete" onClick={() => handleDelete(i.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>{editingItem ? (lang === 'ar' ? 'تعديل قسم' : 'Edit Category') : (lang === 'ar' ? 'قسم جديد' : 'New Category')}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="form-group">
                  <label>{lang === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</label>
                  <input required value={formData.nameAr} onChange={e => setFormData({ ...formData, nameAr: e.target.value })} dir="rtl" />
                </div>
                <div className="form-group">
                  <label>{lang === 'ar' ? 'الاسم (EN)' : 'Name (EN)'}</label>
                  <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer" style={{ padding: '1rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary" disabled={loading}>
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

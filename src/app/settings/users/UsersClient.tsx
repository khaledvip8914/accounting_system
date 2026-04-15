'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lang } from '@/lib/i18n';
import { useUser } from '@/components/UserContext';
import { saveUser, deleteUser } from './actions';

export default function UsersClient({ initialUsers, roles, lang, dict }: { initialUsers: any[], roles: any[], lang: Lang, dict: any }) {
  const { canAccess } = useUser();
  const [users, setUsers] = useState(initialUsers || []);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    roleId: '',
    role: 'Accountant',
    permissions: [] as string[]
  });

  const handleOpenModal = (user: any = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({
        username: user.username,
        email: user.email || '',
        name: user.name || '',
        password: '', 
        roleId: user.roleId || '',
        role: user.role || 'Accountant',
        permissions: user.permissions ? JSON.parse(user.permissions) : []
      });
    } else {
      setFormData({
        username: '',
        email: '',
        name: '',
        password: '',
        roleId: roles[0]?.id || '',
        role: 'Accountant',
        permissions: []
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await saveUser({ 
      ...formData, 
      id: editingUser?.id,
      permissions: JSON.stringify(formData.permissions)
    });
    if (res.success && res.user) {
      if (editingUser) {
        const uId = res.user.id;
        const uData = res.user;
        setUsers(users.map((u: any) => u.id === uId ? uData : u));
      } else {
        setUsers([res.user, ...users]);
      }
      setShowModal(false);
    } else {
      setError(res.error || 'Failed to save user');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Are you sure you want to delete this user?')) return;
    
    const res = await deleteUser(id);
    if (res.success) {
      setUsers(users.filter((u: any) => u.id !== id));
    } else {
      alert(res.error);
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Admin': return { bg: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', text: lang === 'ar' ? 'المدير العام' : 'Admin' };
      case 'SiteManager': return { bg: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', text: lang === 'ar' ? 'مسؤول الموقع' : 'Site Manager' };
      case 'Accountant': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', text: lang === 'ar' ? 'محاسب' : 'Accountant' };
      case 'Employee': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', text: lang === 'ar' ? 'موظف' : 'Employee' };
      default: return { bg: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8', text: role };
    }
  };

  return (
    <div className="users-module">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/settings" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px' }}>
            {lang === 'ar' ? '← عودة' : '← Back'}
          </Link>
          <div>
            <h1 className="page-title">{lang === 'ar' ? 'إدارة المستخدمين' : 'Users Management'}</h1>
            <p className="page-subtitle">{lang === 'ar' ? 'إدارة الموظفين المحاسبيين وصلاحياتهم' : 'Manage accounting staff and their permissions'}</p>
          </div>
        </div>
        {canAccess('users', 'create') && (
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            {lang === 'ar' ? 'إضافة مستخدم جديد +' : 'Add New User +'}
          </button>
        )}
      </div>

      <div className="card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>{lang === 'ar' ? 'المستخدم' : 'User'}</th>
                <th>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                <th>{lang === 'ar' ? 'الدور' : 'Role'}</th>
                <th>{lang === 'ar' ? 'تاريخ الإنشاء' : 'Joined'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => {
                const badge = getRoleBadgeStyle(user.role);
                return (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar-small">{user.name ? user.name[0].toUpperCase() : 'U'}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{user.name || user.username}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email || '-'}</td>
                    <td>
                      <span className="badge" style={{ background: user.role === 'Admin' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(56, 189, 248, 0.1)', color: user.role === 'Admin' ? '#6366f1' : '#38bdf8' }}>
                         {user.roleRef?.name || user.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }} suppressHydrationWarning>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-row" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        {canAccess('users', 'edit') && (
                          <button className="icon-btn edit" onClick={() => handleOpenModal(user)} title="Edit">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                        )}
                        {canAccess('users', 'delete') && (
                          <button className="icon-btn delete" onClick={() => handleDelete(user.id)} title="Delete" disabled={user.username === 'admin' || user.username === 'master'}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '500px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="modal-header">
              <h3>{editingUser ? (lang === 'ar' ? 'تعديل مستخدم' : 'Edit User') : (lang === 'ar' ? 'إضافة مستخدم جديد' : 'New User')}</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowModal(false)}
              >&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="user-form" style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, padding: '1.5rem' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label>{lang === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    placeholder={lang === 'ar' ? 'مثال: ahmed_acc' : 'e.g. jdoe'}
                    required
                    disabled={editingUser && editingUser.username === 'admin'}
                  />
                </div>
                <div className="form-group">
                  <label>{lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder={lang === 'ar' ? 'أدخل الاسم الثلاثي' : 'Enter full name'}
                  />
                </div>
                <div className="form-group">
                  <label>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="name@company.com"
                  />
                </div>
                <div className="form-group">
                  <label>{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    placeholder={editingUser ? (lang === 'ar' ? 'اتركها فارغة للمحافظة على الحالية' : 'Leave blank to keep current') : '••••••••'}
                    required={!editingUser}
                  />
                </div>
                <div className="form-group">
                  <label>{lang === 'ar' ? 'صلاحيات الدور الوظيفي' : 'Role Permissions'}</label>
                  <select 
                    value={formData.roleId}
                    onChange={e => setFormData({...formData, roleId: e.target.value})}
                    disabled={editingUser && editingUser.username === 'admin'}
                    required
                  >
                    <option value="">{lang === 'ar' ? '-- اختر الدور --' : '-- Select Role --'}</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>


              {error && <div className="error-msg">{error}</div>}

              <div className="modal-footer" style={{ 
                position: 'sticky', 
                bottom: '-1.5rem', 
                background: 'var(--card-bg)', 
                padding: '1rem 0',
                borderTop: '1px solid var(--glass-border)',
                zIndex: 10,
                marginTop: '1.5rem'
              }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ البيانات' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .users-module { padding: 1rem; }
        .avatar-small {
          width: 36px; height: 36px; border-radius: 50%; background: var(--accent-primary);
          display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;
        }
        .icon-btn {
          width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--glass-border);
          background: var(--glass-bg); color: var(--text-secondary); cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .icon-btn:hover:not(:disabled) { background: rgba(255,255,255,0.08); color: var(--text-primary); transform: translateY(-2px); }
        .icon-btn.delete:hover:not(:disabled) { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }
        .icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        
        .user-form { padding-top: 1rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .form-grid { display: flex; flex-direction: column; gap: 1rem; }
        .error-msg { color: #f87171; background: rgba(248, 113, 113, 0.1); padding: 0.75rem; border-radius: 8px; font-size: 0.85rem; }
        
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .modal-content { width: 90%; animation: modalEnter 0.3s ease; border: 1px solid var(--glass-border); }
        @keyframes modalEnter { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
        .close-btn { background: none; border: none; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer; }
        
        .permissions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .permission-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; cursor: pointer; color: var(--text-primary); }
        .permission-item input { width: auto; }
      `}</style>
    </div>
  );
}

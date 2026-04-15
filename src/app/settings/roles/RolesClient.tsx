'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createRole, updateRole, deleteRole } from './actions';
import { Module, Action, ACTIONS, MODULES, MODULE_GROUPS } from '@/lib/permissions';

interface Role {
  id: string;
  name: string;
  permissions: string; // JSON
  _count?: { users: number };
}

export default function RolesClient({ initialRoles, lang, dict }: { initialRoles: Role[], lang: string, dict: any }) {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState<any>({});

  const openAdd = () => {
    setEditingRole(null);
    setName('');
    setPermissions({});
    setShowModal(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setName(role.name);
    try {
      setPermissions(JSON.parse(role.permissions || '{}'));
    } catch {
      setPermissions({});
    }
    setShowModal(true);
  };

  const selectAllPermissions = (checked: boolean) => {
    if (checked) {
      const all: any = {};
      MODULES.forEach(m => {
        all[m] = [...ACTIONS];
      });
      setPermissions(all);
    } else {
      setPermissions({});
    }
  };

  const togglePermission = (module: string, action: string) => {
    const newPerms = { ...permissions };
    if (!newPerms[module]) newPerms[module] = [];
    
    const idx = newPerms[module].indexOf(action);
    if (idx > -1) {
      newPerms[module].splice(idx, 1);
    } else {
      newPerms[module].push(action);
    }
    setPermissions(newPerms);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const permsString = JSON.stringify(permissions);
    
    let res;
    if (editingRole) {
      res = await updateRole(editingRole.id, name, permsString);
    } else {
      res = await createRole(name, permsString);
    }

    if (res.success) {
      window.location.reload(); // Simple sync
    } else {
      alert(res.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا الدور؟' : 'Are you sure you want to delete this role?')) {
      const res = await deleteRole(id);
      if (res.success) window.location.reload();
      else alert(res.error);
    }
  };

  return (
    <div className="roles-container">
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/settings" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px', fontSize: '0.85rem' }}>
              {lang === 'ar' ? '← عودة' : '← Back'}
            </Link>
            <h2 className="card-title">{lang === 'ar' ? 'إدارة الأدوار والصلاحيات' : 'Role & Permission Management'}</h2>
          </div>
          <button className="btn-primary" onClick={openAdd}>
            {lang === 'ar' ? '+ إضافة دور جديد' : '+ Add New Role'}
          </button>
        </div>

        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'اسم الدور' : 'Role Name'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'عدد المستخدمين' : 'Users Count'}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {roles.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: '500' }}>{r.name}</td>
                  <td style={{ textAlign: 'center' }}>{r._count?.users || 0}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn-icon" onClick={() => openEdit(r)}>✏️</button>
                      <button className="btn-icon delete" onClick={() => handleDelete(r.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="modal-header">
              <h3>{editingRole ? (lang === 'ar' ? 'تعديل الدور' : 'Edit Role') : (lang === 'ar' ? 'إضافة دور جديد' : 'New Role')}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              <div className="form-group">
                <label>{lang === 'ar' ? 'اسم الدور' : 'Role Name'}</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  className="form-input"
                  placeholder={lang === 'ar' ? 'مثال: محاسب، مدير مبيعات...' : 'e.g. Accountant, Sales Manager'}
                />
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '1rem', 
                background: 'rgba(59, 130, 246, 0.05)', 
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <span style={{ fontWeight: '600', color: '#60a5fa' }}>
                  {lang === 'ar' ? 'تحديد كافة الصلاحيات' : 'Select All Permissions'}
                </span>
                <input 
                  type="checkbox" 
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  onChange={(e) => selectAllPermissions(e.target.checked)}
                  checked={Object.keys(permissions).length === MODULES.length && Object.values(permissions).every((a: any) => a.length === ACTIONS.length)}
                />
              </div>

              <div className="permissions-groups-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {MODULE_GROUPS.map(group => (
                  <div key={group.name} className="permission-group-section">
                    <h4 style={{ 
                      padding: '0.5rem 1rem', 
                      background: 'rgba(59, 130, 246, 0.1)', 
                      borderRadius: '8px', 
                      color: '#60a5fa',
                      marginBottom: '1rem',
                      fontSize: '1rem',
                      borderLeft: lang === 'ar' ? 'none' : '4px solid #3b82f6',
                      borderRight: lang === 'ar' ? '4px solid #3b82f6' : 'none'
                    }}>
                      {lang === 'ar' ? group.nameAr : group.name}
                    </h4>
                    <div className="permissions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      {group.modules.map(module => (
                        <div key={module} className="permission-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                          <h5 style={{ marginBottom: '0.8rem', color: '#94a3b8', textTransform: 'capitalize', fontSize: '0.9rem' }}>{module}</h5>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {ACTIONS.map(action => (
                              <label key={action} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                <input 
                                  type="checkbox" 
                                  checked={permissions[module]?.includes(action)} 
                                  onChange={() => togglePermission(module, action)}
                                />
                                <span style={{ textTransform: 'capitalize' }}>
                                  {lang === 'ar' ? (
                                    action === 'view' ? 'عرض' :
                                    action === 'create' ? 'إضافة' :
                                    action === 'edit' ? 'تعديل' :
                                    action === 'delete' ? 'حذف' : action
                                  ) : action}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginTop: '1rem', 
                position: 'sticky', 
                bottom: '-1.5rem', // Offset the padding
                background: 'var(--card-bg)', 
                padding: '1rem 0',
                borderTop: '1px solid var(--glass-border)',
                zIndex: 10
              }}>
                <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ flex: 1 }}>
                  {isSubmitting ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .roles-container { padding: 1rem; }
        .permission-card:hover { border-color: #3b82f6; transition: 0.3s; }
      `}</style>
    </div>
  );
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCompany, updateCompany, resendWelcomeEmail, deleteCompany } from './actions'

export default function CompaniesClient({ initialCompanies, subscriptionPlans = [] }: { initialCompanies: any[], subscriptionPlans?: any[] }) {
  const [companies, setCompanies] = useState(initialCompanies)
  const [searchQuery, setSearchQuery] = useState('')
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [notification, setNotification] = useState<{message: string, type: 'error' | 'success'} | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [companyToDelete, setCompanyToDelete] = useState<any>(null)

  const filteredCompanies = companies.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = c.name?.toLowerCase().includes(q);
    const idMatch = c.id?.toLowerCase().includes(q);
    const emailMatch = c.users?.[0]?.email?.toLowerCase().includes(q);
    return nameMatch || idMatch || emailMatch;
  });
  
  const [formData, setFormData] = useState({
    name: '',
    customId: '', // Added for company code
    email: '',
    username: '', // New field
    password: '',
    address: '',
    phone: '',
    subscriptionStatus: 'Active',
    subscriptionDays: 30,
    subscriptionEndsAt: '',
    subscriptionPlanId: subscriptionPlans.length > 0 ? subscriptionPlans[0].id : '',
    sendEmail: true
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (editingCompany) {
        // Calculate new end date based on the absolute date input
        let endsAt = editingCompany.subscriptionEndsAt;
        if (formData.subscriptionEndsAt) {
          endsAt = new Date(formData.subscriptionEndsAt).toISOString();
        } else if (!formData.subscriptionEndsAt && endsAt) {
          endsAt = null; // if they cleared the date
        }

        const res = await updateCompany(editingCompany.id, {
          name: formData.name,
          email: formData.email,
          username: formData.username,
          phone: formData.phone,
          password: formData.password,
          subscriptionStatus: formData.subscriptionStatus,
          subscriptionEndsAt: endsAt,
          subscriptionPlanId: formData.subscriptionPlanId || undefined,
          sendEmail: formData.sendEmail
        })

        if (!res.success) throw new Error(res.error)
      } else {
        const endsAt = new Date();
        if (formData.subscriptionDays > 0) {
           endsAt.setDate(endsAt.getDate() + Number(formData.subscriptionDays));
        }
        const res = await createCompany({
          ...formData,
          subscriptionEndsAt: formData.subscriptionDays > 0 ? endsAt.toISOString() : null,
          subscriptionPlanId: formData.subscriptionPlanId || undefined
        })
        if (!res.success) throw new Error(res.error)
      }
      setNotification({ message: 'تم حفظ البيانات بنجاح', type: 'success' })
      setTimeout(() => window.location.reload(), 1500)
    } catch (error: any) {
      console.error(error)
      setNotification({ message: error.message || 'حدث خطأ أثناء حفظ البيانات', type: 'error' })
      setIsLoading(false)
    }
  }

  const handleResendEmail = async (companyId: string) => {
    if (confirm('هل أنت متأكد من رغبتك في إعادة إرسال بطاقة الدخول للعميل؟ (سيتم إرسال رسالة بكلمة مرور مخفية)')) {
      setSendingEmailId(companyId)
      try {
        const res = await resendWelcomeEmail(companyId)
        if (res.success) {
          setNotification({ message: 'تم إرسال بطاقة الدخول للعميل بنجاح.', type: 'success' })
        } else {
          setNotification({ message: 'فشل الإرسال: ' + res.error, type: 'error' })
        }
      } catch (err) {
        setNotification({ message: 'حدث خطأ أثناء الاتصال.', type: 'error' })
      } finally {
        setSendingEmailId(null)
      }
    }
  }

  const handleDelete = async () => {
    if (!companyToDelete) return;
    setDeletingId(companyToDelete.id);
    try {
      const res = await deleteCompany(companyToDelete.id);
      if (res.success) {
        setNotification({ message: 'تم حذف الشركة بنجاح', type: 'success' });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setNotification({ message: 'فشل الحذف: ' + res.error, type: 'error' });
      }
    } catch (err: any) {
      setNotification({ message: err.message || 'حدث خطأ أثناء الحذف', type: 'error' });
    } finally {
      setDeletingId(null);
      setCompanyToDelete(null);
    }
  }

  const openEdit = (c: any) => {
    setEditingCompany(c)
    
    // Calculate remaining days
    let days = 0;
    if (c.subscriptionEndsAt) {
      const diff = new Date(c.subscriptionEndsAt).getTime() - new Date().getTime();
      days = Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
    }

    const adminEmail = c.users?.[0]?.email || c.email || ''

    setFormData({
      name: c.name,
      customId: c.id, // For display
      email: adminEmail,
      username: c.users?.[0]?.username || '',
      password: '', // Leave blank to keep existing
      address: c.address || '',
      phone: c.phone || '',
      subscriptionDays: days,
      subscriptionEndsAt: c.subscriptionEndsAt ? new Date(new Date(c.subscriptionEndsAt).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '',
      subscriptionStatus: c.subscriptionStatus,
      subscriptionPlanId: c.subscriptionPlanId || (subscriptionPlans.length > 0 ? subscriptionPlans[0].id : ''),
      sendEmail: false
    })
    setIsModalOpen(true)
  }

  const openCreate = () => {
    setEditingCompany(null)
    setFormData({
      name: '',
      customId: '',
      email: '',
      username: '',
      password: Math.random().toString(36).slice(-8), 
      address: '',
      phone: '',
      subscriptionStatus: 'Active',
      subscriptionDays: 30,
      subscriptionEndsAt: '',
      subscriptionPlanId: subscriptionPlans.length > 0 ? subscriptionPlans[0].id : '',
      sendEmail: true
    })
    setIsModalOpen(true)
  }

  return (
    <div className="page-content" dir="rtl">
      <div className="max-w-7xl">
        {/* Header Section */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              إدارة <span className="highlight-text">المستأجرين</span>
            </h1>
            <p className="page-subtitle">نظام التحكم المركزي في الشركات والاشتراكات السحابية.</p>
          </div>
          
          <div className="header-actions-group">
            <div className="search-container">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input
                type="text"
                placeholder="بحث بالاسم، المعرف، البريد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn-primary" onClick={openCreate}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              تأسيس شركة جديدة
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <p className="stat-label">إجمالي الشركات</p>
            </div>
            <h3 className="stat-value">{companies.length}</h3>
          </div>
          <div className="stat-card" style={{'--stat-color': 'var(--accent-success)'} as React.CSSProperties}>
            <div className="stat-top">
              <p className="stat-label">الاشتراكات النشطة</p>
            </div>
            <h3 className="stat-value text-success">{companies.filter(c => c.subscriptionStatus === 'Active').length}</h3>
          </div>
          <div className="stat-card" style={{'--stat-color': 'var(--accent-danger)'} as React.CSSProperties}>
            <div className="stat-top">
              <p className="stat-label">شركات موقوفة</p>
            </div>
            <h3 className="stat-value text-danger">{companies.filter(c => c.subscriptionStatus !== 'Active').length}</h3>
          </div>
        </div>

        {/* Table Container */}
        <div className="card table-wrapper">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>الشركة</th>
                  <th>معرف النظام</th>
                  <th>البريد الإلكتروني</th>
                  <th>رقم الجوال</th>
                  <th>المستخدم / المرور</th>
                  <th>الباقة</th>
                  <th>تاريخ الانتهاء</th>
                  <th>الحالة</th>
                  <th style={{textAlign: 'center'}}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
                        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <p style={{fontWeight: 'bold'}}>لا توجد شركات تطابق عملية البحث</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredCompanies.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div className="company-info-cell">
                        <div className="company-avatar">
                          {c.name.substring(0,1)}
                        </div>
                        <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{c.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="code-badge">
                        {c.id}
                      </span>
                    </td>
                    <td dir="ltr" style={{fontFamily: 'monospace', color: 'var(--text-secondary)'}}>
                      {c.email || c.users?.[0]?.email || '---'}
                    </td>
                    <td dir="ltr" style={{fontFamily: 'monospace', color: 'var(--text-secondary)'}}>
                      {c.phone || '---'}
                    </td>
                    <td dir="ltr">
                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                        <span style={{fontWeight: 'bold'}}>{c.users?.[0]?.username || '---'}</span>
                        <span style={{fontSize: '0.75rem', color: 'var(--accent-warning)', opacity: 0.8}} title="كلمة المرور مشفرة لغايات أمنية">*** (مشفرة)</span>
                      </div>
                    </td>
                    <td>
                      <span className="plan-badge">
                        {c.subscriptionPlan?.nameAr || c.subscriptionPlan?.name || '---'}
                      </span>
                    </td>
                    <td>
                      <div>
                        {c.subscriptionEndsAt ? (
                          <span className={new Date(c.subscriptionEndsAt) < new Date() ? 'text-danger' : ''}>
                            {new Date(c.subscriptionEndsAt).toLocaleDateString('ar-EG', { year:'numeric', month:'long', day:'numeric' })}
                          </span>
                        ) : (
                          <span style={{color: 'var(--text-secondary)', fontStyle: 'italic'}}>غير محدد</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={`status ${c.subscriptionStatus === 'Active' ? 'paid' : 'unpaid'}`}>
                        {c.subscriptionStatus === 'Active' ? 'نشط' : 'موقوف'}
                      </div>
                    </td>
                    <td style={{textAlign: 'center'}}>
                      <div className="action-buttons-group">
                        <button onClick={() => openEdit(c)} className="btn-action-edit">
                          إدارة الحساب
                        </button>
                        <button 
                          onClick={() => handleResendEmail(c.id)} 
                          disabled={sendingEmailId === c.id}
                          className="btn-action-mail"
                          title="إعادة إرسال بطاقة الدخول للعميل"
                        >
                          {sendingEmailId === c.id ? '...' : <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>}
                        </button>
                        <button 
                          onClick={() => setCompanyToDelete(c)}
                          disabled={deletingId === c.id}
                          className="btn-action-delete"
                          title="حذف الشركة"
                        >
                          {deletingId === c.id ? '...' : <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Popup */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h2 className="modal-title">
                    {editingCompany ? 'تحديث بيانات الكيان' : 'تأسيس شركة جديدة'}
                  </h2>
                  <p className="modal-subtitle">أدخل البيانات المطلوبة بدقة لضمان استقرار الخدمة.</p>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="close-btn">&times;</button>
              </div>
              
              <div className="modal-body custom-scrollbar">
                <form onSubmit={handleSubmit} className="company-form">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>اسم الشركة <span className="required">*</span></label>
                      <input 
                        required 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="مثال: شركة الخليج للتجارة"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>كود الشركة (معرف النظام) {editingCompany ? '' : <span style={{color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 'normal'}}>(اختياري)</span>}</label>
                      <input 
                        type="text" 
                        value={formData.customId} 
                        onChange={e => setFormData({...formData, customId: e.target.value})} 
                        placeholder={editingCompany ? formData.customId : "اتركه فارغاً لإنشاء كود عشوائي"}
                        disabled={!!editingCompany}
                        dir="ltr"
                      />
                    </div>
                  </div>
                  
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>البريد الإلكتروني للمدير <span className="required">*</span></label>
                      <input 
                        required 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        placeholder="admin@domain.com"
                        dir="ltr"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>رقم الجوال</label>
                      <input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                        placeholder="مثال: 05xxxxxxxxx"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>اسم مستخدم المدير <span className="required">*</span></label>
                      <input 
                        required 
                        type="text" 
                        value={formData.username} 
                        onChange={e => setFormData({...formData, username: e.target.value})} 
                        placeholder="مثال: admin_khaled"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>كلمة مرور المدير {editingCompany ? '' : <span className="required">*</span>}</label>
                      <div className="password-input-wrapper">
                        <input 
                          required={!editingCompany}
                          type={showPassword ? "text" : "password"} 
                          value={formData.password} 
                          onChange={e => setFormData({...formData, password: e.target.value})} 
                          placeholder={editingCompany ? "اترك الحقل فارغاً للاحتفاظ بكلمة المرور القديمة" : "••••••••"}
                          dir="ltr"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="toggle-password-btn"
                        >
                          {showPassword ? 'إخفاء' : 'إظهار'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    {editingCompany ? (
                      <div className="form-group">
                        <label>تاريخ انتهاء الاشتراك <span className="required">*</span></label>
                        <input 
                          required 
                          type="date" 
                          value={formData.subscriptionEndsAt} 
                          onChange={e => setFormData({...formData, subscriptionEndsAt: e.target.value})} 
                          dir="ltr"
                        />
                      </div>
                    ) : (
                      <div className="form-group">
                        <label>مدة الاشتراك (بالأيام) <span className="required">*</span></label>
                        <input 
                          required 
                          type="number" 
                          value={formData.subscriptionDays} 
                          onChange={e => setFormData({...formData, subscriptionDays: parseInt(e.target.value)})} 
                          dir="ltr"
                        />
                      </div>
                    )}

                    <div className="form-group">
                      <label>حالة الحساب <span className="required">*</span></label>
                      <select 
                        value={formData.subscriptionStatus} 
                        onChange={e => setFormData({...formData, subscriptionStatus: e.target.value})} 
                      >
                        <option value="Active">نشط (متاح للدخول)</option>
                        <option value="Suspended">موقوف (محظور من الدخول)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>باقة الاشتراك <span className="required">*</span></label>
                      <select 
                        value={formData.subscriptionPlanId} 
                        onChange={e => setFormData({...formData, subscriptionPlanId: e.target.value})}
                      >
                        <option value="" disabled>اختر الباقة</option>
                        {subscriptionPlans.map(plan => (
                          <option key={plan.id} value={plan.id}>{plan.nameAr || plan.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="notification-toggle" onClick={() => setFormData({...formData, sendEmail: !formData.sendEmail})}>
                    <input type="checkbox" checked={formData.sendEmail} readOnly />
                    <div>
                      <p className="toggle-title">تفعيل الإشعارات الترحيبية</p>
                      <p className="toggle-subtitle">سيتم إرسال بطاقة الدخول للعميل فوراً عبر البريد الإلكتروني.</p>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>إلغاء</button>
                    <button type="submit" className="btn-submit" disabled={isLoading}>
                      {isLoading ? 'جاري الحفظ...' : 'حفظ كافة التغييرات'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {companyToDelete && (
          <div className="modal-overlay delete-modal-overlay">
            <div className="delete-modal-content">
              <div className="delete-modal-accent"></div>
              <h3 className="delete-modal-title">
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                تأكيد الحذف
              </h3>
              <p className="delete-modal-desc">
                هل أنت متأكد من رغبتك في حذف شركة <strong>{companyToDelete.name}</strong>؟ لا يمكن التراجع عن هذا الإجراء وسيتم مسح جميع المستخدمين والحركات التابعة لها.
              </p>
              <div className="delete-modal-actions">
                <button onClick={() => setCompanyToDelete(null)} className="btn-delete-cancel">إلغاء</button>
                <button onClick={handleDelete} disabled={deletingId === companyToDelete.id} className="btn-delete-confirm">
                  {deletingId === companyToDelete.id ? 'جاري الحذف...' : 'نعم، احذف الشركة'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {notification && (
          <div className="toast-notification">
            <div className={`toast-content ${notification.type}`}>
              <div className="toast-icon">
                {notification.type === 'success' ? (
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                )}
              </div>
              <div className="toast-text">
                <h4>{notification.type === 'success' ? 'عملية ناجحة' : 'تنبيه'}</h4>
                <p>{notification.message}</p>
              </div>
              <button onClick={() => setNotification(null)} className="toast-close">&times;</button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .max-w-7xl {
          max-width: 100%;
          margin: 0 auto;
          width: 100%;
        }
        
        table th, table td {
          white-space: nowrap;
          font-size: 0.95rem;
        }

        .company-info-cell span {
          font-size: 1.15rem !important;
        }
        
        .header-actions-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .highlight-text {
          color: var(--accent-warning);
        }
        
        .text-success { color: var(--accent-success); }
        .text-danger { color: var(--accent-danger); }

        .company-info-cell {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .company-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--glass-border), rgba(255,255,255,0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
          color: var(--text-primary);
          flex-shrink: 0;
        }

        .code-badge {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--glass-border);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .plan-badge {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          color: var(--accent-warning);
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-action-edit {
          background: var(--glass-border);
          color: var(--text-primary);
          border: 1px solid transparent;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
        }

        .btn-action-edit:hover {
          background: white;
          color: black;
        }

        .btn-action-mail {
          background: rgba(245, 158, 11, 0.1);
          color: var(--accent-warning);
          border: 1px solid rgba(245, 158, 11, 0.2);
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-action-mail:hover:not(:disabled) {
          background: var(--accent-warning);
          color: white;
        }

        .btn-action-delete {
          background: rgba(239, 68, 68, 0.1);
          color: var(--accent-danger);
          border: 1px solid rgba(239, 68, 68, 0.2);
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-action-delete:hover:not(:disabled) {
          background: var(--accent-danger);
          color: white;
        }

        /* Modals */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          padding: 1.5rem;
          animation: fadeIn 0.2s ease-out forwards;
        }

        .modal-content {
          background: #0f172a;
          border: 1px solid var(--glass-border);
          border-radius: 1.5rem;
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .modal-header {
          padding: 1.5rem 2rem;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 0.25rem 0;
        }

        .modal-subtitle {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .close-btn {
          background: var(--glass-border);
          border: none;
          color: var(--text-secondary);
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: var(--accent-danger);
          color: white;
        }

        .modal-body {
          padding: 2rem;
          overflow-y: auto;
        }

        .company-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .required { color: var(--accent-danger); }

        .company-form input,
        .company-form select {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--glass-border);
          color: white;
          padding: 0.875rem 1rem;
          border-radius: 0.75rem;
          outline: none;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .company-form input:focus,
        .company-form select:focus {
          border-color: var(--accent-warning);
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
        }

        .password-input-wrapper {
          position: relative;
        }

        .toggle-password-btn {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.8rem;
          cursor: pointer;
        }
        
        .toggle-password-btn:hover {
          color: var(--accent-warning);
        }

        .notification-toggle {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          padding: 1rem 1.25rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
        }

        .notification-toggle input[type="checkbox"] {
          width: 20px !important;
          height: 20px !important;
          accent-color: var(--accent-warning);
          flex-shrink: 0;
          cursor: pointer;
          margin: 0;
        }

        .toggle-title {
          color: var(--accent-warning);
          font-weight: 700;
          font-size: 0.95rem;
          margin: 0 0 0.25rem 0;
        }

        .toggle-subtitle {
          color: var(--text-secondary);
          font-size: 0.8rem;
          margin: 0;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--glass-border);
        }

        .btn-cancel {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--glass-border);
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-cancel:hover {
          background: var(--glass-border);
          color: white;
        }

        .btn-submit {
          background: var(--accent-warning);
          color: #1e293b;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        /* Delete Modal */
        .delete-modal-content {
          background: #0f172a;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 1rem;
          padding: 2rem;
          width: 100%;
          max-width: 450px;
          position: relative;
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .delete-modal-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(to right, var(--accent-danger), #991b1b);
        }

        .delete-modal-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .delete-modal-title svg {
          color: var(--accent-danger);
        }

        .delete-modal-desc {
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .delete-modal-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-delete-cancel {
          flex: 1;
          background: transparent;
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-weight: bold;
          cursor: pointer;
        }

        .btn-delete-cancel:hover {
          background: var(--glass-border);
          color: white;
        }

        .btn-delete-confirm {
          flex: 1;
          background: var(--accent-danger);
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
        }

        .btn-delete-confirm:hover:not(:disabled) {
          background: #dc2626;
        }

        /* Toast Notifications */
        .toast-notification {
          position: fixed;
          top: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999999;
          animation: bounce 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-radius: 1rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
        }

        .toast-content.success {
          background: rgba(6, 78, 59, 0.6);
          border: 1px solid rgba(16, 185, 129, 0.5);
        }

        .toast-content.error {
          background: rgba(127, 29, 29, 0.6);
          border: 1px solid rgba(239, 68, 68, 0.5);
        }

        .toast-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .success .toast-icon {
          background: rgba(16, 185, 129, 0.2);
          color: var(--accent-success);
        }

        .error .toast-icon {
          background: rgba(239, 68, 68, 0.2);
          color: var(--accent-danger);
        }

        .toast-text h4 {
          margin: 0;
          font-weight: 800;
          font-size: 1.1rem;
        }
        
        .success .toast-text h4 { color: var(--accent-success); }
        .error .toast-text h4 { color: var(--accent-danger); }

        .toast-text p {
          margin: 0;
          font-size: 0.85rem;
          color: white;
          opacity: 0.9;
        }

        .toast-close {
          background: transparent;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.5;
          margin-right: 0.5rem;
        }

        .toast-close:hover {
          opacity: 1;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes bounce {
          0% { opacity: 0; transform: translate(-50%, -20px) scale(0.95); }
          50% { transform: translate(-50%, 5px) scale(1.02); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }

        @media (max-width: 768px) {
          .header-actions-group {
            flex-direction: column;
            width: 100%;
          }
          .search-container {
            width: 100%;
          }
          .btn-primary {
            width: 100%;
            justify-content: center;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

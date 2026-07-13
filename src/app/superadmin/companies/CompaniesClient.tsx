'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCompany, updateCompany, resendWelcomeEmail } from './actions'

export default function CompaniesClient({ initialCompanies, subscriptionPlans = [] }: { initialCompanies: any[], subscriptionPlans?: any[] }) {
  const [companies, setCompanies] = useState(initialCompanies)
  const [searchQuery, setSearchQuery] = useState('')
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
          password: formData.password,
          subscriptionStatus: formData.subscriptionStatus,
          subscriptionEndsAt: endsAt,
          subscriptionPlanId: formData.subscriptionPlanId || undefined
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
      window.location.reload()
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'حدث خطأ أثناء حفظ البيانات')
      setIsLoading(false)
    }
  }

  const handleResendEmail = async (companyId: string) => {
    if (confirm('هل أنت متأكد من رغبتك في إعادة إرسال بطاقة الدخول للعميل؟ (سيتم إرسال رسالة بكلمة مرور مخفية)')) {
      setSendingEmailId(companyId)
      try {
        const res = await resendWelcomeEmail(companyId)
        if (res.success) {
          alert('تم إرسال بطاقة الدخول للعميل بنجاح.')
        } else {
          alert('فشل الإرسال: ' + res.error)
        }
      } catch (err) {
        alert('حدث خطأ أثناء الاتصال.')
      } finally {
        setSendingEmailId(null)
      }
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

    const adminEmail = c.users?.[0]?.email || ''

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
    <div className="min-h-screen bg-[#050505] text-white p-6 pb-20 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="relative">
            <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-yellow-500 to-transparent"></div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">
              إدارة <span className="text-yellow-500">المستأجرين</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium">نظام التحكم المركزي في الشركات والاشتراكات السحابية.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <svg width="20" height="20" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input
                type="text"
                placeholder="بحث بالاسم، المعرف، البريد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#111] border border-gray-800 text-white pl-4 pr-12 py-4 rounded-xl focus:border-yellow-500 focus:outline-none w-full sm:w-64 md:w-80 transition-all shadow-inner"
              />
            </div>
            <button 
              onClick={openCreate}
              className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-500 transition-all transform hover:scale-105 active:scale-95 shadow-xl w-full sm:w-auto"
            >
              <svg width="24" height="24" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              تأسيس شركة جديدة
            </button>
          </div>
        </div>

        {/* Stats Summary - Optional but adds "Premium" feel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">إجمالي الشركات</p>
            <h3 className="text-3xl font-black">{companies.length}</h3>
          </div>
          <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">الاشتراكات النشطة</p>
            <h3 className="text-3xl font-black text-emerald-500">{companies.filter(c => c.subscriptionStatus === 'Active').length}</h3>
          </div>
          <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">شركات موقوفة</p>
            <h3 className="text-3xl font-black text-red-500">{companies.filter(c => c.subscriptionStatus !== 'Active').length}</h3>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-[#0f0f0f] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[#151515] text-gray-500 text-xs font-black uppercase tracking-widest border-b border-gray-800">
                  <th className="p-6">الشركة</th>
                  <th className="p-6">معرف النظام</th>
                  <th className="p-6">البريد الإلكتروني</th>
                  <th className="p-6">رقم الجوال</th>
                  <th className="p-6">المستخدم / المرور</th>
                  <th className="p-6">الباقة</th>
                  <th className="p-6">تاريخ الانتهاء</th>
                  <th className="p-6">الحالة</th>
                  <th className="p-6 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <svg width="48" height="48" className="w-12 h-12 text-gray-700 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '48px', height: '48px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <p className="font-bold">لا توجد شركات تطابق عملية البحث</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredCompanies.map(c => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center font-bold text-gray-400 group-hover:from-yellow-500 group-hover:to-yellow-600 group-hover:text-black transition-all flex-shrink-0 overflow-hidden"
                          style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
                        >
                          {c.name.substring(0,1)}
                        </div>
                        <span className="font-bold text-lg">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-black rounded border border-gray-800 text-[10px] font-mono text-gray-500">
                        {c.id}
                      </span>
                    </td>
                    <td className="p-6 text-sm text-gray-400 font-mono" dir="ltr">
                      {c.email || c.users?.[0]?.email || '---'}
                    </td>
                    <td className="p-6 text-sm text-gray-400 font-mono" dir="ltr">
                      {c.phone || '---'}
                    </td>
                    <td className="p-6 text-sm text-gray-400" dir="ltr">
                      <div className="flex flex-col gap-1">
                        <span className="text-white font-bold">{c.users?.[0]?.username || '---'}</span>
                        <span className="text-xs text-yellow-500/70" title="كلمة المرور مشفرة لغايات أمنية">*** (مشفرة)</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-[#111] rounded border border-yellow-500/30 text-xs text-yellow-500 font-bold">
                        {c.subscriptionPlan?.nameAr || c.subscriptionPlan?.name || '---'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="text-sm">
                        {c.subscriptionEndsAt ? (
                          <span className={new Date(c.subscriptionEndsAt) < new Date() ? 'text-red-500 font-bold' : 'text-gray-300'}>
                            {new Date(c.subscriptionEndsAt).toLocaleDateString('ar-EG', { year:'numeric', month:'long', day:'numeric' })}
                          </span>
                        ) : (
                          <span className="text-yellow-500/50 italic">غير محدد</span>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        c.subscriptionStatus === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${c.subscriptionStatus === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                        {c.subscriptionStatus === 'Active' ? 'نشط' : 'موقوف'}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEdit(c)} 
                          className="bg-gray-800 hover:bg-white hover:text-black px-4 py-2 rounded-lg text-xs font-bold transition-all border border-transparent hover:border-white active:scale-95 flex-1"
                        >
                          إدارة الحساب
                        </button>
                        <button 
                          onClick={() => handleResendEmail(c.id)} 
                          disabled={sendingEmailId === c.id}
                          className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black px-3 py-2 rounded-lg text-xs font-bold transition-all border border-yellow-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="إعادة إرسال بطاقة الدخول للعميل"
                        >
                          {sendingEmailId === c.id ? (
                            <span className="flex items-center gap-1">
                              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </span>
                          ) : (
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Robust Centered Modal Popup */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="company-modal">
              {/* Modal Header */}
              <div className="modal-header">
                <div>
                  <h2 className="modal-title">
                    {editingCompany ? 'تحديث بيانات الكيان' : 'تأسيس شركة جديدة'}
                  </h2>
                  <p className="modal-subtitle">أدخل البيانات المطلوبة بدقة لضمان استقرار الخدمة.</p>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="close-btn">&times;</button>
              </div>
              
              {/* Modal Body */}
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
                      <label>كود الشركة (معرف النظام) {editingCompany ? '' : <span style={{color: '#94a3b8', fontSize: '10px', fontWeight: 'normal'}}>(اختياري)</span>}</label>
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
                    <div className="form-group relative">
                      <label>كلمة مرور المدير {editingCompany ? '' : <span className="required">*</span>}</label>
                      <div className="relative">
                        <input 
                          required={!editingCompany}
                          type={showPassword ? "text" : "password"} 
                          value={formData.password} 
                          onChange={e => setFormData({...formData, password: e.target.value})} 
                          placeholder={editingCompany ? "اترك الحقل فارغاً للاحتفاظ بكلمة المرور القديمة" : "••••••••"}
                          dir="ltr"
                          style={{ paddingLeft: '2.5rem' }}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-yellow-500 focus:outline-none"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          {showPassword ? (
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                          ) : (
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          )}
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
                          className="bg-[#111] border border-gray-800 text-white pl-4 pr-4 py-4 rounded-xl focus:border-yellow-500 focus:outline-none w-full transition-all"
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

                  {!editingCompany && (
                    <div className="notification-toggle" onClick={() => setFormData({...formData, sendEmail: !formData.sendEmail})}>
                      <input type="checkbox" checked={formData.sendEmail} readOnly />
                      <div>
                        <p className="toggle-title">تفعيل الإشعارات الترحيبية</p>
                        <p className="toggle-subtitle">سيتم إرسال بطاقة الدخول وتفاصيل الـ Tenant ID للعميل فوراً.</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
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
      </div>

      <style jsx global>{`
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
        }

        .company-modal {
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .modal-header {
          padding: 1.5rem 2rem;
          background: #1e293b;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #f8fafc;
          margin: 0 0 0.25rem 0;
        }

        .modal-subtitle {
          font-size: 0.85rem;
          color: #94a3b8;
          margin: 0;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: #94a3b8;
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
          background: #ef4444;
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

        @media (max-width: 600px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
        }

        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #cbd5e1;
          margin-bottom: 0.5rem;
        }

        .required {
          color: #ef4444;
        }

        .company-form input,
        .company-form select {
          width: 100%;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 0.875rem 1rem;
          border-radius: 0.75rem;
          outline: none;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .company-form input:focus,
        .company-form select:focus {
          border-color: #eab308;
          box-shadow: 0 0 0 2px rgba(234, 179, 8, 0.2);
        }

        .notification-toggle {
          background: rgba(234, 179, 8, 0.1);
          border: 1px solid rgba(234, 179, 8, 0.2);
          padding: 1rem 1.25rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .notification-toggle:hover {
          background: rgba(234, 179, 8, 0.15);
        }

        .notification-toggle input {
          width: auto;
          margin: 0;
          cursor: pointer;
        }

        .toggle-title {
          color: #eab308;
          font-weight: 700;
          font-size: 0.95rem;
          margin: 0 0 0.25rem 0;
        }

        .toggle-subtitle {
          color: #94a3b8;
          font-size: 0.8rem;
          margin: 0;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .btn-cancel {
          background: transparent;
          color: #cbd5e1;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .btn-submit {
          background: #eab308;
          color: #1e293b;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
          background: #ca8a04;
          transform: translateY(-1px);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  )
}


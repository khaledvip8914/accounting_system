'use client'

import { useState } from 'react'
import { createPackage, updatePackage, deletePackage } from './actions'

export default function PackagesClient({ initialPackages }: { initialPackages: any[] }) {
  const [packages, setPackages] = useState(initialPackages)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    price: 0,
    maxBranches: 1,
    maxUsers: 1,
    hasZatcaPhase2: false,
    hasSalesAndPurchases: false,
    hasBankReconciliation: false,
    hasUserPermissions: false,
    hasFixedAssets: false,
    hasMultiCurrency: false,
    hasAdvancedReports: false,
    hasWhatsApp: false,
    hasHumanResources: false,
    hasApiIntegration: false,
    hasAnalysisDimensions: false,
  })

  const openCreate = () => {
    setEditingPackage(null)
    setFormData({
      name: '',
      nameAr: '',
      price: 0,
      maxBranches: 1,
      maxUsers: 1,
      hasZatcaPhase2: false,
      hasSalesAndPurchases: false,
      hasBankReconciliation: false,
      hasUserPermissions: false,
      hasFixedAssets: false,
      hasMultiCurrency: false,
      hasAdvancedReports: false,
      hasWhatsApp: false,
      hasHumanResources: false,
      hasApiIntegration: false,
      hasAnalysisDimensions: false,
    })
    setIsModalOpen(true)
  }

  const openEdit = (pkg: any) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name || '',
      nameAr: pkg.nameAr || '',
      price: pkg.price || 0,
      maxBranches: pkg.maxBranches || 1,
      maxUsers: pkg.maxUsers || 1,
      hasZatcaPhase2: pkg.hasZatcaPhase2 || false,
      hasSalesAndPurchases: pkg.hasSalesAndPurchases || false,
      hasBankReconciliation: pkg.hasBankReconciliation || false,
      hasUserPermissions: pkg.hasUserPermissions || false,
      hasFixedAssets: pkg.hasFixedAssets || false,
      hasMultiCurrency: pkg.hasMultiCurrency || false,
      hasAdvancedReports: pkg.hasAdvancedReports || false,
      hasWhatsApp: pkg.hasWhatsApp || false,
      hasHumanResources: pkg.hasHumanResources || false,
      hasApiIntegration: pkg.hasApiIntegration || false,
      hasAnalysisDimensions: pkg.hasAnalysisDimensions || false,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذه الباقة؟')) {
      setIsLoading(true)
      try {
        const res = await deletePackage(id)
        if (!res.success) throw new Error(res.error)
        window.location.reload()
      } catch (error: any) {
        alert(error.message)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (editingPackage) {
        const res = await updatePackage(editingPackage.id, formData)
        if (!res.success) throw new Error(res.error)
      } else {
        const res = await createPackage(formData)
        if (!res.success) throw new Error(res.error)
      }
      window.location.reload()
    } catch (error: any) {
      alert(error.message || 'حدث خطأ أثناء الحفظ')
      setIsLoading(false)
    }
  }

  return (
    <div className="pkg-wrapper" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="pkg-header-section">
          <div className="pkg-title-area">
            <h1 className="pkg-main-title">
              إدارة <span>الباقات</span>
            </h1>
            <p className="pkg-subtitle">التحكم في الميزات والحدود لكل باقة متوفرة في النظام.</p>
          </div>
          
          <div className="pkg-action-area">
            <button onClick={openCreate} className="btn-create-pkg">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              إنشاء باقة جديدة
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="pkg-grid">
          {packages.map((pkg) => {
            const isPro = pkg.name.toLowerCase().includes('pro') || pkg.name.toLowerCase().includes('احترافية');
            return (
              <div key={pkg.id} className={`pkg-card ${isPro ? 'pro' : ''}`}>
                
                {isPro && (
                  <div className="pkg-badge">
                    الأكثر شيوعاً
                  </div>
                )}
                
                <div className="pkg-card-header">
                  <p className="pkg-name-en">{pkg.name}</p>
                  <h3 className="pkg-name-ar">{pkg.nameAr || pkg.name}</h3>
                  <div className="pkg-price-row">
                    <span className="pkg-price-val">{pkg.price.toLocaleString()}</span>
                    <div className="pkg-price-currency">
                      <span>ر.س</span>
                      <span>/ سنة</span>
                    </div>
                  </div>
                  <p className="pkg-billing-info">مدفوع سنوياً</p>
                </div>

                <div className="pkg-features">
                  <div className="pkg-features-inner">
                    <FeatureRow enabled={true} label={pkg.maxUsers === 1 ? 'مستخدم واحد' : `${pkg.maxUsers} مستخدمين`} />
                    <FeatureRow enabled={true} label={pkg.maxBranches === 1 ? 'فرع واحد' : `${pkg.maxBranches} فروع`} />
                    {pkg.hasZatcaPhase2 && <FeatureRow enabled={true} label="الفوترة الإلكترونية ZATCA" />}
                    {pkg.hasSalesAndPurchases && <FeatureRow enabled={true} label="إدارة المبيعات والمشتريات" />}
                    {pkg.hasBankReconciliation && <FeatureRow enabled={true} label="التسوية البنكية" />}
                    {pkg.hasUserPermissions && <FeatureRow enabled={true} label="صلاحيات المستخدمين" />}
                    {pkg.hasFixedAssets && <FeatureRow enabled={true} label="إدارة الأصول الثابتة" />}
                    {pkg.hasMultiCurrency && <FeatureRow enabled={true} label="تعدد العملات" />}
                    {pkg.hasAdvancedReports && <FeatureRow enabled={true} label="تقارير وقيود متقدمة" />}
                  </div>
                </div>

                <div className="pkg-card-actions">
                  <button 
                    onClick={() => openEdit(pkg)} 
                    className="pkg-btn-edit"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    تعديل
                  </button>
                  <button 
                    onClick={() => handleDelete(pkg.id)} 
                    className="pkg-btn-delete"
                    title="حذف"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="package-modal">
              <div className="modal-header">
                <div>
                  <h2 className="modal-title">
                    {editingPackage ? 'تحديث الباقة' : 'باقة جديدة'}
                  </h2>
                  <p className="modal-subtitle">حدد خصائص وميزات الباقة بدقة.</p>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="close-btn">&times;</button>
              </div>
              
              <div className="modal-body custom-scrollbar">
                <form onSubmit={handleSubmit} className="package-form">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>اسم الباقة (عربي) <span className="required">*</span></label>
                      <input required type="text" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} placeholder="مثال: الباقة الأساسية" />
                    </div>
                    <div className="form-group">
                      <label>اسم الباقة (إنجليزي) <span className="required">*</span></label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Basic" dir="ltr" />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>سعر الباقة السنوي <span className="required">*</span></label>
                      <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} dir="ltr" />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>الحد الأقصى للمستخدمين <span className="required">*</span></label>
                      <input required type="number" min="1" value={formData.maxUsers} onChange={e => setFormData({...formData, maxUsers: parseInt(e.target.value)})} dir="ltr" />
                    </div>
                    <div className="form-group">
                      <label>الحد الأقصى للفروع <span className="required">*</span></label>
                      <input required type="number" min="1" value={formData.maxBranches} onChange={e => setFormData({...formData, maxBranches: parseInt(e.target.value)})} dir="ltr" />
                    </div>
                  </div>

                  <div className="mt-4 mb-2">
                    <h3 className="features-title">الميزات المشمولة</h3>
                  </div>

                  <div className="form-grid-2">
                    <CheckboxToggle label="الفوترة الإلكترونية (مرحلة 2)" checked={formData.hasZatcaPhase2} onChange={(val) => setFormData({...formData, hasZatcaPhase2: val})} />
                    <CheckboxToggle label="المبيعات والمشتريات" checked={formData.hasSalesAndPurchases} onChange={(val) => setFormData({...formData, hasSalesAndPurchases: val})} />
                    <CheckboxToggle label="التسويات البنكية" checked={formData.hasBankReconciliation} onChange={(val) => setFormData({...formData, hasBankReconciliation: val})} />
                    <CheckboxToggle label="صلاحيات المستخدمين المتقدمة" checked={formData.hasUserPermissions} onChange={(val) => setFormData({...formData, hasUserPermissions: val})} />
                    <CheckboxToggle label="إدارة الأصول الثابتة" checked={formData.hasFixedAssets} onChange={(val) => setFormData({...formData, hasFixedAssets: val})} />
                    <CheckboxToggle label="تعدد العملات" checked={formData.hasMultiCurrency} onChange={(val) => setFormData({...formData, hasMultiCurrency: val})} />
                    <CheckboxToggle label="التقارير المتقدمة والقيود" checked={formData.hasAdvancedReports} onChange={(val) => setFormData({...formData, hasAdvancedReports: val})} />
                    <CheckboxToggle label="ميزة الواتساب وإرسال الفواتير" checked={formData.hasWhatsApp} onChange={(val) => setFormData({...formData, hasWhatsApp: val})} />
                    <CheckboxToggle label="الموارد البشرية وشؤون الموظفين" checked={formData.hasHumanResources} onChange={(val) => setFormData({...formData, hasHumanResources: val})} />
                    <CheckboxToggle label="ربط الأنظمة الخارجية (API)" checked={formData.hasApiIntegration} onChange={(val) => setFormData({...formData, hasApiIntegration: val})} />
                    <CheckboxToggle label="الأبعاد التحليلية (مراكز التكلفة)" checked={formData.hasAnalysisDimensions} onChange={(val) => setFormData({...formData, hasAnalysisDimensions: val})} />
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
      </div>

      <style jsx global>{`
        .pkg-wrapper {
          min-height: 100vh;
          padding: 2rem;
          font-family: inherit;
          background-color: var(--bg-gradient, #050505);
        }
        .max-w-7xl {
          max-width: 1200px;
          margin: 0 auto;
        }
        .pkg-header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .pkg-main-title {
          font-size: 2.5rem;
          font-weight: 900;
          color: white;
          margin: 0 0 0.5rem 0;
        }
        .pkg-main-title span {
          color: #eab308;
        }
        .pkg-subtitle {
          color: #94a3b8;
          font-size: 0.95rem;
          margin: 0;
        }
        .btn-create-pkg {
          background: white;
          color: black;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: bold;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-create-pkg:hover {
          background: #eab308;
          transform: translateY(-2px);
        }
        
        .pkg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          align-items: stretch;
        }
        
        .pkg-card {
          background: #111;
          border: 2px solid #1f2937;
          border-radius: 1.5rem;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.3s;
        }
        .pkg-card:hover {
          border-color: #374151;
        }
        
        .pkg-card.pro {
          border-color: #2563eb;
          box-shadow: 0 0 30px rgba(37, 99, 235, 0.15);
          transform: scale(1.03);
          z-index: 10;
        }
        
        .pkg-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: #2563eb;
          color: white;
          font-size: 0.85rem;
          font-weight: bold;
          padding: 0.35rem 1.5rem;
          border-radius: 9999px;
          white-space: nowrap;
        }
        
        .pkg-card-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .pkg-name-en {
          color: #3b82f6;
          font-size: 0.875rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 0.5rem;
        }
        .pkg-name-ar {
          font-size: 1.8rem;
          font-weight: 900;
          color: white;
          margin: 0 0 1.5rem 0;
        }
        .pkg-price-row {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.5rem;
          color: white;
          margin-bottom: 0.5rem;
        }
        .pkg-price-val {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1;
        }
        .pkg-price-currency {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: 0.9rem;
          color: #9ca3af;
          font-weight: bold;
          line-height: 1.2;
        }
        .pkg-billing-info {
          color: #6b7280;
          font-size: 0.85rem;
          font-weight: 500;
          margin: 0;
        }
        
        .pkg-features {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
          border-top: 1px solid #1f2937;
          padding-top: 2rem;
        }
        .pkg-features-inner {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          width: max-content;
        }
        
        .pkg-feature-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          justify-content: flex-start;
          width: 100%;
        }
        .pkg-feature-icon {
          color: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pkg-feature-text {
          font-size: 0.95rem;
          font-weight: 500;
          color: #d1d5db;
        }
        
        .pkg-card-actions {
          margin-top: auto;
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
        }
        .pkg-btn-edit, .pkg-btn-delete {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.875rem 1rem;
          border-radius: 0.75rem;
          font-weight: bold;
          font-size: 0.875rem;
          transition: all 0.2s;
          cursor: pointer;
        }
        .pkg-btn-edit {
          flex: 1;
          gap: 0.5rem;
        }
        
        /* Pro styles */
        .pkg-card.pro .pkg-btn-edit {
          background: #2563eb;
          color: white;
          border: none;
        }
        .pkg-card.pro .pkg-btn-edit:hover {
          background: #1d4ed8;
        }
        .pkg-card.pro .pkg-btn-delete {
          background: #2563eb;
          color: white;
          border: none;
        }
        .pkg-card.pro .pkg-btn-delete:hover {
          background: #ef4444;
        }
        
        /* Regular styles */
        .pkg-card:not(.pro) .pkg-btn-edit {
          background: transparent;
          border: 2px solid #1f2937;
          color: white;
        }
        .pkg-card:not(.pro) .pkg-btn-edit:hover {
          border-color: #4b5563;
          background: #1f2937;
        }
        .pkg-card:not(.pro) .pkg-btn-delete {
          background: transparent;
          border: 2px solid #1f2937;
          color: #9ca3af;
        }
        .pkg-card:not(.pro) .pkg-btn-delete:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 1.5rem;
        }
        .package-modal {
          background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1.5rem; width: 100%; max-width: 800px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); overflow: hidden;
        }
        .modal-header { padding: 1.5rem 2rem; background: #1e293b; border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; justify-content: space-between; align-items: center; }
        .modal-title { font-size: 1.5rem; font-weight: 800; color: #f8fafc; margin: 0 0 0.25rem 0; }
        .modal-subtitle { font-size: 0.85rem; color: #94a3b8; margin: 0; }
        .close-btn { background: rgba(255, 255, 255, 0.05); border: none; color: #94a3b8; font-size: 1.5rem; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .close-btn:hover { background: #ef4444; color: white; }
        .modal-body { padding: 2rem; overflow-y: auto; }
        .package-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        @media (max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr; } }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.5rem; }
        .required { color: #ef4444; }
        .package-form input { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.875rem 1rem; border-radius: 0.75rem; outline: none; font-size: 0.95rem; transition: all 0.2s; }
        .package-form input:focus { border-color: #eab308; box-shadow: 0 0 0 2px rgba(234, 179, 8, 0.2); }
        .features-title { font-size: 1.1rem; font-weight: bold; color: white; border-bottom: 1px solid #1f2937; padding-bottom: 0.5rem; margin-bottom: 1rem; margin-top: 1rem; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.05); }
        .btn-cancel { background: transparent; color: #cbd5e1; border: 1px solid rgba(255, 255, 255, 0.1); padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-cancel:hover { background: rgba(255, 255, 255, 0.05); color: white; }
        .btn-submit { background: #eab308; color: #1e293b; border: none; padding: 0.75rem 2rem; border-radius: 0.5rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-submit:hover:not(:disabled) { background: #ca8a04; transform: translateY(-1px); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        
        .feature-toggle { display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; }
        .feature-toggle:hover { background: rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.1); }
        .feature-toggle.active { border-color: #eab308; background: rgba(234,179,8,0.05); }
      `}</style>
    </div>
  )
}

function FeatureRow({ enabled, label }: { enabled: boolean, label: string }) {
  if (!enabled) return null; // We only render enabled features to match the style

  return (
    <div className="pkg-feature-row">
      <div className="pkg-feature-icon">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <span className="pkg-feature-text">{label}</span>
    </div>
  )
}

function CheckboxToggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <div className={`feature-toggle ${checked ? 'active' : ''}`} onClick={() => onChange(!checked)}>
      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#d1d5db' }}>{label}</span>
      <div style={{ width: '40px', height: '20px', borderRadius: '999px', position: 'relative', transition: 'all 0.2s', background: checked ? '#eab308' : '#374151' }}>
        <div style={{ position: 'absolute', top: '2px', bottom: '2px', width: '16px', background: 'white', borderRadius: '50%', transition: 'all 0.2s', left: checked ? '2px' : 'auto', right: checked ? 'auto' : '2px' }}></div>
      </div>
    </div>
  )
}

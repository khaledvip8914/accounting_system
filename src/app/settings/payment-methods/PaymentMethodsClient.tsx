'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPaymentMethod, updatePaymentMethod, deletePaymentMethod } from './actions';

type Account = {
  id: string;
  code: string;
  name: string;
  nameAr: string | null;
  type: string;
};

type PaymentMethod = {
  id: string;
  name: string;
  nameAr: string | null;
  code: string | null;
  type: string;
  accountId: string | null;
  isActive: boolean;
  isDefault: boolean;
  account?: Account | null;
};

export default function PaymentMethodsClient({
  initialMethods,
  accounts,
  lang,
  dict
}: {
  initialMethods: PaymentMethod[];
  accounts: Account[];
  lang: 'ar' | 'en';
  dict: any;
}) {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    code: '',
    type: 'Cash',
    accountId: '',
    isActive: true,
    isDefault: false
  });

  const [accountQuery, setAccountQuery] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const openCreateModal = () => {
    setEditingMethod(null);
    setFormData({
      name: '',
      nameAr: '',
      code: '',
      type: 'Cash',
      accountId: accounts[0]?.id || '',
      isActive: true,
      isDefault: methods.length === 0
    });
    setAccountQuery('');
    setShowModal(true);
  };

  const openEditModal = (m: PaymentMethod) => {
    setEditingMethod(m);
    setFormData({
      name: m.name,
      nameAr: m.nameAr || '',
      code: m.code || '',
      type: m.type || 'Cash',
      accountId: m.accountId || '',
      isActive: m.isActive,
      isDefault: m.isDefault
    });
    setAccountQuery('');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name && !formData.nameAr) {
      alert(lang === 'ar' ? 'يرجى إدخال اسم طريقة الدفع' : 'Payment method name is required');
      return;
    }

    startTransition(async () => {
      let res;
      if (editingMethod) {
        res = await updatePaymentMethod(editingMethod.id, formData);
      } else {
        res = await createPaymentMethod(formData);
      }

      if (res?.success) {
        setShowModal(false);
        router.refresh();
      } else {
        alert(res?.error || (lang === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Failed to save'));
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف طريقة الدفع هذه؟' : 'Are you sure you want to delete this payment method?')) {
      return;
    }
    startTransition(async () => {
      const res = await deletePaymentMethod(id);
      if (res.success) {
        setMethods(prev => prev.filter(m => m.id !== id));
        router.refresh();
      } else {
        alert(res.error || (lang === 'ar' ? 'فشل الحذف' : 'Delete failed'));
      }
    });
  };

  const handleToggleDefault = async (m: PaymentMethod) => {
    if (m.isDefault) return;
    startTransition(async () => {
      const res = await updatePaymentMethod(m.id, { isDefault: true });
      if (res.success) {
        setMethods(prev =>
          prev.map(item => ({
            ...item,
            isDefault: item.id === m.id
          }))
        );
        router.refresh();
      }
    });
  };

  const handleToggleActive = async (m: PaymentMethod) => {
    startTransition(async () => {
      const res = await updatePaymentMethod(m.id, { isActive: !m.isActive });
      if (res.success) {
        setMethods(prev =>
          prev.map(item => (item.id === m.id ? { ...item, isActive: !item.isActive } : item))
        );
        router.refresh();
      }
    });
  };

  const filteredMethods = methods.filter(m => {
    const q = searchTerm.toLowerCase();
    return (
      (m.name || '').toLowerCase().includes(q) ||
      (m.nameAr || '').toLowerCase().includes(q) ||
      (m.code || '').toLowerCase().includes(q)
    );
  });

  const filteredAccounts = accounts.filter(a => {
    const q = accountQuery.toLowerCase();
    return (
      (a.code || '').toLowerCase().includes(q) ||
      (a.name || '').toLowerCase().includes(q) ||
      (a.nameAr || '').toLowerCase().includes(q)
    );
  });

  const selectedAccount = accounts.find(a => a.id === formData.accountId);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Cash':
        return '💵';
      case 'Card':
        return '💳';
      case 'Bank':
        return '🏦';
      default:
        return '🌐';
    }
  };

  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      Cash: lang === 'ar' ? 'نقدي / كاش' : 'Cash',
      Card: lang === 'ar' ? 'بطاقة / شبكة' : 'Card / POS',
      Bank: lang === 'ar' ? 'تحويل بنكي' : 'Bank Transfer',
      Other: lang === 'ar' ? 'أخرى' : 'Other'
    };
    return map[type] || type;
  };

  return (
    <div className="payment-methods-view" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <Link
              href="/settings"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#f1f5f9',
                color: '#475569',
                textDecoration: 'none',
                fontWeight: 700
              }}
              title={lang === 'ar' ? 'الرجوع للإعدادات' : 'Back to Settings'}
            >
              {lang === 'ar' ? '➔' : '←'}
            </Link>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {lang === 'ar' ? '💳 طرق الدفع وربط الحسابات' : '💳 Payment Methods & Accounts'}
            </h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, paddingRight: '48px' }}>
            {lang === 'ar'
              ? 'إدارة وسائل الدفع للفواتير وربط كل طريقة بحسابها المحاسبي المخصص في دليل الحسابات'
              : 'Configure invoice payment methods and map each method to its corresponding Chart of Accounts ledger'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>+</span>
          {lang === 'ar' ? 'إضافة طريقة دفع جديدة' : 'Add Payment Method'}
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div
        style={{
          background: '#fff',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', [lang === 'ar' ? 'right' : 'left']: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            🔍
          </span>
          <input
            type="text"
            placeholder={lang === 'ar' ? 'البحث عن طريقة دفع باسمها أو كودها...' : 'Search payment methods...'}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              paddingInlineStart: '36px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem'
            }}
          />
        </div>
        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
          {lang === 'ar' ? `العدد: ${filteredMethods.length}` : `Total: ${filteredMethods.length}`}
        </div>
      </div>

      {/* Methods Grid / Cards */}
      {filteredMethods.length === 0 ? (
        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center',
            border: '1px dashed #cbd5e1'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>
            {lang === 'ar' ? 'لا توجد طرق دفع مطابقة' : 'No payment methods found'}
          </h3>
          <p style={{ color: '#64748b', margin: '0 0 1.5rem 0', fontSize: '0.9rem' }}>
            {lang === 'ar' ? 'أضف وسائل الدفع لتسهيل إصدار الفواتير وربطها بالدفاتر المحاسبية' : 'Add payment methods to link with sales invoices and accounting'}
          </p>
          <button onClick={openCreateModal} className="btn-primary" style={{ padding: '8px 18px' }}>
            {lang === 'ar' ? 'إضافة طريقة دفع الآن' : 'Add Payment Method Now'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filteredMethods.map(m => {
            const acc = m.account || accounts.find(a => a.id === m.accountId);
            return (
              <div
                key={m.id}
                style={{
                  background: '#fff',
                  borderRadius: '14px',
                  border: m.isDefault ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: m.isDefault ? '0 8px 24px -6px rgba(59, 130, 246, 0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                  position: 'relative',
                  opacity: m.isActive ? 1 : 0.65,
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                {/* Card Top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}
                    >
                      {getTypeIcon(m.type)}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        {lang === 'ar' ? (m.nameAr || m.name) : m.name}
                      </h3>
                      {m.nameAr && m.name && m.name !== m.nameAr && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {lang === 'ar' ? m.name : m.nameAr}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {m.isDefault && (
                      <span
                        style={{
                          background: '#dbeafe',
                          color: '#1d4ed8',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 700
                        }}
                      >
                        🌟 {lang === 'ar' ? 'افتراضي' : 'Default'}
                      </span>
                    )}
                    <span
                      style={{
                        background: m.isActive ? '#dcfce7' : '#fee2e2',
                        color: m.isActive ? '#166534' : '#991b1b',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}
                    >
                      {m.isActive ? (lang === 'ar' ? 'مفعل' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive')}
                    </span>
                  </div>
                </div>

                {/* Linked Account Details */}
                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                    {lang === 'ar' ? 'الحساب المالي المرتبط (دليل الحسابات):' : 'Linked Financial Account:'}
                  </div>
                  {acc ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          background: '#e0f2fe',
                          color: '#0369a1',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          fontSize: '0.8rem'
                        }}
                      >
                        {acc.code}
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                        {lang === 'ar' && acc.nameAr ? acc.nameAr : acc.name}
                      </span>
                    </div>
                  ) : (
                    <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>
                      ⚠️ {lang === 'ar' ? 'غير مربوط بأي حساب مالي' : 'Not linked to any account'}
                    </div>
                  )}
                </div>

                {/* Type & Code row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
                  <span>
                    <strong>{lang === 'ar' ? 'النوع:' : 'Type:'}</strong> {getTypeLabel(m.type)}
                  </span>
                  {m.code && (
                    <span>
                      <strong>{lang === 'ar' ? 'الكود:' : 'Code:'}</strong>{' '}
                      <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>{m.code}</code>
                    </span>
                  )}
                </div>

                {/* Actions Footer */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '0.75rem',
                    marginTop: 'auto'
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!m.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleToggleDefault(m)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        {lang === 'ar' ? 'تعيين كافتراضي' : 'Set as Default'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(m)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: m.isActive ? '#d97706' : '#16a34a',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      {m.isActive ? (lang === 'ar' ? 'تعطيل' : 'Disable') : (lang === 'ar' ? 'تفعيل' : 'Enable')}
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => openEditModal(m)}
                      style={{
                        background: '#f1f5f9',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '5px 12px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#334155'
                      }}
                    >
                      ✏️ {lang === 'ar' ? 'تعديل' : 'Edit'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id)}
                      style={{
                        background: '#fee2e2',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '5px 10px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#dc2626'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div
            className="modal-content"
            style={{
              maxWidth: '560px',
              width: '95%',
              borderRadius: '16px',
              boxShadow: '0 20px 45px -10px rgba(0,0,0,0.3)',
              overflow: 'hidden'
            }}
          >
            <div
              className="modal-header"
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: '#fff',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>💳</span>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
                  {editingMethod
                    ? (lang === 'ar' ? 'تعديل طريقة الدفع' : 'Edit Payment Method')
                    : (lang === 'ar' ? 'إضافة طريقة دفع جديدة' : 'Add New Payment Method')}
                </h3>
              </div>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {/* Names */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>
                      {lang === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      required
                      dir="rtl"
                      placeholder={lang === 'ar' ? 'مثال: نقد / كاش' : 'Cash'}
                      value={formData.nameAr}
                      onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>
                      {lang === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      required
                      placeholder={lang === 'ar' ? 'مثال: Cash' : 'Cash'}
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                {/* Type and Code */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>
                      {lang === 'ar' ? 'نوع طريقة الدفع' : 'Payment Type'}
                    </label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="Cash">💵 {lang === 'ar' ? 'نقدي / كاش' : 'Cash'}</option>
                      <option value="Card">💳 {lang === 'ar' ? 'بطاقة / شبكة (POS)' : 'Card / POS'}</option>
                      <option value="Bank">🏦 {lang === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}</option>
                      <option value="Other">🌐 {lang === 'ar' ? 'أخرى' : 'Other'}</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>
                      {lang === 'ar' ? 'الكود الرمزي (اختياري)' : 'Code (Optional)'}
                    </label>
                    <input
                      placeholder="CASH / MADA / CC"
                      value={formData.code}
                      onChange={e => setFormData({ ...formData, code: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                {/* Linked Financial Account Selector */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.85rem' }}>
                    {lang === 'ar' ? 'الحساب المالي المرتبط (دليل الحسابات)' : 'Linked Ledger Account'}{' '}
                    <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div
                      onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      {selectedAccount ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              background: '#e0f2fe',
                              color: '#0369a1',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: '0.8rem'
                            }}
                          >
                            {selectedAccount.code}
                          </span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>
                            {lang === 'ar' && selectedAccount.nameAr ? selectedAccount.nameAr : selectedAccount.name}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({selectedAccount.type})</span>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>
                          {lang === 'ar' ? '--- اختر حساباً مالياً ---' : '--- Select Financial Account ---'}
                        </span>
                      )}
                      <span style={{ color: '#64748b' }}>▼</span>
                    </div>

                    {showAccountDropdown && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: '#fff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                          marginTop: '4px',
                          zIndex: 100,
                          maxHeight: '260px',
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9' }}>
                          <input
                            autoFocus
                            type="text"
                            placeholder={lang === 'ar' ? 'ابحث بالكود أو الاسم...' : 'Search by code or name...'}
                            value={accountQuery}
                            onChange={e => setAccountQuery(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>
                        <div style={{ overflowY: 'auto', flex: 1 }}>
                          {filteredAccounts.length === 0 ? (
                            <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                              {lang === 'ar' ? 'لا توجد نتائج' : 'No accounts found'}
                            </div>
                          ) : (
                            filteredAccounts.map(acc => (
                              <div
                                key={acc.id}
                                onClick={() => {
                                  setFormData({ ...formData, accountId: acc.id });
                                  setShowAccountDropdown(false);
                                }}
                                style={{
                                  padding: '8px 12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  cursor: 'pointer',
                                  background: formData.accountId === acc.id ? '#f0f9ff' : 'transparent',
                                  borderBottom: '1px solid #f8fafc'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span
                                    style={{
                                      background: '#f1f5f9',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      fontFamily: 'monospace',
                                      fontSize: '0.75rem',
                                      fontWeight: 700
                                    }}
                                  >
                                    {acc.code}
                                  </span>
                                  <span style={{ fontSize: '0.85rem', color: '#1e293b' }}>
                                    {lang === 'ar' && acc.nameAr ? acc.nameAr : acc.name}
                                  </span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{acc.type}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    {lang === 'ar'
                      ? 'سيتم ترحيل القيد المحاسبي للفاتورة المسددة بهذا الخيار إلى هذا الحساب تلقائياً.'
                      : 'Invoice receipts using this method will automatically be posted to this account.'}
                  </small>
                </div>

                {/* Checkboxes */}
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    {lang === 'ar' ? 'طريقة دفع مفعلة' : 'Active'}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                    />
                    {lang === 'ar' ? 'تعيين كافتراضية في الفاتورة' : 'Default for Invoices'}
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  marginTop: '2rem',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '1rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#475569'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    padding: '8px 22px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  {isPending ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ البيانات 💾' : 'Save 💾')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

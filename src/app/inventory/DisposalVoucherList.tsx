'use client';

import React, { useState } from 'react';
import { createDisposalVoucher, updateDisposalVoucher, deleteDisposalVoucher } from './actions';
import { useRouter } from 'next/navigation';
import SearchableSelect from '@/components/SearchableSelect';

export default function DisposalVoucherList({ vouchers, products, warehouses, units, lang }: { vouchers: any[], products: any[], warehouses: any[], units: any[], lang: string }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<any | null>(null);
  const [printVoucher, setPrintVoucher] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    unitId: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    warehouseId: warehouses?.[0]?.id || '',
    notes: ''
  });

  const openAdd = () => {
    setEditingVoucher(null);
    setFormData({
      productId: '',
      quantity: 0,
      unitId: '',
      reason: '',
      date: new Date().toISOString().split('T')[0],
      warehouseId: warehouses?.[0]?.id || '',
      notes: ''
    });
    setShowModal(true);
  };

  const openEdit = (v: any) => {
    setEditingVoucher(v);
    setFormData({
      productId: v.productId,
      quantity: v.quantity,
      unitId: v.unitId || v.product?.unitId,
      reason: v.reason,
      date: new Date(v.date).toISOString().split('T')[0],
      warehouseId: v.warehouseId,
      notes: v.notes || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
        const selectedP = products.find(p => p.id === formData.productId);
        let finalQty = formData.quantity;
        let finalReason = formData.reason;

        // Convert sub-unit quantity to base-unit if needed
        if (formData.unitId === selectedP?.subUnitId && selectedP?.unitQuantity) {
            finalQty = formData.quantity / selectedP.unitQuantity;
            const subUnitName = selectedP.subUnitRef?.nameAr || selectedP.subUnitRef?.name;
            if (!finalReason.includes(subUnitName)) {
                finalReason += ` ( ${formData.quantity.toLocaleString()} ${subUnitName} )`;
            }
        }

        let res;
        if (editingVoucher) {
            res = await updateDisposalVoucher(editingVoucher.id, { ...formData, quantity: finalQty, reason: finalReason });
        } else {
            res = await createDisposalVoucher({ ...formData, quantity: finalQty, reason: finalReason });
        }

        if (res.success) {
            setShowModal(false);
            router.refresh();
        } else {
            alert(res.error);
        }
    } catch (err: any) {
        alert(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من الحذف؟ سيتم استعادة الكميات للمخزون.' : 'Are you sure? This will reverse stock changes.')) {
        const res = await deleteDisposalVoucher(id);
        if (res.success) router.refresh();
        else alert(res.error);
    }
  };

  const selectedProduct = products.find(p => p.id === formData.productId);

  return (
    <div className="vouchers-module">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">{lang === 'ar' ? 'سندات إتلاف الأصناف' : 'Item Disposal Vouchers'}</h1>
          <p className="page-subtitle">{lang === 'ar' ? 'إدارة التوالف والمواد الخارجة من المخزون' : 'Manage scrap and inventory write-offs'}</p>
        </div>
        <button className="btn-primary" onClick={openAdd} style={{ background: '#dc2626' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          {lang === 'ar' ? 'إضافة سند إتلاف جديد' : 'New Disposal Voucher'}
        </button>
      </div>

      <div className="card">
        <div className="card-header">
           <h2 className="card-title">{lang === 'ar' ? 'قائمة السندات' : 'Voucher History'}</h2>
        </div>

        <div className="table-container">
          <table>
            <thead style={{ background: '#1e293b', borderBottom: '2px solid #0f172a' }}>
              <tr>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'رقم السند' : 'Voucher #'}</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'الصنف' : 'Item'}</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'السبب' : 'Reason'}</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left', color: '#ffffff', fontWeight: '900' }}>{lang === 'ar' ? 'المستودع' : 'Warehouse'}</th>
                <th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td><code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{v.voucherNumber}</code></td>
                  <td>{new Date(v.date).toLocaleDateString()}</td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{lang === 'ar' ? v.product?.nameAr : v.product?.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{v.product?.sku}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 'bold', color: '#dc2626' }}>{v.quantity}</span> 
                    <small style={{ color: '#64748b', marginLeft: '4px' }}>
                       {lang === 'ar' ? (v.product?.unitRef?.nameAr || v.product?.unit) : (v.product?.unitRef?.name || v.product?.unit)}
                    </small>
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                      {v.reason}
                    </span>
                  </td>
                  <td>{lang === 'ar' ? v.warehouse?.nameAr : v.warehouse?.name}</td>
                  <td style={{ textAlign: 'right' }} className="no-print">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn-icon" onClick={() => setPrintVoucher(v)} title="Print">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        </button>
                        <button className="btn-icon" onClick={() => openEdit(v)} title="Edit">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete(v.id)} title="Delete">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
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
          <div className="modal-content" style={{ maxWidth: '650px', width: '95%' }}>
             <div className="modal-header">
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{editingVoucher ? (lang === 'ar' ? 'تعديل سند إتلاف' : 'Edit Disposal Voucher') : (lang === 'ar' ? 'إنشاء سند إتلاف جديد' : 'New Disposal Voucher')}</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
             </div>
             <form onSubmit={handleSubmit}>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label>{lang === 'ar' ? 'الصنف المراد إتلافه' : 'Product to Dispose'}</label>
                        <SearchableSelect 
                            options={products}
                            value={formData.productId}
                            onChange={(id) => setFormData({...formData, productId: id, unitId: products.find(p => p.id === id)?.unitId || ''})}
                            lang={lang}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>{lang === 'ar' ? 'الكمية' : 'Quantity'}</label>
                            <input type="number" step="any" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})} required />
                        </div>
                        <div className="form-group">
                            <label>{lang === 'ar' ? 'الوحدة' : 'Unit'}</label>
                            <select value={formData.unitId} onChange={e => setFormData({...formData, unitId: e.target.value})} required>
                                <option value={selectedProduct?.unitId}>{selectedProduct?.unitRef?.nameAr || selectedProduct?.unitRef?.name || selectedProduct?.unit}</option>
                                {selectedProduct?.subUnitId && (
                                    <option value={selectedProduct.subUnitId}>{selectedProduct.subUnitRef?.nameAr || selectedProduct.subUnitRef?.name}</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>{lang === 'ar' ? 'المستودع' : 'Source Warehouse'}</label>
                            <select value={formData.warehouseId} onChange={e => setFormData({...formData, warehouseId: e.target.value})} required>
                                {warehouses.map(w => <option key={w.id} value={w.id}>{lang === 'ar' ? w.nameAr : w.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{lang === 'ar' ? 'تاريخ السند' : 'Date'}</label>
                            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{lang === 'ar' ? 'سبب الإتلاف' : 'Reason for Disposal'}</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select 
                                style={{ flex: 1 }}
                                value={['Expired','Damaged','Bad Storage','تاريخ منتهي','تلف / كسر','سوء تخزين'].includes(formData.reason) ? formData.reason : 'Other'} 
                                onChange={e => setFormData({...formData, reason: e.target.value === 'Other' ? '' : e.target.value})}
                            >
                                <option value="">-- {lang === 'ar' ? 'اختر السبب' : 'Select Reason'} --</option>
                                <option value={lang === 'ar' ? 'تاريخ منتهي' : 'Expired'}>{lang === 'ar' ? 'تاريخ منتهي' : 'Expired'}</option>
                                <option value={lang === 'ar' ? 'تلف / كسر' : 'Damaged'}>{lang === 'ar' ? 'تلف / كسر' : 'Damaged'}</option>
                                <option value={lang === 'ar' ? 'سوء تخزين' : 'Bad Storage'}>{lang === 'ar' ? 'سوء تخزين' : 'Bad Storage'}</option>
                                <option value="Other">{lang === 'ar' ? 'سبب آخر' : 'Other Reason'}</option>
                            </select>
                            {(!['Expired','Damaged','Bad Storage','تاريخ منتهي','تلف / كسر','سوء تخزين'].includes(formData.reason)) && (
                                <input style={{ flex: 1.5 }} type="text" placeholder={lang === 'ar' ? 'وضح السبب هنا...' : 'Explain here...'} value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} required />
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{lang === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}</label>
                        <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2} placeholder="..." />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                    <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ background: '#dc2626' }}>
                        {isSubmitting ? '...' : (lang === 'ar' ? 'حفظ وإتلاف الصنف' : 'Save & Dispose Item')}
                    </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {printVoucher && (
          <div className="print-preview-overlay">
              <div className="print-paper">
                  <div className="no-print" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                      <button className="btn-primary" onClick={() => window.print()}>{lang === 'ar' ? 'طباعة الآن' : 'Print Now'}</button>
                      <button className="btn-secondary" onClick={() => setPrintVoucher(null)}>{lang === 'ar' ? 'إغلاق' : 'Close'}</button>
                  </div>

                  <div className="print-header">
                      <div className="company-info">
                          <h1 style={{ margin: 0, color: '#1e293b' }}>{lang === 'ar' ? 'سند إتلاف صنف' : 'Item Disposal Voucher'}</h1>
                          <p>{new Date(printVoucher.date).toLocaleDateString()}</p>
                      </div>
                      <div className="order-meta">
                          <p><strong># {printVoucher.voucherNumber}</strong></p>
                          <p>{lang === 'ar' ? 'الحالة: نهائي' : 'Status: Final'}</p>
                      </div>
                  </div>

                  <div className="print-summary">
                      <div className="summary-item">
                          <label>{lang === 'ar' ? 'الصنف التالف:' : 'Disposed Item:'}</label>
                          <div className="value">{lang === 'ar' ? printVoucher.product?.nameAr : printVoucher.product?.name}</div>
                          <small>{printVoucher.product?.sku}</small>
                      </div>
                      <div className="summary-item">
                          <label>{lang === 'ar' ? 'الكمية الخارجة:' : 'Quantity Removed:'}</label>
                          <div className="value" style={{ fontSize: '1.5rem', color: '#dc2626' }}>
                              {printVoucher.quantity.toLocaleString(undefined, { minimumFractionDigits: 2 })} 
                              {' '}{lang === 'ar' ? (printVoucher.product?.unitRef?.nameAr || printVoucher.product?.unit) : (printVoucher.product?.unitRef?.name || printVoucher.product?.unit)}
                          </div>
                      </div>
                  </div>

                  <div className="print-body">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
                          <div className="summary-item">
                              <label>{lang === 'ar' ? 'المستودع:' : 'Source Warehouse:'}</label>
                              <div className="value">{lang === 'ar' ? printVoucher.warehouse?.nameAr : printVoucher.warehouse?.name}</div>
                          </div>
                          <div className="summary-item">
                              <label>{lang === 'ar' ? 'السبب:' : 'Reason:'}</label>
                              <div className="value">{printVoucher.reason}</div>
                          </div>
                      </div>
                      {printVoucher.notes && (
                          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                              <small style={{ color: '#64748b', fontWeight: 'bold' }}>{lang === 'ar' ? 'ملاحظات:' : 'Notes:'}</small>
                              <p style={{ margin: '0.5rem 0 0 0' }}>{printVoucher.notes}</p>
                          </div>
                      )}
                  </div>

                  <div className="print-footer" style={{ marginTop: '6rem' }}>
                      <div className="signature-box">
                          <p>{lang === 'ar' ? 'توقيع أمين المخزن:' : 'Storekeeper Signature:'}</p>
                          <div className="line"></div>
                      </div>
                      <div className="signature-box">
                          <p>{lang === 'ar' ? 'اعتماد المسؤول:' : 'Manager Approval:'}</p>
                          <div className="line"></div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <style jsx>{`
        .vouchers-module { display: flex; flex-direction: column; gap: 1rem; }
        .card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .card-title { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0; }
        
        .table-container { width: 100%; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #1e293b; padding: 1rem; font-size: 0.85rem; color: #ffffff; border-bottom: 2px solid #0f172a; font-weight: 900; }
        td { padding: 1rem; border-bottom: 1px solid rgba(0,0,0,0.05); color: #1e293b; font-size: 0.95rem; }
        
        .btn-icon { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 8px; color: #94a3b8; transition: all 0.2s; }
        .btn-icon:hover { background: #f1f5f9; color: #3b82f6; }
        .btn-icon.delete:hover { color: #dc2626; background: #fef2f2; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(8px); }
        .modal-content { background: white; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; }
        .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .close-btn { background: none; border: none; font-size: 2rem; cursor: pointer; color: #94a3b8; }
        
        .form-group label { display: block; margin-bottom: 0.5rem; color: #475569; font-weight: 600; font-size: 0.9rem; }
        .form-group select, .form-group input, .form-group textarea { width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1; font-family: inherit; font-size: 0.95rem; }
        .modal-footer { padding: 1.25rem 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 1rem; }

        /* Print Preview Style Match */
        .print-preview-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 2000; overflow-y: auto; padding: 2rem; display: flex; justify-content: center; }
        .print-paper { background: white; color: #1e293b; width: 210mm; min-height: 297mm; padding: 20mm; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
        .print-header { display: flex; justify-content: space-between; border-bottom: 2px solid #1e293b; padding-bottom: 1rem; margin-bottom: 2rem; }
        .print-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; background: #fff1f2; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border: 1px solid #fecaca; }
        .summary-item label { display: block; font-size: 0.75rem; color: #991b1b; font-weight: bold; text-transform: uppercase; margin-bottom: 0.25rem; }
        .summary-item .value { font-size: 1.2rem; font-weight: 800; color: #1e293b; }
        .print-footer { margin-top: 4rem; display: flex; justify-content: space-between; gap: 4rem; }
        .signature-box { flex: 1; text-align: center; }
        .signature-box p { font-size: 0.85rem; font-weight: bold; color: #475569; margin-bottom: 3rem; }
        .signature-box .line { border-bottom: 1.5px solid #1e293b; }
        
        @media print {
            .no-print { display: none !important; }
            .print-preview-overlay { position: absolute; top: 0; left:0; width: 100%; padding: 0; background: none; }
            .print-paper { box-shadow: none; width: 100%; height: auto; padding: 0; }
        }
      `}</style>
    </div>
  );
}

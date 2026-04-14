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
    <div className="vouchers-container">
      <div className="card">
        <div className="card-header">
           <h2 className="card-title">{lang === 'ar' ? 'سند إتلاف صنف' : 'Item Disposal Voucher'}</h2>
           <button className="btn-primary" onClick={openAdd} style={{ background: '#dc2626' }}>{lang === 'ar' ? '+ سند إتلاف جديد' : '+ New Disposal'}</button>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>{lang === 'ar' ? '#' : '#'}</th>
                <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th>{lang === 'ar' ? 'الصنف' : 'Item'}</th>
                <th>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                <th>{lang === 'ar' ? 'السبب' : 'Reason'}</th>
                <th>{lang === 'ar' ? 'المستودع' : 'Warehouse'}</th>
                <th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map(v => (
                <tr key={v.id}>
                  <td><code>{v.voucherNumber}</code></td>
                  <td>{new Date(v.date).toLocaleDateString()}</td>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{lang === 'ar' ? v.product?.nameAr : v.product?.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{v.product?.sku}</div>
                  </td>
                  <td style={{ fontWeight: 'bold' }}>{v.quantity} {lang === 'ar' ? (v.product?.unitRef?.nameAr || v.product?.unit) : (v.product?.unitRef?.name || v.product?.unit)}</td>
                  <td>{v.reason}</td>
                  <td>{lang === 'ar' ? v.warehouse?.nameAr : v.warehouse?.name}</td>
                  <td style={{ textAlign: 'right' }} className="no-print">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn-icon" onClick={() => setPrintVoucher(v)}>🖨️</button>
                        <button className="btn-icon" onClick={() => openEdit(v)}>✏️</button>
                        <button className="btn-icon delete" onClick={() => handleDelete(v.id)}>🗑️</button>
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
          <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
             <div className="modal-header">
                <h3>{editingVoucher ? (lang === 'ar' ? 'تعديل سند إتلاف' : 'Edit Disposal') : (lang === 'ar' ? 'سند إتلاف جديد' : 'New Disposal')}</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
             </div>
             <form onSubmit={handleSubmit}>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label>{lang === 'ar' ? 'الصنف' : 'Product'}</label>
                        <SearchableSelect 
                            options={products}
                            value={formData.productId}
                            onChange={(id) => setFormData({...formData, productId: id, unitId: products.find(p => p.id === id)?.unitId || ''})}
                            lang={lang}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>{lang === 'ar' ? 'الكمية' : 'Qty'}</label>
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

                    <div className="form-group">
                        <label>{lang === 'ar' ? 'المستودع' : 'Warehouse'}</label>
                        <select value={formData.warehouseId} onChange={e => setFormData({...formData, warehouseId: e.target.value})} required>
                            {warehouses.map(w => <option key={w.id} value={w.id}>{lang === 'ar' ? w.nameAr : w.name}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{lang === 'ar' ? 'السبب' : 'Reason'}</label>
                        <select 
                            value={['Expired','Damaged','Bad Storage','تاريخ منتهي','تلف / كسر','سوء تخزين'].includes(formData.reason) ? formData.reason : 'Other'} 
                            onChange={e => setFormData({...formData, reason: e.target.value === 'Other' ? '' : e.target.value})}
                        >
                            <option value="">-- {lang === 'ar' ? 'اختر' : 'Select'} --</option>
                            <option value={lang === 'ar' ? 'تاريخ منتهي' : 'Expired'}>{lang === 'ar' ? 'تاريخ منتهي' : 'Expired'}</option>
                            <option value={lang === 'ar' ? 'تلف / كسر' : 'Damaged'}>{lang === 'ar' ? 'تلف / كسر' : 'Damaged'}</option>
                            <option value={lang === 'ar' ? 'سوء تخزين' : 'Bad Storage'}>{lang === 'ar' ? 'سوء تخزين' : 'Bad Storage'}</option>
                            <option value="Other">{lang === 'ar' ? 'أخرى' : 'Other'}</option>
                        </select>
                    </div>

                    {(!['Expired','Damaged','Bad Storage','تاريخ منتهي','تلف / كسر','سوء تخزين'].includes(formData.reason)) && (
                        <div className="form-group">
                            <label>{lang === 'ar' ? 'وضح السبب' : 'Specify Reason'}</label>
                            <input type="text" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} required />
                        </div>
                    )}

                    <div className="form-group">
                        <label>{lang === 'ar' ? 'التاريخ' : 'Date'}</label>
                        <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                    </div>
                </div>
                <div className="modal-footer" style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                    <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ background: '#dc2626' }}>
                        {isSubmitting ? '...' : (lang === 'ar' ? 'حفظ السند' : 'Save Voucher')}
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
                      <button className="btn-primary" onClick={() => window.print()}>{lang === 'ar' ? 'طباعة' : 'Print'}</button>
                      <button className="btn-secondary" onClick={() => setPrintVoucher(null)}>{lang === 'ar' ? 'إغلاق' : 'Close'}</button>
                  </div>

                  <div className="voucher-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '2rem', color: '#000' }}>
                      <div>
                          <h1 style={{ margin: 0, color: '#000' }}>{lang === 'ar' ? 'سند إتلاف صنف' : 'Item Disposal Voucher'}</h1>
                          <p style={{ color: '#000' }}><strong># {printVoucher.voucherNumber}</strong></p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                          <p style={{ color: '#000' }}>{lang === 'ar' ? 'التاريخ:' : 'Date:'} {new Date(printVoucher.date).toLocaleDateString()}</p>
                      </div>
                  </div>

                  <div className="voucher-details" style={{ marginBottom: '3rem' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <tbody>
                              <tr>
                                  <td style={{ padding: '10px', border: '1px solid #000', background: '#f0f0f0', width: '30%' }}><strong>{lang === 'ar' ? 'الصنف:' : 'Item:'}</strong></td>
                                  <td style={{ padding: '10px', border: '1px solid #000' }}>
                                      {lang === 'ar' ? printVoucher.product?.nameAr : printVoucher.product?.name} ({printVoucher.product?.sku})
                                  </td>
                              </tr>
                              <tr>
                                  <td style={{ padding: '10px', border: '1px solid #000', background: '#f0f0f0' }}><strong>{lang === 'ar' ? 'الكمية:' : 'Quantity:'}</strong></td>
                                  <td style={{ padding: '10px', border: '1px solid #000', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                      {printVoucher.quantity} {lang === 'ar' ? (printVoucher.product?.unitRef?.nameAr || printVoucher.product?.unit) : (printVoucher.product?.unitRef?.name || printVoucher.product?.unit)}
                                  </td>
                              </tr>
                              <tr>
                                  <td style={{ padding: '10px', border: '1px solid #000', background: '#f0f0f0' }}><strong>{lang === 'ar' ? 'المستودع:' : 'Warehouse:'}</strong></td>
                                  <td style={{ padding: '10px', border: '1px solid #000' }}>
                                      {lang === 'ar' ? printVoucher.warehouse?.nameAr : printVoucher.warehouse?.name}
                                  </td>
                              </tr>
                              <tr>
                                  <td style={{ padding: '10px', border: '1px solid #000', background: '#f0f0f0' }}><strong>{lang === 'ar' ? 'السبب:' : 'Reason:'}</strong></td>
                                  <td style={{ padding: '10px', border: '1px solid #000' }}>{printVoucher.reason}</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>

                  <div className="signature-section" style={{ marginTop: '5rem', display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ width: '200px', textAlign: 'center' }}>
                          <p style={{ fontWeight: 'bold', marginBottom: '3rem', color: '#000' }}>{lang === 'ar' ? 'توقيع أمين المخزن' : 'Storekeeper Signature'}</p>
                          <div style={{ borderBottom: '1px solid #000' }}></div>
                      </div>
                      <div style={{ width: '200px', textAlign: 'center' }}>
                          <p style={{ fontWeight: 'bold', marginBottom: '3rem', color: '#000' }}>{lang === 'ar' ? 'توقيع المسؤول' : 'Supervisor Signature'}</p>
                          <div style={{ borderBottom: '1px solid #000' }}></div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <style jsx>{`
        .vouchers-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f8fafc; padding: 1rem; text-align: ${lang === 'ar' ? 'right' : 'left'}; font-size: 0.85rem; color: #475569; border-bottom: 2px solid #e2e8f0; }
        td { padding: 1rem; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
        .btn-icon { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; color: #94a3b8; transition: all 0.2s; }
        .btn-icon:hover { background: #f1f5f9; color: #2563eb; }
        .btn-icon.delete:hover { color: #dc2626; background: #fef2f2; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(8px); }
        .modal-content { background: white; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; }
        .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .close-btn { background: none; border: none; font-size: 1.8rem; cursor: pointer; color: #94a3b8; }
        
        .form-group label { display: block; margin-bottom: 0.5rem; color: #475569; font-weight: 600; font-size: 0.9rem; }
        .form-group select, .form-group input { width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1; font-family: inherit; }
        
        .print-preview-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 2000; overflow-y: auto; padding: 1rem; display: flex; justify-content: center; }
        .print-paper { background: white; width: 210mm; min-height: 297mm; padding: 20mm; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
        
        @media print {
            .no-print { display: none !important; }
            .print-preview-overlay { position: static; padding: 0; background: none; }
            .print-paper { box-shadow: none; width: 100%; padding: 0; color: #000 !important; }
            .print-paper * { color: #000 !important; }
            .voucher-details td { color: #000 !important; border: 1px solid #000 !important; }
        }
      `}</style>
    </div>
  );
}

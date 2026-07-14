'use client';

import { useState } from 'react';
import { createStockTransfer, dispatchStockTransfer, receiveStockTransfer, uploadTransferAttachment, cancelStockTransfer, uploadReceiverAttachment } from './actions';

export default function WarehouseTransfersClient({
  lang,
  allWarehouses,
  initialProducts,
  initialStocks,
  initialTransfers,
  companyId
}: {
  lang: string,
  allWarehouses: any[],
  initialProducts: any[],
  initialStocks: any[],
  initialTransfers: any[],
  companyId: string
}) {
  const [transfers, setTransfers] = useState(initialTransfers);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [fromWarehouseId, setFromWarehouseId] = useState('');
  const [toWarehouseId, setToWarehouseId] = useState('');
  const [notes, setNotes] = useState('');
  const [transferItems, setTransferItems] = useState([{ productId: '', quantity: 1 }]);

  // Attachment upload state for a specific transfer
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleAddItem = () => setTransferItems([...transferItems, { productId: '', quantity: 1 }]);
  
  const handleRemoveItem = (index: number) => {
    setTransferItems(transferItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...transferItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setTransferItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromWarehouseId || !toWarehouseId) {
      alert(lang === 'ar' ? 'الرجاء اختيار المستودع المصدر والمستودع الوجهة' : 'Please select source and destination warehouses');
      return;
    }
    if (fromWarehouseId === toWarehouseId) {
      alert(lang === 'ar' ? 'لا يمكن النقل لنفس المستودع' : 'Cannot transfer to the same warehouse');
      return;
    }
    const validItems = transferItems.filter(i => i.productId && i.quantity > 0);
    if (validItems.length === 0) {
      alert(lang === 'ar' ? 'الرجاء اختيار أصناف صالحة للنقل' : 'Please select valid items to transfer');
      return;
    }
    
    // Check available quantities
    for (const item of validItems) {
      const stock = initialStocks.find(s => s.warehouseId === fromWarehouseId && s.productId === item.productId);
      const available = stock ? stock.quantity : 0;
      if (item.quantity > available) {
        const product = initialProducts.find(p => p.id === item.productId);
        const name = product?.nameAr || product?.name;
        alert(lang === 'ar' ? `الكمية المدخلة للصنف ${name} (${item.quantity}) تتجاوز المتوفر (${available})` : `Quantity for ${name} (${item.quantity}) exceeds available (${available})`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await createStockTransfer({
        fromWarehouseId,
        toWarehouseId,
        notes,
        items: validItems
      });
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = (t: any) => {
    if (t.receiverAttachmentUrl) {
      window.open(t.receiverAttachmentUrl, '_blank');
      return;
    }
    if (t.attachmentUrl) {
      window.open(t.attachmentUrl, '_blank');
      return;
    }

    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 2rem; direction: rtl;">
        <h1 style="text-align: center;">${lang === 'ar' ? 'سند تحويل مخزني' : 'Stock Transfer Document'}</h1>
        <hr />
        <p><strong>${lang === 'ar' ? 'رقم التحويل' : 'Transfer No'}:</strong> ${t.transferNumber}</p>
        <p><strong>${lang === 'ar' ? 'التاريخ' : 'Date'}:</strong> ${new Date(t.date).toLocaleDateString()}</p>
        <p><strong>${lang === 'ar' ? 'من مستودع' : 'From Warehouse'}:</strong> ${t.fromWarehouse?.nameAr || t.fromWarehouse?.name}</p>
        <p><strong>${lang === 'ar' ? 'إلى مستودع' : 'To Warehouse'}:</strong> ${t.toWarehouse?.nameAr || t.toWarehouse?.name}</p>
        ${t.notes ? `<p><strong>${lang === 'ar' ? 'ملاحظات' : 'Notes'}:</strong> ${t.notes}</p>` : ''}
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 0.5rem;">${lang === 'ar' ? 'الصنف' : 'Item'}</th>
              <th style="border: 1px solid #ccc; padding: 0.5rem;">${lang === 'ar' ? 'الكمية' : 'Quantity'}</th>
            </tr>
          </thead>
          <tbody>
            ${t.items.map((i: any) => `
              <tr>
                <td style="border: 1px solid #ccc; padding: 0.5rem;">${i.product?.nameAr || i.product?.name}</td>
                <td style="border: 1px solid #ccc; padding: 0.5rem;">${i.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; margin-top: 4rem;">
          <div style="text-align: center;">
            <p><strong>${lang === 'ar' ? 'أمين المستودع المُرسِل' : 'Sender Warehouse Manager'}</strong></p>
            <p>.......................................</p>
            <p>${lang === 'ar' ? 'التوقيع' : 'Signature'}</p>
          </div>
          <div style="text-align: center;">
            <p><strong>${lang === 'ar' ? 'أمين المستودع المُستقبِل' : 'Receiver Warehouse Manager'}</strong></p>
            <p>.......................................</p>
            <p>${lang === 'ar' ? 'التوقيع' : 'Signature'}</p>
          </div>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(id);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('companyId', companyId);

    try {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');

      const res = await uploadTransferAttachment(id, uploadData.url);
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingId(null);
    }
  };

  const handleUploadReceiverAttachment = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(id);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('companyId', companyId);

    try {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');

      const res = await uploadReceiverAttachment(id, uploadData.url);
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingId(null);
    }
  };

  const handleDispatch = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من إرسال البضاعة؟ (سيتم خصمها من المستودع المصدر)' : 'Are you sure to dispatch? (Will deduct from source)')) return;
    
    setIsSubmitting(true);
    try {
      const res = await dispatchStockTransfer(id);
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceive = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من استلام البضاعة؟ (سيتم إضافتها لمستودعك)' : 'Are you sure to receive? (Will add to destination)')) return;
    
    setIsSubmitting(true);
    try {
      const res = await receiveStockTransfer(id);
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من إلغاء أمر النقل هذا؟' : 'Are you sure you want to cancel this transfer?')) return;
    
    setIsSubmitting(true);
    try {
      const res = await cancelStockTransfer(id);
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="header-actions" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <h2>{lang === 'ar' ? 'التحويلات المخزنية' : 'Stock Transfers'}</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          {lang === 'ar' ? 'إنشاء أمر تحويل' : 'Create Transfer'} 🚚
        </button>
      </div>

      <div className="transfers-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {transfers.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <p className="text-sub">{lang === 'ar' ? 'لا توجد تحويلات سابقة' : 'No past transfers'}</p>
          </div>
        ) : (
          transfers.map(t => (
            <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#fff' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {t.transferNumber}
                  <span className={`badge ${t.status === 'Completed' ? 'badge-success' : t.status === 'Dispatched' ? 'badge-primary' : t.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                    {t.status === 'Completed' ? (lang === 'ar' ? 'مكتمل' : 'Completed') : 
                     t.status === 'Dispatched' ? (lang === 'ar' ? 'تم الإرسال' : 'Dispatched') : 
                     t.status === 'Cancelled' ? (lang === 'ar' ? 'ملغي' : 'Cancelled') : 
                     (lang === 'ar' ? 'قيد التنفيذ' : 'Pending')}
                  </span>
                </h4>
                <p className="text-sub" style={{ margin: 0 }}>
                  <strong>{lang === 'ar' ? 'من:' : 'From:'}</strong> {t.fromWarehouse?.nameAr || t.fromWarehouse?.name} ➡️ 
                  <strong>{lang === 'ar' ? 'إلى:' : 'To:'}</strong> {t.toWarehouse?.nameAr || t.toWarehouse?.name}
                </p>
                <p className="text-sub" style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem' }}>
                  {new Date(t.date).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={() => handlePrint(t)} className="btn-secondary btn-sm">
                  {lang === 'ar' ? 'طباعة / عرض' : 'Print / View'} 🖨️
                </button>

                {t.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <label className="btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                      {uploadingId === t.id ? (lang === 'ar' ? 'جاري الرفع...' : 'Uploading...') : (lang === 'ar' ? (t.attachmentUrl ? 'إعادة الإرفاق' : 'إرفاق ملف') : 'Upload File')} 📤
                      <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => handleUploadAttachment(e, t.id)} disabled={uploadingId === t.id} />
                    </label>
                    <label className="btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }} title={lang === 'ar' ? 'التقاط صورة بالكاميرا' : 'Take a picture with camera'}>
                      {uploadingId === t.id ? '...' : (lang === 'ar' ? 'تصوير' : 'Camera')} 📷
                      <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => handleUploadAttachment(e, t.id)} disabled={uploadingId === t.id} />
                    </label>
                  </div>
                )}

                {t.status === 'Pending' && t.attachmentUrl && (
                  <button onClick={() => handleDispatch(t.id)} className="btn-primary btn-sm" disabled={isSubmitting}>
                    {lang === 'ar' ? 'تأكيد الإرسال' : 'Confirm Dispatch'} 🚚
                  </button>
                )}

                {t.status === 'Dispatched' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <label className="btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                      {uploadingId === t.id ? (lang === 'ar' ? 'جاري الرفع...' : 'Uploading...') : (lang === 'ar' ? (t.receiverAttachmentUrl ? 'إعادة الإرفاق' : 'إرفاق ملف') : 'Upload File')} 📤
                      <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => handleUploadReceiverAttachment(e, t.id)} disabled={uploadingId === t.id} />
                    </label>
                    <label className="btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }} title={lang === 'ar' ? 'التقاط صورة بالكاميرا' : 'Take a picture with camera'}>
                      {uploadingId === t.id ? '...' : (lang === 'ar' ? 'تصوير' : 'Camera')} 📷
                      <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => handleUploadReceiverAttachment(e, t.id)} disabled={uploadingId === t.id} />
                    </label>
                  </div>
                )}
                
                {t.status === 'Dispatched' && t.receiverAttachmentUrl && (
                  <button onClick={() => handleReceive(t.id)} className="btn-success btn-sm" disabled={isSubmitting}>
                    {lang === 'ar' ? 'تأكيد الاستلام' : 'Confirm Receipt'} ✓
                  </button>
                )}

                {(t.status === 'Pending' || t.status === 'Dispatched') && (
                  <button onClick={() => handleCancel(t.id)} className="btn-danger btn-sm" disabled={isSubmitting}>
                    {lang === 'ar' ? 'إلغاء الطلب' : 'Cancel'} ❌
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem' }}>
            <div className="modal-header">
              <h2>{lang === 'ar' ? 'أمر تحويل مخزني جديد' : 'New Stock Transfer'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>{lang === 'ar' ? 'من مستودع (المصدر)' : 'From Warehouse (Source)'}</label>
                  <select value={fromWarehouseId} onChange={e => setFromWarehouseId(e.target.value)} required>
                    <option value="">{lang === 'ar' ? '-- اختر المستودع --' : '-- Select Warehouse --'}</option>
                    {allWarehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.code} - {w.nameAr || w.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>{lang === 'ar' ? 'إلى مستودع (الوجهة)' : 'To Warehouse (Destination)'}</label>
                  <select value={toWarehouseId} onChange={e => setToWarehouseId(e.target.value)} required>
                    <option value="">{lang === 'ar' ? '-- اختر المستودع --' : '-- Select Warehouse --'}</option>
                    {allWarehouses.map(w => (
                      <option key={w.id} value={w.id} disabled={w.id === fromWarehouseId}>{w.code} - {w.nameAr || w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>{lang === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}</label>
                <input type="text" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              <div>
                <h4 style={{ margin: '0.5rem 0' }}>{lang === 'ar' ? 'الأصناف المراد نقلها' : 'Items to Transfer'}</h4>
                {transferItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <select 
                      value={item.productId} 
                      onChange={e => handleItemChange(idx, 'productId', e.target.value)}
                      required
                      style={{ flex: 1, minWidth: '200px' }}
                    >
                      <option value="">{lang === 'ar' ? '-- اختر الصنف --' : '-- Select Product --'}</option>
                      {initialProducts.map(p => {
                        const stock = initialStocks.find(s => s.warehouseId === fromWarehouseId && s.productId === p.id);
                        const available = stock ? stock.quantity : 0;
                        const formattedAvailable = available.toLocaleString(undefined, { maximumFractionDigits: 2 });
                        return (
                          <option key={p.id} value={p.id}>
                            {p.sku} - {p.nameAr || p.name} ({lang === 'ar' ? 'المتوفر:' : 'Available:'} {formattedAvailable})
                          </option>
                        );
                      })}
                    </select>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={e => handleItemChange(idx, 'quantity', parseFloat(e.target.value))}
                      required
                      min="0.01"
                      step="0.01"
                      style={{ width: '120px' }}
                    />
                    <button type="button" onClick={() => handleRemoveItem(idx)} className="btn-danger" style={{ padding: '0.5rem 1rem' }}>X</button>
                  </div>
                ))}
                <button type="button" onClick={handleAddItem} className="btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>
                  {lang === 'ar' ? 'إضافة صنف آخر' : '+ Add another item'}
                </button>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ أمر النقل (قيد الانتظار)' : 'Save Transfer (Pending)')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

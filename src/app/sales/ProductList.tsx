'use client';

import { useState } from 'react';
import { createProduct, updateProduct, deleteProduct, translateText, createUnit, bulkCreateProducts, deleteAllProducts, deleteProducts } from './actions';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useUser } from '@/components/UserContext';

export default function ProductList({ products, units, warehouses, suppliers, categories, lang, dict, onViewItemCard }: { products: any[], units: any[], warehouses: any[], suppliers: any[], categories: any[], lang: string, dict: any, onViewItemCard?: (id: string) => void }) {
  const { canAccess } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const [showUnitModal, setShowUnitModal] = useState(false);
  const [newUnit, setNewUnit] = useState({ name: '', nameAr: '' });
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    nameAr: '',
    classification: 'Finished Product', 
    costPrice: 0,
    salePrice: 0,
    unit: 'Piece',
    unitId: '',
    unitQuantity: 1,
    subUnitId: '',
    categoryId: '',
    caloriesPer100g: 0,
    category: '',
    reorderPoint: 0,
    expiryDate: '',
    supplierId: ''
  });

  const filtered = (products || []).filter(p => {
    const s = (searchTerm || '').toLowerCase();
    const matchesSearch = (
      (p?.name || '').toLowerCase().includes(s) ||
      (p?.nameAr || '').toLowerCase().includes(s) ||
      (p?.sku || '').toLowerCase().includes(s)
    );

    let matchesStock = true;
    if (stockFilter === 'out') {
      matchesStock = p.stockQuantity <= 0;
    } else if (stockFilter === 'low') {
      matchesStock = p.stockQuantity > 0 && p.stockQuantity <= (p.reorderPoint || 0);
    }
    
    return matchesSearch && matchesStock;
  });

  const openAdd = () => {
    setEditingItem(null);
    setFormData({
      sku: '', name: '', nameAr: '', classification: 'Finished Product',
      costPrice: 0, salePrice: 0, unit: 'Piece', unitId: units[0]?.id || '', subUnitId: '', 
      categoryId: '', caloriesPer100g: 0,
      category: '', reorderPoint: 0, unitQuantity: 1, expiryDate: '', supplierId: ''
    });
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditingItem(p);
    setFormData({
      sku: p.sku, 
      name: p.name, 
      nameAr: p.nameAr || '', 
      classification: p.classification || 'Finished Product',
      costPrice: p.costPrice || 0, 
      salePrice: p.salePrice || 0, 
      unit: p.unit || 'Piece',
      unitId: p.unitId || '',
      caloriesPer100g: p.caloriesPer100g || 0,
      category: p.category || '',
      categoryId: p.categoryId || '',
      reorderPoint: p.reorderPoint || 0,
      unitQuantity: p.unitQuantity || 1,
      subUnitId: p.subUnitId || '',
      expiryDate: p.expiryDate ? new Date(p.expiryDate).toISOString().split('T')[0] : '',
      supplierId: p.supplierId || ''
    });
    setShowModal(true);
  };

  const handleTranslate = async () => {
    if (formData.name && !formData.nameAr) {
      setIsTranslating(true);
      const res = await translateText(formData.name, 'en', 'ar');
      if (res.success) setFormData({ ...formData, nameAr: res.text });
      setIsTranslating(false);
    } else if (formData.nameAr && !formData.name) {
      setIsTranslating(true);
      const res = await translateText(formData.nameAr, 'ar', 'en');
      if (res.success) setFormData({ ...formData, name: res.text });
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let res;
      if (editingItem) {
        res = await updateProduct(editingItem.id, formData);
      } else {
        res = await createProduct(formData);
      }
      
      if (res.success) {
        setShowModal(false);
      } else {
        alert(res.error || (lang === 'ar' ? 'فشلت العملية' : 'Operation failed'));
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من الحذف؟ سيتم حذف كافة الارتباطات لهذا الصنف.' : 'Are you sure? This will delete all relations.')) {
      const res = await deleteProduct(id, lang);
      if (!res.success) {
        alert(res.error);
      }
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = (filteredItems: any[]) => {
    if (selectedIds.length === filteredItems.length && filteredItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(p => p.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const res = await deleteProducts(selectedIds, lang) as any;
      if (res.success) {
        if (res.failCount > 0) {
          if (res.successCount === 0) {
            alert((lang === 'ar' ? 'لم يتم حذف أي صنف لارتباطهم ببيانات أخرى:\n' : 'No items deleted due to existing dependencies:\n') + res.errors.join('\n'));
          } else {
            alert((lang === 'ar' ? `تم حذف ${res.successCount} أصناف، ولكن تعذر حذف ${res.failCount} أصناف أخرى:\n` : `Deleted ${res.successCount} items, but could not delete ${res.failCount} others:\n`) + res.errors.join('\n'));
          }
        } else {
          alert(lang === 'ar' ? 'تم حذف كافة الأصناف المحددة بنجاح' : 'All selected items deleted successfully');
        }
        setSelectedIds([]);
        setSelectionMode(false);
      } else {
        alert((lang === 'ar' ? 'خطأ في العملية: ' : 'Error: ') + res.error);
      }
    } catch (err: any) {
      alert((lang === 'ar' ? 'حدث خطأ غير متوقع: ' : 'Unexpected error: ') + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getClassificationLabel = (val: string) => {
    if (lang === 'ar') {
      if (val === 'Raw Material') return 'مادة خام';
      if (val === 'Semi-finished') return 'منتج شبه تام';
      if (val === 'Finished Product') return 'منتج تام';
      return val || 'غير مصنف';
    }
    return val || 'N/A';
  };

  const handleExport = () => {
    const dataToExport = products.map(p => ({
       'SKU': p.sku,
       'Name (AR)': p.nameAr || '',
       'Name (EN)': p.name || '',
       'Classification': p.classification,
       'Category': p.category || '',
       'Cost': p.costPrice,
       'Price': p.salePrice,
       'Stock': p.stockQuantity,
       'Unit': lang === 'ar' ? (p.unitRef?.nameAr || p.unit) : (p.unitRef?.name || p.unit)
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "Accounting_Products.xlsx");
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Products');
    const unitSheet = workbook.addWorksheet('Units (Helper)', { state: 'hidden' });

    // 1. Setup Headers
    sheet.columns = [
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Name (AR)', key: 'nameAr', width: 25 },
      { header: 'Name (EN)', key: 'nameEn', width: 25 },
      { header: 'Classification', key: 'classification', width: 20 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Cost', key: 'cost', width: 10 },
      { header: 'Price', key: 'price', width: 10 },
      { header: 'Stock', key: 'stock', width: 10 },
      { header: 'Unit', key: 'unit', width: 15 },
      { header: 'Sub-Units in Main', key: 'unitQty', width: 18 },
      { header: 'SubUnit', key: 'subUnit', width: 15 },
      { header: 'Category', key: 'cat', width: 20 },
      { header: 'Calories', key: 'kcal', width: 12 }
    ];

    // 2. Add Reference Sheets
    const unitList = units.map(u => lang === 'ar' ? (u.nameAr || u.name) : u.name);
    unitList.forEach((u, i) => unitSheet.getCell(i + 1, 1).value = u);

    const categoryList = categories.map(c => lang === 'ar' ? (c.nameAr || c.name) : c.name);
    const catSheet = workbook.addWorksheet('Cats (Helper)', { state: 'hidden' });
    categoryList.forEach((c, i) => catSheet.getCell(i + 1, 1).value = c);

    // 3. Add Sample Data
    const sampleRow = {
      sku: 'FIN-0001',
      nameAr: 'صنف تجريبي',
      nameEn: 'Sample Item',
      classification: 'Finished Product',
      category: 'General',
      cost: 10,
      price: 20,
      stock: 100,
      unit: unitList[0] || 'Piece',
      unitQty: 1,
      subUnit: unitList[0] || 'Piece',
      cat: categoryList[0] || 'General',
      kcal: 150
    };
    sheet.addRow(sampleRow);

    // 4. Add Data Validations
    const classificationList = ['"Raw Material,Semi-finished,Finished Product"'];
    const unitRange = `'Units (Helper)'!$A$1:$A$${unitList.length || 1}`;
    const catRange = `'Cats (Helper)'!$A$1:$A$${categoryList.length || 1}`;

    for (let i = 2; i <= 100; i++) {
       sheet.getCell(`D${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: classificationList };
       sheet.getCell(`I${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: [unitRange] };
       sheet.getCell(`K${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: [unitRange] };
       sheet.getCell(`L${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: [catRange] };
    }

    // 5. Generate and Save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, "Products_Import_Template_v2.xlsx");
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
     if (!e.target.files?.[0]) return;
     const file = e.target.files[0];
     setImportLoading(true);
     try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const mappedData = jsonData.map((item: any) => {
           // Helper to get value from multiple possible header keys
           const getVal = (keys: string[]) => {
             for (const k of keys) {
               if (item[k] !== undefined) return item[k];
             }
             return undefined;
           };

           // Detection for classification
           let clsRaw = getVal(['Classification', 'التصنيف', 'Type', 'النوع']);
           let cls = (typeof clsRaw === 'string') ? clsRaw.trim() : clsRaw;
           
           if (cls === 'مادة خام' || cls === 'Raw Material') cls = 'Raw Material';
           else if (cls === 'منتج شبه تام' || cls === 'Semi-finished') cls = 'Semi-finished';
           else if (cls === 'منتج تام' || cls === 'Finished Product') cls = 'Finished Product';

           return {
            sku: getVal(['SKU', 'رقم الصنف', 'Code', 'كود']),
            name: getVal(['Name (EN)', 'الاسم بالإنجليزية', 'Name', 'الاسم']),
            nameAr: getVal(['Name (AR)', 'الاسم بالعربية', 'NameAr', 'الاسم عربي']),
            category: getVal(['Category', 'القسم', 'المجموعة']),
            classification: cls || 'Finished Product',
            unit: getVal(['Unit', 'الوحدة', 'Main Unit']),
            subUnit: getVal(['SubUnit', 'الوحدة الصغرى', 'Base Unit']),
            costPrice: parseFloat(getVal(['Cost', 'التكلفة', 'Cost Price'])) || 0,
            salePrice: parseFloat(getVal(['Price', 'السعر', 'Sale Price'])) || 0,
            stockQuantity: parseFloat(getVal(['Stock', 'الكمية', 'Current Stock'])) || 0,
            unitQuantity: parseFloat(getVal(['Sub-Units in Main', 'الكمية في الوحدة', 'Unit Qty'])) || 1,
            calories: parseFloat(getVal(['Calories', 'السعرات', 'Kcal'])) || 0,
           };
        });

        const res = await bulkCreateProducts(mappedData);
        if (res.success) {
           alert(res.message);
           setShowImportModal(false);
        } else {
           alert(res.error);
        }
     } catch (err: any) {
        alert("خطأ في قراءة الملف: " + err.message);
     } finally {
        setImportLoading(false);
     }
  };

  const handleDeleteAll = async () => {
     if (confirm(lang === 'ar' ? 'تحذير: هذا سيحذف كافة المنتجات، حركات المخزن، وفواتير المبيعات المرتبطة. هل أنت متأكد؟' : 'Warning: This will delete ALL products and related data. Proceed?')) {
        const res = await deleteAllProducts();
        if (res.success) alert(lang === 'ar' ? 'تم حذف كافة البيانات بنجاح' : 'Success');
        else alert(res.error);
     }
  };

  return (
    <div className="products-module" suppressHydrationWarning={true}>
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">{lang === 'ar' ? 'مركز تكلفة الأصناف والمنتجات' : 'Products Cost Center'}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary no-print" onClick={handleExport}>
                {lang === 'ar' ? '📤 تصدير إكسيل' : 'Export Excel'}
              </button>
              {canAccess('inventory', 'create') && (
                <button className="btn-secondary no-print" onClick={() => setShowImportModal(true)}>
                  {lang === 'ar' ? '📥 استيراد' : 'Import'}
                </button>
              )}
              {canAccess('inventory', 'create') && (
                <button className="btn-primary no-print" onClick={openAdd}>
                  {lang === 'ar' ? '+ صنف جديد' : '+ New Item'}
                </button>
              )}
              
              {canAccess('inventory', 'delete') && (
                <div style={{ position: 'relative' }}>
                  <button 
                    className="btn-secondary no-print" 
                    style={{ color: '#ef4444', borderColor: '#ef4444' }} 
                    onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                  >
                    {lang === 'ar' ? '🗑️ حذف' : '🗑️ Delete'}
                  </button>
                  {showDeleteMenu && (
                    <>
                      <div 
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} 
                        onClick={() => setShowDeleteMenu(false)} 
                      />
                      <div style={{ 
                        position: 'absolute', top: '100%', right: lang === 'ar' ? 'auto' : 0, left: lang === 'ar' ? 0 : 'auto',
                        background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', zIndex: 100, 
                        minWidth: '200px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)', overflow: 'hidden', marginTop: '8px'
                      }}>
                        <button 
                          style={{ width: '100%', padding: '0.8rem 1rem', textAlign: lang === 'ar' ? 'right' : 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }} 
                          onClick={() => { setSelectionMode(true); setShowDeleteMenu(false); }}
                        >
                          <span>📋</span> {lang === 'ar' ? 'تحديد أصناف للحذف' : 'Select items to delete'}
                        </button>
                        <button 
                          style={{ width: '100%', padding: '0.8rem 1rem', textAlign: lang === 'ar' ? 'right' : 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#ef4444', borderTop: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '8px' }} 
                          onClick={() => { handleDeleteAll(); setShowDeleteMenu(false); }}
                        >
                          <span>🔥</span> {lang === 'ar' ? 'حذف كافة الأصناف' : 'Delete All Products'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {selectionMode && (
                <div style={{ display: 'flex', gap: '0.5rem', animation: 'fadeIn 0.2s' }}>
                   <button className="btn-primary no-print" onClick={handleDeleteSelected} style={{ background: '#ef4444' }} disabled={selectedIds.length === 0}>
                     {lang === 'ar' ? `تأكيد الحذف (${selectedIds.length})` : `Confirm Delete (${selectedIds.length})`}
                   </button>
                   <button className="btn-secondary no-print" onClick={() => { setSelectionMode(false); setSelectedIds([]); }}>
                     {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                   </button>
                </div>
              )}
          </div>
        </div>

        <div className="filter-bar no-print" style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
           <input 
             type="text" 
             placeholder={lang === 'ar' ? "البحث عن صنف (الاسم، الكود)..." : "Search items (Name, SKU)..."}
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="search-input"
             style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '8px' }}
           />
           <select 
             value={stockFilter} 
             onChange={e => setStockFilter(e.target.value as any)}
             style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
           >
             <option value="all">{lang === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
             <option value="low">{lang === 'ar' ? 'أوشك على النفاذ' : 'Low Stock'}</option>
             <option value="out">{lang === 'ar' ? 'نفد المخزون' : 'Out of Stock'}</option>
           </select>
           <button className="btn-secondary" onClick={() => window.print()}>
             {lang === 'ar' ? '🖨️ طباعة' : '🖨️ Print'}
           </button>
        </div>

        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {selectionMode && (
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={filtered.length > 0 && selectedIds.length === filtered.length}
                      onChange={() => handleSelectAll(filtered)}
                    />
                  </th>
                )}
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'رقم الصنف' : 'SKU / Code'}</th>
                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{lang === 'ar' ? 'اسم الصنف' : 'Name'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'التصنيف' : 'Classification'}</th>
                <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'التكلفة (شامل الضريبة)' : 'Cost (Inc. VAT)'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'السعرات' : 'Calories'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'حالة المخزون' : 'Stock Status'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'وحدة القياس' : 'Unit'}</th>
                <th style={{ textAlign: 'center' }}>{lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry'}</th>
                <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الحد الأدنى' : 'Min. Qty'}</th>
                <th style={{ textAlign: 'right' }}>{lang === 'ar' ? 'الكمية' : 'Stock'}</th>
                <th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {(filtered || []).map(p => (
                <tr key={p.id} style={{ background: selectedIds.includes(p.id) ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}>
                  {selectionMode && (
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(p.id)} 
                        onChange={() => handleSelectOne(p.id)}
                      />
                    </td>
                  )}
                  <td>
                    <button 
                      onClick={() => onViewItemCard && onViewItemCard(p.id)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'monospace', color: '#3b82f6', fontWeight: 'bold', textDecoration: 'underline' }}
                    >
                      {p.sku}
                    </button>
                  </td>
                  <td>
                    <div 
                      onClick={() => onViewItemCard && onViewItemCard(p.id)}
                      style={{ fontWeight: '600', cursor: 'pointer', color: '#3b82f6' }}
                      title={lang === 'ar' ? 'عرض بطاقة الصنف' : 'View Item Card'}
                    >
                      {lang === 'ar' && p.nameAr ? p.nameAr : p.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{p.category}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ 
                        padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', 
                        background: p.classification === 'Raw Material' ? 'rgba(234, 179, 8, 0.1)' : 
                                   p.classification === 'Semi-finished' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                        color: p.classification === 'Raw Material' ? '#ca8a04' : 
                                p.classification === 'Semi-finished' ? '#2563eb' : '#16a34a'
                    }}>
                        {getClassificationLabel(p.classification)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '500' }}>
                    {(p.costPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {p.caloriesPer100g > 0 ? (
                        <div style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold', display: 'inline-block' }}>
                            {p.caloriesPer100g.toFixed(1)} <small>kcal</small>
                        </div>
                    ) : (
                        <span style={{ color: '#cbd5e1' }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {p.stockQuantity <= 0 ? (
                      <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{lang === 'ar' ? 'نفد المخزون' : 'Out of Stock'}</span>
                    ) : p.stockQuantity <= (p.reorderPoint || 0) ? (
                      <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{lang === 'ar' ? 'أوشك على النفاذ' : 'Low Stock'}</span>
                    ) : (
                      <span style={{ color: '#10b981' }}>{lang === 'ar' ? 'متوفر' : 'In Stock'}</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span className="badge">
                            {lang === 'ar' ? (p.unitRef?.nameAr || p.unit) : (p.unitRef?.name || p.unit)}
                        </span>
                        {p.subUnitId && (
                            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '500' }}>
                                1 {lang === 'ar' ? (p.unitRef?.nameAr || p.unit) : (p.unitRef?.name || p.unit)} = {p.unitQuantity} {lang === 'ar' ? (p.subUnitRef?.nameAr || 'غم') : (p.subUnitRef?.name || 'g')}
                            </div>
                        )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '0.8rem', color: p.expiryDate && new Date(p.expiryDate) < new Date() ? 'var(--accent-danger)' : 'inherit' }}>
                    {p.expiryDate ? new Date(p.expiryDate).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US') : '—'}
                  </td>
                  <td style={{ textAlign: 'right', color: '#64748b' }}>
                    {(p.reorderPoint || 0).toLocaleString(undefined, { minimumFractionDigits: 1 })}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: (p.stockQuantity || 0) <= (p.reorderPoint || 0) ? '#dc2626' : 'inherit' }}>
                    {(p.stockQuantity || 0).toLocaleString(undefined, { minimumFractionDigits: 1 })}
                  </td>
                  <td className="no-print" style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {canAccess('inventory', 'edit') && (
                          <button className="btn-icon" onClick={() => openEdit(p)}>✏️</button>
                        )}
                        {canAccess('inventory', 'delete') && (
                          <button className="btn-icon delete" onClick={() => handleDelete(p.id)}>🗑️</button>
                        )}
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
          <div className="modal-content" style={{ maxWidth: '650px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3>{editingItem ? (lang === 'ar' ? 'تعديل صنف' : 'Edit Item') : (lang === 'ar' ? 'صنف جديد' : 'New Item')}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="product-form" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="modal-body-scroll" style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                <div className="form-grid">
                    <div className="form-group">
                    <label>{lang === 'ar' ? 'رقم الصنف (اتركه فارغاً للتوليد التلقائي)' : 'SKU / Code (Leave empty to auto-generate)'}</label>
                    <input value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                    </div>
                    <div className="form-group">
                    <label>{lang === 'ar' ? 'تاريخ انتهاء الصلاحية' : 'Expiry Date'}</label>
                    <input type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label>{lang === 'ar' ? 'الاسم الأصلي (AR)' : 'Arabic Name (AR)'}</label>
                            <button type="button" onClick={handleTranslate} disabled={isTranslating} style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                {isTranslating ? '...' : (lang === 'ar' ? '🔄 ترجمة للإنجليزية' : '🔄 Translate to EN')}
                            </button>
                        </div>
                    <input required value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} dir="rtl" />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>{lang === 'ar' ? 'الاسم بالإنجليزية (EN)' : 'English Name (EN)'}</label>
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                    <label>{lang === 'ar' ? 'القسم' : 'Category'}</label>
                    <input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                    </div>
                    <div className="form-group">
                    <label>{lang === 'ar' ? 'التصنيف' : 'Classification'}</label>
                    <select value={formData.classification} onChange={e => setFormData({...formData, classification: e.target.value})}>
                        <option value="Raw Material">{lang === 'ar' ? 'مادة خام' : 'Raw Material'}</option>
                        <option value="Semi-finished">{lang === 'ar' ? 'منتج شبه تام' : 'Semi-finished'}</option>
                        <option value="Finished Product">{lang === 'ar' ? 'منتج تام' : 'Finished Product'}</option>
                    </select>
                    </div>
                    <div className="form-group">
                        <label>{lang === 'ar' ? 'وحدة القياس' : 'Unit'}</label>
                        <select value={formData.unitId} onChange={e => setFormData({...formData, unitId: e.target.value})}>
                            <option value="">-- {lang === 'ar' ? 'الوحدة' : 'Unit'} --</option>
                            {units.map(u => (<option key={u.id} value={u.id}>{lang === 'ar' ? u.nameAr : u.name}</option>))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{lang === 'ar' ? 'الوحدة الصغرى' : 'Sub-Unit'}</label>
                        <select value={formData.subUnitId} onChange={e => setFormData({...formData, subUnitId: e.target.value})}>
                            <option value="">-- {lang === 'ar' ? 'الوحدة الصغرى' : 'Sub-Unit'} --</option>
                            {units.map(u => (<option key={u.id} value={u.id}>{lang === 'ar' ? u.nameAr : u.name}</option>))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{lang === 'ar' ? 'الكمية في الوحدة الكبرى' : 'Sub-Units in Main'}</label>
                        <input type="number" step="any" value={formData.unitQuantity} onChange={e => setFormData({...formData, unitQuantity: parseFloat(e.target.value) || 1})} />
                    </div>
                    <div className="form-group">
                    <label>{lang === 'ar' ? 'سعر التكلفة (شامل الضريبة)' : 'Cost Price (Inc. VAT)'}</label>
                    <input 
                        type="number" step="0.0001" value={formData.costPrice} 
                        onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})} 
                        disabled={formData.classification !== 'Raw Material'}
                        style={{ background: formData.classification !== 'Raw Material' ? '#f1f5f9' : 'white' }}
                    />
                    </div>
                    <div className="form-group">
                        <label>{lang === 'ar' ? 'سعر البيع' : 'Sale Price'}</label>
                        <input type="number" step="0.01" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: parseFloat(e.target.value)})} />
                    </div>
                    <div className="form-group">
                      <label>{lang === 'ar' ? 'أقل كمية للطلب (التنبيه)' : 'Minimum Order Qty (Alert)'}</label>
                      <input 
                          type="number" step="0.01" value={formData.reorderPoint} 
                          onChange={e => setFormData({...formData, reorderPoint: parseFloat(e.target.value) || 0})} 
                      />
                    </div>
                    <div className="form-group">
                      <label>{lang === 'ar' ? 'السعرات/100جم' : 'Calories/100g'}</label>
                      <input 
                          type="number" step="0.1" value={formData.caloriesPer100g} 
                          onChange={e => setFormData({...formData, caloriesPer100g: parseFloat(e.target.value)})} 
                          disabled={formData.classification !== 'Raw Material'}
                          style={{ background: formData.classification !== 'Raw Material' ? '#f1f5f9' : 'white' }}
                      />
                    </div>
                    <div className="form-group">
                       <label>{lang === 'ar' ? 'القسم (نظامي)' : 'Category (System)'}</label>
                       <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                           <option value="">-- {lang === 'ar' ? 'اختر القسم' : 'Select Category'} --</option>
                           {categories.map(c => (<option key={c.id} value={c.id}>{lang === 'ar' ? c.nameAr || c.name : c.name}</option>))}
                       </select>
                    </div>
                    <div className="form-group">
                      <label>{lang === 'ar' ? 'المورد الافتراضي' : 'Default Supplier'}</label>
                      <select value={formData.supplierId} onChange={e => setFormData({...formData, supplierId: e.target.value})}>
                          <option value="">-- {lang === 'ar' ? 'اختر المورد' : 'Select Supplier'} --</option>
                          {suppliers.map(s => (<option key={s.id} value={s.id}>{lang === 'ar' ? s.nameAr || s.name : s.name}</option>))}
                      </select>
                    </div>
                </div>
              </div>
              <div className="modal-footer" style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>{lang === 'ar' ? 'استيراد صنف من إكسل' : 'Import from Excel'}</h3>
              <button className="close-btn" onClick={() => setShowImportModal(false)}>&times;</button>
            </div>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
               <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                 {lang === 'ar' ? 'اختر ملف إكسل يحتوي على أعمدة: SKU, Name, Cost, Price...' : 'Upload Excel file with columns: SKU, Name, Cost, Price...'}
               </p>
               <div style={{ marginBottom: '1.5rem' }}>
                  <button type="button" className="btn-secondary" onClick={handleDownloadTemplate} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                    📥 {lang === 'ar' ? 'تحميل نموذج جاهز لتعبئته' : 'Download Sample Template'}
                  </button>
               </div>
               <input type="file" accept=".xlsx, .xls" onChange={handleImportFile} disabled={importLoading} />
               {importLoading && <div style={{ marginTop: '1rem' }}>{lang === 'ar' ? 'جاري المعالجة...' : 'Processing...'}</div>}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .products-module { color: #ffffff; }
        .table-container th { background: #1e293b; color: #ffffff; padding: 12px; }
        .table-container td { padding: 12px; border-bottom: 1px solid #334155; }
        .btn-icon { background: none; border: none; cursor: pointer; padding: 4px; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: #fff; border-radius: 12px; }
        .modal-header { padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.3rem; }
        .form-group label { font-size: 0.8rem; font-weight: bold; color: #475569; }
        .form-group input, .form-group select { padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 6px; }
      `}</style>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { importBiometricData } from './actions';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  lang: string;
}

export default function BiometricImportModal({ onClose, onSuccess, lang }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [previewRecords, setPreviewRecords] = useState<any[]>([]);
  const isAr = lang === 'ar';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
      parseFileContent(content);
    };
    reader.readAsText(uploadedFile);
  };

  const parseFileContent = (text: string) => {
    try {
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      const parsed: any[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Skip header if it contains text like 'code', 'date', 'time', 'pin'
        if (i === 0 && (line.toLowerCase().includes('code') || line.toLowerCase().includes('emp') || line.toLowerCase().includes('pin'))) {
          continue;
        }

        // Support CSV comma, tab, semicolon or space
        const parts = line.split(/[,\t;]+/).map(p => p.trim());
        if (parts.length >= 2) {
          // Format usually: EmployeeCode/ID, Timestamp OR EmployeeCode, Date, Time
          const empIdentifier = parts[0];
          let timestampStr = '';

          if (parts.length >= 3 && parts[1].includes('-') && parts[2].includes(':')) {
            timestampStr = `${parts[1]} ${parts[2]}`;
          } else {
            timestampStr = parts[1];
          }

          const d = new Date(timestampStr);
          if (!isNaN(d.getTime())) {
            parsed.push({
              employeeCode: empIdentifier,
              biometricId: empIdentifier,
              timestamp: d.toISOString(),
              displayTime: d.toLocaleString(isAr ? 'ar-SA' : 'en-US')
            });
          }
        }
      }

      setPreviewRecords(parsed);
    } catch (err) {
      console.error('Failed to parse biometric file:', err);
    }
  };

  const handleExecuteImport = async () => {
    if (previewRecords.length === 0) {
      alert(isAr ? 'لا توجد سجلات صالحة للاستيراد' : 'No valid records found to import');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await importBiometricData(previewRecords);
      if (res.success) {
        setResults(res);
        onSuccess();
      } else {
        alert(res.error || 'Failed to import records');
      }
    } catch (err: any) {
      alert(err.message || 'Error executing import');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content animate-in" style={{ width: '90%', maxWidth: '620px', background: 'white', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            {isAr ? '📥 استيراد حركات جهاز البصمة' : '📥 Import Biometric Device Logs'}
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
        </div>

        {results ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#16a34a', marginBottom: '0.5rem' }}>
              {isAr ? 'تم استيراد ومعالجة سجلات البصمة بنجاح!' : 'Biometric logs imported successfully!'}
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              {isAr 
                ? `تم بنجاح استيراد ${results.successCount} سجل عمل يومي للموظفين.` 
                : `Successfully imported ${results.successCount} employee daily records.`}
              {results.failedCount > 0 && (
                <span style={{ display: 'block', color: '#dc2626', marginTop: '0.5rem' }}>
                  {isAr ? `تخطي ${results.failedCount} حركات لعدم مطابقة كود الموظف.` : `Skipped ${results.failedCount} unassigned records.`}
                </span>
              )}
            </p>

            {results.errors && results.errors.length > 0 && (
              <div style={{ textAlign: isAr ? 'right' : 'left', background: '#fef2f2', padding: '1rem', borderRadius: '12px', border: '1px solid #fecaca', maxHeight: '120px', overflowY: 'auto', fontSize: '0.8rem', color: '#991b1b', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{isAr ? 'تنبيهات الاستيراد:' : 'Import Notices:'}</div>
                {results.errors.map((err: string, i: number) => <div key={i}>• {err}</div>)}
              </div>
            )}

            <button onClick={onClose} className="btn-primary" style={{ minWidth: '140px', padding: '10px 24px' }}>
              {isAr ? 'إغلاق ومتابعة' : 'Close & Continue'}
            </button>
          </div>
        ) : (
          <div>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              {isAr 
                ? 'قم برفع ملف البصمة المصدر من جهاز الحضور (يدعم صيغ CSV أو TXT أو ملفات Excel المحفوظة كـ CSV). يقوم النظام تلقائياً بربط الموظفين عبر كود الموظف أو رقم البصمة، واستخراج وقت أول بصمة (حضور) وآخر بصمة (انصراف) في اليوم.'
                : 'Upload biometric device logs (CSV or TXT). The system automatically matches employee codes and determines first punch (check-in) and last punch (check-out).'}
            </p>

            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '2rem 1.5rem', textAlign: 'center', background: '#f8fafc', cursor: 'pointer', marginBottom: '1.5rem' }} onClick={() => document.getElementById('biometric-file-input')?.click()}>
              <input
                id="biometric-file-input"
                type="file"
                accept=".csv,.txt,.dat"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📄</div>
              <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>
                {file ? file.name : (isAr ? 'اختر ملف البصمة (CSV / TXT)' : 'Select Biometric File (CSV / TXT)')}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {file ? `${(file.size / 1024).toFixed(1)} KB` : (isAr ? 'الصيغة المدعومة: كود الموظف، التاريخ والوقت' : 'Format: EmployeeCode, DateTime')}
              </div>
            </div>

            {previewRecords.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    {isAr ? `معاينة السجلات الجاهزة (${previewRecords.length} حركة):` : `Records Preview (${previewRecords.length} punches):`}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>✓ {isAr ? 'تم التحقق من الصيغة' : 'Validated'}</span>
                </div>
                <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.8rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isAr ? 'right' : 'left' }}>
                    <thead style={{ background: '#f1f5f9', color: '#475569', position: 'sticky', top: 0 }}>
                      <tr>
                        <th style={{ padding: '6px 10px' }}>{isAr ? 'كود الموظف' : 'Employee ID'}</th>
                        <th style={{ padding: '6px 10px' }}>{isAr ? 'التاريخ والوقت' : 'Timestamp'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewRecords.slice(0, 50).map((r, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '6px 10px', fontWeight: 600 }}>{r.employeeCode}</td>
                          <td style={{ padding: '6px 10px', color: '#64748b' }}>{r.displayTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
              <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '8px 18px' }}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={previewRecords.length === 0 || isProcessing}
                className="btn-primary"
                style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {isProcessing ? (isAr ? 'جاري المعالجة والاستيراد...' : 'Processing...') : (isAr ? 'تأكيد الاستيراد الآن' : 'Confirm Import')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

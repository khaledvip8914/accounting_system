const cssContent = `
  .invoice-paper { background: white; width: 100%; max-width: 800px; padding: 2rem; color: black; box-sizing: border-box; }
  .print-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; font-size: 14px; }
  .print-table th { background: #f8fafc; padding: 12px; border-bottom: 2px solid #cbd5e1; color: #334155; font-weight: 700; text-align: right; }
  .print-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; }
  .print-totals { width: 350px; background: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; margin-right: auto; }
  .totals-row { display: flex; justify-content: space-between; padding: 8px 0; color: #334155; font-weight: 600; }
  .net-total { border-top: 2px solid #cbd5e1; margin-top: 8px; padding-top: 12px; font-size: 1.25rem; font-weight: 800; color: #4f46e5; }
  .zatca-qr-print-container { margin-top: 3rem; display: flex; flex-direction: column; align-items: center; padding-top: 2rem; border-top: 1px dashed #cbd5e1; }
  img { max-width: 100%; }
  h1, h2, h3, p { margin: 0; padding: 0; }
  .print-modal-overlay { padding: 0; background: none; }
  .print-modal-content { max-width: none; margin: 0; border-radius: 0; box-shadow: none; }
  .no-print { display: none !important; }
`;

export async function generatePDFBlob(elementId: string): Promise<Blob | null> {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("Element not found: " + elementId);

    const htmlContent = element.outerHTML;

    const res = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlContent, css: cssContent })
    });

    if (!res.ok) throw new Error(await res.text());

    return await res.blob();
  } catch (err: any) {
    console.error("PDF generation error:", err);
    throw new Error("فشل توليد الفاتورة (خادم الطباعة): " + err.message);
  }
}

export async function generatePDF(elementId: string, filename: string) {
  try {
    const blob = await generatePDFBlob(elementId);
    if (!blob) return;
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err: any) {
    console.error('Download PDF failed:', err);
    alert(err.message);
  }
}

export async function sharePDF(elementId: string, filename: string, title: string, text: string) {
  try {
    const blob = await generatePDFBlob(elementId);
    if (!blob || !navigator.share) return;
  
    const file = new File([blob], `${filename}.pdf`, { type: 'application/pdf' });
  
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title,
        text
      });
    } else {
      generatePDF(elementId, filename);
      alert('Sharing files is not supported on this browser/OS. PDF saved to downloads.');
    }
  } catch (err: any) {
    console.error('Sharing failed:', err);
    alert(err.message);
  }
}

export async function generateBase64PDF(elementId: string): Promise<string | null> {
    const blob = await generatePDFBlob(elementId);
    if (!blob) return null;
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}


import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${filename}.pdf`);
  return pdf;
}

export async function sharePDF(elementId: string, filename: string, title: string, text: string) {
    const element = document.getElementById(elementId);
    if (!element || !navigator.share) return;
  
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ format: 'a4' });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
    const pdfBlob = pdf.output('blob');
    const file = new File([pdfBlob], `${filename}.pdf`, { type: 'application/pdf' });
  
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title,
          text
        });
      } else {
        pdf.save(`${filename}.pdf`);
        alert('Sharing files is not supported on this browser/OS. PDF saved to downloads.');
      }
    } catch (err) {
      console.error('Sharing failed:', err);
      pdf.save(`${filename}.pdf`);
    }
}

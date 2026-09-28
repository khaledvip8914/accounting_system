import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
    try {
        const { html, css } = await req.json();
        
        const fullHtml = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
                    body { 
                        font-family: 'Tajawal', 'Arial', sans-serif; 
                        margin: 0; 
                        padding: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    ${css}
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        const browser = await puppeteer.launch({ 
            headless: true, 
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ] 
        });
        
        const page = await browser.newPage();
        await page.setContent(fullHtml, { waitUntil: 'load' });
        
        const pdfUint8Array = await page.pdf({ 
            format: 'A4', 
            printBackground: true,
            margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
        });
        
        await browser.close();
        
        return new NextResponse(Buffer.from(pdfUint8Array), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="document.pdf"'
            }
        });
    } catch (error: any) {
        console.error("PDF generation failed:", error);
        return NextResponse.json({ error: error.message || 'Unknown PDF generation error' }, { status: 500 });
    }
}

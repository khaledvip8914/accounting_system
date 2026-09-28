import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const file = formData.get('file') as File;
    const companyId = session.user.companyId;

    let mediaBase64: string | undefined = undefined;
    let mediaMimeType: string | undefined = undefined;
    let mediaFilename: string | undefined = undefined;

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      mediaBase64 = Buffer.from(arrayBuffer).toString('base64');
      mediaMimeType = file.type;
      mediaFilename = file.name;
    }

    await sendWhatsAppMessage(companyId, phone, message, mediaBase64, mediaMimeType, mediaFilename);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("SEND ROUTE ERROR:", err);
    console.error("SEND ROUTE ERROR STACK:", err?.stack);
    
    let errMsg = "خطأ غير معروف في السيرفر";
    if (typeof err === 'string') errMsg = err;
    else if (err instanceof Error) errMsg = err.message;
    else if (err && err.message) errMsg = err.message;
    else errMsg = JSON.stringify(err);

    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

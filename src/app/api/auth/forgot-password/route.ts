import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendResetPasswordEmail } from '@/lib/mail';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    let { email } = await request.json();
    email = email?.trim();

    if (!email) {
      return NextResponse.json(
        { errorAr: 'الرجاء إدخال البريد الإلكتروني', errorEn: 'Please enter your email' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security, just pretend it succeeded
      return NextResponse.json({ success: true });
    }

    let resetToken = user.resetToken;
    let resetTokenExpiry = user.resetTokenExpiry;

    // Generate new token ONLY if there isn't a currently valid one
    if (!resetToken || !resetTokenExpiry || resetTokenExpiry.getTime() < Date.now()) {
      resetToken = crypto.randomBytes(32).toString('hex');
      resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });
    }

    // Send email
    await sendResetPasswordEmail(user.email!, resetToken, user.name || user.username);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { errorAr: 'حدث خطأ أثناء إرسال البريد الإلكتروني', errorEn: 'Error sending email' },
      { status: 500 }
    );
  }
}

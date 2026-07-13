import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    let { token, password } = await request.json();
    token = token?.trim();
    password = password?.trim();

    if (!token || !password) {
      return NextResponse.json(
        { errorAr: 'الرجاء إدخال كلمة المرور بشكل صحيح', errorEn: 'Please enter a valid password' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { resetToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { errorAr: 'الرابط غير صالح أو تم استخدامه مسبقاً', errorEn: 'Token is invalid or already used' },
        { status: 400 }
      );
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry.getTime() < Date.now()) {
      return NextResponse.json(
        { errorAr: 'انتهت صلاحية هذا الرابط (صالح لمدة ساعة واحدة)', errorEn: 'This token has expired' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { errorAr: 'حدث خطأ أثناء حفظ كلمة المرور', errorEn: 'Error saving password' },
      { status: 500 }
    );
  }
}

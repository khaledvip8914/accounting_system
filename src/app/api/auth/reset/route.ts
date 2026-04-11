import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.upsert({
      where: { username: 'admin' },
      update: { password: hashedPassword },
      create: {
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
        role: 'Admin',
        email: 'admin@nexaccount.com'
      }
    });

    return NextResponse.json({ 
      success: true, 
      messageAr: 'تمت إعادة ضبط كلمة المرور للمدير (admin) بنجاح إلى: admin123', 
      messageEn: 'Admin password reset successfully to: admin123' 
    });
  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json({ error: 'Failed to reset admin' }, { status: 500 });
  }
}

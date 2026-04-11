import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Check if any users exist
    const userCount = await prisma.user.count();
    
    if (userCount > 0) {
      return NextResponse.json({ 
        messageAr: 'المستخدمون موجودون بالفعل. لا يمكن البدء من جديد.', 
        messageEn: 'Users already exist. Seeding aborted.' 
      }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
        role: 'Admin',
        email: 'admin@nexaccount.com'
      }
    });

    return NextResponse.json({ 
      success: true, 
      messageAr: 'تم إنشاء مستخدم المدير (admin) بنجاح. كلمة المرور هي: admin123', 
      messageEn: 'Admin user (admin) created successfully. Password: admin123' 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed admin user' }, { status: 500 });
  }
}

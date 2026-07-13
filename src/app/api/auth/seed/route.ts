import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // 1. Ensure default company exists
    const company = await prisma.company.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        name: 'Default Company',
        nameAr: 'الشركة الافتراضية',
        subscriptionStatus: 'Active'
      }
    });

    // 2. Ensure admin user exists
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        companyId: company.id
      },
      create: {
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
        role: 'Admin',
        companyId: company.id,
        email: 'admin@qaydx.com',
        emailVerified: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Default Company and Admin user ensured successfully!',
      credentials: {
        username: 'admin',
        password: 'admin123'
      },
      note: 'You can now login at /login'
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed: ' + error.message }, { status: 500 });
  }
}

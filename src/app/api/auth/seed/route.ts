import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Ensure admin user exists
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
        role: 'Admin',
        email: 'admin@nexaccount.com',
        emailVerified: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user ensured/created successfully!',
      credentials: {
        username: 'admin',
        password: 'admin123'
      },
      note: 'You can now login at /login'
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed admin user' }, { status: 500 });
  }
}

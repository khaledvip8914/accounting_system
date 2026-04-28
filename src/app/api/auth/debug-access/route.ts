import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // 1. Ensure admin user exists
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        password: hashedPassword,
        emailVerified: new Date()
      },
      create: {
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
        role: 'Admin',
        email: 'admin@nexaccount.com',
        emailVerified: new Date()
      }
    });

    // 2. Get all users summary
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        emailVerified: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'System initialization check complete.',
      adminStatus: 'Admin user has been reset to default credentials.',
      credentials: {
        username: 'admin',
        password: 'admin123'
      },
      totalUsersInDb: allUsers.length,
      usersList: allUsers
    });
  } catch (error: any) {
    console.error('Debug route error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

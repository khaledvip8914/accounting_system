import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    let { companyName, username, email, phone, password } = await request.json();
    companyName = companyName?.trim();
    username = username?.trim();
    email = email?.trim();
    phone = phone?.trim();
    password = password?.trim();

    if (!companyName || !username || !password) {
      return NextResponse.json(
        { errorAr: 'الرجاء ملء جميع الحقول الإلزامية', errorEn: 'Please fill all required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: email || 'undefined_never_match' }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { errorAr: 'اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل', errorEn: 'Username or email already in use' },
        { status: 400 }
      );
    }

    // Generate Company ID (e.g. T-XXXXX)
    const companyId = 'T-' + Math.floor(10000 + Math.random() * 90000).toString();

    // Trial ends in 15 days
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 15);

    // Create Company
    const company = await prisma.company.create({
      data: {
        id: companyId,
        name: companyName,
        phone: phone || null,
        email: email || null,
        subscriptionStatus: 'Active',
        subscriptionEndsAt: trialEndsAt,
      }
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User (Admin)
    const user = await prisma.user.create({
      data: {
        username,
        email: email || null,
        password: hashedPassword,
        name: username,
        role: 'Admin', // The main creator gets the local Admin role
        companyId: company.id,
      }
    });

    // Create session (Login)
    const { password: _, ...userWithoutPassword } = user;
    await login(userWithoutPassword);

    // Send welcome email if email is provided
    if (email) {
      const { sendWelcomeEmail } = await import('@/lib/mail');
      await sendWelcomeEmail(email, companyName, company.id, username, password, 15);
    }

    return NextResponse.json({ success: true, company, user: userWithoutPassword });

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { errorAr: 'حدث خطأ غير متوقع: ' + error.message, errorEn: 'An unexpected error occurred: ' + error.message },
      { status: 500 }
    );
  }
}

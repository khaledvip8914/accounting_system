import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    console.log(`Login attempt for: [${username}]`);

    if (!username || !password) {
      return NextResponse.json(
        { errorAr: 'الرجاء إدخال اسم المستخدم وكلمة المرور', errorEn: 'Please enter username and password' },
        { status: 400 }
      );
    }

    // DEBUG: Check user count and list usernames to ensure DB is accessible
    try {
      if (!prisma || !(prisma as any).user) {
        const keys = Object.keys(prisma || {});
        console.error('Prisma User model missing. Available models:', keys.filter(k => !k.startsWith('$')));
        return NextResponse.json(
          { errorAr: 'قاعدة البيانات غير مهيأة بشكل صحيح (User model missing)', errorEn: 'Database not initialized correctly (User model missing)' },
          { status: 500 }
        );
      }
      const allUsers = await (prisma as any).user.findMany({ select: { username: true }, take: 10 });
      console.log('Available usernames in DB:', allUsers.map((u: any) => u.username));
    } catch (dbErr: any) {
      console.error('DB Access Error:', dbErr.message);
      return NextResponse.json(
        { errorAr: 'خطأ في قاعدة البيانات: ' + dbErr.message, errorEn: 'Database error: ' + dbErr.message },
        { status: 500 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.warn(`User not found: ${username}`);
      return NextResponse.json(
        { errorAr: 'اسم المستخدم أو كلمة المرور غير صحيحة', errorEn: 'Invalid username or password' },
        { status: 401 }
      );
    }

    console.log(`User found: ${user.username}. Comparing passwords...`);
    const passwordMatch = await bcrypt.compare(password, user.password).catch(err => {
      console.error('Bcrypt compare failed:', err);
      return false;
    });

    if (!passwordMatch) {
      console.warn(`Password mismatch for: ${username}`);
      // Check if password stored is somehow not hashed
      if (user.password === password) {
        console.error('CRITICAL: User password is stored in PLAIN TEXT but bcrypt.compare was used.');
      } else if (user.password.length < 20) {
        console.error('CRITICAL: Stored password looks too short to be a bcrypt hash:', user.password);
      }
      
      return NextResponse.json(
        { errorAr: 'اسم المستخدم أو كلمة المرور غير صحيحة', errorEn: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Login successful
    const { password: _, ...userWithoutPassword } = user;
    try {
      await login(userWithoutPassword);
      console.log(`✅ Login successful for: ${username}`);
    } catch (err: any) {
      console.error('Session login failed:', err.message);
      return NextResponse.json(
        { errorAr: 'فشل إنشاء الجلسة: ' + err.message, errorEn: 'Session creation failed: ' + err.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (error: any) {
    console.error('CRITICAL Login error:', error.message, error.stack);
    return NextResponse.json(
      { errorAr: 'حدث خطأ غير متوقع: ' + error.message, errorEn: 'An unexpected error occurred: ' + error.message },
      { status: 500 }
    );
  }
}

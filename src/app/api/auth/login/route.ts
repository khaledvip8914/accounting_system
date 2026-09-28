import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';
import { checkLockout, recordFailedLogin, resetLoginAttempts } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    let { companyId, username, password } = await request.json();
    companyId = companyId?.trim();
    username = username?.trim();
    password = password?.trim();
    console.log(`Login attempt for: [${username}] in company: [${companyId}]`);

    if (!username || !password || !companyId) {
      return NextResponse.json(
        { errorAr: 'الرجاء إدخال معرف الشركة واسم المستخدم وكلمة المرور', errorEn: 'Please enter Company ID, username and password' },
        { status: 400 }
      );
    }

    // BRUTE FORCE PROTECTION: Check if user/IP is locked out
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const identifier = `${companyId}:${username}:${ip}`;
    
    const lockoutStatus = checkLockout(identifier);
    if (lockoutStatus.isLocked) {
      const minutesRemaining = Math.ceil(lockoutStatus.remainingMs / 60000);
      return NextResponse.json(
        { 
          errorAr: `تم قفل الحساب مؤقتاً بسبب المحاولات الخاطئة الكثيرة. الرجاء المحاولة بعد ${minutesRemaining} دقيقة.`, 
          errorEn: `Account temporarily locked due to too many failed attempts. Please try again in ${minutesRemaining} minutes.` 
        },
        { status: 429 } // Too Many Requests
      );
    }

    // ... (DEBUG checks omitted for brevity in instruction, keeping them in code)
    const user = await prisma.user.findFirst({
      where: { 
        companyId,
        OR: [
          { username },
          { email: username }
        ]
      },
      include: {
        roleRef: true,
      },
    });

    if (!user) {
      console.warn(`[AUTH] User not found: ${username}`);
      recordFailedLogin(identifier);
      return NextResponse.json(
        { errorAr: 'اسم المستخدم غير موجود في قاعدة البيانات', errorEn: 'Username not found in database' },
        { status: 401 }
      );
    }

    console.log(`[AUTH] User found: ${user.username}. Password hashing check...`);
    const passwordMatch = await bcrypt.compare(password, user.password).catch(err => {
      console.error('[AUTH] Bcrypt compare failed:', err);
      return false;
    });

    if (!passwordMatch) {
      console.warn(`[AUTH] Password mismatch for: ${username}`);
      
      const failedRecord = recordFailedLogin(identifier);
      const attemptsLeft = 5 - failedRecord.attempts;
      
      return NextResponse.json(
        { 
          errorAr: `كلمة المرور غير صحيحة. يتبقى لك ${attemptsLeft} محاولات قبل قفل الحساب.`, 
          errorEn: `Incorrect password. You have ${attemptsLeft} attempts left before account lockout.` 
        },
        { status: 401 }
      );
    }

    // Login successful - reset attempts
    resetLoginAttempts(identifier);

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

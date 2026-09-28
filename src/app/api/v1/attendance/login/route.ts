import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyCode, employeeCode, password, deviceId, deviceInfo } = body;

    if (!companyCode || !employeeCode) {
      return NextResponse.json(
        { success: false, error: 'كود الشركة وكود الموظف مطلوبان لتسجيل الدخول' },
        { status: 400 }
      );
    }

    // 1. Check Company existence
    const company = await prisma.company.findFirst({
      where: {
        OR: [
          { id: companyCode.trim() },
          { name: { equals: companyCode.trim(), mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        nameAr: true,
        subscriptionStatus: true
      }
    });

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'كود الشركة غير صحيح أو غير مسجل بالنظام' },
        { status: 404 }
      );
    }

    if (company.subscriptionStatus !== 'Active') {
      return NextResponse.json(
        { success: false, error: 'حساب هذه الشركة معلق أو غير نشط' },
        { status: 403 }
      );
    }

    // 2. Check Employee in this company
    const employee = await prisma.employee.findFirst({
      where: {
        companyId: company.id,
        code: employeeCode.trim()
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            workLat: true,
            workLng: true,
            workRadius: true
          }
        }
      }
    });

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'الموظف غير مسجل ضمن هذه الشركة' },
        { status: 404 }
      );
    }

    if (employee.status !== 'Active') {
      return NextResponse.json(
        { success: false, error: 'حساب الموظف غير نشط حالياً' },
        { status: 403 }
      );
    }

    // 3. Password Verification (If employee has appPassword set)
    if (employee.appPassword) {
      if (!password || password.trim() !== employee.appPassword.trim()) {
        return NextResponse.json(
          { success: false, error: 'كلمة المرور غير صحيحة' },
          { status: 401 }
        );
      }
    }

    // 4. Bind Device ID (Single device policy to prevent buddy punching)
    if (deviceId) {
      const cleanDeviceId = String(deviceId).trim();
      const cleanDeviceInfo = deviceInfo ? String(deviceInfo).trim() : 'هاتف الموظف المعتمد';

      if (!employee.deviceId) {
        // First login: bind this device
        const existingCf = (employee.customFields as any) || {};
        await prisma.employee.update({
          where: { id: employee.id },
          data: { 
            deviceId: cleanDeviceId,
            customFields: {
              ...existingCf,
              deviceInfo: cleanDeviceInfo,
              deviceBoundAt: new Date().toISOString()
            }
          }
        });
      } else if (employee.deviceId !== cleanDeviceId) {
        const boundDeviceName = (employee.customFields as any)?.deviceInfo || 'الهاتف المعتمد المسجل';
        return NextResponse.json(
          { 
            success: false, 
            error: `⚠️ تنبيه أمني لمنع التلاعب: هذا الحساب مرتبط بجهاز آخر (${boundDeviceName}). يرجى استخدام الهاتف المعتمد أو مراجعة إدارة الموارد البشرية لفك الارتباط.` 
          },
          { status: 403 }
        );
      }
    }

    // Effective Location
    const effectiveLat = employee.workLat !== null ? employee.workLat : employee.branch?.workLat;
    const effectiveLng = employee.workLng !== null ? employee.workLng : employee.branch?.workLng;
    const effectiveRadius = employee.workLat !== null ? (employee.workRadius || 100) : (employee.branch?.workRadius || 100);

    return NextResponse.json({
      success: true,
      message: `مرحباً بك يا ${employee.nameAr || employee.name}`,
      company: {
        id: company.id,
        name: company.nameAr || company.name
      },
      employee: {
        id: employee.id,
        code: employee.code,
        name: employee.nameAr || employee.name,
        jobTitle: employee.jobTitleAr || employee.jobTitle,
        department: employee.department,
        branch: employee.branch ? (employee.branch.nameAr || employee.branch.name) : 'الفرع الرئيسي',
        allowBiometric: employee.allowBiometric,
        shiftStart: employee.shiftStart || '09:00',
        shiftEnd: employee.shiftEnd || '17:00',
        workHoursPerDay: employee.workHoursPerDay || 8
      },
      workLocation: {
        lat: effectiveLat,
        lng: effectiveLng,
        radius: effectiveRadius
      }
    });

  } catch (err: any) {
    console.error('Employee Mobile Login Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

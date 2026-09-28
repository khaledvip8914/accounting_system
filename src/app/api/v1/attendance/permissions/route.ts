import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyCode,
      employeeCode,
      password,
      type, // 'Permission' (استئذان), 'LateArrival' (تأخر مبرر), 'EarlyDeparture' (خروج مبكر)
      date, // YYYY-MM-DD
      startTime, // HH:mm
      endTime, // HH:mm
      reason
    } = body;

    if (!employeeCode) {
      return NextResponse.json({ success: false, error: 'كود الموظف مطلوب' }, { status: 400 });
    }

    if (!date) {
      return NextResponse.json({ success: false, error: 'التاريخ مطلوب' }, { status: 400 });
    }

    // Find Employee
    const employee = await prisma.employee.findFirst({
      where: {
        code: employeeCode,
        ...(companyCode ? { companyId: companyCode } : {})
      }
    });

    if (!employee) {
      return NextResponse.json({ success: false, error: 'الموظف غير مسجل بالنظام' }, { status: 404 });
    }

    // Verify Password if set
    if (employee.appPassword && employee.appPassword !== password) {
      return NextResponse.json({ success: false, error: 'كلمة المرور غير صحيحة' }, { status: 401 });
    }

    const [year, month, day] = date.split('-').map(Number);
    
    let startDateTime: Date;
    let endDateTime: Date;

    if (startTime && endTime) {
      const [sH, sM] = startTime.split(':').map(Number);
      const [eH, eM] = endTime.split(':').map(Number);
      startDateTime = new Date(year, month - 1, day, sH, sM, 0);
      endDateTime = new Date(year, month - 1, day, eH, eM, 0);
    } else {
      startDateTime = new Date(year, month - 1, day, 0, 0, 0);
      endDateTime = new Date(year, month - 1, day, 23, 59, 59);
    }

    const leaveRequest = await prisma.employeeLeave.create({
      data: {
        companyId: employee.companyId,
        employeeId: employee.id,
        type: type || 'Permission',
        startDate: startDateTime,
        endDate: endDateTime,
        reason: reason ? `[${startTime || ''} - ${endTime || ''}] ${reason}` : `استئذان من ${startTime || ''} إلى ${endTime || ''}`,
        status: 'Pending'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلب الاستئذان بنجاح وهو قيد مراجعة الإدارة',
      leaveRequest
    });

  } catch (err: any) {
    console.error('Permission Request Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeCode = searchParams.get('employeeCode');

    if (!employeeCode) {
      return NextResponse.json({ success: false, error: 'employeeCode is required' }, { status: 400 });
    }

    const leaves = await prisma.employeeLeave.findMany({
      where: {
        employee: { code: employeeCode }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ success: true, leaves });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

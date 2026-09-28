import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyCode,
      employeeCode,
      password,
      type, // 'Annual', 'Sick', 'Emergency', 'Permission', 'LateArrival', 'EarlyDeparture', 'Unpaid', 'Maternity'
      startDate, // YYYY-MM-DD
      endDate, // YYYY-MM-DD
      date, // YYYY-MM-DD fallback
      startTime, // HH:mm
      endTime, // HH:mm
      reason
    } = body;

    if (!employeeCode) {
      return NextResponse.json({ success: false, error: 'كود الموظف مطلوب' }, { status: 400 });
    }

    const startStr = startDate || date;
    const endStr = endDate || startDate || date;

    if (!startStr) {
      return NextResponse.json({ success: false, error: 'يرجى تحديد تاريخ الإجازة' }, { status: 400 });
    }

    // Find Employee
    const employee = await prisma.employee.findFirst({
      where: {
        code: employeeCode.trim(),
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

    const [sY, sM, sD] = startStr.split('-').map(Number);
    const [eY, eM, eD] = endStr.split('-').map(Number);
    
    let startDateTime: Date;
    let endDateTime: Date;

    if (startTime && endTime) {
      const [sH, sm] = startTime.split(':').map(Number);
      const [eH, em] = endTime.split(':').map(Number);
      startDateTime = new Date(sY, sM - 1, sD, sH, sm, 0);
      endDateTime = new Date(eY, eM - 1, eD, eH, em, 0);
    } else {
      startDateTime = new Date(sY, sM - 1, sD, 0, 0, 0);
      endDateTime = new Date(eY, eM - 1, eD, 23, 59, 59);
    }

    if (startDateTime > endDateTime) {
      return NextResponse.json({ success: false, error: 'تاريخ بداية الإجازة يجب أن يكون قبل تاريخ النهاية' }, { status: 400 });
    }

    const leaveType = type || 'Annual';
    let formattedReason = reason || '';
    if (startTime && endTime) {
      formattedReason = formattedReason ? `[${startTime} - ${endTime}] ${formattedReason}` : `استئذان من ${startTime} إلى ${endTime}`;
    }

    const leaveRequest = await prisma.employeeLeave.create({
      data: {
        companyId: employee.companyId,
        employeeId: employee.id,
        type: leaveType,
        startDate: startDateTime,
        endDate: endDateTime,
        reason: formattedReason || null,
        status: 'Pending'
      }
    });

    const typeLabelsAr: Record<string, string> = {
      Annual: 'إجازة سنوية',
      Sick: 'إجازة مرضية',
      Emergency: 'إجازة طارئة',
      Permission: 'طلب استئذان ساعي',
      Unpaid: 'إجازة بدون راتب',
      Maternity: 'إجازة أمومة / رعاية',
      EarlyDeparture: 'خروج مبكر مبرر',
      LateArrival: 'تأخر مبرر',
    };

    const typeLabel = typeLabelsAr[leaveType] || leaveType;

    return NextResponse.json({
      success: true,
      message: `تم إرسال طلب (${typeLabel}) بنجاح وهو قيد مراجعة واعتماد الإدارة`,
      leaveRequest
    });

  } catch (err: any) {
    console.error('Leave/Permission Request Error:', err);
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
        employee: { code: employeeCode.trim() }
      },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    return NextResponse.json({ success: true, leaves });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

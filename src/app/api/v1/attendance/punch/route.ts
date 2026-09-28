import { NextRequest, NextResponse } from 'next/server';
import { prisma_latest as prisma } from '@/lib/db';

// دالة حساب المسافة الجغرافية بين نقطتين (بالمتر)
function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeCode, phone, lat, lng, action, apiKey, companyCode, deviceId, deviceInfo } = body;

    if (!employeeCode && !phone) {
      return NextResponse.json({ success: false, error: 'Employee code or phone is required' }, { status: 400 });
    }

    if (lat === undefined || lng === undefined) {
      return NextResponse.json({ success: false, error: 'GPS coordinates (lat, lng) are required' }, { status: 400 });
    }

    const currentLat = parseFloat(lat);
    const currentLng = parseFloat(lng);

    // If companyCode provided, resolve company
    let targetCompanyId: string | undefined = undefined;
    if (companyCode) {
      const company = await prisma.company.findFirst({
        where: {
          OR: [
            { id: companyCode.trim() },
            { name: { equals: companyCode.trim(), mode: 'insensitive' } }
          ]
        }
      });
      if (company) {
        targetCompanyId = company.id;
      }
    }

    // Find Employee with branch relation
    const employee = await prisma.employee.findFirst({
      where: {
        AND: [
          targetCompanyId ? { companyId: targetCompanyId } : {},
          {
            OR: [
              ...(employeeCode ? [{ code: employeeCode }] : []),
              ...(phone ? [{ phone: phone }] : [])
            ]
          }
        ]
      },
      include: {
        company: true,
        branch: true
      }
    });

    if (!employee) {
      return NextResponse.json({ success: false, error: 'الموظف غير موجود بالنظام أو كود الشركة غير مطابق' }, { status: 404 });
    }

    if (employee.status !== 'Active') {
      return NextResponse.json({ success: false, error: 'حساب الموظف غير نشط حالياً' }, { status: 403 });
    }

    // Anti-fraud: Single Device Policy & Binding
    if (deviceId) {
      const cleanDeviceId = String(deviceId).trim();
      const cleanDeviceInfo = deviceInfo ? String(deviceInfo).trim() : 'هاتف الموظف المعتمد';

      if (!employee.deviceId) {
        // First-time punch from a device: Automatically bind this trusted device!
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
        employee.deviceId = cleanDeviceId;
        (employee.customFields as any) = {
          ...existingCf,
          deviceInfo: cleanDeviceInfo,
          deviceBoundAt: new Date().toISOString()
        };
      } else if (employee.deviceId !== cleanDeviceId) {
        // Unauthorized device attempting punch!
        const boundDeviceName = (employee.customFields as any)?.deviceInfo || 'الهاتف المعتمد المسجل';
        return NextResponse.json({ 
          success: false, 
          error: `⚠️ تنبيه أمني لمنع التلاعب: هذا الحساب مرتبط وموثق بجهاز آخر (${boundDeviceName}). لا يمكن تسجيل الحضور إلا من الهاتف المعتمد. (إذا قمت بتغيير هاتفك، يرجى مراجعة إدارة الموارد البشرية لفك الارتباط).`,
          errorCode: 'DEVICE_MISMATCH',
          boundDevice: boundDeviceName
        }, { status: 403 });
      }
    }

    // Check field work status
    const isFieldWork = (employee.customFields as any)?.allowFieldWork === true;

    // Geofencing verification (Employee specific OR Branch location) - Skip if field work
    let targetLat = employee.workLat;
    let targetLng = employee.workLng;
    let allowedRadius = employee.workRadius || 100;
    let locationName = employee.nameAr || employee.name;

    // If employee has no custom location, fallback to their branch location
    if (!isFieldWork && (targetLat === null || targetLng === null) && employee.branch) {
      targetLat = employee.branch.workLat;
      targetLng = employee.branch.workLng;
      allowedRadius = employee.branch.workRadius || 100;
      locationName = employee.branch.nameAr || employee.branch.name;
    }

    let isWithinGeofence = true;
    let distanceMeters = 0;

    if (!isFieldWork && targetLat !== null && targetLng !== null) {
      distanceMeters = calculateDistanceMeters(currentLat, currentLng, targetLat, targetLng);
      if (distanceMeters > allowedRadius) {
        isWithinGeofence = false;
        return NextResponse.json({
          success: false,
          error: `أنت خارج نطاق موقع العمل المعتمد [${locationName}] (${Math.round(distanceMeters)} متر، المسموح: ${allowedRadius} متر).`,
          distance: Math.round(distanceMeters),
          allowedRadius
        }, { status: 400 });
      }
    }

    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    // Find or create today's attendance record
    const existingAttendance = await prisma.employeeAttendance.findUnique({
      where: {
        companyId_employeeId_date: {
          companyId: employee.companyId,
          employeeId: employee.id,
          date: dayStart
        }
      }
    });

    let punchType = action; // 'CHECK_IN' | 'CHECK_OUT' | 'AUTO'

    if (punchType === 'CHECK_IN' && existingAttendance?.checkIn) {
      const timeStr = new Date(existingAttendance.checkIn).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
      return NextResponse.json({
        success: false,
        error: `لقد قمت بتسجيل الحضور بالفعل اليوم في تمام الساعة (${timeStr})! لا حاجة لتسجيل الحضور مرة أخرى.`,
        alreadyCheckedIn: true,
        checkInTime: existingAttendance.checkIn
      }, { status: 400 });
    }

    if (!punchType || punchType === 'AUTO') {
      if (!existingAttendance || !existingAttendance.checkIn) {
        punchType = 'CHECK_IN';
      } else {
        punchType = 'CHECK_OUT';
      }
    }

    // Check if employee has an approved permission / leave for today
    const approvedLeave = await prisma.employeeLeave.findFirst({
      where: {
        employeeId: employee.id,
        status: 'Approved',
        startDate: { lte: now },
        endDate: { gte: dayStart }
      }
    });

    // Check shift window on CHECK_IN (منع تسجيل الدخول قبل موعد الدوام بأكثر من 15 دقيقة)
    let lateMinutes = 0;
    if (punchType === 'CHECK_IN') {
      const shiftStartTimeStr = employee.shiftStart || '09:00';
      const [shH, shM] = shiftStartTimeStr.split(':').map(Number);
      const scheduledCheckIn = new Date(now.getFullYear(), now.getMonth(), now.getDate(), shH, shM, 0, 0);

      // Early check-in limit: 15 minutes before shiftStart
      const earliestAllowedCheckIn = new Date(scheduledCheckIn.getTime() - 15 * 60 * 1000);

      if (now < earliestAllowedCheckIn) {
        const diffTooEarly = Math.ceil((scheduledCheckIn.getTime() - now.getTime()) / (1000 * 60));
        return NextResponse.json({
          success: false,
          error: `لا يمكن تسجيل الدخول الآن! يبدأ دوامك الساعة ${shiftStartTimeStr}، ومسموح بتسجيل الدخول قبل الدوام بـ 15 دقيقة فقط (متبقي ${diffTooEarly} دقيقة).`,
          scheduledCheckIn: shiftStartTimeStr,
          minutesUntilAllowed: diffTooEarly - 15
        }, { status: 400 });
      }

      const diffMinutes = Math.floor((now.getTime() - scheduledCheckIn.getTime()) / (1000 * 60));
      // 10 minutes grace period
      if (diffMinutes > 10) {
        // If approved permission covers this morning, waive late minutes
        if (approvedLeave && (approvedLeave.type === 'Permission' || approvedLeave.type === 'LateArrival')) {
          lateMinutes = 0;
        } else {
          lateMinutes = diffMinutes;
        }
      }
    }

    // Compute Early Departure Minutes on CHECK_OUT
    let earlyMinutes = 0;
    if (punchType === 'CHECK_OUT') {
      const shiftEndTimeStr = employee.shiftEnd || '17:00';
      const [ehH, ehM] = shiftEndTimeStr.split(':').map(Number);
      const scheduledCheckOut = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ehH, ehM, 0, 0);

      const diffEarly = Math.floor((scheduledCheckOut.getTime() - now.getTime()) / (1000 * 60));
      if (diffEarly > 10) {
        if (approvedLeave && (approvedLeave.type === 'Permission' || approvedLeave.type === 'EarlyDeparture')) {
          earlyMinutes = 0;
        } else {
          earlyMinutes = diffEarly;
        }
      }
    }

    let updatedAttendance;

    if (punchType === 'CHECK_IN') {
      const punchStatus = lateMinutes > 0 ? 'LATE' : 'PRESENT';
      const deviceNote = deviceInfo ? `📱 ${deviceInfo}` : undefined;

      updatedAttendance = await prisma.employeeAttendance.upsert({
        where: {
          companyId_employeeId_date: {
            companyId: employee.companyId,
            employeeId: employee.id,
            date: dayStart
          }
        },
        update: {
          checkIn: now,
          checkInLat: currentLat,
          checkInLng: currentLng,
          source: 'MOBILE_GPS',
          lateMinutes: lateMinutes,
          status: punchStatus,
          notes: deviceNote || existingAttendance?.notes || undefined,
        },
        create: {
          companyId: employee.companyId,
          employeeId: employee.id,
          date: dayStart,
          checkIn: now,
          checkInLat: currentLat,
          checkInLng: currentLng,
          source: 'MOBILE_GPS',
          lateMinutes: lateMinutes,
          status: punchStatus,
          notes: deviceNote,
        }
      });
    } else {
      // CHECK_OUT
      let workMinutes = 0;
      if (existingAttendance?.checkIn) {
        const diffMs = now.getTime() - new Date(existingAttendance.checkIn).getTime();
        workMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
      }

      const deviceNote = deviceInfo ? `📱 ${deviceInfo}` : undefined;

      updatedAttendance = await prisma.employeeAttendance.upsert({
        where: {
          companyId_employeeId_date: {
            companyId: employee.companyId,
            employeeId: employee.id,
            date: dayStart
          }
        },
        update: {
          checkOut: now,
          checkOutLat: currentLat,
          checkOutLng: currentLng,
          workMinutes: workMinutes || undefined,
          earlyMinutes: earlyMinutes,
          source: 'MOBILE_GPS',
          notes: deviceNote || existingAttendance?.notes || undefined,
        },
        create: {
          companyId: employee.companyId,
          employeeId: employee.id,
          date: dayStart,
          checkIn: now,
          checkOut: now,
          checkOutLat: currentLat,
          checkOutLng: currentLng,
          earlyMinutes: earlyMinutes,
          source: 'MOBILE_GPS',
          status: 'PRESENT',
          notes: deviceNote,
        }
      });
    }

    return NextResponse.json({
      success: true,
      punchType,
      message: punchType === 'CHECK_IN' ? 'تم تسجيل الحضور بنجاح' : 'تم تسجيل الانصراف بنجاح',
      attendance: updatedAttendance,
      employee: {
        id: employee.id,
        code: employee.code,
        name: employee.name,
        nameAr: employee.nameAr,
      },
      distance: Math.round(distanceMeters)
    });
  } catch (err: any) {
    console.error('Attendance Punch API Error:', err);
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

    const employee = await prisma.employee.findFirst({
      where: { code: employeeCode },
      select: {
        id: true,
        code: true,
        name: true,
        nameAr: true,
        department: true,
        workLat: true,
        workLng: true,
        workRadius: true,
        weekendDays: true,
        shiftStart: true,
        shiftEnd: true,
        workHoursPerDay: true,
        deviceId: true,
        customFields: true,
        branch: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            workLat: true,
            workLng: true,
            workRadius: true,
          }
        }
      }
    });

    if (!employee) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    // Determine effective work location
    const effectiveLat = employee.workLat !== null ? employee.workLat : employee.branch?.workLat;
    const effectiveLng = employee.workLng !== null ? employee.workLng : employee.branch?.workLng;
    const effectiveRadius = employee.workLat !== null ? (employee.workRadius || 100) : (employee.branch?.workRadius || 100);

    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    const todayAttendance = await prisma.employeeAttendance.findFirst({
      where: {
        employeeId: employee.id,
        date: dayStart
      }
    });

    const boundDeviceInfo = (employee.customFields as any)?.deviceInfo || null;

    return NextResponse.json({
      success: true,
      employee,
      boundDeviceId: employee.deviceId || null,
      boundDeviceInfo: boundDeviceInfo,
      isDeviceBound: !!employee.deviceId,
      effectiveLocation: {
        lat: effectiveLat,
        lng: effectiveLng,
        radius: effectiveRadius,
        source: employee.workLat !== null ? 'EMPLOYEE' : 'BRANCH'
      },
      todayAttendance
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

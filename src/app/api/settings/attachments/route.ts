import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const company = await prisma.company.findUnique({
      where: { id: session.user.companyId },
      select: { attachmentSettings: true }
    });

    return NextResponse.json(company?.attachmentSettings || {
      maxSizeMB: 5,
      allowedTypes: ['pdf', 'jpg', 'png', 'jpeg'],
      enableZatcaArchive: true
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!hasPermission(session.user, 'settings', 'edit')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { maxSizeMB, allowedTypes, enableZatcaArchive } = body;

    const company = await prisma.company.update({
      where: { id: session.user.companyId },
      data: {
        attachmentSettings: {
          maxSizeMB: Number(maxSizeMB || 5),
          allowedTypes: Array.isArray(allowedTypes) ? allowedTypes : ['pdf', 'jpg', 'png', 'jpeg'],
          enableZatcaArchive: enableZatcaArchive !== undefined ? enableZatcaArchive : true
        }
      },
      select: { attachmentSettings: true }
    });

    return NextResponse.json(company.attachmentSettings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

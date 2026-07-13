import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    // Only Admin/SuperAdmin can generate API tokens
    if (!session || !session.user || (session.user.role !== 'Admin' && session.user.role !== 'SuperAdmin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = session.user;
    
    // Generate a secure random token
    const token = `qx_${crypto.randomBytes(24).toString('hex')}`;

    await prisma.companyProfile.updateMany({
      where: { companyId },
      data: { apiToken: token }
    });

    return NextResponse.json({ success: true, token });
  } catch (error: any) {
    console.error('Error generating API token:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

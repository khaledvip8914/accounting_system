import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { initWhatsApp, logoutWhatsApp } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user, 'settings', 'edit')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const companyId = session.user.companyId;
    
    // First destroy any existing session completely
    await logoutWhatsApp(companyId);
    
    // Start fresh
    initWhatsApp(companyId);

    return NextResponse.json({ success: true, status: 'STARTING' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

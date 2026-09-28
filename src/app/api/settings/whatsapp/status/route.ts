import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { getWhatsAppStatus, initWhatsApp } from '@/lib/whatsapp';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user, 'settings', 'view') && !hasPermission(session.user, 'invoices', 'view')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const companyId = session.user.companyId;
    let status = await getWhatsAppStatus(companyId);

    // If it's the first time and they are DISCONNECTED, we should initialize
    if (status.status === 'DISCONNECTED') {
        initWhatsApp(companyId); // Fire and forget
        status.status = 'STARTING';
    }

    return NextResponse.json(status);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

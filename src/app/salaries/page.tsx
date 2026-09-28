import React from 'react';
import { cookies } from 'next/headers';
import SalariesClient from './SalariesClient';
import Layout from '../layout';

import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function SalariesPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'ar';

  const session = await getSession();
  if (!session || !session.user) {
    redirect('/login');
  }

  const { hasPermission } = await import('@/lib/permissions');
  if (!hasPermission(session.user, 'hr_salaries', 'view') && !hasPermission(session.user, 'hr', 'view')) {
    redirect('/unauthorized');
  }

  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId }
  });

  const profile = await prisma.companyProfile.findFirst({
    where: { companyId: session.user.companyId }
  });

  return (
    <SalariesClient 
      lang={lang}
      companyName={(lang === 'ar' && (profile?.nameAr || company?.nameAr) ? (profile?.nameAr || company?.nameAr) : (profile?.name || company?.name)) || ''}
      companyLogo={profile?.logo || null}
    />
  );
}

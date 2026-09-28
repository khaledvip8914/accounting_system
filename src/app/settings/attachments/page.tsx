import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import AttachmentsClient from './AttachmentsClient';
import { getDictionary } from '@/lib/i18n';
import { cookies } from 'next/headers';
import { hasPermission } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export default async function AttachmentsPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  
  if (!hasPermission(session.user, 'settings', 'view')) {
    redirect('/');
  }

  const cookieStore = await cookies();
  const lang = (cookieStore.get('lang')?.value || 'ar') as 'ar' | 'en';
  const dict = await getDictionary(lang);

  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
    select: { attachmentSettings: true }
  });

  const defaultSettings = {
    maxSizeMB: 5,
    allowedTypes: ['pdf', 'jpg', 'png', 'jpeg'],
    enableZatcaArchive: true
  };

  return (
    <div className="module-container">
      <AttachmentsClient 
        initialSettings={(company?.attachmentSettings as any) || defaultSettings} 
        lang={lang} 
        dict={dict}
      />
    </div>
  );
}

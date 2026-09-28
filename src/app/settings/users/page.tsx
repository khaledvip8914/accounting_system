import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n';
import { prisma } from '@/lib/db';
import UsersClient from './UsersClient';
import { Lang } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }

  const { hasPermission } = await import('@/lib/permissions');
  if (!hasPermission(session.user, 'settings_users', 'view') && !hasPermission(session.user, 'settings', 'view')) {
    redirect('/unauthorized');
  }

  const companyId = session.user.companyId;

  const cookieStore = await cookies();
  const lang = (cookieStore.get('NX_LANG')?.value || 'ar') as Lang;
  const dict = getDictionary(lang);
  
  const [users, roles] = await Promise.all([
    prisma.user.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      include: { roleRef: true }
    }),
    prisma.role.findMany({
      where: { companyId },
      orderBy: { name: 'asc' }
    })
  ]);

  return (
    <UsersClient 
      initialUsers={users} 
      roles={roles}
      lang={lang} 
      dict={dict} 
    />
  );
}

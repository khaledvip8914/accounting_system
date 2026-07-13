import { prisma } from '@/lib/db';
import RolesClient from './RolesClient';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { requireFeature } from '@/lib/subscription';
import { redirect } from 'next/navigation';

export default async function RolesPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'ar';
  const dict = getDictionary(lang);
  
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }
  await requireFeature(session.user.companyId, 'hasUserPermissions');

  const roles = await prisma.role.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { name: 'asc' },
    include: { _count: { select: { users: true } } }
  });

  return (
    <RolesClient initialRoles={roles} lang={lang} dict={dict} />
  );
}

import { prisma } from '@/lib/db';
import RolesClient from './RolesClient';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n';

export default async function RolesPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'ar';
  const dict = getDictionary(lang);
  
  const roles = await prisma.role.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { users: true } } }
  });

  return (
    <RolesClient initialRoles={roles} lang={lang} dict={dict} />
  );
}

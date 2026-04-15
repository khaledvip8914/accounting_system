import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n';
import { prisma } from '@/lib/db';
import UsersClient from './UsersClient';
import { Lang } from '@/lib/i18n';

export default async function UsersPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('NX_LANG')?.value || 'ar') as Lang;
  const dict = getDictionary(lang);
  
  const [users, roles] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { roleRef: true }
    }),
    prisma.role.findMany({
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

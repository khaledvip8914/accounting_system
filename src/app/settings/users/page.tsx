import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n';
import { getUsers } from './actions';
import UsersClient from './UsersClient';
import { Lang } from '@/lib/i18n';

export default async function UsersPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('NX_LANG')?.value || 'ar') as Lang;
  const dict = getDictionary(lang);
  
  const users = await getUsers();

  return (
    <UsersClient 
      initialUsers={users} 
      lang={lang} 
      dict={dict} 
    />
  );
}

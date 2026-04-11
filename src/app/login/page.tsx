import { cookies } from 'next/headers';
import LoginClient from './LoginClient';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'ar';

  return <LoginClient lang={lang} />;
}

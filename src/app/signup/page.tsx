import { cookies } from 'next/headers';
import SignupClient from './SignupClient';

export default async function Signup() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'en';

  return <SignupClient lang={lang} />;
}

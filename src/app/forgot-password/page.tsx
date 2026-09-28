import { cookies } from 'next/headers';
import ForgotPasswordClient from './ForgotPasswordClient';

export default async function ForgotPassword() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'ar';

  return <ForgotPasswordClient lang={lang} />;
}


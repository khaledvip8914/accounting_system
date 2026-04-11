import { cookies } from 'next/headers';
import { getDictionary, Lang } from '@/lib/i18n';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('NX_LANG')?.value as Lang) || 'ar';
  const dict = getDictionary(lang);

  return (
    <SettingsClient lang={lang} dict={dict} />
  );
}

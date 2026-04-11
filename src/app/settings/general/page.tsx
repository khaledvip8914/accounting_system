import { cookies } from 'next/headers';
import { getDictionary, Lang } from '@/lib/i18n';
import GeneralSettingsClient from './GeneralSettingsClient';
import { getCompanyProfile } from '../actions';

export default async function GeneralSettingsPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('NX_LANG')?.value as Lang) || 'ar';
  const dict = getDictionary(lang);
  const profile = await getCompanyProfile();

  return (
    <GeneralSettingsClient lang={lang} dict={dict} initialProfile={profile} />
  );
}

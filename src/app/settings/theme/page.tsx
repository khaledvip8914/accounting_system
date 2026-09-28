import { cookies } from 'next/headers';
import ThemeClient from './ThemeClient';
import { Lang } from '@/lib/i18n';

export default async function ThemePage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('NX_LANG')?.value || 'ar') as Lang;

  return <ThemeClient lang={lang} />;
}


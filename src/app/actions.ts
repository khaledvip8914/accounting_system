'use server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function setLanguage(lang: string) {
  const c = await cookies();
  c.set('NX_LANG', lang, { path: '/' });
  // revalidate everything essentially
  revalidatePath('/', 'layout');
}

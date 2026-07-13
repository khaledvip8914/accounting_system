import { cookies } from 'next/headers';
import ResetPasswordClient from './ResetPasswordClient';

export default async function ResetPassword({ searchParams }: { searchParams: { token?: string } }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NX_LANG')?.value || 'en';
  
  // In Next.js app router, searchParams is a promise in recent versions or directly accessible
  // Wait for it if it's a promise, though typically it's passed down directly
  const awaitedParams = await searchParams;

  return <ResetPasswordClient lang={lang} token={awaitedParams?.token || ''} />;
}

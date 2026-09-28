import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { cookies } from 'next/headers';
import AnalysisDimensionsClient from './AnalysisDimensionsClient';

export default async function AnalysisDimensionsPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/auth/signin');
  }

  const companyId = session.user.companyId || 'default';
  
  const cookieStore = await cookies();
  const lang = (cookieStore.get('NX_LANG')?.value as any) || 'ar';
  const dict = await getDictionary(lang);

  return (
    <div className="module-container">
      <AnalysisDimensionsClient 
        lang={lang} 
        dict={dict} 
        companyId={companyId} 
      />
    </div>
  );
}

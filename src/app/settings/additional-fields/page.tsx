import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { cookies } from 'next/headers';
import AdditionalFieldsClient from './AdditionalFieldsClient';

export default async function AdditionalFieldsPage() {
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
      <AdditionalFieldsClient 
        lang={lang} 
        dict={dict} 
        companyId={companyId} 
      />
    </div>
  );
}

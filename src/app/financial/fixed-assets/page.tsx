import { prisma } from '@/lib/db';
import FixedAssetsClient from './FixedAssetsClient';
import { Lang } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { requireFeature } from '@/lib/subscription';

export default async function FixedAssetsPage(props: {
  params: Promise<any>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const session = await getSession();
  if (!session || !session.user || !session.user.companyId) {
    redirect('/login');
  }
  
  const companyId = session.user.companyId;
  await requireFeature(companyId, 'hasFinancialModule');

  const searchParams = await props.searchParams;
  const lang = (searchParams.lang as Lang) || 'ar';

  try {
    const assets = await prisma.fixedAsset.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    });

    return (
      <FixedAssetsClient 
        lang={lang} 
        initialAssets={assets} 
      />
    );
  } catch (err: any) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h1>Server Error (Fixed Assets)</h1>
        <pre>{err.message}</pre>
      </div>
    );
  }
}

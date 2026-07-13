import ZatcaOnboarding from '@/components/ZatcaOnboarding';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireFeature } from '@/lib/subscription';

export default async function ZatcaSettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  await requireFeature(session.user.companyId, 'hasZatcaPhase2');

  const profile = await prisma.companyProfile.findFirst({
    where: { companyId: session.user?.companyId }
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">ربط هيئة الزكاة والضريبة والجمارك (ZATCA)</h1>
        <p className="text-gray-400">إعدادات المرحلة الثانية (الربط والتكامل) لمنظومة الفوترة الإلكترونية</p>
      </div>
      
      <div className="card p-6">
        <ZatcaOnboarding companyId={session.user?.companyId || ''} currentStatus={profile?.zatcaComplianceStatus || 'Not Onboarded'} onClose={() => {}} />
      </div>
    </div>
  );
}

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function VerifyPage(props: { searchParams: Promise<{ token: string }> }) {
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  if (!token) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ color: '#ef4444' }}>رابط غير صالح</h1>
        <p>عذراً، هذا الرابط غير صالح أو انتهت صلاحيته.</p>
        <Link href="/login" style={{ color: '#6366f1', textDecoration: 'underline' }}>العودة لتسجيل الدخول</Link>
      </div>
    );
  }

  const user = await prisma.user.findFirst({
    where: { verificationToken: token }
  });

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ color: '#ef4444' }}>فشل التحقق</h1>
        <p>لم نتمكن من العثور على حساب مرتبط بهذا الرابط.</p>
        <Link href="/login" style={{ color: '#6366f1', textDecoration: 'underline' }}>العودة لتسجيل الدخول</Link>
      </div>
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ color: '#10b981' }}>تم التحقق بنجاح!</h1>
      <p>شكراً لك، تم تفعيل حسابك بنجاح. يمكنك الآن تسجيل الدخول.</p>
      <Link href="/login" style={{ padding: '0.75rem 1.5rem', background: '#6366f1', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
        تسجيل الدخول الآن
      </Link>
    </div>
  );
}

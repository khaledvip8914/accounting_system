import Link from 'next/link';

export const metadata = {
  title: 'غير مصرح | Unauthorized',
};

export default function UnauthorizedPage() {
  return (
    <div className="app-container" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      width: '100vw',
      height: '100vh',
    }}>
      <div className="card" style={{ 
        maxWidth: '450px', 
        width: '90%', 
        textAlign: 'center',
        padding: '3rem 2rem',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        boxShadow: '0 10px 40px rgba(239, 68, 68, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '100px',
          background: 'rgba(239, 68, 68, 0.2)',
          filter: 'blur(40px)',
          borderRadius: '50%',
          zIndex: 0
        }} />

        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          color: 'var(--accent-danger, #ef4444)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2.5rem',
          position: 'relative',
          zIndex: 1,
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          🔒
        </div>
        
        <h1 style={{ 
          marginBottom: '1rem', 
          fontSize: '1.75rem', 
          fontWeight: '700',
          position: 'relative',
          zIndex: 1
        }}>
          وصول مرفوض
        </h1>
        
        <p style={{ 
          color: 'var(--text-secondary, #94a3b8)', 
          lineHeight: '1.6', 
          marginBottom: '2.5rem',
          fontSize: '1.05rem',
          position: 'relative',
          zIndex: 1
        }}>
          عذراً، يبدو أنك لا تملك الصلاحيات الكافية للوصول إلى هذه الصفحة. 
          الرجاء التواصل مع مدير النظام إذا كنت تعتقد أن هذا خطأ.
        </p>

        <Link href="/" className="btn-primary" style={{ 
          display: 'inline-flex', 
          justifyContent: 'center', 
          width: '100%',
          position: 'relative',
          zIndex: 1,
          background: 'var(--card-bg, rgba(15, 23, 42, 0.8))',
          border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
          color: 'var(--text-primary, #fff)'
        }}>
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

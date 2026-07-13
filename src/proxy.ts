import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('NX_SESSION')?.value;
  const { pathname } = request.nextUrl;

  // Paths that don't require authentication
  if (
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/signup') ||
    pathname.startsWith('/api/auth/forgot-password') ||
    pathname.startsWith('/api/auth/reset-password') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password')
  ) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from the login page
  if (pathname === '/login') {
    if (session) {
      try {
        const payload = await decrypt(session);
        if (payload?.user) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      } catch (err) {
        // invalid session, continue to login
      }
    }
    return NextResponse.next();
  }

  // Bypass static files like images
  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)) {
    return NextResponse.next();
  }

  if (!session) {
    console.log(`Middleware: No session cookie found for ${pathname}. Redirecting to /login`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = await decrypt(session);
    if (!payload?.user) {
      console.log(`Middleware: Payload has no user for ${pathname}. Redirecting to /login`);
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log(`Middleware: Authorized access to ${pathname} for user ${payload.user.username}`);
  } catch (err: any) {
    console.warn(`Middleware: Session decryption failed for ${pathname}: ${err.message}. Redirecting to /login`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes except auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};

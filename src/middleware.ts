import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('NX_SESSION')?.value;
  const { pathname } = request.nextUrl;

  // Paths that don't require authentication
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth/login')) {
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

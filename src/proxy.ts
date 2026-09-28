import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 200;

function applySecurityHeaders(res: NextResponse) {
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-DNS-Prefetch-Control', 'on');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy (CSP)
  const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' ws: wss: https:; frame-src 'self' https://*.openstreetmap.org https://maps.google.com https://www.google.com; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests;";
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('X-Test', 'middleware-is-running');

  // Permissions Policy
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), browsing-topics=()');
  
  return res;
}

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('NX_SESSION')?.value;
  const { pathname } = request.nextUrl;
  console.log('MIDDLEWARE EXECUTED FOR:', pathname);

  // Rate Limiting for API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const record = rateLimitMap.get(ip);
    
    if (record) {
      if (now - record.timestamp < RATE_LIMIT_WINDOW_MS) {
        record.count += 1;
        if (record.count > MAX_REQUESTS_PER_WINDOW) {
          return applySecurityHeaders(new NextResponse(
            JSON.stringify({ error: 'Too Many Requests', message: 'You have been temporarily blocked.' }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          ));
        }
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }
    
    if (rateLimitMap.size > 10000) rateLimitMap.clear();
  }

  // Paths that don't require authentication
  if (
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/signup') ||
    pathname.startsWith('/api/auth/forgot-password') ||
    pathname.startsWith('/api/auth/reset-password') ||
    pathname.startsWith('/api/v1/attendance/') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password')
  ) {
    return applySecurityHeaders(NextResponse.next());
  }

  // Redirect authenticated users away from the login page
  if (pathname === '/login') {
    if (session) {
      try {
        const payload = await decrypt(session);
        if (payload?.user) {
          return applySecurityHeaders(NextResponse.redirect(new URL('/', request.url), 308));
        }
      } catch (err) {
        // invalid session, continue to login
      }
    }
    return applySecurityHeaders(NextResponse.next());
  }

  // Bypass static files like images, fonts, manifest, and archive downloads
  if (
    pathname === '/manifest.json' ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/icons/') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|json|webmanifest|txt|xml|woff2?|ttf|eot|zip|tar\.gz)$/)
  ) {
    return applySecurityHeaders(NextResponse.next());
  }

  if (!session) {
    console.log(`Middleware: No session cookie found for ${pathname}. Redirecting to /login`);
    return applySecurityHeaders(NextResponse.redirect(new URL('/login', request.url), 308));
  }

  try {
    const payload = await decrypt(session);
    if (!payload?.user) {
      console.log(`Middleware: Payload has no user for ${pathname}. Redirecting to /login`);
      return applySecurityHeaders(NextResponse.redirect(new URL('/login', request.url), 308));
    }
    console.log(`Middleware: Authorized access to ${pathname} for user ${payload.user.username}`);
  } catch (err: any) {
    console.warn(`Middleware: Session decryption failed for ${pathname}: ${err.message}. Redirecting to /login`);
    return applySecurityHeaders(NextResponse.redirect(new URL('/login', request.url), 308));
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

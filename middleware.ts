import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip authentication check for login page
  if (pathname === '/dashboard/login') {
    return NextResponse.next();
  }
  
  // Protect all dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // Check for the auth cookie
    const authToken = request.cookies.get('dashboard_auth')?.value;
    
    // If no auth token or invalid token, redirect to login
    if (!authToken) {
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }
    
    try {
      const token = JSON.parse(authToken);
      // Check if token is expired
      if (token.expiration < Date.now()) {
        return NextResponse.redirect(new URL('/dashboard/login', request.url));
      }
    } catch (e) {
      // Invalid token format
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
}; 
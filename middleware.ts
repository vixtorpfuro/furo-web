import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const isNoki = host === 'www.noki.cl' || host === 'noki.cl'

  if (isNoki) {
    const { pathname } = request.nextUrl
    // Already on /noki or a sub-path — pass through
    if (pathname.startsWith('/noki')) {
      return NextResponse.next()
    }
    // Rewrite to the matching /noki sub-path (root → /noki, /agenda → /noki/agenda, etc.)
    const url = request.nextUrl.clone()
    url.pathname = pathname === '/' ? '/noki' : `/noki${pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|.*\\..*).*)'],
}

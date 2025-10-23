import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get: (name: string) => req.cookies.get(name)?.value,
      set: (name: string, value: string, options: any) => {
        res.cookies.set({ name, value, ...options })
      },
      remove: (name: string, options: any) => {
        res.cookies.set({ name, value: '', ...options, maxAge: 0 })
      },
    },
  })

  // Touch the session so auth cookies are kept in sync on every request
  await supabase.auth.getSession()

  return res
}

export const config = {
  matcher: [
    // Run on all routes except static assets and image optimizer
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

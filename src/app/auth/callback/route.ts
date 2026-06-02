import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // If they came from the pricing page wanting to checkout, redirect to checkout page
  if (next === 'checkout') {
    return NextResponse.redirect(`${origin}/checkout`)
  }

  return NextResponse.redirect(`${origin}/app`)
}

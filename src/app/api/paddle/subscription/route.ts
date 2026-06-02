import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro, paddle_subscription_id')
    .eq('id', user.id)
    .single()

  if (!profile?.paddle_subscription_id) {
    return NextResponse.json({ plan: 'free' })
  }

  try {
    const res = await fetch(`https://api.paddle.com/subscriptions/${profile.paddle_subscription_id}`, {
      headers: { 'Authorization': `Bearer ${process.env.PADDLE_API_KEY}` },
    })
    const json = await res.json()
    const sub = json.data

    return NextResponse.json({
      plan: 'pro',
      status: sub.status,                          // active, canceled, paused
      nextBilledAt: sub.next_billed_at,            // ISO date
      billingCycle: sub.billing_cycle,             // { interval, frequency }
      unitPrice: sub.items?.[0]?.price?.unit_price?.amount, // "900"
      currency: sub.items?.[0]?.price?.unit_price?.currency_code, // "USD"
      canceledAt: sub.canceled_at ?? null,
      managementUrl: sub.management_urls?.cancel ?? null,
    })
  } catch (e) {
    console.error('Paddle subscription fetch error:', e)
    return NextResponse.json({ plan: 'pro', status: 'unknown' })
  }
}

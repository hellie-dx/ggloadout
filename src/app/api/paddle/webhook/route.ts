import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Service role client to bypass RLS for webhook updates
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('paddle-signature')

  // Verify webhook signature if secret is set
  if (process.env.PADDLE_WEBHOOK_SECRET && signature) {
    const ts = signature.split(';')[0]?.replace('ts=', '')
    const h1 = signature.split(';')[1]?.replace('h1=', '')

    const payload = `${ts}:${body}`
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(process.env.PADDLE_WEBHOOK_SECRET),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
    const computed = Buffer.from(sig).toString('hex')

    if (computed !== h1) {
      console.error('Paddle webhook signature mismatch')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  const event = JSON.parse(body)
  const { event_type, data } = event

  console.log('Paddle webhook:', event_type)

  // Subscription activated → mark user as Pro
  if (event_type === 'subscription.activated' || event_type === 'transaction.completed') {
    const userId = data.custom_data?.user_id
    const subscriptionId = data.id

    if (!userId) {
      console.error('No user_id in custom_data')
      return NextResponse.json({ received: true })
    }

    await supabaseAdmin.from('profiles').upsert({
      id: userId,
      is_pro: true,
      paddle_subscription_id: subscriptionId,
    }, { onConflict: 'id' })

    console.log(`Upgraded user ${userId} to Pro`)
  }

  // Subscription cancelled/paused → revoke Pro
  if (event_type === 'subscription.canceled' || event_type === 'subscription.paused') {
    const userId = data.custom_data?.user_id

    if (userId) {
      await supabaseAdmin.from('profiles').update({
        is_pro: false,
        paddle_subscription_id: null,
      }).eq('id', userId)

      console.log(`Revoked Pro for user ${userId}`)
    }
  }

  return NextResponse.json({ received: true })
}

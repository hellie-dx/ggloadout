import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Create a Paddle transaction with user_id in custom_data
  const res = await fetch('https://api.paddle.com/transactions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ price_id: process.env.PADDLE_PRICE_ID, quantity: 1 }],
      custom_data: { user_id: user.id, email: user.email },
      checkout: {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ggloadout.com'}/app?upgraded=true`,
      },
    }),
  })

  const json = await res.json()

  if (!res.ok) {
    console.error('Paddle checkout error:', JSON.stringify(json))
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }

  return NextResponse.json({ url: json.data.checkout.url })
}

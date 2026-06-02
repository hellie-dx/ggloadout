'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PricingUpgradeButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Not signed in — sign in with Google first, then come back to checkout
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=checkout`,
        },
      })
      return
    }

    // Signed in — go straight to checkout
    const res = await fetch('/api/paddle/checkout', { method: 'POST' })
    const json = await res.json()
    if (json.url) {
      window.location.href = json.url
    } else {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative p-[1.5px]"
      style={{
        borderRadius: '12px',
        background: 'linear-gradient(to right, #6644ff, #cc0088)',
        boxShadow: '0 0 18px rgba(102,68,255,0.45), 0 0 36px rgba(204,0,136,0.25)',
        animation: 'rgb-breathe 4s ease-in-out infinite',
      } as React.CSSProperties}
    >
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full text-center px-6 py-3 text-white font-semibold text-sm hover:brightness-110 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ borderRadius: 'calc(12px - 1.5px)', background: 'rgba(10,10,16,0.88)', backdropFilter: 'blur(12px)' }}
      >
        {loading ? (
          <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round"/></svg>Loading...</>
        ) : (
          'Upgrade to Pro'
        )}
      </button>
    </div>
  )
}

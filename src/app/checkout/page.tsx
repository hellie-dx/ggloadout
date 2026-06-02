'use client'

import { useEffect } from 'react'
import { FloatingParticles } from '@/components/magicui/floating-particles'

export default function CheckoutPage() {
  useEffect(() => {
    // Auto-trigger checkout now that user is signed in
    fetch('/api/paddle/checkout', { method: 'POST' })
      .then(r => r.json())
      .then(({ url }) => { if (url) window.location.href = url })
  }, [])

  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center">
      <FloatingParticles count={30} />
      <div className="relative z-10 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-white/60 text-sm">Taking you to checkout...</p>
      </div>
    </div>
  )
}

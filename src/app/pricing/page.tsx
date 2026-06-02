import React from 'react'
import Link from 'next/link'
import { FloatingParticles } from '@/components/magicui/floating-particles'
import SiteNav from '@/components/SiteNav'

const rgbText: React.CSSProperties = {
  background: 'linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff88, #0088ff, #8800ff, #ff0088, #ff0000)',
  backgroundSize: '400% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: 'text-color-flow 12s linear infinite, text-glow-pulse 3s ease-in-out infinite',
}

// Same in both plans — shown in grey
const SHARED_FEATURES = [
  'All 4 platforms (Steam, itch.io, App Store, Google Play)',
  'Steam 2026 AI disclosure text',
  'Block-level regeneration',
  'Copy to clipboard',
]

// Free-only features — normal white
const FREE_ONLY = [
  '3 generations per day',
  'No credit card required',
]

// Pro-only features — RGB animated text
const PRO_ONLY = [
  '50 generations per day',
  'Save generations to account',
  'Priority support',
]

const rgbBorder: React.CSSProperties = {
  background: 'linear-gradient(to right, #6644ff, #cc0088)',
  animation: 'rgb-breathe 4s ease-in-out infinite',
}

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles count={50} />
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(120,80,255,0.18) 0%, rgba(0,200,255,0.08) 60%, transparent 100%)' }}
      />

      {/* Header */}
      <SiteNav />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20">

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm text-white/50 font-semibold uppercase tracking-widest mb-3">Pricing</p>
          <h1 className="text-5xl font-bold mb-5 text-white">Simple, <span style={rgbText}>honest</span> pricing</h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Free */}
          <div className="rounded-2xl bg-[#111111] border border-white/[0.07] p-8 flex flex-col">
            <div className="mb-6">
              <div className="text-sm text-white/50 font-medium mb-2">Free</div>
              <div className="flex items-end gap-2">
                <span className="text-6xl font-bold text-white">$0</span>
              </div>
              <div className="text-sm text-white/40 mt-1">Forever free · no credit card needed</div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {SHARED_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/35">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4 text-white/20 shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </li>
              ))}
              <li className="border-t border-white/[0.06] pt-3" />
              {FREE_ONLY.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4 text-white/50 shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/app" className="block w-full text-center px-6 py-3 rounded-xl border border-white/[0.15] text-white/70 hover:text-white hover:border-white/30 font-semibold text-sm transition-all duration-150">
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl flex flex-col">
            {/* RGB border */}
            <div className="absolute inset-0 p-[1.5px] rounded-2xl" style={rgbBorder}>
              <div className="w-full h-full rounded-[14px] bg-[#111111]" />
            </div>
            <div className="relative bg-[#111111] rounded-2xl p-8 flex flex-col h-full border border-transparent">
              {/* Top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-violet-500/10 to-transparent pointer-events-none rounded-t-2xl" />

              <div className="relative mb-6">
                <div className="mb-2">
                  <span className="text-sm font-semibold" style={rgbText}>Pro</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-6xl font-bold text-white">$9</span>
                  <span className="text-white/40 mb-2">/month</span>
                </div>
                <div className="text-sm text-white/40 mt-1">Billed monthly · cancel anytime</div>
              </div>

              <ul className="space-y-3 mb-8 flex-1 relative">
                {SHARED_FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/35">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4 text-white/20 shrink-0">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {f}
                  </li>
                ))}
                <li className="border-t border-white/[0.06] pt-3" />
                {PRO_ONLY.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-semibold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4 text-white shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.4))' }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={rgbText}>{f}</span>
                  </li>
                ))}
              </ul>

              <div
                className="relative p-[1.5px]"
                style={{
                  borderRadius: '12px',
                  background: 'linear-gradient(to right, #6644ff, #cc0088)',
                  boxShadow: '0 0 18px rgba(102,68,255,0.45), 0 0 36px rgba(204,0,136,0.25)',
                  animation: 'rgb-breathe 4s ease-in-out infinite',
                } as React.CSSProperties}
              >
                <Link
                  href="/app"
                  className="block w-full text-center px-6 py-3 text-white font-semibold text-sm hover:brightness-110 transition-all duration-300"
                  style={{ borderRadius: 'calc(12px - 1.5px)', background: 'rgba(10,10,16,0.88)', backdropFilter: 'blur(12px)' }}
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10"><span style={rgbText}>Frequently Asked Questions</span></h2>
          <div className="space-y-6">
            {[
              {
                q: 'What counts as a generation?',
                a: 'One generation = filling in your game details and hitting Generate. It produces copy for all your selected platforms at once — that counts as one generation.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel anytime from your account. You keep Pro access until the end of your billing period.',
              },
              {
                q: 'What platforms are supported?',
                a: 'Steam, itch.io, App Store (iOS), and Google Play. Each gets correctly formatted copy — right character limits, right tone, ready to paste.',
              },
              {
                q: 'Is the AI copy compliant with Steam\'s 2026 AI disclosure rules?',
                a: 'Yes. GGLoadout automatically generates the required AI disclosure text that Valve now requires for AI-generated store descriptions.',
              },
              {
                q: 'What payment methods are accepted?',
                a: 'All major credit and debit cards (Visa, Mastercard, Amex). Payments are processed securely by Paddle.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-white/[0.07] pb-6">
                <div className="text-sm font-semibold text-white mb-2">{q}</div>
                <div className="text-sm text-white/60 leading-relaxed">{a}</div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.07] py-8 mt-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white/60 font-bold text-sm">GGLoadout</span>
          <p className="text-sm text-white/40">Payments processed securely by Paddle · <a href="https://www.paddle.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">paddle.com</a></p>
          <p className="text-xs text-white/30">© 2026 GGLoadout</p>
        </div>
      </footer>
    </div>
  )
}

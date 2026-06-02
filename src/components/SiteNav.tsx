'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import GGLoadoutLogo from '@/components/GGLoadoutLogo'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { ShimmerButton } from '@/components/magicui/shimmer-button'

export default function SiteNav() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <motion.header
      className="relative z-20 px-6 py-5 flex items-center justify-between max-w-6xl mx-auto"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <GGLoadoutLogo size={58} />
        <span className="text-lg font-bold tracking-widest text-white uppercase">GGLoadout</span>
        <AnimatedGradientText className="!mx-0">Beta</AnimatedGradientText>
      </a>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-1">
        <a
          href="/app"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          App
        </a>
        {([
          { label: 'Pricing', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, href: '/pricing' },
          { label: 'Game News', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg> },
          { label: 'Esports', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M6 3h12v8a6 6 0 01-12 0V3zM6 7H4a2 2 0 000 4h2M18 7h2a2 2 0 010 4h-2M12 17v4M8 21h8"/></svg> },
        ] as { label: string; icon: React.ReactNode; href?: string }[]).map(({ label, icon, href }) => (
          href ? (
            <a key={label} href={href} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.06] transition-all duration-150">
              {icon}{label}
            </a>
          ) : (
            <div key={label} className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white/50 cursor-not-allowed select-none">
              {icon}{label}
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 font-semibold uppercase tracking-wider leading-none">Soon</span>
            </div>
          )
        ))}
      </nav>

      {/* Sign in */}
      <div className="flex items-center">
        <ShimmerButton variant="classic" borderRadius="8px" onClick={handleLogin} className="!px-4 !py-1.5 !text-sm" innerClassName="bg-white !text-black font-semibold">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 shrink-0">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
          Sign in
        </ShimmerButton>
      </div>
    </motion.header>
  )
}

'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import GGLoadoutLogo from '@/components/GGLoadoutLogo'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'

interface AppHeaderProps {
  activePage?: 'generate' | 'profile' | 'saves' | 'billing' | 'pricing'
}

export default function AppHeader({ activePage }: AppHeaderProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    setOpen(false)
    await supabase.auth.signOut()
    router.push('/')
  }

  const navLink = (href: string, page: AppHeaderProps['activePage'], icon: React.ReactNode, label: string) => (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        activePage === page
          ? 'text-white bg-white/[0.08]'
          : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
      }`}
    >
      {icon}{label}
    </Link>
  )

  const dropdownItem = (onClick: () => void, icon: React.ReactNode, label: string, sublabel?: string, danger?: boolean) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
        danger ? 'text-white/50 hover:text-red-400' : 'text-white/70 hover:text-white'
      }`}
    >
      <span className={`shrink-0 ${danger ? '' : 'text-white/40'}`}>{icon}</span>
      <div className="text-left">
        <div className="font-medium leading-none">{label}</div>
        {sublabel && <div className="text-[10px] text-white/30 mt-0.5">{sublabel}</div>}
      </div>
    </button>
  )

  return (
    <header className="relative sticky top-0 z-20 border-b border-white/[0.07] bg-background/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <GGLoadoutLogo size={36} />
        <span className="text-base font-bold tracking-widest text-white uppercase">GGLoadout</span>
        <AnimatedGradientText className="!mx-0 text-xs">Beta</AnimatedGradientText>
      </Link>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {navLink('/app', 'generate',
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
          'Generate'
        )}
        {navLink('/pricing', 'pricing',
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
          'Pricing'
        )}
      </nav>

      {/* Account avatar + dropdown */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-150 ${
            open
              ? 'bg-white/[0.15] border-white/[0.30]'
              : 'bg-white/[0.06] border-white/[0.10] hover:bg-white/[0.12] hover:border-white/[0.20]'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-white/70">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#111111] border border-white/[0.10] shadow-2xl shadow-black/60 overflow-hidden z-50">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/[0.07]">
              <div className="text-xs text-white/40">My Account</div>
            </div>

            {/* Items */}
            <div className="py-1">
              {dropdownItem(
                () => { setOpen(false); router.push('/app/profile') },
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
                'Profile', 'Account info & settings'
              )}
              {dropdownItem(
                () => { setOpen(false); router.push('/app/saves') },
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
                'My Saves', 'View saved generations'
              )}
              {dropdownItem(
                () => { setOpen(false); router.push('/app/profile#billing') },
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
                'Billing', 'Subscription & plan'
              )}
            </div>

            <div className="border-t border-white/[0.07] py-1">
              {dropdownItem(
                handleSignOut,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
                'Sign out', undefined, true
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

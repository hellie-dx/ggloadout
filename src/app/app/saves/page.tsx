'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import GGLoadoutLogo from '@/components/GGLoadoutLogo'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { FloatingParticles } from '@/components/magicui/floating-particles'

const rgbText: React.CSSProperties = {
  background: 'linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff88, #0088ff, #8800ff, #ff0088, #ff0000)',
  backgroundSize: '400% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: 'text-color-flow 12s linear infinite, text-glow-pulse 3s ease-in-out infinite',
}

interface Generation {
  id: string
  created_at: string
  game_name: string
  form_data: Record<string, unknown>
  output: Record<string, unknown>
}

const PLATFORM_KEYS = ['steam', 'itchio', 'appstore', 'googleplay']
const PLATFORM_LABELS: Record<string, string> = { steam: 'Steam', itchio: 'itch.io', appstore: 'App Store', googleplay: 'Google Play' }

export default function SavesPage() {
  const [saves, setSaves] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  useEffect(() => {
    supabase
      .from('generations')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setSaves((data as Generation[]) ?? [])
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await supabase.from('generations').delete().eq('id', id)
    setSaves(prev => prev.filter(s => s.id !== id))
    setDeletingId(null)
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles count={30} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(120,80,255,0.18) 0%, rgba(0,200,255,0.08) 60%, transparent 100%)' }} />

      <header className="relative sticky top-0 z-20 border-b border-white/[0.07] bg-background/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <GGLoadoutLogo size={36} />
          <span className="text-base font-bold tracking-widest text-white uppercase">GGLoadout</span>
          <AnimatedGradientText className="!mx-0 text-xs">Beta</AnimatedGradientText>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/app" className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.06] transition-all duration-150">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Generate
          </Link>
          <Link href="/app/saves" className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white border-b-2 border-white/40">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            My Saves
          </Link>
          <Link href="/pricing" className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.06] transition-all duration-150">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            Pricing
          </Link>
        </nav>
        <button onClick={handleSignOut} className="text-sm text-white/60 hover:text-white/70 transition-colors">
          Sign out
        </button>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1" style={rgbText}>My Saves</h1>
          <p className="text-sm text-white/50">Your saved store copy generations.</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {!loading && saves.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <span className="text-4xl mb-3">📂</span>
            <p className="text-white/50 text-sm mb-4">No saves yet. Generate copy and hit Save to store it here.</p>
            <Link href="/app" className="text-sm text-white/70 hover:text-white underline transition-colors">
              Go generate →
            </Link>
          </div>
        )}

        {!loading && saves.length > 0 && (
          <div className="grid gap-4">
            {saves.map((save, i) => {
              const platforms = PLATFORM_KEYS.filter(k => save.output[k])
              const formData = save.form_data as Record<string, string>
              return (
                <motion.div
                  key={save.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="rounded-xl bg-[#111111] border border-white/[0.07] p-6 hover:border-white/[0.15] transition-colors duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-base font-semibold text-white truncate">{save.game_name || 'Untitled Game'}</h2>
                        <span className="text-xs text-white/30 shrink-0">{formatDate(save.created_at)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {formData.genre && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50">{formData.genre}</span>}
                        {formData.tone && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50">{formData.tone}</span>}
                        {platforms.map(p => (
                          <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50">{PLATFORM_LABELS[p]}</span>
                        ))}
                      </div>
                      {formData.gameplay && (
                        <p className="text-xs text-white/30 line-clamp-1">{String(formData.gameplay)}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/app?load=${save.id}`}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3 h-3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(save.id)}
                        disabled={deletingId === save.id}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/[0.08] text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all duration-150 disabled:opacity-40"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3 h-3"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                        {deletingId === save.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

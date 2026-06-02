'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import GameForm, { GameFormData } from '@/components/GameForm'
import OutputTabs from '@/components/OutputTabs'
import { motion } from 'framer-motion'
import GGLoadoutLogo from '@/components/GGLoadoutLogo'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import Link from 'next/link'
import { FloatingParticles } from '@/components/magicui/floating-particles'

const rgbText: React.CSSProperties = {
  background: 'linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff88, #0088ff, #8800ff, #ff0088, #ff0000)',
  backgroundSize: '400% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: 'text-color-flow 12s linear infinite, text-glow-pulse 3s ease-in-out infinite',
}

export default function AppPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState<Record<string, unknown> | null>(null)
  const [formData, setFormData] = useState<GameFormData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [regenLoading, setRegenLoading] = useState<Record<string, boolean>>({})
  const [upgraded, setUpgraded] = useState(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('upgraded') === 'true') {
        setUpgraded(true)
        window.history.replaceState({}, '', '/app')
      }
      // Load a saved generation
      const loadId = params.get('load')
      if (loadId) {
        window.history.replaceState({}, '', '/app')
        supabase.from('generations').select('*').eq('id', loadId).single()
          .then(({ data }) => {
            if (data) {
              setOutput(data.output as Record<string, unknown>)
              setFormData(data.form_data as GameFormData)
            }
          })
      }
    }
  }, [])
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleGenerate = async (data: GameFormData) => {
    setIsLoading(true)
    setError(null)
    setOutput(null)
    setSaveState('idle')
    setFormData(data)

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const json = await res.json()

    if (!res.ok) {
      if (json.error === 'LIMIT_REACHED') {
        setError(json.isPro
          ? `You've hit the ${json.limit}/day limit. This resets at midnight — come back tomorrow!`
          : "You've used your 3 free generations today. Upgrade to Pro for 50 generations/day.")
      } else {
        setError('Something went wrong. Please try again.')
      }
    } else {
      setOutput(json.data)
    }

    setIsLoading(false)
  }

  const handleSave = async () => {
    if (!output || !formData) return
    setSaveState('saving')
    const res = await fetch('/api/save-generation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData, output }),
    })
    setSaveState(res.ok ? 'saved' : 'idle')
    if (res.ok) setTimeout(() => setSaveState('idle'), 3000)
  }

  const handleRegenBlock = async (platform: string, block: string) => {
    if (!formData || !output) return
    const key = `${platform}:${block}`
    setRegenLoading(prev => ({ ...prev, [key]: true }))

    const res = await fetch('/api/regenerate-block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData, platform, block }),
    })

    if (res.ok) {
      const { content } = await res.json()
      setOutput(prev => {
        if (!prev) return prev
        const platformData = { ...(prev[platform] as Record<string, unknown>) }
        platformData[block] = content
        return { ...prev, [platform]: platformData }
      })
    }

    setRegenLoading(prev => ({ ...prev, [key]: false }))
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">

      <FloatingParticles count={50} />
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
          <Link href="/app/saves" className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.06] transition-all duration-150">
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

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Form card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="rounded-xl bg-[#111111] border border-white/[0.07] p-7">
              <div className="mb-6">
                <h2 className="text-base font-semibold" style={rgbText}>Your Game Details</h2>
                <p className="text-sm text-white/60 mt-1">Fill in once, get copy for all platforms.</p>
              </div>
              <GameForm onGenerate={handleGenerate} isLoading={isLoading} />
            </div>
          </motion.div>

          {/* Output card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="rounded-xl bg-[#111111] border border-white/[0.07] p-7 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold" style={rgbText}>Generated Copy</h2>
                  <p className="text-sm text-white/60 mt-1">Ready to paste into your store pages.</p>
                </div>
                {output && (
                  <button
                    onClick={handleSave}
                    disabled={saveState === 'saving' || saveState === 'saved'}
                    className="shrink-0"
                  >
                    {saveState === 'saved' ? (
                      <div className="relative p-[1.5px] animate-[border-spin_4s_linear_infinite]"
                        style={{ borderRadius: '8px', background: 'conic-gradient(from var(--angle, 0deg), transparent 65%, #ff0000 72%, #ffaa00 76%, #00ff88 80%, #0088ff 84%, #cc00ff 88%, transparent 93%)' } as React.CSSProperties}>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-white"
                          style={{ borderRadius: 'calc(8px - 1.5px)' }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>
                          Saved
                        </div>
                      </div>
                    ) : (
                      <div className="relative p-[1.5px]"
                        style={{ borderRadius: '8px', background: 'linear-gradient(to right, #6644ff, #cc0088)', animation: 'rgb-breathe 4s ease-in-out infinite' } as React.CSSProperties}>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white"
                          style={{ borderRadius: 'calc(8px - 1.5px)', background: 'rgba(10,10,16,0.88)', backdropFilter: 'blur(12px)' }}>
                          {saveState === 'saving' ? (
                            <><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round"/></svg>Saving...</>
                          ) : (
                            <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Save</>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                )}
              </div>

              {!output && !error && !isLoading && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <span className="text-4xl mb-3">🎮</span>
                  <p className="text-sm text-white/60">Fill in your game details and hit Generate to see your copy here.</p>
                </div>
              )}

              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-3" />
                  <p className="text-sm text-white/60">Writing your copy...</p>
                </div>
              )}

              {upgraded && (
                <div className="bg-green-500/[0.08] border border-green-500/20 rounded-xl p-4 mb-4 flex items-center gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5 text-green-400 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                  <p className="text-sm text-green-300 font-medium">You&apos;re now Pro! Unlimited generations unlocked. 🎉</p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/[0.08] border border-red-500/20 rounded-xl p-4">
                  <p className="text-sm text-red-300">{error}</p>
                  {error.includes('Upgrade to Pro') && (
                    <button
                      onClick={async () => {
                        const res = await fetch('/api/paddle/checkout', { method: 'POST' })
                        const { url } = await res.json()
                        if (url) window.location.href = url
                      }}
                      className="mt-3 w-full"
                    >
                      <div className="relative p-[1.5px]" style={{ borderRadius: '8px', background: 'linear-gradient(to right, #6644ff, #cc0088)', animation: 'rgb-breathe 4s ease-in-out infinite' }}>
                        <div className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white" style={{ borderRadius: 'calc(8px - 1.5px)', background: 'rgba(10,10,16,0.88)', backdropFilter: 'blur(12px)' }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                          Upgrade to Pro — $9/mo
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              )}

              {output && (
                <OutputTabs
                  data={output as Parameters<typeof OutputTabs>[0]['data']}
                  formData={formData as unknown as Record<string, unknown>}
                  onRegenBlock={handleRegenBlock}
                  regenLoading={regenLoading}
                />
              )}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  )
}

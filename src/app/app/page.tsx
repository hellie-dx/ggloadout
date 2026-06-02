'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import GameForm, { GameFormData } from '@/components/GameForm'
import OutputTabs from '@/components/OutputTabs'
import { motion } from 'framer-motion'
import GGLoadoutLogo from '@/components/GGLoadoutLogo'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'

export default function AppPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleGenerate = async (formData: GameFormData) => {
    setIsLoading(true)
    setError(null)
    setOutput(null)

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const json = await res.json()

    if (!res.ok) {
      if (json.error === 'LIMIT_REACHED') {
        setError("You've used your 3 free generations today. Upgrade to Pro for unlimited access.")
      } else {
        setError('Something went wrong. Please try again.')
      }
    } else {
      setOutput(json.data)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-background/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GGLoadoutLogo size={36} />
          <span className="text-base font-bold tracking-widest text-white uppercase">GGLoadout</span>
          <AnimatedGradientText className="!mx-0 text-xs">Beta</AnimatedGradientText>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Form card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="rounded-xl bg-[#111111] border border-white/[0.07] p-7">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-white">Your Game Details</h2>
                <p className="text-sm text-white/40 mt-1">Fill in once, get copy for all platforms.</p>
              </div>
              <GameForm onGenerate={handleGenerate} isLoading={isLoading} />
            </div>
          </motion.div>

          {/* Output card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="rounded-xl bg-[#111111] border border-white/[0.07] p-7 sticky top-24">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-white">Generated Copy</h2>
                <p className="text-sm text-white/40 mt-1">Ready to paste into your store pages.</p>
              </div>

              {!output && !error && !isLoading && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <span className="text-4xl mb-3">🎮</span>
                  <p className="text-sm text-white/40">Fill in your game details and hit Generate to see your copy here.</p>
                </div>
              )}

              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-3" />
                  <p className="text-sm text-white/40">Writing your copy...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/[0.08] border border-red-500/20 rounded-xl p-4">
                  <p className="text-sm text-red-300">{error}</p>
                  {error.includes('Upgrade') && (
                    <button className="mt-3 px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors">
                      Upgrade to Pro — $9/mo
                    </button>
                  )}
                </div>
              )}

              {output && <OutputTabs data={output as Parameters<typeof OutputTabs>[0]['data']} />}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  )
}

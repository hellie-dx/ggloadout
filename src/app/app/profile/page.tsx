'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FloatingParticles } from '@/components/magicui/floating-particles'
import AppHeader from '@/components/AppHeader'
import type { User } from '@supabase/supabase-js'

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

interface Profile {
  is_pro: boolean
  is_admin: boolean
}

interface Subscription {
  plan: 'free' | 'pro'
  status?: string
  nextBilledAt?: string
  billingCycle?: { interval: string; frequency: number }
  unitPrice?: string
  currency?: string
  canceledAt?: string | null
  managementUrl?: string | null
}

const PLATFORM_LABELS: Record<string, string> = { steam: 'Steam', itchio: 'itch.io', appstore: 'App Store', googleplay: 'Google Play' }
const PLATFORM_KEYS = Object.keys(PLATFORM_LABELS)

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [saves, setSaves] = useState<Generation[]>([])
  const [loadingSaves, setLoadingSaves] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [usageToday, setUsageToday] = useState(0)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (!user) return

      // Profile
      supabase.from('profiles').select('is_pro, is_admin').eq('id', user.id).single()
        .then(({ data }) => setProfile(data))

      // Today's usage
      const today = new Date().toISOString().split('T')[0]
      supabase.from('usage').select('count').eq('user_id', user.id).eq('date', today).single()
        .then(({ data }) => setUsageToday(data?.count ?? 0))

      // Subscription
      fetch('/api/paddle/subscription').then(r => r.json()).then(setSubscription)

      // Saves
      supabase.from('generations').select('*').order('created_at', { ascending: false })
        .then(({ data }) => {
          setSaves((data as Generation[]) ?? [])
          setLoadingSaves(false)
        })
    })
  }, [])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await supabase.from('generations').delete().eq('id', id)
    setSaves(prev => prev.filter(s => s.id !== id))
    setDeletingId(null)
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const isPro = profile?.is_pro ?? false
  const isAdmin = profile?.is_admin ?? false
  const dailyLimit = isAdmin ? '∞' : isPro ? '50' : '3'

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles count={30} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(120,80,255,0.18) 0%, rgba(0,200,255,0.08) 60%, transparent 100%)' }} />

      {/* Header */}
      <AppHeader activePage="profile" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* Account section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="rounded-xl bg-[#111111] border border-white/[0.07] p-7">
            <h2 className="text-lg font-bold mb-6" style={rgbText}>My Account</h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-7 h-7 text-white/50">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{user?.email ?? '—'}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {isAdmin ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold">Admin</span>
                    ) : isPro ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 font-semibold">Pro</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.10] text-white/50 font-semibold">Free</span>
                    )}
                    <span className="text-xs text-white/40">{usageToday} / {dailyLimit} generations today</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isPro && !isAdmin && (
                  <Link href="/pricing" className="text-xs px-4 py-2 rounded-lg font-semibold text-white/70 border border-white/[0.10] hover:border-white/20 hover:text-white transition-all duration-150">
                    Upgrade to Pro →
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-xs px-4 py-2 rounded-lg text-white/50 border border-white/[0.08] hover:text-red-400 hover:border-red-400/30 transition-all duration-150"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Billing section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <div className="rounded-xl bg-[#111111] border border-white/[0.07] p-7">
            <h2 className="text-lg font-bold mb-6" style={rgbText}>Subscription & Billing</h2>

            {!subscription && (
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white/50 rounded-full animate-spin" />
                Loading...
              </div>
            )}

            {subscription?.plan === 'free' && (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white mb-1">Free Plan</div>
                  <div className="text-xs text-white/40">3 generations per day · no credit card required</div>
                </div>
                <Link href="/pricing"
                  className="text-xs px-4 py-2 rounded-lg font-semibold text-white/70 border border-white/[0.10] hover:border-white/20 hover:text-white transition-all duration-150">
                  Upgrade to Pro →
                </Link>
              </div>
            )}

            {subscription?.plan === 'pro' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Plan</div>
                    <div className="text-sm font-semibold text-white">Pro</div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Status</div>
                    <div className={`text-sm font-semibold capitalize ${subscription.status === 'active' ? 'text-green-400' : subscription.status === 'canceled' ? 'text-red-400' : 'text-amber-400'}`}>
                      {subscription.status ?? '—'}
                    </div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Amount</div>
                    <div className="text-sm font-semibold text-white">
                      {subscription.unitPrice ? `$${(parseInt(subscription.unitPrice) / 100).toFixed(2)} / mo` : '—'}
                    </div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                      {subscription.status === 'canceled' ? 'Access Until' : 'Next Billing'}
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {subscription.nextBilledAt
                        ? new Date(subscription.nextBilledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—'}
                    </div>
                  </div>
                </div>

                {subscription.status === 'active' && subscription.managementUrl && (
                  <div className="flex items-center gap-3 pt-2">
                    <a href={subscription.managementUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs px-4 py-2 rounded-lg text-red-400/70 border border-red-400/20 hover:text-red-400 hover:border-red-400/40 transition-all duration-150">
                      Cancel subscription
                    </a>
                    <span className="text-xs text-white/30">You keep Pro access until the end of your billing period.</span>
                  </div>
                )}

                {subscription.status === 'canceled' && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/[0.06] border border-amber-500/20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-amber-400 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span className="text-xs text-amber-300">Subscription cancelled. Pro access continues until the date above.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Saves section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div className="rounded-xl bg-[#111111] border border-white/[0.07] p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={rgbText}>My Saves</h2>
              <span className="text-xs text-white/30">{saves.length} {saves.length === 1 ? 'save' : 'saves'}</span>
            </div>

            {loadingSaves && (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {!loadingSaves && saves.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <span className="text-3xl mb-3">📂</span>
                <p className="text-white/40 text-sm">No saves yet.</p>
                <Link href="/app" className="text-xs text-white/50 hover:text-white mt-2 underline transition-colors">Generate something →</Link>
              </div>
            )}

            {!loadingSaves && saves.length > 0 && (
              <div className="space-y-3">
                {saves.map(save => {
                  const platforms = PLATFORM_KEYS.filter(k => save.output[k])
                  const formData = save.form_data as Record<string, string>
                  return (
                    <div key={save.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-150">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-white truncate">{save.game_name || 'Untitled'}</span>
                          <span className="text-[10px] text-white/30 shrink-0">{formatDate(save.created_at)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {formData.genre && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/40">{formData.genre}</span>}
                          {formData.tone && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/40">{formData.tone}</span>}
                          {platforms.map(p => <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/40">{PLATFORM_LABELS[p]}</span>)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/app?load=${save.id}`}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition-colors">
                          Load
                        </Link>
                        <button onClick={() => handleDelete(save.id)} disabled={deletingId === save.id}
                          className="text-xs px-3 py-1.5 rounded-lg border border-white/[0.08] text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all duration-150 disabled:opacity-40">
                          {deletingId === save.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>

      </main>
    </div>
  )
}

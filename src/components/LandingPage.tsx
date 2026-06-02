'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { BorderBeam } from '@/components/magicui/border-beam'
import { FloatingParticles } from '@/components/magicui/floating-particles'
import GGLoadoutLogo from '@/components/GGLoadoutLogo'
import SiteNav from '@/components/SiteNav'
import { Marquee } from '@/components/magicui/marquee'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const rgbText: React.CSSProperties = {
  background: 'linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff88, #0088ff, #8800ff, #ff0088, #ff0000)',
  backgroundSize: '400% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: 'text-color-flow 12s linear infinite, text-glow-pulse 3s ease-in-out infinite',
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
  }),
}

const PLATFORMS = ['Steam', 'itch.io', 'App Store', 'Google Play', 'Epic Games', 'GOG', 'Xbox', 'PlayStation']

const FEATURES = [
  {
    icon: '✍️',
    title: 'One form, all platforms',
    desc: 'Fill in your game details once. We format the copy correctly for every platform — right length, right format, ready to paste.',
    className: 'md:col-span-2',
  },
  {
    icon: '⚡',
    title: 'Launch-ready in seconds',
    desc: 'No more staring at a blank page. Get professional copy instantly.',
    className: '',
  },
  {
    icon: '✅',
    title: 'Steam 2026 compliant',
    desc: "Auto-generates the AI disclosure text Valve now requires. Stay compliant without the headache.",
    className: '',
  },
  {
    icon: '🌍',
    title: 'Multi-platform ready',
    desc: 'Steam, itch.io, App Store, Google Play — each with the right format and character limits.',
    className: 'md:col-span-2',
  },
]

const SAMPLE_OUTPUT: Record<string, { short: string; full: string }> = {
  'Steam': {
    short: 'An epic dark fantasy RPG where every choice shapes the fate of a dying world. Forge powerful alliances, master arcane combat, and face the consequences of your decisions.',
    full: 'Descend into a world consumed by shadow. Forge alliances with morally complex factions, master a deep dark arts combat system, and confront an ancient evil that has slumbered for millennia. Every decision echoes — who will you become when the light fades?\n\n⚠️ AI Disclosure: This game\'s store description was generated with AI assistance and reviewed by the developer.',
  },
  'itch.io': {
    short: 'A dark fantasy RPG with deep choices and brutal consequences. Build alliances, master dark arts, survive a dying world.',
    full: 'The world is ending — and every choice you make brings it closer to the edge. Descend into shadow-consumed lands, build unlikely alliances, and wield forbidden dark arts against an ancient evil. No heroes here. Just survivors making hard calls in a world that\'s already lost.',
  },
  'App Store': {
    short: 'Master arcane combat and forge alliances in a dark fantasy RPG. Every choice shapes the fate of a dying world.',
    full: 'DARK FANTASY RPG — CHOICES THAT MATTER\n\nDescend into a dying world consumed by shadow. Build alliances, master dark arts combat, and face an ancient evil that has slumbered for millennia.\n\n• Deep choice-driven story\n• Arcane combat system\n• Morally complex factions\n• Stunning dark fantasy world',
  },
  'Google Play': {
    short: 'An immersive dark fantasy RPG. Shape the fate of a dying world through every alliance you forge and every choice you make.',
    full: 'Descend into darkness in this epic choice-driven RPG. Master arcane combat, build alliances with morally complex factions, and confront an ancient evil awakening in the shadows.\n\nEvery decision you make echoes across the dying world. Are you ready to face the consequences?\n\n• Rich dark fantasy narrative\n• Strategic arcane combat\n• Multiple faction alliances\n• Consequence-driven gameplay',
  },
}

const MEDIA_REQUIREMENTS: Record<string, { item: string; spec: string }[]> = {
  'Steam': [
    { item: 'Screenshots', spec: '6 required · 1280×720 or 2560×1440' },
    { item: 'Capsule image', spec: '460×215 px' },
    { item: 'Header capsule', spec: '460×215 px' },
    { item: 'Main capsule', spec: '616×353 px' },
    { item: 'Trailer', spec: 'Optional · MP4' },
  ],
  'itch.io': [
    { item: 'Cover image', spec: '315×250 px recommended' },
    { item: 'Screenshots', spec: 'Up to 7 · any ratio' },
  ],
  'App Store': [
    { item: '6.7" Screenshots', spec: '1290×2796 px · 6 required' },
    { item: 'iPad screenshots', spec: 'Required if universal' },
    { item: 'App preview video', spec: 'Optional · 15–30 sec' },
  ],
  'Google Play': [
    { item: 'Screenshots', spec: '8 minimum · 1080×1920' },
    { item: 'Feature graphic', spec: '1024×500 px · required' },
    { item: 'Promo video', spec: 'Optional · YouTube URL' },
  ],
}

const FREE_FEATURES = ['3 generations per day', 'All 4 platforms', 'Steam AI disclosure text', 'No credit card needed']
const PRO_FEATURES = ['Unlimited generations', 'All 4 platforms', 'Steam AI disclosure text', 'Saved history']

export default function LandingPage() {
  const supabase = createClient()
  const [samplePlatform, setSamplePlatform] = useState('Steam')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const steps = [
    {
      step: '01',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4 text-white/60"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
      title: 'Describe your game',
      desc: 'Fill in your game details once — name, genre, gameplay, what makes it unique, key features, and your target audience.',
      visual: (
        <div className="space-y-2">
          {[
            { label: 'Game Name', placeholder: 'Shadow Realm Chronicles', tall: false },
            { label: 'Genre', placeholder: 'Select genre...', tall: false },
            { label: 'Core Gameplay', placeholder: 'What do players actually do?', tall: true },
            { label: 'Unique Angle', placeholder: 'What makes your game different?', tall: true },
            { label: 'Key Features', placeholder: 'List your main features...', tall: true },
            { label: 'Target Audience', placeholder: 'Fans of Dark Souls and classic JRPGs', tall: false },
          ].map(f => (
            <div key={f.label}>
              <div className="text-xs text-white/60 mb-1 font-semibold">{f.label}</div>
              <div className={`bg-white/[0.05] border border-white/[0.12] rounded-lg px-3 flex items-center ${f.tall ? 'h-10' : 'h-8'}`}>
                <span className="text-xs text-white/45">{f.placeholder}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      step: '02',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4 text-white/60"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
      title: 'Set the tone',
      desc: 'Pick the vibe that matches your game. The copy adapts its language, energy, and style to match.',
      visual: (
        <div className="flex flex-wrap gap-2">
          {['Dark', 'Cozy', 'Funny', 'Intense', 'Chill', 'Epic', 'Mysterious', 'Wholesome'].map(t => (
            <span key={t} className={`text-xs px-3 py-1.5 rounded-full border ${t === 'Epic' ? 'bg-white text-black border-white font-semibold' : 'border-white/[0.06] text-muted-foreground/80 bg-white/[0.02]'}`}>{t}</span>
          ))}
        </div>
      ),
    },
    {
      step: '03',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4 text-white/60"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
      title: 'Generate in seconds',
      desc: 'Hit generate. GGLoadout writes store-ready copy for every selected platform simultaneously — no waiting.',
      visual: (
        <div className="flex items-center gap-4">
          <div className="flex-1 h-10 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4 text-white/70"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span className="text-sm text-white/70 font-medium">✨ Generate Copy</span>
          </div>
          <span className="text-sm text-muted-foreground/70">~3 sec</span>
        </div>
      ),
    },
  ]

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* Floating particles */}
      <FloatingParticles count={50} />

      {/* Hero glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(120,80,255,0.18) 0%, rgba(0,200,255,0.08) 60%, transparent 100%)' }}
      />

      {/* Header */}
      <SiteNav />

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-8 text-center">

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="flex justify-center mb-6">
          <AnimatedGradientText className="!mx-0">
            <span>🎮 Built for game makers</span>
          </AnimatedGradientText>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          variants={fadeUp} initial="hidden" animate="show" custom={1}
        >
          <span className="bg-clip-text text-transparent" style={{ background: 'linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff88, #0088ff, #8800ff, #ff0088, #ff0000)', backgroundSize: '400% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'text-color-flow 12s linear infinite, text-glow-pulse 3s ease-in-out infinite' }}>
            Master your launch.
          </span>
          <br />
          One form. All platforms.
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          variants={fadeUp} initial="hidden" animate="show" custom={2}
        >
          Fill in your game details once. Get ready-to-paste store copy for
          Steam, itch.io, App Store, and Google Play — in seconds.
        </motion.p>

        <motion.div
          className="flex justify-center items-center mb-4"
          variants={fadeUp} initial="hidden" animate="show" custom={3}
        >
          <ShimmerButton variant="cta" onClick={handleLogin} className="text-base px-10 py-4 rounded-xl">
            Start for free — no credit card
          </ShimmerButton>
        </motion.div>

        <motion.p
          className="text-sm text-muted-foreground"
          variants={fadeUp} initial="hidden" animate="show" custom={4}
        >
          3 free generations per day · Pro $9/month for unlimited generations
        </motion.p>

        {/* Product screenshot mockup */}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="text-sm text-primary font-semibold mb-2 uppercase tracking-wider">How it works</p>
          <h2 className="text-4xl font-bold mb-4">Store-ready copy. So you can <span style={rgbText}>focus on shipping.</span></h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            No copywriter, no blank page, no guessing what the platforms want.<br />
            Get correctly formatted copy for Steam, itch.io, App Store, Google Play and more.<br />
            Right character limits, right tone — Ready to paste.
          </p>
        </motion.div>

        {/* Bento: card 1 tall-left, cards 2 & 3 stack right — stacks on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Card 1 — spans both rows on desktop */}
          <div className="md:row-span-2 rounded-xl bg-[#111111] border border-white/[0.07] p-7 flex flex-col gap-5 transition-all duration-200 hover:-translate-y-1 hover:border-white/[0.15] hover:shadow-xl hover:shadow-black/40 cursor-default">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-sm font-bold text-black shrink-0">1</div>
              <h3 className="text-base font-semibold text-foreground">{steps[0].title}</h3>
            </div>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">{steps[0].desc}</p>
            <div className="rounded-lg border border-white/[0.06] p-4 flex-1">{steps[0].visual}</div>
          </div>
          {/* Card 2 */}
          <div className="rounded-xl bg-[#111111] border border-white/[0.07] p-7 flex flex-col gap-5 transition-all duration-200 hover:-translate-y-1 hover:border-white/[0.15] hover:shadow-xl hover:shadow-black/40 cursor-default">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-sm font-bold text-black shrink-0">2</div>
              <h3 className="text-base font-semibold text-foreground">{steps[1].title}</h3>
            </div>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">{steps[1].desc}</p>
            <div className="rounded-lg border border-white/[0.06] p-4 mt-auto">{steps[1].visual}</div>
          </div>
          {/* Card 3 */}
          <div className="rounded-xl bg-[#111111] border border-white/[0.07] p-7 flex flex-col gap-5 transition-all duration-200 hover:-translate-y-1 hover:border-white/[0.15] hover:shadow-xl hover:shadow-black/40 cursor-default">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-sm font-bold text-black shrink-0">3</div>
              <h3 className="text-base font-semibold text-foreground">{steps[2].title}</h3>
            </div>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">{steps[2].desc}</p>
            <div className="rounded-lg border border-white/[0.06] p-4 mt-auto">{steps[2].visual}</div>
          </div>
        </div>

        {/* Step 4 — full-width card */}
        <div className="rounded-xl bg-[#111111] border border-white/[0.07] p-7 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-sm font-bold text-black shrink-0">4</div>
              <h3 className="text-base font-semibold text-foreground">Pick platform &amp; paste</h3>
            </div>
            <p className="text-sm text-muted-foreground/80 leading-relaxed hidden md:block">Switch between platforms below, copy the output — right character limits, right tone, ready to paste.</p>
          </div>
          {/* Platform tabs */}
          <div className="flex gap-1 flex-wrap">
            {Object.keys(SAMPLE_OUTPUT).map(p => (
              <button
                key={p}
                onClick={() => setSamplePlatform(p)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${samplePlatform === p ? 'bg-white text-black border-white font-semibold' : 'border-white/10 text-muted-foreground hover:border-white/30 hover:text-white'}`}
              >{p}</button>
            ))}
          </div>
          {/* Output */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground/80 uppercase tracking-wide font-semibold">Short Description</div>
                <button
                  onClick={() => copyText('short', SAMPLE_OUTPUT[samplePlatform].short)}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-white/60 hover:text-white/70 transition-all duration-150"
                >
                  {copiedKey === 'short' ? (
                    <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3 h-3 text-green-400"><polyline points="20 6 9 17 4 12"/></svg><span className="text-green-400">Copied</span></>
                  ) : (
                    <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3 h-3"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy</>
                  )}
                </button>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-sm text-foreground/80 leading-relaxed">
                {SAMPLE_OUTPUT[samplePlatform].short}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground/80 uppercase tracking-wide font-semibold">Full Description</div>
                <button
                  onClick={() => copyText('full', SAMPLE_OUTPUT[samplePlatform].full)}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-white/60 hover:text-white/70 transition-all duration-150"
                >
                  {copiedKey === 'full' ? (
                    <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3 h-3 text-green-400"><polyline points="20 6 9 17 4 12"/></svg><span className="text-green-400">Copied</span></>
                  ) : (
                    <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3 h-3"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy</>
                  )}
                </button>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {SAMPLE_OUTPUT[samplePlatform].full}
              </div>
            </div>
          </div>
          {/* Media requirements */}
          <div className="pt-4 border-t border-white/[0.06]">
            <div className="text-xs text-muted-foreground/80 uppercase tracking-wide font-semibold mb-3">Media Requirements</div>
            <div className="flex flex-wrap gap-2">
              {MEDIA_REQUIREMENTS[samplePlatform].map(({ item, spec }) => (
                <div key={item} className="flex items-start gap-2 bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/50">
                    <rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12l2 2 4-4"/>
                  </svg>
                  <div>
                    <div className="text-xs font-medium text-foreground/80">{item}</div>
                    <div className="text-[10px] text-muted-foreground/80 mt-0.5">{spec}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto bg-border/30" />

      {/* ── MARQUEE ── */}
      <section className="relative z-10 py-10 overflow-hidden">
        <div className="flex justify-center mb-2">
          <AnimatedGradientText className="!mx-0">Supports all major platforms</AnimatedGradientText>
        </div>
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1.5 text-xs text-green-400/80 font-medium">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z"/></svg>
            Steam 2026 AI Disclosure compliant · Updated as platforms change
          </div>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <Marquee pauseOnHover repeat={3} className="[--duration:20s]">
            {PLATFORMS.map(p => (
              <div key={p} className="mx-6 flex items-center gap-2 text-sm text-muted-foreground border border-border/40 rounded-full px-4 py-2 bg-card/50">
                <span>{p}</span>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto bg-border/30" />

      {/* ── PRICING ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        >
          <p className="text-sm text-primary font-semibold mb-2 uppercase tracking-wider">Pricing</p>
          <h2 className="text-4xl font-bold mb-4">Simple, <span style={rgbText}>honest</span> pricing</h2>
          <p className="text-muted-foreground mb-12">Start free. Upgrade when you need more.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="bg-card border-border/40 text-left h-full hover:border-border/80 transition-colors">
              <CardContent className="p-7">
                <div className="text-sm text-muted-foreground font-medium mb-1">Free</div>
                <div className="text-5xl font-bold mb-1">$0</div>
                <div className="text-sm text-muted-foreground mb-6">Forever free</div>
                <ul className="text-sm text-muted-foreground space-y-3 mb-7">
                  {FREE_FEATURES.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-primary text-base">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" onClick={handleLogin} className="w-full border-border/60 hover:border-primary/60 hover:text-primary">
                  Get started free
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="relative bg-card border-primary/50 text-left h-full overflow-hidden">
              {/* Top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-primary/15 to-transparent pointer-events-none" />
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">Most popular</Badge>
              </div>
              <CardContent className="p-7 relative">
                <div className="text-sm text-muted-foreground font-medium mb-1">Pro</div>
                <div className="text-5xl font-bold mb-1">$9</div>
                <div className="text-sm text-muted-foreground mb-6">per month</div>
                <ul className="text-sm text-muted-foreground space-y-3 mb-7">
                  {PRO_FEATURES.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-primary text-base">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <ShimmerButton variant="cta" onClick={handleLogin} className="w-full justify-center rounded-lg py-2.5">
                  Upgrade to Pro
                </ShimmerButton>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative z-10 overflow-hidden" style={{ minHeight: 340 }}>
        {/* Flat icon rows — absolute, fills full section height */}
        <div className="absolute inset-0 flex flex-col justify-center gap-5 pointer-events-none opacity-20">
          {[0, 1, 2, 3].map(row => (
            <Marquee key={row} reverse={row % 2 === 1} repeat={4} className="[--duration:120s] [--gap:4px]">
              {[
                // row 1 — gaming
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="11.5" r=".6" fill="currentColor"/><circle cx="17" cy="13" r=".6" fill="currentColor"/><path d="M4 8h16a2 2 0 012 2v4a2 2 0 01-2 2l-2 2H6l-2-2a2 2 0 01-2-2v-4a2 2 0 012-2z"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 3h12v8a6 6 0 01-12 0V3zM6 7H4a2 2 0 000 4h2M18 7h2a2 2 0 010 4h-2M12 17v4M8 21h8"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 9H4.5a2.5 2.5 0 000 5H6M18 9h1.5a2.5 2.5 0 010 5H18M8 9h8M8 15h8M12 9v6"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
                // tech
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/><rect x="9" y="9" width="6" height="6"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M2 20h20"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
                // internet / platform
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c-3 3-4 6-4 10s1 7 4 10M12 2c3 3 4 6 4 10s-1 7-4 10"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 8.5a17 17 0 0121 0M5 12.5a12 12 0 0114 0M8.5 16.5a7 7 0 017 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>,
                // launch / store
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.29m5.96 6.08a14.98 14.98 0 01-12.12 6.16A14.98 14.98 0 018.29 9.63"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>,
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
              ].map((icon, i) => (
                <div key={i} className="mx-1 w-12 h-12 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center text-white p-2.5">
                  {icon}
                </div>
              ))}
            </Marquee>
          ))}
        </div>

        {/* Edge fades */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
        <div className="absolute left-0 inset-y-0 w-40 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 inset-y-0 w-40 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />

        {/* Center CTA */}
        <div className="relative z-20 flex flex-col items-center justify-center py-16 px-6 text-center gap-5">
          <GGLoadoutLogo size={56} />
          <h2 className="text-4xl md:text-5xl font-bold">Ready to master your launch?</h2>
          <ShimmerButton variant="cta" onClick={handleLogin} className="px-10 py-4 text-base rounded-xl">
            Start for free — no credit card
          </ShimmerButton>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-border/30 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-primary font-bold">GGLoadout</span>
          <p className="text-sm text-muted-foreground">Made for indie devs who care about their launch 🎮</p>
          <p className="text-xs text-muted-foreground">© 2026 GGLoadout</p>
        </div>
      </footer>

    </div>
  )
}

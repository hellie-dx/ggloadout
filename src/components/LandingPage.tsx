'use client'

import React from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { BorderBeam } from '@/components/magicui/border-beam'
import { FloatingParticles } from '@/components/magicui/floating-particles'
import GGLoadoutLogo from '@/components/GGLoadoutLogo'
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

const FREE_FEATURES = ['3 generations per day', 'All 4 platforms', 'Steam AI disclosure text', 'No credit card needed']
const PRO_FEATURES = ['Unlimited generations', 'All 4 platforms', 'Steam AI disclosure text', 'Saved history']

export default function LandingPage() {
  const supabase = createClient()

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
      <motion.header
        className="relative z-20 px-6 py-5 flex items-center justify-between max-w-6xl mx-auto"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <GGLoadoutLogo size={58} />
          <span className="text-lg font-bold tracking-widest text-white uppercase">GGLoadout</span>
          <Badge variant="secondary" className="text-xs opacity-70">Beta</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleLogin} className="text-muted-foreground hover:text-foreground">
            Sign in
          </Button>
          <Button size="sm" onClick={handleLogin} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Get started free
          </Button>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-8 text-center">

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="flex justify-center mb-6">
          <AnimatedGradientText>
            <span>🎮 Built for indie game developers</span>
          </AnimatedGradientText>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          variants={fadeUp} initial="hidden" animate="show" custom={1}
        >
          Your complete
          <br />
          <span className="bg-clip-text text-transparent animate-text-glow" style={{ background: 'linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff88, #0088ff, #8800ff, #ff0088, #ff0000)', backgroundSize: '400% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'text-color-flow 12s linear infinite, text-glow-pulse 3s ease-in-out infinite' }}>
            launch kit
          </span>
          {' '}for indie games
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          variants={fadeUp} initial="hidden" animate="show" custom={2}
        >
          Fill in your game details once. Get ready-to-paste store copy for
          Steam, itch.io, App Store, and Google Play — in seconds.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4"
          variants={fadeUp} initial="hidden" animate="show" custom={3}
        >
          <ShimmerButton onClick={handleLogin} className="text-base px-10 py-4 rounded-xl">
            Start for free — no credit card
          </ShimmerButton>
          <Button variant="ghost" onClick={handleLogin} className="text-muted-foreground">
            View pricing →
          </Button>
        </motion.div>

        <motion.p
          className="text-sm text-muted-foreground"
          variants={fadeUp} initial="hidden" animate="show" custom={4}
        >
          3 free generations per day · Pro $9/mo for unlimited
        </motion.p>

        {/* Product screenshot mockup */}
        <motion.div
          className="relative mt-14 rounded-2xl overflow-hidden border border-border/40 shadow-2xl shadow-primary/10"
          variants={fadeUp} initial="hidden" animate="show" custom={5}
        >
          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

          {/* Mock app UI */}
          <div className="bg-card p-6 text-left">
            {/* Mock header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold">GGLoadout</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Beta</span>
              </div>
              <div className="text-xs text-muted-foreground">Sign out</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Mock form */}
              <div className="space-y-3">
                <div className="text-sm font-semibold">Your Game Details</div>
                {['Game Name', 'Genre', 'Core Gameplay', 'Unique Angle'].map(f => (
                  <div key={f} className="h-9 rounded-lg bg-background/80 border border-border/40 px-3 flex items-center">
                    <span className="text-xs text-muted-foreground/50">{f}...</span>
                  </div>
                ))}
                <div className="flex gap-2 flex-wrap">
                  {['Dark', 'Epic', 'Chill', 'Funny'].map(t => (
                    <span key={t} className={`text-xs px-2 py-1 rounded-full border ${t === 'Epic' ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground'}`}>{t}</span>
                  ))}
                </div>
                <div className="w-full bg-primary text-primary-foreground text-xs py-2 rounded-lg text-center font-semibold">
                  ✨ Generate Copy
                </div>
              </div>

              {/* Mock output */}
              <div className="space-y-3">
                <div className="text-sm font-semibold">Generated Copy</div>
                <div className="flex gap-2 border-b border-border/40 pb-2">
                  {['Steam', 'itch.io', 'App Store'].map((p, i) => (
                    <span key={p} className={`text-xs pb-1 ${i === 0 ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>{p}</span>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Short Description</div>
                  <div className="bg-background/80 border border-border/40 rounded-lg p-2 text-xs text-foreground/70 leading-relaxed">
                    An epic dark fantasy RPG where every choice shapes the fate of a dying world...
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Full Description</div>
                  <div className="bg-background/80 border border-border/40 rounded-lg p-2 text-xs text-foreground/70 leading-relaxed h-16 overflow-hidden">
                    Descend into a world consumed by shadow. Forge alliances, master dark arts, and confront an ancient evil that has slumbered for millennia...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <section className="relative z-10 py-10 overflow-hidden">
        <p className="text-center text-sm text-muted-foreground mb-6">Supports all major platforms</p>
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

      {/* ── FEATURES BENTO ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <motion.div
          className="text-center mb-12"
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        >
          <p className="text-sm text-primary font-semibold mb-2 uppercase tracking-wider">Features</p>
          <h2 className="text-4xl font-bold mb-4">Everything you need to <span style={rgbText}>launch</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Stop spending hours on store pages. GGLoadout handles the copy so you can focus on shipping.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className={f.className}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i * 0.5}
            >
              <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} className="h-full">
                <Card className="relative h-full bg-card border-border/40 overflow-hidden group hover:border-primary/40 transition-all duration-300">
                  {/* Glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <CardContent className="p-6 relative">
                    <div className="text-3xl mb-4">{f.icon}</div>
                    <h3 className="font-semibold text-foreground mb-2 text-lg">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
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
                <ShimmerButton onClick={handleLogin} className="w-full justify-center rounded-lg py-2.5">
                  Upgrade to Pro
                </ShimmerButton>
              </CardContent>
            </Card>
          </motion.div>
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

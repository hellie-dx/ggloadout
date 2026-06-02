'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ShimmerButton } from '@/components/magicui/shimmer-button'

const rgbText: React.CSSProperties = {
  background: 'linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff88, #0088ff, #8800ff, #ff0088, #ff0000)',
  backgroundSize: '400% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: 'text-color-flow 12s linear infinite',
}

function GenreSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-2.5 text-sm text-left flex items-center justify-between focus:outline-none focus:border-white/30 transition-colors hover:border-white/20"
      >
        {value ? (
          <span style={rgbText} className="font-semibold">{value}</span>
        ) : (
          <span className="text-white/50">Select genre...</span>
        )}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl bg-[#111111] border border-white/[0.10] shadow-2xl shadow-black/60 overflow-hidden">
          {GENRES.map(g => {
            const isActive = value === g
            const isHovered = hovered === g
            return (
              <button
                key={g}
                type="button"
                onClick={() => { onChange(g); setOpen(false) }}
                onMouseEnter={() => setHovered(g)}
                onMouseLeave={() => setHovered(null)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-100 flex items-center justify-between ${isActive || isHovered ? 'bg-white/[0.06]' : ''}`}
              >
                {isActive || isHovered ? (
                  <span style={rgbText} className={isActive ? 'font-semibold' : ''}>{g}</span>
                ) : (
                  <span className="text-white/60">{g}</span>
                )}
                {isActive && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5 shrink-0 text-white/50">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const GENRES = ['RPG', 'FPS', 'Puzzle', 'Platformer', 'Strategy', 'Simulation', 'Horror', 'Adventure', 'Sports', 'Other']
const TONES = ['Dark', 'Cozy', 'Funny', 'Intense', 'Chill', 'Epic', 'Mysterious', 'Wholesome']
const PLATFORMS = [
  { id: 'steam', label: 'Steam' },
  { id: 'itchio', label: 'itch.io' },
  { id: 'appstore', label: 'App Store' },
  { id: 'googleplay', label: 'Google Play' },
]

const inputClass = 'w-full bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors'
const labelClass = 'block text-sm font-medium text-white/60 mb-1.5'

export interface GameFormData {
  gameName: string
  genre: string
  gameplay: string
  uniqueAngle: string
  tone: string
  features: string
  audience: string
  platforms: string[]
}

interface GameFormProps {
  onGenerate: (data: GameFormData) => void
  isLoading: boolean
  initialData?: GameFormData | null
}

export default function GameForm({ onGenerate, isLoading, initialData }: GameFormProps) {
  const [form, setForm] = useState<GameFormData>(initialData ?? {
    gameName: '',
    genre: '',
    gameplay: '',
    uniqueAngle: '',
    tone: '',
    features: '',
    audience: '',
    platforms: ['steam'],
  })

  const togglePlatform = (id: string) => {
    setForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(id)
        ? prev.platforms.filter(p => p !== id)
        : [...prev.platforms, id],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.platforms.length === 0) return alert('Select at least one platform.')
    onGenerate(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Game Name *</label>
        <input
          required
          value={form.gameName}
          onChange={e => setForm(p => ({ ...p, gameName: e.target.value }))}
          placeholder="e.g. Shadow Realm Chronicles"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Genre *</label>
        <GenreSelect value={form.genre} onChange={v => setForm(p => ({ ...p, genre: v }))} />
      </div>

      <div>
        <label className={labelClass}>Core Gameplay *</label>
        <textarea
          required
          value={form.gameplay}
          onChange={e => setForm(p => ({ ...p, gameplay: e.target.value }))}
          placeholder="What do players actually do? e.g. Explore a dark fantasy world, craft weapons, and fight turn-based battles against demon lords."
          rows={3}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Unique Angle *</label>
        <textarea
          required
          value={form.uniqueAngle}
          onChange={e => setForm(p => ({ ...p, uniqueAngle: e.target.value }))}
          placeholder="What makes your game different? e.g. Every enemy has a procedurally generated backstory that affects their behavior."
          rows={2}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Tone / Vibe *</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map(t => (
            form.tone === t ? (
              <div key={t}
                className="relative p-[1.5px] animate-[border-spin_4s_linear_infinite] shrink-0"
                style={{ borderRadius: '999px', background: 'conic-gradient(from var(--angle, 0deg), transparent 65%, #ff0000 72%, #ffaa00 76%, #00ff88 80%, #0088ff 84%, #cc00ff 88%, transparent 93%)' } as React.CSSProperties}
              >
                <button type="button" onClick={() => setForm(p => ({ ...p, tone: t }))}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold bg-white text-black whitespace-nowrap">
                  {t}
                </button>
              </div>
            ) : (
              <button key={t} type="button" onClick={() => setForm(p => ({ ...p, tone: t }))}
                className="px-3 py-1.5 rounded-full text-sm border bg-white/[0.03] text-white/50 border-white/[0.10] hover:border-white/30 hover:text-white/70 transition-all duration-150">
                {t}
              </button>
            )
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Key Features *</label>
        <textarea
          required
          value={form.features}
          onChange={e => setForm(p => ({ ...p, features: e.target.value }))}
          placeholder={'List your main features, one per line\ne.g.\n50+ hours of story content\n100+ craftable weapons\nLocal co-op support'}
          rows={4}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Target Audience</label>
        <input
          value={form.audience}
          onChange={e => setForm(p => ({ ...p, audience: e.target.value }))}
          placeholder="e.g. Fans of Dark Souls and classic JRPGs"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Platforms *</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map(p => (
            form.platforms.includes(p.id) ? (
              <div key={p.id}
                className="relative p-[1.5px] animate-[border-spin_4s_linear_infinite] shrink-0"
                style={{ borderRadius: '999px', background: 'conic-gradient(from var(--angle, 0deg), transparent 65%, #ff0000 72%, #ffaa00 76%, #00ff88 80%, #0088ff 84%, #cc00ff 88%, transparent 93%)' } as React.CSSProperties}
              >
                <button type="button" onClick={() => togglePlatform(p.id)}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold bg-white text-black whitespace-nowrap">
                  {p.label}
                </button>
              </div>
            ) : (
              <button key={p.id} type="button" onClick={() => togglePlatform(p.id)}
                className="px-3 py-1.5 rounded-full text-sm border bg-white/[0.03] text-white/50 border-white/[0.10] hover:border-white/30 hover:text-white/70 transition-all duration-150">
                {p.label}
              </button>
            )
          ))}
        </div>
      </div>

      <ShimmerButton
        variant="cta"
        borderRadius="10px"
        type="submit"
        disabled={isLoading || !form.tone}
        className="w-full py-3 text-sm disabled:opacity-40"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round"/></svg>
            Generating...
          </span>
        ) : '✨ Generate Copy'}
      </ShimmerButton>
    </form>
  )
}

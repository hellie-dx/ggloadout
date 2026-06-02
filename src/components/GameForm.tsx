'use client'

import { useState } from 'react'

const GENRES = ['RPG', 'FPS', 'Puzzle', 'Platformer', 'Strategy', 'Simulation', 'Horror', 'Adventure', 'Sports', 'Other']
const TONES = ['Dark', 'Cozy', 'Funny', 'Intense', 'Chill', 'Epic', 'Mysterious', 'Wholesome']
const PLATFORMS = [
  { id: 'steam', label: 'Steam' },
  { id: 'itchio', label: 'itch.io' },
  { id: 'appstore', label: 'App Store' },
  { id: 'googleplay', label: 'Google Play' },
]

const inputClass = 'w-full bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors'
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
}

export default function GameForm({ onGenerate, isLoading }: GameFormProps) {
  const [form, setForm] = useState<GameFormData>({
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
        <select
          required
          value={form.genre}
          onChange={e => setForm(p => ({ ...p, genre: e.target.value }))}
          className={inputClass}
          style={{ colorScheme: 'dark', backgroundColor: '#111111', color: form.genre ? 'white' : 'rgba(255,255,255,0.3)' }}
        >
          <option value="">Select genre...</option>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
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
            <button
              key={t}
              type="button"
              onClick={() => setForm(p => ({ ...p, tone: t }))}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-150 ${
                form.tone === t
                  ? 'bg-white text-black border-white font-semibold'
                  : 'bg-white/[0.03] text-white/50 border-white/[0.10] hover:border-white/30 hover:text-white/70'
              }`}
            >
              {t}
            </button>
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
            <button
              key={p.id}
              type="button"
              onClick={() => togglePlatform(p.id)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-150 ${
                form.platforms.includes(p.id)
                  ? 'bg-white text-black border-white font-semibold'
                  : 'bg-white/[0.03] text-white/50 border-white/[0.10] hover:border-white/30 hover:text-white/70'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !form.tone}
        className="w-full bg-white hover:bg-white/90 disabled:bg-white/20 disabled:text-white/30 text-black font-semibold py-3 rounded-lg transition-all duration-150 text-sm"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round"/></svg>
            Generating...
          </span>
        ) : '✨ Generate Copy'}
      </button>
    </form>
  )
}

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
        <label className="block text-sm font-medium text-gray-700 mb-1">Game Name *</label>
        <input
          required
          value={form.gameName}
          onChange={e => setForm(p => ({ ...p, gameName: e.target.value }))}
          placeholder="e.g. Shadow Realm Chronicles"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Genre *</label>
        <select
          required
          value={form.genre}
          onChange={e => setForm(p => ({ ...p, genre: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">Select genre...</option>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Core Gameplay *</label>
        <textarea
          required
          value={form.gameplay}
          onChange={e => setForm(p => ({ ...p, gameplay: e.target.value }))}
          placeholder="What do players actually do? e.g. Explore a dark fantasy world, craft weapons, and fight turn-based battles against demon lords."
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Unique Angle *</label>
        <textarea
          required
          value={form.uniqueAngle}
          onChange={e => setForm(p => ({ ...p, uniqueAngle: e.target.value }))}
          placeholder="What makes your game different? e.g. Every enemy has a procedurally generated backstory that affects their behavior."
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tone / Vibe *</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setForm(p => ({ ...p, tone: t }))}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                form.tone === t
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-violet-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Key Features *</label>
        <textarea
          required
          value={form.features}
          onChange={e => setForm(p => ({ ...p, features: e.target.value }))}
          placeholder="List your main features, one per line&#10;e.g.&#10;50+ hours of story content&#10;100+ craftable weapons&#10;Local co-op support"
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
        <input
          value={form.audience}
          onChange={e => setForm(p => ({ ...p, audience: e.target.value }))}
          placeholder="e.g. Fans of Dark Souls and classic JRPGs"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Platforms *</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => togglePlatform(p.id)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                form.platforms.includes(p.id)
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-violet-400'
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
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
      >
        {isLoading ? 'Generating...' : '✨ Generate Copy'}
      </button>
    </form>
  )
}

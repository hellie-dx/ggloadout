'use client'

import { useState } from 'react'
import React from 'react'

interface OutputData {
  steam?: {
    shortDescription: string
    fullDescription: string
    features: string[]
    tags: string[]
  }
  itchio?: {
    tagline: string
    fullDescription: string
    tags: string[]
  }
  appstore?: {
    shortDescription: string
    fullDescription: string
    keywords: string
  }
  googleplay?: {
    shortDescription: string
    fullDescription: string
    keywords: string
  }
}

interface OutputTabsProps {
  data: OutputData
  formData?: Record<string, unknown>
  onRegenBlock?: (platform: string, block: string) => Promise<void>
  regenLoading?: Record<string, boolean>
}

const MEDIA_REQUIREMENTS: Record<string, { item: string; spec: string }[]> = {
  steam: [
    { item: 'Screenshots', spec: '6 required · 1280×720 or 2560×1440' },
    { item: 'Capsule image', spec: '460×215 px' },
    { item: 'Header capsule', spec: '460×215 px' },
    { item: 'Main capsule', spec: '616×353 px' },
    { item: 'Trailer', spec: 'Optional · MP4 recommended' },
  ],
  itchio: [
    { item: 'Cover image', spec: '315×250 px recommended' },
    { item: 'Screenshots', spec: 'Up to 7 · any ratio' },
  ],
  appstore: [
    { item: '6.7" Screenshots', spec: '1290×2796 px · 6 required' },
    { item: 'iPad screenshots', spec: 'Required if universal app' },
    { item: 'App preview video', spec: 'Optional · 15–30 seconds' },
  ],
  googleplay: [
    { item: 'Screenshots', spec: '8 minimum · 1080×1920 portrait' },
    { item: 'Feature graphic', spec: '1024×500 px · required' },
    { item: 'Promo video', spec: 'Optional · YouTube URL' },
  ],
}

const PLATFORM_LABELS: Record<string, string> = {
  steam: 'Steam',
  itchio: 'itch.io',
  appstore: 'App Store',
  googleplay: 'Google Play',
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (copied) {
    return (
      <div className="relative p-[1.5px] animate-[border-spin_4s_linear_infinite]"
        style={{ borderRadius: '6px', background: 'conic-gradient(from var(--angle, 0deg), transparent 65%, #ff0000 72%, #ffaa00 76%, #00ff88 80%, #0088ff 84%, #cc00ff 88%, transparent 93%)' } as React.CSSProperties}>
        <button className="flex items-center gap-1.5 text-xs px-2.5 py-1 font-semibold text-black bg-white whitespace-nowrap" style={{ borderRadius: 'calc(6px - 1.5px)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>
          Copied
        </button>
      </div>
    )
  }

  return (
    <div className="relative p-[1.5px]"
      style={{ borderRadius: '6px', background: 'linear-gradient(to right, #6644ff, #cc0088)', animation: 'rgb-breathe 4s ease-in-out infinite' } as React.CSSProperties}>
      <button onClick={copy}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1 font-medium text-white whitespace-nowrap"
        style={{ borderRadius: 'calc(6px - 1.5px)', background: 'rgba(10,10,16,0.88)', backdropFilter: 'blur(12px)' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3 h-3"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Copy
      </button>
    </div>
  )
}

function RegenButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <div
      className="relative p-[1.5px] animate-[border-spin_4s_linear_infinite]"
      style={{
        borderRadius: '999px',
        background: 'conic-gradient(from var(--angle, 0deg), transparent 65%, #ff0000 72%, #ffaa00 76%, #00ff88 80%, #0088ff 84%, #cc00ff 88%, transparent 93%)',
        opacity: loading ? 0.5 : 1,
      } as React.CSSProperties}
    >
      <button
        onClick={onClick}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1 font-semibold text-black bg-white rounded-full whitespace-nowrap disabled:cursor-not-allowed"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`}>
          {loading
            ? <circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeLinecap="round"/>
            : <><path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16"/><path d="M8 16H3v5"/></>
          }
        </svg>
        {loading ? 'Regenerating...' : 'Regenerate'}
      </button>
    </div>
  )
}

function Section({
  label, content, onRegen, loading,
}: {
  label: string
  content: string
  onRegen?: () => void
  loading?: boolean
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-2">
          {onRegen && <RegenButton onClick={onRegen} loading={!!loading} />}
          <CopyButton text={content} />
        </div>
      </div>
      <div className={`bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-sm text-white/70 whitespace-pre-wrap leading-relaxed transition-opacity ${loading ? 'opacity-40' : ''}`}>
        {content}
      </div>
    </div>
  )
}

export default function OutputTabs({ data, formData, onRegenBlock, regenLoading = {} }: OutputTabsProps) {
  const availablePlatforms = Object.keys(data).filter(k => data[k as keyof OutputData])
  const [active, setActive] = useState(availablePlatforms[0])

  const regen = (block: string) => onRegenBlock ? () => onRegenBlock(active, block) : undefined
  const loading = (block: string) => !!regenLoading[`${active}:${block}`]

  return (
    <div>
      {/* Platform tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {availablePlatforms.map(p => (
          active === p ? (
            <div key={p} className="relative p-[1.5px]"
              style={{ borderRadius: '8px', background: 'linear-gradient(to right, #6644ff, #cc0088)', boxShadow: '0 0 14px rgba(102,68,255,0.35), 0 0 28px rgba(204,0,136,0.18)', animation: 'rgb-breathe 4s ease-in-out infinite' } as React.CSSProperties}>
              <button onClick={() => setActive(p)}
                className="px-4 py-1.5 text-sm font-semibold text-white whitespace-nowrap"
                style={{ borderRadius: 'calc(8px - 1.5px)', background: 'rgba(10,10,16,0.88)', backdropFilter: 'blur(12px)' }}>
                {PLATFORM_LABELS[p]}
              </button>
            </div>
          ) : (
            <button key={p} onClick={() => setActive(p)}
              className="px-4 py-1.5 text-sm font-medium text-white/50 hover:text-white/80 rounded-lg border border-white/[0.08] hover:border-white/20 transition-all duration-150">
              {PLATFORM_LABELS[p]}
            </button>
          )
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {active === 'steam' && data.steam && (
          <>
            <Section label="Short Description (300 chars)" content={data.steam.shortDescription} onRegen={regen('shortDescription')} loading={loading('shortDescription')} />
            <Section label="Full Description (BBCode)" content={data.steam.fullDescription} onRegen={regen('fullDescription')} loading={loading('fullDescription')} />
            <Section label="Key Features" content={data.steam.features.join('\n')} onRegen={regen('features')} loading={loading('features')} />
            <Section label="Tags" content={data.steam.tags.join(', ')} onRegen={regen('tags')} loading={loading('tags')} />
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 text-xs text-amber-300/80">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 shrink-0 mt-0.5 text-amber-400"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span><strong className="text-amber-300">Steam AI Disclosure required.</strong> Per Valve&apos;s 2026 rules, check the AI disclosure box and add: <em>&quot;Store page descriptions generated with AI writing assistance.&quot;</em></span>
              <CopyButton text="Store page descriptions generated with AI writing assistance." />
            </div>
          </>
        )}

        {active === 'itchio' && data.itchio && (
          <>
            <Section label="Tagline" content={data.itchio.tagline} onRegen={regen('tagline')} loading={loading('tagline')} />
            <Section label="Full Description (Markdown)" content={data.itchio.fullDescription} onRegen={regen('fullDescription')} loading={loading('fullDescription')} />
            <Section label="Tags" content={data.itchio.tags.join(', ')} onRegen={regen('tags')} loading={loading('tags')} />
          </>
        )}

        {active === 'appstore' && data.appstore && (
          <>
            <Section label="Subtitle (80 chars)" content={data.appstore.shortDescription} onRegen={regen('shortDescription')} loading={loading('shortDescription')} />
            <Section label="Full Description" content={data.appstore.fullDescription} onRegen={regen('fullDescription')} loading={loading('fullDescription')} />
            <Section label="Keywords" content={data.appstore.keywords} onRegen={regen('keywords')} loading={loading('keywords')} />
          </>
        )}

        {active === 'googleplay' && data.googleplay && (
          <>
            <Section label="Short Description (80 chars)" content={data.googleplay.shortDescription} onRegen={regen('shortDescription')} loading={loading('shortDescription')} />
            <Section label="Full Description" content={data.googleplay.fullDescription} onRegen={regen('fullDescription')} loading={loading('fullDescription')} />
            <Section label="Keywords" content={data.googleplay.keywords} onRegen={regen('keywords')} loading={loading('keywords')} />
          </>
        )}

        {/* Media requirements */}
        {MEDIA_REQUIREMENTS[active] && (
          <div className="pt-4 border-t border-white/[0.06]">
            <div className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-3">Media Requirements</div>
            <div className="flex flex-wrap gap-2">
              {MEDIA_REQUIREMENTS[active].map(({ item, spec }) => (
                <div key={item} className="flex items-start gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/20">
                    <rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12l2 2 4-4"/>
                  </svg>
                  <div>
                    <div className="text-xs font-medium text-white/60">{item}</div>
                    <div className="text-[10px] text-white/50 mt-0.5">{spec}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

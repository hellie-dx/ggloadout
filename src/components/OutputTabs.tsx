'use client'

import { useState } from 'react'

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
  return (
    <button
      onClick={copy}
      className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function Section({ label, content }: { label: string; content: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
        <CopyButton text={content} />
      </div>
      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800 whitespace-pre-wrap border border-gray-100">
        {content}
      </div>
    </div>
  )
}

export default function OutputTabs({ data }: { data: OutputData }) {
  const availablePlatforms = Object.keys(data).filter(k => data[k as keyof OutputData])
  const [active, setActive] = useState(availablePlatforms[0])

  return (
    <div>
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {availablePlatforms.map(p => (
          <button
            key={p}
            onClick={() => setActive(p)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              active === p
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {PLATFORM_LABELS[p]}
          </button>
        ))}
      </div>

      {active === 'steam' && data.steam && (
        <div>
          <Section label="Short Description (300 chars)" content={data.steam.shortDescription} />
          <Section label="Full Description (BBCode)" content={data.steam.fullDescription} />
          <Section label="Key Features" content={data.steam.features.join('\n')} />
          <Section label="Tags" content={data.steam.tags.join(', ')} />
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <strong>⚠️ Steam AI Disclosure:</strong> This copy was AI-generated. Per Valve&apos;s 2026 rules, check the AI disclosure box in your store page setup and add: <em>&quot;Store page descriptions generated with AI writing assistance.&quot;</em>
            <CopyButton text='Store page descriptions generated with AI writing assistance.' />
          </div>
        </div>
      )}

      {active === 'itchio' && data.itchio && (
        <div>
          <Section label="Tagline" content={data.itchio.tagline} />
          <Section label="Full Description (Markdown)" content={data.itchio.fullDescription} />
          <Section label="Tags" content={data.itchio.tags.join(', ')} />
        </div>
      )}

      {active === 'appstore' && data.appstore && (
        <div>
          <Section label="Subtitle (80 chars)" content={data.appstore.shortDescription} />
          <Section label="Full Description" content={data.appstore.fullDescription} />
          <Section label="Keywords" content={data.appstore.keywords} />
        </div>
      )}

      {active === 'googleplay' && data.googleplay && (
        <div>
          <Section label="Short Description (80 chars)" content={data.googleplay.shortDescription} />
          <Section label="Full Description" content={data.googleplay.fullDescription} />
          <Section label="Keywords" content={data.googleplay.keywords} />
        </div>
      )}
    </div>
  )
}

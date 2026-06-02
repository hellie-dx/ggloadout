import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const BLOCK_PROMPTS: Record<string, (form: Record<string, string>, platform: string) => string> = {
  shortDescription: (f, p) => {
    const limit = p === 'steam' ? '300 characters max' : p === 'appstore' ? '80 characters max (subtitle)' : p === 'googleplay' ? '80 characters max' : '60 characters max (tagline)'
    return `Write a short description for the ${p} store page only.
Game: "${f.gameName}", ${f.genre}, tone: ${f.tone}.
Gameplay: ${f.gameplay}. Unique angle: ${f.uniqueAngle}.
Limit: ${limit}.
Return only the text. No platform labels. No other platforms.`
  },

  fullDescription: (f, p) => `You are rewriting ONE specific field for ONE specific platform store page.

GAME: "${f.gameName}" — ${f.genre} game, tone: ${f.tone}
Gameplay: ${f.gameplay}. Unique angle: ${f.uniqueAngle}. Features: ${f.features}. Audience: ${f.audience}

TASK: Write a new FULL DESCRIPTION for ${p.toUpperCase()} ONLY.
${p === 'steam' ? 'Use BBCode formatting ([b], [i], [list][*][/list]). 1500-3000 chars.' : p === 'itchio' ? 'Use Markdown formatting.' : 'Plain text, max 4000 chars.'}

CRITICAL RULES:
- Write ONLY for ${p.toUpperCase()} — do NOT mention or include content for any other platform
- Do NOT add labels like "Steam:", "itch.io:", "App Store:" — just the description itself
- Return ONLY the description text, no explanation, no labels

OUTPUT:`,

  features: (f) => `List 5 new key features for a ${f.genre} game called "${f.gameName}".
Gameplay: ${f.gameplay}. Features: ${f.features}. Tone: ${f.tone}.
Return ONLY a JSON array of exactly 5 strings. No labels, no explanation.
Example: ["Feature one", "Feature two", "Feature three", "Feature four", "Feature five"]`,

  tags: (f, p) => `Generate 5 store tags for a ${f.genre} game called "${f.gameName}" for ${p}.
Gameplay: ${f.gameplay}. Tone: ${f.tone}.
Return ONLY a JSON array of exactly 5 lowercase tag strings. No labels, no explanation.
Example: ["rpg", "idle", "fantasy", "wholesome", "strategy"]`,

  tagline: (f) => `Write a new punchy tagline under 60 characters for a ${f.genre} game called "${f.gameName}" (itch.io).
Tone: ${f.tone}. Unique angle: ${f.uniqueAngle}.
Return ONLY the tagline text. No labels, no explanation.`,

  keywords: (f, p) => `Generate comma-separated ${p === 'appstore' ? 'App Store' : 'Google Play'} keywords for a ${f.genre} game called "${f.gameName}".
Gameplay: ${f.gameplay}. Audience: ${f.audience}.
Return ONLY a comma-separated string of keywords. No labels, no explanation.`,
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // Admin check — no rate limiting needed for admins

  const { formData, platform, block } = await request.json()

  const promptFn = BLOCK_PROMPTS[block]
  if (!promptFn) return NextResponse.json({ error: 'Unknown block' }, { status: 400 })

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })
    const result = await model.generateContent(promptFn(formData, platform))
    const text = result.response.text().trim()

    // For array fields, parse JSON
    if (block === 'features' || block === 'tags') {
      const cleaned = text.replace(/```json\n?|\n?```/g, '').trim()
      const parsed = JSON.parse(cleaned)
      return NextResponse.json({ content: parsed })
    }

    return NextResponse.json({ content: text })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Regen error:', msg)
    return NextResponse.json({ error: 'Regeneration failed' }, { status: 500 })
  }
}

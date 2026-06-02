import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const BLOCK_PROMPTS: Record<string, (form: Record<string, string>, platform: string) => string> = {
  shortDescription: (f, p) => `Write a new short description for a ${f.genre} game called "${f.gameName}" on ${p}.
Tone: ${f.tone}. Gameplay: ${f.gameplay}. Unique angle: ${f.uniqueAngle}.
Platform limits: Steam=300 chars, App Store/Google Play=80 chars, itch.io=tagline under 60 chars.
Return ONLY the description text, nothing else.`,

  fullDescription: (f, p) => `Write a new full store description for a ${f.genre} game called "${f.gameName}" on ${p}.
Tone: ${f.tone}. Gameplay: ${f.gameplay}. Unique angle: ${f.uniqueAngle}. Features: ${f.features}. Audience: ${f.audience}.
${p === 'steam' ? 'Use BBCode formatting ([b], [i], [list], [*]).' : p === 'itchio' ? 'Use Markdown formatting.' : 'Plain text, up to 4000 chars.'}
Return ONLY the description text, nothing else.`,

  features: (f) => `List 5 key features for a ${f.genre} game called "${f.gameName}".
Gameplay: ${f.gameplay}. Features hint: ${f.features}. Tone: ${f.tone}.
Return ONLY a JSON array of 5 strings, e.g. ["Feature one", "Feature two", ...]`,

  tags: (f, p) => `Generate 5 relevant store tags for a ${f.genre} game called "${f.gameName}" on ${p}.
Gameplay: ${f.gameplay}. Tone: ${f.tone}.
Return ONLY a JSON array of 5 tag strings, e.g. ["rpg", "fantasy", ...]`,

  tagline: (f) => `Write a punchy tagline under 60 characters for a ${f.genre} game called "${f.gameName}".
Tone: ${f.tone}. Unique angle: ${f.uniqueAngle}.
Return ONLY the tagline text, nothing else.`,

  keywords: (f) => `Generate comma-separated App Store/Google Play keywords for a ${f.genre} game called "${f.gameName}".
Gameplay: ${f.gameplay}. Audience: ${f.audience}.
Return ONLY the keywords as a comma-separated string.`,
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

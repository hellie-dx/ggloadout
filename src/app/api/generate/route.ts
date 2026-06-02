import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const FREE_DAILY_LIMIT = 3
const PRO_DAILY_LIMIT = 50

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  const isPro = profile.data?.is_pro ?? false
  const dailyLimit = isPro ? PRO_DAILY_LIMIT : FREE_DAILY_LIMIT

  const today = new Date().toISOString().split('T')[0]
  const { data: usage } = await supabase
    .from('usage')
    .select('count')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  const currentCount = usage?.count ?? 0

  if (currentCount >= dailyLimit) {
    return NextResponse.json({
      error: 'LIMIT_REACHED',
      isPro,
      limit: dailyLimit,
    }, { status: 429 })
  }

  await supabase.from('usage').upsert({
    user_id: user.id,
    date: today,
    count: currentCount + 1,
  }, { onConflict: 'user_id,date' })

  const body = await request.json()
  const { gameName, genre, gameplay, uniqueAngle, tone, features, audience, platforms } = body

  const platformInstructions: Record<string, string> = {
    steam: `"steam": {
  "shortDescription": "[STEAM ONLY — max 300 chars, no labels, just the description]",
  "fullDescription": "[STEAM ONLY — BBCode formatted, 1500-3000 chars, use [b][/b] [list][*][/list]]",
  "features": ["[feature 1]", "[feature 2]", "[feature 3]", "[feature 4]", "[feature 5]"],
  "tags": ["[tag1]", "[tag2]", "[tag3]", "[tag4]", "[tag5]"]
}`,
    itchio: `"itchio": {
  "tagline": "[ITCH.IO ONLY — punchy tagline, max 60 chars, no labels]",
  "fullDescription": "[ITCH.IO ONLY — Markdown formatted description]",
  "tags": ["[tag1]", "[tag2]", "[tag3]", "[tag4]", "[tag5]"]
}`,
    appstore: `"appstore": {
  "shortDescription": "[APP STORE ONLY — subtitle, max 80 chars, no labels]",
  "fullDescription": "[APP STORE ONLY — plain text, max 4000 chars]",
  "keywords": "[APP STORE ONLY — comma-separated keywords]"
}`,
    googleplay: `"googleplay": {
  "shortDescription": "[GOOGLE PLAY ONLY — max 80 chars, no labels]",
  "fullDescription": "[GOOGLE PLAY ONLY — plain text, max 4000 chars]",
  "keywords": "[GOOGLE PLAY ONLY — comma-separated keywords]"
}`,
  }

  const selectedPlatformInstructions = platforms.map((p: string) => platformInstructions[p]).filter(Boolean).join(',\n')

  const prompt = `You are an expert game store copywriter. Write store page copy for this game.

GAME DETAILS:
Name: ${gameName}
Genre: ${genre}
Core Gameplay: ${gameplay}
Unique Angle: ${uniqueAngle}
Tone/Vibe: ${tone}
Key Features: ${features}
Target Audience: ${audience}

CRITICAL RULES:
1. Each platform section contains ONLY that platform's content — no cross-platform mixing
2. Do NOT include platform names like "Steam:", "App Store:" inside any field values
3. Do NOT combine descriptions from multiple platforms into one field
4. Each field must be standalone, ready to paste directly into that store
5. Only include these platforms: ${platforms.join(', ')}

Return ONLY valid JSON (no markdown, no code blocks):
{
${selectedPlatformInstructions}
}`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim()
    const generated = JSON.parse(cleaned)

    return NextResponse.json({ success: true, data: generated })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Generation error full:', msg)
    return NextResponse.json({ error: 'Generation failed', detail: msg }, { status: 500 })
  }
}

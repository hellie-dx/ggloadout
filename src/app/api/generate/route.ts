import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const FREE_DAILY_LIMIT = 99 // temp raised for testing — reset to 3 after

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

  if (!isPro) {
    const today = new Date().toISOString().split('T')[0]
    const { data: usage } = await supabase
      .from('usage')
      .select('count')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    const currentCount = usage?.count ?? 0

    if (currentCount >= FREE_DAILY_LIMIT) {
      return NextResponse.json({ error: 'LIMIT_REACHED' }, { status: 429 })
    }

    await supabase.from('usage').upsert({
      user_id: user.id,
      date: today,
      count: currentCount + 1,
    }, { onConflict: 'user_id,date' })
  }

  const body = await request.json()
  const { gameName, genre, gameplay, uniqueAngle, tone, features, audience, platforms } = body

  const prompt = `You are an expert game marketing copywriter. Generate store page copy for the following game.

Game Details:
- Name: ${gameName}
- Genre: ${genre}
- Core Gameplay: ${gameplay}
- Unique Angle: ${uniqueAngle}
- Tone/Vibe: ${tone}
- Key Features: ${features}
- Target Audience: ${audience}
- Platforms: ${platforms.join(', ')}

Generate copy for each selected platform. Return a JSON object with this exact structure:
{
  "steam": {
    "shortDescription": "max 300 characters",
    "fullDescription": "full BBCode formatted description, 1500-3000 chars",
    "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"],
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
  },
  "itchio": {
    "tagline": "short punchy tagline under 60 chars",
    "fullDescription": "markdown formatted description",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
  },
  "appstore": {
    "shortDescription": "max 80 characters for subtitle",
    "fullDescription": "max 4000 characters",
    "keywords": "comma separated keywords"
  },
  "googleplay": {
    "shortDescription": "max 80 characters",
    "fullDescription": "max 4000 characters",
    "keywords": "comma separated keywords"
  }
}

Only include platforms in ${JSON.stringify(platforms)}.
Return only valid JSON, no markdown code blocks.`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
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

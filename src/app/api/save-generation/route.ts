import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { formData, output } = await request.json()

  const { error } = await supabase.from('generations').insert({
    user_id: user.id,
    game_name: formData.gameName,
    form_data: formData,
    output,
  })

  if (error) {
    console.error('Save error:', error.message)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

import { getPublicStories } from '@/lib/supabase/queries'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const language = searchParams.get('language') || undefined
  const category = searchParams.get('category') || undefined
  const search = searchParams.get('search') || undefined

  try {
    const stories = await getPublicStories({ language, category, search })
    return NextResponse.json(stories)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch stories' }, { status: 500 })
  }
}

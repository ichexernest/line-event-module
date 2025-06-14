import { getGameConfig, switchGameMode, toggleGameEnabled, togglePlayOnce, clearAllUserData } from '@/utils/prisma_db'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log(`in admin game config`)
    const config = await getGameConfig()
    console.log(config)
    return NextResponse.json(config)
  } catch (error) {
    console.error('Failed to get config:', error)
    return NextResponse.json({ error: 'Failed to get config' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { action, mode, enabled, onlyPlayOnce } = await request.json()
    const userAgent = request.headers.get('user-agent') || undefined
    
    let result
    
    if (action === 'switch_mode' && mode) {
      if (!['cardMaker', 'scrollGame', 'spinWheel'].includes(mode)) {
        return Response.json({ error: 'Invalid game mode' }, { status: 400 })
      }
      result = await switchGameMode(mode, userAgent)
    } else if (action === 'toggle_enabled' && typeof enabled === 'boolean') {
      result = await toggleGameEnabled(enabled, userAgent)
    } else if (action === 'toggle_play_once' && typeof onlyPlayOnce === 'boolean') {
      result = await togglePlayOnce(onlyPlayOnce, userAgent)
    } else if (action === 'clear_all_user_data') {
      result = await clearAllUserData(userAgent)
    } else {
      return Response.json({ error: 'Invalid action' }, { status: 400 })
    }
    
    revalidatePath('/start')
    revalidatePath('/playing')
    revalidatePath('/result')
    
    return Response.json(result)
  } catch (error) {
    console.error('Admin API error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
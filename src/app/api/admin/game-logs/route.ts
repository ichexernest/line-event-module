import { getGameLogs } from  '@/utils/prisma_db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const logs = await getGameLogs(limit)
    return Response.json(logs)
  } catch (error) {
    console.error('Admin API error:', error)
    return Response.json({ error: 'Failed to get logs' }, { status: 500 })
  }
}
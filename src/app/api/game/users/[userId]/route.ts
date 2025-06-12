import { findUserTempByUserId } from '@/utils/prisma_db' // 請根據實際路徑調整

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    
    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 })
    }
    
    const userTemp = await findUserTempByUserId(userId)
    
    return Response.json({ 
      exists: !!userTemp,
      data: userTemp 
    })
  } catch (error) {
    console.error('Find user temp API error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
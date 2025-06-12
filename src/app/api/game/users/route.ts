import { findAllUserTemp, createUserTemp } from '@/utils/prisma_db'

export async function GET() {
  try {
    const config = await findAllUserTemp()
    return Response.json(config)
  } catch (error) {
    console.error('Failed to get users:', error)
    return Response.json({ error: 'Failed to get users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, content } = await request.json()
    
    const result =  await createUserTemp(userId, content)
    
    return Response.json(result)
  } catch (error) {
    console.error('create user temp API error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { findUserTempByUserId } from '@/utils/prisma_db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const type = req.nextUrl.searchParams.get('type');
    if (!userId || !type) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const userTemp = await findUserTempByUserId(userId, type)

    return NextResponse.json({ exists: !!userTemp, data: userTemp }, { status: 200 })
  } catch (error) {
    console.error('Error in GET /users/[userId]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

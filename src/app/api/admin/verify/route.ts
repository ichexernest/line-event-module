import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // 從環境變數獲取管理員密碼
    const adminPassword = process.env.ADMIN_PASSWORD
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD not found in environment variables')
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    // 直接比較明碼密碼
    const isValid = password === adminPassword
    
    if (isValid) {
      return NextResponse.json({ success: true })
    } else {
      // 記錄失敗的登入嘗試
      console.warn('Failed admin login attempt at:', new Date().toISOString())
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Password verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}
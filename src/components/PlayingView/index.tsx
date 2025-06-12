'use client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useLiff } from '@/hooks/useLiff' // 請根據你的實際路徑調整

const CardMaker = dynamic(() => import('@/components/CardMaker'), { ssr: false })
const ScrollGame = dynamic(() => import('@/components/ScrollGame'), { ssr: false })
const SpinWheel = dynamic(() => import('@/components/SpinWheel'), { ssr: false })

interface PlayingPageProps {
  gameMode: 'scrollGame' | 'cardMaker' | 'spinWheel'
}

export default function PlayingPage({ gameMode }: PlayingPageProps) {
  const { userId, isLoading, isLoggedIn, error } = useLiff()

  // 如果正在載入 LIFF，顯示載入中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>LIFF 初始化中...</div>
      </div>
    )
  }

  // 如果有錯誤，顯示錯誤訊息
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">錯誤: {error}</div>
      </div>
    )
  }

  // 如果未登入，可以選擇顯示登入提示或直接進入遊戲
  if (!isLoggedIn) {
    console.warn('用戶未登入，userId 將為 null')
  }

  const gameModeMap = {
    'scrollGame': <ScrollGame userId={userId!} />,
    'cardMaker': <CardMaker userId={userId} />,
    'spinWheel': <SpinWheel userId={userId} />
  }

  return (
    <div>
      <Suspense fallback={<div>遊戲載入中...</div>}>
        {gameModeMap[gameMode]}
      </Suspense>
    </div>
  )
}
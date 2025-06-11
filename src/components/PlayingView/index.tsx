'use client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const CardMaker = dynamic(() => import('@/components/CardMaker'), { ssr: false })
const ScrollGame = dynamic(() => import('@/components/ScrollGame'), { ssr: false })
const SpinWheel = dynamic(() => import('@/components/SpinWheel'), { ssr: false })

interface PlayingPageProps {
  gameMode: 'scrollGame' | 'cardMaker' | 'spinWheel'
}

export default function PlayingPage({ gameMode }: PlayingPageProps) {
    const gameModeMap = {
      'scrollGame': <ScrollGame />,
      'cardMaker': <CardMaker />,
      'spinWheel': <SpinWheel />
    }
  return (
    <div>
      <Suspense fallback={<div>遊戲載入中...</div>}>
        {gameModeMap[gameMode]}
      </Suspense>
    </div>
  )
}
import { Suspense } from 'react'
import { getGameConfig } from '@/utils/prisma_db'
import ResultView from '@/components/ResultView'

// Loading component for the suspense boundary
function ResultLoading() {
  return (
    <div className="flex items-center justify-center h-screen text-3xl font-bold animate-pulse">
      結果載入中...
    </div>
  )
}

// Wrapper component to handle the suspense boundary
function ResultContent({ gameMode }: { gameMode: string }) {
  return (
    <Suspense fallback={<ResultLoading />}>
      <ResultView gameMode={gameMode} />
    </Suspense>
  )
}

export default async function ResultPage() {
  const config = await getGameConfig()
  
  return <ResultContent gameMode={config.currentMode} />
}
import { getGameConfig } from '@/utils/prisma_db'
import ResultView from '@/components/ResultView'

export default async function ResultPage() {
  const config = await getGameConfig()
  
  return <ResultView gameMode={config.currentMode} />
}
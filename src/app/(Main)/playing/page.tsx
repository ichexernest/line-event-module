
import PlayingView from '@/components/PlayingView'
import { getGameConfig } from '@/utils/prisma_db'

export default async function Playing() {
  const config = await getGameConfig() 
  const mode = config.currentMode as 'scrollGame' | 'cardMaker' | 'spinWheel'
  return <PlayingView gameMode={mode} />
}

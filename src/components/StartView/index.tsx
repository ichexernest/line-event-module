'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BASE_CONFIG, COLOR_SCHEME } from '@/configs/configs'

export default function StartView() {
  const router = useRouter()
  
  const startGame = () => {
    router.push('/playing')
  }
  
  return (
    <div className="z-10 flex flex-col items-center">
        <Image
          src={BASE_CONFIG.start.startImage}
          width={350}
          height={150} 
          alt="Start Button"
          priority
        />
        <p className="text-xs my-1"
          style={{ color: COLOR_SCHEME.text }}>
          網路和裝置解析度有可能影響遊玩情況，敬請注意。
        </p>
        <button onClick={startGame}
          
          className="p-6 mt-3 font-bold text-3xl rounded-lg"
          style={{
            backgroundColor: COLOR_SCHEME.buttonBg,
            color: COLOR_SCHEME.buttonText,
          }}
        >
          開始挑戰！
        </button>
      </div>
  )
}

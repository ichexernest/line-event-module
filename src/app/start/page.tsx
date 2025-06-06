import Image from 'next/image'
import { IMAGE_PATHS } from '@/configs/configs'

export default function StartPage() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-[#FCB1B2] overflow-hidden">
      {/* 背景圖層 */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${IMAGE_PATHS.bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden
      />

      {/* 主要內容 */}
      <div className="z-10 flex flex-col items-center">
        <Image
          src={IMAGE_PATHS.start}
          width={350}
          height={150} // 可依圖片實際比例調整
          alt="Start Button"
          priority
        />
        <p className="text-xs my-1 text-red-800">
          網路和裝置解析度有可能影響遊玩情況，敬請注意。
        </p>
        <a
          href="/playing"
          className="p-6 mt-3 font-bold text-3xl bg-red-400 text-white rounded-lg"
        >
          開始挑戰！
        </a>
      </div>
    </div>
  )
}
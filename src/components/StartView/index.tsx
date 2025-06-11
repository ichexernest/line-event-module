'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BASE_CONFIG, COLOR_SCHEME } from '@/configs/configs'
import { useLiff } from '@/hooks/useLiff' // 請確認正確的 hook 路徑

export default function StartView() {
  const router = useRouter()
  const { isReady, isLoading, isLoggedIn, error, login } = useLiff()
  
  const startGame = () => {
    if (!isReady) {
      console.log('LIFF is not ready yet')
      return
    }
    
    if (!isLoggedIn) {
      // 如果未登入，觸發登入
      login()
      return
    }
    
    // 已登入，直接進入遊戲
    router.push('/playing')
  }
  
  // 如果還在載入 LIFF，顯示載入狀態
  if (isLoading) {
    return (
      <div className="z-10 flex flex-col items-center">
        <div className="p-6 mt-3 font-bold text-2xl" style={{ color: COLOR_SCHEME.text }}>
          載入中...
        </div>
      </div>
    )
  }
  
  // 如果 LIFF 初始化失敗，顯示錯誤
  if (error) {
    return (
      <div className="z-10 flex flex-col items-center">
        <div className="p-6 mt-3 font-bold text-xl text-red-600">
          載入失敗：{error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="p-4 mt-3 font-bold text-lg rounded-lg"
          style={{
            backgroundColor: COLOR_SCHEME.buttonBg,
            color: COLOR_SCHEME.buttonText,
          }}
        >
          重新載入
        </button>
      </div>
    )
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
      
      {/* 顯示登入狀態提示 */}
      {isReady && !isLoggedIn && (
        <p className="text-sm my-2 text-center px-4"
          style={{ color: COLOR_SCHEME.text }}>
          請先登入 LINE 帳號以開始遊戲
        </p>
      )}
      
      <button 
        onClick={startGame}
        disabled={!isReady}
        className="p-6 mt-3 font-bold text-3xl rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: COLOR_SCHEME.buttonBg,
          color: COLOR_SCHEME.buttonText,
        }}
      >
        {!isReady 
          ? '載入中...' 
          : !isLoggedIn 
            ? 'LINE 登入' 
            : '開始挑戰！'
        }
      </button>
    </div>
  )
}
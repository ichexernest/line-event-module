'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { BASE_CONFIG, COLOR_SCHEME } from '@/configs/configs'
import { useLiff } from '@/hooks/useLiff'


interface GameConfig {
  currentMode: 'cardMaker' | 'scrollGame' | 'spinWheel'
  isEnabled: boolean
  onlyPlayOnce: boolean
  createdAt?: string
  updatedAt?: string
}

export const navigateToScrollGameResult = (score: unknown, lives: number) => {
  const params = new URLSearchParams({
    score: JSON.stringify(score),
    lives: lives.toString()
  })
  console.log(params)
  window.location.href = `/result?${params.toString()}`
}

export const navigateToCardMakerResult = () => {
  window.location.href = '/result'
}

export const navigateToSpinWheelResult = (prize?: string, prizeCode?: string) => {
  const params = new URLSearchParams()
  
  if (prize) params.set('prize', prize)
  if (prizeCode) params.set('prizeCode', prizeCode)
  
  const queryString = params.toString()
  window.location.href = `/result${queryString ? '?' + queryString : ''}`
}


export default function StartView() {
  const router = useRouter()
  const { isReady, isLoading, isLoggedIn, error, login, userId } = useLiff()
  const [isCheckingRecord, setIsCheckingRecord] = useState(false)
  const [isLoadingConfig, setIsLoadingConfig] = useState(false)
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null)
  
  // 獲取遊戲設置
  const fetchGameConfig = async () => {
    try {
      setIsLoadingConfig(true)
      const response = await fetch('/api/admin/game-config')
      if (!response.ok) {
        throw new Error(`獲取遊戲設置失敗: ${response.status}`)
      }
      const config = await response.json()
      alert(`遊戲設定抓到 onlyPlayOnce=${config.onlyPlayOnce}`)
      setGameConfig(config)
    } catch (error) {
      console.error('獲取遊戲設置失敗:', error)
    } finally {
      setIsLoadingConfig(false)
    }
  }

  // 組件載入時獲取遊戲設置
  useEffect(() => {
    fetchGameConfig()
  }, [])
  
  // 根據遊戲模式導航到對應結果頁
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigateToResult = (userContent: any) => {
    const gameMode = gameConfig!.currentMode
    
    switch (gameMode) {
      case 'spinWheel':
        navigateToSpinWheelResult(userContent.prize, userContent.code)
        break
      case 'cardMaker':
        navigateToCardMakerResult()
        break
      case 'scrollGame':
        navigateToScrollGameResult(userContent.score, userContent.lives || 0)
        break
      default:
        // 預設情況，直接導向結果頁
        router.push('/result')
        break
    }
  }
  
  // 檢查用戶記錄的函數
  const checkUserRecord = async (userId: string) => {
    try {
      setIsCheckingRecord(true)
      
      const response = await fetch(`/api/game/users/${userId}`)
      if (!response.ok) {
        throw new Error(`API 請求失敗: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.exists && result.data) {
        // 如果有記錄，解析內容並導航到結果頁
        const userContent = JSON.parse(result.data.userContent)
        console.log('找到用戶記錄:', userContent)
        
        // 根據遊戲模式導航到對應的結果頁
        navigateToResult(userContent)
        
        return true // 表示有記錄，已導向結果頁
      }
      
      return false // 沒有記錄
    } catch (error) {
      console.error('檢查用戶記錄失敗:', error)
      return false // 出錯時當作沒有記錄
    } finally {
      setIsCheckingRecord(false)
    }
  }
  
  const startGame = async () => {
    if (!isReady) {
      console.log('LIFF is not ready yet')
      return
    }
    
    if (!isLoggedIn) {
      // 如果未登入，觸發登入
      login()
      return
    }
    
    if (!userId) {
      console.error('userId is null')
      return
    }

    // 檢查遊戲設置是否要求只能玩一次
    if (gameConfig?.onlyPlayOnce) {
      // 需要檢查用戶記錄
      const hasRecord = await checkUserRecord(userId)
      
      if (!hasRecord) {
        // 沒有記錄，進入遊戲
        router.push('/playing')
      }
      // 如果有記錄，已經在 checkUserRecord 中導航到結果頁了
    } else {
      // 不需要檢查記錄，直接進入遊戲
      router.push('/playing')
    }
  }
  
  // 如果還在載入 LIFF、遊戲設置或檢查記錄，顯示載入狀態
  if (isLoading || isLoadingConfig || isCheckingRecord) {
    return (
      <div className="z-10 flex flex-col items-center">
        <div className="p-6 mt-3 font-bold text-2xl" style={{ color: COLOR_SCHEME.text }}>
          {isCheckingRecord ? '檢查遊戲記錄中...' : 
           isLoadingConfig ? '載入遊戲設置中...' : '載入中...'}
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
      
      
      <button 
        onClick={startGame}
        disabled={!isReady || isCheckingRecord || isLoadingConfig}
        className="p-6 mt-3 font-bold text-3xl rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: COLOR_SCHEME.buttonBg,
          color: COLOR_SCHEME.buttonText,
        }}
      >
        {!isReady 
          ? '載入中...' 
          : isLoadingConfig
            ? '載入設置中...'
            : isCheckingRecord
              ? '檢查記錄中...'
              : !isLoggedIn 
                ? 'LINE 登入' 
                : '開始挑戰！'
        }
      </button>
    </div>
  )
}
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { BASE_CONFIG, COLOR_SCHEME } from '@/configs/configs'

// 遊戲結果枚舉
enum GameResult {
  SUCCESS_TYPE_A = 'success1',
  SUCCESS_TYPE_B = 'success2',
  FAIL = 'fail'
}

interface ResultViewProps {
  gameMode: string
}

interface GameModeConfig {
  getResult: (searchParams: URLSearchParams) => GameResult
  getResultImage: (result: GameResult) => string
  shouldShowCoupon: (result: GameResult) => boolean
  getCouponContent: (searchParams: URLSearchParams) => { message: string; code: string }
  getButtons: (result: GameResult, handlers: ButtonHandlers, canRetry: boolean) => React.ReactElement
}

interface ButtonHandlers {
  onHome: () => void
  onShop: () => void
  onRetry: () => void
}

// 常量定義
const BUTTON_ENABLE_DELAY = 2000
const COPY_SUCCESS_MESSAGE = "複製成功！"
const DEFAULT_COPY_MESSAGE = "點我複製優惠碼到剪貼簿"

// 樣式配置
const createStyles = () => ({
  container: {
    backgroundColor: COLOR_SCHEME.background,
    color: COLOR_SCHEME.text,
    backgroundImage: `url(${BASE_CONFIG.bg})`
  },
  loading: {
    backgroundColor: COLOR_SCHEME.background,
    color: COLOR_SCHEME.buttonText || '#ffffff'
  },
  couponButton: {
    backgroundColor: '#ffffff',
    color: COLOR_SCHEME.text || '#000000'
  },
  primaryButton: (enabled: boolean) => ({
    backgroundColor: enabled ? COLOR_SCHEME.buttonBg : COLOR_SCHEME.buttonDisabled,
    color: COLOR_SCHEME.buttonText || '#CCCCCC'
  }),
  secondaryButton: {
    backgroundColor: COLOR_SCHEME.buttonSecondary || '#059669',
    color: COLOR_SCHEME.buttonText || '#ffffff'
  },
  retryButton: {
    backgroundColor: '#f59e0b',
    color: '#ffffff'
  }
})

// 遊戲模式配置
const GAME_MODE_CONFIGS: Record<string, GameModeConfig> = {
  scrollGame: {
    getResult: (searchParams) => {
      const scoreParam = searchParams.get('score')
      const livesParam = searchParams.get('lives')
      
      const score = scoreParam ? JSON.parse(scoreParam) : { prop1: 0, prop2: 0, prop3: 0, prop4: 0, prop5: 0 }
      const lives = livesParam ? parseInt(livesParam, 10) : 0
      
      console.log('Scroll game score:', score, 'lives:', lives)
      
      // 遊戲失敗條件
      if (lives <= 0) {
        return GameResult.FAIL
      }

      // 成功條件判定
      const successTypeA = score.prop1 + score.prop3 + score.prop4
      const successTypeB = score.prop2 + score.prop4 + score.prop5
      const isSuccessTypeA = successTypeA > successTypeB

      return isSuccessTypeA ? GameResult.SUCCESS_TYPE_B : GameResult.SUCCESS_TYPE_A
    },
    
    getResultImage: (result) => {
      const imageMap = {
        [GameResult.SUCCESS_TYPE_A]: BASE_CONFIG.result.success1,
        [GameResult.SUCCESS_TYPE_B]: BASE_CONFIG.result.success2,
        [GameResult.FAIL]: BASE_CONFIG.result.fail
      }
      return imageMap[result]
    },
    
    shouldShowCoupon: (result) => result !== GameResult.FAIL,
    
    getCouponContent: () => ({
      message: BASE_CONFIG.couponMessage,
      code: BASE_CONFIG.couponCode
    }),
    
    getButtons: (result, handlers, canRetry) => {
      const styles = createStyles()
      
      if (result === GameResult.FAIL) {
        return (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={handlers.onRetry}
              className="p-4 font-bold text-lg rounded-lg transition-all duration-300"
              style={styles.retryButton}
            >
              再試一次
            </button>
            <button
              onClick={handlers.onHome}
              className="p-4 font-bold text-lg rounded-lg transition-all duration-300"
              style={styles.secondaryButton}
            >
              回到首頁
            </button>
          </div>
        )
      }
      
      return (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handlers.onShop}
            className="p-4 font-bold text-lg rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            style={styles.primaryButton(canRetry)}
            disabled={!canRetry}
          >
            前往逛逛選購
          </button>
          <button
            onClick={handlers.onHome}
            className="p-4 font-bold text-lg rounded-lg transition-all duration-300"
            style={styles.secondaryButton}
          >
            回到首頁
          </button>
        </div>
      )
    }
  },

  spinWheel: {
    getResult: () => GameResult.SUCCESS_TYPE_A,
    
    getResultImage: () => BASE_CONFIG.result.success1,
    
    shouldShowCoupon: () => true,
    
    getCouponContent: (searchParams) => {
      const award = searchParams.get('award') || ''
      const coupon = searchParams.get('coupon') || ''
      return {
        message: `恭喜獲得 ${award}`,
        code: coupon
      }
    },
    
    getButtons: (result, handlers, canRetry) => {
      const styles = createStyles()
      
      return (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handlers.onShop}
            className="p-4 font-bold text-lg rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            style={styles.primaryButton(canRetry)}
            disabled={!canRetry}
          >
            前往逛逛選購
          </button>
          <button
            onClick={handlers.onHome}
            className="p-4 font-bold text-lg rounded-lg transition-all duration-300"
            style={styles.secondaryButton}
          >
            回到首頁
          </button>
        </div>
      )
    }
  },

  cardMaker: {
    getResult: () => GameResult.SUCCESS_TYPE_A,
    
    getResultImage: () => BASE_CONFIG.result.success1,
    
    shouldShowCoupon: () => true,
    
    getCouponContent: () => ({
      message: BASE_CONFIG.couponMessage,
      code: BASE_CONFIG.couponCode
    }),
    
    getButtons: (result, handlers, canRetry) => {
      const styles = createStyles()
      
      return (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handlers.onShop}
            className="p-4 font-bold text-lg rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            style={styles.primaryButton(canRetry)}
            disabled={!canRetry}
          >
            前往逛逛選購
          </button>
          <button
            onClick={handlers.onHome}
            className="p-4 font-bold text-lg rounded-lg transition-all duration-300"
            style={styles.secondaryButton}
          >
            回到首頁
          </button>
        </div>
      )
    }
  }
}

// Hooks
const useImagePreloader = (imageSources: string[]) => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loadImages = async () => {
      const promises = imageSources.map(src => 
        new Promise<void>((resolve) => {
          const img = new Image()
          img.src = src
          img.onload = () => resolve()
          img.onerror = () => resolve()
        })
      )

      await Promise.all(promises)
      setLoaded(true)
    }

    loadImages()
  }, [imageSources])

  return loaded
}

const useDelayedEnable = (delay: number = BUTTON_ENABLE_DELAY) => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setEnabled(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return enabled
}

// 工具函數
const getRequiredImages = (): string[] => [
  BASE_CONFIG.result.success1,
  BASE_CONFIG.result.success2,
  BASE_CONFIG.result.fail,
  BASE_CONFIG.bg,
]

// 主組件
export default function ResultView({ gameMode }: ResultViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [copyMessage, setCopyMessage] = useState(DEFAULT_COPY_MESSAGE)
  
  // 所有 hooks 必須在條件判斷前調用
  const imagesLoaded = useImagePreloader(getRequiredImages())
  const canRetry = useDelayedEnable()
  
  // 獲取當前遊戲模式配置
  const modeConfig = GAME_MODE_CONFIGS[gameMode]
  if (!modeConfig) {
    console.error('Unknown game mode:', gameMode)
    return <div>未知的遊戲模式</div>
  }
  
  // 狀態管理
  const gameResult = modeConfig.getResult(searchParams)
  const resultImage = modeConfig.getResultImage(gameResult)
  const shouldShowCoupon = modeConfig.shouldShowCoupon(gameResult)
  const couponContent = modeConfig.getCouponContent(searchParams)
  
  const styles = createStyles()

  // 事件處理
  const buttonHandlers: ButtonHandlers = {
    onHome: () => router.push('/'),
    onShop: () => window.location.href = BASE_CONFIG.shopUrl,
    onRetry: () => router.back()
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(couponContent.code)
      setCopyMessage(COPY_SUCCESS_MESSAGE)
    } catch (error) {
      console.error("複製失敗:", error)
      alert("複製失敗 😢")
    }
  }

  // 載入中狀態
  if (!imagesLoaded) {
    return (
      <div 
        className="flex items-center justify-center h-screen text-3xl font-bold animate-pulse"
        style={styles.loading}
      >
        結果載入中...
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-center justify-center h-screen p-4"
      style={styles.container}
    >
      {/* 結果圖片區 */}
      <img
        className="max-w-[350px] h-auto mb-4"
        src={resultImage}
        alt={shouldShowCoupon ? "成功圖片" : "失敗圖片"}
      />

      {/* 折扣碼區 */}
      {shouldShowCoupon && (
        <div className="flex flex-col items-center mb-6 bg-opacity-90 p-4 rounded-lg">
          <p className="text-center text-gray-800 mb-2">
            {couponContent.message}
          </p>
          <p className="font-bold text-2xl my-2 text-gray-800">
            {couponContent.code}
          </p>
          <button
            className="text-md rounded-2xl shadow-2xl p-3 hover:bg-gray-100 transition-colors"
            style={styles.couponButton}
            onClick={handleCopyCode}
          >
            {copyMessage}
          </button>
        </div>
      )}

      {/* 按鈕區 */}
      {modeConfig.getButtons(gameResult, buttonHandlers, canRetry)}
    </div>
  )
}
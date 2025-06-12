'use client'
import { useState, useEffect } from 'react'

interface GameConfig {
    currentMode: string
    onlyPlayOnce: boolean   
    isEnabled: boolean
}

interface GameLog {
    id: number
    action: string
    fromValue: string | null
    toValue: string
    timestamp: string
}

interface AdminPanelProps {
    onAuthChange: (isAuthenticated: boolean) => void
}

export default function AdminPanel({ onAuthChange }: AdminPanelProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [config, setConfig] = useState<GameConfig | null>(null)
    const [logs, setLogs] = useState<GameLog[]>([])
    const [password, setPassword] = useState('')
    const [authError, setAuthError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            fetchConfig()
            fetchLogs()
        }
    }, [isAuthenticated])

    const verifyPassword = async (inputPassword: string) => {
        setIsLoading(true)
        setAuthError('')

        try {
            const response = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: inputPassword })
            })

            const result = await response.json()

            if (result.success) {
                setIsAuthenticated(true)
                onAuthChange(true)
                setPassword('')
            } else {
                setAuthError('密碼錯誤，請重新輸入')
            }
        } catch (error) {
            setAuthError('驗證失敗，請稍後再試')
            console.error('Password verification failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (password.trim()) {
            verifyPassword(password)
        }
    }

    const fetchConfig = async () => {
        try {
            const response = await fetch('/api/admin/game-config')
            const data = await response.json()
            setConfig(data)
        } catch (error) {
            console.error('Failed to fetch config:', error)
        }
    }

    const fetchLogs = async () => {
        try {
            const response = await fetch('/api/admin/logs?limit=20')
            const data = await response.json()
            setLogs(data)
        } catch (error) {
            console.error('Failed to fetch logs:', error)
        }
    }

    const switchGameMode = async (mode: string) => {
        try {
            const response = await fetch('/api/admin/game-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'switch_mode', mode })
            })

            if (response.ok) {
                await fetchConfig()
                await fetchLogs()
            }
        } catch (error) {
            console.error('Failed to switch mode:', error)
        }
    }

    const toggleGameEnabled = async () => {
        if (!config) return

        try {
            const response = await fetch('/api/admin/game-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'toggle_enabled',
                    enabled: !config.isEnabled
                })
            })

            if (response.ok) {
                await fetchConfig()
                await fetchLogs()
            }
        } catch (error) {
            console.error('Failed to toggle game:', error)
        }
    }

        const togglePlayOnce = async () => {
        if (!config) return

        try {
            const response = await fetch('/api/admin/game-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'toggle_play_once',
                    onlyPlayOnce: !config.onlyPlayOnce
                })
            })

            if (response.ok) {
                await fetchConfig()
                await fetchLogs()
            }
        } catch (error) {
            console.error('Failed to toggle game:', error)
        }
    }

    // 密碼輸入介面
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-medium text-gray-900 mb-2">管理員登入</h2>
                        <p className="text-gray-600 text-sm">請輸入管理員密碼以繼續</p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                placeholder="請輸入管理員密碼"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none transition-colors"
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        {authError && (
                            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200">
                                {authError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !password.trim()}
                            className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    驗證中...
                                </div>
                            ) : (
                                '登入'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    // 管理面板界面
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-medium text-gray-900">管理面板</h1>
                    </div>

                    {config && (
                        <div className="p-6 space-y-8">
                            {/* 當前狀態 */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">當前狀態</h2>
                                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700">模式:</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.currentMode === 'cardMaker' || config.currentMode === 'scrollGame' || config.currentMode === 'spinWheel'
                                                    ? 'bg-gray-200 text-gray-800'
                                                    : ''
                                                }`}>
                                                {{
                                                    cardMaker: '卡片製作',
                                                    scrollGame: '滾動遊戲',
                                                    spinWheel: '輪盤遊戲',
                                                }[config.currentMode] || '未知模式'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700">狀態:</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.isEnabled
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : 'bg-red-100 text-red-800 border border-red-200'
                                                }`}>
                                                {config.isEnabled ? '開啟' : '關閉'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700">遊戲次數:</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.onlyPlayOnce
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : 'bg-red-100 text-red-800 border border-red-200'
                                                }`}>
                                                {config.onlyPlayOnce ? '僅一次' : '可多次'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 模式切換 */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">模式切換</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <button
                                        onClick={() => switchGameMode('cardMaker')}
                                        disabled={config.currentMode === 'cardMaker'}
                                        className={`py-3 px-4 font-medium rounded-md transition-colors duration-200 ${config.currentMode === 'cardMaker'
                                                ? 'bg-green-400 text-gray-200 cursor-not-allowed'
                                                : 'bg-gray-500 hover:bg-gray-600 text-white'
                                            }`}
                                    >
                                        卡片製作
                                    </button>
                                    <button
                                        onClick={() => switchGameMode('scrollGame')}
                                        disabled={config.currentMode === 'scrollGame'}
                                        className={`py-3 px-4 font-medium rounded-md transition-colors duration-200 ${config.currentMode === 'scrollGame'
                                                ? 'bg-green-400 text-gray-200 cursor-not-allowed'
                                                : 'bg-gray-500 hover:bg-gray-600 text-white'
                                            }`}
                                    >
                                        滾動遊戲
                                    </button>
                                    <button
                                        onClick={() => switchGameMode('spinWheel')}
                                        disabled={config.currentMode === 'spinWheel'}
                                        className={`py-3 px-4 font-medium rounded-md transition-colors duration-200 ${config.currentMode === 'spinWheel'
                                                ? 'bg-green-400 text-gray-200 cursor-not-allowed'
                                                : 'bg-gray-500 hover:bg-gray-600 text-white'
                                            }`}
                                    >
                                        輪盤遊戲
                                    </button>
                                </div>
                            </div>

                            {/* 遊戲開關 */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">遊戲控制</h2>
                                <button
                                    onClick={toggleGameEnabled}
                                    className={`w-full py-3 px-4 font-medium rounded-md transition-colors duration-200 ${config.isEnabled
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                        }`}
                                >
                                    {config.isEnabled ? '關閉遊戲' : '開啟遊戲'}
                                </button>
                            </div>

                            {/* 遊戲次數 */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">遊戲次數</h2>
                                <button
                                    onClick={togglePlayOnce}
                                    className={`w-full py-3 px-4 font-medium rounded-md transition-colors duration-200 ${config.onlyPlayOnce
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                        }`}
                                >
                                    {config.onlyPlayOnce ? '只能一次' : '允許重複'}
                                </button>
                            </div>

                            {/* 操作記錄 */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">操作記錄</h2>
                                <div className="border border-gray-200 rounded-md overflow-hidden">
                                    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                        <h3 className="font-medium text-gray-900">最近操作</h3>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {logs.length === 0 ? (
                                            <div className="p-6 text-center text-gray-500">
                                                暫無操作記錄
                                            </div>
                                        ) : (
                                            logs.map(log => (
                                                <div key={log.id} className="border-b border-gray-100 last:border-b-0 p-4 hover:bg-gray-50">
                                                    <div className="font-medium text-gray-900 mb-2">
                                                        {log.action}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mb-2">
                                                        {log.fromValue} → {log.toValue}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(log.timestamp).toLocaleString('zh-TW')}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
// GameResult.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_CONFIG, COLOR_SCHEME } from '../../../configs/configs';

interface Score {
    prop1: number;
    prop2: number;
    prop3: number;
    prop4: number;
    prop5: number;
    [key: string]: number;
}

interface GameResultProps {
    score: Score;
    lives: number;
    canRetry: boolean;
}

// 成功/失敗邏輯計算函數
const calculateGameResult = (score: Score, lives: number) => {
    if (lives <= 0) {
        return {
            isGameSuccess: false,
            isSuccessTypeA: false,
            resultImage: BASE_CONFIG.result.fail
        };
    }

    const successTypeA = score.prop1 + score.prop3 + score.prop4;
    const successTypeB = score.prop2 + score.prop4 + score.prop5;
    const isSuccessTypeA = successTypeA > successTypeB;

    return {
        isGameSuccess: true,
        isSuccessTypeA,
        resultImage: isSuccessTypeA ? BASE_CONFIG.result.success2 : BASE_CONFIG.result.success1
    };
};

// 統一的樣式配置
const getButtonStyle = (enabled: boolean, type: 'primary' | 'secondary') => {
    const baseStyle = {
        backgroundColor: enabled 
            ? (type === 'primary' ? COLOR_SCHEME.buttonBg : COLOR_SCHEME.buttonSecondary)
            : COLOR_SCHEME.buttonDisabled,
        color: COLOR_SCHEME.buttonText || '#CCCCCC'
    };
    return baseStyle;
};

const styles = {
    container: {
        backgroundColor: COLOR_SCHEME.background,
        color: COLOR_SCHEME.text,
        backgroundImage: `url(${BASE_CONFIG.bg})`
    },
    couponButton: {
        backgroundColor: '#ffffff',
        color: COLOR_SCHEME.text || '#000000'
    }
};

export default function GameResult({ score, lives, canRetry }: GameResultProps) {
    const router = useRouter();
    const [btnMessage, setBtnMessage] = useState("點我複製優惠碼到剪貼簿");
    const gameResult = calculateGameResult(score, lives);

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(BASE_CONFIG.couponCode);
            setBtnMessage("複製成功！");
        } catch (error) {
            console.error("複製失敗:", error);
            alert("複製失敗 😢");
        }
    };

    const handleRetry = () => {
        if (canRetry) {
            router.push('/');
        }
    };

    const handleGoToShop = () => {
        window.location.href = BASE_CONFIG.shopUrl;
    };

    return (
        <div
            className="flex flex-col items-center justify-center h-screen"
            style={styles.container}
        >
            {/* 結果圖片 */}
            <img
                className="max-w-[350px] h-auto"
                src={gameResult.resultImage}
                alt={gameResult.isGameSuccess ? "成功圖片" : "失敗圖片"}
            />

            {/* 成功時顯示優惠碼 */}
            {gameResult.isGameSuccess && (
                <div className="flex flex-col items-center mt-4">
                    <p className="text-center">9折優惠碼，可用於所有商品：</p>
                    <p className="font-bold text-2xl my-2">{BASE_CONFIG.couponCode}</p>
                    <button
                        className="text-md rounded-2xl shadow-2xl p-3"
                        style={styles.couponButton}
                        onClick={handleCopyCode}
                    >
                        {btnMessage}
                    </button>
                </div>
            )}

            {/* 按鈕區域 */}
            <div className="flex justify-center items-center gap-4 mt-6">
                {gameResult.isGameSuccess && (
                    <button
                        onClick={handleGoToShop}
                        className="p-5 font-bold text-2xl rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                        style={getButtonStyle(canRetry, 'primary')}
                        disabled={!canRetry}
                    >
                        前往逛逛選購
                    </button>
                )}
                <button
                    onClick={handleRetry}
                    className="p-5 font-bold text-2xl rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                    style={getButtonStyle(canRetry, 'secondary')}
                    disabled={!canRetry}
                >
                    再試一次！
                </button>
            </div>
        </div>
    );
}
// ResultContent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BASE_CONFIG, COLOR_SCHEME } from '../../../configs/configs';
import GameResult from '../../../components/ScrollGame/GameResult';

interface Score {
    prop1: number;
    prop2: number;
    prop3: number;
    prop4: number;
    prop5: number;
    [key: string]: number;
}

// 預設分數值
const DEFAULT_SCORE: Score = { prop1: 0, prop2: 0, prop3: 0, prop4: 0, prop5: 0 };

// 載入頁面樣式
const loadingStyles = {
    backgroundColor: COLOR_SCHEME.background,
    color: COLOR_SCHEME.buttonText || '#ffffff'
};

// 獲取所有需要預載的圖片路徑
const getRequiredImages = () => [
    BASE_CONFIG.result.success1,
    BASE_CONFIG.result.success2,
    BASE_CONFIG.result.fail,
    BASE_CONFIG.bg,
];

// 圖片預載 Hook
const useImagePreloader = (imageSources: string[]) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const promises = imageSources.map(src => 
            new Promise<void>((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve();
                img.onerror = () => resolve(); // 即使失敗也繼續
            })
        );

        Promise.all(promises).then(() => setLoaded(true));
    }, [imageSources]);

    return loaded;
};

// 延遲啟用 Hook
const useDelayedEnable = (delay: number = 2000) => {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setEnabled(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return enabled;
};

export default function ResultContent() {
    const searchParams = useSearchParams();
    
    // 解析 URL 參數
    const scoreParam = searchParams.get('score');
    const livesParam = searchParams.get('lives');
    
    const score: Score = scoreParam ? JSON.parse(scoreParam) : DEFAULT_SCORE;
    const lives = livesParam ? parseInt(livesParam, 10) : 0;

    // 使用自定義 Hooks
    const imagesLoaded = useImagePreloader(getRequiredImages());
    const canRetry = useDelayedEnable(2000);

    // 載入中狀態
    if (!imagesLoaded) {
        return (
            <div 
                className="flex items-center justify-center h-screen text-3xl font-bold animate-pulse"
                style={loadingStyles}
            >
                結果載入中...
            </div>
        );
    }

    return (
        <GameResult
            score={score}
            lives={lives}
            canRetry={canRetry}
        />
    );
}
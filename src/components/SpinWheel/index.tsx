"use client";

import React, { useState, useEffect } from "react";
import { spinWheel } from "../../configs/configs";
import { navigateToSpinWheelResult } from "@/utils/navUtils";

interface SpinWheelProps {
    userId: string | null;
}

export default function SpinWheel({ userId }: SpinWheelProps) {
    const [val, setVal] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);

    const weightedRandom = () => {
        const weights = spinWheel.prizes.map((p) => p.weight);
        const totalWeight = weights.reduce((acc, cur) => acc + cur, 0);
        let random = Math.random() * totalWeight;
        for (let i = 0; i < weights.length; i++) {
            if (random < weights[i]) return i;
            random -= weights[i];
        }
        return 0;
    };

    const handleSpinClick = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        const prizeIndex = weightedRandom();
        const anglePerSection = 360 / spinWheel.prizes.length;
        // 修正角度計算：讓指針指向正確的獎品
        const targetAngle = 360 - (prizeIndex * anglePerSection + anglePerSection / 2) + 90; // 加90度因為指針在上方
        const randomAngle = 3600 + targetAngle; // 10圈 + 目標角度
        setVal(randomAngle);
    };

    const handleResultAndNavigation = async (prize: string, prizeCode: string) => {
        try {
            if (userId) {
                const userContent = JSON.stringify({
                    type: 'spinWheel',
                    prize: prize,
                    prizeCode: prizeCode
                });

                const response = await fetch('/api/game/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        content: userContent
                    })
                });

                if (!response.ok) {
                    throw new Error(`API 請求失敗: ${response.status}`);
                }

                const result = await response.json();
                console.log('抽獎結果已存入資料庫:', result);
            } else {
                console.warn('userId 為 null，無法存入資料庫');
            }


            // 導航到結果頁面
            navigateToSpinWheelResult( prize, prizeCode);

        } catch (error) {
            console.error('處理抽獎結果時發生錯誤:', error);
            navigateToSpinWheelResult( prize, prizeCode);
        }
    };

    useEffect(() => {
        if (val === 0) return;
        const timer = setTimeout(async () => {
            const anglePerSection = 360 / spinWheel.prizes.length;
            // 修正計算邏輯：調整45度偏移來對齊指針和扇形
            const normalizedAngle = (360 - (val % 360) + 90 - 45) % 360; // 減45度修正偏移
            const resultIndex = Math.floor(normalizedAngle / anglePerSection) % spinWheel.prizes.length;
            const prize = spinWheel.prizes[resultIndex];

            console.log("抽獎結果:", prize);

            // 處理結果並導航
            await handleResultAndNavigation(prize.name, prize.code);

            setIsSpinning(false);
            setVal(0);
        }, spinWheel.config.animation.duration);

        return () => clearTimeout(timer);
    }, [val, userId]); // 添加 userId 到依賴陣列

    return (
        <div className="flex items-center justify-center min-h-screen w-full p-4 overflow-hidden">
            <div
                className="relative aspect-square flex-shrink-0"
                style={{
                    width: spinWheel.config.diameter,
                    maxWidth: spinWheel.config.maxDiameter
                }}
            >
                {/* 中央按鈕 */}
                <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${spinWheel.config.button.size} rounded-full border-4 z-10 flex items-center justify-center ${spinWheel.config.button.fontSize} cursor-pointer hover:scale-105 transition-transform`}
                    style={{
                        backgroundColor: spinWheel.color.centerBg,
                        borderColor: spinWheel.color.centerBorder,
                        color: spinWheel.color.centerText
                    }}
                    onClick={handleSpinClick}
                >
                    <span>{isSpinning ? spinWheel.texts.spinning : spinWheel.texts.spinButton}</span>
                    {/* 指針 */}
                    <div
                        className="absolute -top-6 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[25px] border-l-transparent border-r-transparent"
                        style={{
                            borderBottomColor: spinWheel.color.centerBg
                        }}
                    />
                </div>

                {/* 輪盤 */}
                <div
                    className={`absolute inset-0 rounded-full transition-transform ${spinWheel.config.animation.easingClass} overflow-hidden`}
                    style={{
                        transform: `rotate(${val}deg)`,
                        transitionDuration: `${spinWheel.config.animation.duration}ms`,
                        backgroundColor: spinWheel.color.wheelBg,
                        boxShadow: `0 0 0 5px ${spinWheel.color.wheelBorder1}, 0 0 0 10px ${spinWheel.color.wheelBorder2}, 0 0 0 18px ${spinWheel.color.wheelBorder3}`
                    }}
                >
                    {spinWheel.prizes.map((prize, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <div
                                key={index}
                                className="absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center text-xs font-bold"
                                style={{
                                    transform: `rotate(${45 * index + 22.5}deg)`,
                                    clipPath: "polygon(0 0, 56% 0, 100% 100%, 0 56%)",
                                    backgroundColor: isEven ? spinWheel.color.itemBg2 : spinWheel.color.itemBg,
                                    color: isEven ? spinWheel.color.itemText : spinWheel.color.itemText2
                                }}
                            >
                                <span
                                    className="rotate-[45deg] text-center px-1"
                                    style={{ fontSize: 'clamp(0.5rem, 2vw, 0.75rem)' }}
                                >
                                    {prize.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
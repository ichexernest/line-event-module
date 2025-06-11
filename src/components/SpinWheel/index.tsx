"use client";

import React, { useState, useEffect } from "react";
import { SpinWheel } from "../../configs/configs";

const SpinWheelComponent: React.FC = () => {
  const [val, setVal] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const weightedRandom = () => {
    const weights = SpinWheel.prizes.map((p) => p.weight);
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
    const anglePerSection = 360 / SpinWheel.prizes.length;
    // 修正角度計算：讓指針指向正確的獎品
    const targetAngle = 360 - (prizeIndex * anglePerSection + anglePerSection / 2) + 90; // 加90度因為指針在上方
    const randomAngle = 3600 + targetAngle; // 10圈 + 目標角度
    setVal(randomAngle);
  };

  useEffect(() => {
    if (val === 0) return;
    const timer = setTimeout(() => {
      const anglePerSection = 360 / SpinWheel.prizes.length;
      // 修正計算邏輯：調整45度偏移來對齊指針和扇形
      const normalizedAngle = (360 - (val % 360) + 90 - 45) % 360; // 減45度修正偏移
      const resultIndex = Math.floor(normalizedAngle / anglePerSection) % SpinWheel.prizes.length;
      const prize = SpinWheel.prizes[resultIndex];
      alert(`恭喜獲得：${prize.name}\n優惠碼：${prize.code}`);
      console.log("抽獎結果:", prize);
      setIsSpinning(false);
      setVal(0);
    }, SpinWheel.config.animation.duration);

    return () => clearTimeout(timer);
  }, [val]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 overflow-hidden">
      <div 
        className="relative aspect-square flex-shrink-0"
        style={{ 
          width: SpinWheel.config.diameter,
          maxWidth: SpinWheel.config.maxDiameter 
        }}
      >
        {/* 中央按鈕 */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${SpinWheel.config.button.size} rounded-full border-4 z-10 flex items-center justify-center ${SpinWheel.config.button.fontSize} cursor-pointer hover:scale-105 transition-transform`}
          style={{
            backgroundColor: SpinWheel.color.centerBg,
            borderColor: SpinWheel.color.centerBorder,
            color: SpinWheel.color.centerText
          }}
          onClick={handleSpinClick}
        >
          <span>{isSpinning ? SpinWheel.texts.spinning : SpinWheel.texts.spinButton}</span>
          {/* 指針 */}
          <div 
            className="absolute -top-6 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[25px] border-l-transparent border-r-transparent"
            style={{
              borderBottomColor: SpinWheel.color.centerBg
            }}
          />
        </div>

        {/* 輪盤 */}
        <div
          className={`absolute inset-0 rounded-full transition-transform ${SpinWheel.config.animation.easingClass} overflow-hidden`}
          style={{ 
            transform: `rotate(${val}deg)`,
            transitionDuration: `${SpinWheel.config.animation.duration}ms`,
            backgroundColor: SpinWheel.color.wheelBg,
            boxShadow: `0 0 0 5px ${SpinWheel.color.wheelBorder1}, 0 0 0 10px ${SpinWheel.color.wheelBorder2}, 0 0 0 18px ${SpinWheel.color.wheelBorder3}`
          }}
        >
          {SpinWheel.prizes.map((prize, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <div
                key={index}
                className="absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center text-xs font-bold"
                style={{
                  transform: `rotate(${45 * index + 22.5}deg)`,
                  clipPath: "polygon(0 0, 56% 0, 100% 100%, 0 56%)",
                  backgroundColor: isEven ? SpinWheel.color.itemBg2 : SpinWheel.color.itemBg,
                  color: isEven ? SpinWheel.color.itemText : SpinWheel.color.itemText2
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

export default SpinWheelComponent;
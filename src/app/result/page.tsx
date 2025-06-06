'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IMAGE_PATHS } from '../../configs/configs';

interface Score {
  prop1: number;
  prop2: number;
  prop3: number;
  prop4: number;
  prop5: number;
  [key: string]: number;
}

export default function ResultContent() {
  const [loaded, setLoaded] = useState(false);
  const [btnMessage, setBtnMessage] = useState("點我複製優惠碼到剪貼簿");
  const [canRetry, setCanRetry] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 從 URL 參數取得遊戲結果
  const scoreParam = searchParams.get('score');
  const livesParam = searchParams.get('lives');
  
  const score: Score = scoreParam 
    ? JSON.parse(scoreParam) 
    : { prop1: 0, prop2: 0, prop3: 0, prop4: 0, prop5: 0 };
  const lives = livesParam ? parseInt(livesParam, 10) : 0;

  // 預載圖片
  useEffect(() => {
    const imgSources = [
      IMAGE_PATHS.success1,
      IMAGE_PATHS.success2,
      IMAGE_PATHS.fail,
      ...Object.values(IMAGE_PATHS.items),
      IMAGE_PATHS.bg,
    ];

    const promises = imgSources.map(src => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });

    Promise.all(promises).then(() => {
      setLoaded(true);
    });

    const timer = setTimeout(() => setCanRetry(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText("GOODMOTHERSDAY2025");
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
    window.location.href = "https://goodmoods.store/shop/";
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FCB1B2] text-white text-3xl font-bold animate-pulse">
        結果載入中...
      </div>
    );
  }

  const isSuccessA = score.prop1 + score.prop3 + score.prop4 > score.prop2 + score.prop4 + score.prop5;

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen bg-[#FCB1B2] text-amber-950"
      style={{ backgroundImage: `url(${IMAGE_PATHS.bg})` }}
    >
      {lives > 0 ? (
        <>
          <img 
            className='max-w-[350px] h-auto' 
            src={isSuccessA ? IMAGE_PATHS.success2 : IMAGE_PATHS.success1} 
            alt="成功圖片" 
          />
          {/* 分數顯示區塊 - 已註解掉
          <div className='flex w-[350px] gap-2 justify-between items-center p-3 m-3 bg-white rounded-2xl'>
            {Object.keys(score).map((propKey) => (
              <div key={propKey} className='flex flex-col items-center justify-center'>
                <img className='max-w-[40px] h-auto' src={IMAGE_PATHS.items[propKey]} alt="" />
                <p className="mb-2">{score[propKey]}</p>
              </div>
            ))}
          </div>
          */}
          <p>9折優惠碼，可用於所有商品：</p>
          <p className='font-bold text-2xl'>GOODMOTHERSDAY2025</p>
          <button
            className='text-md bg-white rounded-2xl shadow-2xl p-3 mt-3'
            onClick={handleCopyCode}
          >
            {btnMessage}
          </button>
        </>
      ) : (
        <img 
          className='max-w-[350px] h-auto' 
          src={IMAGE_PATHS.fail} 
          alt="失敗圖片" 
        />
      )}
      
      <div className='flex justify-between items-center gap-2'>
        {lives > 0 && (
          <button
            onClick={handleGoToShop}
            className={`p-5 mt-3 font-bold text-2xl text-white rounded-lg transition-all duration-300 ${
              canRetry ? 'bg-amber-500 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!canRetry}
          >
            前往逛逛選購
          </button>
        )}
        <button
          onClick={handleRetry}
          className={`p-5 mt-3 font-bold text-2xl text-white rounded-lg transition-all duration-300 ${
            canRetry ? 'bg-red-400 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!canRetry}
        >
          再試一次！
        </button>
      </div>
    </div>
  );
}
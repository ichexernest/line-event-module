'use client';
import  dynamic  from 'next/dynamic';
import { Suspense } from 'react';

// 動態導入 CanvaEdit 組件，禁用 SSR
const CardMaker = dynamic(() => import('@/components/CardMaker'), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-screen">
    <div className="text-2xl font-bold">載入中...</div>
  </div>
});

// 如果需要使用 GameCanvas，也要動態導入
const GameCanvas = dynamic(() => import('@/components/ScrollGame/GameCanva'), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-screen">
    <div className="text-2xl font-bold">載入中...</div>
  </div>
});

export default function PlayingPage() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <CardMaker />
    </Suspense>
  );
}
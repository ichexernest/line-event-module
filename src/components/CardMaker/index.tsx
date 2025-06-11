import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ShareView from './ShareView';
import { useLiff } from '../../hooks/useLiff';

interface CurrentImg {
  image: string;
  url: string;
}

const CanvasEditor = dynamic(() => import('./CanvasEditor'), { ssr: false });

export default function CardMaker() {
  // 直接使用主要的 useLiff hook
  const { shareImage, isReady, isLoading, error, isLoggedIn } = useLiff();
  
  // 狀態管理
  const [currentView, setCurrentView] = useState<'canva' | 'share'>('canva');
  const [currentImg, setCurrentImg] = useState<CurrentImg>({ image: '', url: '' });

  // 處理保存完成，切換到分享頁面
  const handleSaveComplete = (imageData: CurrentImg) => {
    setCurrentImg(imageData);
    setCurrentView('share');
  };

  // 處理分享
  const handleShare = async () => {
    if (!currentImg.url) {
      console.error('No image to share');
      return;
    }

    await shareImage({
      imageUrl: currentImg.url,
      isMultiple: true,
      onSuccess: () => {
        console.log('Share successful!');
      },
      onError: (error) => {
        console.error('Share failed:', error);
      },
      redirectPath: '/result'
    });
  };

  // 如果還在載入中，顯示載入狀態
  if (isLoading) {
    return <div>Loading LIFF...</div>;
  }

  // 如果有錯誤，顯示錯誤訊息
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {currentView === 'canva' ? (
        <CanvasEditor onSave={handleSaveComplete} />
      ) : (
        <ShareView
          imageData={currentImg}
          isLiffReady={isReady}
          isLoggedIn={isLoggedIn}
          liffError={error}
          onShare={handleShare}
        />
      )}
    </div>
  );
}
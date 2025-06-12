import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ShareView from './ShareView';
import { useLiff } from '../../hooks/useLiff';
import { navigateToCardMakerResult } from '@/utils/navUtils';

interface CurrentImg {
  image: string;
  url: string;
}

interface CardMakerProps {
    userId: string | null;
}

const CanvasEditor = dynamic(() => import('./CanvasEditor'), { ssr: false });

export default function CardMaker({ userId }: CardMakerProps) {
  const { shareImage, isReady, isLoading, error, isLoggedIn } = useLiff();
  
  const [currentView, setCurrentView] = useState<'canva' | 'share'>('canva');
  const [currentImg, setCurrentImg] = useState<CurrentImg>({ image: '', url: '' });

  const handleSaveComplete = (imageData: CurrentImg) => {
    setCurrentImg(imageData);
    setCurrentView('share');
  };

  // 存儲資料到資料庫的函數
  const saveToDatabase = async (imageUrl: string) => {
    if (!userId) {
      console.warn('userId 為 null，無法存入資料庫');
      return;
    }

    try {
      const userContent = JSON.stringify({
        type: 'cardMaker',
        imageUrl: imageUrl,
        timestamp: new Date().toISOString()
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
      console.log('已存入資料庫:', result);
    } catch (error) {
      console.error('存儲資料時發生錯誤:', error);
      // 不拋出錯誤，讓流程繼續進行
    }
  };

  // 整合的分享和處理函數
  const handleShareAndSave = async () => {
    if (!currentImg.url) {
      console.error('No image to share');
      return;
    }

    await shareImage({
      imageUrl: currentImg.url,
      isMultiple: true,
      redirectPath: null, // 禁用自動導航
      onSuccess: async () => {
        console.log('Share successful!');
        // 分享成功後存儲資料並導航
        await saveToDatabase(currentImg.url);
        navigateToCardMakerResult();
      },
      onError: async (error) => {
        console.error('Share failed:', error);
        // 即使分享失敗，也存儲資料並導航
        await saveToDatabase(currentImg.url);
        navigateToCardMakerResult();
      }
    });
  };

  if (isLoading) {
    return <div>Loading LIFF...</div>;
  }

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
          onShare={handleShareAndSave}
        />
      )}
    </div>
  );
}
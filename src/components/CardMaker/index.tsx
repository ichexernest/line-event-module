import React, { useState } from 'react';
import CanvasEditor from './CanvasEditor';
import ShareView from './ShareView';
import { useLiffShare } from '../../hooks/useLiffShare';

interface CurrentImg {
  image: string;
  url: string;
}

const CardMaker: React.FC = () => {
  // 使用 LIFF 分享 hook
  const { shareImage, isReady: isLiffReady, error: liffError } = useLiffShare();
  
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


  return (
    <div>
      {currentView === 'canva' ? (
        <CanvasEditor onSave={handleSaveComplete} />
      ) : (
        <ShareView
          imageData={currentImg}
          isLiffReady={isLiffReady}
          liffError={liffError}
          onShare={handleShare}
        />
      )}
    </div>
  );
};

export default CardMaker;
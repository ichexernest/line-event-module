import React from 'react';
import { CanvaEdit } from '../../../configs/configs';

// 樣式
const SHARE_STYLES = {
  BUTTON: {
    PRIMARY: `p-5 text-2xl bg-[${CanvaEdit.colors.primary.yellow}] text-blue-900 rounded-xl shadow-md font-extrabold border-4 border-blue-800`,
    DISABLED: `disabled:bg-blue-300`,
  },
  TEXT: {
    TITLE: `text-xl text-blue-800 font-bold text-center`,
    TIP: `text-sm text-red-600 font-bold text-center w-screen`,
  },
  LAYOUT: {
    CONTAINER: `container flex-col w-screen justify-center items-center`,
    CENTER: `flex justify-center items-center`,
  }
} as const;

interface ShareViewProps {
  imageData: {
    image: string;
    url: string;
  };
  isLiffReady: boolean;
  liffError?: string | null;
  onShare: () => void;
}

const ShareView: React.FC<ShareViewProps> = ({ 
  imageData, 
  isLiffReady, 
  liffError, 
  onShare 
}) => {
  return (
    <div className={SHARE_STYLES.LAYOUT.CONTAINER}>
      {/* 標題圖片 */}
      <div className={`w-screen ${SHARE_STYLES.LAYOUT.CENTER} mt-5`}>
        <img src={CanvaEdit.resources.images.title} className='w-4/5' alt="Title" />
      </div>
      
      {/* 恭喜文字 */}
      <div className='mt-10'>
        <span className={SHARE_STYLES.TEXT.TITLE}>{CanvaEdit.texts.share.congratulations}</span>
      </div>

      {/* 預覽圖片 */}
      <div className={`w-screen ${SHARE_STYLES.LAYOUT.CENTER} mt-5`}>
        <img src={imageData.image} className='w-4/5' alt="Shared content" />
      </div>
      
      {/* 分享區域 */}
      <div className='flex flex-col justify-center items-center'>
        {/* 提示文字 */}
        <div>
          <span className={SHARE_STYLES.TEXT.TIP}>{CanvaEdit.texts.share.saveTip}</span>
        </div>
        
        {/* 分享按鈕 */}
        {isLiffReady ? (
          <div className="mt-4">
            <button 
              onClick={onShare}
              disabled={!imageData.url} 
              className={`${SHARE_STYLES.BUTTON.PRIMARY} ${SHARE_STYLES.BUTTON.DISABLED}`}
            >
              {CanvaEdit.texts.share.sendButton}
            </button>
          </div>
        ) : (
          <p>{CanvaEdit.texts.share.loading}</p>
        )}

        {/* Logo */}
        <div className={`w-screen ${SHARE_STYLES.LAYOUT.CENTER} mb-10`}>
          <img src={CanvaEdit.resources.images.logo} className='w-[200px] mt-10' alt="Logo" />
        </div>
      </div>
      
      {/* 錯誤訊息 */}
      {liffError && (
        <p>
          <code>{liffError}</code>
        </p>
      )}
    </div>
  );
};

export default ShareView;
import React from 'react';
import { CanvaEdit } from '../../../configs/configs';

// 將動態樣式改為內聯樣式
const SHARE_STYLES = {
  BUTTON: {
    PRIMARY: "p-5 text-2xl rounded-xl shadow-md font-extrabold border-4",
    DISABLED: "disabled:opacity-50 disabled:cursor-not-allowed",
  },
  TEXT: {
    TITLE: "text-xl font-bold text-center",
    TIP: "text-sm font-bold text-center w-screen",
    LOADING: "text-4xl font-bold",
    HINT: "text-sm",
  },
  LAYOUT: {
    CONTAINER: "container flex-col w-screen justify-center items-center",
    CENTER: "flex justify-center items-center",
  }
};

// 內聯樣式物件
const getInlineStyles = {
  submitButton: {
    backgroundColor: CanvaEdit.color.submitButtonBg,
    color: CanvaEdit.color.submitButtonText,
    borderColor: CanvaEdit.color.submitButtonBorder,
  },
  titleText: {
    color: '#1e40af', // blue-800 equivalent
  },
  tipText: {
    color: '#dc2626', // red-600 equivalent
  },
  loadingText: {
    color: '#1e40af', // blue-800 equivalent
  },
  hintText: {
    color: CanvaEdit.color.hintText,
  }
};

interface ShareViewProps {
  imageData: {
    image: string;
    url: string;
  };
  isLiffReady: boolean;
  isLoggedIn: boolean;  // 新增的 prop
  liffError?: string | null;
  onShare: () => void;
}

const ShareView: React.FC<ShareViewProps> = ({ 
  imageData, 
  isLiffReady, 
  isLoggedIn,  // 新增的參數
  liffError, 
  onShare 
}) => {
  return (
    <div className={SHARE_STYLES.LAYOUT.CONTAINER}>
      {/* 標題圖片 */}
      <div className={`w-screen ${SHARE_STYLES.LAYOUT.CENTER} mt-5`}>
        <img src={CanvaEdit.resources.images.shareTitle} className='w-4/5' alt="Title" />
      </div>
      
      {/* 恭喜文字 */}
      <div className='mt-10'>
        <span 
          className={SHARE_STYLES.TEXT.TITLE}
          style={getInlineStyles.titleText}
        >
          {CanvaEdit.texts.share.congratulations}
        </span>
      </div>

      {/* 預覽圖片 */}
      <div className={`w-screen ${SHARE_STYLES.LAYOUT.CENTER} mt-5`}>
        <img src={imageData.image} className='w-4/5' alt="Shared content" />
      </div>
      
      {/* 分享區域 */}
      <div className='flex flex-col justify-center items-center'>
        {/* 提示文字 */}
        <div>
          <span 
            className={SHARE_STYLES.TEXT.TIP}
            style={getInlineStyles.tipText}
          >
            {CanvaEdit.texts.share.saveTip}
          </span>
        </div>
        
        {/* 分享按鈕 */}
        {isLiffReady ? (
          <div className="mt-4">
            <button 
              onClick={onShare}
              disabled={!imageData.url || !isLoggedIn} // 同時檢查圖片和登入狀態
              className={`${SHARE_STYLES.BUTTON.PRIMARY} ${SHARE_STYLES.BUTTON.DISABLED}`}
              style={getInlineStyles.submitButton}
            >
              {isLoggedIn ? CanvaEdit.texts.share.sendButton : '請先登入 LINE'}
            </button>
          </div>
        ) : (
          <p 
            className={SHARE_STYLES.TEXT.LOADING}
            style={getInlineStyles.loadingText}
          >
            {CanvaEdit.texts.share.loading}
          </p>
        )}

      </div>
      
      {/* 錯誤訊息 */}
      {liffError && (
        <p style={getInlineStyles.hintText}>
          <code>{liffError}</code>
        </p>
      )}
    </div>
  );
};

export default ShareView;
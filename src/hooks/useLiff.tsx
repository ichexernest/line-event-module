import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import liff from "@line/liff";

// LIFF 狀態接口
interface LiffState {
  isReady: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: string | null;
  userId: string | null;
  profile: unknown | null;
}

// 分享選項接口
interface ShareOptions {
  imageUrl: string;
  isMultiple?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  redirectPath?: string | null;
}

// 主要的 LIFF Hook - 只在需要的頁面使用
export const useLiff = () => {
  const router = useRouter();
  const [state, setState] = useState<LiffState>({
    isReady: false,
    isLoading: true,
    isLoggedIn: false,
    error: null,
    userId: null,
    profile: null,
  });

  // 初始化 LIFF
  const initLiff = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // 初始化 LIFF
      await liff.init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID || ''
      });

      // 檢查登入狀態
      const isLoggedIn = liff.isLoggedIn();
      
      if (isLoggedIn) {
        // 獲取用戶資料
        const profile = await liff.getProfile();
        
        setState(prev => ({ 
          ...prev, 
          isReady: true, 
          isLoading: false,
          isLoggedIn: true,
          userId: profile.userId,
          profile: profile
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          isReady: true, 
          isLoading: false,
          isLoggedIn: false
        }));
      }
      
    } catch (error) {
      const errorMessage = `LIFF init failed: ${error}`;
      console.error(errorMessage);
      setState(prev => ({ 
        ...prev, 
        isReady: false, 
        isLoading: false, 
        error: errorMessage 
      }));
    }
  }, []);

  // 手動觸發登入
  const login = useCallback(() => {
    if (state.isReady && !state.isLoggedIn) {
      liff.login();
    }
  }, [state.isReady, state.isLoggedIn]);

  // 分享圖片到 LINE
  const shareImage = useCallback(async (options: ShareOptions) => {
    const { 
      imageUrl, 
      isMultiple = true, 
      onSuccess, 
      onError, 
      redirectPath = '/result' 
    } = options;

    try {
      if (!state.isReady) {
        throw new Error('LIFF is not ready');
      }

      if (!state.isLoggedIn) {
        liff.login();
        return;
      }

      if (!liff.isApiAvailable('shareTargetPicker')) {
        throw new Error('shareTargetPicker API is not available');
      }

      // 執行分享
      const result = await liff.shareTargetPicker(
        [
          {
            type: "image",
            originalContentUrl: imageUrl,
            previewImageUrl: imageUrl,
          },
        ],
        {
          isMultiple,
        }
      );

      if (result) {
        onSuccess?.();
        if (redirectPath) {
          router.push(redirectPath);
        }
      } else {
        console.log('TargetPicker was closed by user');
      }
    } catch (error) {
      const errorMessage = `Share failed: ${error}`;
      console.error(errorMessage);
      onError?.(errorMessage);
    }
  }, [state.isReady, state.isLoggedIn, router]);

  const logout = useCallback(() => {
    if (state.isReady) {
      liff.logout();
    }
  }, [state.isReady]);

  // 只在組件掛載時初始化，不自動登入
  useEffect(() => {
    initLiff();
  }, [initLiff]);

  return {
    ...state,
    shareImage,
    login,
    logout,
    initLiff,
  };
};

// 舊版本兼容性 Hook
export const useLiffShare = () => {
  const liffData = useLiff();
  
  return {
    isReady: liffData.isReady,
    isLoading: liffData.isLoading,
    error: liffData.error,
    shareImage: liffData.shareImage,
    checkLoginStatus: () => liffData.isLoggedIn,
    login: liffData.login,
    logout: liffData.logout,
  };
};
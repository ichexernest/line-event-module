import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import liff from "@line/liff";

interface LiffShareState {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
}

interface ShareOptions {
  imageUrl: string;
  isMultiple?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  redirectPath?: string;
}

export const useLiffShare = () => {
  const router = useRouter();
  const [state, setState] = useState<LiffShareState>({
    isReady: false,
    isLoading: true,
    error: null,
  });

  const initLiff = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await liff.init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID || ''
      });
      
      setState(prev => ({ 
        ...prev, 
        isReady: true, 
        isLoading: false 
      }));
    } catch (error) {
      const errorMessage = `LIFF init failed: ${error}`;
      setState(prev => ({ 
        ...prev, 
        isReady: false, 
        isLoading: false, 
        error: errorMessage 
      }));
    }
  }, []);

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
        await initLiff();
      }

      if (!liff.isLoggedIn()) {
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
        router.push(redirectPath);
      } else {
        console.log('TargetPicker was closed by user');
      }
    } catch (error) {
      const errorMessage = `Share failed: ${error}`;
      console.error(errorMessage);
      onError?.(errorMessage);
    }
  }, [state.isReady, initLiff, router]);


  const checkLoginStatus = useCallback(() => {
    return state.isReady ? liff.isLoggedIn() : false;
  }, [state.isReady]);

  const login = useCallback(() => {
    if (state.isReady) {
      liff.login();
    }
  }, [state.isReady]);

  const logout = useCallback(() => {
    if (state.isReady) {
      liff.logout();
    }
  }, [state.isReady]);


  useEffect(() => {
    initLiff();
  }, [initLiff]);

  return {

    isReady: state.isReady,
    isLoading: state.isLoading,
    error: state.error,
    
    shareImage,
    checkLoginStatus,
    login,
    logout,
    initLiff,
  };
};

export const shareLiffImage = async (options: ShareOptions) => {
  const { 
    imageUrl, 
    isMultiple = true, 
    onSuccess, 
    onError, 
    redirectPath = '/result' 
  } = options;

  try {
    if (!liff.isInClient() && !liff.isLoggedIn()) {
      await liff.init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID || ''
      });
    }

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }


    if (!liff.isApiAvailable('shareTargetPicker')) {
      throw new Error('shareTargetPicker API is not available');
    }

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
      if (typeof window !== 'undefined' && redirectPath) {
        window.location.href = redirectPath;
      }
    } else {
      console.log('TargetPicker was closed by user');
    }
  } catch (error) {
    const errorMessage = `Share failed: ${error}`;
    console.error(errorMessage);
    onError?.(errorMessage);
  }
};
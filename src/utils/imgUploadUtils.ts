import { imageConfig } from '@/configs/configs';

export const uploadImage = async (
  base64Image: string, 
  service = imageConfig.currentService
): Promise<string> => {
  const response = await fetch(imageConfig.apiRoute, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image, service })
  });

  if (!response.ok) {
    throw new Error(`上傳失敗: ${response.status}`);
  }

  const { success, url, error } = await response.json();
  
  if (!success) {
    throw new Error(error || '上傳失敗');
  }

  return url;
};
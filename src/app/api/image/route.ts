import { NextRequest, NextResponse } from 'next/server';
import { imageConfig } from '@/configs/configs';

const uploadHandlers = {
  imgur: async (base64Image: string): Promise<string> => {
    const formData = new FormData();
    formData.append('image', base64Image.split(',')[1]);
    formData.append('type', 'base64');
    
    const response = await fetch(imageConfig.services.imgur.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.IMGUR_ACCESS_TOKEN}`,
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Imgur 上傳失敗: ${errorData.data?.error || response.status}`);
    }

    const data = await response.json();
    return data.data.link;
  },

  imagebb: async (base64Image: string): Promise<string> => {
    const formData = new FormData();
    formData.append('image', base64Image.split(',')[1]);

    const response = await fetch(`${imageConfig.services.imagebb.apiUrl}?key=${process.env.IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`ImageBB 上傳失敗: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(`ImageBB 上傳失敗: ${data.error?.message || '未知錯誤'}`);
    }
    return data.data.url;
  },

  cloudinary: async (base64Image: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', base64Image);
    formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET!);

    const response = await fetch(`${imageConfig.services.cloudinary.apiUrl}/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Cloudinary 上傳失敗: ${response.status}`);
    }

    const data = await response.json();
    return data.secure_url;
  },

  github: async (base64Image: string): Promise<string> => {
    const filename = `image_${Date.now()}.png`;
    const content = base64Image.split(',')[1];
    
    const response = await fetch(`${imageConfig.services.github.apiUrl}/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/contents/images/${filename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload ${filename}`,
        content: content
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub 上傳失敗: ${response.status}`);
    }

    const data = await response.json();
    return data.content.download_url;
  }
};

export async function POST(request: NextRequest) {
  try {
    const { image, service = imageConfig.currentService } = await request.json();

    if (!image) {
      return NextResponse.json({ success: false, error: '缺少圖片數據' }, { status: 400 });
    }

    if (!uploadHandlers[service as keyof typeof uploadHandlers]) {
      return NextResponse.json({ success: false, error: '不支援的上傳服務' }, { status: 400 });
    }

    const uploadHandler = uploadHandlers[service as keyof typeof uploadHandlers];
    const url = await uploadHandler(image);

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error('圖片上傳錯誤:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || '上傳失敗' 
    }, { status: 500 });
  }
}
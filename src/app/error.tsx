'use client';
import { BASE_CONFIG, COLOR_SCHEME } from '@/configs/configs';
import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();

  const handleGoHome = () => router.push('/');

  return (
    <div className="relative min-h-screen w-full" style={{ backgroundColor: COLOR_SCHEME.background }}>
      <div 
        className="fixed inset-0 z-0" 
        style={{
          backgroundImage: `url(${BASE_CONFIG.bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        aria-hidden="true" 
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">發生錯誤了！</h1>
          <p className="text-gray-600 mb-6">抱歉，似乎出了點問題，請重新嘗試或返回首頁。</p>
          <button
            onClick={handleGoHome}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            返回首頁
          </button>
        </div>
      </div>
    </div>
  );
}

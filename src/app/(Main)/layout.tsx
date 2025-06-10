import { BASE_CONFIG, COLOR_SCHEME } from '@/configs/configs'

export default function Layout({ children }: { children: React.ReactNode }) {
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
      

      <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4">
          <p className="text-gray-600 text-lg">
           請使用手機開啟以獲得最佳體驗
          </p>
        </div>
      </div>
      
      <div className="relative z-10 w-full md:hidden">
        {children}
      </div>
    </div>
  );
}
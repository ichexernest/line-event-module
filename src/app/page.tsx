import { redirect } from 'next/navigation'
import { getGameConfig } from '@/utils/prisma_db'
import { BASE_CONFIG, COLOR_SCHEME } from '@/configs/configs'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const config = await getGameConfig()
  if (config.isEnabled) {
    redirect('/start') 
  }

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
      <div className="flex fixed inset-0 z-50 items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4">
          <p className="text-gray-600 text-lg">非活動期間</p>
        </div>
      </div>
    </div>
  )
}

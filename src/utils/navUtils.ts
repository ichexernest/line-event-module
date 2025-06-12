export const navigateToScrollGameResult = (score: unknown, lives: number) => {
  const params = new URLSearchParams({
    score: JSON.stringify(score),
    lives: lives.toString()
  })
  console.log(params)
  
  window.location.href = `/result?${params.toString()}`
}

export const navigateToCardMakerResult = () => {
  window.location.href = '/result'
}

export const navigateToSpinWheelResult = (prize?: string, prizeCoupon?: string) => {
  const params = new URLSearchParams()
  
  if (prize) params.set('prize', prize)
  if (prizeCoupon) params.set('prizeCoupon', prizeCoupon)
  
  const queryString = params.toString()
  window.location.href = `/result${queryString ? '?' + queryString : ''}`
}

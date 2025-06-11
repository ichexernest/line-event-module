export const navigateToScrollGameResult = (score: unknown, lives: number) => {
  const params = new URLSearchParams({
    score: JSON.stringify(score),
    lives: lives.toString()
  })
  console.log(params)
  
  window.location.href = `/result?${params.toString()}`
}

export const navigateToCardMakerResult = (cardId?: string, cardName?: string) => {
  const params = new URLSearchParams()
  
  if (cardId) params.set('cardId', cardId)
  if (cardName) params.set('cardName', cardName)
  
  const queryString = params.toString()
  window.location.href = `/result${queryString ? '?' + queryString : ''}`
}

// 或者 CardMaker 不需要參數的簡單版本
export const navigateToCardMakerResultSimple = () => {
  window.location.href = '/result'
}
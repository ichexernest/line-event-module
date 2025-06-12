// lib/game-service.ts
import { prisma } from './prisma'


export async function getGameConfig() {
  let config = await prisma.gameConfig.findFirst({
    orderBy: { createdAt: 'desc' }
  })
  
  // 如果沒有配置，創建預設配置
  if (!config) {
    config = await prisma.gameConfig.create({
      data: {
        currentMode: 'cardMaker',
        isEnabled: true,
        onlyPlayOnce: false
      }
    })
  }
  
  return config
}

export async function switchGameMode(newMode: string, userAgent?: string) {
  const currentConfig = await getGameConfig()
  
  // 記錄切換日誌
  await prisma.gameLog.create({
    data: {
      action: 'switch_mode',
      fromValue: currentConfig.currentMode,
      toValue: newMode,
      userAgent
    }
  })
  
  // 更新配置
  const updatedConfig = await prisma.gameConfig.update({
    where: { id: currentConfig.id },
    data: { currentMode: newMode }
  })
  
  return updatedConfig
}

export async function toggleGameEnabled(enabled: boolean, userAgent?: string) {
  const currentConfig = await getGameConfig()
  
  // 記錄啟閉日誌
  await prisma.gameLog.create({
    data: {
      action: enabled ? 'enable_game' : 'disable_game',
      fromValue: currentConfig.isEnabled.toString(),
      toValue: enabled.toString(),
      userAgent
    }
  })
  
  // 更新配置
  const updatedConfig = await prisma.gameConfig.update({
    where: { id: currentConfig.id },
    data: { isEnabled: enabled }
  })
  
  return updatedConfig
}

export async function togglePlayOnce(onlyPlayOnce: boolean, userAgent?: string) {
  const currentConfig = await getGameConfig()
  
  // 記錄啟閉日誌
  await prisma.gameLog.create({
    data: {
      action: onlyPlayOnce ? 'only_play_once' : 'repeat_play',
      fromValue: currentConfig.onlyPlayOnce.toString(),
      toValue: onlyPlayOnce.toString(),
      userAgent
    }
  })
  
  // 更新配置
  const updatedConfig = await prisma.gameConfig.update({
    where: { id: currentConfig.id },
    data: { onlyPlayOnce: onlyPlayOnce }
  })
  
  return updatedConfig
}

export async function getGameLogs(limit = 50) {
  return await prisma.gameLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: limit
  })
}

export async function findUserTempByUserId  (userId: string)  {
  return await prisma.userTemp.findFirst({
    where: { userId },
  });
};

export async function findAllUserTemp ()  {
  return await prisma.userTemp.findMany();
};

export async function createUserTemp (userId: string, userContent: string) {
  return await prisma.userTemp.create({
    data: {
      userId,
      userContent,
    },
  });
};
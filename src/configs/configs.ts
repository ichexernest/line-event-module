export const scrollGame = {
  // 游戏基础设置
  gameSettings: {
    duration: 45, // 游戏时长（秒）
    maxLives: 5, // 最大生命值
    groundY: 500, // 地面Y坐标
    canvasSize: {
      width: 350,
      height: 550
    }
  },

  // 玩家设置
  player: {
    size: {
      width: 50,
      height: 90
    },
    startPosition: {
      x: 50,
      y: 450
    },
    physics: {
      gravity: 0.1, // 重力加速度
      jumpPower: -7, // 跳跃力度（负值向上）
      moveSpeed: 0 // 玩家水平移动速度（当前为0，固定位置）
    }
  },

  // 障碍物设置
  obstacles: {
    types: ['prop1', 'prop2', 'prop3'],
    size: {
      width: 40,
      height: 40
    },
    spawnSettings: {
      interval: 400, // 每400帧生成一个障碍物
      yPosition: 500, // 障碍物Y坐标
      speed: 1.5 // 障碍物移动速度
    }
  },

  // 道具设置
  items: {
    types: ['prop1', 'prop2', 'prop3', 'prop4', 'prop5'],
    size: {
      width: 50,
      height: 50
    },
    spawnSettings: {
      interval: 50, // 每50帧检查是否生成道具
      avoidInterval: 150, // 每150帧不生成道具（避免与障碍物冲突）
      yRange: {
        base: 450, // 基础Y坐标
        variation: 150 // Y坐标随机变化范围
      },
      speed: 1.5 // 道具移动速度
    }
  },

  // UI界面设置
  ui: {
    // 进度条设置
    bars: {
      width: 250,
      height: 20,
      lives: {
        x: 10,
        y: 60,
        colors: ['#FF6D45', '#FF7E5A', '#FB977B'] // 生命值进度条颜色渐变
      },
      time: {
        x: 10,
        y: 90,
        colors: ['#FB8F13', '#FF9822', '#FFA43D'] // 时间进度条颜色渐变
      }
    },
    
    // 图标设置
    icons: {
      size: 35,
      margin: 10,
      top: 10
    },

    // 跳跃按钮样式
    jumpButton: {
      text: '跳起来!',
      styles: {
        padding: 'p-6',
        marginTop: 'mt-5',
        width: 'w-[350px]',
        shadow: 'shadow-2xl',
        border: 'border-rose-600 border-8',
        font: 'font-bold text-3xl',
        background: 'bg-red-400',
        textColor: 'text-white',
        rounded: 'rounded-2xl',
        active: 'active:bg-rose-500'
      }
    },

    // 画布样式
    canvas: {
      styles: {
        marginTop: 'mt-3',
        border: 'border border-4 border-amber-950',
        rounded: 'rounded-2xl',
        background: 'bg-[#F07C7E]'
      }
    },

    // 背景设置
    background: {
      color: 'bg-[#FCB1B2]',
      image: '/assets/bg.webp' // 如果有背景图片
    },

    // 加载界面设置
    loading: {
      title: '載入中請稍後...!',
      subtitle: '若等候時間過久，請嘗試切換其他網路遊玩',
      styles: {
        title: 'text-3xl',
        subtitle: 'text-sm',
        container: 'absolute flex flex-col pb-10 justify-center items-center text-white font-bold animate-pulse'
      }
    }
  },

  // 游戏平衡性设置
  balance: {
    // 碰撞检测设置
    collision: {
      enabled: true,
      tolerance: 0 // 碰撞容错像素（可以让游戏更宽松）
    },

    // 难度递增设置
    difficulty: {
      enabled: false, // 是否启用难度递增
      speedIncrease: {
        interval: 10, // 每10秒增加难度
        obstacleSpeedBonus: 0.1, // 障碍物速度增加量
        itemSpeedBonus: 0.1, // 道具速度增加量
        spawnRateBonus: 0.9 // 生成频率倍数（小于1表示更频繁）
      }
    }
  },

  // 图片资源路径
  assets: {
    player: {
      normal: '/assets/player.webp',
      jump: '/assets/player_jump.webp'
    },
    background: '/assets/background.webp',
    obstacles: {
      prop1: '/assets/obstacle1.webp',
      prop2: '/assets/obstacle2.webp',
      prop3: '/assets/obstacle3.webp'
    },
    items: {
      prop1: '/assets/item1.webp',
      prop2: '/assets/item2.webp',
      prop3: '/assets/item3.webp',
      prop4: '/assets/item4.webp',
      prop5: '/assets/item5.webp'
    },
    ui: {
      life: '/assets/life.webp',
      goal: '/assets/goal.webp'
    }
  }
};

export const CanvaEdit = {
  resources: {
    images: {
      title: '/assets2/title.png',
      logo: '/assets2/logo.png',
      cards: {
        card1: '/assets2/card1.png',
        card2: '/assets2/card2.png',
        card3: '/assets2/card3.png',
      }
    }
  } as const,

  colors: {
    primary: {
      blue800: '#1e40af',
      blue900: '#1e3a8a',
      yellow: '#FED501',
      red600: '#dc2626',
      white: '#ffffff',
      black: '#000000',
      blue300: '#93c5fd',
    },
    text: {
      default: '#000000',
    }
  } as const,

  texts: {
    canva: {
      tips: '小提示：您可以直接在卡片上移動縮放你的文字內容',
      stepOne: '第一步.選擇卡片',
      stepTwo: '第二步.寫下您的祝福',
      colorSelector: '選擇文字顏色',
      buttonText: '我做好了，去分享！',
      placeholder: 'Enter text',
      writeOnCard: '寫上卡片',
      loading: '正在生成卡片...',
    },
    share: {
      congratulations: '恭喜您完成您的卡片！現在馬上發送給親愛的爸爸吧！',
      saveTip: '小提示：長壓圖片可以儲存到相簿喔！',
      sendButton: '發送卡片！',
      loading: '...',
    }
  } as const,

  config: {
    canvas: {
      sizeRatio: 0.9,
      pixelRatio: 3,
      minTransformSize: 30,
    },
    text: {
      maxLength: 100,
      defaultPosition: { x: 100, y: 100, fontSize: 30 },
    },
    imgur: {
      apiUrl: 'https://api.imgur.com/3/image',
      bearerToken: '18aacec6155e973f807e9d85dd64ae7bb81343b5',
      uploadConfig: {
        type: 'base64',
        title: 'Simple upload',
        description: 'This is a simple image upload in Imgur',
      }
    },
    transformer: {
      borderStrokeWidth: 2,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    }
  } as const
};

export const imageConfig = {
  // 當前使用的服務
  currentService: 'imagebb' as 'imgur' | 'imagebb' | 'cloudinary' | 'github',
  
  // API 路由
  apiRoute: '/api/image',
  
  // 服務配置
  services: {
    imgur: {
      name: 'Imgur',
      apiUrl: 'https://api.imgur.com/3/image',
    },
    imagebb: {
      name: 'ImageBB',
      apiUrl: 'https://api.imgbb.com/1/upload',
    },
    cloudinary: {
      name: 'Cloudinary',
      apiUrl: 'https://api.cloudinary.com/v1_1',
    },
    github: {
      name: 'GitHub',
      apiUrl: 'https://api.github.com/repos',
    }
  }
};

// 为了向后兼容，保留原有的导出（如果其他地方还在使用）
export const MAX_LIVES = scrollGame.gameSettings.maxLives;
export const GAME_DURATION = scrollGame.gameSettings.duration;
export const BAR = {
  width: scrollGame.ui.bars.width,
  height: scrollGame.ui.bars.height,
  lives: scrollGame.ui.bars.lives,
  time: scrollGame.ui.bars.time,
};
export const ICON = scrollGame.ui.icons;
export const ITEM_TYPES = scrollGame.items.types;
export const OBSTACLE_TYPES = scrollGame.obstacles.types;
export const IMAGE_PATHS = {
  player: scrollGame.assets.player.normal,
  playerJump: scrollGame.assets.player.jump,
  background: scrollGame.assets.background,
  obstacles: scrollGame.assets.obstacles,
  items: scrollGame.assets.items,
  life: scrollGame.assets.ui.life,
  goal: scrollGame.assets.ui.goal,
};
export const BASE_CONFIG = {
  bg: '/assets/bg-mtd.webp',
  couponCode: 'GOODMOTHERSDAY2025',
  shopUrl: 'https://goodmoods.store/shop/',
  start: {
    startImage: '/assets/start.webp',
  },
  result: {
    success1: '/assets/successCard1.webp',
    success2: '/assets/successCard2.webp',
    fail: '/assets/failCard.webp',
  }
}

export const COLOR_SCHEME = {
  background: '#FCB1B2',
  text: '#991B1B',
  buttonBg: '#F87171',
  buttonText: '#FFFFFF',
  buttonDisabled: '#99A1AF',
  buttonSecondary: '#FD9A00',
}
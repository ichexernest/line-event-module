'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { scrollGame } from '../../configs/configs';
import { drawPixelBar, drawIcons } from '../../utils/drawUtils';
import { navigateToScrollGameResult } from '../../utils/navUtils';

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
}

interface Item {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
}

interface GameState {
  player: Player;
  obstacles: Obstacle[];
  items: Item[];
  spawnCounter: number;
  score: Record<string, number>;
  lives: number;
  distance: number;
}

export default function ScrollGame() {
  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // 使用配置中的数值初始化游戏状态
  const gameStateRef = useRef<GameState>({
    player: { 
      x: scrollGame.player.startPosition.x, 
      y: scrollGame.player.startPosition.y, 
      width: scrollGame.player.size.width, 
      height: scrollGame.player.size.height, 
      vy: 0 
    },
    obstacles: [],
    items: [],
    spawnCounter: 0,
    score: Object.fromEntries(scrollGame.items.types.map((k) => [k, 0])),
    lives: scrollGame.gameSettings.maxLives,
    distance: scrollGame.gameSettings.duration,
  });

  const [jumping, setJumping] = useState(false);

  const loadImages = (sources: string[]): Promise<HTMLImageElement[]> => {
    return Promise.all(
      sources.map(
        (src) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`圖片載入失敗: ${src}`));
          })
      )
    );
  };

  useEffect(() => {
    let isMounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 使用配置中的图片路径
    const allImagePaths = [
      scrollGame.assets.player.normal,
      scrollGame.assets.player.jump,
      scrollGame.assets.background,
      ...Object.values(scrollGame.assets.obstacles),
      ...Object.values(scrollGame.assets.items),
      scrollGame.assets.ui.life,
      scrollGame.assets.ui.goal,
    ];

    loadImages(allImagePaths).then((imgs) => {
      if (!isMounted) return;
      
      const [playerImg, playerJumpImg, bgImg, ...restImgs] = imgs;
      const obstacleImgs = Object.fromEntries(
        scrollGame.obstacles.types.map((type, i) => [type, restImgs[i]])
      );
      const itemImgs = Object.fromEntries(
        scrollGame.items.types.map((type, i) => [type, restImgs[scrollGame.obstacles.types.length + i]])
      );

      const lifeImg = restImgs[scrollGame.obstacles.types.length + scrollGame.items.types.length]; 
      const goalImg = restImgs[scrollGame.obstacles.types.length + scrollGame.items.types.length + 1]; 

      const spawnObstacle = (type: string) => {
        gameStateRef.current.obstacles.push({ 
          x: canvas.width, 
          y: scrollGame.obstacles.spawnSettings.yPosition,
          width: scrollGame.obstacles.size.width, 
          height: scrollGame.obstacles.size.height, 
          type 
        });
      };

      const spawnItem = (type: string) => {
        gameStateRef.current.items.push({
          x: canvas.width,
          y: scrollGame.items.spawnSettings.yRange.base - Math.random() * scrollGame.items.spawnSettings.yRange.variation,
          width: scrollGame.items.size.width,
          height: scrollGame.items.size.height,
          type,
        });
      };

      const gameLoop = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;

        if (elapsed > scrollGame.gameSettings.duration * 1000) {
          navigateToScrollGameResult(gameStateRef.current.score, gameStateRef.current.lives);
          return;
        }

        gameStateRef.current.distance = Math.max(0, scrollGame.gameSettings.duration - Math.floor(elapsed / 1000));

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

        const player = gameStateRef.current.player;
        player.vy += scrollGame.player.physics.gravity;
        player.y += player.vy;
        if (player.y > scrollGame.player.startPosition.y) {
          player.y = scrollGame.player.startPosition.y;
          player.vy = 0;
          setJumping(false);
        }
        ctx.drawImage(
          player.vy !== 0 ? playerJumpImg : playerImg, 
          player.x, 
          player.y, 
          player.width, 
          player.height
        );

        gameStateRef.current.spawnCounter++;
        
        // 使用配置中的障碍物生成间隔
        if (gameStateRef.current.spawnCounter % scrollGame.obstacles.spawnSettings.interval === 0) {
          const type = scrollGame.obstacles.types[Math.floor(Math.random() * scrollGame.obstacles.types.length)];
          spawnObstacle(type);
        }

        // 使用配置中的道具生成设置
        if (gameStateRef.current.spawnCounter % scrollGame.items.spawnSettings.interval === 0) {
          if (gameStateRef.current.spawnCounter % scrollGame.items.spawnSettings.avoidInterval !== 0) {
            const type = scrollGame.items.types[Math.floor(Math.random() * scrollGame.items.types.length)];
            spawnItem(type);
          }
        }

        // 处理障碍物
        gameStateRef.current.obstacles = gameStateRef.current.obstacles.filter((obs) => {
          obs.x -= scrollGame.obstacles.spawnSettings.speed;
          ctx.drawImage(obstacleImgs[obs.type], obs.x, obs.y, obs.width, obs.height);

          // 碰撞检测（可以根据配置调整容错值）
          const tolerance = scrollGame.balance.collision.tolerance;
          const isColliding = scrollGame.balance.collision.enabled &&
            player.x < obs.x + obs.width - tolerance &&
            player.x + player.width > obs.x + tolerance &&
            player.y < obs.y + obs.height - tolerance &&
            player.y + player.height > obs.y + tolerance;

          if (isColliding) {
            gameStateRef.current.lives--;
            return false;
          }
          return obs.x + obs.width > 0;
        });

        // 处理道具
        gameStateRef.current.items = gameStateRef.current.items.filter((item) => {
          item.x -= scrollGame.items.spawnSettings.speed;
          ctx.drawImage(itemImgs[item.type], item.x, item.y, item.width, item.height);

          // 碰撞检测
          const tolerance = scrollGame.balance.collision.tolerance;
          const isColliding = scrollGame.balance.collision.enabled &&
            player.x < item.x + item.width - tolerance &&
            player.x + player.width > item.x + tolerance &&
            player.y < item.y + item.height - tolerance &&
            player.y + player.height > item.y + tolerance;

          if (isColliding) {
            gameStateRef.current.score[item.type] +=  1;
            return false;
          }
          return item.x + item.width > 0;
        });

        if (gameStateRef.current.lives <= 0) {
          router.push('/result?' + new URLSearchParams({
            score: JSON.stringify(gameStateRef.current.score),
            lives: gameStateRef.current.lives.toString(),
          }));
          return;
        }

        // 使用配置中的UI设置绘制界面元素
        drawIcons(
          ctx,
          scrollGame.items.types.map((type) => [itemImgs[type], gameStateRef.current.score[type]]),
          scrollGame.ui.icons
        );

        drawPixelBar(
          ctx,
          scrollGame.ui.bars.lives.x + 40,
          scrollGame.ui.bars.lives.y,
          scrollGame.ui.bars.width,
          scrollGame.ui.bars.height,
          gameStateRef.current.lives / scrollGame.gameSettings.maxLives,
          scrollGame.ui.bars.lives.colors,
          lifeImg
        );

        drawPixelBar(
          ctx,
          scrollGame.ui.bars.time.x + 40,
          scrollGame.ui.bars.time.y,
          scrollGame.ui.bars.width,
          scrollGame.ui.bars.height,
          (scrollGame.gameSettings.duration - gameStateRef.current.distance) / scrollGame.gameSettings.duration,
          scrollGame.ui.bars.time.colors,
          goalImg
        );

        requestRef.current = requestAnimationFrame(gameLoop);
      };
      
      setLoaded(true);
      requestRef.current = requestAnimationFrame(gameLoop);
    }).catch((error) => {
      console.error('圖片載入失敗:', error);
    });

    return () => {
      isMounted = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [router]);

  const handleJump = () => {
    if (!jumping) {
      setJumping(true);
      gameStateRef.current.player.vy = scrollGame.player.physics.jumpPower;
    }
  };

  // 动态构建样式类名
  const canvasStyles = Object.values(scrollGame.ui.canvas.styles).join(' ');
  const buttonStyles = Object.values(scrollGame.ui.jumpButton.styles).join(' ');
  const loadingContainerStyles = scrollGame.ui.loading.styles.container;
  const loadingTitleStyles = scrollGame.ui.loading.styles.title;
  const loadingSubtitleStyles = scrollGame.ui.loading.styles.subtitle;

  return (
    <div 
      className={`relative flex flex-col items-center justify-center h-screen`}
    >
      {!loaded && (
        <div className={loadingContainerStyles}>
          <p className={loadingTitleStyles}>{scrollGame.ui.loading.title}</p>
          <p className={loadingSubtitleStyles}>{scrollGame.ui.loading.subtitle}</p>
        </div>
      )}
      <>
        <canvas
          ref={canvasRef}
          width={scrollGame.gameSettings.canvasSize.width}
          height={scrollGame.gameSettings.canvasSize.height}
          className={canvasStyles}
        />
        <button
          onClick={handleJump}
          className={buttonStyles}
        >
          {scrollGame.ui.jumpButton.text}
        </button>
      </>
    </div>
  );
}
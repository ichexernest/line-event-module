'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MAX_LIVES,
  GAME_DURATION,
  BAR,
  ICON,
  ITEM_TYPES,
  OBSTACLE_TYPES,
  IMAGE_PATHS,
} from '../../configs/configs';
import { drawPixelBar, drawIcons } from '../../utils/utils';

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

  const gameStateRef = useRef<GameState>({
    player: { x: 50, y: 450, width: 50, height: 90, vy: 0 },
    obstacles: [],
    items: [],
    spawnCounter: 0,
    score: Object.fromEntries(ITEM_TYPES.map((k) => [k, 0])),
    lives: MAX_LIVES,
    distance: GAME_DURATION,
  });

  const [jumping, setJumping] = useState(false);
  const gravity = 0.1;
  const jumpPower = -7;

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

    const allImagePaths = [
      IMAGE_PATHS.player,
      IMAGE_PATHS.playerJump,
      IMAGE_PATHS.background,
      ...Object.values(IMAGE_PATHS.obstacles),
      ...Object.values(IMAGE_PATHS.items),
      IMAGE_PATHS.life,
      IMAGE_PATHS.goal,
    ];

    loadImages(allImagePaths).then((imgs) => {
      if (!isMounted) return;
      
      const [playerImg, playerJumpImg, bgImg, ...restImgs] = imgs;
      const obstacleImgs = Object.fromEntries(
        OBSTACLE_TYPES.map((type, i) => [type, restImgs[i]])
      );
      const itemImgs = Object.fromEntries(
        ITEM_TYPES.map((type, i) => [type, restImgs[OBSTACLE_TYPES.length + i]])
      );

      const lifeImg = restImgs[OBSTACLE_TYPES.length + ITEM_TYPES.length]; 
      const goalImg = restImgs[OBSTACLE_TYPES.length + ITEM_TYPES.length + 1]; 

      const spawnObstacle = (type: string) => {
        gameStateRef.current.obstacles.push({ 
          x: canvas.width, 
          y: 500, 
          width: 40, 
          height: 40, 
          type 
        });
      };

      const spawnItem = (type: string) => {
        gameStateRef.current.items.push({
          x: canvas.width,
          y: 450 - Math.random() * 150,
          width: 50,
          height: 50,
          type,
        });
      };

      const gameLoop = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;

        if (elapsed > GAME_DURATION * 1000) {
          router.push('/result?' + new URLSearchParams({
            score: JSON.stringify(gameStateRef.current.score),
            lives: gameStateRef.current.lives.toString(),
          }));
          return;
        }

        gameStateRef.current.distance = Math.max(0, GAME_DURATION - Math.floor(elapsed / 1000));

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

        const player = gameStateRef.current.player;
        player.vy += gravity;
        player.y += player.vy;
        if (player.y > 450) {
          player.y = 450;
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
        if (gameStateRef.current.spawnCounter % 400 === 0) {
          const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
          spawnObstacle(type);
        }

        if (gameStateRef.current.spawnCounter % 50 === 0) {
          if (gameStateRef.current.spawnCounter % 150 !== 0) {
            const type = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
            spawnItem(type);
          }
        }

        gameStateRef.current.obstacles = gameStateRef.current.obstacles.filter((obs) => {
          obs.x -= 1.5;
          ctx.drawImage(obstacleImgs[obs.type], obs.x, obs.y, obs.width, obs.height);

          const isColliding =
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y;

          if (isColliding) {
            gameStateRef.current.lives--;
            return false;
          }
          return obs.x + obs.width > 0;
        });

        gameStateRef.current.items = gameStateRef.current.items.filter((item) => {
          item.x -= 1.5;
          ctx.drawImage(itemImgs[item.type], item.x, item.y, item.width, item.height);

          const isColliding =
            player.x < item.x + item.width &&
            player.x + player.width > item.x &&
            player.y < item.y + item.height &&
            player.y + player.height > item.y;

          if (isColliding) {
            gameStateRef.current.score[item.type]++;
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

        drawIcons(
          ctx,
          ITEM_TYPES.map((type) => [itemImgs[type], gameStateRef.current.score[type]]),
          ICON
        );

        drawPixelBar(
          ctx,
          BAR.lives.x + 40,
          BAR.lives.y,
          BAR.width,
          BAR.height,
          gameStateRef.current.lives / MAX_LIVES,
          ['#FF6D45', '#FF7E5A', '#FB977B'], 
          lifeImg
        );

        drawPixelBar(
          ctx,
          BAR.time.x + 40,
          BAR.time.y,
          BAR.width,
          BAR.height,
          (GAME_DURATION - gameStateRef.current.distance) / GAME_DURATION,
          ['#FB8F13', '#FF9822', '#FFA43D'], 
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
      gameStateRef.current.player.vy = jumpPower;
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center h-screen bg-[#FCB1B2]"  
      style={{
        backgroundImage: `url(${IMAGE_PATHS.bg})`,
      }}
    >
      {!loaded && (
        <div className="absolute flex flex-col pb-10 justify-center items-center text-white font-bold animate-pulse">
          <p className='text-3xl'>載入中請稍後...!</p>
          <p className='text-sm'>若等候時間過久，請嘗試切換其他網路遊玩</p>
        </div>
      )}
      <>
        <canvas
          ref={canvasRef}
          width="350"
          height="550"
          className="mt-3 border border-4 border-amber-950 rounded-2xl bg-[#F07C7E]"
        />
        <button
          onClick={handleJump}
          className="p-6 mt-5 w-[350px] shadow-2xl border-rose-600 border-8 font-bold text-3xl bg-red-400 text-white rounded-2xl active:bg-rose-500"
        >
          跳起來!
        </button>
      </>
    </div>
  );
}
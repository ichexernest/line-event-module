export const PLAYER_SIZE = { width: 50, height: 90 };
export const GROUND_Y = 500;

export const MAX_LIVES = 5;
export const GAME_DURATION = 45; // 秒數

export const BAR = {
  width: 250,
  height: 20,
  lives: { x: 10, y: 60 },
  time: { x: 10, y: 90 },
};

export const ICON = {
  size: 35,
  margin: 10,
  top: 10,
};

export const ITEM_TYPES = ['prop1', 'prop2', 'prop3', 'prop4', 'prop5'];
export const OBSTACLE_TYPES = ['prop1', 'prop2', 'prop3'];

export const IMAGE_PATHS = {
  player: '/assets/player.webp',
  playerJump: '/assets/player_jump.webp',
  background: '/assets/background.webp',
  obstacles: {
    prop1: '/assets/obstacle1.webp',
    prop2: '/assets/obstacle2.webp',
    prop3: '/assets/obstacle3.webp',
  },
  items: {
    prop1: '/assets/item1.webp',
    prop2: '/assets/item2.webp',
    prop3: '/assets/item3.webp',
    prop4: '/assets/item4.webp',
    prop5: '/assets/item5.webp',
  },
  life: '/assets/life.webp',
  goal: '/assets/goal.webp',
  success1: '/assets/successCard1.webp',
  success2: '/assets/successCard2.webp',
  fail: '/assets/failCard.webp',
  bg: '/assets/bg-mtd.webp',
  start: '/assets/start.webp',
};
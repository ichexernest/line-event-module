// drawUtils.ts

/**
 * 畫條形圖（可用於血條、時間條）
 * @param ctx - Canvas 2D 渲染上下文
 * @param x - X 座標
 * @param y - Y 座標
 * @param width - 寬度
 * @param height - 高度
 * @param ratio - 填充比例 (0 ~ 1)
 * @param color - 填充顏色
 * @param borderColor - 邊框顏色
 */
export function drawBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  ratio: number,
  color: string,
  borderColor: string = '#800010'
): void {
  ctx.fillStyle = 'gray';
  ctx.fillRect(x, y, width, height);

  ctx.fillStyle = color;
  ctx.fillRect(x, y, ratio * width, height);

  ctx.strokeStyle = borderColor;
  ctx.strokeRect(x, y, width, height);
}

/**
 * 圖標配置介面
 */
interface IconConfig {
  size: number;
  margin: number;
  top: number;
}

/**
 * 畫 icon + 數量
 * @param ctx - Canvas 2D 渲染上下文
 * @param iconDataList - 圖標和數量的陣列
 * @param config - 圖標配置
 */
export function drawIcons(
  ctx: CanvasRenderingContext2D,
  iconDataList: [HTMLImageElement, number][],
  config: IconConfig
): void {
  iconDataList.forEach(([icon, count], index) => {
    const x = 10 + index * (config.size + config.margin + 20);
    ctx.drawImage(icon, x, config.top, config.size, config.size);
    ctx.fillStyle = '#800010';
    ctx.font = '18px Arial';
    ctx.fillText(`x${count}`, x + config.size + 2, config.top + config.size - 5);
  });
}

/**
 * 畫出16-bit格子風格條（帶像素感漸層 + 左側素材圖）
 * @param ctx - Canvas 2D 渲染上下文
 * @param x - X 座標
 * @param y - Y 座標
 * @param width - 寬度
 * @param height - 高度
 * @param ratio - 填充比例 (0 ~ 1)
 * @param gradientColors - 漸層用顏色陣列
 * @param icon - 左側圖標素材
 */
export function drawPixelBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  ratio: number,
  gradientColors: string[],
  icon?: HTMLImageElement
): void {
  const segmentCount = 10;
  const segmentWidth = width / segmentCount;
  const filledCount = Math.floor(ratio * segmentCount);

  // 畫邊框背景
  ctx.fillStyle = '#3c3c3c';
  ctx.fillRect(x - 2, y - 2, width + 4, height + 4);

  for (let i = 0; i < segmentCount; i++) {
    const segX = x + i * segmentWidth;
    if (i < filledCount) {
      const grad = ctx.createLinearGradient(segX, y, segX + segmentWidth, y);
      gradientColors.forEach((color, index) => {
        grad.addColorStop(index / (gradientColors.length - 1), color);
      });
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = '#555';
    }
    ctx.fillRect(segX + 1, y + 1, segmentWidth - 2, height - 2);
  }

  // 外框亮線
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(x - 1, y - 1, width + 2, height + 2);

  // 畫左側圖示
  if (icon) {
    ctx.drawImage(icon, x - height - 14, y - 4, height + 8, height + 8);
  }
}
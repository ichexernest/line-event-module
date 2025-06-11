'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import { CanvaEdit } from '../../../configs/configs';
import { uploadImage } from '@/utils/imgUploadUtils';

// 顏色配置
const COLORS = {
  text: '#000000',
  hintText: '#999999',
  shareButtonBg: '#FED501',
  shareButtonBorder: '#FED501',
  shareButtonText: '#000000', // 黃色背景上用黑色文字較清楚
  submitButtonBg: '#FED501',
  submitButtonBorder: '#FED501',
  submitButtonText: '#000000', // 黃色背景上用黑色文字較清楚
} as const;

// 樣式
const CANVAS_STYLES = {
  BUTTON: {
    PRIMARY: `p-5 text-2xl bg-[${COLORS.submitButtonBg}] text-[${COLORS.submitButtonText}] rounded-xl shadow-md font-extrabold border-4 border-[${COLORS.submitButtonBorder}]`,
    SECONDARY: `bg-blue-800 text-white font-bold w-[100px] rounded-xl p-2 rounded`,
    DISABLED: `disabled:opacity-50 disabled:cursor-not-allowed`,
  },
  TEXT: {
    TITLE: `text-xl text-blue-800 font-bold text-center`,
    TIP: `text-sm text-red-600 font-bold text-center w-screen`,
    LOADING: `text-4xl font-bold text-blue-800`,
    HINT: `border-black border rounded-md p-2 bg-white/60 text-[${COLORS.hintText}]`,
  },
  LAYOUT: {
    CANVAS_WRAPPER: `w-full p-4`,
    LOADING_OVERLAY: `fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50`,
  }
} as const;

// 型別定義
interface TextPosition {
  x: number;
  y: number;
  fontSize: number;
}

interface CanvasSize {
  width: number;
  height: number;
}

interface ImageData {
  image: string;
  url: string;
}

interface CardOption {
  src: string;
  alt: string;
}

interface CanvasEditorProps {
  onSave: (imageData: ImageData) => void;
}

export default function CanvasEditor  ({ onSave }: CanvasEditorProps ) {
  // Canvas 相關狀態
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stageRef = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textRef = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformerRef = useRef<any>(null);
  
  const [image, setImage] = useState<string>(CanvaEdit.resources.images.cards.card1 || '');
  const [text, setText] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [textColor, setTextColor] = useState<string>(COLORS.text);
  const [textPosition, setTextPosition] = useState<TextPosition>(
    CanvaEdit.config.text.defaultPosition || { x: 50, y: 50, fontSize: 20 }
  );
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [bgImage] = useImage(image);

  // 初始化 Canvas 尺寸
  useEffect(() => {
    const sizeRatio = CanvaEdit.config.canvas.sizeRatio || 0.8;
    const size = window.innerWidth * sizeRatio;
    setCanvasSize({ width: size, height: size });
    
    const handleResize = () => {
      const size = window.innerWidth * sizeRatio;
      setCanvasSize({ width: size, height: size });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (transformerRef.current && textRef.current && text) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [text]);

  const handleUploadImage = async (base64Image: string): Promise<string> => {
    try {
      const url = await uploadImage(base64Image);
      console.log('Image uploaded successfully:', url);
      return url;
    } catch (error: unknown) {
      console.error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const handleImageChange = (imageSrc: string): void => {
    setImage(imageSrc);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = event.target.value;
    const maxLength = CanvaEdit.config.text.maxLength || 100;
    if (value.length <= maxLength) {
      setInputText(value);
    }
  };

  const handleTextSubmit = (): void => {
    setText(inputText);
    setTimeout(() => {
      if (transformerRef.current && textRef.current) {
        transformerRef.current.nodes([textRef.current]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    }, 0);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTextColor(event.target.value);
  };

  const handleSave = async (): Promise<void> => {
    if (!stageRef.current) return;
    
    setIsLoading(true);
    try {
      const transformer = transformerRef.current;
      if (transformer) {
        transformer.nodes([]);
      }
      
      const stage = stageRef.current;
      const pixelRatio = CanvaEdit.config.canvas.pixelRatio || 2;
      const dataUrl = stage.toDataURL({ pixelRatio });
      const url = await handleUploadImage(dataUrl);
      
      const imageData: ImageData = {
        image: dataUrl,
        url: url
      };
      
      setTimeout(() => {
        if (transformer && textRef.current) {
          transformer.nodes([textRef.current]);
          transformer.getLayer()?.batchDraw();
        }
      }, 0);
      
      onSave(imageData);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleStageMouseDown = (e: any): void => {
    if (e.target === e.target.getStage()) {
      // 點擊空白處不做任何動作
    }
  };

  const handleTransform = (): void => {
    const node = textRef.current;
    if (!node) return;
    
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);
    setTextPosition({
      x: node.x(),
      y: node.y(),
      fontSize: node.fontSize() * Math.max(scaleX, scaleY),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (e: any): void => {
    setTextPosition({ 
      ...textPosition, 
      x: e.target.x(), 
      y: e.target.y() 
    });
  };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragMove = (e: any): void => {
    setTextPosition({ 
      ...textPosition, 
      x: e.target.x(), 
      y: e.target.y() 
    });
  };

  // 卡片選項
  const cardOptions: CardOption[] = [
    { src: CanvaEdit.resources.images.cards.card1 || '', alt: "Card 1" },
    { src: CanvaEdit.resources.images.cards.card2 || '', alt: "Card 2" },
    { src: CanvaEdit.resources.images.cards.card3 || '', alt: "Card 3" },
  ];

  return (
    <div className={CANVAS_STYLES.LAYOUT.CANVAS_WRAPPER}>
      {isLoading && (
        <div className={CANVAS_STYLES.LAYOUT.LOADING_OVERLAY}>
          <div className={CANVAS_STYLES.TEXT.LOADING}>
            {CanvaEdit.texts.canva.loading || 'Loading...'}
          </div>
        </div>
      )}
      
      {/* Canvas Stage */}
      <div className="flex justify-center m-3">
        <Stage
          width={canvasSize.width}
          height={canvasSize.height}
          ref={stageRef}
          onMouseDown={handleStageMouseDown}
          className="border border-black"
        >
          <Layer>
            {bgImage && (
              <KonvaImage
                x={0}
                y={0}
                width={canvasSize.width}
                height={canvasSize.height}
                image={bgImage}
              />
            )}
            {text && (
              <Text
                ref={textRef}
                text={text}
                x={textPosition.x}
                y={textPosition.y}
                fontSize={textPosition.fontSize}
                fill={textColor}
                draggable
                name="text"
                onDragEnd={handleDragEnd}
                onTransformEnd={handleTransform}
                onDragMove={handleDragMove}
              />
            )}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                const minSize = CanvaEdit.config.canvas.minTransformSize || 10;
                if (newBox.width < minSize || newBox.height < minSize) {
                  return oldBox;
                }
                return newBox;
              }}
              rotateEnabled={false}
              enabledAnchors={CanvaEdit.config.transformer.enabledAnchors || ['top-left', 'top-right', 'bottom-left', 'bottom-right']}
              borderStrokeWidth={CanvaEdit.config.transformer.borderStrokeWidth || 2}
            />
          </Layer>
        </Stage>
      </div>
      
      <div>
        <span className={CANVAS_STYLES.TEXT.TIP}>
          {CanvaEdit.texts.canva.tips || '提示文字'}
        </span>
      </div>
      
      <span className={CANVAS_STYLES.TEXT.TITLE}>
        {CanvaEdit.texts.canva.stepOne || '步驟一'}
      </span>
      <div className="flex justify-center mt-4 space-x-2 mb-5">
        {cardOptions.map((card, index) => (
          <img
            key={index}
            src={card.src}
            alt={card.alt}
            onClick={() => handleImageChange(card.src)}
            className="cursor-pointer w-12 h-12 border-2 border-transparent hover:border-blue-500 rounded"
          />
        ))}
      </div>
      
      <span className={CANVAS_STYLES.TEXT.TITLE}>
        {CanvaEdit.texts.canva.stepTwo || '步驟二'}
      </span>
      <div className="flex justify-center mt-4 space-x-2">
        <textarea
          value={inputText}
          onChange={handleTextChange}
          placeholder={CanvaEdit.texts.canva.placeholder || '請輸入文字...'}
          className={CANVAS_STYLES.TEXT.HINT}
          style={{ color: CanvaEdit.color.hintText }}
          rows={3}
          cols={50}
        />
        <button 
          onClick={handleTextSubmit} 
          className={CANVAS_STYLES.BUTTON.SECONDARY}
          style={{
            backgroundColor: CanvaEdit.color.submitButtonBg,
            color: CanvaEdit.color.submitButtonText,
            borderColor: CanvaEdit.color.submitButtonBorder,
          }}
          disabled={!inputText.trim()}
        >
          {CanvaEdit.texts.canva.writeOnCard || '寫在卡片上'}
        </button>
      </div>
      
      <div className="flex justify-center mt-4 space-x-2">
        <label htmlFor="textColor" className="flex items-center space-x-2">
          <span className={CANVAS_STYLES.TEXT.TITLE}>
            {CanvaEdit.texts.canva.colorSelector || '選擇顏色'}
          </span>
          <input
            type="color"
            id="textColor"
            value={textColor}
            onChange={handleColorChange}
            className="border p-1 border-black rounded"
          />
        </label>
      </div>
      
      <div className="flex justify-center mt-4">
        <button 
          className={`${CANVAS_STYLES.BUTTON.PRIMARY} ${CANVAS_STYLES.BUTTON.DISABLED}`}
          style={{
            backgroundColor: CanvaEdit.color.shareButtonBg,
            color: CanvaEdit.color.shareButtonText,
            borderColor: CanvaEdit.color.shareButtonBorder,
          }}
          onClick={handleSave}
          disabled={isLoading || !text.trim()}
        > 
          {isLoading 
            ? (CanvaEdit.texts.canva.loading || '儲存中...') 
            : (CanvaEdit.texts.canva.buttonText || '儲存')
          }
        </button>
      </div>
    </div>
  );
};

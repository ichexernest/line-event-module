import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import { CanvaEdit } from '../../../configs/configs';
import { uploadImage } from '@/utils/imgUploadUtils';

// 樣式
const CANVAS_STYLES = {
  BUTTON: {
    PRIMARY: `p-5 text-2xl bg-[${CanvaEdit.colors.primary.yellow}] text-blue-900 rounded-xl shadow-md font-extrabold border-4 border-blue-800`,
    SECONDARY: `bg-blue-800 text-white font-bold p-2 rounded`,
    DISABLED: `disabled:bg-blue-300`,
  },
  TEXT: {
    TITLE: `text-xl text-blue-800 font-bold text-center`,
    TIP: `text-sm text-red-600 font-bold text-center w-screen`,
    LOADING: `text-4xl font-bold text-blue-800`,
  },
  LAYOUT: {
    CANVAS_WRAPPER: `w-full p-4`,
    LOADING_OVERLAY: `fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50`,
  }
} as const;

interface CanvasEditorProps {
  onSave: (imageData: { image: string; url: string }) => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ onSave }) => {
  // Canvas 相關狀態
  const stageRef = useRef<any>(null);
  const textRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const [image, setImage] = useState<string | null>(CanvaEdit.resources.images.cards.card1);
  const [text, setText] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [textColor, setTextColor] = useState<string>(CanvaEdit.colors.text.default);
  const [textPosition, setTextPosition] = useState(CanvaEdit.config.text.defaultPosition);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [bgImage] = useImage(image);

  // 初始化 Canvas 尺寸
  useEffect(() => {
    const size = window.innerWidth * CanvaEdit.config.canvas.sizeRatio;
    setCanvasSize({ width: size, height: size });
    
    const handleResize = () => {
      const size = window.innerWidth * CanvaEdit.config.canvas.sizeRatio;
      setCanvasSize({ width: size, height: size });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [text]);

  const handleUploadImage = async (base64Image: string): Promise<string> => {
    try {
      const url = await uploadImage(base64Image);
      return url;
    } catch (error: any) {
      console.error(`Image upload failed: ${error.message}`);
      throw error;
    }
  };

  const handleImageChange = (imageSrc: string) => {
    setImage(imageSrc);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (value.length <= CanvaEdit.config.text.maxLength) {
      setInputText(value);
    }
  };

  const handleTextSubmit = () => {
    setText(inputText);
    setTimeout(() => {
      if (transformerRef.current && textRef.current) {
        transformerRef.current.nodes([textRef.current]);
        transformerRef.current.getLayer().batchDraw();
      }
    }, 0);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(event.target.value);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const transformer = transformerRef.current;
      transformer.nodes([]);
      const stage = stageRef.current;
      const dataUrl = stage.toDataURL({ pixelRatio: CanvaEdit.config.canvas.pixelRatio });
      const url = await handleUploadImage(dataUrl);
      
      const img = {
        image: dataUrl,
        url: url
      };
      
      setTimeout(() => {
        transformer.nodes([textRef.current]);
        transformer.getLayer().batchDraw();
      }, 0);
      
      onSave(img);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStageMouseDown = (e: any) => {
    if (e.target === e.target.getStage()) {
      // 不要关闭控制框
    }
  };

  const handleTransform = (e: any) => {
    const node = textRef.current;
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

  // 卡片選項
  const cardOptions = [
    { src: CanvaEdit.resources.images.cards.card1, alt: "Card 1" },
    { src: CanvaEdit.resources.images.cards.card2, alt: "Card 2" },
    { src: CanvaEdit.resources.images.cards.card3, alt: "Card 3" },
  ];

  return (
    <div className={CANVAS_STYLES.LAYOUT.CANVAS_WRAPPER}>
      {isLoading && (
        <div className={CANVAS_STYLES.LAYOUT.LOADING_OVERLAY}>
          <div className={CANVAS_STYLES.TEXT.LOADING}>{CanvaEdit.texts.canva.loading}</div>
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
            <Text
              ref={textRef}
              text={text}
              x={textPosition.x}
              y={textPosition.y}
              fontSize={textPosition.fontSize}
              fill={textColor}
              draggable
              name="text"
              onDragEnd={(e) => {
                setTextPosition({ ...textPosition, x: e.target.x(), y: e.target.y() });
              }}
              onTransformEnd={handleTransform}
              onDragMove={(e) => {
                setTextPosition({ ...textPosition, x: e.target.x(), y: e.target.y() });
              }}
            />
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < CanvaEdit.config.canvas.minTransformSize || newBox.height < CanvaEdit.config.canvas.minTransformSize) {
                  return oldBox;
                }
                return newBox;
              }}
              rotateEnabled={false}
              enabledAnchors={CanvaEdit.config.transformer.enabledAnchors}
              borderStrokeWidth={CanvaEdit.config.transformer.borderStrokeWidth}
            />
          </Layer>
        </Stage>
      </div>
      
      <div>
        <span className={CANVAS_STYLES.TEXT.TIP}>{CanvaEdit.texts.canva.tips}</span>
      </div>
      
      <span className={CANVAS_STYLES.TEXT.TITLE}>{CanvaEdit.texts.canva.stepOne}</span>
      <div className="flex justify-center mt-4 space-x-2 mb-5">
        {cardOptions.map((card, index) => (
          <img
            key={index}
            src={card.src}
            alt={card.alt}
            onClick={() => handleImageChange(card.src)}
            className="cursor-pointer w-12 h-12"
          />
        ))}
      </div>
      
      <span className={CANVAS_STYLES.TEXT.TITLE}>{CanvaEdit.texts.canva.stepTwo}</span>
      <div className="flex justify-center mt-4 space-x-2">
        <textarea
          value={inputText}
          onChange={handleTextChange}
          placeholder={CanvaEdit.texts.canva.placeholder}
          className="border p-2 text-gray-700 border-black rounded-sm bg-white/50"
          rows={3}
          cols={50}
        />
        <button onClick={handleTextSubmit} className={CANVAS_STYLES.BUTTON.SECONDARY}>
          {CanvaEdit.texts.canva.writeOnCard}
        </button>
      </div>
      
      <div className="flex justify-center mt-4 space-x-2">
        <label htmlFor="textColor" className="flex items-center space-x-2">
          <span className={CANVAS_STYLES.TEXT.TITLE}>{CanvaEdit.texts.canva.colorSelector}</span>
          <input
            type="color"
            id="textColor"
            value={textColor}
            onChange={handleColorChange}
            className="border p-1 border-black"
          />
        </label>
      </div>
      
      <div className="flex justify-center mt-4">
        <button 
          className={`${CANVAS_STYLES.BUTTON.PRIMARY} ${CANVAS_STYLES.BUTTON.DISABLED}`}
          onClick={handleSave}
          disabled={isLoading}
        > 
          {CanvaEdit.texts.canva.buttonText}
        </button>
      </div>
    </div>
  );
};

export default CanvasEditor;
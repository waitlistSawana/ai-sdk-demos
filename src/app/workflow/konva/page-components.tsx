"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer, Rect, Circle } from "react-konva";
import type Konva from "konva";
import useImage from "use-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 数据类型定义
interface ImageAsset {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  zIndex: number;
  crop?: { x: number; y: number; width: number; height: number };
}

interface Annotation {
  id: string;
  imageId: string;
  type: "rect" | "circle";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
}

// 图片组件（使用 useImage hook）
function KonvaImageComponent({
  asset,
  onSelect,
  onDragEnd,
  onTransformEnd,
  imageRef,
}: {
  asset: ImageAsset;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
  imageRef: React.RefObject<Konva.Image | null>;
}) {
  const [image] = useImage(asset.src, "anonymous");

  return (
    <KonvaImage
      ref={imageRef}
      image={image}
      x={asset.x}
      y={asset.y}
      width={asset.width}
      height={asset.height}
      rotation={asset.rotation}
      scaleX={asset.scaleX}
      scaleY={asset.scaleY}
      crop={asset.crop}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
    />
  );
}

export default function KonvaPageComponent({
  className,
  ...props
}: React.ComponentProps<"div"> & {
  className?: string;
}) {
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [annotationMode, setAnnotationMode] = useState<"rect" | "circle" | null>(null);
  const [cropMode, setCropMode] = useState(false);

  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const imageRefs = useRef<{ [key: string]: React.RefObject<Konva.Image | null> }>({});
  const annotationRefs = useRef<{ [key: string]: React.RefObject<Konva.Rect | Konva.Circle | null> }>({});

  // 响应式画布尺寸
  useEffect(() => {
    const updateSize = () => {
      setStageSize({
        width: window.innerWidth - 100,
        height: window.innerHeight - 200,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Transformer 同步
  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const imageRef = imageRefs.current[selectedId];
      const annotationRef = annotationRefs.current[selectedId];
      const node = imageRef?.current || annotationRef?.current;
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    }
  }, [selectedId]);

  // 图片上传处理
  const handleFileUpload = useCallback(
    (file: File) => {
      if (images.length >= 2) {
        alert("最多只能上传2张图片");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const img = new window.Image();
        img.onload = () => {
          const newAsset: ImageAsset = {
            id: `img-${Date.now()}`,
            src,
            x: stageSize.width / 2 - img.width / 2,
            y: stageSize.height / 2 - img.height / 2,
            width: img.width,
            height: img.height,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            zIndex: images.length,
          };
          setImages((prev) => [...prev, newAsset]);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    },
    [images.length, stageSize]
  );

  // 使用示例图片
  const handleUseExample = useCallback(() => {
    if (images.length >= 2) {
      alert("最多只能上传2张图片");
      return;
    }

    // 获取示例图片的 base64
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 创建一个简单的示例图片
    canvas.width = 400;
    canvas.height = 300;
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Example", canvas.width / 2, canvas.height / 2);

    const src = canvas.toDataURL();
    const newAsset: ImageAsset = {
      id: `img-${Date.now()}`,
      src,
      x: stageSize.width / 2 - canvas.width / 2,
      y: stageSize.height / 2 - canvas.height / 2,
      width: canvas.width,
      height: canvas.height,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      zIndex: images.length,
    };
    setImages((prev) => [...prev, newAsset]);
  }, [images.length, stageSize]);

  // 拖拽结束
  const handleDragEnd = useCallback(
    (id: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { ...img, x: e.target.x(), y: e.target.y() }
            : img
        )
      );
    },
    []
  );

  // 变换结束
  const handleTransformEnd = useCallback(
    (id: string) => (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target;
      const image = images.find((img) => img.id === id);
      if (!image) return;

      if (cropMode && image.crop) {
        // 裁切模式下，更新裁切区域
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        const currentCrop = image.crop;
        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  crop: {
                    x: currentCrop.x,
                    y: currentCrop.y,
                    width: (currentCrop.width * scaleX) / img.scaleX,
                    height: (currentCrop.height * scaleY) / img.scaleY,
                  },
                }
              : img
          )
        );
      } else {
        // 普通变换模式
        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  x: node.x(),
                  y: node.y(),
                  width: node.width() * node.scaleX(),
                  height: node.height() * node.scaleY(),
                  rotation: node.rotation(),
                  scaleX: 1,
                  scaleY: 1,
                }
              : img
          )
        );
      }
    },
    [cropMode, images]
  );

  // 标注框拖拽结束
  const handleAnnotationDragEnd = useCallback(
    (id: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
      setAnnotations((prev) =>
        prev.map((ann) =>
          ann.id === id
            ? { ...ann, x: e.target.x(), y: e.target.y() }
            : ann
        )
      );
    },
    []
  );

  // 标注框变换结束
  const handleAnnotationTransformEnd = useCallback(
    (id: string) => (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target;
      setAnnotations((prev) =>
        prev.map((ann) => {
          if (ann.id !== id) return ann;
          if (ann.type === "rect") {
            return {
              ...ann,
              x: node.x(),
              y: node.y(),
              width: node.width() * node.scaleX(),
              height: node.height() * node.scaleY(),
            };
          } else {
            return {
              ...ann,
              x: node.x(),
              y: node.y(),
              radius: (node.width() * node.scaleX()) / 2,
            };
          }
        })
      );
    },
    []
  );

  // 画布点击处理（用于绘制标注框）
  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!annotationMode || !selectedId) return;
      const stage = e.target.getStage();
      if (!stage) return;

      // 检查是否点击在图片上
      const clickedOnImage = images.some((img) => {
        const imageRef = imageRefs.current[img.id];
        const imageNode = imageRef?.current;
        if (!imageNode) return false;
        const pointerPos = stage.getPointerPosition();
        if (!pointerPos) return false;
        const imageBox = imageNode.getClientRect();
        return (
          pointerPos.x >= imageBox.x &&
          pointerPos.x <= imageBox.x + imageBox.width &&
          pointerPos.y >= imageBox.y &&
          pointerPos.y <= imageBox.y + imageBox.height
        );
      });

      if (!clickedOnImage) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      const newAnnotation: Annotation = {
        id: `ann-${Date.now()}`,
        imageId: selectedId,
        type: annotationMode,
        x: pointerPos.x - 50,
        y: pointerPos.y - 50,
        ...(annotationMode === "rect" ? { width: 100, height: 100 } : { radius: 50 }),
      };

      setAnnotations((prev) => [...prev, newAnnotation]);
      setAnnotationMode(null);
    },
    [annotationMode, selectedId, images]
  );

  // 对齐功能
  const handleAlign = useCallback(
    (alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
      if (!selectedId) return;

      const imageRef = imageRefs.current[selectedId];
      const imageNode = imageRef?.current;
      if (!imageNode) return;

      const image = images.find((img) => img.id === selectedId);
      if (!image) return;

      let newX = image.x;
      let newY = image.y;

      switch (alignment) {
        case "left":
          newX = 0;
          break;
        case "center":
          newX = stageSize.width / 2 - image.width / 2;
          break;
        case "right":
          newX = stageSize.width - image.width;
          break;
        case "top":
          newY = 0;
          break;
        case "middle":
          newY = stageSize.height / 2 - image.height / 2;
          break;
        case "bottom":
          newY = stageSize.height - image.height;
          break;
      }

      setImages((prev) =>
        prev.map((img) => (img.id === selectedId ? { ...img, x: newX, y: newY } : img))
      );
    },
    [selectedId, images, stageSize]
  );

  return (
    <div className={cn("flex h-screen flex-col", className)} {...props}>
      {/* 工具栏 */}
      <div className="flex gap-2 border-b bg-white p-4">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="file-upload"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          上传图片
        </Button>
        <Button variant="outline" size="sm" onClick={handleUseExample}>
          使用示例
        </Button>
        <div className="mx-2 w-px bg-border" />
        {selectedId && (
          <>
            <Button variant="outline" size="sm" onClick={() => handleAlign("left")}>
              左对齐
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAlign("center")}>
              居中
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAlign("right")}>
              右对齐
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAlign("top")}>
              顶部
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAlign("middle")}>
              垂直居中
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAlign("bottom")}>
              底部
            </Button>
            <div className="mx-2 w-px bg-border" />
            <Button
              variant={cropMode ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const isImage = images.some((img) => img.id === selectedId);
                if (isImage) {
                  setCropMode(!cropMode);
                  if (!cropMode && selectedId) {
                    // 进入裁切模式，初始化裁切区域
                    const image = images.find((img) => img.id === selectedId);
                    if (image) {
                      setImages((prev) =>
                        prev.map((img) =>
                          img.id === selectedId
                            ? {
                                ...img,
                                crop: img.crop || { x: 0, y: 0, width: img.width, height: img.height },
                              }
                            : img
                        )
                      );
                    }
                  }
                }
              }}
            >
              裁切
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedId) {
                  // 检查是图片还是标注
                  const isImage = images.some((img) => img.id === selectedId);
                  if (isImage) {
                    setImages((prev) => prev.filter((img) => img.id !== selectedId));
                  } else {
                    setAnnotations((prev) => prev.filter((ann) => ann.id !== selectedId));
                  }
                  setSelectedId(null);
                  setCropMode(false);
                }
              }}
            >
              删除
            </Button>
            <div className="mx-2 w-px bg-border" />
          </>
        )}
        <Button
          variant={annotationMode === "rect" ? "default" : "outline"}
          size="sm"
          onClick={() => setAnnotationMode(annotationMode === "rect" ? null : "rect")}
        >
          矩形标注
        </Button>
        <Button
          variant={annotationMode === "circle" ? "default" : "outline"}
          size="sm"
          onClick={() => setAnnotationMode(annotationMode === "circle" ? null : "circle")}
        >
          圆形标注
        </Button>
        <div className="mx-2 w-px bg-border" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const dataURL = stageRef.current?.toDataURL({
              mimeType: "image/png",
              pixelRatio: 2,
            });
            if (dataURL) {
              const link = document.createElement("a");
              link.download = "edited-image.png";
              link.href = dataURL;
              link.click();
            }
          }}
        >
          导出 PNG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const dataURL = stageRef.current?.toDataURL({
              mimeType: "image/jpeg",
              quality: 0.9,
              pixelRatio: 2,
            });
            if (dataURL) {
              const link = document.createElement("a");
              link.download = "edited-image.jpg";
              link.href = dataURL;
              link.click();
            }
          }}
        >
          导出 JPEG
        </Button>
      </div>

      {/* 画布区域 */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          className="mx-auto bg-white shadow-lg"
          onClick={handleStageClick}
        >
          <Layer>
            {images.map((asset) => {
              if (!imageRefs.current[asset.id]) {
                imageRefs.current[asset.id] = React.createRef<Konva.Image | null>();
              }
              return (
                <KonvaImageComponent
                  key={asset.id}
                  asset={asset}
                  isSelected={selectedId === asset.id}
                  onSelect={() => setSelectedId(asset.id)}
                  onDragEnd={handleDragEnd(asset.id)}
                  onTransformEnd={handleTransformEnd(asset.id)}
                  imageRef={imageRefs.current[asset.id] as React.RefObject<Konva.Image>}
                />
              );
            })}
            {annotations.map((ann) => {
              if (!annotationRefs.current[ann.id]) {
                annotationRefs.current[ann.id] =
                  ann.type === "rect"
                    ? (React.createRef<Konva.Rect | null>() as React.RefObject<Konva.Rect | Konva.Circle | null>)
                    : (React.createRef<Konva.Circle | null>() as React.RefObject<Konva.Rect | Konva.Circle | null>);
              }
              if (ann.type === "rect") {
                return (
                  <Rect
                    key={ann.id}
                    ref={annotationRefs.current[ann.id] as React.RefObject<Konva.Rect>}
                    x={ann.x}
                    y={ann.y}
                    width={ann.width || 100}
                    height={ann.height || 100}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="transparent"
                    draggable
                    onClick={() => setSelectedId(ann.id)}
                    onTap={() => setSelectedId(ann.id)}
                    onDragEnd={handleAnnotationDragEnd(ann.id)}
                    onTransformEnd={handleAnnotationTransformEnd(ann.id)}
                  />
                );
              } else {
                return (
                  <Circle
                    key={ann.id}
                    ref={annotationRefs.current[ann.id] as React.RefObject<Konva.Circle>}
                    x={ann.x}
                    y={ann.y}
                    radius={ann.radius || 50}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="transparent"
                    draggable
                    onClick={() => setSelectedId(ann.id)}
                    onTap={() => setSelectedId(ann.id)}
                    onDragEnd={handleAnnotationDragEnd(ann.id)}
                    onTransformEnd={handleAnnotationTransformEnd(ann.id)}
                  />
                );
              }
            })}
            {selectedId && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // 限制最小尺寸
                  if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>
      </div>

      {/* 状态栏 */}
      <div className="border-t bg-white p-2 text-gray-600 text-sm">
        {selectedId ? `已选择: ${selectedId}` : "未选择对象"} | 图片数量: {images.length}/2
      </div>
    </div>
  );
}


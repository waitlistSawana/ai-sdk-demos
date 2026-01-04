# Konva 图片编辑 Demo - 产品需求文档 (PRD)

## 项目概述

**目标**: 在1小时内实现一个MVP级别的图片编辑组件demo，基于 Konva.js 构建高交互的多层可视化画布，实现 AI 资产的空间操纵与精准蒙版标注，为 AI Agent 提供直观的视觉反馈与语义化控制链路。

**核心需求**: 
- 多层画布系统（支持多个图层）
- AI 资产的空间操纵（拖拽、缩放、旋转、对齐）
- 精准蒙版标注（绘制和编辑蒙版区域）
- 语义化控制接口（供 AI Agent 调用）

**应用场景**: 作为图片编辑组件，方便未来直接融入生图 Agent 工作流中

**设计原则**:
- **优先使用 Konva 原生 API**：尽量直接使用 `react-konva` 提供的组件和属性，减少自定义抽象层
- **简化架构**：避免过度封装，保持代码直观易懂，便于二次开发
- **聚焦核心功能**：MVP 版本聚焦最核心的编辑场景（上传两张图片、裁切、拖拽、标注、导出）

## 功能范围分析

基于 [Konva.js React 文档](https://konvajs.org/docs/react/index.html) 的功能分类，MVP版本聚焦以下核心功能：

### 1. 基础画布系统 (Canvas System)

**优先级**: P0 (必须实现)

**功能点**:
- ✅ Stage + Layer 多层架构
  - 主画布层（背景层）
  - 内容层（图片、形状等）
  - 标注层（蒙版、标注等）
  - 交互层（选择框、控制点等）
- ✅ 画布尺寸和缩放
  - 响应式画布尺寸
  - 基础缩放功能（鼠标滚轮）
  - 画布平移（拖拽空白区域）

**技术方案**:
- 使用 `react-konva` 的 `Stage` 和 `Layer` 组件
- 多个 Layer 实现分层渲染
- 使用 `Konva.Transformer` 实现变换控制

**核心组件**:
```tsx
<Stage width={width} height={height}>
  <Layer> {/* 背景层 */}
  <Layer> {/* 内容层 */}
  <Layer> {/* 标注层 */}
  <Layer> {/* 交互层 */}
</Stage>
```

### 2. AI 资产加载与显示 (Asset Loading)

**优先级**: P0 (必须实现)

**功能点**:
- ✅ 图片上传/加载
  - 支持文件选择器上传
  - 支持拖拽上传
  - 支持使用示例图片（`@/components/example-image.tsx`）
  - **支持上传最多两张图片**（MVP 场景：两张图片叠加编辑）
  - 图片自动适配画布尺寸
- ✅ 图片显示
  - 使用 `react-konva` 的 `Image` 组件
  - 使用 `useImage` hook 处理图片异步加载（推荐方式）
  - 图片叠加显示（通过 zIndex 控制层级）

**技术方案**:
- **直接使用 `react-konva` 的 `Image` 组件**，无需自定义封装
- 使用 `use-image` 库的 `useImage` hook 处理图片加载
- 状态管理：使用 React `useState` 存储图片列表（最多2张）
- 图片位置和变换直接存储在组件 state 中，通过 props 传递给 `Image` 组件

**数据结构**:
```typescript
interface ImageAsset {
  id: string;
  src: string; // 图片 URL 或 base64
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  zIndex: number;
}
```

**Konva 原生 API 使用**:
```tsx
import { Image } from 'react-konva';
import useImage from 'use-image';

const [image] = useImage(src);
<Image 
  image={image}
  x={x}
  y={y}
  width={width}
  height={height}
  draggable
  // 直接使用 Konva.Image 的所有原生属性
/>
```

### 3. 空间操纵功能 (Spatial Manipulation)

**优先级**: P0 (必须实现)

**功能点**:
- ✅ 拖拽移动
  - 图片可拖拽（使用 `draggable={true}` 属性）
  - 监听 `onDragEnd` 事件更新位置状态
  - 拖拽边界限制（可选，使用 `dragBoundFunc`）
- ✅ 变换操作
  - 缩放（使用 `Transformer` 组件）
  - 旋转（使用 `Transformer` 组件）
  - 监听 `onTransformEnd` 事件更新变换状态
  - 保持宽高比（可选，通过 `Transformer` 的 `boundBoxFunc` 实现）
- ✅ 图片裁切
  - 使用 `Konva.Image` 的 `crop` 属性实现裁切
  - 通过 `Transformer` 调整裁切区域
  - 裁切后导出为新图片（适应 edit 图片场景）
- ✅ 对齐功能
  - 左对齐、右对齐、居中对齐
  - 顶部对齐、底部对齐、垂直居中
  - 对齐到画布中心
  - 对齐到其他对象（可选，时间允许时实现）

**技术方案**:
- **直接使用 `react-konva` 的 `Transformer` 组件**，通过 `useRef` 获取引用，手动 attach 到目标节点
- 拖拽使用 `draggable` 属性（Konva 原生属性）
- 对齐功能通过计算位置实现（直接设置 `x`、`y` 属性）
- 裁切使用 `Image` 的 `crop` 属性配合 `Transformer` 调整

**Konva 原生 API 使用**:
```tsx
import { Transformer } from 'react-konva';
import { useRef, useEffect } from 'react';

const trRef = useRef<Konva.Transformer>(null);
const imageRef = useRef<Konva.Image>(null);

useEffect(() => {
  if (isSelected && trRef.current && imageRef.current) {
    trRef.current.nodes([imageRef.current]);
    trRef.current.getLayer()?.batchDraw();
  }
}, [isSelected]);

<Image ref={imageRef} draggable onDragEnd={handleDragEnd} />
{isSelected && <Transformer ref={trRef} />}
```

**API端点** (语义化控制):
```typescript
// 供 AI Agent 调用的接口
interface CanvasAPI {
  addImage(src: string, options?: PositionOptions): string; // 返回 assetId
  moveAsset(assetId: string, x: number, y: number): void;
  scaleAsset(assetId: string, scaleX: number, scaleY: number): void;
  rotateAsset(assetId: string, rotation: number): void;
  alignAsset(assetId: string, alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'): void;
  deleteAsset(assetId: string): void;
  getAssetState(assetId: string): AssetState;
  exportCanvas(format: 'png' | 'jpeg'): string; // 返回 base64
}
```

### 4. 蒙版标注功能 (Mask Annotation)

**优先级**: P0 (必须实现)

**功能点**:
- ✅ 基础标注框绘制
  - **矩形标注框**（使用 `Rect` 组件）
  - **圆形标注框**（使用 `Circle` 组件）
  - **为单个图片添加标注框**（标注框关联到特定图片）
- ✅ 标注框编辑
  - 选择标注框（点击选中）
  - 调整标注框大小和位置（使用 `Transformer`）
  - 删除标注框
- ✅ 标注框可视化（固定样式，作为 demo）
  - **固定颜色**：`stroke: '#3b82f6'`（蓝色）
  - **固定线宽**：`strokeWidth: 2`
  - **无填充**：`fill: 'transparent'` 或 `fill: ''`
  - 选中时高亮显示

**技术方案**:
- **直接使用 `react-konva` 的 `Rect` 和 `Circle` 组件**，无需自定义封装
- 使用 `Transformer` 实现标注框编辑（与图片编辑方式相同）
- 标注框数据存储为独立数组，关联到图片 ID
- 标注框与图片在同一 Layer，通过 zIndex 控制显示顺序

**数据结构**:
```typescript
interface Annotation {
  id: string;
  imageId: string; // 关联的图片 ID
  type: 'rect' | 'circle';
  x: number;
  y: number;
  width?: number; // 矩形使用
  height?: number; // 矩形使用
  radius?: number; // 圆形使用
  // 固定样式，不存储在数据中
  // stroke: '#3b82f6'
  // strokeWidth: 2
  // fill: 'transparent'
}
```

**Konva 原生 API 使用**:
```tsx
import { Rect, Circle } from 'react-konva';

// 矩形标注框
<Rect
  x={x}
  y={y}
  width={width}
  height={height}
  stroke="#3b82f6"
  strokeWidth={2}
  fill="transparent"
  draggable
/>

// 圆形标注框
<Circle
  x={x}
  y={y}
  radius={radius}
  stroke="#3b82f6"
  strokeWidth={2}
  fill="transparent"
  draggable
/>
```

### 5. 视觉反馈系统 (Visual Feedback)

**优先级**: P0 (必须实现)

**功能点**:
- ✅ 选择状态反馈
  - 选中对象高亮
  - 显示变换控制点
  - 显示对象信息（位置、尺寸等）
- ✅ 操作反馈
  - 拖拽时的实时位置显示
  - 对齐时的辅助线（可选）
  - 操作历史（撤销/重做，可选）

**技术方案**:
- 使用 `Transformer` 提供视觉反馈
- 状态管理：跟踪选中对象
- 事件系统：监听操作事件

### 6. 导出功能 (Export)

**优先级**: P0 (必须实现)

**功能点**:
- ✅ 画布导出
  - 导出为 PNG（`Stage.toDataURL({ mimeType: 'image/png' })`）
  - 导出为 JPEG（`Stage.toDataURL({ mimeType: 'image/jpeg', quality: 0.9 })`）
  - **导出为新图片**（适应 edit 图片场景，用于后续 AI 处理）
  - 支持下载导出的图片文件

**技术方案**:
- **直接使用 Konva 原生 API**：`Stage.toDataURL()` 或 `Stage.toImage()`
- 通过 `useRef` 获取 `Stage` 引用
- 导出完整画布（包含所有图层和标注）
- 处理跨域图片问题（CORS）：确保图片设置了 `crossOrigin` 属性

**Konva 原生 API 使用**:
```tsx
import { Stage } from 'react-konva';
import { useRef } from 'react';

const stageRef = useRef<Konva.Stage>(null);

const handleExport = () => {
  const dataURL = stageRef.current?.toDataURL({
    mimeType: 'image/png',
    pixelRatio: 2, // 提高导出质量
  });
  // 下载图片
  const link = document.createElement('a');
  link.download = 'edited-image.png';
  link.href = dataURL ?? '';
  link.click();
};
```

## 技术架构

### 前端技术栈
- **框架**: Next.js 14+ (App Router)
- **画布库**: `react-konva` + `konva`
- **UI组件**: shadcn/ui (Button, Toolbar等)
- **状态管理**: React Hooks (useState, useRef, useCallback)
- **样式**: Tailwind CSS

### 项目结构（简化版，优先使用原生 API）

```
src/app/workflow/konva/
├── page.tsx                    # 服务端页面组件
├── page-components.tsx        # 客户端主组件（主逻辑）
├── components/
│   └── toolbar.tsx            # 工具栏组件（上传、导出按钮等）
└── prd.md                     # 本文档
```

**设计说明**:
- **简化组件结构**：主逻辑集中在 `page-components.tsx`，直接使用 `react-konva` 组件
- **避免过度封装**：不创建 `asset-layer.tsx`、`mask-layer.tsx` 等抽象层，直接在 `page-components.tsx` 中使用 `Layer`、`Image`、`Rect`、`Circle` 等原生组件
- **减少 hooks 抽象**：状态管理直接使用 `useState`、`useRef`，不创建自定义 hooks（除非逻辑确实复杂）
- **工具函数最小化**：只在必要时创建工具函数（如导出功能），避免过度抽象

## 开发时间规划 (1小时)

### Phase 1: 基础画布搭建 (10分钟)
- [ ] 安装依赖 (`react-konva`, `konva`)
- [ ] 创建 Stage 和 Layer 结构
- [ ] 实现响应式画布尺寸
- [ ] 基础画布样式

### Phase 2: 图片加载和显示 (10分钟)
- [ ] 实现图片上传功能（文件选择器 + 拖拽）
- [ ] 使用 `useImage` hook 加载图片
- [ ] 使用 `Image` 组件显示图片（最多2张）
- [ ] 实现图片状态管理（useState）
- [ ] 支持使用示例图片（`@/components/example-image.tsx`）

### Phase 3: 拖拽和变换 (15分钟)
- [ ] 实现图片拖拽功能（`draggable` 属性 + `onDragEnd` 事件）
- [ ] 集成 `Transformer` 组件（使用 `useRef` 和 `useEffect` attach）
- [ ] 实现缩放和旋转（`onTransformEnd` 事件）
- [ ] 实现图片裁切功能（`crop` 属性）
- [ ] 选择状态管理（useState）

### Phase 4: 对齐功能 (10分钟)
- [ ] 实现基础对齐工具（左、中、右、上、下）
- [ ] 对齐到画布中心
- [ ] 工具栏 UI

### Phase 5: 标注框绘制 (10分钟)
- [ ] 实现矩形标注框绘制（`Rect` 组件，固定样式）
- [ ] 实现圆形标注框绘制（`Circle` 组件，固定样式）
- [ ] 标注框关联到图片（通过 imageId）
- [ ] 标注框选择和编辑（`Transformer`）
- [ ] 标注框可视化（固定颜色和线宽）

### Phase 6: 导出和优化 (5分钟)
- [ ] 实现画布导出功能（`Stage.toDataURL()`）
- [ ] 实现图片下载功能
- [ ] 基础错误处理
- [ ] 代码整理和注释

## 功能优先级

### MVP必须功能 (P0)
1. ✅ 基础画布系统（Stage + Layer，使用原生组件）
2. ✅ 图片加载和显示（最多2张图片，使用 `useImage` hook）
3. ✅ 拖拽和变换（缩放、旋转，使用 `draggable` 和 `Transformer`）
4. ✅ 图片裁切功能（使用 `crop` 属性）
5. ✅ 基础对齐功能（左、中、右、上、下、居中）
6. ✅ 标注框绘制（矩形、圆形，固定样式：蓝色边框，线宽2）
7. ✅ 画布导出（PNG/JPEG，使用 `Stage.toDataURL()`）

### 可选功能 (P1 - 时间允许时实现)
- 多边形蒙版
- 对齐辅助线
- 操作历史（撤销/重做）
- 对齐到其他对象
- 蒙版标签
- 导出蒙版数据

### 未来迭代 (P2)
- 高级变换（倾斜、透视）
- 滤镜效果
- 文字编辑
- 图层管理面板
- 批量操作
- AI Agent 集成示例

## 用户体验设计

### 页面布局
```
┌─────────────────────────────────────┐
│  [工具栏]                             │
│  [上传] [对齐] [蒙版] [导出]          │
├─────────────────────────────────────┤
│                                     │
│         [Konva 画布区域]            │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  [状态栏] 选中对象信息                │
└─────────────────────────────────────┘
```

### 交互流程
1. **上传图片**: 点击上传/拖拽 → 图片显示在画布中心 → 自动选中（最多2张）
2. **操作图片**: 点击选中 → 显示变换控制点 → 拖拽/缩放/旋转/裁切
3. **对齐操作**: 选中对象 → 点击对齐按钮 → 对象对齐到指定位置
4. **标注框绘制**: 选择标注工具（矩形/圆形） → 在图片上绘制 → 自动创建标注框（固定样式）
5. **导出画布**: 点击导出 → 选择格式（PNG/JPEG） → 下载编辑后的图片（用于后续 AI 处理）

## 技术约束和注意事项

### Konva 特性
- `react-konva` 需要在客户端运行（使用 "use client"）
- 图片加载需要处理异步（**推荐使用 `use-image` 库的 `useImage` hook**）
- `Transformer` 需要手动 attach 到目标节点（使用 `useRef` 和 `useEffect`）
- 导出功能需要处理跨域图片问题（CORS）：设置 `crossOrigin="anonymous"`）
- **直接使用 Konva 原生属性**：`draggable`、`x`、`y`、`width`、`height`、`rotation`、`scaleX`、`scaleY` 等
- **避免过度封装**：直接使用 `Image`、`Rect`、`Circle`、`Transformer` 等组件，通过 props 传递状态

### 性能考虑
- 大量对象时考虑使用 `Konva.Layer` 的 `listening` 属性优化
- 复杂蒙版考虑使用 `Konva.Shape` 自定义绘制
- 导出大尺寸图片时注意内存使用

### 错误处理
- 图片加载失败：显示错误提示
- 导出失败：显示错误信息
- 操作失败：回滚状态

## 成功标准

### MVP完成标准
- [ ] 用户可以上传最多2张图片到画布
- [ ] 用户可以拖拽、缩放、旋转图片
- [ ] 用户可以裁切图片
- [ ] 用户可以使用对齐工具对齐对象
- [ ] 用户可以为图片绘制矩形和圆形标注框（固定样式）
- [ ] 用户可以导出编辑后的画布为图片（PNG/JPEG）
- [ ] 所有功能基本可用，无明显 bug
- [ ] 代码使用 Konva 原生 API，便于二次开发

### 代码质量要求
- **优先使用 Konva 原生 API**，减少自定义抽象
- 组件化设计，便于二次开发
- 代码注释清晰，关键逻辑有说明
- 遵循项目代码规范
- 语义化 API 接口设计，方便 AI Agent 集成
- **保持代码简洁**：避免过度封装，直接使用 `react-konva` 组件和属性

## 语义化控制 API 设计

为方便 AI Agent 集成，提供以下语义化控制接口（可选，MVP 版本可简化）：

```typescript
// 可选：在 page-components.tsx 中直接实现函数，或创建简单的工具函数
export interface CanvasAPI {
  // 添加图片资产（最多2张）
  addImage(src: string, options?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }): string;

  // 移动资产
  moveAsset(assetId: string, x: number, y: number): void;

  // 缩放资产
  scaleAsset(assetId: string, scaleX: number, scaleY: number): void;

  // 旋转资产
  rotateAsset(assetId: string, rotation: number): void;

  // 裁切资产
  cropAsset(assetId: string, crop: { x: number; y: number; width: number; height: number }): void;

  // 对齐资产
  alignAsset(assetId: string, alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'): void;

  // 删除资产
  deleteAsset(assetId: string): void;

  // 添加标注框
  addAnnotation(imageId: string, type: 'rect' | 'circle', options: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
  }): string;

  // 导出画布
  exportCanvas(format: 'png' | 'jpeg'): Promise<string>;
}
```

**实现说明**:
- MVP 版本可以**直接在组件中实现这些功能**，不需要单独的 API 类
- 通过 `useRef` 获取 `Stage` 和节点引用，直接调用 Konva 原生方法
- 保持简单，避免过度抽象

## 参考资料

- [Konva.js 官方文档](https://konvajs.org/)
- [React Konva 文档](https://konvajs.org/docs/react/index.html)
- [Konva Transformer 文档](https://konvajs.org/docs/react/Transformer.html)
- [Konva Drag and Drop](https://konvajs.org/docs/react/Drag_And_Drop.html)
- [Konva Image 文档](https://konvajs.org/docs/shapes/Image.html)

---

## 关键功能补充说明

### 图片裁切功能

**实现方式**:
- 使用 `Konva.Image` 的 `crop` 属性
- `crop` 格式：`{ x: number, y: number, width: number, height: number }`
- 通过 `Transformer` 调整裁切区域
- 裁切后导出为新图片，用于后续 AI 处理

**示例代码**:
```tsx
<Image
  image={image}
  crop={{ x: 0, y: 0, width: 100, height: 100 }}
  // 其他属性...
/>
```

### 标注框固定样式

**Demo 固定样式**:
- **颜色**: `#3b82f6`（蓝色，Tailwind blue-500）
- **线宽**: `2`
- **填充**: `transparent` 或 `''`
- **选中时**: 使用 `Transformer` 显示控制点

**实现方式**:
- 直接在 `Rect` 和 `Circle` 组件上设置固定样式
- 不存储在数据中，减少状态管理复杂度

### 导出功能（Edit 场景）

**使用场景**:
- 用户编辑图片后，导出为新图片
- 导出的图片用于后续 AI 处理（如生图 Agent）
- 支持 PNG（无损）和 JPEG（有损，体积小）

**实现方式**:
- 使用 `Stage.toDataURL()` 获取 base64
- 支持设置 `pixelRatio` 提高导出质量
- 自动下载导出的图片文件

---

**文档版本**: v1.1  
**创建时间**: 2026-01-04  
**更新时间**: 2026-01-04


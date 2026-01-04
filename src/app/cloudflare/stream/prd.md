# Cloudflare Stream Demo - 产品需求文档 (PRD)

## 项目概述

**目标**: 在2小时内实现一个MVP级别的音视频交互demo，基于 Cloudflare Stream，聚焦前端实现，方便二次开发。

**核心需求**: 视频上传、播放、基础在线编辑（字幕、裁剪）等高交互性功能

**需要资源**

- Cloudflare Stream 会员： 5$/月

## 功能范围分析

基于 [Cloudflare Stream 文档](https://developers.cloudflare.com/stream/) 的功能分类，MVP版本聚焦以下核心功能：

### 1. 视频上传 (Uploading Videos)

**优先级**: P0 (必须实现)

**功能点**:
- ✅ 直接文件上传（< 200MB）
  - 支持拖拽上传
  - 文件选择器
  - 上传进度显示
  - 上传状态反馈（上传中/成功/失败）
- ⚠️ 可恢复上传（Resumable Uploads，可选，时间允许时实现）
  - 使用 tus 协议
  - 断点续传

**技术方案**:
- 使用 Direct Creator Upload API 生成一次性上传URL
- 前端直接POST到上传URL（不暴露API Token）
- 后端API路由：`/api/cloudflare/stream/upload-url` (生成上传URL)
- 支持的文件格式：MP4, MKV, MOV, AVI, WebM等

**API端点**:
```
POST /api/cloudflare/stream/upload-url
Body: { maxDurationSeconds: 3600 }
Response: { uploadURL: string, uid: string }
```

### 2. 视频播放 (Viewing Videos)

**优先级**: P0 (必须实现)

**功能点**:
- ✅ 视频列表展示
  - 显示视频缩略图
  - 视频基本信息（名称、时长、状态）
- ✅ 视频播放器
  - 使用 Cloudflare Stream Player 做出组件 1
  - 使用 HLS.js 做出组件 2
  - 基础播放控制（播放/暂停、进度条、音量、全屏）
  - 响应式设计，适配移动端

**技术方案**:
- 使用 `@cloudflare/stream-react` 或 `hls.js` 实现播放器
- 后端API路由：`/api/cloudflare/stream/videos` (获取视频列表)
- 视频状态：Queued → Processing → Ready

**API端点**:
```
GET /api/cloudflare/stream/videos
Response: { result: Video[], success: boolean }
```

### 3. 基础在线编辑 (Edit Videos)

#### 3.1 视频裁剪 (Video Clipping)

**优先级**: P0 (必须实现)

**功能点**:
- ✅ 可视化时间轴裁剪
  - 显示视频时间轴
  - 选择开始时间（startTimeSeconds）
  - 选择结束时间（endTimeSeconds）
  - 实时预览裁剪范围
  - 裁剪后生成新视频

**技术方案**:
- 前端：时间轴组件 + 范围选择器
- 后端API路由：`/api/cloudflare/stream/clip` (创建裁剪视频)
- 支持设置裁剪视频名称

**API端点**:
```
POST /api/cloudflare/stream/clip
Body: {
  clippedFromVideoUID: string,
  startTimeSeconds: number,
  endTimeSeconds: number,
  meta?: { name: string }
}
Response: { result: Video, success: boolean }
```

#### 3.2 字幕管理 (Captions)

**优先级**: P0 (必须实现)

**功能点**:
- ✅ 字幕列表展示
  - 显示已添加的字幕语言
  - 字幕状态（生成中/就绪/错误）
- ✅ AI生成字幕
  - 支持语言选择（中文、英文等）
  - 生成状态跟踪
- ✅ 上传字幕文件
  - 支持 WebVTT 格式
  - 文件上传和验证
- ✅ 字幕删除

**技术方案**:
- 后端API路由：
  - `POST /api/cloudflare/stream/videos/[uid]/captions/[lang]/generate` (AI生成)
  - `PUT /api/cloudflare/stream/videos/[uid]/captions/[lang]` (上传文件)
  - `GET /api/cloudflare/stream/videos/[uid]/captions` (获取字幕列表)
  - `DELETE /api/cloudflare/stream/videos/[uid]/captions/[lang]` (删除字幕)

**支持的语言**:
- 中文 (zh)
- 英文 (en)
- 日文 (ja)
- 韩文 (ko)
- 其他常用语言

## 技术架构

### 前端技术栈
- **框架**: Next.js 14+ (App Router)
- **UI组件**: shadcn/ui (Button, Card, Dialog等)
- **视频播放器**: 
  - 优先：`@cloudflare/stream-react` (官方React组件)
  - 备选：`hls.js` + 自定义播放器
- **文件上传**: 
  - 原生 Fetch API 或
  - `uppy` (如果需要更复杂功能)
- **状态管理**: React Hooks (useState, useEffect)
- **样式**: Tailwind CSS

### 后端技术栈
- **API路由**: Next.js API Routes (`/app/api`)
- **Cloudflare API**: 使用官方 REST API
- **环境变量**:
  - `CLOUDFLARE_ACCOUNT_ID`
  - `CLOUDFLARE_API_TOKEN`

### 项目结构
```
src/app/cloudflare/stream/
├── page.tsx                    # 服务端页面组件
├── page-component.tsx          # 客户端主组件
├── components/cloudflare/stream/
│   ├── video-upload.tsx        # 视频上传组件
│   ├── video-list.tsx          # 视频列表组件
│   ├── video-player.tsx        # 视频播放器组件
│   ├── video-clipper.tsx      # 视频裁剪组件
│   └── caption-manager.tsx     # 字幕管理组件
├── api/
│   └── cloudflare/
│       └── stream/
│           ├── upload-url/route.ts
│           ├── videos/route.ts
│           ├── clip/route.ts
│           └── [uid]/
│               └── captions/
│                   └── [lang]/
└── prd.md                      # 本文档
```

## 开发时间规划 (2小时)

### Phase 1: 基础架构和上传 (30分钟)
- [ ] 设置环境变量和API配置
- [ ] 创建后端API路由（上传URL生成）
- [ ] 实现视频上传组件（拖拽+文件选择）
- [ ] 上传进度和状态反馈

### Phase 2: 视频列表和播放 (40分钟)
- [ ] 创建视频列表API路由
- [ ] 实现视频列表组件（缩略图+基本信息）
- [ ] 集成视频播放器
- [ ] 播放器基础控制功能

### Phase 3: 视频裁剪 (30分钟)
- [ ] 创建裁剪API路由
- [ ] 实现时间轴组件
- [ ] 实现裁剪范围选择器
- [ ] 裁剪功能集成

### Phase 4: 字幕管理 (20分钟)
- [ ] 创建字幕相关API路由
- [ ] 实现字幕列表组件
- [ ] AI生成字幕功能
- [ ] 字幕文件上传功能

### Phase 5: 优化和测试 (剩余时间)
- [ ] UI/UX优化
- [ ] 错误处理完善
- [ ] 响应式适配
- [ ] 基础测试

## 功能优先级

### MVP必须功能 (P0)
1. ✅ 视频上传（直接上传，< 200MB）
2. ✅ 视频列表展示
3. ✅ 视频播放（基础播放控制）
4. ✅ 视频裁剪（时间范围选择）
5. ✅ 字幕管理（AI生成 + 文件上传）

### 可选功能 (P1 - 时间允许时实现)
- 可恢复上传（tus协议）
- 视频水印
- 视频下载
- 高级播放器功能（倍速、画质选择等）
- 批量操作

### 未来迭代 (P2)
- 视频分析
- 多语言字幕编辑
- 视频转码设置
- 播放统计

## 用户体验设计

### 页面布局
```
┌─────────────────────────────────────┐
│  Header: Cloudflare Stream Demo     │
├─────────────────────────────────────┤
│  [上传区域]                          │
│  ┌───────────────────────────────┐  │
│  │  拖拽上传 或 点击选择文件      │  │
│  │  上传进度: ████████░░ 80%     │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  [视频列表]                          │
│  ┌────┐ ┌────┐ ┌────┐              │
│  │缩略│ │缩略│ │缩略│              │
│  │图  │ │图  │ │图  │              │
│  └────┘ └────┘ └────┘              │
├─────────────────────────────────────┤
│  [选中视频详情]                      │
│  ┌───────────────────────────────┐  │
│  │  视频播放器                    │  │
│  │  [播放控制]                    │  │
│  ├───────────────────────────────┤  │
│  │  编辑功能:                     │  │
│  │  [裁剪] [字幕]                 │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 交互流程
1. **上传流程**: 选择文件 → 显示进度 → 上传完成 → 自动刷新列表
2. **播放流程**: 点击视频 → 打开播放器 → 播放控制
3. **裁剪流程**: 选择视频 → 打开裁剪工具 → 选择时间范围 → 确认裁剪 → 生成新视频
4. **字幕流程**: 选择视频 → 打开字幕管理 → 选择语言 → AI生成/上传文件 → 查看字幕

## 技术约束和注意事项

### API限制
- 直接上传限制：< 200MB
- 字幕文件限制：< 10MB
- 字幕格式：仅支持 WebVTT
- 视频处理时间：取决于视频长度和复杂度

### 安全考虑
- API Token 仅在后端使用，不暴露给前端
- 上传URL为一次性使用
- 考虑添加上传大小和时长限制

### 错误处理
- 上传失败：显示错误信息，允许重试
- 视频处理失败：显示状态，提供重新处理选项
- 字幕生成失败：显示错误，允许重新生成

## 成功标准

### MVP完成标准
- [ ] 用户可以上传视频文件
- [ ] 用户可以查看视频列表
- [ ] 用户可以播放视频
- [ ] 用户可以裁剪视频
- [ ] 用户可以添加和管理字幕
- [ ] 所有功能在桌面端和移动端基本可用
- [ ] 错误处理完善，用户体验流畅

### 代码质量要求
- 组件化设计，便于二次开发
- 代码注释清晰
- 遵循项目代码规范
- 响应式设计

## 参考资料

- [Cloudflare Stream 官方文档](https://developers.cloudflare.com/stream/)
- [Stream API 参考](https://developers.cloudflare.com/api/resources/stream/)
- [Direct Creator Uploads](https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/)
- [Video Clipping](https://developers.cloudflare.com/stream/edit-videos/video-clipping/)
- [Adding Captions](https://developers.cloudflare.com/stream/edit-videos/adding-captions/)

Examples

- [Examples Cloudflare Stream](https://developers.cloudflare.com/stream/examples/)
- [hls.js with Cloudflare Stream](https://developers.cloudflare.com/stream/examples/hls-js/)
- [video.js with Cloudflare Stream](https://developers.cloudflare.com/stream/examples/video-js/)

---

**文档版本**: v1.0  
**创建时间**: 2026-01-04  
**更新时间**: 2026-01-04


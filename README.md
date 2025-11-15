This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Info

Don't update pre-install component librarys. We will update them sometime

- shadcn/ui: src\components\ui
- ai-elements: src\components\ai-elements

## Architecture

### Model Management

- `src/ai/models.ts`: 集中管理 AI 模型实例
- 前端通过 modelId 选择模型
- 后端根据 modelId 动态获取模型实例

## Highlight

ChatUI that work well with useChat from ai-sdk

base on quick start from ai-element docs

- Chatgpt Clone
- Claude Clone
- Grok Clone

## Section

### Clone Chatbot

- T3 Chat
- 豆包

[ai-element demos from their github](https://github.com/vercel/ai-elements/blob/main/apps/docs/components/elements-demo.tsx)

- openai
- claude
- grok
- default (功能最完备)

### Chat with Tools

演示 AI 工具调用功能的聊天页面

- **路径**: `/chatbot-with-tools`
- **功能**:

  - 支持 weatherTool 工具调用
  - 显示工具调用参数和结果
  - 前端模型选择器（DeepSeek Chat / Reasoner）
  - 模型动态切换

- **技术实现**:
  - 使用 AI SDK 的 tools 功能
  - 集成 ai-elements/tool 组件
  - 前后端模型联动（modelId 传递）

### Agents

#### 1. reddit search agent

功能描述，根据用户提问检索 reddit 讨论，分析用户评论，得到关键见解

和使用了 praw 的 cloudflare python fastapi worker 配合

### Chat UI Components

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

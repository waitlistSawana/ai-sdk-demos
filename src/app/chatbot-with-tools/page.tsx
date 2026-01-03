import type { Metadata } from "next";
import ChatbotWithToolsPageComponent from "./page-component";

export const metadata: Metadata = {
  title: "Chatbot with Tools - AI Tool Calling Demo",
  description:
    "演示如何使用 Vercel AI SDK 实现工具调用功能，集成天气查询等实用工具",
};

export default function ChatbotWithToolsPage() {
  return <ChatbotWithToolsPageComponent />;
}

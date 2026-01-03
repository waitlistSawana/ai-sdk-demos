import type { Metadata } from "next";
import GrokChatbotPageComponent from "./page-component";

export const metadata: Metadata = {
  title: "Grok Style - AI Chatbot Clone",
  description: "Grok 风格的聊天机器人界面演示",
};

export default function GrokChatbotPage() {
  return <GrokChatbotPageComponent />;
}

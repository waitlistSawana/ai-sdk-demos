import type { Metadata } from "next";
import ChatgptChatbotPageComponent from "./page-component";

export const metadata: Metadata = {
  title: "ChatGPT Style - AI Chatbot Clone",
  description: "ChatGPT 风格的聊天机器人界面演示",
};

export default function ChatgptChatbotPage() {
  return <ChatgptChatbotPageComponent />;
}

import type { Metadata } from "next";
import ClaudeChatbotPageComponent from "./page-component";

export const metadata: Metadata = {
  title: "Claude Style - AI Chatbot Clone",
  description: "Claude 风格的聊天机器人界面演示",
};

export default function ClaudeChatbotPage() {
  return <ClaudeChatbotPageComponent />;
}

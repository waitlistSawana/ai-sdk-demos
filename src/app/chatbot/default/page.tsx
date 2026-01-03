import type { Metadata } from "next";
import DefaultChatbotPageComponent from "./page-component";

export const metadata: Metadata = {
  title: "Default Chatbot - AI SDK Demo",
  description:
    "功能最完备的聊天机器人演示，支持模型选择、消息分支、推理显示等功能",
};

export default function DefaultChatbotPage() {
  return <DefaultChatbotPageComponent />;
}

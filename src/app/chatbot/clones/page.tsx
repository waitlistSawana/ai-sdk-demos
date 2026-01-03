import type { Metadata } from "next";
import ClonesChatbotPageComponent from "./page-component";

export const metadata: Metadata = {
  title: "Chatbot Clones - Multiple Styles",
  description: "多个聊天机器人克隆演示的集合",
};

export default function ClonesChatbotPage() {
  return <ClonesChatbotPageComponent />;
}

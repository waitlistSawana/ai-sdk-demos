import type { Metadata } from "next";
import Link from "next/link";
import { ElementsDemo } from "@/components/chatbot-demo/element-demo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Chatbot Demos - Choose Your Style",
  description:
    "浏览多种风格的 AI 聊天机器人演示，包括 ChatGPT、Claude、Grok 等界面",
};

export default function ChatbotPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col">
      <h1 className="text-2xl">Select Chatbot Demos</h1>
      <div className="h-10" />
      <nav className="flex gap-3">
        <Button asChild>
          <Link href={"/chatbot/default"}>Default</Link>
        </Button>

        <Button asChild>
          <Link href={"/chatbot/chatgpt"}>Chatgpt</Link>
        </Button>
        <Button asChild>
          <Link href={"/chatbot/claude"}>Claude</Link>
        </Button>
        <Button asChild>
          <Link href={"/chatbot/grok"}>Grok</Link>
        </Button>
        <Button asChild>
          <Link href={"/chatbot/clones"}>Clone Demos</Link>
        </Button>
      </nav>

      <div className="h-10" />

      <div className="mx-auto flex w-full max-w-4xl">
        <ElementsDemo />
      </div>
    </div>
  );
}

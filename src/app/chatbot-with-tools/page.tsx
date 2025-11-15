import Link from "next/link";

// 需求：
// 1. 标准的 tools 调用的chatbot
// 2. 可以选择 avtive 的 tools 列表
// 3. 带 workflow ui

export default function ChatbotWithToolsPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col">
      <h1 className="text-2xl">Select Chatbot Demos</h1>
      <nav className="flex gap-3">
        <Link href={"/chatbot/default"}>Default</Link>
        <Link href={"/chatbot/clones"}>Clone Demos</Link>
        <Link href={"/chatbot/chatgpt"}>Chatgpt</Link>
        <Link href={"/chatbot/claude"}>Claude</Link>
        <Link href={"/chatbot/grok"}>Grok</Link>
      </nav>
    </div>
  );
}

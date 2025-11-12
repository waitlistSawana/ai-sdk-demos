import Link from "next/link";

export default function ChatbotPage() {
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

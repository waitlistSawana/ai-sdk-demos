import Link from "next/link";

export default function ChatbotPage() {
  return (
    <div className="flex max-w-4xl mx-auto flex-col">
      <h1 className="text-2xl">Select Chatbot Demos</h1>
      <nav className="flex gap-3 ">
        <Link href={"/chatbot/default"}>Default</Link>
        <Link href={"/chatbot/clones"}>Clones</Link>
      </nav>
    </div>
  );
}

"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  BarChartIcon,
  BoxIcon,
  CodeSquareIcon,
  GraduationCapIcon,
  NotepadTextIcon,
} from "lucide-react";
import { ChatUIChatGPT } from "@/components/chatbot/chatui-chatgpt";

// Default suggestions for ChatGPT style
const defaultSuggestions = [
  { icon: BarChartIcon, text: "Analyze data", color: "#76d0eb" },
  { icon: BoxIcon, text: "Surprise me", color: "#76d0eb" },
  { icon: NotepadTextIcon, text: "Summarize text", color: "#ea8444" },
  { icon: CodeSquareIcon, text: "Code", color: "#6c71ff" },
  { icon: GraduationCapIcon, text: "Get advice", color: "#76d0eb" },
  { icon: undefined, text: "More" },
];

export default function ChatGPTPageComponent() {
  const { messages, sendMessage, status, stop, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <ChatUIChatGPT
      messages={messages}
      status={status}
      onSendMessage={sendMessage}
      onStop={stop}
      onRegenerate={regenerate}
      suggestions={defaultSuggestions}
      placeholder="Ask anything"
    />
  );
}

"use client";

import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import {
  ChatUIDefault,
  type ModelConfig,
} from "@/components/chatbot/chatui-default";

const models: ModelConfig[] = [
  {
    id: "deepseek-chat",
    name: "DeepSeek Chat",
    chefSlug: "deepseek",
    providers: ["deepseek"],
  },
  {
    id: "deepseek-reasoner",
    name: "DeepSeek Reasoner",
    chefSlug: "deepseek",
    providers: ["deepseek"],
  },
];

export default function ChatbotWithToolsPageComponent({
  className,
  ...props
}: React.ComponentProps<"div"> & {
  className?: string;
}) {
  const [selectedModel, setSelectedModel] = useState(models[0].id);

  const { messages, sendMessage, status, stop, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat-with-tools",
    }),
    onFinish: (completetion) => {
      console.log(completetion);
    },
  });

  return (
    <div className="mx-auto flex h-dvh w-full max-w-4xl">
      <ChatUIDefault
        messages={messages}
        status={status}
        onSendMessage={sendMessage}
        onStop={stop}
        onRegenerate={regenerate}
        models={models}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        placeholder="Ask about the weather..."
      />
    </div>
  );
}

"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import {
  ChatUIDefault,
  type ModelConfig,
} from "@/components/chatbot/chatui-default";

// Default models configuration
const defaultModels: ModelConfig[] = [
  {
    id: "grok-2-1212",
    name: "Grok 2",
    chefSlug: "x-ai",
    providers: ["x-ai"],
  },
  {
    id: "grok-2-vision-1212",
    name: "Grok 2 Vision",
    chefSlug: "x-ai",
    providers: ["x-ai"],
  },
  {
    id: "grok-beta",
    name: "Grok Beta",
    chefSlug: "x-ai",
    providers: ["x-ai"],
  },
];

export default function DefaultPageComponent() {
  const [selectedModel, setSelectedModel] = useState(defaultModels[0].id);

  const { messages, sendMessage, status, stop, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <ChatUIDefault
      messages={messages}
      status={status}
      onSendMessage={sendMessage}
      onStop={stop}
      onRegenerate={regenerate}
      models={defaultModels}
      selectedModel={selectedModel}
      onModelChange={setSelectedModel}
      placeholder="Message..."
    />
  );
}

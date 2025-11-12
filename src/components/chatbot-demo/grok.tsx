"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { ChatUIGrok, type ModelConfig } from "@/components/chatbot/chatui-grok";

// Grok models configuration
const grokModels: ModelConfig[] = [
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

export default function GrokPageComponent() {
  const [selectedModel, setSelectedModel] = useState(grokModels[0].id);

  const { messages, sendMessage, status, stop, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <ChatUIGrok
      messages={messages}
      status={status}
      onSendMessage={sendMessage}
      onStop={stop}
      onRegenerate={regenerate}
      models={grokModels}
      selectedModel={selectedModel}
      onModelChange={setSelectedModel}
      placeholder="How can Grok help?"
    />
  );
}

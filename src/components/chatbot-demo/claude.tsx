"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import {
  ChatUIClaude,
  type ModelConfig,
} from "@/components/chatbot/chatui-claude";

// Claude models configuration
const claudeModels: ModelConfig[] = [
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    chefSlug: "anthropic",
    providers: ["anthropic", "vertex", "bedrock"],
  },
  {
    id: "claude-3-5-haiku-20241022",
    name: "Claude 3.5 Haiku",
    chefSlug: "anthropic",
    providers: ["anthropic", "vertex", "bedrock"],
  },
  {
    id: "claude-3-opus-20240229",
    name: "Claude 3 Opus",
    chefSlug: "anthropic",
    providers: ["anthropic", "vertex", "bedrock"],
  },
];

export default function ClaudePageComponent() {
  const [selectedModel, setSelectedModel] = useState(claudeModels[0].id);

  const { messages, sendMessage, status, stop, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <ChatUIClaude
      messages={messages}
      status={status}
      onSendMessage={sendMessage}
      onStop={stop}
      onRegenerate={regenerate}
      models={claudeModels}
      selectedModel={selectedModel}
      onModelChange={setSelectedModel}
      placeholder="Reply to Claude..."
    />
  );
}

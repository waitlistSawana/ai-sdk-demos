import {
  streamText,
  UIMessage,
  convertToModelMessages,
  type LanguageModel,
} from "ai";
import { deepseek } from "@ai-sdk/deepseek";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    model,
    isReasoning = true,
  }: {
    messages: UIMessage[];
    model: LanguageModel | undefined;
    isReasoning: boolean;
  } = await req.json();

  const result = streamText({
    model: model
      ? model
      : isReasoning
      ? deepseek("deepseek-reasoner")
      : deepseek("deepseek-chat"),
    messages: convertToModelMessages(messages),
    system:
      "You are a helpful assistant that can answer questions and help with tasks",
  });

  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}



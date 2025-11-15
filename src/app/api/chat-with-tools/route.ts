import { weatherTool } from "@/ai/tools/weather-tools";
import { deepseek } from "@ai-sdk/deepseek";
import {
  convertToModelMessages,
  type LanguageModel,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    model,
  }: {
    messages: UIMessage[];
    model: LanguageModel | undefined;
  } = await req.json();

  const result = streamText({
    model: model ? model : deepseek("deepseek-chat"),
    messages: convertToModelMessages(messages),
    tools: { weatherTool },
    stopWhen: stepCountIs(10),
    system:
      "You are a helpful assistant that can answer questions, call tools for questions and help with tasks",
  });

  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}

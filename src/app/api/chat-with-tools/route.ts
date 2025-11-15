import { weatherTool } from "@/ai/tools/weather-tools";
import { getModelById } from "@/ai/models";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, modelId } = await req.json();

  const model = getModelById(modelId || "deepseek-chat");

  const result = streamText({
    model,
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

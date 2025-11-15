import { deepseek } from "@ai-sdk/deepseek";
import type { LanguageModel } from "ai";

const MODEL_INSTANCES: Record<string, LanguageModel> = {
  "deepseek-chat": deepseek("deepseek-chat"),
  "deepseek-reasoner": deepseek("deepseek-reasoner"),
};

export const DEFAULT_MODEL_ID = "deepseek-chat";

export function getModelById(modelId: string): LanguageModel {
  const model = MODEL_INSTANCES[modelId];

  if (!model) {
    console.warn(
      `[models] Unknown modelId: "${modelId}", fallback to "${DEFAULT_MODEL_ID}"`,
    );
    return MODEL_INSTANCES[DEFAULT_MODEL_ID];
  }

  return model;
}

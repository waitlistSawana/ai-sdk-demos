"use client";

import type { ChatRequestOptions, ChatStatus, FileUIPart, UIMessage } from "ai";
import {
  AudioWaveformIcon,
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  FileIcon,
  ImageIcon,
  LightbulbIcon,
  PaperclipIcon,
  ScreenShareIcon,
  SearchIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ModelConfig {
  id: string;
  name: string;
  chefSlug: string;
  providers: string[];
}

export interface ChatUIGrokProps {
  /** Messages from useChat */
  messages: UIMessage[];
  /** Chat status from useChat */
  status: ChatStatus;
  /** Send message callback from useChat */
  onSendMessage: (
    message?:
      | { text: string; files?: FileList | FileUIPart[] }
      | { files: FileList | FileUIPart[] },
  ) => void | Promise<void>;
  /** Stop generation callback */
  onStop?: () => void;
  /** Regenerate last message callback */
  onRegenerate?: (
    options?: { messageId?: string } & ChatRequestOptions,
  ) => void | Promise<void>;
  /** Model selector configuration */
  models?: ModelConfig[];
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
  /** Input placeholder text */
  placeholder?: string;
  /** Additional className for root container */
  className?: string;
}

interface SourceInfo {
  url: string;
  title?: string;
}

interface ToolInfo {
  name: string;
  state:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error";
  input?: unknown;
  output?: unknown;
  errorText?: string;
}

// ============================================================================
// Helper Functions - Extract data from UIMessage.parts
// ============================================================================

function extractTextContent(message: UIMessage): string {
  return message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
}

function extractReasoning(message: UIMessage): string | undefined {
  const reasoningPart = message.parts.find((p) => p.type === "reasoning");
  return reasoningPart && reasoningPart.type === "reasoning"
    ? reasoningPart.text
    : undefined;
}

function extractSources(message: UIMessage): SourceInfo[] {
  return message.parts
    .filter((p) => p.type === "source-url")
    .map((p) =>
      p.type === "source-url"
        ? { url: p.url, title: p.title }
        : { url: "", title: "" },
    )
    .filter((s) => s.url);
}

function extractTools(message: UIMessage): ToolInfo[] {
  return message.parts
    .filter((p) => p.type === "dynamic-tool")
    .map((p) => {
      if (p.type === "dynamic-tool") {
        return {
          name: p.toolName,
          state: p.state,
          input: p.input,
          output: p.output,
          errorText: p.errorText,
        };
      }
      return {
        name: "",
        state: "input-available" as const,
        input: undefined,
      };
    });
}

function isReasoningStreaming(message: UIMessage): boolean {
  const reasoningPart = message.parts.find((p) => p.type === "reasoning");
  return reasoningPart && reasoningPart.type === "reasoning"
    ? reasoningPart.state === "streaming"
    : false;
}

function isTextComplete(message: UIMessage): boolean {
  const textParts = message.parts.filter((p) => p.type === "text");
  return textParts.every((p) => p.type === "text" && p.state !== "streaming");
}

// ============================================================================
// Main Component
// ============================================================================

export function ChatUIGrok({
  messages,
  status,
  onSendMessage,
  onStop,
  onRegenerate,
  models = [],
  selectedModel,
  onModelChange,
  placeholder = "How can Grok help?",
  className,
}: ChatUIGrokProps) {
  const [text, setText] = useState<string>("");
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const [useMicrophone, setUseMicrophone] = useState<boolean>(false);

  const selectedModelData = models.find((m) => m.id === selectedModel);

  const handleSubmit = (message: PromptInputMessage) => {
    const msg = message as { text?: string; files?: any[] };

    const hasText = Boolean(msg.text);
    const hasAttachments = Boolean(msg.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    if (msg.text) {
      onSendMessage({ text: msg.text, files: msg.files });
    } else if (msg.files) {
      onSendMessage({ files: msg.files });
    }
    setText("");
  };

  const handleFileAction = (action: string) => {
    toast.success("File action", {
      description: action,
    });
  };

  const handleBranchPrevious = () => {
    console.log("MessageBranch: previous clicked");
  };

  const handleBranchNext = () => {
    console.log("MessageBranch: next clicked");
  };

  return (
    <div
      className={cn(
        "relative flex size-full flex-col divide-y overflow-hidden bg-secondary",
        className,
      )}
    >
      <Conversation>
        <ConversationContent>
          {messages.map((message) => {
            const textContent = extractTextContent(message);
            const reasoning = extractReasoning(message);
            const sources = extractSources(message);
            const tools = extractTools(message);
            const isReasoningComplete = !isReasoningStreaming(message);

            return (
              <MessageBranch defaultBranch={0} key={message.id}>
                <MessageBranchContent>
                  <Message from={message.role} key={message.id}>
                    <div>
                      {sources.length > 0 && (
                        <Sources>
                          <SourcesTrigger count={sources.length} />
                          <SourcesContent>
                            {sources.map((source) => (
                              <Source
                                href={source.url}
                                key={source.url}
                                title={source.title || source.url}
                              />
                            ))}
                          </SourcesContent>
                        </Sources>
                      )}
                      {reasoning && (
                        <Reasoning isStreaming={isReasoningStreaming(message)}>
                          <ReasoningTrigger />
                          <ReasoningContent>{reasoning}</ReasoningContent>
                        </Reasoning>
                      )}
                      {(message.role === "user" ||
                        isReasoningComplete ||
                        !reasoning) && (
                        <MessageContent
                          className={cn(
                            "group-[.is-user]:rounded-[24px] group-[.is-user]:rounded-br-sm group-[.is-user]:border group-[.is-user]:bg-background group-[.is-user]:text-foreground",
                            "group-[.is-assistant]:bg-transparent group-[.is-assistant]:p-0 group-[.is-assistant]:text-foreground",
                          )}
                        >
                          <MessageResponse>{textContent}</MessageResponse>
                        </MessageContent>
                      )}
                    </div>
                  </Message>
                </MessageBranchContent>
                <MessageBranchSelector className="px-0" from={message.role}>
                  <MessageBranchPrevious onClick={handleBranchPrevious} />
                  <MessageBranchPage />
                  <MessageBranchNext onClick={handleBranchNext} />
                </MessageBranchSelector>
              </MessageBranch>
            );
          })}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="grid shrink-0 gap-4 p-4">
        <PromptInput
          className="divide-y-0 rounded-[28px]"
          onSubmit={handleSubmit}
        >
          <PromptInputTextarea
            className="px-5 md:text-base"
            onChange={(event) => setText(event.target.value)}
            placeholder={placeholder}
            value={text}
          />
          <PromptInputFooter className="p-2.5">
            <PromptInputTools>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <PromptInputButton
                    className="!rounded-full border font-medium"
                    variant="outline"
                  >
                    <PaperclipIcon size={16} />
                    <span>Attach</span>
                  </PromptInputButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => handleFileAction("upload-file")}
                  >
                    <FileIcon className="mr-2" size={16} />
                    Upload file
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFileAction("upload-photo")}
                  >
                    <ImageIcon className="mr-2" size={16} />
                    Upload photo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFileAction("take-screenshot")}
                  >
                    <ScreenShareIcon className="mr-2" size={16} />
                    Take screenshot
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFileAction("take-photo")}
                  >
                    <CameraIcon className="mr-2" size={16} />
                    Take photo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <PromptInputButton
                className="rounded-full border font-medium"
                onClick={() => setUseWebSearch(!useWebSearch)}
                variant="outline"
              >
                <SearchIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputButton
                className="rounded-full border font-medium"
                onClick={() => setUseMicrophone(!useMicrophone)}
                variant="outline"
              >
                <LightbulbIcon size={16} />
                <span>Fun mode</span>
              </PromptInputButton>
            </PromptInputTools>
            <div className="flex items-center gap-2">
              {models.length > 0 && onModelChange && (
                <ModelSelector
                  onOpenChange={setModelSelectorOpen}
                  open={modelSelectorOpen}
                >
                  <ModelSelectorTrigger asChild>
                    <PromptInputButton variant="ghost">
                      {selectedModelData?.chefSlug && (
                        <ModelSelectorLogo
                          provider={selectedModelData.chefSlug}
                        />
                      )}
                      {selectedModelData?.name && (
                        <ModelSelectorName>
                          {selectedModelData.name}
                        </ModelSelectorName>
                      )}
                      <ChevronDownIcon size={16} />
                    </PromptInputButton>
                  </ModelSelectorTrigger>
                  <ModelSelectorContent>
                    <ModelSelectorInput placeholder="Search models..." />
                    <ModelSelectorList>
                      <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                      <ModelSelectorGroup heading="xAI">
                        {models.map((m) => (
                          <ModelSelectorItem
                            key={m.id}
                            onSelect={() => {
                              onModelChange(m.id);
                              setModelSelectorOpen(false);
                            }}
                            value={m.id}
                          >
                            <ModelSelectorLogo provider={m.chefSlug} />
                            <ModelSelectorName>{m.name}</ModelSelectorName>
                            <ModelSelectorLogoGroup>
                              {m.providers.map((provider) => (
                                <ModelSelectorLogo
                                  key={provider}
                                  provider={provider}
                                />
                              ))}
                            </ModelSelectorLogoGroup>
                            {selectedModel === m.id ? (
                              <CheckIcon className="ml-auto size-4" />
                            ) : (
                              <div className="ml-auto size-4" />
                            )}
                          </ModelSelectorItem>
                        ))}
                      </ModelSelectorGroup>
                    </ModelSelectorList>
                  </ModelSelectorContent>
                </ModelSelector>
              )}
              <PromptInputButton
                className="rounded-full font-medium text-foreground"
                disabled={!text.trim() || status === "streaming"}
                variant="secondary"
              >
                <AudioWaveformIcon size={16} />
                <span>Voice</span>
              </PromptInputButton>
            </div>
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

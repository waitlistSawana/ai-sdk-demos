"use client";

import type {
  ChatRequestOptions,
  ChatStatus,
  FileUIPart,
  ToolUIPart,
  UIMessage,
} from "ai";
import {
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  FileIcon,
  ImageIcon,
  LightbulbIcon,
  PaperclipIcon,
  ScreenShareIcon,
  SearchIcon,
  SendIcon,
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
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
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

export interface ChatUIDefaultProps {
  /** Messages from useChat */
  messages: UIMessage[];
  /** Chat status from useChat */
  status: ChatStatus;
  /** Send message callback from useChat */
  onSendMessage: (
    message?:
      | { text: string; files?: FileList | FileUIPart[] }
      | { files: FileList | FileUIPart[] },
    options?: ChatRequestOptions,
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
  /** Additional options to pass to sendMessage */
  sendMessageOptions?: ChatRequestOptions;
}

interface SourceInfo {
  url: string;
  title?: string;
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

function extractTools(message: UIMessage): ToolUIPart[] {
  return message.parts
    .filter(
      (p) =>
        typeof p.type === "string" &&
        (p.type.startsWith("tool-") || p.type === "dynamic-tool"),
    )
    .map((p) => p as ToolUIPart);
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

export function ChatUIDefault({
  messages,
  status,
  onSendMessage,
  onStop,
  onRegenerate,
  models = [],
  selectedModel,
  onModelChange,
  placeholder = "Message...",
  className,
  sendMessageOptions,
}: ChatUIDefaultProps) {
  const [text, setText] = useState<string>("");
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const [thinkMode, setThinkMode] = useState<boolean>(false);

  const selectedModelData = models.find((m) => m.id === selectedModel);

  const handleSubmit = (message: PromptInputMessage) => {
    const msg = message as { text?: string; files?: any[] };

    const hasText = Boolean(msg.text);
    const hasAttachments = Boolean(msg.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    if (msg.text) {
      onSendMessage({ text: msg.text, files: msg.files }, sendMessageOptions);
    } else if (msg.files) {
      onSendMessage({ files: msg.files }, sendMessageOptions);
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
        "relative flex size-full flex-col divide-y overflow-hidden",
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
                      {tools.length > 0 && (
                        <div className="my-4 space-y-2">
                          {tools.map((tool, index) => (
                            <Tool key={`${message.id}-tool-${index}`}>
                              <ToolHeader
                                title={
                                  tool.type.startsWith("tool-")
                                    ? tool.type.replace("tool-", "")
                                    : tool.type
                                }
                                type={tool.type}
                                state={tool.state}
                              />
                              <ToolContent>
                                <ToolInput input={tool.input} />
                                <ToolOutput
                                  output={tool.output}
                                  errorText={tool.errorText}
                                />
                              </ToolContent>
                            </Tool>
                          ))}
                        </div>
                      )}
                      {(message.role === "user" ||
                        isReasoningComplete ||
                        !reasoning) && (
                        <MessageContent>
                          <MessageResponse>{textContent}</MessageResponse>
                        </MessageContent>
                      )}
                    </div>
                  </Message>
                </MessageBranchContent>
                <MessageBranchSelector from={message.role}>
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
      <div className="grid shrink-0 gap-4 p-2">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            onChange={(event) => setText(event.target.value)}
            placeholder={placeholder}
            value={text}
          />
          <PromptInputFooter>
            <PromptInputTools>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <PromptInputButton variant="outline">
                    <PaperclipIcon size={16} />
                    <span>Attach</span>
                  </PromptInputButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => handleFileAction("upload-file")}
                  >
                    <FileIcon size={16} />
                    Upload file
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFileAction("upload-photo")}
                  >
                    <ImageIcon size={16} />
                    Upload photo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFileAction("take-screenshot")}
                  >
                    <ScreenShareIcon size={16} />
                    Take screenshot
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFileAction("take-photo")}
                  >
                    <CameraIcon size={16} />
                    Take photo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <PromptInputButton
                onClick={() => setUseWebSearch(!useWebSearch)}
                variant="outline"
              >
                <SearchIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputButton
                onClick={() => setThinkMode(!thinkMode)}
                variant={thinkMode ? "secondary" : "outline"}
              >
                <LightbulbIcon size={16} />
                <span>Think</span>
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
                      <ModelSelectorGroup heading="Models">
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
                              <CheckIcon size={16} />
                            ) : (
                              <div className="size-4" />
                            )}
                          </ModelSelectorItem>
                        ))}
                      </ModelSelectorGroup>
                    </ModelSelectorList>
                  </ModelSelectorContent>
                </ModelSelector>
              )}
              <PromptInputButton
                type="submit"
                disabled={!text.trim() || status === "streaming"}
                variant="secondary"
              >
                <SendIcon size={16} />
                <span>Send</span>
              </PromptInputButton>
            </div>
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

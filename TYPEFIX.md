(base) PS D:\CodeProject\Nextjs\ai-sdk-demos> pnpm typecheck

> ai-sdk-demos@0.1.0 typecheck D:\CodeProject\Nextjs\ai-sdk-demos
> tsc --noEmit

src/components/ai-elements/prompt-input.tsx:709:35 - error TS2353: Object literal may only specify known properties, and 'text' does not exist in type '(message?: (Omit<never, "id" | "role"> & { id?: undefined; role?: undefined; } & { text?: undefined; files?: undefined; messageId?: string | undefined; }) | { text: string; files?: FileList | FileUIPart[] | undefined; metadata?: undefined; parts?: undefined; messageId?: string | undefined; } | { ...; } | undefined, ...'.

709         const result = onSubmit({ text, files: convertedFiles }, event);
                                      ~~~~

src/components/chatbot-demo/chatgpt.tsx:35:7 - error TS2322: Type '(message?: (Omit<UIMessage<unknown, UIDataTypes, UITools>, "id" | "role"> & { id?: string | undefined; role?: "system" | "user" | "assistant" | undefined; } & { ...; }) | { ...; } | { ...; } | undefined, options?: ChatRequestOptions | undefined) => Promise<...>' is not assignable to type '(message: { text?: string | undefined; files?: FileList | FileUIPart[] | undefined; }) => void | Promise<void>'.
  Types of parameters 'message' and 'message' are incompatible.
    Type '{ text?: string | undefined; files?: FileList | FileUIPart[] | undefined; }' is not assignable to type '(Omit<UIMessage<unknown, UIDataTypes, UITools>, "id" | "role"> & { id?: string | undefined; role?: "system" | "user" | "assistant" | undefined; } & { ...; }) | { ...; } | { ...; } | undefined'.
      Type '{ text?: string | undefined; files?: FileList | FileUIPart[] | undefined; }' is not assignable to type '(Omit<UIMessage<unknown, UIDataTypes, UITools>, "id" | "role"> & { id?: string | undefined; role?: "system" | "user" | "assistant" | undefined; } & { ...; }) | { ...; } | { ...; }'.
        Type '{ text?: string | undefined; files?: FileList | FileUIPart[] | undefined; }' is not assignable to type '{ text: string; files?: FileList | FileUIPart[] | undefined; metadata?: unknown; parts?: undefined; messageId?: string | undefined; }'.
          Types of property 'text' are incompatible.    
            Type 'string | undefined' is not assignable to type 'string'.
              Type 'undefined' is not assignable to type 'string'.

35       onSendMessage={sendMessage}
         ~~~~~~~~~~~~~

  src/components/chatbot/chatui-chatgpt.tsx:73:3        
    73   onSendMessage: (message: {
         ~~~~~~~~~~~~~
    The expected type comes from property 'onSendMessage' which is declared here on type 'IntrinsicAttributes & ChatUIChatGPTProps'

src/components/chatbot-demo/chatgpt.tsx:37:7 - error TS2322: Type '({ messageId, ...options }?: ({ messageId?: string | undefined; } & ChatRequestOptions) | undefined) => Promise<void>' is not assignable to type '(messageId?: string | undefined) => void'.
  Types of parameters '__0' and 'messageId' are incompatible.
    Type 'string | undefined' is not assignable to type '({ messageId?: string | undefined; } & ChatRequestOptions) | undefined'.
      Type 'string' has no properties in common with type '{ messageId?: string | undefined; } & ChatRequestOptions'.

37       onRegenerate={regenerate}
         ~~~~~~~~~~~~

  src/components/chatbot/chatui-chatgpt.tsx:80:3        
    80   onRegenerate?: (messageId?: string) => void;   
         ~~~~~~~~~~~~
    The expected type comes from property 'onRegenerate' which is declared here on type 'IntrinsicAttributes & ChatUIChatGPTProps'

src/components/chatbot-demo/chatgpt.tsx:38:7 - error TS2322: Type '({ icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; text: string; color: string; } | { ...; })[]' is not assignable to type '{ icon?: ComponentType<{ size?: number | undefined; style?: CSSProperties | undefined; }> | undefined; text: string; color?: string | undefined; }[]'.
  Type '{ icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; text: string; color: string; } | { ...; }' is not assignable to type '{ icon?: ComponentType<{ size?: number | undefined; style?: CSSProperties | undefined; }> | undefined; text: string; color?: string | undefined; }'.
    Type '{ icon: null; text: string; color?: undefined; }' is not assignable to type '{ icon?: ComponentType<{ size?: number | undefined; style?: CSSProperties | undefined; }> | undefined; text: string; color?: string | undefined; }'.
      Types of property 'icon' are incompatible.        
        Type 'null' is not assignable to type 'ComponentType<{ size?: number | undefined; style?: CSSProperties | undefined; }> | undefined'.

38       suggestions={defaultSuggestions}
         ~~~~~~~~~~~

  src/components/chatbot/chatui-chatgpt.tsx:82:3        
    82   suggestions?: Array<{
         ~~~~~~~~~~~
    The expected type comes from property 'suggestions' which is declared here on type 'IntrinsicAttributes & ChatUIChatGPTProps'

src/components/chatbot-demo/demo-chatgpt.tsx:541:37 - error TS2339: Property 'text' does not exist on type '(message?: (Omit<never, "id" | "role"> & { id?: undefined; role?: undefined; } & { text?: undefined; files?: undefined; messageId?: string | undefined; }) | { text: string; files?: FileList | FileUIPart[] | undefined; metadata?: undefined; parts?: undefined; messageId?: string | undefined; } | { ...; } | undefined, ...'.

541     const hasText = Boolean(message.text);
                                        ~~~~

src/components/chatbot-demo/demo-chatgpt.tsx:542:44 - error TS2339: Property 'files' does not exist on type '(message?: (Omit<never, "id" | "role"> & { id?: undefined; role?: undefined; } & { text?: undefined; files?: undefined; messageId?: string | undefined; }) | { text: string; files?: FileList | FileUIPart[] | undefined; metadata?: undefined; parts?: undefined; messageId?: string | undefined; } | { ...; } | undefined, ...'.

542     const hasAttachments = Boolean(message.files?.length);
                                               ~~~~~    

src/components/chatbot-demo/demo-chatgpt.tsx:549:28 - error TS2339: Property 'text' does not exist on type '(message?: (Omit<never, "id" | "role"> & { id?: undefined; role?: undefined; } & { text?: undefined; files?: undefined; messageId?: string | undefined; }) | { text: string; files?: FileList | FileUIPart[] | undefined; metadata?: undefined; parts?: undefined; messageId?: string | undefined; } | { ...; } | undefined, ...'.

549     addUserMessage(message.text || "Sent with attachments");
                               ~~~~

src/components/chatbot-demo/demo-claude.tsx:571:37 - error TS2339: Property 'text' does not exist on type '(message?: (Omit<never, "id" | "role"> & { id?: undefined; role?: undefined; } & { text?: undefined; files?: undefined; messageId?: string | undefined; }) | { text: string; files?: FileList | FileUIPart[] | undefined; metadata?: undefined; parts?: undefined; messageId?: string | undefined; } | { ...; } | undefined, ...'.

571     const hasText = Boolean(message.text);
                                        ~~~~

src/components/chatbot-demo/demo-claude.tsx:572:44 - error TS2339: Property 'files' does not exist on type '(message?: (Omit<never, "id" | "role"> & { id?: undefined; role?: undefined; } & { text?: undefined; files?: undefined; messageId?: string | undefined; }) | { text: string; files?: FileList | FileUIPart[] | undefined; metadata?: undefined; parts?: undefined; messageId?: string | undefined; } | { ...; } | undefined, ...'.

572     const hasAttachments = Boolean(message.files?.length);
                                               ~~~~~    

src/components/chatbot-demo/demo-claude.tsx:579:28 - error TS2339: Property 'text' does not exist on type '(message?: (Omit<never, "id" | "role"> & { id?: undefined; role?: undefined; } & { text?: undefined; files?: undefined; messageId?: string | undefined; }) | { text: string; files?: FileList | FileUIPart[] | undefined; metadata?: undefined; parts?: undefined; messageId?: string | undefined; } | { ...; } | undefined, ...'.

579     addUserMessage(message.text || "Sent with attachments");
                               ~~~~

src/components/chatbot-demo/demo-grok.tsx:565:37 - error TS2339: Property 'text' does not exist on type '(message?: (Omit<never, "id" | "role"> & { id?: undefined; role?: undefined; } & { text?: undefined; files?: undefined; messageId?: string | undefined; }) | { text: string; files?: FileList | FileUIPart[] | undefined; metadata?: undefined; parts?: undefined; messageId?: string | undefined; } | { ...; } | undefined, ...'.

565     const hasText = Boolean(message.text);
                                        ~~~~

src/components/chatbot-demo/demo-grok.tsx:566:44 - error TS2339: Property 'files' does not exist on type '(message?: (Omit<never, "id" | "role"> & { id?: undefined; role?: undefined; } & { text?: undefined; files?: undefined; messageId?: string | undefined; }) | { text: string; files?: FileList | FileUIPart[] | undefined; metadata?: undefined; parts?: undefined; messageId?: string | undefined; } | { ...; } | undefined, ...'.

566     const hasAttachments = Boolean(message.files?.length);
                                               ~~~~~    

src/components/chatbot-demo/demo-grok.tsx:573:28 - error TS2339: Property 'text' does not exist on type '(message?: (Omit<never, "id" | "role"> & { id?: undefined; role?: undefined; } & { text?: undefined; files?: undefined; messageId?: string | undefined; }) | { text: string; files?: FileList | FileUIPart[] | undefined; metadata?: undefined; parts?: undefined; messageId?: string | undefined; } | { ...; } | undefined, ...'.

573     addUserMessage(message.text || "Sent with attachments");
                               ~~~~

src/components/chatbot/chatui-chatgpt.tsx:135:3 - error TS2322: Type '({ name: any; state: "input-streaming" | "input-available" | "output-available" | "output-error"; input: unknown; result: any; } | { name: string; state: "in-progress"; input: {}; result?: undefined; })[]' is not assignable to type 'ToolInfo[]'.
  Type '{ name: any; state: "input-streaming" | "input-available" | "output-available" | "output-error"; input: unknown; result: any; } | { name: string; state: "in-progress"; input: {}; result?: undefined; }' is not assignable to type 'ToolInfo'.
    Type '{ name: any; state: "input-streaming" | "input-available" | "output-available" | "output-error"; input: unknown; result: any; }' is not assignable to type 'ToolInfo'.
      Types of property 'state' are incompatible.       
        Type '"input-streaming" | "input-available" | "output-available" | "output-error"' is not assignable to type '"input-available" | "error" | "in-progress" | "result-available"'.
          Type '"input-streaming"' is not assignable to type '"input-available" | "error" | "in-progress" | "result-available"'.

135   return message.parts
      ~~~~~~

src/components/chatbot/chatui-chatgpt.tsx:140:19 - error TS2339: Property 'toolName' does not exist on type '({ type: `tool-${string}`; } & { toolCallId: string; providerExecuted?: boolean | undefined; } & { state: "input-streaming"; input: unknown; providerExecuted?: boolean | undefined; output?: undefined; errorText?: undefined; }) | ({ ...; } & ... 1 more ... & { ...; }) | ({ ...; } & ... 1 more ... & { ...; }) | ({ ......'.
  Property 'toolName' does not exist on type '{ type: `tool-${string}`; } & { toolCallId: string; providerExecuted?: boolean | undefined; } & { state: "input-streaming"; input: unknown; providerExecuted?: boolean | undefined; output?: undefined; errorText?: undefined; }'.        

140           name: p.toolName,
                      ~~~~~~~~

src/components/chatbot/chatui-chatgpt.tsx:144:22 - error TS2339: Property 'result' does not exist on type '({ type: `tool-${string}`; } & { toolCallId: string; providerExecuted?: boolean | undefined; } & { state: "input-streaming"; input: unknown; providerExecuted?: boolean | undefined; output?: undefined; errorText?: undefined; }) | ({ ...; } & ... 1 more ... & { ...; }) | ({ ...; } & ... 1 more ... & { ...; }) | ({ ......'.
  Property 'result' does not exist on type '{ type: `tool-${string}`; } & { toolCallId: string; providerExecuted?: boolean | undefined; } & { state: "input-streaming"; input: unknown; providerExecuted?: boolean | undefined; output?: undefined; errorText?: undefined; }'.

144             typeof p.result === "string" ? p.result : JSON.stringify(p.result),
                         ~~~~~~

src/components/chatbot/chatui-chatgpt.tsx:144:46 - error TS2339: Property 'result' does not exist on type '({ type: `tool-${string}`; } & { toolCallId: string; providerExecuted?: boolean | undefined; } & { state: "input-streaming"; input: unknown; providerExecuted?: boolean | undefined; output?: undefined; errorText?: undefined; }) | ({ ...; } & ... 1 more ... & { ...; }) | ({ ...; } & ... 1 more ... & { ...; }) | ({ ......'.
  Property 'result' does not exist on type '{ type: `tool-${string}`; } & { toolCallId: string; providerExecuted?: boolean | undefined; } & { state: "input-streaming"; input: unknown; providerExecuted?: boolean | undefined; output?: undefined; errorText?: undefined; }'.

144             typeof p.result === "string" ? p.result : JSON.stringify(p.result),
                                                 ~~~~~~ 

src/components/chatbot/chatui-chatgpt.tsx:144:72 - error TS2339: Property 'result' does not exist on type '({ type: `tool-${string}`; } & { toolCallId: string; providerExecuted?: boolean | undefined; } & { state: "input-streaming"; input: unknown; providerExecuted?: boolean | undefined; output?: undefined; errorText?: undefined; }) | ({ ...; } & ... 1 more ... & { ...; }) | ({ ...; } & ... 1 more ... & { ...; }) | ({ ......'.
  Property 'result' does not exist on type '{ type: `tool-${string}`; } & { toolCallId: string; providerExecuted?: boolean | undefined; } & { state: "input-streaming"; input: unknown; providerExecuted?: boolean | undefined; output?: undefined; errorText?: undefined; }'.

144             typeof p.result === "string" ? p.result : JSON.stringify(p.result),
                                                        
                   ~~~~~~


Found 18 errors in 6 files.

Errors  Files
     1  src/components/ai-elements/prompt-input.tsx:709 
     3  src/components/chatbot-demo/chatgpt.tsx:35      
     3  src/components/chatbot-demo/demo-chatgpt.tsx:541
     3  src/components/chatbot-demo/demo-claude.tsx:571 
     3  src/components/chatbot-demo/demo-grok.tsx:565   
     5  src/components/chatbot/chatui-chatgpt.tsx:135
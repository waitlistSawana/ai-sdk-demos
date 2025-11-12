import ChatGPTExample from "@/components/chatbot-demo/demo-chatgpt";
import ClaudeExample from "@/components/chatbot-demo/demo-claude";
import GrokExample from "@/components/chatbot-demo/demo-grok";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  {
    name: "ChatGPT",
    alt: "OpenAI",
    content: <ChatGPTExample />,
  },
  {
    name: "Claude",
    alt: "Anthropic",
    content: <ClaudeExample />,
  },
  {
    name: "Grok",
    alt: "X AI",
    content: <GrokExample />,
  },
];

export const ElementsDemo = () => (
  <Tabs defaultValue={tabs[0].name} className="w-full h-screen flex flex-col">
    <TabsList>
      {tabs.map((tab) => (
        <TabsTrigger key={tab.name} value={tab.name}>
          {tab.name}
        </TabsTrigger>
      ))}
    </TabsList>
    {tabs.map((tab) => (
      // flex-1 with min-h-0 make h restric work
      // reason: flex-1 has { min-height: auto }
      <TabsContent
        className="flex-1 w-full min-h-0"
        key={tab.name}
        value={tab.name}
      >
        {tab.content}
      </TabsContent>
    ))}
  </Tabs>
);

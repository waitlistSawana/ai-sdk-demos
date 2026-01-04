import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AI SDK Demos - Vercel AI SDK Examples",
  description:
    "探索基于 Vercel AI SDK 和 AI Elements 的各种 AI 聊天机器人界面和工作流演示项目",
};

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs font-semibold text-3xl text-black leading-10 tracking-tight dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg text-zinc-600 leading-8 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="/chatbot"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Chatbots
            </a>{" "}
            or the{" "}
            <a
              href="https://ai-sdk.dev/elements"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <a href="/chatbot" className="font-medium">
              Chatbots
            </a>
          </Button>
          <Button asChild>
            <a href="/chatbot-with-tools" className="font-medium">
              Chatbot with tools
            </a>
          </Button>
          <Button asChild>
            <a href="/workflow-demo" className="font-medium">
              Workflow Demo
            </a>
          </Button>
          <Button asChild>
            <a href="/workflow/konva" className="font-medium">
              Konva Demo
            </a>
          </Button>
          {/* <Button asChild>
            <a href="/cloudflare/stream" className="font-medium">
              Stream Demo
            </a>
          </Button> */}
        </div>
        <div className="flex flex-col gap-4 font-medium text-base sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] md:w-[158px] dark:hover:bg-[#ccc]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-black/[.08] border-solid px-5 transition-colors hover:border-transparent hover:bg-black/[.04] md:w-[158px] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}

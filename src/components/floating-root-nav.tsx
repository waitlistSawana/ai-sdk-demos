"use client";

import { ChevronLeftIcon, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Panel } from "./ai-elements/panel";
import { Button } from "./ui/button";

export default function FloatingRootNav({
  className,
  ...props
}: React.ComponentProps<"div"> & {
  className?: string;
}) {
  const router = useRouter();

  return (
    <div className={cn("fixed top-1/2 right-4 z-50", className)} {...props}>
      <Panel position="center-right" className="flex flex-col gap-2">
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="cursor-pointer"
              onClick={() => router.back()}
            >
              <ChevronLeftIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go to previous page</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="cursor-pointer"
              onClick={() => router.push("/")}
            >
              <Home />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go to home page</p>
          </TooltipContent>
        </Tooltip>
      </Panel>
    </div>
  );
}

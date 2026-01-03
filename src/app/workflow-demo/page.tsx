import type { Metadata } from "next";
import WorkflowPageComponent from "./page-components";

export const metadata: Metadata = {
  title: "Workflow Demo - AI Elements Workflow Visualization",
  description:
    "基于 Vercel AI Elements 的可视化工作流演示，使用 Canvas、Node、Edge 组件构建交互式流程图",
};

export default function WorkflowPage() {
  return <WorkflowPageComponent />;
}

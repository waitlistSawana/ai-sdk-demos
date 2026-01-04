import type { Metadata } from "next";
import KonvaPageComponent from "./page-components";

export const metadata: Metadata = {
  title: "Konva Demo - AI 资产可视化画布",
  description:
    "基于 Konva.js 构建高交互的多层可视化画布，实现 AI 资产的空间操纵与精准蒙版标注",
};

export default function KonvaPage() {
  return <KonvaPageComponent />;
}


import type { Metadata } from "next";
import StreamPageComponent from "./page-component";

export const metadata: Metadata = {
  title: "Cloudflare Stream Demo - Video Upload & Playback",
  description:
    "基于 Cloudflare Stream 的音视频上传、播放和基础在线编辑功能演示",
};

export default function StreamPage() {
  return <StreamPageComponent />;
}


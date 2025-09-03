"use client"

import { Stack } from "@chakra-ui/react";
import VideoGrid from "@/components/VideoGrid";
import dynamic from "next/dynamic";

const ConnectWalletPrompt = dynamic(
  () => import("@/components/ConnectWalletPrompt"),
  { ssr: false } // client-only
);

export default function Home() {
  return (
    <Stack direction="column" gap={4} p={6}>
      <VideoGrid />
      <ConnectWalletPrompt />
    </Stack>
  );
}

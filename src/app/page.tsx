"use client"

import { Heading, Stack } from "@chakra-ui/react";
import VideoGrid from "@/components/VideoGrid";
import HomePageConnectButton from "@/components/HomePageConnectButton";
// import dynamic from "next/dynamic";

// const ConnectWalletPrompt = dynamic(
//   () => import("@/components/ConnectWalletPrompt"),
//   { ssr: false } // client-only
// );

export default function Home() {
  return (
    <Stack direction="column" gap={4} p={6}>
      <Heading size="3xl" color="green" ml={12}>Refresh browser to join live stream</Heading>
      <VideoGrid />

    </Stack>
  );
}

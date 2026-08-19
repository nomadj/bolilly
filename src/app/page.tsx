"use client"

import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import VideoGrid from "@/components/VideoGrid";
// import HomePageConnectButton from "@/components/HomePageConnectButton";
// import dynamic from "next/dynamic";

// const ConnectWalletPrompt = dynamic(
//   () => import("@/components/ConnectWalletPrompt"),
//   { ssr: false } // client-only
// );

export default function Home() {
  return (
    <Stack direction="column" gap={4} p={6}>
      <Box ml={10}>
	<Heading size="2xl" color="green">Local Talent</Heading>
      <Heading size="2xl" color="green">Live Streams</Heading>
      <Text fontSize="lg" color="orange">Next performer TBA</Text>
      </Box>
      <VideoGrid />
    </Stack>
  );
}

"use client";

import { useState } from "react";
import { FC } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

const METAMASK_DOWNLOAD = "https://metamask.io/download.html";

const ConnectWalletPrompt: FC = () => {
  const [hasMetaMask] = useState(
    typeof window !== "undefined" && (window as any).ethereum
  );
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const handleClick = async () => {
    if (!hasMetaMask) {
      // Redirect to MetaMask download
      window.open(METAMASK_DOWNLOAD, "_blank");
      return;
    }

    try {
      setConnecting(true);
      const accounts: string[] = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        const connected = accounts[0];
        setAccount(connected);
        toaster.create({
          title: "Wallet Connected",
          description: `Address: ${connected}`,
          type: "success",
          duration: 5000,
        });
      } else {
        throw new Error("No accounts returned");
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setAccount(null);
      toaster.create({
        title: "Connection Failed",
        description: "Could not connect to MetaMask",
        type: "error",
        duration: 5000,
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleThumbsUp = () => {
    console.log("👍 user clicked thumbs up");
  };

  const handleThumbsDown = () => {
    console.log("👎 user clicked thumbs down");
  };

  return (
    <Flex
      as="footer"
      width="100%"
      p={4}
      bg="gray.100"
      align="center"
      justify="center"
      mt={4}
      position="sticky"
      bottom={0}
    >
      <Box textAlign="center">
        {!hasMetaMask && (
          <Text mb={2} fontSize="lg">
            To interact with this feature, please install MetaMask.
          </Text>
        )}

        {account ? (
          <Flex gap={4} justify="center">
            <Button onClick={handleThumbsUp}>👍</Button>
            <Button onClick={handleThumbsDown}>👎</Button>
          </Flex>
        ) : (
          <Button
            colorScheme="orange"
            onClick={handleClick}
            isLoading={connecting}
          >
            {hasMetaMask ? "Connect Wallet" : "Get MetaMask"}
          </Button>
        )}
      </Box>
    </Flex>
  );
};

export default ConnectWalletPrompt;

"use client";

import { useState } from "react";
import { FC } from "react";
import { Box, Button, Flex, Text, Input } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { ethers } from "ethers";
import contractJson from "../../artifacts/contracts/BoLilly.sol/BoLilly.json" assert { type: "json" };

const METAMASK_DOWNLOAD = "https://metamask.io/download.html";

// Replace with deployed values
const CONTRACT_ADDRESS = "0xa5E820bFf4C729CF6e411C460c5D2F5855192D68";
const CONTRACT_ABI = contractJson.abi;

interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}
interface EthereumWindow extends Window {
  ethereum?: EthereumProvider;
}

const ConnectWalletPrompt: FC = () => {
  const [hasMetaMask] = useState(
    typeof window !== "undefined" && (window as EthereumWindow).ethereum !== undefined
  );
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleClick = async () => {
    if (!hasMetaMask) {
      window.open(METAMASK_DOWNLOAD, "_blank");
      return;
    }

    try {
      setConnecting(true);
      const ethereum = (window as EthereumWindow).ethereum;
      if (!ethereum) throw new Error("Ethereum provider not found");

      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts?.length > 0) {
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

  const handleMint = async () => {
    try {
      if (!account) throw new Error("No wallet connected");
      if (!file) throw new Error("No image file selected");

      // 1️⃣ Upload image + metadata via Next.js API (server-side handles Pinata keys)
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "metadata",
        JSON.stringify({
          name: "Student NFT",
          description: "Minted via ConnectWalletPrompt",
        })
      );

      const uploadRes = await fetch("/api/pinata", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload to Pinata API");
      const { metadataUri } = await uploadRes.json();

      // 2️⃣ Mint NFT using ethers
      const provider = new ethers.BrowserProvider(
        (window as EthereumWindow).ethereum as any
      );
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.mintStudent(metadataUri, { gasLimit: 500000 });
      toaster.create({
        title: "Minting...",
        description: `Transaction submitted: ${tx.hash}`,
        type: "info",
        duration: 5000,
      });

      await tx.wait();
      toaster.create({
        title: "Mint Successful",
        description: `Tx confirmed: ${tx.hash}`,
        type: "success",
        duration: 5000,
      });
    } catch (err) {
      console.error("Mint failed:", err);
      toaster.create({
        title: "Mint Failed",
        description: "Could not complete transaction",
        type: "error",
        duration: 5000,
      });
    }
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
          <Flex gap={4} justify="center" align="center" direction="column">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button onClick={handleMint}>Mint NFT</Button>
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

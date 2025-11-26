"use client";

import { useState, ChangeEvent, FC, useEffect } from "react";
import { Box, Button, Flex, Text, Input } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { ethers } from "ethers";
import { EthereumProvider } from "@/types/ethereum";
import contractJson from "../../artifacts/contracts/BoLilly.sol/BoLilly.json" assert { type: "json" };

const METAMASK_DOWNLOAD = "https://metamask.io/download.html";
const CONTRACT_ADDRESS = "0xa5E820bFf4C729CF6e411C460c5D2F5855192D68";
const CONTRACT_ABI = contractJson.abi;

const ConnectWalletPrompt: FC = () => {
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setHasMetaMask(typeof window !== "undefined" && !!window.ethereum);

    const ethereum = window.ethereum as EthereumProvider | undefined;
    if (!ethereum || !ethereum.on) return;

    const handleChainChanged = async () => {
      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const network = await provider.getNetwork();
        setNetwork(network.name);
      } catch {}
    };

    handleChainChanged();
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  const handleConnect = async () => {
    if (!hasMetaMask) {
      window.open(METAMASK_DOWNLOAD, "_blank");
      return;
    }

    try {
      setConnecting(true);
      const ethereum = window.ethereum as EthereumProvider;
      const provider = new ethers.BrowserProvider(ethereum);
      const accounts = (await provider.send("eth_requestAccounts", [])) as string[];

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        toaster.create({
          title: "Wallet Connected",
          description: `Address: ${accounts[0]}`,
          type: "success",
          duration: 5000,
        });
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleMint = async () => {
    if (!account || !file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "metadata",
        JSON.stringify({ name: "Student NFT", description: "Minted via ConnectWalletPrompt" })
      );

      const uploadRes = await fetch("/api/pinata", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Pinata upload failed");
      const { metadataUri } = (await uploadRes.json()) as { metadataUri: string };

      const ethereum = window.ethereum as EthereumProvider;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.mintStudent(metadataUri, { gasLimit: 500_000 });
      toaster.create({ title: "Minting...", description: `Tx submitted: ${tx.hash}`, type: "info", duration: 5000 });
      await tx.wait();
      toaster.create({ title: "Mint Successful", description: `Tx confirmed: ${tx.hash}`, type: "success", duration: 5000 });
    } catch (err) {
      console.error("Mint failed:", err);
      toaster.create({ title: "Mint Failed", description: "Could not complete transaction", type: "error", duration: 5000 });
    }
  };

  return (
    <Flex as="footer" width="100%" p={4} bg="gray.100" align="center" justify="center" mt={4} position="sticky" bottom={0}>
      <Box textAlign="center">
        {!hasMetaMask && <Text mb={2} fontSize="lg">Install MetaMask to use this feature.</Text>}
        {account ? (
          <Flex gap={4} direction="column" align="center">
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            <Button onClick={handleMint}>Mint NFT</Button>
          </Flex>
        ) : (
          <Button colorScheme="orange" onClick={handleConnect} loading={connecting}>
            {hasMetaMask ? "Connect Wallet" : "Get MetaMask"}
          </Button>
        )}
        {network && <Text mt={2}>Connected Network: {network}</Text>}
      </Box>
    </Flex>
  );
};

export default ConnectWalletPrompt;

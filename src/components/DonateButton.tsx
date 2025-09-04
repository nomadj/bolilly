"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, VStack, Input } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";

const CHAIN_NATIVE: Record<number, string> = {
  1: "ETH",      // Ethereum Mainnet
  137: "POL",  // Polygon
  80002: "AMOY",  // Amoy Testnet
  56: "BNB",     // BNB Chain
  43114: "AVAX", // Avalanche
  250: "FTM",    // Fantom
  42220: "CELO", // Celo
  42161: "ARB",  // Arbitrum
  10: "OP",      // Optimism
};

export default function DonateButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [native, setNative] = useState("ETH");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function detectChain() {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setNative(CHAIN_NATIVE[Number(network.chainId)] || "ETH");
    }
    detectChain();
    if (window.ethereum) {
      window.ethereum.on("chainChanged", detectChain);
    }
    return () => {
      window.ethereum?.removeListener("chainChanged", detectChain);
    };
  }, []);

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert("MetaMask not found!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      return provider.getSigner();
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  }

  async function sendTransaction() {
    const donationAddress = process.env.NEXT_PUBLIC_DONATION_ADDRESS;
    try {
      setLoading(!loading);
      console.log("Donation Address: ", donationAddress);
      const signer = await connectWallet();
      if (!signer) return;

      if (!amount || Number(amount) <= 0) {
        alert("Enter a valid amount.");
        return;
      }
      const provider = signer.provider;
      // const network = await provider.getNetwork();
      const tx = await signer.sendTransaction({
        to: donationAddress, // Bob's address
        value: ethers.parseEther(amount),

      });
      await tx.wait();
      setSuccess(true);
      toaster.create({
        title: "Donation Confirmed",
        description: `Tx Hash: ${tx.hash}`,
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
    } catch (err) {
      console.log(err);
      setSuccess(false);
      toaster.create({
	title: "Transaction Failed",
	description: "Please try again.",
	status: "error",
	duration: 9000,
	isClosable: true,
	position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <VStack gap={1} align="stretch">
      <Input
        placeholder={`$${native}`}
        type="number"
        min="0"
        step="0.0001"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button
        loading={loading}
        onClick={sendTransaction}
        // isDisabled={loading}
	loadingText="sending..."
	size="md"
	colorPalette="green"
	spinnerPlacement="start"
      >
       {success ? "Thank You ❤️" : "Donate"}
      </Button>
      <Toaster />
    </VStack>
  );
}

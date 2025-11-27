"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, VStack, Input } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";

const CHAIN_NATIVE: Record<number, string> = {
  1: "ETH",
  137: "POL",
  80002: "AMOY",
  56: "BNB",
  43114: "AVAX",
  250: "FTM",
  42220: "CELO",
  42161: "ARB",
  10: "OP",
};

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (eventName: "chainChanged" | "accountsChanged", callback: (arg: string | string[]) => void) => void;
  removeListener: (eventName: "chainChanged" | "accountsChanged", callback: (arg: string | string[]) => void) => void;
}

interface EthereumWindow extends Window {
  ethereum?: EthereumProvider;
}

export default function DonateButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [native, setNative] = useState("ETH");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const ethereum = (window as EthereumWindow).ethereum;
    if (!ethereum) return;

    const detectChain = async () => {
      const provider = new ethers.BrowserProvider(ethereum);
      const network = await provider.getNetwork();
      console.log("I AM A MOOSE: ", network.chainId)
      setNative(CHAIN_NATIVE[Number(network.chainId)] || "ETH");
    };

    detectChain();
    ethereum.on("chainChanged", detectChain);

    return () => {
      ethereum.removeListener("chainChanged", detectChain);
    };
  }, []);

  const connectWallet = async (): Promise<ethers.JsonRpcSigner | null> => {
    try {
      const ethereum = (window as EthereumWindow).ethereum;
      if (!ethereum) {
        alert("MetaMask not found!");
        return null;
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const accounts = (await provider.send("eth_requestAccounts", [])) as string[];
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        return provider.getSigner();
      }
      return null;
    } catch (err) {
      console.error("Wallet connection failed:", err);
      return null;
    }
  };

  const sendTransaction = async () => {
    const donationAddress = process.env.NEXT_PUBLIC_DONATION_ADDRESS;
    if (!donationAddress) {
      console.error("Donation address is not set in env");
      return;
    }

    try {
      setLoading(true);
      const signer = await connectWallet();
      if (!signer) return;

      if (!amount || Number(amount) <= 0) {
        alert("Enter a valid amount.");
        return;
      }

      const tx = await signer.sendTransaction({
        to: donationAddress,
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      setSuccess(true);
      toaster.create({
        title: "Donation Confirmed",
        description: `Tx Hash: ${tx.hash}`,
        duration: 9000
      });
    } catch (err) {
      console.error(err);
      setSuccess(false);
      toaster.create({
        title: "Transaction Failed",
        description: "Please try again.",
        duration: 9000
      });
    } finally {
      setLoading(false);
    }
  };

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
        loadingText="sending..."
        onClick={sendTransaction}
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

"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { Button, VStack, Input, Text } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";

// Map network chain IDs to their native coin names
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
  on: (eventName: string, callback: (...args: any[]) => void) => void;
  removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
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

  // Helper to get global window.ethereum safely
  const getEthereum = (): EthereumProvider | undefined => {
    if (typeof window !== "undefined") {
      return (window as EthereumWindow).ethereum;
    }
    return undefined;
  };

  // Detect network name dynamically
  const detectChain = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(ethereum as any);
      const network = await provider.getNetwork();
      const chainIdNum = Number(network.chainId);
      setNative(CHAIN_NATIVE[chainIdNum] || "ETH");
    } catch (err) {
      console.error("Failed to detect network chain:", err);
    }
  }, []);

  // Listen for wallet and network changes
  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
        setSuccess(false);
      }
    };

    detectChain();
    
    ethereum.on("chainChanged", detectChain);
    ethereum.on("accountsChanged", handleAccountsChanged as any);

    return () => {
      ethereum.removeListener("chainChanged", detectChain);
      ethereum.removeListener("accountsChanged", handleAccountsChanged as any);
    };
  }, [detectChain]);

  // Main logic to log into MetaMask
  const connectWallet = async (): Promise<ethers.JsonRpcSigner | null> => {
    try {
      const ethereum = getEthereum();
      if (!ethereum) {
        toaster.create({
          title: "MetaMask not found",
          description: "Please install the MetaMask extension.",
          type: "error"
        });
        return null;
      }

      const provider = new ethers.BrowserProvider(ethereum as any);
      const accounts = (await provider.send("eth_requestAccounts", [])) as string[];
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await detectChain();
        return await provider.getSigner();
      }
      return null;
    } catch (err) {
      console.error("Wallet connection failed:", err);
      return null;
    }
  };

  // Handle the donation transfer
  const sendTransaction = async () => {
    const donationAddress = process.env.NEXT_PUBLIC_DONATION_ADDRESS;
    if (!donationAddress) {
      console.error("Donation address is missing in your .env file");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toaster.create({ title: "Invalid Amount", description: "Enter a number greater than 0.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      
      // Connects automatically if not connected yet
      const signer = await connectWallet();
      if (!signer) return;

      const tx = await signer.sendTransaction({
        to: donationAddress,
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      setSuccess(true);
      setAmount(""); // Reset input field

      toaster.create({
        title: "Donation Confirmed",
        description: `Thank you! Tx: ${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}`,
        type: "success",
        duration: 9000
      });
    } catch (err) {
      console.error(err);
      setSuccess(false);
      toaster.create({
        title: "Transaction Failed",
        description: "The payment did not go through.",
        type: "error",
        duration: 9000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack gap={3} align="stretch" maxW="320px" mx="auto" mt={4}>
      {account && (
        <Text fontSize="xs" color="gray.500" textAlign="center" truncate>
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </Text>
      )}

      <Input
        placeholder={`Amount in ${native}`}
        type="number"
        min="0"
        step="0.0001"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={loading}
      />

      <Button
        loading={loading}
        loadingText="Sending..."
        onClick={sendTransaction}
        size="md"
        colorPalette="green"
      >
        {success ? "Thank You ❤️" : `Donate ${native}`}
      </Button>
      
      <Toaster />
    </VStack>
  );
}

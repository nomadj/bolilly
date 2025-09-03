"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@chakra-ui/react";

type EthereumEvent = "accountsChanged" | "chainChanged" | "disconnect" | "connect";

interface EthereumProvider {
  isMetaMask?: boolean;
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (eventName: EthereumEvent, callback: (args: unknown) => void) => void;
  removeListener?: (eventName: EthereumEvent, callback: (args: unknown) => void) => void;
}

interface EthereumWindow extends Window {
  ethereum?: EthereumProvider;
}

export default function ConnectWallet() {
  const [account, setAccount] = useState<string | null>(null);

  const connect = async () => {
    const ethereum = (window as EthereumWindow).ethereum;
    if (!ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    const provider = new ethers.BrowserProvider(ethereum);
    const accounts = (await provider.send("eth_requestAccounts", [])) as string[];
    if (accounts.length > 0) {
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    }
  };

  return (
    <Button colorScheme="teal" onClick={connect}>
      {account ? `Connected: ${account}` : "Connect Wallet"}
    </Button>
  );
}

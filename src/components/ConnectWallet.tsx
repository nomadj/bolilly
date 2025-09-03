// src/components/ConnectWallet.tsx
"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@chakra-ui/react";

export default function ConnectWallet() {
  const [account, setAccount] = useState<string | null>(null);

  const connect = async () => {
    if ((window as any).ethereum) {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());
    }
  };

  return (
    <Button colorScheme="teal" onClick={connect}>
      {account ? `Connected: ${account}` : "Connect Wallet"}
    </Button>
  );
}

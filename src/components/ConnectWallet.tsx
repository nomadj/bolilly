"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@chakra-ui/react";
import { connectWallet } from "@/lib/web3"; // reuse helper

export default function ConnectWallet() {
  const [account, setAccount] = useState<string | null>(null);

  const connect = async () => {
    const address = await connectWallet();
    if (!address) {
      alert("MetaMask is not installed or user rejected request!");
      return;
    }
    setAccount(address);
  };

  return (
    <Button colorScheme="teal" onClick={connect}>
      {account ? `Connected: ${account}` : "Connect Wallet"}
    </Button>
  );
}

// helpers/web3.ts
import { ethers } from "ethers";
import { EthereumProvider } from "@/types/ethereum";

/**
 * Get an ethers provider from MetaMask (BrowserProvider in v6)
 */
export function getProvider(): ethers.BrowserProvider | null {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum as EthereumProvider);
  }
  return null;
}

/**
 * Request wallet connection and return address
 */
export async function connectWallet(): Promise<string | null> {
  const provider = getProvider();
  if (!provider) return null;

  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  return signer.getAddress();
}

/**
 * Get signer (can send transactions)
 */
export async function getSigner(): Promise<ethers.Signer | null> {
  const provider = getProvider();
  if (!provider) return null;

  // ethers v6 pattern
  return await provider.getSigner();
}

/**
 * Create a contract instance
 * If signer is provided → write
 * If no signer → read
 */
export function getContract(
  address: string,
  abi: ethers.InterfaceAbi,
  signerOrProvider?: ethers.Signer | ethers.Provider
) {
  if (!signerOrProvider) {
    const provider = getProvider();
    if (!provider) throw new Error("No provider found");
    return new ethers.Contract(address, abi, provider);
  }

  return new ethers.Contract(address, abi, signerOrProvider);
}

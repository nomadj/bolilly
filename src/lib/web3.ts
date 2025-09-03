import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * Get an ethers provider from Metamask
 */
export function getProvider(): ethers.BrowserProvider | null {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
}

/**
 * Request user accounts from Metamask
 */
export async function connectWallet(): Promise<string | null> {
  const provider = getProvider();
  if (!provider) return null;

  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  return await signer.getAddress();
}

/**
 * Get signer for sending transactions
 */
export async function getSigner(): Promise<ethers.JsonRpcSigner | null> {
  const provider = getProvider();
  if (!provider) return null;
  return await provider.getSigner();
}

/**
 * Read a contract using ABI & address
 */
export function getContract(
  address: string,
  abi: any,
  signerOrProvider?: ethers.JsonRpcSigner | ethers.BrowserProvider
) {
  const provider = signerOrProvider || getProvider();
  if (!provider) throw new Error("No provider found");
  return new ethers.Contract(address, abi, provider);
}

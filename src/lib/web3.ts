// helpers/web3.ts
import { ethers } from "ethers";
import { EthereumProvider } from "@/types/ethereum";

/**
 * Get an ethers provider from MetaMask
 */
export function getProvider(): ethers.BrowserProvider | null {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum as EthereumProvider);
  }
  return null;
}

/**
 * Request user accounts from MetaMask
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
  abi: ethers.InterfaceAbi,
  signerOrProvider?: ethers.JsonRpcSigner | ethers.BrowserProvider
) {
  const provider = signerOrProvider || getProvider();
  if (!provider) throw new Error("No provider found");
  return new ethers.Contract(address, abi, provider);
}

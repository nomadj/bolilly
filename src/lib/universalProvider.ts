import { ethers } from "ethers";

/**
 * Get an ethers provider from MetaMask (BrowserProvider in v6)
 */
export function getProvider(): ethers.BrowserProvider | null {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    // Cast to any — MetaMask implements EIP-1193 but does not ship TS types
    return new ethers.BrowserProvider((window as any).ethereum);
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

  return await provider.getSigner();
}

/**
 * Create a contract instance
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

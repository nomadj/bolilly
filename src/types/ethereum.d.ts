// types/ethereum.d.ts
export interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (
    eventName: "chainChanged" | "accountsChanged",
    callback: (arg: string | string[]) => void
  ) => void;
  removeListener?: (
    eventName: "chainChanged" | "accountsChanged",
    callback: (arg: string | string[]) => void
  ) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

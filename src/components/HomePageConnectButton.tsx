"use client";

import { useState, useEffect } from "react";
import { Button, Checkbox, Table } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import OwnerRequestsTable from "@/components/OwnerRequestsTable";
import { getProvider, getSigner, getContract } from "@/lib/universalProvider";
import BoLillyArtifact from "../../artifacts/contracts/BoLilly.sol/BoLilly.json" assert { type: "json" };
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

// --------------------------------------------------
// Contract read helpers
// --------------------------------------------------

async function fetchApprovalResult(addr: string) {
  const provider = getProvider();
  if (!provider) return "none";

  const contract = getContract(CONTRACT_ADDRESS, BoLillyArtifact.abi, provider);

  if (await contract.isApprovedStudent(addr)) return "approved";
  if (await contract.isDenied(addr)) return "denied";
  return "none";
}

async function userHasToken(addr: string): Promise<boolean> {
  const provider = getProvider();
  if (!provider) return false;

  const contract = getContract(CONTRACT_ADDRESS, BoLillyArtifact.abi, provider);
  const balance = await contract.balanceOf(addr);
  return balance > 0;
}

async function userRequestStatus(addr: string): Promise<"none" | "pending"> {
  const provider = getProvider();
  if (!provider) return "none";

  const contract = getContract(CONTRACT_ADDRESS, BoLillyArtifact.abi, provider);
  const requested = await contract.hasRequested(addr);
  return requested ? "pending" : "none";
}

async function isOwner(addr: string): Promise<boolean> {
  const provider = getProvider();
  if (!provider) return false;

  const contract = getContract(CONTRACT_ADDRESS, BoLillyArtifact.abi, provider);
  const owner = await contract.owner();
  return owner.toLowerCase() === addr.toLowerCase();
}

async function fetchPendingRequests(): Promise<string[]> {
  try {
    const provider = getProvider();
    if (!provider) throw new Error("No Ethereum provider");

    const contract = getContract(CONTRACT_ADDRESS, BoLillyArtifact.abi, provider);
    const result = await contract.getPendingRequests();

    // Handle array or BigNumber count
    if (Array.isArray(result)) return result;
    return []; // fallback if not array
  } catch (err: any) {
    toaster.create({
      title: "Error Fetching Pending Requests",
      description: err?.message || "Something went wrong",
      status: "error",
    });
    return [];
  }
}

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function HomePageConnectButton() {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const [hasToken, setHasToken] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"none" | "pending">("none");
  const [approvalResult, setApprovalResult] = useState<"none" | "approved" | "denied">("none");
  const [owner, setOwner] = useState(false);

  // Owner state
  const [requests, setRequests] = useState<string[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const connectWallet = async () => {
    setLoading(true);
    try {
      const provider = getProvider();
      if (!provider) throw new Error("No Ethereum provider found");

      const accounts = await provider.send("eth_requestAccounts", []);
      if (!accounts || accounts.length === 0) throw new Error("No accounts found");

      const addr = accounts[0];
      setAddress(addr);

      const [_hasToken, _reqStatus, _isOwner] = await Promise.all([
        userHasToken(addr),
        userRequestStatus(addr),
        isOwner(addr),
      ]);

      setHasToken(_hasToken);
      setRequestStatus(_reqStatus);
      setOwner(_isOwner);
      const status = await fetchApprovalResult(addr);
      setApprovalResult(status);

      if (_isOwner) {
        const pending = await fetchPendingRequests();
        setRequests(pending);

        // Initialize checked state
        const initChecked: Record<string, boolean> = {};
        pending.forEach(addr => (initChecked[addr] = false));
        setChecked(initChecked);
      }

      toaster.create({
        title: "Wallet Connected",
        description: `Connected as ${addr}`,
      });
    } catch (err: any) {
      toaster.create({
        title: "Error Connecting Wallet",
        description: err?.message || "Something went wrong",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const requestToBecomeStudent = async () => {
    setLoading(true);
    try {
      const signer = await getSigner();
      if (!signer) throw new Error("No signer available");

      const contract = getContract(CONTRACT_ADDRESS, BoLillyArtifact.abi, signer);
      const tx = await contract.requestToBecomeStudent({
        value: "1000000000000000000", // 1 ETH
      });
      await tx.wait();

      toaster.create({
        title: "Request Sent",
        description: "Your request is now pending.",
      });

      setRequestStatus("pending");
    } catch (err: any) {
      toaster.create({
        title: "Transaction Failed",
        description: err?.message || "Something went wrong",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (addr: string) => {
    setChecked(prev => ({ ...prev, [addr]: !prev[addr] }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const signer = await getSigner();
      if (!signer) throw new Error("No signer available");

      const contract = getContract(CONTRACT_ADDRESS, BoLillyArtifact.abi, signer);

      const approveList = requests.filter(addr => checked[addr]);
      const denyList = requests.filter(addr => !checked[addr]);

      for (const addr of approveList) {
        const tx = await contract.approveStudent(addr);
        await tx.wait();
      }

      for (const addr of denyList) {
        const tx = await contract.denyStudent(addr);
        await tx.wait();
      }

      toaster.create({
        title: "Requests Processed",
        description: `Approved ${approveList.length}, Denied ${denyList.length}`,
      });

      // Refresh requests
      const pending = await fetchPendingRequests();
      setRequests(pending);
      const initChecked: Record<string, boolean> = {};
      pending.forEach(addr => (initChecked[addr] = false));
      setChecked(initChecked);
    } catch (err: any) {
      toaster.create({
        title: "Transaction Failed",
        description: err?.message || "Something went wrong",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Button label logic for non-owners
  // --------------------------------------------------
  const getButtonLabel = () => {
    if (!address) return "Connect Wallet";
    if (hasToken) return "Go To Your Page";

    if (approvalResult === "denied") return "🙅🏻‍♀️";
    if (approvalResult === "approved") return "🤙🏽 Approved! Click to mint access token";

    if (requestStatus === "pending") return "Request Pending";

    return "Become a Student";
  };


  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  if (owner) {
    // Owner view: show requests table
    return (
      <>
        <div style={{ textAlign: "center" }}>
          {loading && <p>Loading...</p>}
          {!loading && requests.length === 0 && (
            <Button size="lg" w="max-content" colorPalette="gray" disabled>
              No Pending Requests
            </Button>
          )}
          {!loading && requests.length > 0 && (
	    <OwnerRequestsTable
	      requests={requests}
	      approveStudent={async (addr: string) => {
		const signer = await getSigner();
		const contract = getContract(CONTRACT_ADDRESS, BoLillyArtifact.abi, signer);
		const tx = await contract.approveStudent(addr);
		await tx.wait();

		// refresh requests
		const updated = await fetchPendingRequests();
		setRequests(updated);
	      }}
	      denyStudent={async (addr: string) => {
		const signer = await getSigner();
		const contract = getContract(CONTRACT_ADDRESS, BoLillyArtifact.abi, signer);
		const tx = await contract.denyStudent(addr);
		await tx.wait();

		// refresh requests
		const updated = await fetchPendingRequests();
		setRequests(updated);
	      }}
	    />
          )}
        </div>
        <Toaster />
      </>
    );
  }

  // Non-owner view: regular button
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Button
	  size="lg"
	  w="max-content"
	  loading={loading}
	  loadingText="Processing..."
	  disabled={approvalResult === "denied"}
	  onClick={
	    approvalResult === "approved"
	      ? () => {/* mint token here */}
	      : !address
		? connectWallet
		: requestStatus === "none"
		  ? requestToBecomeStudent
		  : () => {}
	  }
	  colorPalette="green"
	>
	  {getButtonLabel()}
	</Button>
      </div>
      <Toaster />
    </>
  );
}

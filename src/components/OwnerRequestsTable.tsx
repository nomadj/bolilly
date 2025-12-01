import { useState } from "react";
import { Button, Table } from "@chakra-ui/react";
import { toaster, Toaster } from "@/components/ui/toaster";

interface Props {
  requests: string[];
  approveStudent: (addr: string) => Promise<void>;
  denyStudent: (addr: string) => Promise<void>;
}

export default function OwnerRequestsTable({ requests = [], approveStudent, denyStudent }: Props) {
  const [loadingAddresses, setLoadingAddresses] = useState<{ [addr: string]: boolean }>({});

  const handleAction = async (addr: string, action: "approve" | "deny") => {
    setLoadingAddresses(prev => ({ ...prev, [addr]: true }));
    try {
      if (action === "approve") {
        await approveStudent(addr);
        toaster.create({ title: "Approved", description: `${addr} approved.` });
      } else {
        await denyStudent(addr);
        toaster.create({ title: "Denied", description: `${addr} denied.` });
      }
    } catch (err: any) {
      toaster.create({ title: "Error", description: err?.message || "Something went wrong" });
    } finally {
      setLoadingAddresses(prev => ({ ...prev, [addr]: false }));
    }
  };

  return (
    <>
      <Table.Root
        variant="line"
        size="sm"
        style={{ margin: "0 auto", border: "1px solid gray", width: "max-content" }}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Address</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {requests.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={2} style={{ textAlign: "center" }}>
                No Pending Requests
              </Table.Cell>
            </Table.Row>
          ) : (
            requests.map(addr => (
              <Table.Row key={addr}>
                <Table.Cell>{addr}</Table.Cell>
                <Table.Cell>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button
                      size="sm"
                      colorPalette="green"
                      loading={loadingAddresses[addr] || false}
                      onClick={() => handleAction(addr, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      colorPalette="red"
                      loading={loadingAddresses[addr] || false}
                      onClick={() => handleAction(addr, "deny")}
                    >
                      Deny
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      <Toaster />
    </>
  );
}

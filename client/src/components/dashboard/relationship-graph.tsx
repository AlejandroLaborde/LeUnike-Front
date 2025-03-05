import { ResponsiveNetwork } from "@nivo/network";
import { useQuery } from "@tanstack/react-query";
import { Customer, Vendor, VendorCustomer } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface NetworkData {
  nodes: Array<{
    id: string;
    size: number;
    color: string;
    data: {
      type: "vendor" | "customer";
      name: string;
    };
  }>;
  links: Array<{
    source: string;
    target: string;
    distance: number;
  }>;
}

export function RelationshipGraph() {
  const { data: vendors, isLoading: vendorsLoading } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const { data: customers, isLoading: customersLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: relationships, isLoading: relationshipsLoading } = useQuery<VendorCustomer[]>({
    queryKey: ["/api/vendor-customers"],
  });

  if (vendorsLoading || customersLoading || relationshipsLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!vendors || !customers || !relationships) {
    return null;
  }

  const networkData: NetworkData = {
    nodes: [
      ...vendors.map((vendor) => ({
        id: `vendor-${vendor.id}`,
        size: 16,
        color: "#2563eb", // blue-600
        data: {
          type: "vendor" as const,
          name: vendor.name,
        },
      })),
      ...customers.map((customer) => ({
        id: `customer-${customer.id}`,
        size: 12,
        color: "#16a34a", // green-600
        data: {
          type: "customer" as const,
          name: customer.name,
        },
      })),
    ],
    links: relationships.map((rel) => ({
      source: `vendor-${rel.vendorId}`,
      target: `customer-${rel.customerId}`,
      distance: 80,
    })),
  };

  return (
    <div className="h-[400px] border rounded-lg">
      <ResponsiveNetwork
        data={networkData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        linkDistance={(e) => e.distance}
        centeringStrength={0.3}
        repulsivity={6}
        nodeSize={(n) => n.size}
        activeNodeSize={(n) => n.size * 1.2}
        nodeColor={(n) => n.color}
        nodeBorderWidth={1}
        nodeBorderColor={{
          from: "color",
          modifiers: [["darker", 0.8]],
        }}
        linkThickness={2}
        linkBlendMode="multiply"
        motionConfig="gentle"
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: -40,
            translateY: -40,
            itemWidth: 100,
            itemHeight: 20,
            itemsSpacing: 2,
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
            data: [
              {
                label: "Vendors",
                color: "#2563eb",
              },
              {
                label: "Customers",
                color: "#16a34a",
              },
            ],
          },
        ]}
      />
    </div>
  );
}

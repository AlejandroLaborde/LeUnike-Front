import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface WhatsAppStatus {
  connected: boolean;
}

interface WhatsAppQR {
  qrCode: string;
}

export function WhatsAppQRScanner() {
  const { data: qrCode, refetch, isLoading } = useQuery<WhatsAppQR>({
    queryKey: ["/api/whatsapp/qr"],
  });

  const { data: status } = useQuery<WhatsAppStatus>({
    queryKey: ["/api/whatsapp/status"],
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            status?.connected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-sm">
          {status?.connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {!status?.connected && qrCode?.qrCode && (
        <div className="flex justify-center">
          <img
            src={`data:image/png;base64,${qrCode.qrCode}`}
            alt="WhatsApp QR Code"
            className="max-w-[200px]"
          />
        </div>
      )}

      <Button
        variant="outline"
        className="w-full"
        onClick={() => refetch()}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4 mr-2" />
        )}
        Refresh QR Code
      </Button>
    </div>
  );
}
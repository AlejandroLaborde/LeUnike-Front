import { useQuery, useMutation } from "@tanstack/react-query";
import { type Order } from "@shared/schema";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { OrderForm } from "@/components/order/order-form";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EyeIcon } from "@heroicons/react/24/solid";


export default function Orders() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/orders", data);
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Order created successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to create order", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/orders/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Order status updated" });
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Orders</h1>
            <p className="text-muted-foreground">Track and manage customer orders</p>
          </div>

          {user?.role === "vendor" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Order
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                </DialogHeader>
                <OrderForm 
                  onSubmit={(data) => createOrderMutation.mutate(data)}
                  isSubmitting={createOrderMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    {order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : "N/A"}
                  </TableCell>
                  <TableCell>Vendor {order.vendorId}</TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={order.status}
                      onValueChange={(status) =>
                        updateStatusMutation.mutate({ id: order.id, status })
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Detalles del Pedido #{order.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Cliente</h4>
                              <p className="text-base">{order.customerName}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Fecha</h4>
                              <p className="text-base">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Estado</h4>
                              <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${
                                  order.status === "completed" 
                                    ? "bg-green-500" 
                                    : order.status === "processing" 
                                      ? "bg-blue-500" 
                                      : "bg-yellow-500"
                                }`}/>
                                <span className="capitalize">{order.status}</span>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Total</h4>
                              <p className="text-base font-medium">${parseFloat(order.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Productos</h4>
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="text-right">Cant.</TableHead>
                                    <TableHead className="text-right">Precio</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {/* Simulamos algunos items */}
                                  <TableRow>
                                    <TableCell>Producto {Math.floor(Math.random() * 100)}</TableCell>
                                    <TableCell className="text-right">2</TableCell>
                                    <TableCell className="text-right">$5,000.00</TableCell>
                                    <TableCell className="text-right">$10,000.00</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Producto {Math.floor(Math.random() * 100)}</TableCell>
                                    <TableCell className="text-right">1</TableCell>
                                    <TableCell className="text-right">$8,500.00</TableCell>
                                    <TableCell className="text-right">$8,500.00</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Información de Envío</h4>
                            <div className="rounded-md border p-3 bg-muted/50">
                              <p className="text-sm">Dirección: {order.customerName} - Av. Ejemplo 123, Ciudad</p>
                              <p className="text-sm">Método: Envío a domicilio</p>
                              <p className="text-sm">Notas: {order.notes || "Sin notas adicionales"}</p>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              toast({
                                title: "Pedido actualizado",
                                description: "El estado del pedido se ha actualizado correctamente",
                              });
                            }}
                          >
                            Actualizar Estado
                          </Button>
                          <Button>Imprimir Detalle</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
}
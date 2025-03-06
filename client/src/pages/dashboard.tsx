
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { WhatsAppQRScanner } from "@/components/whatsapp/qr-scanner";
import { RelationshipGraph } from "@/components/dashboard/relationship-graph";
import { useQuery } from "@tanstack/react-query";
import { type Product, type Vendor, type Order } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: vendors } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  // Calculate total revenue from orders
  const totalRevenue = orders?.reduce((sum, order) => 
    sum + parseFloat(order.total), 0
  ) || 0;

  // Calculate additional metrics
  const pendingOrders = orders?.filter(order => order.status === "pending").length || 0;
  const completedOrders = orders?.filter(order => order.status === "completed").length || 0;
  const pendingPercentage = orders?.length ? (pendingOrders / orders.length) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your Le Unike admin dashboard
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {products?.length ? "Active products in inventory" : "No products available"}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendors?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {vendors?.length ? "Registered vendor accounts" : "No vendors registered"}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders?.length || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>Pending: {pendingOrders}</span>
                <CheckCircle className="h-3 w-3 ml-2 mr-1" />
                <span>Completed: {completedOrders}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>From {orders?.length || 0} orders</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending</span>
                  <span className="text-sm text-muted-foreground">{pendingOrders} orders</span>
                </div>
                <Progress value={pendingPercentage} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completed</span>
                  <span className="text-sm text-muted-foreground">{completedOrders} orders</span>
                </div>
                <Progress value={orders?.length ? (completedOrders / orders.length) * 100 : 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <WhatsAppQRScanner />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer-Vendor Network</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <RelationshipGraph />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

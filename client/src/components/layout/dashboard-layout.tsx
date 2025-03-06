import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart,
  LogOut,
  UserSquare2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: Package },
    { name: "Vendors", href: "/vendors", icon: Users },
    { name: "Customers", href: "/customers", icon: UserSquare2 },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Reports", href: "/reports", icon: BarChart },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border">
        <div className="h-16 flex items-center px-4 gap-2">
          <img src="/leunike-logo.jpg" alt="Le Unike Logo" className="h-10 w-auto object-contain" />
          <h1 className="text-xl font-bold text-sidebar-foreground">Le Unike Admin</h1>
        </div>
        <Separator className="bg-sidebar-border" />
        <nav className="flex flex-col gap-1 p-2">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={location === item.href ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sidebar-foreground">{user?.username}</p>
              <p className="text-sm text-sidebar-foreground/60">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen bg-background">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
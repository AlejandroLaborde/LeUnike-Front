
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "wouter";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/10">
      <div className="container mx-auto px-4 py-12">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <img
              src="/logo-unike.jpg"
              alt="Le Unike Logo"
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-2xl font-bold">Le Unike</h1>
          </div>
          <div>
            {user ? (
              <Button onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            ) : (
              <Button onClick={() => navigate("/login")}>Login</Button>
            )}
          </div>
        </header>
        <main className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Admin Portal for Le Unike
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Manage your products, vendors, and track sales with our integrated
              WhatsApp-enabled platform.
            </p>
            <div className="space-x-4">
              {user ? (
                <Button size="lg" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              ) : (
                <Button size="lg" onClick={() => navigate("/login")}>
                  Get Started
                </Button>
              )}
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 bg-grid-8" />
            <div className="relative">
              <h3 className="text-2xl font-semibold mb-4">
                Key Features
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Product catalog management</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Vendor relationship tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Customer database</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Order management</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>WhatsApp integration</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Sales reports and analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

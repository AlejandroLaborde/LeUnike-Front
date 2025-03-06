
import { useEffect } from "react";
import { useNavigate } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

import { Redirect } from "wouter";

export default function LandingPage() {
  return <Redirect to="/dashboard" />;
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/leunike-logo.jpg" alt="Le Unike Logo" className="h-10 w-auto object-contain" />
          <h1 className="text-xl font-bold">Le Unike</h1>
        </div>
        <div>
          <Button onClick={() => navigate("/login")} variant="outline" className="mr-2">
            Login
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gestión integral para Le Unike</h1>
          <p className="text-xl text-muted-foreground">
            La plataforma que simplifica la administración de inventario, proveedores, clientes y pedidos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card rounded-lg shadow-sm p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                <path d="M5 8h14"></path>
                <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                <path d="M6 2v3"></path>
                <path d="M18 2v3"></path>
                <circle cx="10" cy="12" r="2"></circle>
                <path d="M10 12h8"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Gestión de Inventario</h3>
            <p className="text-muted-foreground">Administre fácilmente sus productos, controle stock y precios en un solo lugar.</p>
          </div>

          <div className="bg-card rounded-lg shadow-sm p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Proveedores y Clientes</h3>
            <p className="text-muted-foreground">Relaciones claras entre proveedores y clientes para una operación eficiente.</p>
          </div>

          <div className="bg-card rounded-lg shadow-sm p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Pedidos en Tiempo Real</h3>
            <p className="text-muted-foreground">Seguimiento de pedidos en tiempo real con integración de WhatsApp para notificaciones.</p>
          </div>
        </div>

        <div className="text-center">
          <Button onClick={() => navigate("/login")} size="lg" className="px-8">
            Comenzar ahora
          </Button>
        </div>
      </main>

      <footer className="bg-card border-t mt-20 py-8">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Le Unike. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

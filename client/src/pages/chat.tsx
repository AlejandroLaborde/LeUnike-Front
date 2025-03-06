
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { ChatInterface } from "@/components/chat/chat-interface";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  lastMessage?: {
    body: string;
    timestamp: string;
  };
};

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignedCustomers, setAssignedCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchAssignedCustomers();
  }, []);

  const fetchAssignedCustomers = async () => {
    try {
      setLoading(true);
      // Obtener el ID del vendedor a partir del usuario autenticado
      // Esto dependerá de tu estructura específica
      const vendorResponse = await fetch(`/api/vendors?userId=${user?.id}`);
      if (!vendorResponse.ok) throw new Error("Error al obtener información del vendedor");
      
      const vendorData = await vendorResponse.json();
      if (!vendorData.length) {
        toast({
          title: "Información",
          description: "No se encontró un perfil de vendedor asociado a tu cuenta",
        });
        setLoading(false);
        return;
      }
      
      const vendorId = vendorData[0].id;
      
      // Obtener clientes asignados al vendedor
      const customersResponse = await fetch(`/api/vendors/${vendorId}/customers`);
      if (!customersResponse.ok) throw new Error("Error al obtener clientes asignados");
      
      const customerRelations = await customersResponse.json();
      
      // Para cada relación, obtener detalles del cliente
      const customerPromises = customerRelations.map(async (relation: any) => {
        const customerResponse = await fetch(`/api/customers/${relation.customerId}`);
        if (!customerResponse.ok) return null;
        
        return customerResponse.json();
      });
      
      const customers = (await Promise.all(customerPromises)).filter(Boolean);
      
      // Asignar un último mensaje ficticio (esto debería venir de la API de mensajes)
      const enhancedCustomers = customers.map((customer: Customer) => ({
        ...customer,
        phone: customer.phone || "+5491155555555", // Valor predeterminado si falta
        lastMessage: {
          body: "Haga clic para ver la conversación",
          timestamp: new Date().toISOString()
        }
      }));
      
      setAssignedCustomers(enhancedCustomers);
      
      // Seleccionar el primer cliente automáticamente si no hay uno seleccionado
      if (enhancedCustomers.length > 0 && !selectedCustomer) {
        setSelectedCustomer(enhancedCustomers[0]);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes asignados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = assignedCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <DashboardLayout>
      <div className="grid gap-4 h-[calc(100vh-80px)]">
        <CardHeader className="px-0 py-3">
          <CardTitle>Centro de Mensajes</CardTitle>
          <CardDescription>
            Gestiona tus conversaciones con clientes
          </CardDescription>
        </CardHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* Lista de Clientes */}
          <Card className="lg:col-span-1 h-full flex flex-col">
            <CardHeader className="border-b p-3">
              <div className="space-y-2">
                <CardTitle className="text-lg">Clientes Asignados</CardTitle>
                <Input
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <ScrollArea className="h-full">
                {loading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full border-2 border-current border-t-transparent text-primary h-6 w-6"></div>
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="text-center p-6 text-muted-foreground">
                    {searchTerm ? "No se encontraron clientes" : "No tienes clientes asignados"}
                  </div>
                ) : (
                  <div>
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                        className={`p-3 flex items-center gap-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedCustomer?.id === customer.id ? "bg-primary/5" : ""
                        }`}
                      >
                        <Avatar>
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                            {customer.name?.charAt(0) || "?"}
                          </div>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h4 className="font-medium truncate">{customer.name}</h4>
                            <span className="text-xs text-muted-foreground">
                              {customer.lastMessage?.timestamp
                                ? new Date(customer.lastMessage.timestamp).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {customer.lastMessage?.body || "Sin mensajes"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Interfaz de Chat */}
          <Card className="lg:col-span-2 h-full flex flex-col">
            <CardContent className="p-0 h-full">
              {selectedCustomer ? (
                <ChatInterface
                  customerId={selectedCustomer.id}
                  customerPhone={selectedCustomer.phone}
                  customerName={selectedCustomer.name}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="bg-primary/10 p-6 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Centro de Mensajes Le Unike</h3>
                  <p className="text-muted-foreground max-w-md">
                    Selecciona un cliente para ver y enviar mensajes. Todas las conversaciones están sincronizadas con WhatsApp.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

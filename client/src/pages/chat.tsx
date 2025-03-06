
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
import { Search } from "lucide-react";

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
      
      // Simular carga de datos para demo
      setTimeout(() => {
        const mockCustomers: Customer[] = [
          {
            id: 1,
            name: "Elena Martínez",
            phone: "5491145678901",
            email: "elena@example.com",
            address: "Av. Corrientes 1234, CABA",
            lastMessage: {
              body: "Gracias por la información del producto",
              timestamp: new Date(Date.now() - 1800000).toISOString()
            }
          },
          {
            id: 2,
            name: "Carlos López",
            phone: "5491156789012",
            email: "carlos@example.com",
            address: "Calle Florida 567, CABA",
            lastMessage: {
              body: "¿Cuándo llega mi pedido?",
              timestamp: new Date(Date.now() - 3600000).toISOString()
            }
          },
          {
            id: 3,
            name: "María González",
            phone: "5491167890123",
            email: "maria@example.com",
            address: "Av. Santa Fe 890, CABA",
            lastMessage: {
              body: "Me interesa el catálogo de verano",
              timestamp: new Date(Date.now() - 86400000).toISOString()
            }
          },
          {
            id: 4,
            name: "Javier Rodríguez",
            phone: "5491178901234",
            email: "javier@example.com",
            address: "Calle Lavalle 123, CABA"
          },
          {
            id: 5,
            name: "Ana Fernández",
            phone: "5491189012345",
            email: "ana@example.com",
            address: "Av. de Mayo 456, CABA",
            lastMessage: {
              body: "Necesito hacer un cambio de mi compra",
              timestamp: new Date(Date.now() - 172800000).toISOString()
            }
          }
        ];
        
        setAssignedCustomers(mockCustomers);
        setLoading(false);
      }, 1000);
      
      // En producción, descomentar esto:
      // const response = await fetch("/api/customers/assigned");
      // const data = await response.json();
      // setAssignedCustomers(data);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes asignados.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const filteredCustomers = assignedCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  // Formatear la fecha del último mensaje
  const formatLastMessageTime = (timestamp: string) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return "Ayer";
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Mensajería WhatsApp</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
            {/* Lista de Clientes */}
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle>Clientes Asignados</CardTitle>
                <CardDescription>Selecciona un cliente para chatear</CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                  <Input
                    placeholder="Buscar cliente..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  {loading ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredCustomers.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <p className="text-muted-foreground">No hay clientes que coincidan con tu búsqueda</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredCustomers.map((customer) => (
                        <div 
                          key={customer.id}
                          className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors ${selectedCustomer?.id === customer.id ? 'bg-accent' : ''}`}
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Avatar className="h-10 w-10">
                            <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center font-medium text-lg">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium truncate">{customer.name}</h4>
                              {customer.lastMessage && (
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatLastMessageTime(customer.lastMessage.timestamp)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {customer.lastMessage ? customer.lastMessage.body : "No hay mensajes aún"}
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
      </div>
    </DashboardLayout>
  );
}

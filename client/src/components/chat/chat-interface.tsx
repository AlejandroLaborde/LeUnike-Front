
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Send } from "lucide-react";

type Message = {
  id: string;
  from: string;
  to: string;
  body: string;
  timestamp: string;
  isOutgoing: boolean;
};

type ChatInterfaceProps = {
  customerId: number;
  customerPhone: string;
  customerName: string;
};

export function ChatInterface({ customerId, customerPhone, customerName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const vendorPhone = "5491158100725"; // Esto debería venir de la configuración o el perfil del vendedor

  // Simular algunos mensajes para demostración
  useEffect(() => {
    // Limpiar mensajes al cambiar de cliente
    setMessages([]);
    
    // Simular la carga de mensajes con un pequeño retraso
    setLoading(true);
    const timer = setTimeout(() => {
      const mockMessages: Message[] = [
        {
          id: '1',
          from: customerPhone,
          to: vendorPhone,
          body: `Hola, quisiera información sobre sus productos.`,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isOutgoing: false
        },
        {
          id: '2',
          from: vendorPhone,
          to: customerPhone,
          body: `¡Hola ${customerName}! Claro, ¿en qué puedo ayudarte?`,
          timestamp: new Date(Date.now() - 3500000).toISOString(),
          isOutgoing: true
        },
        {
          id: '3',
          from: customerPhone,
          to: vendorPhone,
          body: 'Me interesa el catálogo de verano.',
          timestamp: new Date(Date.now() - 3400000).toISOString(),
          isOutgoing: false
        }
      ];
      
      setMessages(mockMessages);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [customerId, customerPhone, customerName]);

  // Función para cargar mensajes reales (implementar cuando se tenga el backend)
  const fetchMessages = async () => {
    try {
      setLoading(true);
      // Aquí iría la llamada real a la API
      // const response = await fetch(`/api/messages?customerId=${customerId}`);
      // const data = await response.json();
      // setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los mensajes. Intente nuevamente.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Función para enviar un mensaje
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Crear el mensaje con ID único temporal
    const tempMessage: Message = {
      id: Date.now().toString(),
      from: vendorPhone,
      to: customerPhone,
      body: newMessage,
      timestamp: new Date().toISOString(),
      isOutgoing: true
    };
    
    // Agregar el mensaje a la lista inmediatamente para la UX
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");
    
    try {
      // Aquí iría la llamada real a la API para enviar el mensaje
      // const response = await fetch('/api/messages', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     to: customerPhone,
      //     body: newMessage
      //   }),
      // });
      
      // Simular respuesta después de un tiempo
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          from: customerPhone,
          to: vendorPhone,
          body: "Gracias por la información.",
          timestamp: new Date().toISOString(),
          isOutgoing: false
        };
        
        setMessages(prev => [...prev, response]);
      }, 3000);
      
      // Simular éxito
      toast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado correctamente.",
      });
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  // Scroll al último mensaje cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Formatear hora del mensaje
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Cabecera del chat */}
      <div className="flex items-center p-4 border-b">
        <Avatar className="h-10 w-10 mr-3">
          <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center font-medium text-lg">
            {customerName.charAt(0).toUpperCase()}
          </div>
        </Avatar>
        <div>
          <h3 className="font-medium">{customerName}</h3>
          <p className="text-sm text-muted-foreground">{customerPhone}</p>
        </div>
      </div>
      
      {/* Área de mensajes */}
      <ScrollArea className="flex-1 p-4" viewportRef={scrollAreaRef}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">No hay mensajes aún. Envía el primero.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isOutgoing 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <p className="break-words">{message.body}</p>
                  <p className={`text-xs mt-1 text-right ${
                    message.isOutgoing ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {formatMessageTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      {/* Área de entrada de mensajes */}
      <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
        <Input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

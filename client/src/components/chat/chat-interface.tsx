
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

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
  const vendorPhone = "5491158100725"; // Esto debería venir de la configuración o el perfil del vendedor

  // Cargar mensajes al montar el componente
  useEffect(() => {
    fetchMessages();
  }, [customerId]);

  // Desplazar hacia abajo cuando llegan nuevos mensajes
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // Formato esperado por el API según swagger.json
      const response = await fetch(`/api/chats/${vendorPhone}/${customerPhone}`);
      
      if (!response.ok) {
        throw new Error("Error al cargar los mensajes");
      }
      
      const data = await response.json();
      
      // Transformar el formato de la respuesta al formato local
      const formattedMessages = data.messages.map((msg: any) => ({
        id: msg.id || Math.random().toString(),
        from: msg.from,
        to: msg.to,
        body: msg.body,
        timestamp: msg.timestamp || new Date().toISOString(),
        isOutgoing: msg.from === vendorPhone,
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los mensajes",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      setLoading(true);
      
      const messageData = {
        from: vendorPhone,
        to: customerPhone,
        body: newMessage,
        type: "text"
      };
      
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });
      
      if (!response.ok) {
        throw new Error("Error al enviar el mensaje");
      }
      
      // Añadir el mensaje a la lista local
      const tempMessage: Message = {
        id: Math.random().toString(),
        from: vendorPhone,
        to: customerPhone,
        body: newMessage,
        timestamp: new Date().toISOString(),
        isOutgoing: true
      };
      
      setMessages([...messages, tempMessage]);
      setNewMessage("");
      
      // Recargar mensajes para asegurar sincronización
      setTimeout(() => fetchMessages(), 1000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white">
      <div className="p-3 border-b bg-primary/10 flex items-center space-x-3">
        <Avatar>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
            {customerName.charAt(0)}
          </div>
        </Avatar>
        <div>
          <h3 className="font-semibold">{customerName}</h3>
          <p className="text-sm text-muted-foreground">{customerPhone}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto"
          onClick={fetchMessages}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 21h5v-5"></path></svg>
          Actualizar
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && !loading ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay mensajes. Comienza la conversación ahora.
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg py-2 px-3 ${
                    message.isOutgoing 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <p className="break-words">{message.body}</p>
                  <p className={`text-xs mt-1 ${
                    message.isOutgoing 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-primary h-6 w-6"></div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t flex gap-2">
        <Input
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
          <span className="sr-only">Enviar</span>
        </Button>
      </div>
    </div>
  );
}

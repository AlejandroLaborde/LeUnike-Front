
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLogin, useRegister } from "@/hooks/auth";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(1, { message: "Name is required" }),
});

export default function Login() {
  const navigate = useNavigate();
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } = useRegister();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
    },
  });

  function onLogin(data: z.infer<typeof loginSchema>) {
    login(data, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  }

  function onRegister(data: z.infer<typeof registerSchema>) {
    register(data, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 bg-card rounded-xl overflow-hidden shadow-2xl">
        {/* Banner section with image and text */}
        <div className="hidden md:flex flex-col justify-between bg-primary/10 p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/20 z-0"></div>
          <div className="relative z-10">
            <img 
              src="/leunike-logo.jpg" 
              alt="Le Unike Logo" 
              className="h-20 w-auto mb-6" 
            />
            <h1 className="text-4xl font-bold text-primary-foreground mb-2">Le Unike</h1>
            <h2 className="text-2xl font-semibold text-primary-foreground/90 mb-6">Admin Portal</h2>
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-lg text-primary-foreground/80">
              Su plataforma integral para gestionar productos, seguir ventas y coordinar con vendedores.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-primary-foreground/70">Gestión de inventario en tiempo real</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-primary-foreground/70">Seguimiento de ventas por vendedor</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-primary-foreground/70">Integración con WhatsApp</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Login/Register form section */}
        <div className="p-8 flex flex-col justify-center">
          <div className="mb-8 md:hidden flex items-center justify-center">
            <img 
              src="/leunike-logo.jpg" 
              alt="Le Unike Logo" 
              className="h-16 w-auto mr-3" 
            />
            <h1 className="text-2xl font-bold">Le Unike Admin</h1>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuario</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese su usuario" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoginPending}
                    size="lg"
                  >
                    {isLoginPending ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese su nombre completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuario</FormLabel>
                        <FormControl>
                          <Input placeholder="Elija un nombre de usuario" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Mínimo 6 caracteres" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6" 
                    disabled={isRegisterPending}
                    size="lg"
                  >
                    {isRegisterPending ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

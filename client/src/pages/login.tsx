
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
import { Skeleton } from "@/components/ui/skeleton";

const loginSchema = z.object({
  username: z.string().min(1, { message: "El usuario es requerido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: "El usuario debe tener al menos 3 caracteres" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  name: z.string().min(1, { message: "El nombre es requerido" }),
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
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Lado izquierdo - Imagen de fondo y mensaje */}
      <div className="hidden md:flex flex-col justify-center items-center p-10 bg-primary/10 backdrop-blur-sm">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <img 
            src="/leunike-logo.jpg" 
            alt="Le Unike Logo" 
            className="w-32 h-32 mx-auto rounded-full shadow-xl border-4 border-white"
          />
          <h1 className="text-4xl font-bold text-primary">Le Unike Admin Portal</h1>
          <p className="text-lg text-gray-700">
            Plataforma integral para la gestión de productos, vendedores y seguimiento de ventas. Optimice sus operaciones y mejore la eficiencia de su negocio.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="font-semibold text-primary">Productos</h3>
              <p className="text-sm text-gray-600">Gestión completa del inventario</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="font-semibold text-primary">Vendedores</h3>
              <p className="text-sm text-gray-600">Administre su equipo de ventas</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="font-semibold text-primary">Clientes</h3>
              <p className="text-sm text-gray-600">Base de datos centralizada</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lado derecho - Formulario */}
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-6 shadow-xl border-0">
          <div className="mb-6 text-center space-y-2">
            <div className="flex justify-center mb-4">
              <img 
                src="/leunike-logo.jpg" 
                alt="Le Unike Logo" 
                className="md:hidden w-20 h-20 rounded-full shadow-lg border-2 border-white" 
              />
            </div>
            <h2 className="text-2xl font-bold text-primary">Le Unike Admin Portal</h2>
            <p className="text-sm text-gray-500">Acceda a la plataforma para gestionar su negocio</p>
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
                  >
                    {isLoginPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        Accediendo...
                      </div>
                    ) : (
                      "Acceder"
                    )}
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
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre completo" {...field} />
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
                          <Input placeholder="Nombre de usuario" {...field} />
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
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-2" 
                    disabled={isRegisterPending}
                  >
                    {isRegisterPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        Registrando...
                      </div>
                    ) : (
                      "Registrarse"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Le Unike © {new Date().getFullYear()} - Todos los derechos reservados</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

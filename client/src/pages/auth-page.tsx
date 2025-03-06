import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Redirect } from "wouter";

type LoginData = Pick<InsertUser, "username" | "password">;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(
      insertUserSchema.pick({ username: true, password: true }),
    ),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "vendor",
    },
  });

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-background via-background to-primary/10">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <div className="flex flex-col items-center text-center pb-2">
              <img
                src="/logo-unike.jpg"
                alt="Le Unike Logo"
                className="h-16 w-16 rounded-full shadow-md border-2 border-primary/20 mb-3"
              />
              <CardTitle className="text-2xl text-primary font-bold">Le Unike Admin Portal</CardTitle>
              <CardDescription className="text-base mt-1">
                Gestión integral de productos y ventas
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 rounded-lg">
                <TabsTrigger value="login" className="rounded-l-lg py-2">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register" className="rounded-r-lg py-2">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form
                  onSubmit={loginForm.handleSubmit((data) =>
                    loginMutation.mutate(data),
                  )}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username" className="text-sm font-medium">Usuario</Label>
                      <Input 
                        {...loginForm.register("username")} 
                        className="mt-1" 
                        placeholder="Ingrese su nombre de usuario"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                      <Input
                        type="password"
                        {...loginForm.register("password")}
                        className="mt-1"
                        placeholder="••••••••"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full mt-2 bg-primary hover:bg-primary/90"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form
                  onSubmit={registerForm.handleSubmit((data) =>
                    registerMutation.mutate(data),
                  )}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username" className="text-sm font-medium">Usuario</Label>
                      <Input 
                        {...registerForm.register("username")} 
                        className="mt-1" 
                        placeholder="Cree un nombre de usuario"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                      <Input
                        type="password"
                        {...registerForm.register("password")}
                        className="mt-1"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role" className="text-sm font-medium">Rol</Label>
                      <Select
                        defaultValue={registerForm.getValues("role")}
                        onValueChange={(value) =>
                          registerForm.setValue("role", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Seleccione un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vendor">Vendedor</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      className="w-full mt-2 bg-primary hover:bg-primary/90"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending
                        ? "Creando cuenta..."
                        : "Crear Cuenta"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Le Unike © {new Date().getFullYear()} - Todos los derechos reservados</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="hidden lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 z-0"></div>
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-8 z-10 opacity-30"></div>
        <div className="h-full flex items-center justify-center p-12 relative z-20">
          <div className="max-w-lg space-y-6">
            <h1 className="text-4xl font-bold mb-4 text-primary">
              Bienvenido a Le Unike
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Plataforma integral para la gestión de productos, vendedores y seguimiento de ventas con integración de WhatsApp para comunicación sin interrupciones.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-primary mb-2">Gestión de Productos</h3>
                <p className="text-sm text-gray-600">
                  Catálogo completo con inventario en tiempo real
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-primary mb-2">Vendedores</h3>
                <p className="text-sm text-gray-600">
                  Control de comisiones y zonas asignadas
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-primary mb-2">Chatbot WhatsApp</h3>
                <p className="text-sm text-gray-600">
                  Integración completa con mensajería automática
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-primary mb-2">Reportes</h3>
                <p className="text-sm text-gray-600">
                  Estadísticas detalladas de ventas y rendimiento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

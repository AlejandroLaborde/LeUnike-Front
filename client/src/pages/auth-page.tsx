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
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <img
                src="public/logo-unike.jpg"
                alt="Le Unike Logo"
                className="h-10 w-10 rounded-full"
              />
              <CardTitle className="text-2xl">Le Unike Admin Portal</CardTitle>
            </div>
            <CardDescription>
              Manage your products, vendors and track sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form
                  onSubmit={loginForm.handleSubmit((data) =>
                    loginMutation.mutate(data),
                  )}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input {...loginForm.register("username")} />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        type="password"
                        {...loginForm.register("password")}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Logging in..." : "Login"}
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
                      <Label htmlFor="username">Username</Label>
                      <Input {...registerForm.register("username")} />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        type="password"
                        {...registerForm.register("password")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        defaultValue={registerForm.getValues("role")}
                        onValueChange={(value) =>
                          registerForm.setValue("role", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vendor">Vendor</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending
                        ? "Creating account..."
                        : "Create account"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="hidden lg:block bg-gradient-to-r from-primary/10 to-primary/30">
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold mb-4">Welcome to Le Unike</h1>
            <p className="text-lg text-muted-foreground">
              Your comprehensive platform for managing products, tracking sales,
              and coordinating with vendors - all integrated with WhatsApp for
              seamless communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

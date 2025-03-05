import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCustomerSchema, type Customer, type InsertCustomer } from "@shared/schema";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Pencil, Trash } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function Customers() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const form = useForm<InsertCustomer>({
    resolver: zodResolver(insertCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const editForm = useForm<InsertCustomer>({
    resolver: zodResolver(insertCustomerSchema),
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCustomer) => {
      const res = await apiRequest("POST", "/api/customers", data);
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Customer created successfully" });
      form.reset();
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to create customer", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertCustomer }) => {
      const res = await apiRequest("PATCH", `/api/customers/${id}`, data);
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Customer updated successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to update customer", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/customers/${id}`);
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Customer deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to delete customer", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleEdit = (customer: Customer) => {
    editForm.reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Customers</h1>
            <p className="text-muted-foreground">Manage your customer database</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input {...form.register("name")} />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" {...form.register("email")} />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input {...form.register("phone")} />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input {...form.register("address")} />
                  {form.formState.errors.address && (
                    <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Create Customer
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user?.role === "admin" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(customer)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Customer</DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={editForm.handleSubmit((data) =>
                                updateMutation.mutate({ id: customer.id, data })
                              )}
                              className="space-y-4"
                            >
                              <div>
                                <Label htmlFor="name">Name</Label>
                                <Input {...editForm.register("name")} />
                                {editForm.formState.errors.name && (
                                  <p className="text-sm text-red-500">
                                    {editForm.formState.errors.name.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" {...editForm.register("email")} />
                                {editForm.formState.errors.email && (
                                  <p className="text-sm text-red-500">
                                    {editForm.formState.errors.email.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input {...editForm.register("phone")} />
                                {editForm.formState.errors.phone && (
                                  <p className="text-sm text-red-500">
                                    {editForm.formState.errors.phone.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="address">Address</Label>
                                <Input {...editForm.register("address")} />
                                {editForm.formState.errors.address && (
                                  <p className="text-sm text-red-500">
                                    {editForm.formState.errors.address.message}
                                  </p>
                                )}
                              </div>
                              <Button
                                type="submit"
                                className="w-full"
                                disabled={updateMutation.isPending}
                              >
                                {updateMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Update Customer
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(customer.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
}

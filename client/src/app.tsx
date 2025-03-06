import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/login";
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Products from "@/pages/products";
import Vendors from "@/pages/vendors";
import Customers from "@/pages/customers";
import Orders from "@/pages/orders";
import Reports from "@/pages/reports";
import { AuthProvider, RequireAuth } from "@/hooks/use-auth";
import Chat from "@/pages/chat"; // Import the Chat component

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard">
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          </Route>
          <Route path="/products">
            <RequireAuth>
              <Products />
            </RequireAuth>
          </Route>
          <Route path="/vendors">
            <RequireAuth>
              <Vendors />
            </RequireAuth>
          </Route>
          <Route path="/customers">
            <RequireAuth>
              <Customers />
            </RequireAuth>
          </Route>
          <Route path="/orders">
            <RequireAuth>
              <Orders />
            </RequireAuth>
          </Route>
          <Route path="/reports">
            <RequireAuth>
              <Reports />
            </RequireAuth>
          </Route>
          <Route path="/chat"> {/* Added route for the chat page */}
            <RequireAuth>
              <Chat />
            </RequireAuth>
          </Route>
        </Switch>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
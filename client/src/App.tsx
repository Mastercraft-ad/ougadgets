import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import PhoneDetail from "@/pages/PhoneDetail";
import Compare from "@/pages/Compare";
import About from "@/pages/About";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/ProductList";
import ProductEditor from "@/pages/admin/ProductEditor";
import AdminSettings from "@/pages/admin/Settings";
import AdminProfile from "@/pages/admin/Profile";

// Hook to validate session on app load
function useSessionValidator() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const logout = useStore((state) => state.logout);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    async function validateSession() {
      if (isAuthenticated) {
        try {
          const res = await fetch('/api/auth/status', { credentials: 'include' });
          const data = await res.json();
          if (!data.authenticated) {
            logout();
          }
        } catch {
          logout();
        }
      }
      setIsValidating(false);
    }
    validateSession();
  }, []);

  return isValidating;
}

// Protected Route Component
function ProtectedRoute({ component: Component }: { component: React.ComponentType<any> }) {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/phone/:id" component={PhoneDetail} />
      <Route path="/compare" component={Compare} />
      <Route path="/about" component={About} />
      <Route path="/login" component={Login} />
      
      {/* Admin Routes */}
      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} />
      </Route>
      <Route path="/admin/products">
        <ProtectedRoute component={AdminProducts} />
      </Route>
      <Route path="/admin/products/new">
        <ProtectedRoute component={ProductEditor} />
      </Route>
      <Route path="/admin/products/edit/:id">
        <ProtectedRoute component={ProductEditor} />
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute component={AdminSettings} />
      </Route>
      <Route path="/admin/profile">
        <ProtectedRoute component={AdminProfile} />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const isValidating = useSessionValidator();
  
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <Router />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

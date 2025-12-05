import { useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User, Lock, ShoppingBag, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useStore((state) => state.setAuth);
  const [, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);
    
    try {
      const response = await apiRequest('POST', '/api/auth/login', { username, password });
      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        setAuth(true, {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as 'admin' | 'manager' | 'staff',
          avatar: user.avatar || undefined,
          phone: user.phone || undefined,
          joinedDate: user.joinedDate,
          lastActive: user.lastActive,
        });
        setLocation("/admin");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20 mb-6">
            <ShoppingBag size={32} strokeWidth={2} />
          </div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to manage your catalog</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="text" 
                      placeholder="Enter your username" 
                      className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors" 
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError(false);
                      }}
                      data-testid="input-username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors" 
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(false);
                      }}
                      data-testid="input-password"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="py-3 border-destructive/20 bg-destructive/5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Invalid username or password. Please try again.</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full h-12 font-bold text-base gap-2" size="lg" data-testid="button-signin" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          O&U Gadgets Admin Portal
        </p>
      </div>
    </div>
  );
}

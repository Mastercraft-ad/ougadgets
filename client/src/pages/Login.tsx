import { useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, ShoppingBag, AlertCircle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const login = useStore((state) => state.login);
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, email);
    if (success) {
      setLocation("/admin");
    } else {
      setError(true);
    }
  };

  const fillDemoCredentials = () => {
    setUsername("admin");
    setEmail("admin@ougadgets.com");
    setError(false);
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
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(false);
                      }}
                      data-testid="input-email"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="py-3 border-destructive/20 bg-destructive/5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Invalid credentials. Use the demo account below.</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full h-12 font-bold text-base gap-2" size="lg" data-testid="button-signin">
                Sign In
                <ArrowRight size={18} />
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-muted-foreground">Demo Access</span>
              </div>
            </div>

            <div 
              onClick={fillDemoCredentials}
              className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 cursor-pointer hover:border-primary/30 transition-all group"
              data-testid="button-demo-fill"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Demo Account</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">admin</span>
                    <span className="mx-2 text-slate-300">|</span>
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">admin@ougadgets.com</span>
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary group-hover:bg-primary/10">
                  Use
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          O&U Gadgets Admin Portal
        </p>
      </div>
    </div>
  );
}

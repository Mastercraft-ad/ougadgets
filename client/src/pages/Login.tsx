import { useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ShoppingBag, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const login = useStore((state) => state.login);
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      setLocation("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto bg-primary text-white p-3 rounded-xl w-14 h-14 flex items-center justify-center">
            <ShoppingBag size={28} />
          </div>
          <div>
            <CardTitle className="text-2xl font-heading font-bold">Admin Access</CardTitle>
            <CardDescription>Enter your credentials to manage the catalog</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  className="pl-9" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Invalid password. Try 'admin123'</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full font-bold" size="lg">
              Sign In
            </Button>
            
            <div className="text-center text-xs text-muted-foreground pt-4">
              <p>For demo purposes, use password: <strong>admin123</strong></p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

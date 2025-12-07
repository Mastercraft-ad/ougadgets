import { Link, useLocation } from "wouter";
import { useStore } from "@/store/useStore";
import { 
  LayoutDashboard, 
  Smartphone, 
  LogOut, 
  ShoppingBag, 
  Settings,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const logout = useStore((state) => state.logout);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // Ignore errors
    }
    logout();
    setLocation("/login");
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "All Products", icon: Smartphone },
    { href: "/admin/profile", label: "My Profile", icon: User },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-primary text-primary-foreground transition-transform duration-300 ease-in-out shadow-2xl flex flex-col border-r border-white/10",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:relative"
        )}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-accent to-amber-500 p-2.5 rounded-xl shadow-lg shadow-accent/20">
              <ShoppingBag size={22} className="text-primary-foreground" />
            </div>
            <div>
              <span className="font-heading font-bold text-xl block leading-none tracking-tight">O&U Admin</span>
              <span className="text-xs text-primary-foreground/60 font-medium">Management Console</span>
            </div>
          </div>
          <button 
            className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
          
          {/* Main Menu */}
          <div className="space-y-1">
            <h4 className="px-4 text-xs font-bold text-primary-foreground/40 uppercase tracking-wider mb-2">Main Menu</h4>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <a className={cn(
                      "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm relative overflow-hidden",
                      isActive 
                        ? "bg-accent text-accent-foreground font-bold shadow-lg shadow-accent/10" 
                        : "text-primary-foreground/70 hover:bg-white/10 hover:text-white hover:pl-5"
                    )}>
                      <div className="flex items-center gap-3 relative z-10">
                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        {item.label}
                      </div>
                      {isActive && <ChevronRight size={14} strokeWidth={3} className="opacity-50" />}
                      
                      {/* Subtle active background effect */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="space-y-1">
            <h4 className="px-4 text-xs font-bold text-primary-foreground/40 uppercase tracking-wider mb-2">Quick Links</h4>
            <nav className="space-y-1">
              <Link href="/">
                <a target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary-foreground/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium group">
                  <ExternalLink size={18} />
                  View Live Store
                </a>
              </Link>
            </nav>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <Link href="/admin/profile">
            <a className="flex items-center gap-3 mb-4 px-2 py-2 -mx-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer" data-testid="link-admin-profile">
              <Avatar className="h-10 w-10 border-2 border-accent">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-accent text-accent-foreground font-bold">AD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Admin User</p>
                <p className="text-xs text-primary-foreground/50 truncate">admin@ougadgets.com</p>
              </div>
            </a>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
        {/* Mobile Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm md:hidden sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="-ml-2">
              <Menu className="h-6 w-6" />
            </Button>
            <span className="font-heading font-bold text-lg text-primary">Dashboard</span>
          </div>
          <Link href="/">
             <a className="p-2 bg-primary/5 rounded-full text-primary hover:bg-primary/10 transition-colors">
               <ExternalLink size={18} />
             </a>
          </Link>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

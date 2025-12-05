import { Link, useLocation } from "wouter";
import { ShoppingBag, Scale, Menu, X, Phone, ShieldCheck } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const compareCount = useStore((state) => state.compareList.length);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Catalog" },
    { href: "/about", label: "About" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-white p-2 rounded-lg group-hover:scale-105 transition-transform">
              <ShoppingBag size={20} strokeWidth={2.5} />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-primary">
              O&U <span className="text-accent-foreground">Gadgets</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href
                    ? "text-primary font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/compare">
              <Button variant="outline" size="sm" className="relative hidden md:flex rounded-full border-primary/20 hover:border-primary hover:bg-primary/5">
                <Scale className="mr-2 h-4 w-4" />
                Compare
                {compareCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm animate-in zoom-in">
                    {compareCount}
                  </span>
                )}
              </Button>
            </Link>
            
            <Link href="/compare" className="md:hidden relative p-2 text-primary">
              <Scale size={20} />
              {compareCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="hidden">Mobile Menu</SheetTitle>
                <SheetDescription className="hidden">Navigation links</SheetDescription>
                <div className="flex flex-col gap-6 mt-10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium py-2 border-b border-border/50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 animate-in fade-in duration-500">
        {children}
      </main>

      <footer className="bg-primary text-primary-foreground py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white/10 p-2 rounded-lg">
                  <ShoppingBag size={20} />
                </div>
                <span className="font-heading font-bold text-xl">O&U Gadgets</span>
              </div>
              <p className="text-primary-foreground/80 text-sm max-w-xs leading-relaxed">
                Your trusted source for mobile phone specifications and best market prices. 
                We bring transparency to tech buying.
              </p>
            </div>
            
            <div>
              <h3 className="font-heading font-bold mb-4 text-accent">Quick Links</h3>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><Link href="/catalog">Browse Phones</Link></li>
                <li><Link href="/compare">Compare Specs</Link></li>
                <li><Link href="/about">Warranty Policy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-bold mb-4 text-accent">Contact & Trust</h3>
              <ul className="space-y-3 text-sm text-primary-foreground/80">
                <li className="flex items-center gap-2">
                  <Phone size={16} className="text-accent" />
                  <span>+234 800 000 0000</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-accent" />
                  <span>48hr Testing Warranty</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} O&U Gadgets. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

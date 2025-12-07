import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { PhoneCard } from "@/components/PhoneCard";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Truck, Star, Loader2 } from "lucide-react";
import heroImage from "@assets/generated_images/hero_banner_of_modern_smartphones_on_a_dark_background.png";
import { useQuery } from "@tanstack/react-query";
import type { Phone } from "@/store/useStore";

export default function Home() {
  const { data: phones = [], isLoading } = useQuery<Phone[]>({
    queryKey: ['/api/phones'],
  });
  const featuredPhones = phones.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-black text-white mb-16 shadow-2xl">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Hero" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 py-20 px-8 md:px-16 max-w-3xl">
          <div className="inline-block bg-accent/20 text-accent border border-accent/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
             Trusted Mobile Specs & Prices
          </div>
          <h1 className="font-heading font-bold text-5xl md:text-7xl leading-tight mb-6 animate-in slide-in-from-bottom-6 fade-in duration-700 delay-100">
            O&U Price vs <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-200">Market Price</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
            Stop guessing. We compare real market prices with our exclusive O&U deals so you know exactly how much you save.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-300">
            <Link href="/catalog">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg h-14 px-8 rounded-xl">
                Browse Deals
              </Button>
            </Link>
            <Link href="/compare">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold text-lg h-14 px-8 rounded-xl backdrop-blur-sm">
                Compare Phones
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[
          { icon: ShieldCheck, title: "48hr Testing Warranty", desc: "Every phone comes with a comprehensive 2-day testing guarantee for your peace of mind." },
          { icon: Star, title: "Transparent Pricing", desc: "We show you the market price vs our price instantly. No hidden fees." },
          { icon: Truck, title: "Fast Delivery", desc: "Get your device delivered safely to your doorstep or pick up from our store." }
        ].map((feature, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center mb-4">
              <feature.icon size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl mb-2">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Featured Phones */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-heading font-bold text-3xl mb-2 text-primary">Featured Deals</h2>
            <p className="text-muted-foreground">Top picks with the best savings today</p>
          </div>
          <Link href="/catalog">
            <Button variant="ghost" className="group">
              View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPhones.map((phone) => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </div>
      </section>
    </Layout>
  );
}

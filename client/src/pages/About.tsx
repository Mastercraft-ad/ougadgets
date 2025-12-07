import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Search, ShoppingBag, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-12">
        <div className="text-center mb-16">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-6 text-primary">Transparent Tech Buying</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            O&U Gadgets was founded with a simple mission: to bring honesty to the mobile phone market. 
            We believe you shouldn't have to guess if you're getting a good deal.
          </p>
        </div>

        {/* How it Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: Search,
              title: "1. We Compare",
              desc: "We constantly track prices from major retailers like Jumia and Konga to ensure we beat the market."
            },
            {
              icon: CheckCircle2,
              title: "2. We Verify",
              desc: "Every device undergoes a rigorous 30-point inspection process before it's listed on our platform."
            },
            {
              icon: ShoppingBag,
              title: "3. You Save",
              desc: "Get the same quality devices at significantly lower prices, with full transparency on your savings."
            }
          ].map((step, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-border/50 shadow-sm text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <step.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 items-start">
           {/* Mission */}
           <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
            <h2 className="text-foreground font-heading font-bold text-2xl mb-4">Our Promise</h2>
            <p>
              By comparing our prices directly against major market retailers, we show you exactly how much you save 
              on every purchase. Whether you're looking for the latest flagship or a reliable budget device, 
              we ensure quality and value.
            </p>
            <p>
              We're not just selling phones; we're building trust in the pre-owned market.
            </p>
          </div>

          {/* Warranty Card */}
          <Card className="bg-slate-50 border-primary/10">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                  <ShieldCheck size={24} />
                </div>
                <CardTitle className="font-heading text-2xl text-primary">Warranty Policy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="font-medium text-foreground">
                We stand behind the quality of our devices. All phones purchased from O&U Gadgets come with a 
                standard <strong>48-hour testing warranty</strong>.
              </p>
              <ul className="space-y-3">
                {[
                  "Warranty begins from moment of delivery/pickup",
                  "Covers functional defects not disclosed at purchase",
                  "Returns must include original receipt and packaging",
                  "Excludes physical/water damage caused by user"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

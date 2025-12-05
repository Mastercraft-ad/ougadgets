import { Layout } from "@/components/Layout";
import { useRoute, Link } from "wouter";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, 
  MessageCircle, 
  Phone as PhoneIcon, 
  Check, 
  ShieldCheck, 
  Play, 
  X, 
  Battery, 
  Cpu, 
  Smartphone, 
  Camera, 
  HardDrive,
  ChevronRight,
  Home
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { PhoneCard } from "@/components/PhoneCard";

export default function PhoneDetail() {
  const [, params] = useRoute("/phone/:id");
  const phones = useStore((state) => state.phones);
  const phone = phones.find((p) => p.id === params?.id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  if (!phone) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Phone Not Found</h2>
          <Link href="/catalog">
            <Button className="mt-4">Back to Catalog</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Filter similar phones (same brand, excluding current)
  const similarPhones = phones
    .filter(p => p.brand === phone.brand && p.id !== phone.id)
    .slice(0, 4);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <Layout>
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/">
          <a className="flex items-center hover:text-primary transition-colors">
            <Home size={14} className="mr-1" /> Home
          </a>
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <Link href="/catalog">
          <a className="hover:text-primary transition-colors">Catalog</a>
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="font-medium text-foreground">{phone.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        {/* Left Column - Gallery (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden border border-border shadow-sm relative group">
            <img 
              src={phone.images[selectedImage]} 
              alt={phone.name} 
              className="w-full h-full object-contain p-4 mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {phone.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                  selectedImage === idx ? "border-primary ring-2 ring-primary/20 scale-105 shadow-md" : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                }`}
              >
                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain p-2" />
              </button>
            ))}
            
            {/* Inspection Video Button */}
            <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
              <DialogTrigger asChild>
                <button 
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 text-xs text-center p-1 text-muted-foreground hover:bg-slate-200 hover:border-primary/50 hover:text-primary transition-all flex-shrink-0 group"
                >
                   <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                     <Play size={12} className="fill-current ml-0.5 text-primary" />
                   </div>
                   <span className="font-bold text-[10px] leading-tight uppercase tracking-wide">Inspection<br/>Video</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] p-0 bg-black border-none overflow-hidden text-white">
                <VisuallyHidden>
                  <DialogTitle>Device Inspection Video</DialogTitle>
                </VisuallyHidden>
                <div className="relative aspect-video bg-black flex items-center justify-center group">
                  {/* Mock Video Player UI */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all hover:scale-110 group/play">
                       <Play size={40} className="fill-white text-white ml-2 group-hover/play:scale-110 transition-transform" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="h-1.5 bg-white/30 rounded-full mb-4 overflow-hidden cursor-pointer">
                      <div className="h-full w-1/3 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>0:00 / 1:45</span>
                      <span>Device Inspection - {phone.name}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsVideoOpen(false)}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 text-white transition-colors hover:rotate-90 duration-300"
                  >
                    <X size={20} />
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Description & Key Specs Grid (Desktop View) */}
          <div className="hidden lg:block space-y-8 pt-8">
             <div>
                <h3 className="font-heading font-bold text-2xl mb-4">About this device</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{phone.description}</p>
             </div>

             <div>
                <h3 className="font-heading font-bold text-2xl mb-6">Key Highlights</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   {[
                     { icon: Smartphone, label: "Display", value: "OLED" }, // Mock data for display
                     { icon: Cpu, label: "RAM", value: `${phone.ram}GB` },
                     { icon: HardDrive, label: "Storage", value: `${phone.rom}GB` },
                     { icon: Battery, label: "Battery", value: `${phone.battery}mAh` },
                     { icon: Camera, label: "Main Cam", value: `${phone.camera}MP` },
                     { icon: Camera, label: "Selfie", value: `${phone.frontCamera}MP` },
                   ].map((spec, i) => (
                     <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-border/50 flex flex-col items-center text-center hover:bg-slate-100 transition-colors">
                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-primary">
                           <spec.icon size={20} strokeWidth={2} />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{spec.label}</span>
                        <span className="font-bold text-foreground">{spec.value}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Right Column - Sticky Info & Purchase (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 space-y-6">
             <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-sm px-3 py-1 font-bold border-primary/20 text-primary bg-primary/5">{phone.brand}</Badge>
                  <Badge variant="secondary" className={`text-sm px-3 py-1 border ${
                    phone.condition.includes('New') 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {phone.condition}
                  </Badge>
                </div>
                <h1 className="font-heading font-bold text-4xl md:text-5xl mb-2 text-foreground leading-tight">{phone.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                   In Stock & Ready to Ship
                </div>
             </div>

            {/* Price Card */}
            <Card className="bg-white border-primary/20 shadow-xl shadow-primary/5 overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <ShieldCheck size={120} />
               </div>
               
               <CardContent className="p-6 relative z-10">
                  <div className="space-y-1 mb-6">
                     <p className="text-sm font-medium text-muted-foreground">Total Price</p>
                     <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="font-heading font-bold text-4xl md:text-5xl text-primary tracking-tight">
                           {formatCurrency(phone.ouPrice)}
                        </span>
                        <span className="text-lg text-muted-foreground line-through decoration-destructive/40">
                           {formatCurrency(phone.marketPrice)}
                        </span>
                     </div>
                     <div className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-1 rounded-md mt-2">
                        <Check size={14} strokeWidth={3} />
                        You save {formatCurrency(phone.marketPrice - phone.ouPrice)}
                     </div>
                  </div>

                  <div className="space-y-3">
                     <Button size="lg" className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5" asChild>
                        <a href={`https://wa.me/?text=Hi, I am interested in the ${phone.name} listed for ${formatCurrency(phone.ouPrice)}`} target="_blank" rel="noreferrer">
                           <MessageCircle className="mr-2 h-5 w-5" /> Buy via WhatsApp
                        </a>
                     </Button>
                     <Button size="lg" variant="outline" className="w-full h-14 text-lg font-bold border-2 hover:bg-slate-50" asChild>
                        <a href="tel:+1234567890">
                           <PhoneIcon className="mr-2 h-5 w-5" /> Call to Order
                        </a>
                     </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-dashed flex items-center justify-center gap-2 text-xs text-muted-foreground">
                     <ShieldCheck className="text-primary h-4 w-4" />
                     <span>Protected by <strong>48-hour testing warranty</strong></span>
                  </div>
               </CardContent>
            </Card>

            {/* Price Comparison Mini-Table */}
            <div className="bg-slate-50 rounded-xl border p-4 space-y-3">
               <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">Market Comparison</h4>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Market Average</span>
                  <span className="font-medium line-through">{formatCurrency(phone.marketPrice)}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Major Retailers</span>
                  <span className="font-medium line-through">{formatCurrency(phone.jumiaPrice)}</span>
               </div>
               <div className="w-full h-px bg-border/50 my-1"></div>
               <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-primary">O&U Price</span>
                  <span className="font-bold text-primary">{formatCurrency(phone.ouPrice)}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Description & Specs (Visible only on mobile) */}
      <div className="lg:hidden space-y-8 mb-12">
         <div>
            <h3 className="font-heading font-bold text-2xl mb-4">About this device</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">{phone.description}</p>
         </div>

         <div>
            <h3 className="font-heading font-bold text-2xl mb-6">Key Highlights</h3>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { icon: Cpu, label: "RAM", value: `${phone.ram}GB` },
                 { icon: HardDrive, label: "Storage", value: `${phone.rom}GB` },
                 { icon: Battery, label: "Battery", value: `${phone.battery}mAh` },
                 { icon: Camera, label: "Main Cam", value: `${phone.camera}MP` },
               ].map((spec, i) => (
                 <div key={i} className="bg-slate-50 p-4 rounded-xl border border-border/50 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-primary">
                       <spec.icon size={20} strokeWidth={2} />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{spec.label}</span>
                    <span className="font-bold text-foreground">{spec.value}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Full Specs Table */}
      <div className="max-w-4xl mx-auto mb-20">
        <h2 className="font-heading font-bold text-3xl mb-8 text-center">Technical Specifications</h2>
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <Table>
            <TableBody>
              {[
                ['Brand', phone.brand],
                ['Model', phone.name],
                ['Condition', phone.condition],
                ['Color', phone.color],
                ['RAM', `${phone.ram} GB`],
                ['Internal Storage', `${phone.rom} GB`],
                ['Battery Capacity', `${phone.battery} mAh`],
                ['Main Camera', `${phone.camera} MP`],
                ['Selfie Camera', `${phone.frontCamera} MP`],
                ['Operating System', phone.brand === 'Apple' ? 'iOS' : 'Android'],
                ['SIM Support', 'Dual SIM (Nano-SIM)'],
                ['Verified Status', 'Passed 30-point Inspection'],
              ].map(([label, value], i) => (
                <TableRow key={i} className="hover:bg-slate-50/50 border-b last:border-0">
                  <TableCell className="font-medium w-1/3 text-muted-foreground pl-8 py-4">{label}</TableCell>
                  <TableCell className="font-bold text-foreground py-4 text-lg">{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Similar Products */}
      {similarPhones.length > 0 && (
        <div className="mb-12 border-t pt-12">
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-heading font-bold text-3xl">Similar {phone.brand} Phones</h2>
            <Link href="/catalog">
               <Button variant="ghost">View Catalog</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarPhones.map((p) => (
              <PhoneCard key={p.id} phone={p} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

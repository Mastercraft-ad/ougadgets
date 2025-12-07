import { Layout } from "@/components/Layout";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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
  Home,
  Loader2,
  Upload
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { PhoneCard } from "@/components/PhoneCard";
import { useToast } from "@/hooks/use-toast";
import type { Phone } from "@/store/useStore";

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

export default function PhoneDetail() {
  const [, params] = useRoute("/phone/:id");
  
  // Fetch single phone by ID
  const { data: phone, isLoading: isLoadingPhone } = useQuery<Phone>({
    queryKey: ['/api/phones', params?.id],
    enabled: !!params?.id,
  });
  
  // Fetch all phones for similar products section
  const { data: allPhones = [] } = useQuery<Phone[]>({
    queryKey: ['/api/phones'],
  });
  const [selectedImage, setSelectedImage] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  // Payment Modal States
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'info' | 'upload' | 'success'>('info');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  if (isLoadingPhone) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

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
  const similarPhones = allPhones
    .filter(p => p.brand === phone.brand && p.id !== phone.id)
    .slice(0, 4);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
  };

  const handlePaymentUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setPaymentStep('success');
      
      // Redirect to WhatsApp after short delay
      setTimeout(() => {
        const message = `Hi, I have just made a payment for the ${phone.name} (${formatCurrency(phone.ouPrice)}). Here is my payment evidence.`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        setIsPaymentOpen(false);
        setPaymentStep('info'); // Reset for next time
      }, 2000);
    }, 1500);
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
            
            {/* Inspection Video Button - Only show if video URL exists */}
            {phone.inspectionVideo && (
              <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                <DialogTrigger asChild>
                  <button 
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-red-50 flex flex-col items-center justify-center border-2 border-dashed border-red-200 text-xs text-center p-1 text-red-600 hover:bg-red-100 hover:border-red-400 transition-all flex-shrink-0 group"
                    data-testid="button-inspection-video"
                  >
                     <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                       <Play size={12} className="fill-red-500 ml-0.5 text-red-500" />
                     </div>
                     <span className="font-bold text-[10px] leading-tight uppercase tracking-wide">Inspection<br/>Video</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] p-0 bg-black border-none overflow-hidden">
                  <VisuallyHidden>
                    <DialogTitle>Device Inspection Video - {phone.name}</DialogTitle>
                  </VisuallyHidden>
                  <div className="relative aspect-video bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(phone.inspectionVideo)}?autoplay=1`}
                      title={`Device Inspection - ${phone.name}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <button 
                      onClick={() => setIsVideoOpen(false)}
                      className="absolute top-4 right-4 p-2 bg-black/70 rounded-full hover:bg-black text-white transition-colors z-10"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
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
                     <Dialog open={isPaymentOpen} onOpenChange={(open) => {
                        setIsPaymentOpen(open);
                        if (!open) setPaymentStep('info'); // Reset when closed
                     }}>
                        <DialogTrigger asChild>
                           <Button size="lg" className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5">
                              <MessageCircle className="mr-2 h-5 w-5" /> Buy Now
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                           <DialogHeader>
                              <DialogTitle className="text-center text-xl font-bold">
                                 {paymentStep === 'info' && "Bank Transfer Details"}
                                 {paymentStep === 'upload' && "Upload Payment Evidence"}
                                 {paymentStep === 'success' && "Payment Submitted!"}
                              </DialogTitle>
                              <DialogDescription className="text-center">
                                 {paymentStep === 'info' && "Please make a transfer to the account below"}
                                 {paymentStep === 'upload' && "Please attach a screenshot of your transaction"}
                                 {paymentStep === 'success' && "Redirecting to WhatsApp..."}
                              </DialogDescription>
                           </DialogHeader>

                           {paymentStep === 'info' && (
                              <div className="space-y-6 py-4">
                                 <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-primary/30 text-center space-y-2">
                                    <p className="text-sm text-muted-foreground">Account Number</p>
                                    <p className="text-3xl font-mono font-bold text-primary tracking-wider select-all">0192930383</p>
                                    <div className="pt-2 space-y-1">
                                       <p className="font-bold">O&U Gadgets</p>
                                       <p className="text-sm text-muted-foreground">GTBank</p>
                                    </div>
                                 </div>
                                 <div className="text-center text-sm text-muted-foreground">
                                    Amount to Pay: <span className="font-bold text-foreground">{formatCurrency(phone.ouPrice)}</span>
                                 </div>
                                 <Button className="w-full h-12 font-bold text-lg" onClick={() => setPaymentStep('upload')}>
                                    I Have Paid
                                 </Button>
                              </div>
                           )}

                           {paymentStep === 'upload' && (
                              <div className="space-y-6 py-4">
                                 <div 
                                    className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                                    onClick={handlePaymentUpload}
                                 >
                                    {isUploading ? (
                                       <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                    ) : (
                                       <>
                                          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                             <Upload className="h-6 w-6 text-primary" />
                                          </div>
                                          <p className="font-medium text-sm">Click to upload receipt</p>
                                          <p className="text-xs text-muted-foreground mt-1">JPG, PNG or PDF</p>
                                       </>
                                    )}
                                 </div>
                                 <Button variant="ghost" onClick={() => setPaymentStep('info')} disabled={isUploading}>
                                    Back to Account Info
                                 </Button>
                              </div>
                           )}

                           {paymentStep === 'success' && (
                              <div className="py-8 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
                                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                    <Check size={32} strokeWidth={3} />
                                 </div>
                                 <p className="text-center text-muted-foreground max-w-xs">
                                    Your proof of payment has been received. We are opening WhatsApp to finalize your order.
                                 </p>
                              </div>
                           )}
                        </DialogContent>
                     </Dialog>
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
                  <span className="text-muted-foreground">Jumia Market</span>
                  <span className="font-medium line-through">{formatCurrency(phone.jumiaPrice)}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Other Retailers</span>
                  <span className="font-medium line-through">{formatCurrency(phone.marketPrice)}</span>
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
                ['Operating System', phone.os || (phone.brand === 'Apple' ? 'iOS' : 'Android')],
                ['SIM Support', phone.sim || 'Dual SIM (Nano-SIM)'],
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

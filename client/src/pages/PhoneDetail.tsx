import { Layout } from "@/components/Layout";
import { useRoute, Link } from "wouter";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowLeft, MessageCircle, Phone as PhoneIcon, Check, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function PhoneDetail() {
  const [, params] = useRoute("/phone/:id");
  const phones = useStore((state) => state.phones);
  const phone = phones.find((p) => p.id === params?.id);
  const [selectedImage, setSelectedImage] = useState(0);

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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link href="/catalog">
          <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden border border-border shadow-sm">
            <img 
              src={phone.images[selectedImage]} 
              alt={phone.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {phone.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  selectedImage === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
            {/* Placeholder for inspection video */}
            <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 text-xs text-center p-1 text-muted-foreground">
               Inspection Video
            </div>
          </div>
        </div>

        {/* Info & Specs */}
        <div>
          <div className="flex items-center gap-2 mb-2">
             <Badge variant="outline" className="text-sm px-3 py-1">{phone.brand}</Badge>
             <Badge variant="secondary" className="text-sm px-3 py-1 bg-accent/10 text-accent-foreground border-accent/20">{phone.condition}</Badge>
          </div>
          
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4 text-primary">{phone.name}</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{phone.description}</p>

          {/* Price Comparison Card */}
          <Card className="mb-8 bg-gradient-to-br from-slate-50 to-white border-primary/10 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-heading font-bold text-lg mb-4">Price Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-50 border border-red-100 text-red-900">
                   <span className="font-medium">Market Average</span>
                   <span className="font-bold line-through opacity-70">{formatCurrency(phone.marketPrice)}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50 border border-orange-100 text-orange-900">
                   <span className="font-medium">Jumia/Konga</span>
                   <span className="font-bold line-through opacity-70">{formatCurrency(phone.jumiaPrice)}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl bg-primary text-white shadow-md transform scale-105">
                   <span className="font-bold flex items-center gap-2"><Check className="h-5 w-5 text-accent" /> O&U Price</span>
                   <span className="font-heading font-bold text-2xl text-accent">{formatCurrency(phone.ouPrice)}</span>
                </div>
              </div>
              <div className="mt-4 text-center text-sm font-medium text-emerald-600">
                You save {formatCurrency(phone.marketPrice - phone.ouPrice)} with O&U!
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700 text-white" asChild>
              <a href={`https://wa.me/?text=Hi, I am interested in the ${phone.name} listed for ${formatCurrency(phone.ouPrice)}`} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
              </a>
            </Button>
            <Button size="lg" className="flex-1" asChild>
              <a href="tel:+1234567890">
                <PhoneIcon className="mr-2 h-5 w-5" /> Call to Order
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 bg-blue-50 p-3 rounded-lg border border-blue-100">
             <ShieldCheck className="text-primary h-5 w-5" />
             <span>Includes 48-hour testing warranty & receipt</span>
          </div>
        </div>
      </div>

      {/* Full Specs Table */}
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading font-bold text-2xl mb-6 border-b pb-2">Detailed Specifications</h2>
        <Table>
          <TableBody>
            {[
              ['Brand', phone.brand],
              ['Model', phone.name],
              ['Condition', phone.condition],
              ['Color', phone.color],
              ['RAM', `${phone.ram} GB`],
              ['Internal Storage (ROM)', `${phone.rom} GB`],
              ['Battery Capacity', `${phone.battery} mAh`],
              ['Main Camera', `${phone.camera} MP`],
              ['Selfie Camera', `${phone.frontCamera} MP`],
            ].map(([label, value], i) => (
              <TableRow key={i} className="hover:bg-slate-50/50">
                <TableCell className="font-medium w-1/3 text-muted-foreground">{label}</TableCell>
                <TableCell className="font-bold text-foreground">{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}

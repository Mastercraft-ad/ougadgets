import { Phone } from "@/store/useStore";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Check } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface PhoneCardProps {
  phone: Phone;
}

export function PhoneCard({ phone }: PhoneCardProps) {
  const { compareList, addToCompare, removeFromCompare } = useStore();
  const isCompared = compareList.some((p) => p.id === phone.id);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
  };

  const discount = Math.round(((phone.marketPrice - phone.ouPrice) / phone.marketPrice) * 100);

  const handleCompareToggle = (checked: boolean) => {
    if (checked) {
      addToCompare(phone);
    } else {
      removeFromCompare(phone.id);
    }
  };

  return (
    <Card className="group overflow-hidden rounded-2xl border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {discount > 0 && (
          <Badge className="absolute top-3 right-3 z-10 bg-destructive text-white border-none shadow-sm font-bold">
            Save {discount}%
          </Badge>
        )}
        <Link href={`/phone/${phone.id}`}>
          <img 
            src={phone.images[0]} 
            alt={phone.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
            loading="lazy"
          />
        </Link>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end">
           <Badge variant="outline" className="bg-black/40 text-white border-white/20 backdrop-blur-sm">
             {phone.condition}
           </Badge>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
           <div>
             <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{phone.brand}</p>
             <Link href={`/phone/${phone.id}`}>
               <h3 className="font-heading font-bold text-lg leading-tight mt-1 hover:text-primary transition-colors cursor-pointer line-clamp-1">{phone.name}</h3>
             </Link>
           </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-1">
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4 mt-2">
           <div className="bg-secondary/50 p-2 rounded-lg text-center">
             <span className="block font-bold text-foreground">{phone.ram}GB</span> RAM
           </div>
           <div className="bg-secondary/50 p-2 rounded-lg text-center">
             <span className="block font-bold text-foreground">{phone.rom}GB</span> ROM
           </div>
           <div className="bg-secondary/50 p-2 rounded-lg text-center">
             <span className="block font-bold text-foreground">{phone.battery}mAh</span> Battery
           </div>
           <div className="bg-secondary/50 p-2 rounded-lg text-center">
             <span className="block font-bold text-foreground">{phone.camera}MP</span> Cam
           </div>
        </div>

        <div className="space-y-1">
           <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground line-through decoration-destructive/50">Mkt: {formatCurrency(phone.marketPrice)}</span>
              <span className="font-heading font-bold text-xl text-primary">{formatCurrency(phone.ouPrice)}</span>
           </div>
           <p className="text-xs text-emerald-600 font-medium text-right">You save {formatCurrency(phone.marketPrice - phone.ouPrice)}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
        <div className="flex items-center gap-2 w-full">
           <div className="flex items-center gap-2 flex-1">
             <Checkbox 
                id={`compare-${phone.id}`} 
                checked={isCompared}
                onCheckedChange={handleCompareToggle}
                className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
             />
             <label htmlFor={`compare-${phone.id}`} className="text-xs font-medium cursor-pointer select-none">Compare</label>
           </div>
           <Link href={`/phone/${phone.id}`}>
             <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-primary/5 hover:text-primary p-0">
               Details <ArrowRight className="ml-1 w-3 h-3" />
             </Button>
           </Link>
        </div>

        <div className="w-full">
           <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all" asChild>
             <Link href={`/phone/${phone.id}`}>
               View Details
             </Link>
           </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

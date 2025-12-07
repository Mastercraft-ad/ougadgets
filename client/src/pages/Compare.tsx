import { Layout } from "@/components/Layout";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Trash2 } from "lucide-react";
import { Link } from "wouter";

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useStore();

  if (compareList.length === 0) {
    return (
      <Layout>
        <div className="text-center py-20 max-w-md mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-4">No phones to compare</h2>
          <p className="text-muted-foreground mb-8">Select up to 4 phones from the catalog to see their specs side-by-side.</p>
          <Link href="/catalog">
            <Button size="lg">Go to Catalog</Button>
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading font-bold text-3xl">Compare Specs</h1>
        <Button variant="destructive" size="sm" onClick={clearCompare}>
          <Trash2 className="mr-2 h-4 w-4" /> Clear All
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px] bg-slate-50">Feature</TableHead>
              {compareList.map((phone) => (
                <TableHead key={phone.id} className="min-w-[200px] text-center align-top pt-6 pb-6">
                  <div className="flex flex-col items-center gap-4">
                     <div className="relative w-24 h-24">
                        <img src={phone.images[0]} alt={phone.name} className="w-full h-full object-contain" />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-sm"
                          onClick={() => removeFromCompare(phone.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                     </div>
                     <Link href={`/phone/${phone.id}`}>
                       <a className="font-bold hover:text-primary hover:underline">{phone.name}</a>
                     </Link>
                     <div className="text-primary font-bold text-lg">
                       {formatCurrency(phone.ouPrice)}
                     </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { label: 'Brand', key: 'brand' },
              { label: 'RAM', key: 'ram', suffix: ' GB' },
              { label: 'Storage', key: 'rom', suffix: ' GB' },
              { label: 'Battery', key: 'battery', suffix: ' mAh' },
              { label: 'Main Camera', key: 'camera', suffix: ' MP' },
              { label: 'Front Camera', key: 'frontCamera', suffix: ' MP' },
              { label: 'Condition', key: 'condition' },
              { label: 'Market Price', key: 'marketPrice', format: formatCurrency },
            ].map((row) => (
              <TableRow key={row.label}>
                <TableCell className="font-medium bg-slate-50 text-muted-foreground">{row.label}</TableCell>
                {compareList.map((phone) => (
                  <TableCell key={phone.id} className="text-center font-medium">
                    {
                      // @ts-ignore
                      row.format ? row.format(phone[row.key]) : `${phone[row.key]}${row.suffix || ''}`
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}

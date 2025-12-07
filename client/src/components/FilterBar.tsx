import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { Phone } from "@/store/useStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";

interface FilterBarProps {
  phones: Phone[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  brand: string;
  minRam: number;
  maxPrice: number;
  sortBy: string;
}

export function FilterBar({ phones, onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    brand: "all",
    minRam: 0,
    maxPrice: 1000000,
    sortBy: "newest",
  });

  const brands = Array.from(new Set(phones.map((p) => p.brand)));
  const maxPrice = Math.max(...phones.map((p) => p.ouPrice));

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      brand: "all",
      minRam: 0,
      maxPrice: 1000000,
      sortBy: "newest",
    });
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search phones..." 
            className="pl-9 bg-white border-border/50 shadow-sm focus:ring-primary/20"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>
        
        {/* Desktop Filters */}
        <div className="hidden md:flex gap-2">
           <Select value={filters.brand} onValueChange={(val) => updateFilter("brand", val)}>
            <SelectTrigger className="w-[140px] bg-white border-border/50 shadow-sm">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(val) => updateFilter("sortBy", val)}>
            <SelectTrigger className="w-[160px] bg-white border-border/50 shadow-sm">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Added</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Filter Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">Refine your search by brand, price, and specs.</SheetDescription>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Select value={filters.brand} onValueChange={(val) => updateFilter("brand", val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Min RAM: {filters.minRam}GB</label>
                <Slider 
                  value={[filters.minRam]} 
                  min={0} 
                  max={16} 
                  step={2}
                  onValueChange={(val) => updateFilter("minRam", val[0])}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Price: ₦{(filters.maxPrice).toLocaleString()}</label>
                 <Slider 
                  value={[filters.maxPrice]} 
                  min={0} 
                  max={maxPrice} 
                  step={5000}
                  onValueChange={(val) => updateFilter("maxPrice", val[0])}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort</label>
                 <Select value={filters.sortBy} onValueChange={(val) => updateFilter("sortBy", val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest Added</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={clearFilters} variant="secondary" className="w-full">
                Clear Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

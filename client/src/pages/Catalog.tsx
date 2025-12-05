import { Layout } from "@/components/Layout";
import { PhoneCard } from "@/components/PhoneCard";
import { FilterBar, FilterState } from "@/components/FilterBar";
import { useStore } from "@/store/useStore";
import { useState, useMemo } from "react";

export default function Catalog() {
  const phones = useStore((state) => state.phones);
  const [filteredPhones, setFilteredPhones] = useState(phones);

  const handleFilterChange = (filters: FilterState) => {
    let result = [...phones];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q)
      );
    }

    // Brand
    if (filters.brand !== 'all') {
      result = result.filter(p => p.brand === filters.brand);
    }

    // RAM
    if (filters.minRam > 0) {
      result = result.filter(p => p.ram >= filters.minRam);
    }

    // Price
    result = result.filter(p => p.ouPrice <= filters.maxPrice);

    // Sort
    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.ouPrice - b.ouPrice);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.ouPrice - a.ouPrice);
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
    }

    setFilteredPhones(result);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-4xl mb-4 text-primary">Phone Catalog</h1>
        <p className="text-muted-foreground">Browse our collection of verified smartphones with transparent pricing.</p>
      </div>

      <FilterBar phones={phones} onFilterChange={handleFilterChange} />

      {filteredPhones.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-bold text-muted-foreground">No phones found matching your criteria.</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhones.map((phone) => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </div>
      )}
    </Layout>
  );
}

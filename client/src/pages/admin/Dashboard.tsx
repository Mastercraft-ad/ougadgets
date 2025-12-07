import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, DollarSign, TrendingUp, Activity, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Phone } from "@/store/useStore";

interface AdminProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminDashboard() {
  const { data: phones = [], isLoading } = useQuery<Phone[]>({
    queryKey: ['/api/phones'],
  });

  const { data: profile } = useQuery<AdminProfile>({
    queryKey: ['/api/admin/profile'],
  });

  const totalInventoryValue = phones.reduce((acc, curr) => acc + curr.ouPrice, 0);
  const totalPotentialProfit = phones.reduce((acc, curr) => acc + (curr.marketPrice - curr.ouPrice), 0);
  const uniqueBrands = new Set(phones.map(p => p.brand)).size;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
  };

  const stats = [
    {
      title: "Total Phones",
      value: phones.length,
      icon: Smartphone,
      desc: "Active in catalog",
      color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
    },
    {
      title: "Inventory Value",
      value: formatCurrency(totalInventoryValue),
      icon: DollarSign,
      desc: "Total O&U Price",
      color: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
    },
    {
      title: "Brands Stocked",
      value: uniqueBrands,
      icon: Activity,
      desc: "Across all categories",
      color: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30",
    },
    {
      title: "Customer Savings",
      value: formatCurrency(totalPotentialProfit),
      icon: TrendingUp,
      desc: "Market vs O&U Diff",
      color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30",
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  const adminName = profile?.name || "Admin";

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-primary" data-testid="text-dashboard-title">Dashboard Overview</h1>
        <p className="text-muted-foreground" data-testid="text-dashboard-greeting">Welcome back, {adminName}. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-shadow" data-testid={`card-stat-${i}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`text-stat-value-${i}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently Added</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {phones.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No products in catalog yet.</p>
            ) : (
              phones.slice(0, 5).map((phone) => (
                <div key={phone.id} className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0" data-testid={`row-recent-phone-${phone.id}`}>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      <img src={phone.images[0]} alt={phone.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{phone.name}</p>
                      <p className="text-xs text-muted-foreground">{phone.brand} - {formatCurrency(phone.ouPrice)}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex-shrink-0">
                    {phone.addedDate ? new Date(phone.addedDate).toLocaleDateString() : 'Recently'}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

import { AdminLayout } from "@/components/admin/AdminLayout";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, DollarSign, TrendingUp, Activity } from "lucide-react";

export default function AdminDashboard() {
  const phones = useStore((state) => state.phones);

  const totalInventoryValue = phones.reduce((acc, curr) => acc + curr.ouPrice, 0);
  const totalPotentialProfit = phones.reduce((acc, curr) => acc + (curr.marketPrice - curr.ouPrice), 0); // Just a metric for fun
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
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Inventory Value",
      value: formatCurrency(totalInventoryValue),
      icon: DollarSign,
      desc: "Total O&U Price",
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Brands Stocked",
      value: uniqueBrands,
      icon: Activity,
      desc: "Across all categories",
      color: "text-purple-600 bg-purple-100",
    },
    {
      title: "Customer Savings",
      value: formatCurrency(totalPotentialProfit),
      icon: TrendingUp,
      desc: "Market vs O&U Diff",
      color: "text-amber-600 bg-amber-100",
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-primary">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Table Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Added</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {phones.slice(0, 5).map((phone) => (
              <div key={phone.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden">
                    <img src={phone.images[0]} alt={phone.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">{phone.name}</p>
                    <p className="text-xs text-muted-foreground">{phone.brand} • {formatCurrency(phone.ouPrice)}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(phone.addedDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

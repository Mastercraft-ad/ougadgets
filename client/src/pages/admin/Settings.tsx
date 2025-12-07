import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";

interface Settings {
  storeName: string;
  currency: string;
  contactPhone: string;
  publicCatalog: string;
  priceComparison: string;
}

const defaultSettings: Settings = {
  storeName: "O&U Gadgets",
  currency: "₦",
  contactPhone: "+234 800 000 0000",
  publicCatalog: "true",
  priceComparison: "true",
};

export default function AdminSettings() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Settings>(defaultSettings);

  const { data: settings, isLoading } = useQuery<Record<string, string>>({
    queryKey: ['/api/settings'],
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || defaultSettings.storeName,
        currency: settings.currency || defaultSettings.currency,
        contactPhone: settings.contactPhone || defaultSettings.contactPhone,
        publicCatalog: settings.publicCatalog || defaultSettings.publicCatalog,
        priceComparison: settings.priceComparison || defaultSettings.priceComparison,
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: Settings) => {
      const response = await apiRequest('PUT', '/api/settings', data);
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Settings Saved",
        description: "Platform configuration has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save settings.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-primary">Platform Settings</h1>
        <p className="text-muted-foreground">Configure global store settings.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Configuration</CardTitle>
            <CardDescription>Basic store details and currency settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input 
                id="storeName" 
                value={formData.storeName}
                onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                data-testid="input-store-name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currency">Currency Symbol</Label>
              <Input 
                id="currency" 
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                data-testid="input-currency"
              />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="contact">Contact Phone</Label>
              <Input 
                id="contact" 
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                data-testid="input-contact-phone"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Toggles</CardTitle>
            <CardDescription>Enable or disable specific platform features.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Catalog</Label>
                <p className="text-xs text-muted-foreground">Visible to all users</p>
              </div>
              <Switch 
                checked={formData.publicCatalog === "true"}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, publicCatalog: checked ? "true" : "false" }))}
                data-testid="switch-public-catalog"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Price Comparison</Label>
                <p className="text-xs text-muted-foreground">Show market vs O&U price</p>
              </div>
              <Switch 
                checked={formData.priceComparison === "true"}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, priceComparison: checked ? "true" : "false" }))}
                data-testid="switch-price-comparison"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" disabled={saveMutation.isPending} data-testid="button-save-settings">
            {saveMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saveMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

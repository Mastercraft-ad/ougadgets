import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Platform configuration has been updated.",
    });
  };

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
              <Input id="storeName" defaultValue="O&U Gadgets" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currency">Currency Symbol</Label>
              <Input id="currency" defaultValue="₦" />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="contact">Contact Phone</Label>
              <Input id="contact" defaultValue="+234 800 000 0000" />
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
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Price Comparison</Label>
                <p className="text-xs text-muted-foreground">Show market vs O&U price</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>WhatsApp Integration</Label>
                <p className="text-xs text-muted-foreground">Allow direct chat from product page</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

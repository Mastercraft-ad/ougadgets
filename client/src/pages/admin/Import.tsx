import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Download, FileText, Check, AlertCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parseCSV, generateCSVTemplate } from "@/lib/csvParser";
import { useStore, Phone } from "@/store/useStore";
import { Badge } from "@/components/ui/badge";

export default function AdminImport() {
  const { toast } = useToast();
  const { phones, setPhones } = useStore();
  const [csvText, setCsvText] = useState("");
  const [previewData, setPreviewData] = useState<Phone[]>([]);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      handlePreview(text);
    };
    reader.readAsText(file);
  };

  const handlePreview = (text: string) => {
    try {
      setImportError(null);
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        setImportError("No valid data found in CSV. Check your format.");
        setPreviewData([]);
        return;
      }
      setPreviewData(parsed);
    } catch (err) {
      setImportError("Failed to parse CSV. Please check the format.");
      setPreviewData([]);
    }
  };

  const handleImport = () => {
    if (previewData.length === 0) {
      toast({
        title: "No data to import",
        description: "Please paste or upload valid CSV data first.",
        variant: "destructive",
      });
      return;
    }

    const newPhones = [...phones, ...previewData];
    setPhones(newPhones);
    
    toast({
      title: "Import Successful",
      description: `${previewData.length} phone(s) added to the catalog.`,
    });

    setCsvText("");
    setPreviewData([]);
  };

  const handleDownloadTemplate = () => {
    const template = generateCSVTemplate();
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "phones_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-primary">Import Products</h1>
        <p className="text-muted-foreground">Bulk add phones via CSV file or paste text.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                CSV Template
              </CardTitle>
              <CardDescription>
                Download and fill out our template to ensure correct formatting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={handleDownloadTemplate} data-testid="button-download-template">
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              <div className="mt-4 p-3 bg-muted rounded-lg text-xs font-mono overflow-x-auto">
                <p className="text-muted-foreground mb-2">Expected columns:</p>
                <code className="text-foreground">
                  id, name, brand, ram, rom, color, battery, camera, frontCamera, marketPrice, jumiaPrice, ouPrice, description, images, condition
                </code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload or Paste CSV
              </CardTitle>
              <CardDescription>
                Upload a .csv file or paste your data directly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                  data-testid="input-csv-file"
                />
                <label htmlFor="csv-upload">
                  <Button variant="outline" asChild className="cursor-pointer">
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Choose CSV File
                    </span>
                  </Button>
                </label>
              </div>

              <div className="relative">
                <Textarea
                  placeholder="Or paste your CSV data here..."
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="min-h-[200px] font-mono text-xs"
                  data-testid="textarea-csv-paste"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handlePreview(csvText)} 
                  variant="secondary"
                  disabled={!csvText.trim()}
                  data-testid="button-preview"
                >
                  Preview Data
                </Button>
                <Button 
                  onClick={() => { setCsvText(""); setPreviewData([]); setImportError(null); }}
                  variant="ghost"
                  data-testid="button-clear"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>

              {importError && (
                <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  {importError}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="lg:row-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  {previewData.length > 0 
                    ? `${previewData.length} phone(s) ready to import`
                    : "No data to preview yet"
                  }
                </CardDescription>
              </div>
              {previewData.length > 0 && (
                <Button onClick={handleImport} data-testid="button-import">
                  <Check className="mr-2 h-4 w-4" />
                  Import All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {previewData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Upload or paste CSV data to see preview</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Specs</TableHead>
                      <TableHead className="text-right">O&U Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((phone, idx) => (
                      <TableRow key={phone.id || idx}>
                        <TableCell className="font-medium">{phone.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{phone.brand}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {phone.ram}GB / {phone.rom}GB / {phone.battery}mAh
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          {formatCurrency(phone.ouPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

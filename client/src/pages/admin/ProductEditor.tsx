import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Phone } from "@/store/useStore";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Save, Image as ImageIcon, Smartphone, DollarSign, Layers, Upload, Youtube, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

const phoneSchema = z.object({
  name: z.string().min(2, "Name is required"),
  brand: z.string().min(2, "Brand is required"),
  ram: z.coerce.number().min(1, "RAM is required"),
  rom: z.coerce.number().min(1, "ROM is required"),
  color: z.string().min(1, "Color is required"),
  battery: z.coerce.number().min(1, "Battery is required"),
  camera: z.coerce.number().min(1, "Main Camera is required"),
  frontCamera: z.coerce.number().min(1, "Front Camera is required"),
  marketPrice: z.coerce.number().min(0, "Market Price is required"),
  jumiaPrice: z.coerce.number().min(0, "Jumia Price is required"),
  ouPrice: z.coerce.number().min(0, "O&U Price is required"),
  condition: z.string().min(1, "Condition is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  images: z.string().min(5, "At least one image is required"), 
  os: z.string().optional(),
  sim: z.string().optional(),
  inspectionVideo: z.string().optional(),
});

export default function ProductEditor() {
  const [, params] = useRoute("/admin/products/edit/:id");
  const [, setLocation] = useLocation();
  const isEditMode = !!params?.id;
  
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: phoneToEdit, isLoading: isLoadingPhone } = useQuery<Phone>({
    queryKey: ['/api/phones', params?.id],
    enabled: isEditMode && !!params?.id,
  });

  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      name: "",
      brand: "",
      ram: 4,
      rom: 64,
      color: "",
      battery: 5000,
      camera: 12,
      frontCamera: 8,
      marketPrice: 0,
      jumiaPrice: 0,
      ouPrice: 0,
      condition: "New",
      description: "",
      images: "",
      os: "Android",
      sim: "Dual SIM (Nano-SIM)",
      inspectionVideo: "",
    },
  });

  // Watch image field for preview
  const imageUrls = form.watch("images");
  
  useEffect(() => {
    if (imageUrls) {
      const firstImage = imageUrls.split("|")[0].trim();
      if (firstImage) setImagePreview(firstImage);
    }
  }, [imageUrls]);

  useEffect(() => {
    if (isEditMode && phoneToEdit) {
      form.reset({
        ...phoneToEdit,
        images: phoneToEdit.images.join("|"),
        os: phoneToEdit.os || "Android",
        sim: phoneToEdit.sim || "Dual SIM (Nano-SIM)",
        inspectionVideo: phoneToEdit.inspectionVideo || "",
      });
    }
  }, [isEditMode, phoneToEdit, form]);

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof phoneSchema>) => {
      const imageArray = data.images.split("|").map(s => s.trim()).filter(s => s !== "");
      const response = await apiRequest('POST', '/api/phones', {
        ...data,
        images: imageArray,
      });
      if (!response.ok) {
        throw new Error('Failed to create phone');
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/phones'] });
      toast({ title: "Product Created", description: `${variables.name} has been added to catalog.` });
      setLocation("/admin/products");
    },
    onError: (error: Error) => {
      toast({
        title: "Create Failed",
        description: error.message || "Failed to create the product.",
        variant: "destructive"
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof phoneSchema>) => {
      const imageArray = data.images.split("|").map(s => s.trim()).filter(s => s !== "");
      const response = await apiRequest('PUT', `/api/phones/${params?.id}`, {
        ...data,
        images: imageArray,
      });
      if (!response.ok) {
        throw new Error('Failed to update phone');
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/phones'] });
      toast({ title: "Product Updated", description: `${variables.name} has been updated.` });
      setLocation("/admin/products");
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update the product.",
        variant: "destructive"
      });
    },
  });

  function onSubmit(values: z.infer<typeof phoneSchema>) {
    if (isEditMode) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const currentImages = form.getValues("images");
        const newImages = currentImages ? `${currentImages}|${base64String}` : base64String;
        form.setValue("images", newImages);
        setImagePreview(base64String);
        toast({ title: "Image Uploaded", description: "Image converted to base64 string." });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setLocation("/admin/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-heading font-bold text-3xl text-primary">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? `Editing details for ${phoneToEdit?.name}` : "Create a new product listing"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => setLocation("/admin/products")} disabled={isSaving}>Discard</Button>
           <Button onClick={form.handleSubmit(onSubmit)} className="gap-2" disabled={isSaving}>
             {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
             {isSaving ? "Saving..." : "Save Product"}
           </Button>
        </div>
      </div>

      {isEditMode && isLoadingPhone && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {(!isEditMode || (isEditMode && !isLoadingPhone)) && (

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <CardTitle>Basic Information</CardTitle>
                  </div>
                  <CardDescription>Core product details and identification.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Samsung Galaxy S23 Ultra" className="text-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select brand" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["Apple", "Samsung", "Xiaomi", "Tecno", "Infinix", "Google", "OnePlus", "Oppo", "Vivo", "Nokia"].map(b => (
                                <SelectItem key={b} value={b}>{b}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condition</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Used - Like New">Used - Like New</SelectItem>
                              <SelectItem value="Used - Excellent">Used - Excellent</SelectItem>
                              <SelectItem value="Used - Good">Used - Good</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea rows={6} placeholder="Detailed product description..." className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    <CardTitle>Technical Specifications</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <FormField control={form.control} name="ram" render={({ field }) => (
                        <FormItem>
                          <FormLabel>RAM (GB)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="rom" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage (GB)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="battery" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Battery (mAh)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                       <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Black" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="col-span-2 md:col-span-2">
                        <Separator className="my-4 md:hidden" />
                      </div>

                      <FormField control={form.control} name="camera" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Main Camera (MP)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="frontCamera" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selfie Camera (MP)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField control={form.control} name="os" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operating System</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select OS" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Android">Android</SelectItem>
                            <SelectItem value="iOS">iOS</SelectItem>
                            <SelectItem value="HarmonyOS">HarmonyOS</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="sim" render={({ field }) => (
                      <FormItem>
                        <FormLabel>SIM Support</FormLabel>
                        <FormControl><Input placeholder="e.g. Dual SIM" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                 </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Pricing & Media */}
            <div className="space-y-8">
              <Card className="border-primary/20 shadow-md bg-slate-50/50">
                <CardHeader>
                   <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <CardTitle>Pricing</CardTitle>
                  </div>
                  <CardDescription>Set your competitive pricing strategy.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="ouPrice" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-bold">O&U Price (₦)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₦</span>
                          <Input type="number" className="pl-8 border-primary/30 bg-white font-bold text-lg" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="jumiaPrice" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Jumia Market</FormLabel>
                        <FormControl><Input type="number" className="bg-white" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="marketPrice" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Other Retailers</FormLabel>
                        <FormControl><Input type="number" className="bg-white" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <CardTitle>Media</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {imagePreview ? (
                    <div className="aspect-video w-full bg-slate-100 rounded-lg overflow-hidden border mb-4 relative group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div 
                      className="aspect-video w-full bg-slate-50 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 mb-2 opacity-50" />
                      <span className="text-xs">Click to upload image</span>
                    </div>
                  )}

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button type="button" variant="secondary" size="sm" className="w-full" onClick={() => fileInputRef.current?.click()}>
                      Upload File
                    </Button>
                  </div>

                  <FormField control={form.control} name="images" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URLs</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="https://example.com/image1.jpg | https://example.com/image2.jpg" 
                          className="font-mono text-xs"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Or paste URLs manually (pipe separated).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Separator className="my-4" />

                  <FormField control={form.control} name="inspectionVideo" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-red-500" />
                        Inspection Video
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://www.youtube.com/watch?v=..." 
                          className="font-mono text-xs"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        YouTube video URL for device inspection.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </div>

          </div>
        </form>
      </Form>
      )}
    </AdminLayout>
  );
}

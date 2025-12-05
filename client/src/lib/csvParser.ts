import { Phone } from "@/store/useStore";

export const parseCSV = (csvText: string): Phone[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const phones: Phone[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) continue;

    const phone: any = {};
    headers.forEach((header, index) => {
      // Simple mapping logic
      let value: any = values[index];
      
      // Handle number fields
      if (['ram', 'rom', 'battery', 'camera', 'frontCamera', 'marketPrice', 'jumiaPrice', 'ouPrice'].includes(header)) {
        value = Number(value);
      }
      
      // Handle array fields (images) - expects pipe separated in CSV for simplicity
      if (header === 'images') {
        value = value.split('|');
      }

      phone[header] = value;
    });

    // Ensure required fields or defaults
    if (!phone.id) phone.id = `csv-${Date.now()}-${i}`;
    if (!phone.addedDate) phone.addedDate = new Date().toISOString();
    
    phones.push(phone as Phone);
  }

  return phones;
};

export const generateCSVTemplate = () => {
  return "id,name,brand,ram,rom,color,battery,camera,frontCamera,marketPrice,jumiaPrice,ouPrice,description,images,condition\n" +
         "p100,New Phone,Samsung,8,256,Black,5000,64,32,200000,190000,180000,Great phone,https://example.com/img1.jpg|https://example.com/img2.jpg,New";
};

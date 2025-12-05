import { db } from "./db";
import { adminUsers, phones } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const existingAdmin = await db.select().from(adminUsers).limit(1);
  if (existingAdmin.length === 0) {
    console.log("Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(adminUsers).values({
      username: "admin",
      email: "admin@ougadgets.com",
      password: hashedPassword,
      name: "Admin User",
      role: "admin",
      phone: "+234 800 000 0000",
    });
    console.log("Admin user created (username: admin, password: admin123)");
  } else {
    console.log("Admin user already exists, skipping...");
  }

  const existingPhones = await db.select().from(phones).limit(1);
  if (existingPhones.length === 0) {
    console.log("Creating phone catalog...");
    const phoneData = [
      {
        name: "O&U Galaxy A33",
        brand: "Samsung",
        ram: 6,
        rom: 128,
        color: "Black",
        battery: 5000,
        camera: 48,
        frontCamera: 13,
        marketPrice: 180000,
        jumiaPrice: 175000,
        ouPrice: 150000,
        description: "Reliable midrange phone with strong battery life and good camera.",
        images: [
          "https://images.unsplash.com/photo-1610945415295-d96bf067153c?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800"
        ],
        condition: "New",
        os: "Android 13",
        sim: "Dual SIM",
        inspectionVideo: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        name: "O&U Note 12",
        brand: "Xiaomi",
        ram: 8,
        rom: 256,
        color: "Blue",
        battery: 6000,
        camera: 108,
        frontCamera: 32,
        marketPrice: 220000,
        jumiaPrice: 215000,
        ouPrice: 190000,
        description: "High-capacity battery and flagship-level camera at an affordable price.",
        images: [
          "https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&q=80&w=800"
        ],
        condition: "New",
        os: "MIUI 14",
        sim: "Dual SIM",
      },
      {
        name: "O&U Pixel Lite",
        brand: "Google",
        ram: 4,
        rom: 64,
        color: "White",
        battery: 4000,
        camera: 12,
        frontCamera: 8,
        marketPrice: 150000,
        jumiaPrice: 148000,
        ouPrice: 120000,
        description: "Clean Android experience for budget-conscious buyers.",
        images: [
          "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800"
        ],
        condition: "Used - Good",
        os: "Android 14",
        sim: "Single SIM",
        inspectionVideo: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        name: "O&U iPhone 13 Pro",
        brand: "Apple",
        ram: 6,
        rom: 256,
        color: "Graphite",
        battery: 3095,
        camera: 12,
        frontCamera: 12,
        marketPrice: 450000,
        jumiaPrice: 440000,
        ouPrice: 410000,
        description: "Pro camera system, super retina XDR display, and A15 Bionic chip.",
        images: [
          "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=800"
        ],
        condition: "New",
        os: "iOS 17",
        sim: "Dual eSIM",
        inspectionVideo: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        name: "O&U Nord 2T",
        brand: "OnePlus",
        ram: 12,
        rom: 256,
        color: "Gray",
        battery: 4500,
        camera: 50,
        frontCamera: 32,
        marketPrice: 200000,
        jumiaPrice: 195000,
        ouPrice: 175000,
        description: "Everything you could ask for. Fast charging and smooth performance.",
        images: [
          "https://images.unsplash.com/photo-1626218174358-77b7f9a4cd00?auto=format&fit=crop&q=80&w=800"
        ],
        condition: "Used - Like New",
        os: "OxygenOS 13",
        sim: "Dual SIM",
      },
      {
        name: "O&U Redmi 10",
        brand: "Xiaomi",
        ram: 4,
        rom: 64,
        color: "Sea Blue",
        battery: 5000,
        camera: 50,
        frontCamera: 8,
        marketPrice: 95000,
        jumiaPrice: 90000,
        ouPrice: 82000,
        description: "Level up! 50MP AI quad camera and 90Hz FHD+ display.",
        images: [
          "https://images.unsplash.com/photo-1609252926632-c7b415f69728?auto=format&fit=crop&q=80&w=800"
        ],
        condition: "New",
        os: "MIUI 13",
        sim: "Dual SIM",
        inspectionVideo: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        name: "O&U Galaxy S22",
        brand: "Samsung",
        ram: 8,
        rom: 128,
        color: "Phantom Black",
        battery: 3700,
        camera: 50,
        frontCamera: 10,
        marketPrice: 320000,
        jumiaPrice: 315000,
        ouPrice: 290000,
        description: "Nightography camera, storage to save all your night shots.",
        images: [
          "https://images.unsplash.com/photo-1610945265064-f4521994a29f?auto=format&fit=crop&q=80&w=800"
        ],
        condition: "Used - Excellent",
        os: "Android 14",
        sim: "Dual SIM",
      },
      {
        name: "O&U Spark 10 Pro",
        brand: "Tecno",
        ram: 8,
        rom: 128,
        color: "Starry Black",
        battery: 5000,
        camera: 50,
        frontCamera: 32,
        marketPrice: 120000,
        jumiaPrice: 115000,
        ouPrice: 105000,
        description: "Glow up your selfie game with 32MP glowing selfie camera.",
        images: [
          "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&q=80&w=800"
        ],
        condition: "New",
        os: "HiOS 12",
        sim: "Dual SIM",
        inspectionVideo: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
    ];

    for (const phone of phoneData) {
      await db.insert(phones).values(phone);
    }
    console.log(`Created ${phoneData.length} phones in catalog`);
  } else {
    console.log("Phones already exist, skipping...");
  }

  console.log("Database seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

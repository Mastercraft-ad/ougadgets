import { db } from "./db";
import { adminUsers } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const existingAdmin = await db.select().from(adminUsers).limit(1);
  if (existingAdmin.length === 0) {
    console.log("Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin@ougadgets.com", 10);
    await db.insert(adminUsers).values({
      username: "oanduadmin",
      email: "admin@ougadgets.com",
      password: hashedPassword,
      name: "Admin User",
      role: "admin",
      phone: "+234 800 000 0000",
    });
    console.log("Admin user created (username: oanduadmin, password: admin@ougadgets.com)");
  } else {
    console.log("Admin user already exists, skipping...");
  }

  console.log("Database seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

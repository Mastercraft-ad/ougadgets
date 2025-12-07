import { 
  type User, 
  type InsertUser, 
  type AdminUser, 
  type InsertAdminUser, 
  type UpdateAdminProfile,
  type Phone,
  type InsertPhone,
  type UpdatePhone,
  type Setting,
  users,
  adminUsers,
  phones,
  settings
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: string, updates: UpdateAdminProfile): Promise<AdminUser | undefined>;
  updateAdminPassword(id: string, newPassword: string): Promise<boolean>;
  verifyAdminPassword(username: string, password: string): Promise<AdminUser | null>;
  
  getAllPhones(): Promise<Phone[]>;
  getPhone(id: string): Promise<Phone | undefined>;
  createPhone(phone: InsertPhone): Promise<Phone>;
  updatePhone(id: string, updates: UpdatePhone): Promise<Phone | undefined>;
  deletePhone(id: string): Promise<boolean>;
  
  getAllSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  upsertSetting(key: string, value: string): Promise<Setting>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return admin || undefined;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return admin || undefined;
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return admin || undefined;
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [admin] = await db.insert(adminUsers).values({
      ...insertUser,
      password: hashedPassword,
    }).returning();
    return admin;
  }

  async updateAdminUser(id: string, updates: UpdateAdminProfile): Promise<AdminUser | undefined> {
    const [admin] = await db
      .update(adminUsers)
      .set({ ...updates, lastActive: new Date() })
      .where(eq(adminUsers.id, id))
      .returning();
    return admin || undefined;
  }

  async updateAdminPassword(id: string, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await db
      .update(adminUsers)
      .set({ password: hashedPassword, lastActive: new Date() })
      .where(eq(adminUsers.id, id))
      .returning();
    return result.length > 0;
  }

  async verifyAdminPassword(username: string, password: string): Promise<AdminUser | null> {
    const admin = await this.getAdminUserByUsername(username);
    if (!admin) return null;
    
    const isValid = await bcrypt.compare(password, admin.password);
    return isValid ? admin : null;
  }

  async getAllPhones(): Promise<Phone[]> {
    return db.select().from(phones);
  }

  async getPhone(id: string): Promise<Phone | undefined> {
    const [phone] = await db.select().from(phones).where(eq(phones.id, id));
    return phone || undefined;
  }

  async createPhone(insertPhone: InsertPhone): Promise<Phone> {
    const [phone] = await db.insert(phones).values(insertPhone).returning();
    return phone;
  }

  async updatePhone(id: string, updates: UpdatePhone): Promise<Phone | undefined> {
    const [phone] = await db
      .update(phones)
      .set(updates)
      .where(eq(phones.id, id))
      .returning();
    return phone || undefined;
  }

  async deletePhone(id: string): Promise<boolean> {
    const result = await db.delete(phones).where(eq(phones.id, id)).returning();
    return result.length > 0;
  }

  async getAllSettings(): Promise<Setting[]> {
    return db.select().from(settings);
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || undefined;
  }

  async upsertSetting(key: string, value: string): Promise<Setting> {
    const existing = await this.getSetting(key);
    if (existing) {
      const [updated] = await db
        .update(settings)
        .set({ value })
        .where(eq(settings.key, key))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(settings).values({ key, value }).returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();

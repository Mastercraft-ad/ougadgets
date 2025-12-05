import { 
  type User, 
  type InsertUser, 
  type AdminUser, 
  type InsertAdminUser, 
  type UpdateAdminProfile,
  type Phone,
  type InsertPhone,
  type UpdatePhone
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import defaultPhones from "../client/src/data/phones.json";

// Phone type for storage (with string addedDate for JSON compatibility)
interface StoragePhone {
  id: string;
  name: string;
  brand: string;
  ram: number;
  rom: number;
  color: string;
  battery: number;
  camera: number;
  frontCamera: number;
  marketPrice: number;
  jumiaPrice: number;
  ouPrice: number;
  description: string;
  images: string[];
  addedDate: Date;
  condition: string;
  os?: string | null;
  sim?: string | null;
  inspectionVideo?: string | null;
}

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
  
  // Phone operations
  getAllPhones(): Promise<StoragePhone[]>;
  getPhone(id: string): Promise<StoragePhone | undefined>;
  createPhone(phone: InsertPhone): Promise<StoragePhone>;
  updatePhone(id: string, updates: UpdatePhone): Promise<StoragePhone | undefined>;
  deletePhone(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private adminUsers: Map<string, AdminUser>;
  private phones: Map<string, StoragePhone>;
  private initialized: boolean = false;

  constructor() {
    this.users = new Map();
    this.adminUsers = new Map();
    this.phones = new Map();
    this.initializeDefaultData();
  }
  
  private initializeDefaultData() {
    this.initializeDefaultAdmin();
    this.initializeDefaultPhones();
  }
  
  private initializeDefaultPhones() {
    for (const phone of defaultPhones) {
      const storagePhone: StoragePhone = {
        id: phone.id,
        name: phone.name,
        brand: phone.brand,
        ram: phone.ram,
        rom: phone.rom,
        color: phone.color,
        battery: phone.battery,
        camera: phone.camera,
        frontCamera: phone.frontCamera,
        marketPrice: phone.marketPrice,
        jumiaPrice: phone.jumiaPrice,
        ouPrice: phone.ouPrice,
        description: phone.description,
        images: phone.images,
        addedDate: new Date(phone.addedDate),
        condition: phone.condition,
        inspectionVideo: phone.inspectionVideo || null,
      };
      this.phones.set(phone.id, storagePhone);
    }
  }

  private async initializeDefaultAdmin() {
    if (this.initialized) return;
    this.initialized = true;
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const defaultAdmin: AdminUser = {
      id: 'admin-001',
      username: 'admin',
      email: 'admin@ougadgets.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      avatar: 'https://github.com/shadcn.png',
      phone: '+234 800 000 0000',
      joinedDate: new Date('2024-01-15'),
      lastActive: new Date(),
    };
    this.adminUsers.set(defaultAdmin.id, defaultAdmin);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    return this.adminUsers.get(id);
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(
      (user) => user.username === username,
    );
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(
      (user) => user.email === email,
    );
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const adminUser: AdminUser = { 
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: hashedPassword,
      name: insertUser.name,
      role: insertUser.role || 'staff',
      avatar: insertUser.avatar || null,
      phone: insertUser.phone || null,
      joinedDate: new Date(),
      lastActive: new Date(),
    };
    this.adminUsers.set(id, adminUser);
    return adminUser;
  }

  async updateAdminUser(id: string, updates: UpdateAdminProfile): Promise<AdminUser | undefined> {
    const adminUser = this.adminUsers.get(id);
    if (!adminUser) return undefined;
    
    const updatedUser: AdminUser = {
      ...adminUser,
      ...updates,
      lastActive: new Date(),
    };
    this.adminUsers.set(id, updatedUser);
    return updatedUser;
  }

  async updateAdminPassword(id: string, newPassword: string): Promise<boolean> {
    const adminUser = this.adminUsers.get(id);
    if (!adminUser) return false;
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    adminUser.password = hashedPassword;
    adminUser.lastActive = new Date();
    this.adminUsers.set(id, adminUser);
    return true;
  }

  async verifyAdminPassword(username: string, password: string): Promise<AdminUser | null> {
    const adminUser = await this.getAdminUserByUsername(username);
    if (!adminUser) return null;
    
    const isValid = await bcrypt.compare(password, adminUser.password);
    return isValid ? adminUser : null;
  }
  
  // Phone CRUD operations
  async getAllPhones(): Promise<StoragePhone[]> {
    return Array.from(this.phones.values());
  }
  
  async getPhone(id: string): Promise<StoragePhone | undefined> {
    return this.phones.get(id);
  }
  
  async createPhone(insertPhone: InsertPhone): Promise<StoragePhone> {
    const id = randomUUID();
    const phone: StoragePhone = {
      ...insertPhone,
      id,
      addedDate: new Date(),
      os: insertPhone.os || null,
      sim: insertPhone.sim || null,
      inspectionVideo: insertPhone.inspectionVideo || null,
    };
    this.phones.set(id, phone);
    return phone;
  }
  
  async updatePhone(id: string, updates: UpdatePhone): Promise<StoragePhone | undefined> {
    const phone = this.phones.get(id);
    if (!phone) return undefined;
    
    const updatedPhone: StoragePhone = {
      ...phone,
      ...updates,
    };
    this.phones.set(id, updatedPhone);
    return updatedPhone;
  }
  
  async deletePhone(id: string): Promise<boolean> {
    return this.phones.delete(id);
  }
}

export const storage = new MemStorage();

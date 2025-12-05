import { 
  type User, 
  type InsertUser, 
  type AdminUser, 
  type InsertAdminUser, 
  type UpdateAdminProfile 
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private adminUsers: Map<string, AdminUser>;

  constructor() {
    this.users = new Map();
    this.adminUsers = new Map();
    
    const defaultAdmin: AdminUser = {
      id: 'admin-001',
      username: 'admin',
      email: 'admin@ougadgets.com',
      password: 'admin123',
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
    const adminUser: AdminUser = { 
      ...insertUser, 
      id,
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
    
    adminUser.password = newPassword;
    adminUser.lastActive = new Date();
    this.adminUsers.set(id, adminUser);
    return true;
  }
}

export const storage = new MemStorage();

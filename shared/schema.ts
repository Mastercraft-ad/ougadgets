import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Phone schema
export const phones = pgTable("phones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  ram: integer("ram").notNull(),
  rom: integer("rom").notNull(),
  color: text("color").notNull(),
  battery: integer("battery").notNull(),
  camera: integer("camera").notNull(),
  frontCamera: integer("front_camera").notNull(),
  marketPrice: integer("market_price").notNull(),
  jumiaPrice: integer("jumia_price").notNull(),
  ouPrice: integer("ou_price").notNull(),
  description: text("description").notNull(),
  images: text("images").array().notNull(),
  addedDate: timestamp("added_date").notNull().defaultNow(),
  condition: text("condition").notNull(),
  os: text("os"),
  sim: text("sim"),
  inspectionVideo: text("inspection_video"),
});

export const insertPhoneSchema = createInsertSchema(phones).omit({
  id: true,
  addedDate: true,
});

export const updatePhoneSchema = z.object({
  name: z.string().optional(),
  brand: z.string().optional(),
  ram: z.number().optional(),
  rom: z.number().optional(),
  color: z.string().optional(),
  battery: z.number().optional(),
  camera: z.number().optional(),
  frontCamera: z.number().optional(),
  marketPrice: z.number().optional(),
  jumiaPrice: z.number().optional(),
  ouPrice: z.number().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  condition: z.string().optional(),
  os: z.string().nullable().optional(),
  sim: z.string().nullable().optional(),
  inspectionVideo: z.string().nullable().optional(),
});

export type InsertPhone = z.infer<typeof insertPhoneSchema>;
export type Phone = typeof phones.$inferSelect;
export type UpdatePhone = z.infer<typeof updatePhoneSchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("staff"),
  avatar: text("avatar"),
  phone: text("phone"),
  joinedDate: timestamp("joined_date").notNull().defaultNow(),
  lastActive: timestamp("last_active").notNull().defaultNow(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  joinedDate: true,
  lastActive: true,
});

export const updateAdminProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type UpdateAdminProfile = z.infer<typeof updateAdminProfileSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
});

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingsSchema>;

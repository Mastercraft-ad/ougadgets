import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import { updateAdminProfileSchema, changePasswordSchema, insertPhoneSchema, updatePhoneSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads", "avatars");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

// Auth middleware for protected admin routes
const requireAuth = (req: Request, res: Response, next: Function) => {
  if (!req.session?.adminId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.use("/uploads", (req, res, next) => {
    res.setHeader("Cache-Control", "no-cache");
    next();
  }, express.static(path.join(process.cwd(), "uploads")));

  // Login endpoint
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const verifiedUser = await storage.verifyAdminPassword(username, password);
      if (!verifiedUser) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.adminId = verifiedUser.id;
      req.session.adminUsername = verifiedUser.username;

      const { password: pwd, ...userWithoutPassword } = verifiedUser;
      res.json({ message: "Login successful", user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Check auth status
  app.get("/api/auth/status", (req: Request, res: Response) => {
    if (req.session?.adminId) {
      res.json({ authenticated: true, adminId: req.session.adminId });
    } else {
      res.json({ authenticated: false });
    }
  });

  app.get("/api/admin/profile", requireAuth, async (req: Request, res: Response) => {
    try {
      const adminUser = await storage.getAdminUser(req.session.adminId!);
      if (!adminUser) {
        return res.status(404).json({ error: "Admin user not found" });
      }
      
      const { password, ...userWithoutPassword } = adminUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.patch("/api/admin/profile", requireAuth, async (req: Request, res: Response) => {
    try {
      const validationResult = updateAdminProfileSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.errors });
      }

      const adminUser = await storage.getAdminUser(req.session.adminId!);
      if (!adminUser) {
        return res.status(404).json({ error: "Admin user not found" });
      }

      if (validationResult.data.email && validationResult.data.email !== adminUser.email) {
        const existingUser = await storage.getAdminUserByEmail(validationResult.data.email);
        if (existingUser && existingUser.id !== adminUser.id) {
          return res.status(400).json({ error: "Email already in use" });
        }
      }

      const updatedUser = await storage.updateAdminUser(adminUser.id, validationResult.data);
      if (!updatedUser) {
        return res.status(500).json({ error: "Failed to update profile" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.post("/api/admin/change-password", requireAuth, async (req: Request, res: Response) => {
    try {
      const validationResult = changePasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.errors });
      }

      const { currentPassword, newPassword } = validationResult.data;
      
      const adminUser = await storage.getAdminUser(req.session.adminId!);
      if (!adminUser) {
        return res.status(404).json({ error: "Admin user not found" });
      }
      
      const verifiedUser = await storage.verifyAdminPassword(adminUser.username, currentPassword);
      if (!verifiedUser) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      const success = await storage.updateAdminPassword(verifiedUser.id, newPassword);
      if (!success) {
        return res.status(500).json({ error: "Failed to update password" });
      }

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  app.post("/api/admin/avatar", requireAuth, upload.single("avatar"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const adminUser = await storage.getAdminUser(req.session.adminId!);
      if (!adminUser) {
        return res.status(404).json({ error: "Admin user not found" });
      }

      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      
      const updatedUser = await storage.updateAdminUser(adminUser.id, { avatar: avatarUrl });
      if (!updatedUser) {
        return res.status(500).json({ error: "Failed to update avatar" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload avatar" });
    }
  });

  // Phone API Routes
  app.get("/api/phones", async (req: Request, res: Response) => {
    try {
      const phones = await storage.getAllPhones();
      res.json(phones);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch phones" });
    }
  });

  app.get("/api/phones/:id", async (req: Request, res: Response) => {
    try {
      const phone = await storage.getPhone(req.params.id);
      if (!phone) {
        return res.status(404).json({ error: "Phone not found" });
      }
      res.json(phone);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch phone" });
    }
  });

  app.post("/api/phones", requireAuth, async (req: Request, res: Response) => {
    try {
      const validationResult = insertPhoneSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.errors });
      }

      const phone = await storage.createPhone(validationResult.data);
      res.status(201).json(phone);
    } catch (error) {
      res.status(500).json({ error: "Failed to create phone" });
    }
  });

  app.put("/api/phones/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const validationResult = updatePhoneSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.errors });
      }

      const phone = await storage.updatePhone(req.params.id, validationResult.data);
      if (!phone) {
        return res.status(404).json({ error: "Phone not found" });
      }
      res.json(phone);
    } catch (error) {
      res.status(500).json({ error: "Failed to update phone" });
    }
  });

  app.delete("/api/phones/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deletePhone(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Phone not found" });
      }
      res.json({ message: "Phone deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete phone" });
    }
  });

  // Settings API Routes
  app.get("/api/settings", async (req: Request, res: Response) => {
    try {
      const allSettings = await storage.getAllSettings();
      const settingsObj: Record<string, string> = {};
      allSettings.forEach(s => { settingsObj[s.key] = s.value; });
      res.json(settingsObj);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", requireAuth, async (req: Request, res: Response) => {
    try {
      const updates = req.body as Record<string, string>;
      for (const [key, value] of Object.entries(updates)) {
        await storage.upsertSetting(key, value);
      }
      const allSettings = await storage.getAllSettings();
      const settingsObj: Record<string, string> = {};
      allSettings.forEach(s => { settingsObj[s.key] = s.value; });
      res.json(settingsObj);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  return httpServer;
}

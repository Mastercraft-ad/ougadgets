import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import { updateAdminProfileSchema, changePasswordSchema } from "@shared/schema";
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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.use("/uploads", (req, res, next) => {
    res.setHeader("Cache-Control", "no-cache");
    next();
  }, express.static(path.join(process.cwd(), "uploads")));

  app.get("/api/admin/profile", async (req: Request, res: Response) => {
    try {
      const adminUser = await storage.getAdminUserByUsername("admin");
      if (!adminUser) {
        return res.status(404).json({ error: "Admin user not found" });
      }
      
      const { password, ...userWithoutPassword } = adminUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.patch("/api/admin/profile", async (req: Request, res: Response) => {
    try {
      const validationResult = updateAdminProfileSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.errors });
      }

      const adminUser = await storage.getAdminUserByUsername("admin");
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

  app.post("/api/admin/change-password", async (req: Request, res: Response) => {
    try {
      const validationResult = changePasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.errors });
      }

      const { currentPassword, newPassword } = validationResult.data;
      
      const verifiedUser = await storage.verifyAdminPassword("admin", currentPassword);
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

  app.post("/api/admin/avatar", upload.single("avatar"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const adminUser = await storage.getAdminUserByUsername("admin");
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

  return httpServer;
}

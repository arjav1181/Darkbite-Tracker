import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertFoodEntrySchema } from "@shared/schema";
import { analyzeImageFile, analyzeTextDescription } from "./gemini";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/food-entries", async (req, res) => {
    try {
      const entries = await storage.getFoodEntries();
      res.json(entries);
    } catch (error) {
      console.error("Error fetching food entries:", error);
      res.status(500).json({ error: "Failed to fetch food entries" });
    }
  });

  app.post("/api/food-entries", async (req, res) => {
    try {
      const validatedData = insertFoodEntrySchema.parse(req.body);
      const entry = await storage.createFoodEntry(validatedData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating food entry:", error);
      res.status(400).json({ error: "Invalid food entry data" });
    }
  });

  app.delete("/api/food-entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteFoodEntry(id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Food entry not found" });
      }
    } catch (error) {
      console.error("Error deleting food entry:", error);
      res.status(500).json({ error: "Failed to delete food entry" });
    }
  });

  app.post("/api/analyze-photo", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const analysis = await analyzeImageFile(req.file.path);
      
      const imageUrl = `/uploads/${req.file.filename}`;
      
      res.json({ analysis, imageUrl });
    } catch (error) {
      console.error("Error analyzing photo:", error);
      res.status(500).json({ error: "Failed to analyze photo" });
    }
  });

  app.post("/api/analyze-text", async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description || typeof description !== "string") {
        return res.status(400).json({ error: "Description is required" });
      }

      const analysis = await analyzeTextDescription(description);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing text:", error);
      res.status(500).json({ error: "Failed to analyze description" });
    }
  });

  app.use("/uploads", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    next();
  }, (req, res, next) => {
    const filePath = path.join(uploadsDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertProductSchema, insertVendorSchema, insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Product routes
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    const product = insertProductSchema.parse(req.body);
    const created = await storage.createProduct(product);
    res.status(201).json(created);
  });

  app.patch("/api/products/:id", async (req, res) => {
    const product = await storage.updateProduct(parseInt(req.params.id), req.body);
    res.json(product);
  });

  app.delete("/api/products/:id", async (req, res) => {
    await storage.deleteProduct(parseInt(req.params.id));
    res.sendStatus(204);
  });

  // Vendor routes
  app.get("/api/vendors", async (_req, res) => {
    const vendors = await storage.getVendors();
    res.json(vendors);
  });

  app.post("/api/vendors", async (req, res) => {
    const vendor = insertVendorSchema.parse(req.body);
    const created = await storage.createVendor(vendor);
    res.status(201).json(created);
  });

  // Order routes
  app.get("/api/orders", async (_req, res) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.post("/api/orders", async (req, res) => {
    const order = insertOrderSchema.parse(req.body);
    const created = await storage.createOrder(order);
    res.status(201).json(created);
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    const order = await storage.updateOrderStatus(parseInt(req.params.id), req.body.status);
    res.json(order);
  });

  // WhatsApp routes (stubbed for now)
  app.get("/api/whatsapp/qr", (_req, res) => {
    res.json({ qrCode: "dummy-qr-code" });
  });

  app.get("/api/whatsapp/status", (_req, res) => {
    res.json({ connected: false });
  });

  const httpServer = createServer(app);
  return httpServer;
}

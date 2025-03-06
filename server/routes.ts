import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertProductSchema, insertVendorSchema, insertOrderSchema, insertCustomerSchema, insertVendorCustomerSchema } from "@shared/schema";

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

  // Customer routes
  app.get("/api/customers", async (_req, res) => {
    const customers = await storage.getCustomers();
    res.json(customers);
  });

  app.post("/api/customers", async (req, res) => {
    const customer = insertCustomerSchema.parse(req.body);
    const created = await storage.createCustomer(customer);
    res.status(201).json(created);
  });

  app.patch("/api/customers/:id", async (req, res) => {
    const customer = await storage.updateCustomer(parseInt(req.params.id), req.body);
    res.json(customer);
  });

  app.delete("/api/customers/:id", async (req, res) => {
    await storage.deleteCustomer(parseInt(req.params.id));
    res.sendStatus(204);
  });

  // Vendor-Customer Association routes
  app.get("/api/vendors/:id/customers", async (req, res) => {
    const vendorCustomers = await storage.getVendorCustomers(parseInt(req.params.id));
    res.json(vendorCustomers);
  });

  app.post("/api/vendors/:id/customers", async (req, res) => {
    // Verificar si el usuario es administrador
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ error: "Only administrators can assign customers to vendors" });
    }
    
    const assignment = insertVendorCustomerSchema.parse({
      ...req.body,
      vendorId: parseInt(req.params.id),
    });
    const created = await storage.assignCustomerToVendor(assignment);
    res.status(201).json(created);
  });

  app.delete("/api/vendors/:id/customers/:customerId", async (req, res) => {
    // Verificar si el usuario es administrador
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ error: "Only administrators can unassign customers from vendors" });
    }
    
    await storage.unassignCustomerFromVendor(
      parseInt(req.params.id),
      parseInt(req.params.customerId)
    );
    res.sendStatus(204);
  });

  // Add this new endpoint to fetch all vendor-customer relationships
  app.get("/api/vendor-customers", async (_req, res) => {
    const vendors = await storage.getVendors();
    const allRelationships: any[] = []; // Assuming VendorCustomer type is available

    for (const vendor of vendors) {
      const relationships = await storage.getVendorCustomers(vendor.id);
      allRelationships.push(...relationships);
    }

    res.json(allRelationships);
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
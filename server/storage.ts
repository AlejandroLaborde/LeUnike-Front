import { User, Product, Vendor, Order, OrderItem, InsertUser, InsertProduct, InsertVendor, InsertOrder, InsertOrderItem } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Vendor operations
  getVendors(): Promise<Vendor[]>;
  getVendor(id: number): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;

  // Order operations
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private vendors: Map<number, Vendor>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;

  public sessionStore: session.Store;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.vendors = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { 
      ...insertUser,
      id,
      role: insertUser.role || "vendor" 
    };
    this.users.set(id, user);
    return user;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const newProduct = { 
      ...product,
      id,
      stock: product.stock ?? 0,
      // Convert number to string for storage
      price: product.price.toString(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    const existing = await this.getProduct(id);
    if (!existing) throw new Error("Product not found");

    const updated = { ...existing, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }

  // Vendor operations
  async getVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const id = this.currentId++;
    const newVendor = { 
      ...vendor,
      id,
      commission: vendor.commission?.toString() || "0.1",
      zone: vendor.zone || null 
    };
    this.vendors.set(id, newVendor);
    return newVendor;
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentId++;
    const newOrder = { 
      ...order,
      id,
      status: order.status || "pending",
      createdAt: order.createdAt || new Date(),
      total: order.total.toString()
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const existing = await this.getOrder(id);
    if (!existing) throw new Error("Order not found");

    const updated = { ...existing, status };
    this.orders.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("vendor"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price").notNull(),
  stock: integer("stock").notNull().default(0),
});

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  zone: text("zone"),
  commission: decimal("commission").notNull().default("0.1"),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
});

export const vendorCustomers = pgTable("vendor_customers", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  customerId: integer("customer_id").notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  status: text("status").notNull().default("pending"),
  total: decimal("total").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price").notNull(),
});

// Modified Insert Schemas to handle numeric types
export const insertProductSchema = createInsertSchema(products).extend({
  price: z.number().or(z.string()).transform(val => val.toString()),
  stock: z.number().int(),
});

export const insertVendorSchema = createInsertSchema(vendors).extend({
  commission: z.number().or(z.string()).transform(val => val.toString()),
});

export const insertOrderSchema = createInsertSchema(orders).extend({
  total: z.number().or(z.string()).transform(val => val.toString()),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).extend({
  price: z.number().or(z.string()).transform(val => val.toString()),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertCustomerSchema = createInsertSchema(customers);
export const insertVendorCustomerSchema = createInsertSchema(vendorCustomers);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertVendorCustomer = z.infer<typeof insertVendorCustomerSchema>;

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Vendor = typeof vendors.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type VendorCustomer = typeof vendorCustomers.$inferSelect;
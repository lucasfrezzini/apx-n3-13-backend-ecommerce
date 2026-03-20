import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().nonnegative("Price must be positive"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  images: z.array(z.string().url()).optional(),
  category: z.string().min(1, "Category is required"),
  attributes: z.record(z.string(), z.any()).optional(),
});

export const productCreateSchema = productSchema;
export const productUpdateSchema = productSchema.partial();

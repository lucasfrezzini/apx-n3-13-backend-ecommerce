import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().uuid("productId must be a valid UUID"),
  quantity: z.number().int().positive("quantity must be positive integer"),
  name: z.string().optional(),
  price: z.number().optional(),
  image: z.string().optional(),
});

export const orderSchema = z.object({
  userId: z.string().uuid("userId must be a valid UUID").optional(),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  totalPrice: z.number().positive("totalPrice must be positive").optional(),
  paymentUrl: z.string().url().optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "shipped"]).optional(),
  shippingAddress: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  paymentId: z.string().optional(),
});

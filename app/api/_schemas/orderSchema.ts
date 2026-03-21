import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().uuid("productId must be a valid UUID"),
  quantity: z.number().int().positive("quantity must be positive integer"),
});

export const orderSchema = z
  .object({
    userId: z.string().uuid("userId must be a valid UUID").optional(),
    productId: z.string().uuid("productId must be a valid UUID").optional(),
    quantity: z.number().int().positive("quantity must be positive integer").optional(),
    items: z.array(orderItemSchema).optional(),
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
  })
  .refine(
    (data) => {
      const hasCart = Array.isArray(data.items) && data.items.length > 0;
      const hasSingle = data.productId && data.quantity;
      return hasCart || hasSingle;
    },
    {
      message: "Either items (cart) or productId + quantity is required",
      path: ["items"],
    },
  );

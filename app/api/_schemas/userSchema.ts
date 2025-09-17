import { z } from "zod";
const userAddressSchema = z
  .object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  })
  .optional();

const userSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z
    .string()
    .regex(/^\+\d+$/)
    .optional(), // Ejemplo: validar teléfono con prefijo internacional
  avatarUrl: z.url().optional(),
});

export { userSchema, userAddressSchema };

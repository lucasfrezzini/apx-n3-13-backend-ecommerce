export type UUID = string;

export interface UserType {
  id: UUID;
  email: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductType {
  id: UUID;
  name: string;
  description?: string;
  price: number;
  stock: number;
  images?: string[]; // URLs
  category?: string;
  attributes?: Record<string, any>; // características adicionales
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderType {
  id: UUID;
  userId: UUID;
  productId: UUID;
  quantity: number;
  totalPrice: number;
  paymentUrl?: string;
  status: "pending" | "confirmed" | "cancelled" | "shipped";
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  paymentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthCodeType {
  id: UUID;
  email: string;
  code: string;
  validUntil: Date;
  used: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

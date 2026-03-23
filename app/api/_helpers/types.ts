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
  images?: {
    product: string[];
    dimensions?: string;
  };
  category?: string;
  attributes?: Record<string, any>;
  isNew?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: UUID;
  quantity: number;
  price: number;
  name: string;
}

export interface OrderType {
  id: UUID;
  userId: UUID;
  items: OrderItem[];
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

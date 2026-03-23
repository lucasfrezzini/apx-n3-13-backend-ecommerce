export type ApiError = {
  success: false;
  error: string;
  status?: number;
  code?: string;
  details?: Record<string, string[]>;
};

export type ApiSuccess<T> = {
  success: true;
} & T;

export type FetchResult<T> = ApiSuccess<T> | ApiError;

export type Address = {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
  address?: Address;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  previewImage?: string;
  images?: string[];
  attributes?: Record<string, string>;
  available: boolean;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
  name: string;
};

export type Order = {
  id: string;
  userId: string;
  productId?: string;
  quantity?: number;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "shipped";
  shippingAddress?: Address;
  paymentUrl?: string;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
};

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function fetchJson<T>(
  url: string,
  options: RequestInit = {},
): Promise<FetchResult<T>> {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      success: false,
      error: (data?.error || data?.message || "Request failed") as string,
      status: res.status,
      ...(data?.code ? { code: data.code } : {}),
      ...(data?.details ? { details: data.details } : {}),
    };
  }

  return data as FetchResult<T>;
}

export const apiClient = {
  // ========== AUTH ==========
  sendCode: async (email: string): Promise<FetchResult<{ message: string }>> => {
    return fetchJson("/api/auth", {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({ email }),
    });
  },

  verifyCode: async (
    email: string,
    code: string,
  ): Promise<FetchResult<{ token: string }>> => {
    return fetchJson("/api/auth/token", {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({ email, code }),
    });
  },

  // ========== PRODUCTS ==========
  getProducts: async (options?: {
    category?: string;
    random?: boolean;
    limit?: number;
    sort?: "price_asc" | "price_desc";
  }): Promise<FetchResult<{ products: Product[] }>> => {
    const params = new URLSearchParams();
    if (options?.category) params.set("category", options.category);
    if (options?.random) params.set("random", "true");
    if (options?.limit) params.set("limit", String(options.limit));
    if (options?.sort) params.set("sort", options.sort);

    const url = `/api/products${params.toString() ? `?${params.toString()}` : ""}`;
    return fetchJson(url, { method: "GET", headers: defaultHeaders });
  },

  getProductById: async (id: string): Promise<FetchResult<{ product: Product }>> => {
    return fetchJson(`/api/products/${id}`, {
      method: "GET",
      headers: defaultHeaders,
    });
  },

  // ========== SEARCH ==========
  search: async (
    query: string,
    options?: { offset?: number; limit?: number },
  ): Promise<
    FetchResult<{
      query: string;
      page: number;
      total: number;
      totalPages: number;
      hitsPerPage: number;
      results: Product[];
    }>
  > => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (options?.offset !== undefined) params.set("offset", String(options.offset));
    if (options?.limit !== undefined) params.set("limit", String(options.limit));

    return fetchJson(`/api/search?${params.toString()}`, {
      method: "GET",
      headers: defaultHeaders,
    });
  },

  syncSearchIndex: async (): Promise<
    FetchResult<{
      message: string;
      total: number;
      synced: number;
      results: Array<{ id: string; status: "ok" | "failed"; error?: string }>;
    }>
  > => {
    return fetchJson("/api/search/sync", {
      method: "POST",
      headers: defaultHeaders,
    });
  },

  // ========== USER ==========
  getMe: async (token: string): Promise<FetchResult<{ user: User }>> => {
    return fetchJson("/api/me", {
      method: "GET",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateMe: async (
    token: string,
    payload: { name?: string; phone?: string; avatarUrl?: string },
  ): Promise<FetchResult<{ message: string; user: User }>> => {
    return fetchJson("/api/me", {
      method: "PATCH",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  updateAddress: async (
    token: string,
    address: Address,
  ): Promise<FetchResult<{ message: string }>> => {
    return fetchJson("/api/me/address", {
      method: "PATCH",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(address),
    });
  },

  getMyOrders: async (
    token: string,
  ): Promise<FetchResult<{ orders: Order[]; quantity: number }>> => {
    return fetchJson("/api/me/orders", {
      method: "GET",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // ========== ORDERS ==========
  createOrder: async (
    token: string,
    orderData: {
      items?: Array<{ productId: string; quantity: number }>;
      productId?: string;
      quantity?: number;
      shippingAddress?: Address;
    },
  ): Promise<FetchResult<{ message: string; order: Order; paymentUrl: string; paymentId: string }>> => {
    return fetchJson("/api/order", {
      method: "POST",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderData }),
    });
  },

  getOrderById: async (
    token: string,
    orderId: string,
  ): Promise<FetchResult<{ order: Order }>> => {
    return fetchJson(`/api/order/${orderId}`, {
      method: "GET",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
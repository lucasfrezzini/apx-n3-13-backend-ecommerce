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

  getProducts: async () => {
    return fetchJson<{ products: unknown[]; success: true }>("/api/products", {
      method: "GET",
      headers: defaultHeaders,
    });
  },

  getProductById: async (id: string) => {
    return fetchJson<{ product: unknown }>(`/api/products/${id}`, {
      method: "GET",
      headers: defaultHeaders,
    });
  },

  getStore: async () => {
    return fetchJson<{ products: unknown[] }>("/api/store", {
      method: "GET",
      headers: defaultHeaders,
    });
  },

  getStoreByCategory: async (category: string) => {
    return fetchJson<{ products: unknown[] }>(`/api/store/${category}`, {
      method: "GET",
      headers: defaultHeaders,
    });
  },

  getMe: async (token: string) => {
    return fetchJson<{ user: unknown }>("/api/me", {
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
  ) => {
    return fetchJson<{ message: string; user: unknown }>("/api/me", {
      method: "PATCH",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  createOrder: async (
    token: string,
    orderData: {
      items: Array<{ productId: string; quantity: number }>;
      shippingAddress?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
      };
    },
  ) => {
    return fetchJson<{ message: string; order: unknown; paymentUrl?: string; paymentId?: string }>("/api/order", {
      method: "POST",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderData }),
    });
  },

  search: async (
    query: string,
    options?: { offset?: number; limit?: number },
  ) => {
    const params = new URLSearchParams();
    if (query !== undefined) params.set("q", query);
    if (options?.offset !== undefined) params.set("offset", String(options.offset));
    if (options?.limit !== undefined) params.set("limit", String(options.limit));
    return fetchJson<{ query: string; page: number; total: number; totalPages: number; hitsPerPage: number; results: unknown[] }>(
      `/api/search?${params.toString()}`,
      { method: "GET", headers: defaultHeaders },
    );
  },

  syncSearchIndex: async () => {
    return fetchJson<{ message: string; total: number; synced: number; results: { id: string; status: "ok" | "failed"; error?: string }[] }>(
      "/api/search/sync",
      { method: "POST", headers: defaultHeaders },
    );
  },
};

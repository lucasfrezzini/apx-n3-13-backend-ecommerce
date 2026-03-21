import { AppError } from "./api-error";

export type MercadoPagoItem = {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
  description?: string;
};

export type MercadoPagoPreferenceResponse = {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
  preference_id?: string;
};

export async function createMercadoPagoPreference(
  items: MercadoPagoItem[],
  payerEmail: string,
  orderId: string,
): Promise<MercadoPagoPreferenceResponse> {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    throw new AppError("Mercado Pago access token not configured", 500, {
      code: "mercadopago_missing_token",
    });
  }

  const body = {
    items,
    payer: {
      email: payerEmail,
    },
    back_urls: {
      success: process.env.MP_BACK_URL_SUCCESS || "https://example.com/success",
      failure: process.env.MP_BACK_URL_FAILURE || "https://example.com/failure",
      pending: process.env.MP_BACK_URL_PENDING || "https://example.com/pending",
    },
    auto_return: "approved",
    external_reference: orderId,
  };

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || "Mercado Pago preference creation failed";
    throw new AppError(errorMessage, 502, {
      code: "mercadopago_preference_error",
      details: data,
    });
  }

  if (!data || !data.init_point || !data.id) {
    throw new AppError("Invalid response from Mercado Pago", 502, {
      code: "mercadopago_invalid_response",
      details: data,
    });
  }

  return {
    id: data.id,
    init_point: data.init_point,
    sandbox_init_point: data.sandbox_init_point,
    preference_id: data.preference_id,
  };
}

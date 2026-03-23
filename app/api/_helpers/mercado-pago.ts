import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { AppError } from "./api-error";

export type MercadoPagoItem = {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
  description?: string;
};

export type MercadoPagoPreferenceResponse = {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
  preference_id?: string;
};

let client: MercadoPagoConfig | null = null;

function getClient() {
  if (!client) {
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      throw new AppError("Mercado Pago access token not configured", 500, {
        code: "mercadopago_missing_token",
      });
    }
    client = new MercadoPagoConfig({ accessToken: token });
  }
  return client;
}

export async function createMercadoPagoPreference(
  items: MercadoPagoItem[],
  payerEmail: string,
  orderId: string,
): Promise<MercadoPagoPreferenceResponse> {
  const preference = new Preference(getClient());

  try {
    const result = await preference.create({
      body: {
        items,
        payer: {
          email: payerEmail,
        },
        back_urls: {
          success: process.env.MP_FRONT_URL_SUCCESS || "https://apx-n3-13-backend-ecommerce.vercel.app/success",
          failure: process.env.MP_FRONT_URL_FAILURE || "https://apx-n3-13-backend-ecommerce.vercel.app/failure",
          pending: process.env.MP_FRONT_URL_PENDING || "https://apx-n3-13-backend-ecommerce.vercel.app/pending",
        },
        notification_url: "https://apx-n3-13-backend-ecommerce.vercel.app/api/ipn/mercadopago",
        external_reference: orderId,
      },
    });

    if (!result.id || !result.init_point) {
      throw new AppError("Invalid response from Mercado Pago", 502, {
        code: "mercadopago_invalid_response",
        details: result,
      });
    }

    return {
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      preference_id: result.id,
    };
  } catch (error: unknown) {
    const err = error as { message?: string; response?: unknown };
    const details = err.response || error;
    const errorMessage =
      err instanceof Error ? err.message : "Mercado Pago preference creation failed";
    throw new AppError(errorMessage, 502, {
      code: "mercadopago_preference_error",
      details,
    });
  }
}

export async function getMercadoPagoPayment(paymentId: string | number) {
  const payment = new Payment(getClient());

  try {
    return await payment.get({ id: String(paymentId) });
  } catch (error: unknown) {
    const err = error as { message?: string; response?: unknown };
    const details = err.response || error;
    throw new AppError("Unable to fetch Mercado Pago payment", 502, {
      code: "mercadopago_payment_fetch_failed",
      details,
    });
  }
}

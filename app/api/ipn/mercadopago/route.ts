import { NextRequest, NextResponse } from "next/server";
import { AppError, handleRoute } from "../../_helpers/api-error";
import { Order } from "../../_models/orders";

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const body = await req.json().catch(() => null);
    if (!body) {
      throw new AppError("Invalid JSON body", 400, { code: "invalid_payload" });
    }

    const paymentId = body?.data?.id || body?.id;
    if (!paymentId) {
      throw new AppError("Missing Mercado Pago payment id", 400, {
        code: "missing_payment_id",
      });
    }

    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      throw new AppError("Missing Mercado Pago token", 500, {
        code: "missing_mp_token",
      });
    }

    const paymentRes = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const paymentData = await paymentRes.json().catch(() => null);
    if (!paymentRes.ok || !paymentData) {
      throw new AppError("Unable to fetch Mercado Pago payment", 502, {
        code: "mercadopago_payment_fetch_failed",
        details: paymentData,
      });
    }

    const externalReference = paymentData.external_reference;
    if (!externalReference) {
      throw new AppError("Missing external_reference in Mercado Pago payment", 400, {
        code: "missing_external_reference",
      });
    }

    const order = await Order.findByPk(externalReference);
    if (!order) {
      throw new AppError("Order not found", 404, { code: "order_not_found" });
    }

    const status = (paymentData.status || "").toLowerCase();
    let updateStatus: "confirmed" | "cancelled" = "cancelled";

    if (status === "approved") {
      updateStatus = "confirmed";
    } else if (
      ["pending", "in_process", "authorized", "in_mediation", "chargeback", "refunded"].includes(status)
    ) {
      updateStatus = "cancelled";
    }

    await order.update({
      status: updateStatus,
      paymentId: paymentData.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "IPN received",
        orderId: externalReference,
        status: updateStatus,
      },
      { status: 200 },
    );
  });
}

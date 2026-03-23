import { NextRequest, NextResponse } from "next/server";
import { AppError, handleRoute } from "../../_helpers/api-error";
import { Order } from "../../_models/orders";
import { Product } from "../../_models/products";
import { sequelize } from "../../_database/config";
import { getMercadoPagoPayment } from "../../_helpers/mercado-pago";

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

    const paymentData = await getMercadoPagoPayment(paymentId);

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
    let updateStatus: "pending" | "confirmed" | "cancelled" = "pending";

    if (status === "approved") {
      updateStatus = "confirmed";
    } else if (
      ["cancelled", "rejected", "refunded", "chargeback"].includes(status)
    ) {
      updateStatus = "cancelled";
    }

    if (updateStatus === "confirmed") {
      await sequelize.transaction(async (transaction) => {
        const items = order.getDataValue("items") as Array<{
          productId: string;
          quantity: number;
        }>;

        for (const item of items) {
          const product = await Product.findByPk(item.productId, { transaction });
          if (product) {
            const stock = product.getDataValue("stock") as number;
            await product.update(
              { stock: Math.max(0, stock - item.quantity) },
              { transaction },
            );
          }
        }
      });
    }

    await order.update({
      status: updateStatus,
      paymentId: String(paymentData.id),
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
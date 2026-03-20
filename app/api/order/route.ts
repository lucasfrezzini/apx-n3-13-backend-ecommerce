import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../_middlewares/authMiddleware";
import { createOrder } from "../_controllers/order";
import { OrderType } from "../_helpers/types";
import { orderSchema } from "../_schemas/orderSchema";
import { handleRoute, AppError } from "../_helpers/api-error";

// POST /order?productId={id}
export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    //! Falta generar la orden de pago en MercadoPago y devolver la URL de pago
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }
    const body = await req.json();
    const { orderData } = body;
    if (!orderData) {
      throw new AppError("Order data is required", 400, {
        code: "validation_error",
      });
    }

    const validation = orderSchema.safeParse(orderData);
    if (!validation.success) {
      throw new AppError("Invalid order data", 400, {
        code: "validation_error",
        details: validation.error.flatten().fieldErrors,
      });
    }

    const order = await createOrder(validation.data as OrderType);
    return NextResponse.json(
      { success: true, message: "Order created", order },
      { status: 201 },
    );
  });
}

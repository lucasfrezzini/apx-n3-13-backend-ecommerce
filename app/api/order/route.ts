import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../_middlewares/authMiddleware";
import { createOrder } from "../_controllers/order";
import { OrderType } from "../_helpers/types";

// POST /order?productId={id}
export async function POST(req: NextRequest) {
  //! Falta generar la orden de pago en MercadoPago y devolver la URL de pago
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }
    const { orderData } = await req.json();
    if (!orderData) {
      return NextResponse.json(
        { error: "Order data is required" },
        { status: 400 }
      );
    }
    const order = await createOrder(orderData as OrderType);
    return NextResponse.json(
      { message: "Order created", order },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in GET /api/order:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

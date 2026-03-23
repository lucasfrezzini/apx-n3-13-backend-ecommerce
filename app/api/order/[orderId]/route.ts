import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "../../_controllers/order";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing orderId parameter" },
        { status: 400 }
      );
    }
    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in GET /api/orders/[orderId]:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

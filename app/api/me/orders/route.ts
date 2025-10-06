import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../_middlewares/authMiddleware";
import { getUserOrders } from "../../_controllers/user";

export async function GET(req: NextRequest) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }
    const orders = await getUserOrders(authResponse.email as string);
    return NextResponse.json(
      { orders, quantity: orders?.length },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in GET /api/me:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

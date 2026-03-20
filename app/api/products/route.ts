import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "../_controllers/products";
import { handleRoute } from "../_helpers/api-error";

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const products = await getProducts();
    return NextResponse.json({ success: true, products }, { status: 200 });
  });
}

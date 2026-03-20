import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "../_controllers/products";

export async function GET(req: NextRequest) {
  try {
    const products = await getProducts();
    if (!products) {
      return NextResponse.json(
        { error: "Products not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ products }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in GET /api/products/ :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

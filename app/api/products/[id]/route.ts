import { NextRequest, NextResponse } from "next/server";
import { getOneProduct } from "../../_controllers/products";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }
    const product = await getOneProduct(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in GET /api/products/[id]:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

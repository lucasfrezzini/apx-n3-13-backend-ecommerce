import { NextRequest, NextResponse } from "next/server";
import { getProductsByCategory } from "../../_controllers/products";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category: string }> },
) {
  try {
    const { category } = await params;
    if (!category) {
      return NextResponse.json(
        { error: "Missing Collection parameter" },
        { status: 400 },
      );
    }
    const products = await getProductsByCategory(category);
    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ products }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in GET /api/store/[category]:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

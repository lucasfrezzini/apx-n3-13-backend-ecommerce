import { NextRequest, NextResponse } from "next/server";
import { getProductsByCategory } from "../../_controllers/products";
import { handleRoute, AppError } from "../../_helpers/api-error";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category: string }> },
) {
  return handleRoute(async () => {
    const { category } = await params;
    if (!category) {
      throw new AppError("Missing category parameter", 400, {
        code: "validation_error",
      });
    }

    const products = await getProductsByCategory(category);
    return NextResponse.json({ success: true, products }, { status: 200 });
  });
}

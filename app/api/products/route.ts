import { NextRequest, NextResponse } from "next/server";
import { getProducts, getProductsByCategory } from "../_controllers/products";
import { handleRoute } from "../_helpers/api-error";

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");
    const random = searchParams.get("random");
    const sort = searchParams.get("sort");

    let products;

    if (category) {
      products = await getProductsByCategory(category);
    } else {
      products = await getProducts();
    }

    if (random === "true") {
      products = products.sort(() => Math.random() - 0.5);
    }

    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        products = products.slice(0, limitNum);
      }
    }

    if (sort === "price_asc") {
      products.sort((a: any, b: any) => Number(a.price) - Number(b.price));
    } else if (sort === "price_desc") {
      products.sort((a: any, b: any) => Number(b.price) - Number(a.price));
    }

    return NextResponse.json({ success: true, products }, { status: 200 });
  });
}
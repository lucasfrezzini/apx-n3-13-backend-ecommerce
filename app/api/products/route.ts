import { NextRequest, NextResponse } from "next/server";
import { getProducts, getProductsByCategory } from "../_controllers/products";
import { handleRoute } from "../_helpers/api-error";

/**
 * GET /api/products
 * Lista productos con filtros opcionales:
 * - category: filtrar por categoría
 * - random: orden aleatorio
 * - limit: limitar cantidad
 * - sort: ordenar (price_asc, price_desc)
 */
export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");
    const random = searchParams.get("random");
    const sort = searchParams.get("sort");

    let products = category
      ? await getProductsByCategory(category)
      : await getProducts();

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
      products.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price_desc") {
      products.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return NextResponse.json({ success: true, products }, { status: 200 });
  });
}
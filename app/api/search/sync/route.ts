import { NextRequest, NextResponse } from "next/server";
import { algoliasearch } from "algoliasearch";
import { AlgoliaAPI } from "../../_database/algolia";
import ProductService from "../../_services/productService";
import { handleRoute, AppError } from "../../_helpers/api-error";

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID as string;
const ALGOLIA_SEARCH_API_KEY = process.env.ALGOLIA_SEARCH_API_KEY as string;
const ALGOLIA_INDEX_NAME = "algolia_kora_dataset";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);
const algoliaClient = new AlgoliaAPI<any>(client, ALGOLIA_INDEX_NAME);

function toAlgoliaRecord(product: any) {
  const images = product.images?.product || [];
  const image = images[0] || null;

  return {
    objectID: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: Number(product.price),
    stock: Number(product.stock),
    image,
    attributes: product.attributes || {},
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    if (!ALGOLIA_APP_ID || !ALGOLIA_SEARCH_API_KEY) {
      throw new AppError("Algolia credentials are not configured", 500, {
        code: "algolia_configuration_error",
      });
    }

    const productService = new ProductService();
    const products = await productService.getProducts();
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: true, message: "No products to sync", synced: 0 },
        { status: 200 },
      );
    }

    const results: Array<{
      id: string;
      status: "ok" | "failed";
      error?: string;
    }> = [];
    for (const product of products) {
      const json = product.toJSON() as Record<string, unknown>;
      const id = String(json.id || "");
      const record = toAlgoliaRecord(json);
      try {
        await algoliaClient.saveObject(id, record);
        results.push({ id, status: "ok" });
      } catch (error: unknown) {
        console.error("Algolia saveObject failed for", id, error);
        results.push({
          id,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const synced = results.filter((r) => r.status === "ok").length;
    return NextResponse.json(
      {
        success: true,
        message: "Products synced to Algolia",
        total: products.length,
        synced,
        results,
      },
      { status: 200 },
    );
  });
}

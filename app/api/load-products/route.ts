// /app/api/load-products/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";
import { createProduct } from "../_controllers/products";
import { productCreateSchema } from "../_schemas/productSchema";

export async function POST(req: NextRequest) {
  try {
    // Ruta absoluta al JSON (ajustar según tu estructura)
    const filePath = path.join(process.cwd(), "products-dining-room.json");
    const jsonExists = await fs.pathExists(filePath);

    if (!jsonExists) {
      return NextResponse.json(
        { error: "JSON file not found" },
        { status: 404 },
      );
    }

    const products = await fs.readJson(filePath);

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: "Invalid JSON structure, expected array" },
        { status: 400 },
      );
    }

    const results = [];

    for (const producto of products) {
      const parsed = productCreateSchema.safeParse({ ...producto, stock: 30 });
      if (!parsed.success) {
        results.push({
          product: producto.name || "unknown",
          status: "failed",
          error: parsed.error.flatten().fieldErrors,
        });
        continue;
      }

      try {
        const created = await createProduct(parsed.data);
        results.push({ product: created, status: "ok" });
      } catch (err) {
        console.error("Error creating product:", err);
        results.push({
          product: producto.name || "unknown",
          status: "failed",
          error: err,
        });
      }
    }

    return NextResponse.json(
      { message: "Products processed", results },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in /api/load-products:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

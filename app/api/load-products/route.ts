// /app/api/load-products/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";
import { createProduct } from "../_controllers/products";

export async function POST(req: NextRequest) {
  try {
    // Ruta absoluta al JSON (ajustar según tu estructura)
    const filePath = path.join(process.cwd(), "products-dining-room.json");
    const jsonExists = await fs.pathExists(filePath);

    if (!jsonExists) {
      return NextResponse.json(
        { error: "JSON file not found" },
        { status: 404 }
      );
    }

    const products = await fs.readJson(filePath);

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: "Invalid JSON structure, expected array" },
        { status: 400 }
      );
    }

    const results = [];

    for (const producto of products) {
      try {
        const created = await createProduct({ ...producto, stock: 30 });
        results.push({ product: created, status: "ok" });
      } catch (err) {
        console.error("Error creating product:", err);
        results.push({ product: producto.name || "unknown", status: "failed" });
      }
    }

    return NextResponse.json(
      { message: "Products processed", results },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/load-products:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

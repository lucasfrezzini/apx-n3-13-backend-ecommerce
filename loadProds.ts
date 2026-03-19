import fs from "fs-extra";
import { createProduct } from "@/app/api/_controllers/products"; // ajusta la ruta según tu proyecto

async function run() {
  try {
    // 1️⃣ Leer el JSON local
    const products = await fs.readJson("./products-desks.json"); // nombre de tu archivo

    if (!Array.isArray(products) || products.length === 0) {
      console.log("No se encontraron productos en el JSON");
      return;
    }

    // 2️⃣ Recorrer y cargar cada producto
    const savedProducts = [];
    for (const product of products) {
      try {
        const saved = await createProduct(product);
        if (saved) {
          savedProducts.push(saved);
          console.log(`✅ Producto guardado: ${product.name}`);
        } else {
          console.log(`❌ No se pudo guardar el producto: ${product.name}`);
        }
      } catch (err) {
        console.error(`❌ Error guardando producto ${product.name}:`, err);
      }
    }

    console.log(
      `\n📦 Productos guardados: ${savedProducts.length}/${products.length}`
    );
  } catch (error) {
    console.error("Error leyendo el JSON o cargando productos:", error);
  }
}

// Ejecutar el script
run();

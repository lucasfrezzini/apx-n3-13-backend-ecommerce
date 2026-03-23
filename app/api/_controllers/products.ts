import { ProductType, UUID } from "../_helpers/types";
import { AppError } from "../_helpers/api-error";
import { productCreateSchema } from "../_schemas/productSchema";
import ProductService from "../_services/productService";

/**
 * Obtiene un producto por su ID.
 * @throws AppError si no se encuentra el producto
 */
export async function getOneProduct(id: UUID): Promise<ProductType> {
  const productService = new ProductService();
  const product = await productService.getProductById(id);
  if (!product) {
    throw new AppError("Product not found", 404, { code: "product_not_found" });
  }
  return product.toJSON() as ProductType;
}

/**
 * Obtiene todos los productos.
 */
export async function getProducts(): Promise<ProductType[]> {
  const productService = new ProductService();
  const products = await productService.getProducts();
  return products.map((p) => p.toJSON() as ProductType);
}

/**
 * Obtiene productos filtrados por categoría.
 */
export async function getProductsByCategory(
  category: string,
): Promise<ProductType[]> {
  const productService = new ProductService();
  const products = await productService.getProductsByCategory(category);
  return products.map((p) => p.toJSON() as ProductType);
}

/**
 * Crea un nuevo producto con validación de esquema.
 * @throws AppError si la validación falla o la creación falla
 */
export async function createProduct(
  product: Omit<ProductType, "id">,
): Promise<ProductType> {
  const validation = productCreateSchema.safeParse(product);
  if (!validation.success) {
    throw new AppError("Invalid product format", 400, {
      code: "validation_error",
      details: validation.error.flatten().fieldErrors,
    });
  }

  const productService = new ProductService();
  const newProduct = await productService.createProduct(validation.data as any);
  if (!newProduct) {
    throw new AppError("Failed to create product", 500, {
      code: "product_create_failed",
    });
  }
  return newProduct.toJSON() as ProductType;
}
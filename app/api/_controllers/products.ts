import { ProductType, UUID } from "../_helpers/types";
import ProductService from "../_services/productService";

export async function getOneProduct(id: UUID): Promise<ProductType | null> {
  const productService = new ProductService();
  const product = await productService.getProductById(id);
  if (!product) {
    return null;
  }
  return product.toJSON() as ProductType;
}

export async function getProducts(): Promise<ProductType[]> {
  const productService = new ProductService();
  const products = await productService.getProducts();
  if (!products) {
    return [];
  }
  return products.map((p) => p.toJSON() as ProductType);
}

export async function getProductsByCategory(
  category: string,
): Promise<ProductType[]> {
  const productService = new ProductService();
  const products = await productService.getProductsByCategory(category);
  if (!products) {
    return [];
  }
  return products.map((p) => p.toJSON() as ProductType);
}

export async function createProduct(
  product: Omit<ProductType, "id">,
): Promise<ProductType> {
  const productService = new ProductService();
  const newProduct = await productService.createProduct(product as any);
  if (!newProduct) {
    throw new Error("Failed to create product");
  }
  return newProduct.toJSON() as ProductType;
}

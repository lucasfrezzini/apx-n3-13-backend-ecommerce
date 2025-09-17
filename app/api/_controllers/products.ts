import { UUID } from "../_helpers/types";
import ProductService from "../_services/productService";

export async function getOneProduct(id: UUID) {
  const productService = new ProductService();
  const product = await productService.getProductById(id);
  if (!product) {
    return null;
  }
  return product;
}

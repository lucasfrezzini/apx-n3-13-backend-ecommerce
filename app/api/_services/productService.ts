import { Product } from "../_models/products";
import { sequelize } from "../_database/config";
import { UUID } from "../_helpers/types";
import { CreationAttributes, Model } from "sequelize";

// Para poder tipear correctamente los atributos del modelo
// Obtengo el tipo de instancia del modelo y luego los atributos de creacion
type ProductInstance = InstanceType<typeof Product>;
type ProductCreationAttributes = CreationAttributes<ProductInstance>;

export default class ProductService {
  constructor() {
    // Para iniciar conexión al instanciar si quieres
    sequelize.authenticate().catch((e) => {
      console.error("Unable to connect to the database:", e);
    });
  }

  async createProduct(prod: ProductCreationAttributes) {
    return await Product.create(prod);
  }

  async updateProduct(
    id: UUID,
    updateData: Partial<ProductCreationAttributes>
  ) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");
    return await Product.update(updateData, { where: { id } });
  }

  async getProducts(): Promise<any[]> {
    return await Product.findAll();
  }

  async getProductById(id: UUID): Promise<any | null> {
    return await Product.findByPk(id);
  }

  // Método para sincronizar el modelo (crear tabla) al inicio de app si quieres
  async sync() {
    await sequelize.sync({ alter: true });
  }
}

import { Product } from "../_models/products";
import { sequelize } from "../_database/config";
import { UUID } from "../_helpers/types";
import { CreationAttributes } from "sequelize";

type ProductInstance = InstanceType<typeof Product>;
type ProductCreationAttributes = CreationAttributes<ProductInstance>;

export default class ProductService {
  constructor() {
    sequelize.authenticate().catch((e) => {
      console.error("Unable to connect to the database:", e);
    });
  }

  async createProduct(prod: ProductCreationAttributes) {
    return await Product.create(prod);
  }

  async updateProduct(id: UUID, updateData: Partial<ProductCreationAttributes>) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");
    return await Product.update(updateData, { where: { id } });
  }

  async getProducts(): Promise<ProductInstance[]> {
    await sequelize.sync({ alter: true });
    return await Product.findAll();
  }

  async getProductsByCategory(category: string): Promise<ProductInstance[]> {
    await sequelize.sync({ alter: true });
    return await Product.findAll({ where: { category } });
  }

  async getProductById(id: UUID): Promise<ProductInstance | null> {
    await sequelize.sync({ alter: true });
    return await Product.findByPk(id);
  }

  async sync() {
    await sequelize.sync({ alter: true });
  }
}
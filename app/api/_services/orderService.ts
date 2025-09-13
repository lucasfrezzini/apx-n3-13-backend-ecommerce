import { Order } from "../_models/orders";
import { sequelize } from "../_database/config";
import { UUID } from "../_helpers/types";
import { CreationAttributes, Model } from "sequelize";

// Para poder tipear correctamente los atributos del modelo
// Obtengo el tipo de instancia del modelo y luego los atributos de creacion
type OrderInstance = InstanceType<typeof Order>;
type OrderCreationAttributes = CreationAttributes<OrderInstance>;

export default class OrderService {
  constructor() {
    // Para iniciar conexión al instanciar si quieres
    sequelize.authenticate().catch((e) => {
      console.error("Unable to connect to the database:", e);
    });
  }

  async createOrder(order: OrderCreationAttributes) {
    return await Order.create(order);
  }

  async updateOrder(id: UUID, updateData: Partial<OrderCreationAttributes>) {
    const order = await Order.findByPk(id);
    if (!order) throw new Error("Order not found");
    return await Order.update(updateData, { where: { id } });
  }

  async getOrders(): Promise<any[]> {
    return await Order.findAll();
  }

  async getOrdersAproved(): Promise<any[]> {
    return await Order.findAll({ where: { status: "confirmed" } });
  }

  async getOrderById(id: UUID): Promise<any | null> {
    return await Order.findByPk(id);
  }

  // Método para sincronizar el modelo (crear tabla) al inicio de app si quieres
  async sync() {
    await sequelize.sync({ alter: true });
  }
}

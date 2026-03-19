import { User } from "../_models/users";
import { sequelize } from "../_database/config";
import { UUID } from "../_helpers/types";
import { CreationAttributes, Model } from "sequelize";
import { Order } from "../_models/orders";

// Para poder tipear correctamente los atributos del modelo
// Obtengo el tipo de instancia del modelo y luego los atributos de creacion
type UserInstance = InstanceType<typeof User>;
type UserCreationAttributes = CreationAttributes<UserInstance>;
type OrderInstance = InstanceType<typeof Order>;

export default class UserService {
  constructor() {
    // Para iniciar conexión al instanciar si quieres
    sequelize.authenticate().catch((e) => {
      console.error("Unable to connect to the database:", e);
    });
  }

  async createUser(user: UserCreationAttributes) {
    return await User.create(user);
  }

  async updateUser(id: UUID, updateData: Partial<UserCreationAttributes>) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    return await User.update(updateData, { where: { id } });
  }

  async getUsers(): Promise<UserInstance[]> {
    return await User.findAll();
  }

  async getUserById(id: UUID): Promise<UserInstance | null> {
    return await User.findByPk(id);
  }

  async getUserOrders(userId: UUID): Promise<OrderInstance[]> {
    return await Order.findAll({ where: { userId } });
  }

  async getUserByEmail(email: string): Promise<UserInstance | null> {
    return await User.findOne({ where: { email } });
  }
  // Método para sincronizar el modelo (crear tabla) al inicio de app si quieres
  async sync() {
    await sequelize.sync({ alter: true });
  }
}

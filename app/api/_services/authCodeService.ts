import { AuthCode } from "../_models/authCodes";
import { sequelize } from "../_database/config";
import { UUID } from "../_helpers/types";
import { CreationAttributes, Model } from "sequelize";

// Para poder tipear correctamente los atributos del modelo
// Obtengo el tipo de instancia del modelo y luego los atributos de creacion
type AuthInstance = InstanceType<typeof AuthCode>;
type AuthCreationAttributes = CreationAttributes<AuthInstance>;

export default class AuthService {
  constructor() {
    // Para iniciar conexión al instanciar si quieres
    sequelize.authenticate().catch((e) => {
      console.error("Unable to connect to the database:", e);
    });
  }

  async createAuth(auth: AuthCreationAttributes) {
    return await AuthCode.create(auth);
  }

  async updateAuth(id: UUID, updateData: Partial<AuthCreationAttributes>) {
    const auth = await AuthCode.findByPk(id);
    if (!auth) throw new Error("Auth not found");
    return await AuthCode.update(updateData, { where: { id } });
  }

  async getAuths(): Promise<any[]> {
    return await AuthCode.findAll();
  }

  async getAuthById(id: UUID): Promise<any | null> {
    return await AuthCode.findByPk(id);
  }

  // Método para sincronizar el modelo (crear tabla) al inicio de app si quieres
  async sync() {
    await sequelize.sync({ alter: true });
  }
}

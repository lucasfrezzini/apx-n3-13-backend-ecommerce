import { User } from "../_models/users";
import { Product } from "../_models/products";
import { Order } from "../_models/orders";
import { AuthCode } from "../_models/authCodes";
import { sequelize } from "./config";

// Relaciones
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Order, { foreignKey: "productId" });
Order.belongsTo(Product, { foreignKey: "productId" });

export { User, Product, Order, AuthCode };

// Sincronizar modelos con la base de datos
export const syncAllModels = async () => {
  await sequelize.sync({ alter: true });
  console.log("All models were synchronized successfully.");
};

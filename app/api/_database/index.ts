import { User } from "../_models/users";
import { Product } from "../_models/products";
import { Order } from "../_models/orders";
import { AuthCode } from "../_models/authCodes";
import { sequelize } from "./config";

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

export { User, Product, Order, AuthCode };

export const syncAllModels = async () => {
  await sequelize.sync({ alter: true });
};
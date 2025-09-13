import { DataTypes } from "sequelize";
import { sequelize } from "../_database/config";

export const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentUrl: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: "pending" },
  shippingAddress: { type: DataTypes.JSON },
  paymentId: { type: DataTypes.STRING },
});

import { DataTypes } from "sequelize";
import { sequelize } from "../_database/config";

export const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: { type: DataTypes.UUID, allowNull: false },
  items: { type: DataTypes.JSON },
  totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentUrl: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: "pending" },
  shippingAddress: { type: DataTypes.JSON },
  paymentId: { type: DataTypes.STRING },
});

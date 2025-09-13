import { DataTypes } from "sequelize";
import { sequelize } from "../_database/config";

export const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  images: { type: DataTypes.JSON }, // array de URL strings
  category: { type: DataTypes.STRING },
  attributes: { type: DataTypes.JSON }, // características adicionales
});

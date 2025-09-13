import { DataTypes } from "sequelize";
import { sequelize } from "../_database/config";

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  avatarUrl: { type: DataTypes.STRING },
  address: { type: DataTypes.JSON }, // objeto con street, city, etc.
});

import { Sequelize } from "sequelize";
import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL as string;

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectModule: pg,
});
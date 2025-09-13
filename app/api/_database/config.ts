import { Sequelize } from "sequelize";
import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL as string;

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectModule: pg,
});

// Test the database connection
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// })();

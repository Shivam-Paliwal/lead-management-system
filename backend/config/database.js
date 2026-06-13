const { Sequelize } = require("sequelize");
require("dotenv").config();

const logging = process.env.DB_LOGGING === "true" ? console.log : false;
const isProduction = process.env.NODE_ENV === "production";

const sslOptions = isProduction
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  : undefined;

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging,
      dialectOptions: sslOptions
    })
  : new Sequelize(
      process.env.DB_NAME || "lead_management",
      process.env.DB_USER || "postgres",
      process.env.DB_PASSWORD || "postgres",
      {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        dialect: "postgres",
        logging,
        dialectOptions: sslOptions
      }
    );

module.exports = sequelize;


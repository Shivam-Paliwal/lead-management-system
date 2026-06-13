require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const sslOptions = isProduction
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  : undefined;

const makeConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      use_env_variable: "DATABASE_URL",
      dialect: "postgres",
      dialectOptions: sslOptions,
      logging: process.env.DB_LOGGING === "true" ? console.log : false
    };
  }

  return {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "lead_management",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",
    dialectOptions: sslOptions,
    logging: process.env.DB_LOGGING === "true" ? console.log : false
  };
};

module.exports = {
  development: makeConfig(),
  test: {
    ...makeConfig(),
    database: process.env.DB_TEST_NAME || "lead_management_test"
  },
  production: makeConfig()
};


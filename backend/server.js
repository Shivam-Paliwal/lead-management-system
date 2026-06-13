const app = require("./app");
const { sequelize } = require("./models");

const port = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    await sequelize.authenticate();

    if (process.env.DB_SYNC === "true") {
      await sequelize.sync();
    }

    app.listen(port, () => {
      console.log(`Lead Management API running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();


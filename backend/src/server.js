const dotenv = require("dotenv");
dotenv.config();

const bootstrapDatabase = require("./config/bootstrapDatabase");
const app = require("./app");
const pool = require("./config/db");
const seedAdminUser = require("./config/seedAdmin");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await bootstrapDatabase();

    const connection = await pool.getConnection();
    connection.release();

    await seedAdminUser();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

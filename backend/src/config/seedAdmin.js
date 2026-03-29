const bcrypt = require("bcryptjs");
const pool = require("./db");

const seedAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn("Admin seed skipped because ADMIN_EMAIL or ADMIN_PASSWORD is missing.");
    return;
  }

  const [rows] = await pool.query(
    "SELECT id, role FROM users WHERE email = ? LIMIT 1",
    [adminEmail]
  );

  if (rows.length > 0) {
    if (rows[0].role !== "admin") {
      await pool.query("UPDATE users SET role = 'admin' WHERE id = ?", [rows[0].id]);
    }
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await pool.query("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [
    adminEmail,
    hashedPassword,
    "admin",
  ]);

  console.log(`Seeded admin user: ${adminEmail}`);
};

module.exports = seedAdminUser;

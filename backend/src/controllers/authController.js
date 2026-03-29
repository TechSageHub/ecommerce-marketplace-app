const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );

const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin account required.",
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logoutAdmin = async (req, res) => {
  res.json({
    message: "Logout successful. Remove the token on the frontend.",
  });
};

const registerCustomer = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email, and password are required.",
    });
  }

  if (String(password).length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long.",
    });
  }

  try {
    const [existingRows] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existingRows.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "customer"]
    );

    const user = {
      id: result.insertId,
      name,
      email,
      role: "customer",
    };

    res.status(201).json({
      message: "Account created successfully.",
      token: generateToken(user),
      user,
    });
  } catch (error) {
    next(error);
  }
};

const loginCustomer = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (user.role !== "customer") {
      return res.status(403).json({
        message: "This login is for customer accounts only.",
      });
    }

    res.json({
      message: "Login successful.",
      token: generateToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1",
      [req.user.id]
    );

    const user = rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  registerCustomer,
  loginCustomer,
  getCurrentUser,
};

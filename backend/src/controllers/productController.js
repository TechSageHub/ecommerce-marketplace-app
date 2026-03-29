const pool = require("../config/db");

const buildImageUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
  return `${backendUrl}${imagePath}`;
};

const mapProduct = (product) => ({
  ...product,
  price: Number(product.price),
  image: buildImageUrl(product.image),
});

const getProducts = async (req, res, next) => {
  const { category, search = "", page = 1, limit = 6 } = req.query;

  try {
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 6, 1), 50);
    const offset = (currentPage - 1) * pageSize;

    let whereClause = " WHERE 1 = 1";
    const values = [];

    if (category && category !== "All") {
      whereClause += " AND category = ?";
      values.push(category);
    }

    if (search.trim()) {
      whereClause += " AND name LIKE ?";
      values.push(`%${search.trim()}%`);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM products${whereClause}`,
      values
    );

    const [rows] = await pool.query(
      `SELECT id, name, price, category, image, stock
       FROM products${whereClause}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [...values, pageSize, offset]
    );

    const totalItems = countRows[0].total;
    const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

    res.json({
      items: rows.map(mapProduct),
      pagination: {
        page: currentPage,
        limit: pageSize,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, price, category, image, stock FROM products WHERE id = ? LIMIT 1",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.json(mapProduct(rows[0]));
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  const { name, price, category, stock } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  if (!name || !category || !image) {
    return res.status(400).json({
      message: "Name, category, and image are required.",
    });
  }

  if (Number(price) <= 0 || Number(stock) < 0) {
    return res.status(400).json({
      message: "Price must be greater than 0 and stock cannot be negative.",
    });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO products (name, price, category, image, stock) VALUES (?, ?, ?, ?, ?)",
      [name.trim(), Number(price), category.trim(), image.trim(), Number(stock)]
    );

    const [rows] = await pool.query(
      "SELECT id, name, price, category, image, stock FROM products WHERE id = ? LIMIT 1",
      [result.insertId]
    );

    res.status(201).json(mapProduct(rows[0]));
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  const { name, price, category, stock } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  if (!name || !category || !image) {
    return res.status(400).json({
      message: "Name, category, and image are required.",
    });
  }

  if (Number(price) <= 0 || Number(stock) < 0) {
    return res.status(400).json({
      message: "Price must be greater than 0 and stock cannot be negative.",
    });
  }

  try {
    const [result] = await pool.query(
      "UPDATE products SET name = ?, price = ?, category = ?, image = ?, stock = ? WHERE id = ?",
      [
        name.trim(),
        Number(price),
        category.trim(),
        image.trim(),
        Number(stock),
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const [rows] = await pool.query(
      "SELECT id, name, price, category, image, stock FROM products WHERE id = ? LIMIT 1",
      [req.params.id]
    );

    res.json(mapProduct(rows[0]));
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

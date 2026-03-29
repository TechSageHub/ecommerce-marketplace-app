const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];
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

const createOrder = async (req, res, next) => {
  const { customerEmail, items } = req.body;

  if (!customerEmail) {
    return res.status(400).json({
      message: "Customer email is required.",
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Order items are required.",
    });
  }

  const invalidItem = items.find(
    (item) => !item.productId || Number(item.quantity) <= 0
  );

  if (invalidItem) {
    return res.status(400).json({
      message: "Each order item must include a valid productId and quantity.",
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const productIds = [...new Set(items.map((item) => Number(item.productId)))];
    const placeholders = productIds.map(() => "?").join(", ");

    const [products] = await connection.query(
      `SELECT id, name, price, stock FROM products WHERE id IN (${placeholders})`,
      productIds
    );

    if (products.length !== productIds.length) {
      await connection.rollback();
      return res.status(400).json({
        message: "One or more products do not exist.",
      });
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    let totalAmount = 0;

    for (const item of items) {
      const product = productMap.get(Number(item.productId));

      if (product.stock < Number(item.quantity)) {
        await connection.rollback();
        return res.status(400).json({
          message: `Not enough stock for ${product.name}.`,
        });
      }

      totalAmount += Number(product.price) * Number(item.quantity);
    }

    let userId;
    const [existingUsers] = await connection.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [customerEmail]
    );

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
    } else {
      const guestPassword = await bcrypt.hash(
        `guest-${Date.now()}`,
        10
      );
      const [userResult] = await connection.query(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [customerEmail, guestPassword, "customer"]
      );
      userId = userResult.insertId;
    }

    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)",
      [userId, totalAmount, "pending"]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      const product = productMap.get(Number(item.productId));

      await connection.query(
        "INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)",
        [orderId, Number(item.productId), Number(item.quantity)]
      );

      await connection.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
        Number(item.quantity),
        product.id,
      ]);
    }

    await connection.commit();

    res.status(201).json({
      message: "Order placed successfully.",
      order: {
        id: orderId,
        userId,
        customerEmail,
        totalAmount: Number(totalAmount.toFixed(2)),
        status: "pending",
      },
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const getOrders = async (req, res, next) => {
  try {
    const [orders] = await pool.query(
      `SELECT 
        orders.id,
        orders.user_id,
        users.email,
        orders.total_amount,
        orders.status,
        orders.created_at
      FROM orders
      INNER JOIN users ON users.id = orders.user_id
      ORDER BY orders.created_at DESC`
    );

    const [orderItems] = await pool.query(
      `SELECT
        order_items.id,
        order_items.order_id,
        order_items.product_id,
        order_items.quantity,
        products.name,
        products.price,
        products.image
      FROM order_items
      INNER JOIN products ON products.id = order_items.product_id
      ORDER BY order_items.id DESC`
    );

    const itemsByOrderId = orderItems.reduce((grouped, item) => {
      const mappedItem = {
        id: item.id,
        productId: item.product_id,
        name: item.name,
        image: buildImageUrl(item.image),
        price: Number(item.price),
        quantity: item.quantity,
      };

      if (!grouped[item.order_id]) {
        grouped[item.order_id] = [];
      }

      grouped[item.order_id].push(mappedItem);
      return grouped;
    }, {});

    const response = orders.map((order) => ({
      id: order.id,
      userId: order.user_id,
      customerEmail: order.email,
      totalAmount: Number(order.total_amount),
      status: order.status,
      createdAt: order.created_at,
      items: itemsByOrderId[order.id] || [],
    }));

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const [orders] = await pool.query(
      `SELECT 
        orders.id,
        orders.user_id,
        users.email,
        orders.total_amount,
        orders.status,
        orders.created_at
      FROM orders
      INNER JOIN users ON users.id = orders.user_id
      WHERE orders.user_id = ?
      ORDER BY orders.created_at DESC`,
      [req.user.id]
    );

    const orderIds = orders.map((order) => order.id);

    if (orderIds.length === 0) {
      return res.json([]);
    }

    const placeholders = orderIds.map(() => "?").join(", ");
    const [orderItems] = await pool.query(
      `SELECT
        order_items.id,
        order_items.order_id,
        order_items.product_id,
        order_items.quantity,
        products.name,
        products.price,
        products.image
      FROM order_items
      INNER JOIN products ON products.id = order_items.product_id
      WHERE order_items.order_id IN (${placeholders})
      ORDER BY order_items.id DESC`,
      orderIds
    );

    const itemsByOrderId = orderItems.reduce((grouped, item) => {
      const mappedItem = {
        id: item.id,
        productId: item.product_id,
        name: item.name,
        image: buildImageUrl(item.image),
        price: Number(item.price),
        quantity: item.quantity,
      };

      if (!grouped[item.order_id]) {
        grouped[item.order_id] = [];
      }

      grouped[item.order_id].push(mappedItem);
      return grouped;
    }, {});

    const response = orders.map((order) => ({
      id: order.id,
      userId: order.user_id,
      customerEmail: order.email,
      totalAmount: Number(order.total_amount),
      status: order.status,
      createdAt: order.created_at,
      items: itemsByOrderId[order.id] || [],
    }));

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getOrdersByEmail = async (req, res, next) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      message: "Email is required to look up orders.",
    });
  }

  try {
    const [orders] = await pool.query(
      `SELECT 
        orders.id,
        orders.user_id,
        users.email,
        orders.total_amount,
        orders.status,
        orders.created_at
      FROM orders
      INNER JOIN users ON users.id = orders.user_id
      WHERE users.email = ?
      ORDER BY orders.created_at DESC`,
      [email]
    );

    const orderIds = orders.map((order) => order.id);

    if (orderIds.length === 0) {
      return res.json([]);
    }

    const placeholders = orderIds.map(() => "?").join(", ");
    const [orderItems] = await pool.query(
      `SELECT
        order_items.id,
        order_items.order_id,
        order_items.product_id,
        order_items.quantity,
        products.name,
        products.price,
        products.image
      FROM order_items
      INNER JOIN products ON products.id = order_items.product_id
      WHERE order_items.order_id IN (${placeholders})
      ORDER BY order_items.id DESC`,
      orderIds
    );

    const itemsByOrderId = orderItems.reduce((grouped, item) => {
      const mappedItem = {
        id: item.id,
        productId: item.product_id,
        name: item.name,
        image: buildImageUrl(item.image),
        price: Number(item.price),
        quantity: item.quantity,
      };

      if (!grouped[item.order_id]) {
        grouped[item.order_id] = [];
      }

      grouped[item.order_id].push(mappedItem);
      return grouped;
    }, {});

    const response = orders.map((order) => ({
      id: order.id,
      userId: order.user_id,
      customerEmail: order.email,
      totalAmount: Number(order.total_amount),
      status: order.status,
      createdAt: order.created_at,
      items: itemsByOrderId[order.id] || [],
    }));

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;

  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({
      message: `Status must be one of: ${ORDER_STATUSES.join(", ")}.`,
    });
  }

  try {
    const [result] = await pool.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    const [rows] = await pool.query(
      `SELECT
        orders.id,
        orders.user_id,
        users.email,
        orders.total_amount,
        orders.status,
        orders.created_at
      FROM orders
      INNER JOIN users ON users.id = orders.user_id
      WHERE orders.id = ?
      LIMIT 1`,
      [req.params.id]
    );

    const order = rows[0];

    res.json({
      id: order.id,
      userId: order.user_id,
      customerEmail: order.email,
      totalAmount: Number(order.total_amount),
      status: order.status,
      createdAt: order.created_at,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  getOrdersByEmail,
  updateOrderStatus,
};

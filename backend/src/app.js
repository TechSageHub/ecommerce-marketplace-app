const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const frontendDistPath = path.join(__dirname, "../../frontend/dist");
const hasFrontendBuild = fs.existsSync(frontendDistPath);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  if (process.env.NODE_ENV === "production" && hasFrontendBuild) {
    return res.sendFile(path.join(frontendDistPath, "index.html"));
  }

  res.json({
    message: "E-commerce API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

if (process.env.NODE_ENV === "production" && hasFrontendBuild) {
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;

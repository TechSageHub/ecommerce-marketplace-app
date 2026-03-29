# NovaCart E-commerce Web App

NovaCart is a beginner-friendly but structured full-stack e-commerce project built for portfolio use, interview demos, and future business expansion.

## Tech Stack

- Backend: Node.js + Express
- Database: MySQL with raw SQL queries
- Frontend: React + React Router
- Styling: Tailwind CSS

## What This Project Can Do

- Admin login and logout
- Product CRUD
- Product search and pagination
- Product image uploads
- Public storefront
- Add to cart
- Basic checkout
- Admin dashboard with orders, revenue, stock view, and order status control

## Folder Structure

```text
TaskManager/
  backend/
    .env.example
    package.json
    src/
      app.js
      server.js
      config/
        db.js
        seedAdmin.js
      controllers/
        authController.js
        orderController.js
        productController.js
      middleware/
        authMiddleware.js
        errorMiddleware.js
      routes/
        authRoutes.js
        orderRoutes.js
        productRoutes.js
  database/
    schema.sql
  frontend/
    .env.example
    package.json
    src/
      App.jsx
      main.jsx
      index.css
      components/
        admin/
          ProductTable.jsx
          StatCard.jsx
        auth/
          ProtectedRoute.jsx
        cart/
          CartItem.jsx
        layout/
          AdminLayout.jsx
          PublicLayout.jsx
        store/
          ProductCard.jsx
      context/
        AuthContext.jsx
        CartContext.jsx
      pages/
        AdminDashboardPage.jsx
        AdminLoginPage.jsx
        AdminProductsPage.jsx
        CartPage.jsx
        NotFoundPage.jsx
        ProductFormPage.jsx
        StorefrontPage.jsx
      services/
        api.js
        authService.js
        orderService.js
        productService.js
  package.json
```

## Database Design

This project uses four core tables:

- `users`: stores admin and checkout users with roles
- `products`: stores items for sale
- `orders`: stores each order header
- `order_items`: stores each product inside an order

Important note:

- In this starter, the `users` table is used for both the admin account and checkout customers.
- The admin user is auto-created from environment variables when the backend starts.
- The `role` column is already included and is used to separate `admin` users from `customer` users.

## Full SQL Schema

The full SQL schema is in [schema.sql](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/database/schema.sql).

It creates:

- database `ecommerce_app`
- `users`
- `products`
- `orders`
- `order_items`

It also inserts sample products so the storefront is not empty on first run.

## Backend API

### Auth

- `POST /api/auth/login`
- `POST /api/auth/logout`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` `admin only`
- `PUT /api/products/:id` `admin only`
- `DELETE /api/products/:id` `admin only`

### Orders

- `POST /api/orders`
- `GET /api/orders` `admin only`
- `PATCH /api/orders/:id/status` `admin only`

## Example Postman Requests

### 1. Admin Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@yourstore.com",
  "password": "Admin123!"
}
```

### 2. Get All Products

```http
GET http://localhost:5000/api/products
```

### 2b. Search And Paginate Products

```http
GET http://localhost:5000/api/products?search=watch&category=Accessories&page=1&limit=6
```

### 3. Create Product

```http
POST http://localhost:5000/api/products
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

name=Canvas Backpack
price=85.5
category=Bags
stock=20
image=(select a file)
```

### 4. Update Product

```http
PUT http://localhost:5000/api/products/1
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

name=Canvas Backpack Pro
price=95
category=Bags
stock=14
image=(optional new file)
```

### 5. Delete Product

```http
DELETE http://localhost:5000/api/products/1
Authorization: Bearer YOUR_TOKEN_HERE
```

### 6. Create Order

```http
POST http://localhost:5000/api/orders
Content-Type: application/json

{
  "customerEmail": "customer@example.com",
  "items": [
    {
      "productId": 2,
      "quantity": 1
    },
    {
      "productId": 3,
      "quantity": 2
    }
  ]
}
```

### 7. Get Orders

```http
GET http://localhost:5000/api/orders
Authorization: Bearer YOUR_TOKEN_HERE
```

### 8. Update Order Status

```http
PATCH http://localhost:5000/api/orders/1/status
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "status": "shipped"
}
```

## How Frontend Connects To Backend

The frontend talks to the backend through the files in `frontend/src/services`.

- [api.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/api.js)
  This file stores the base backend URL and contains the shared `fetch()` logic.

- [authService.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/authService.js)
  This file calls the login and logout API.

- [productService.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/productService.js)
  This file fetches, searches, paginates, creates, updates, and deletes products.

- [orderService.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/orderService.js)
  This file creates orders and fetches orders for the admin dashboard.

The backend URL is controlled by:

- [frontend/.env.example](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/.env.example)
- [frontend/.env](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/.env)

Default value:

```env
VITE_API_URL=http://localhost:5000/api
```

## How To Run The Project Step By Step

### Step 1. Create the database

Open MySQL and run the SQL inside:

- [schema.sql](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/database/schema.sql)

This creates the `ecommerce_app` database and all tables.

### Step 2. Install all dependencies

From the root folder:

```powershell
cd C:\Users\Abdul Mannan\OneDrive\Documents\TaskManager
npm.cmd install
```

If needed, also install package dependencies inside backend and frontend:

```powershell
npm.cmd --prefix backend install
npm.cmd --prefix frontend install
```

### Step 3. Configure backend environment

The backend environment file is:

- [backend/.env](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/.env)

Main values:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_app
JWT_SECRET=super_secret_local_jwt_key_change_me
ADMIN_EMAIL=admin@yourstore.com
ADMIN_PASSWORD=Admin123!
```

### Step 4. Start the backend

```powershell
cd C:\Users\Abdul Mannan\OneDrive\Documents\TaskManager\backend
npm.cmd run dev
```

Backend URL:

- [http://localhost:5000](http://localhost:5000)

### Step 5. Start the frontend

Open a new terminal:

```powershell
cd C:\Users\Abdul Mannan\OneDrive\Documents\TaskManager\frontend
npm.cmd run dev
```

Frontend URL:

- usually [http://localhost:5173](http://localhost:5173)

### Step 6. Login to admin

Use:

- Email: `admin@yourstore.com`
- Password: `Admin123!`

The backend creates this user automatically the first time it starts, based on the values in `.env`.

## Role-Based Access

- Admin users can log in to the dashboard.
- Customer users are created automatically during checkout if their email does not exist yet.
- Product create, update, delete, and order listing routes are protected for admins only.
- Public shoppers can still browse products and place orders without admin login.

## Order Status Flow

- New orders start as `pending`.
- Admins can change order status to `paid`, `shipped`, `delivered`, or `cancelled`.
- The admin dashboard shows the current status for each recent order.
- This makes the app feel more like a real store back office.

## Product Image Uploads

- Admin product forms now accept image files instead of only pasted URLs.
- Uploaded files are stored in the local `uploads` folder on the backend.
- The backend serves them from `/uploads/...`.
- Sample seeded products still use remote image URLs, so both styles work.

### Step 7. Try the app

1. Open the storefront.
2. Add products to the cart.
3. Go to checkout and place an order.
4. Open the admin login page.
5. Login and view the dashboard.
6. Create, edit, and delete products.
7. Search products and move through paginated results.

## Run Both From Root Folder

You can also run both apps from the root workspace:

```powershell
cd C:\Users\Abdul Mannan\OneDrive\Documents\TaskManager
npm.cmd run dev
```

This uses the root [package.json](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/package.json).

## Deployment Setup

This project is now prepared for a simple one-service deployment flow:

- Build the React frontend
- Serve the built frontend from the Express backend
- Expose API routes and uploaded images from the same backend server

### Production Build Commands

From the root folder:

```powershell
cd C:\Users\Abdul Mannan\OneDrive\Documents\TaskManager
npm.cmd run build
npm.cmd run start
```

Useful root scripts:

- `npm.cmd run build`
  Builds the frontend into `frontend/dist`
- `npm.cmd run start`
  Starts the backend in production mode
- `npm.cmd run start:prod`
  Builds the frontend and then starts the backend

### Health Check

The backend now exposes:

```http
GET /api/health
```

### Render Deployment

The project includes:

- [render.yaml](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/render.yaml)

This file gives you a starter config for deploying to Render as one Node service.

### Production Environment Examples

- [backend/.env.production.example](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/.env.production.example)
- [frontend/.env.production.example](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/.env.production.example)

Important production note:

- In production, the frontend can use `VITE_API_URL=/api` because Express serves both the frontend and backend from the same domain.

## Simple Explanation Of Each File

### Root files

[package.json](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/package.json)

- This file helps run backend and frontend together from the root folder.
- It also includes build and production start scripts.

[.gitignore](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/.gitignore)

- This file tells Git to ignore `node_modules`, environment files, and other generated folders.

[render.yaml](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/render.yaml)

- This file is a deployment starter for Render.
- It defines build command, start command, and environment variables.

### Database files

[schema.sql](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/database/schema.sql)

- This file creates the full MySQL database schema.
- It also adds starter products so the UI has real content.

### Backend files

[backend/package.json](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/package.json)

- This file lists backend dependencies like Express, MySQL, JWT, and bcrypt.

[backend/.env.example](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/.env.example)

- This file shows which backend environment variables are needed.

[backend/.env.production.example](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/.env.production.example)

- This file shows example backend values for production deployment.

[backend/src/app.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/app.js)

- This file creates the Express app.
- It loads middleware and API routes.
- It also serves uploaded product images from the `uploads` folder.
- In production, it can also serve the built React app from `frontend/dist`.

[backend/src/server.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/server.js)

- This file starts the server.
- It checks the database and seeds the admin user.

[backend/src/config/db.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/config/db.js)

- This file creates the MySQL connection pool.

[backend/src/config/seedAdmin.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/config/seedAdmin.js)

- This file checks whether the admin user exists.
- If not, it creates the admin user from `.env`.

[backend/src/controllers/authController.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/controllers/authController.js)

- This file handles login and logout.

[backend/src/controllers/productController.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/controllers/productController.js)

- This file contains SQL logic for products.
- It handles create, read, update, delete, search, pagination, and uploaded image paths.

[backend/src/middleware/uploadMiddleware.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/middleware/uploadMiddleware.js)

- This file handles image uploads with Multer.
- It stores files inside the backend `uploads` folder.

[backend/src/controllers/orderController.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/controllers/orderController.js)

- This file handles checkout and order history.
- It uses a transaction so orders stay consistent.
- It also handles order status updates.

[backend/src/middleware/authMiddleware.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/middleware/authMiddleware.js)

- This file checks the JWT token before protected routes.

[backend/src/middleware/errorMiddleware.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/middleware/errorMiddleware.js)

- This file handles missing routes and server errors in one place.

[backend/src/routes/authRoutes.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/routes/authRoutes.js)

- This file connects auth URLs to auth controller functions.

[backend/src/routes/productRoutes.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/routes/productRoutes.js)

- This file connects product URLs to product controller functions.

[backend/src/routes/orderRoutes.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/routes/orderRoutes.js)

- This file connects order URLs to order controller functions.

### Frontend files

[frontend/package.json](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/package.json)

- This file lists frontend dependencies like React, Router, Vite, and Tailwind.

[frontend/.env.production.example](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/.env.production.example)

- This file shows the production frontend API setting.
- It points to `/api` so frontend and backend can share one domain in deployment.

[frontend/src/main.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/main.jsx)

- This file starts the React app.
- It wraps the app with router, auth context, and cart context.

[frontend/src/App.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/App.jsx)

- This file defines all frontend routes.

[frontend/src/index.css](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/index.css)

- This file loads Tailwind and the shared page styling.

[frontend/src/context/AuthContext.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/context/AuthContext.jsx)

- This file stores the logged-in admin token and user in local storage.

[frontend/src/context/CartContext.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/context/CartContext.jsx)

- This file stores the shopping cart in local storage.

[frontend/src/services/api.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/api.js)

- This file contains the shared API request helper.

[frontend/src/services/authService.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/authService.js)

- This file sends auth requests to the backend.

[frontend/src/services/productService.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/productService.js)

- This file sends product requests to the backend, including search filters, pagination values, and multipart upload form data.

[frontend/src/components/common/Pagination.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/components/common/Pagination.jsx)

- This reusable component shows previous, next, and page number buttons.

[frontend/src/utils/getImageUrl.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/utils/getImageUrl.js)

- This small helper turns relative uploaded image paths into full browser URLs.

[frontend/src/services/orderService.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/orderService.js)

- This file sends order requests to the backend, including status updates.

[frontend/src/components/auth/ProtectedRoute.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/components/auth/ProtectedRoute.jsx)

- This file protects admin pages.
- If the admin is not logged in, it redirects to login.

[frontend/src/components/layout/PublicLayout.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/components/layout/PublicLayout.jsx)

- This is the public storefront layout and top navigation.

[frontend/src/components/layout/AdminLayout.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/components/layout/AdminLayout.jsx)

- This is the admin dashboard layout with sidebar navigation.

[frontend/src/components/admin/StatCard.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/components/admin/StatCard.jsx)

- This small component shows one dashboard statistic card.

[frontend/src/components/admin/OrderStatusBadge.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/components/admin/OrderStatusBadge.jsx)

- This small component gives each order status a clear colored badge.

[frontend/src/components/admin/ProductTable.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/components/admin/ProductTable.jsx)

- This component shows the admin product table.

[frontend/src/components/store/ProductCard.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/components/store/ProductCard.jsx)

- This component shows one storefront product card.

[frontend/src/components/cart/CartItem.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/components/cart/CartItem.jsx)

- This component shows one item inside the shopping cart.

[frontend/src/pages/StorefrontPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/StorefrontPage.jsx)

- This page shows products for shoppers with search, category filter, and pagination.

[frontend/src/pages/CartPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/CartPage.jsx)

- This page shows the cart and checkout form.

[frontend/src/pages/AdminLoginPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/AdminLoginPage.jsx)

- This page lets the admin log in.

[frontend/src/pages/AdminDashboardPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/AdminDashboardPage.jsx)

- This page shows revenue, orders, inventory information, and lets the admin update order statuses.

[frontend/src/pages/AdminProductsPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/AdminProductsPage.jsx)

- This page lists all products for the admin and supports search plus pagination.

[frontend/src/pages/ProductFormPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/ProductFormPage.jsx)

- This page is used for both adding and editing products.
- It now supports image file uploads and live preview.

[frontend/src/pages/NotFoundPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/NotFoundPage.jsx)

- This page handles unknown URLs.

## Why This Project Is Good For Interviews

- It uses a real backend and database flow.
- It shows auth, CRUD, checkout, and dashboard features.
- It includes role-based authorization, which is important for real business apps.
- It uses raw SQL, which shows database understanding.
- It has a folder structure closer to real production projects.
- It can be extended later with payments, image uploads, customer auth, roles, and deployment.

## Good Next Upgrades

- Add payment integration
- Add deployment with Railway or VPS hosting

# NovaCart Marketplace

NovaCart is a full-stack e-commerce marketplace application built with `Node.js`, `Express`, `MySQL`, `React`, and `Tailwind CSS`.

It is designed to be:

- strong enough for interviews and portfolio presentation
- simple enough for beginners to study and extend
- structured enough to grow into a more serious business project later

## Preview

NovaCart includes:

- a public marketplace storefront
- product detail pages
- cart and checkout flow
- wishlist
- customer sign up and sign in
- customer account and order tracking
- admin dashboard
- admin product CRUD
- order management and status updates
- image uploads
- MySQL with raw SQL queries

## Tech Stack

### Frontend

- `React`
- `React Router`
- `Tailwind CSS`
- Context API for client-side state

### Backend

- `Node.js`
- `Express`
- `MySQL`
- `JWT`
- `Multer`
- raw SQL queries with `mysql2`

## Main Features

### Customer Side

- Browse products from a marketplace-style homepage
- Search products by keyword
- Filter by category
- View product details
- Save items to wishlist
- Add items to cart
- Choose delivery zone
- See checkout totals with delivery and service fees
- Create customer account
- Sign in as customer
- Track orders from account page
- Track orders by email lookup

### Admin Side

- Secure admin login
- Admin-only dashboard
- Create product
- Edit product
- Delete product
- Upload product image
- View recent orders
- Change order status
- Monitor revenue and low-stock items

### Backend / Database

- REST API with Express
- Proper route/controller/config structure
- MySQL connection with raw SQL
- Auto database bootstrap
- Admin seeding from environment variables
- Role-based authorization
- Shared API error handling

## Project Structure

```text
TaskManager/
  backend/
    .env.example
    .env.production.example
    package.json
    src/
      app.js
      server.js
      config/
        bootstrapDatabase.js
        db.js
        seedAdmin.js
      controllers/
        authController.js
        orderController.js
        productController.js
      middleware/
        authMiddleware.js
        errorMiddleware.js
        uploadMiddleware.js
      routes/
        authRoutes.js
        orderRoutes.js
        productRoutes.js
  database/
    schema.sql
  frontend/
    .env.example
    .env.production.example
    package.json
    src/
      App.jsx
      main.jsx
      index.css
      components/
      context/
      pages/
      services/
      utils/
  package.json
  render.yaml
  README.md
```

## Database Tables

NovaCart uses four main tables:

- `users`
- `products`
- `orders`
- `order_items`

### users

- `id`
- `name`
- `email`
- `password`
- `role`
- `created_at`

### products

- `id`
- `name`
- `price`
- `category`
- `image`
- `stock`
- `created_at`

### orders

- `id`
- `user_id`
- `total_amount`
- `status`
- `created_at`

### order_items

- `id`
- `order_id`
- `product_id`
- `quantity`

The full schema is in [database/schema.sql](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/database/schema.sql).

## API Overview

### Auth

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/register`
- `POST /api/auth/customer/login`
- `GET /api/auth/me`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Orders

- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/my-orders`
- `GET /api/orders/lookup?email=...`
- `PATCH /api/orders/:id/status`

## Sample API Requests

### Admin Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@yourstore.com",
  "password": "Admin123!"
}
```

### Customer Registration

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Customer Login

```http
POST http://localhost:5000/api/auth/customer/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Get Products With Search

```http
GET http://localhost:5000/api/products?search=watch&category=Accessories&page=1&limit=6
```

### Create Product

```http
POST http://localhost:5000/api/products
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: multipart/form-data

name=Canvas Backpack
price=85000
category=Bags
stock=20
image=(select a file)
```

### Create Order

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

### Lookup Orders By Email

```http
GET http://localhost:5000/api/orders/lookup?email=customer@example.com
```

## How Frontend Connects To Backend

The frontend talks to the backend through the service layer in `frontend/src/services`.

- [frontend/src/services/api.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/api.js)
  Shared API helper and base URL logic

- [frontend/src/services/authService.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/authService.js)
  Admin auth and customer auth requests

- [frontend/src/services/productService.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/productService.js)
  Product fetch, search, filter, create, update, delete

- [frontend/src/services/orderService.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/orderService.js)
  Checkout, admin order management, customer order history, and order lookup

Frontend backend URL:

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Setup

### 1. Clone the repo

```powershell
git clone https://github.com/TechSageHub/ecommerce-marketplace-app.git
cd ecommerce-marketplace-app
```

### 2. Install dependencies

```powershell
npm.cmd install
npm.cmd --prefix backend install
npm.cmd --prefix frontend install
```

### 3. Configure backend environment

Create `backend/.env` from [backend/.env.example](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/.env.example).

Example:

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
BACKEND_URL=http://localhost:5000
```

### 4. Create the database

Run the SQL in [database/schema.sql](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/database/schema.sql).

Important:

- the backend can also auto-bootstrap missing tables
- sample products are inserted for first-time use

### 5. Start the app

From the root:

```powershell
npm.cmd run dev
```

Or separately:

```powershell
cd backend
npm.cmd run dev
```

```powershell
cd frontend
npm.cmd run dev
```

### 6. Open the app

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000](http://localhost:5000)

### 7. Admin credentials

- Email: `admin@yourstore.com`
- Password: `Admin123!`

## Production / Deployment

This project is prepared for a simple single-service deployment flow.

### Root scripts

- `npm.cmd run dev`
- `npm.cmd run dev:backend`
- `npm.cmd run dev:frontend`
- `npm.cmd run build`
- `npm.cmd run start`
- `npm.cmd run start:prod`

### Build for production

```powershell
npm.cmd run build
npm.cmd run start
```

### Health endpoint

```http
GET /api/health
```

### Deployment files

- [render.yaml](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/render.yaml)
- [backend/.env.production.example](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/.env.production.example)
- [frontend/.env.production.example](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/.env.production.example)

## File Guide

### Root

[package.json](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/package.json)

- Runs frontend and backend from one root command

[.gitignore](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/.gitignore)

- Ignores `node_modules`, `.env`, uploads, and local generated files

[render.yaml](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/render.yaml)

- Starter deployment config for Render

### Backend

[backend/src/app.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/app.js)

- Creates the Express app
- Loads middleware and routes
- Serves uploaded images
- Serves frontend build in production

[backend/src/server.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/server.js)

- Starts the backend server
- Runs database bootstrap and admin seed

[backend/src/config/bootstrapDatabase.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/config/bootstrapDatabase.js)

- Creates database tables if missing
- Adds missing columns for compatibility
- Seeds starter products

[backend/src/config/db.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/config/db.js)

- Creates the MySQL connection pool

[backend/src/config/seedAdmin.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/config/seedAdmin.js)

- Ensures the admin user exists

[backend/src/controllers/authController.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/controllers/authController.js)

- Handles admin login
- Handles customer registration/login
- Returns JWT tokens
- Returns current authenticated user

[backend/src/controllers/productController.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/controllers/productController.js)

- Handles raw SQL product CRUD
- Handles search and pagination
- Handles image paths and file uploads

[backend/src/controllers/orderController.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/controllers/orderController.js)

- Handles checkout transactions
- Handles admin order listing
- Handles customer order history
- Handles public order lookup
- Handles status updates

[backend/src/middleware/authMiddleware.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/middleware/authMiddleware.js)

- Verifies JWT token
- Restricts admin-only routes

[backend/src/middleware/uploadMiddleware.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/middleware/uploadMiddleware.js)

- Handles Multer image uploads

[backend/src/routes/authRoutes.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/routes/authRoutes.js)

- Maps auth URLs to auth controller actions

[backend/src/routes/productRoutes.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/routes/productRoutes.js)

- Maps product URLs to product controller actions

[backend/src/routes/orderRoutes.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/backend/src/routes/orderRoutes.js)

- Maps order URLs to order controller actions

### Frontend

[frontend/src/main.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/main.jsx)

- Starts React
- Wraps the app with router and global providers

[frontend/src/App.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/App.jsx)

- Defines all public and admin routes

[frontend/src/index.css](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/index.css)

- Shared Tailwind base and global styling

[frontend/src/context/AuthContext.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/context/AuthContext.jsx)

- Stores logged-in user and token
- Handles customer/admin role flags

[frontend/src/context/CartContext.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/context/CartContext.jsx)

- Stores cart items in local storage

[frontend/src/context/WishlistContext.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/context/WishlistContext.jsx)

- Stores wishlist items in local storage

[frontend/src/context/DeliveryContext.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/context/DeliveryContext.jsx)

- Stores selected delivery zone across the app

[frontend/src/context/ToastContext.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/context/ToastContext.jsx)

- Shows loading, success, and error toast messages

[frontend/src/components/layout/PublicLayout.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/components/layout/PublicLayout.jsx)

- Marketplace-style public header, footer, delivery selector, and search

[frontend/src/components/layout/AdminLayout.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/components/layout/AdminLayout.jsx)

- Admin dashboard shell and nav

[frontend/src/pages/StorefrontPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/StorefrontPage.jsx)

- Homepage with categories, promotions, product sections, and search

[frontend/src/pages/ProductDetailPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/ProductDetailPage.jsx)

- Product detail view with wishlist, quantity, related items, and delivery info

[frontend/src/pages/CartPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/CartPage.jsx)

- Cart, delivery zone selection, and checkout total breakdown

[frontend/src/pages/WishlistPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/WishlistPage.jsx)

- Saved products page

[frontend/src/pages/CustomerAuthPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/CustomerAuthPage.jsx)

- Customer sign in and registration page

[frontend/src/pages/AccountPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/AccountPage.jsx)

- Customer account page and order tracking page

[frontend/src/pages/AdminDashboardPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/AdminDashboardPage.jsx)

- Revenue, orders, inventory alerts, and status updates

[frontend/src/pages/AdminProductsPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/AdminProductsPage.jsx)

- Admin product list with search and pagination

[frontend/src/pages/ProductFormPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/ProductFormPage.jsx)

- Create/edit product form with image preview

[frontend/src/pages/AdminLoginPage.jsx](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/pages/AdminLoginPage.jsx)

- Admin login screen

[frontend/src/services/api.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/api.js)

- Shared `fetch()` helper for API requests

[frontend/src/services/authService.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/authService.js)

- Admin auth and customer auth API requests

[frontend/src/services/productService.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/productService.js)

- Product requests and query params

[frontend/src/services/orderService.js](C:/Users/Abdul%20Mannan/OneDrive/Documents/TaskManager/frontend/src/services/orderService.js)

- Checkout, account orders, admin orders, and order lookup requests

## Why This Project Is Good For Interviews

- Shows full-stack thinking, not just UI work
- Uses a real database with raw SQL
- Includes auth, CRUD, checkout, order tracking, and dashboard features
- Separates admin and customer experiences
- Includes marketplace-style UX patterns
- Uses structured folders and reusable frontend components
- Can be demoed immediately and extended further

## Suggested Next Improvements

- Payment integration with Stripe or Paystack
- Email notifications for new orders
- Seller/store pages
- Product reviews and ratings
- Coupons and discount codes
- Live deployment with production MySQL database
- Screenshots and GIFs in this README

## Author Notes

This project was built as a portfolio-ready marketplace application and can be a good base for:

- internship and junior frontend/backend interviews
- full-stack portfolio presentations
- learning Express + MySQL + React together
- future expansion into a more business-focused store

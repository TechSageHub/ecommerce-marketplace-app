# NovaCart Interview Demo Script

## Goal

Use this script to present NovaCart clearly in an interview in about `3 to 5 minutes`.

## 1. Quick Introduction

Use something like this:

> "This is NovaCart, a full-stack e-commerce marketplace application I built with React, Tailwind CSS, Express, and MySQL using raw SQL queries. I wanted it to feel closer to a real marketplace product, so it includes both a customer shopping experience and an admin back office."

## 2. Start With The Storefront

What to show:

- Homepage
- search bar
- category filtering
- marketplace-style sections

What to say:

> "The public side is designed like a marketplace, not just a basic CRUD shop. Users can browse products, search by keyword, filter by category, and move through a more polished shopping flow."

## 3. Open A Product Detail Page

What to show:

- product image
- delivery info
- quantity selector
- wishlist
- related products

What to say:

> "Each product has its own detail page with wishlist support, quantity selection, delivery information, and related products. I wanted the experience to feel more complete than just a catalog grid."

## 4. Show Wishlist And Cart

What to show:

- save to wishlist
- add to cart
- open cart page
- checkout summary
- delivery zone
- calculated totals

What to say:

> "I also added a wishlist and a more realistic cart summary. The checkout includes delivery zone selection and a fuller total breakdown so it feels more like a production marketplace flow."

## 5. Show Customer Auth And Account

What to show:

- customer login / register page
- account page
- order tracking

What to say:

> "Customers can create accounts, sign in, and track orders from their account page. I also support order lookup by email, which helps guests still track purchases."

## 6. Show Admin Dashboard

What to show:

- admin login
- dashboard stats
- recent orders
- status updates
- low stock alerts

What to say:

> "On the admin side, I built a dashboard for managing the business side of the platform. Admins can view revenue, monitor orders, update status, and watch inventory health."

## 7. Show Product CRUD

What to show:

- product list
- search
- add product
- edit product
- image upload

What to say:

> "Admins can create, edit, and delete products, including image upload support. The backend uses raw SQL instead of an ORM, so I had to design the database queries and API flow directly."

## 8. Explain The Backend Briefly

What to say:

> "The backend is built with Express and MySQL. I used route, controller, middleware, and config separation to keep it structured. Authentication uses JWT, and the database bootstrap creates the schema and starter data for easier setup."

## 9. Close Strong

Use something like this:

> "What I like about this project is that it combines frontend UX, backend API design, authentication, database work, admin tooling, and marketplace behavior in one system. It’s also designed to be extendable with payments, seller features, reviews, and live deployment."

## Best Demo Order

1. Storefront
2. Product detail
3. Wishlist
4. Cart and checkout
5. Customer account
6. Admin login
7. Admin dashboard
8. Product CRUD

## Short Technical Highlights

If the interviewer asks what is technically interesting:

- raw SQL with MySQL instead of ORM
- role-based auth for admin and customer flows
- order status workflow
- local image uploads
- shared state with React Context
- production-minded structure and deployment setup

## If You Need A 30-Second Version

> "NovaCart is a full-stack e-commerce marketplace app I built with React, Tailwind, Express, and MySQL. It includes a customer storefront, cart, wishlist, customer authentication, order tracking, and an admin dashboard with product CRUD and order management. I built it to feel closer to a real marketplace product instead of a simple CRUD demo."

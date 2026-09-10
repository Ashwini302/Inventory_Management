# Inventory Management System

A full-stack web application for managing product inventories, tracking stock levels, monitoring low-stock alerts, and visualizing total inventory statistics. Built with **React (Vite)** on the frontend, **Node.js + Express.js** on the backend, and **MongoDB + Mongoose** for database persistence.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation & Running Locally](#installation--running-locally)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [API Documentation](#api-documentation)
  - [Health Check](#health-check)
  - [Get All Products](#get-all-products)
  - [Get Low-Stock Products](#get-low-stock-products)
  - [Get Product by ID](#get-product-by-id)
  - [Create Product](#create-product)
  - [Update Product](#update-product)
  - [Delete Product](#delete-product)
- [Error Handling](#error-handling)
- [Assumptions](#assumptions)
- [Future Improvements](#future-improvements)

---

## Overview

The **Inventory Management System** provides businesses and store managers with a streamlined dashboard to manage product catalogs. Users can add new products, update existing records, delete items with safety confirmations, search for items by name in real-time, filter by dynamic categories, and receive instant alerts for low-stock inventory items (`quantity <= minStock`).

---

## Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS3 (Custom Design System with CSS variables & Dark Theme Aesthetics)
- **Icons**: Custom Inline SVGs
- **HTTP Client**: Centralized native `fetch` API service

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (connected via Mongoose ORM)
- **Utilities**: `dotenv`, `cors`, `mongodb-memory-server` (for seamless out-of-the-box local testing)

---

## Key Features

- 📊 **Dashboard Statistics**: Dynamic real-time calculation of Total Products, Total Inventory Units, Low Stock Alert Count, and Total Inventory Value (`sum(price × quantity)`).
- ➕ **Product Creation**: Form validation preventing blank names/categories, negative prices, and negative quantities/thresholds.
- ✏️ **Product Update**: Full editing support for product details with pre-populated values and input validation.
- 🗑️ **Delete Confirmation**: Safe deletion prompt requiring confirmation before removing records from MongoDB.
- 🔍 **Real-Time Search**: Instant case-insensitive name filtering.
- 🏷️ **Dynamic Category Filter**: Categories automatically derived from active products in inventory.
- ⚠️ **Low Stock Detection**: Automatic visual highlighting and status badges (`LOW STOCK` vs `IN STOCK`) when `quantity <= minStock`. Dedicated backend route `GET /products/low-stock`.
- 🔔 **User Feedback**: Toast notifications for successful CRUD operations and inline error messages.
- 📱 **Responsive Layout**: Designed for seamless viewing across Desktop, Tablet, and Mobile screens.

---

## Project Structure

```text
Inventory_Management/
│
├── backend/                        # Express API & MongoDB Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Database connection logic
│   │   ├── controllers/
│   │   │   └── productController.js# API route logic & validation
│   │   ├── middleware/
│   │   │   └── errorHandler.js     # Central error handling middleware
│   │   ├── models/
│   │   │   └── Product.js          # Mongoose Product Schema & model
│   │   ├── routes/
│   │   │   └── productRoutes.js    # Express endpoints configuration
│   │   ├── app.js                  # Express application & CORS setup
│   │   └── server.js               # Server entry point
│   ├── .env.example                # Sample environment variables
│   └── package.json                # Backend dependencies & scripts
│
├── inventory_management/           # React Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryFilter.jsx  # Category selection dropdown
│   │   │   ├── ConfirmDeleteModal.jsx # Delete prompt modal
│   │   │   ├── DashboardStats.jsx  # Summary metrics cards
│   │   │   ├── Header.jsx          # Top navigation & backend status
│   │   │   ├── LowStockBadge.jsx   # Status badge indicator
│   │   │   ├── NotificationToast.jsx# Success/Error toast alerts
│   │   │   ├── ProductModal.jsx    # Add & Edit form modal
│   │   │   ├── ProductTable.jsx    # Responsive data table
│   │   │   ├── SearchBar.jsx       # Name search bar component
│   │   │   └── StateViews.jsx      # Loading, Empty, and Error views
│   │   ├── services/
│   │   │   └── productService.js   # Centralized API service
│   │   ├── App.css                 # Application styles
│   │   ├── App.jsx                 # Main React component
│   │   ├── index.css               # Global base styles & tokens
│   │   └── main.jsx                # React entry point
│   └── package.json                # Frontend dependencies & scripts
│
├── README.md                       # Comprehensive documentation
└── .gitignore                      # Git ignore rules
```

---

## Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MongoDB** (Local instance or MongoDB Atlas Connection String - *Optional fallback included for testing*)
- **Git**

---

## Environment Variables

### Backend (`backend/.env`)

Create a `.env` file inside the `backend` directory based on `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/inventory_db
CLIENT_URL=http://localhost:5173
```

> **Note**: If a local MongoDB instance is not detected, the backend will automatically spin up an in-memory MongoDB instance for local testing so you can evaluate the system out-of-the-box.

---

## Installation & Running Locally

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start backend server in development mode
npm run dev
```

The backend server will start on `http://localhost:5000`.

### 2. Frontend Setup

In a new terminal window:

```bash
# Navigate to frontend directory
cd inventory_management

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The React dashboard will be accessible at `http://localhost:5173`.

---

## API Documentation

### Health Check
- **Endpoint**: `GET /health`
- **Description**: Verifies API availability.
- **Response** (HTTP 200):
  ```json
  {
    "success": true,
    "message": "Inventory API is running",
    "timestamp": "2026-09-10T20:45:00.000Z"
  }
  ```

---

### Get All Products
- **Endpoint**: `GET /products`
- **Query Parameters**:
  - `search` *(optional)*: Search string for filtering product names.
  - `category` *(optional)*: Filter by exact category.
- **Response** (HTTP 200):
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "id": "64f8a123b456789012345678",
        "name": "Wireless Mouse",
        "category": "Electronics",
        "price": 1499,
        "quantity": 25,
        "minStock": 5,
        "createdAt": "2026-09-10T20:00:00.000Z"
      }
    ]
  }
  ```

---

### Get Low-Stock Products
- **Endpoint**: `GET /products/low-stock`
- **Description**: Returns all products where `quantity <= minStock`. *Note: Registered before `/:id` route to avoid route conflict.*
- **Response** (HTTP 200):
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "id": "64f8a987b654321098765432",
        "name": "Ergonomic Office Chair",
        "category": "Furniture",
        "price": 8999,
        "quantity": 2,
        "minStock": 5,
        "createdAt": "2026-09-10T20:05:00.000Z"
      }
    ]
  }
  ```

---

### Get Product by ID
- **Endpoint**: `GET /products/:id`
- **Response** (HTTP 200):
  ```json
  {
    "success": true,
    "data": {
      "id": "64f8a123b456789012345678",
      "name": "Wireless Mouse",
      "category": "Electronics",
      "price": 1499,
      "quantity": 25,
      "minStock": 5,
      "createdAt": "2026-09-10T20:00:00.000Z"
    }
  }
  ```
- **Error Response** (HTTP 404):
  ```json
  {
    "success": false,
    "message": "Product not found"
  }
  ```

---

### Create Product
- **Endpoint**: `POST /products`
- **Request Body**:
  ```json
  {
    "name": "Mechanical Keyboard",
    "category": "Electronics",
    "price": 4500,
    "quantity": 8,
    "minStock": 10
  }
  ```
- **Response** (HTTP 201):
  ```json
  {
    "success": true,
    "message": "Product created successfully",
    "data": {
      "id": "64f8b111b222333444555666",
      "name": "Mechanical Keyboard",
      "category": "Electronics",
      "price": 4500,
      "quantity": 8,
      "minStock": 10,
      "createdAt": "2026-09-10T20:10:00.000Z"
    }
  }
  ```
- **Error Response** (HTTP 400):
  ```json
  {
    "success": false,
    "message": "Price must be greater than 0"
  }
  ```

---

### Update Product
- **Endpoint**: `PUT /products/:id`
- **Request Body**:
  ```json
  {
    "name": "Dell Mechanical Keyboard",
    "category": "Electronics",
    "price": 4999,
    "quantity": 12,
    "minStock": 5
  }
  ```
- **Response** (HTTP 200):
  ```json
  {
    "success": true,
    "message": "Product updated successfully",
    "data": {
      "id": "64f8b111b222333444555666",
      "name": "Dell Mechanical Keyboard",
      "category": "Electronics",
      "price": 4999,
      "quantity": 12,
      "minStock": 5,
      "createdAt": "2026-09-10T20:10:00.000Z"
    }
  }
  ```

---

### Delete Product
- **Endpoint**: `DELETE /products/:id`
- **Response** (HTTP 200):
  ```json
  {
    "success": true,
    "message": "Product deleted successfully",
    "data": {
      "id": "64f8b111b222333444555666"
    }
  }
  ```

---

## Error Handling

### Backend Architecture
- **Input Validation**: Custom controller validation rules ensure required fields are present and validate types/ranges before executing Mongoose queries.
- **Centralized Error Middleware**: Intercepts unhandled errors, formatting standard JSON responses `{ "success": false, "message": "..." }`.
- **Database Safety**: Mongoose `CastError` (invalid ObjectId format) is caught and transformed to `400 Bad Request` instead of exposing MongoDB stack traces.

### Frontend Architecture
- **Validation Feedback**: Inline field errors in modal forms highlight specific missing or invalid inputs before form submission.
- **Network Resilience**: Centralized `productService` catches network or server failures, displaying a user-friendly error view with a **Try Again** action button.
- **Action Confirmation**: Deletions require user confirmation in a dedicated modal dialog to prevent accidental data loss.

---

## Assumptions

1. **Category Management**: Categories are user-defined strings assigned per product and dynamically grouped on the frontend dashboard.
2. **Stock Threshold**: Stock is flagged as `LOW STOCK` whenever `quantity <= minStock`.
3. **Database ObjectId Transformation**: MongoDB `_id` is automatically transformed to `id` in JSON API responses for clean frontend consumption.
4. **Local Development Fallback**: If a live MongoDB database instance is unavailable during local execution, the backend utilizes `mongodb-memory-server` to allow instant out-of-the-box feature verification.

---

## Future Improvements

- 🔒 **User Authentication & RBAC**: JWT-based login for Admin and Inventory Manager roles.
- 📄 **Pagination & Sorting**: Server-side pagination for large-scale product catalogs.
- 📈 **Stock Movement Audit Log**: Historical tracking of inventory stock increases/decreases.
- 📥 **CSV Export / Import**: Bulk import and export functionality for inventory data.
- 🌐 **Cloud Deployment**: Containerization with Docker and deployment scripts for AWS / Vercel / Render.

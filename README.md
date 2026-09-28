# Snitch E-Commerce API & Frontend

A secure, RESTful e-commerce API built with **Node.js, Express, MongoDB**, featuring **JWT Authentication (Access + Refresh Tokens)**, **express-validator**, and a modern frontend interface.

---

## Features

- **Authentication System**:
  - `name`, `email`, `password`, `confirmPassword` validation via `express-validator`.
  - Passwords hashed with `bcryptjs` (salt rounds: 10).
  - **Access Tokens**: Short-lived JWTs (15 mins) passed via standard `Authorization: Bearer <token>` header.
  - **Refresh Tokens**: Long-lived JWTs (7 days) persisted in MongoDB and sent in secure `httpOnly` cookies.
  - Automatic token refresh interceptor on the frontend when encountering `401 Unauthorized`.
  - Session revocation on logout and automatic cookie clearing.

- **Product Management (CRUD)**:
  - Create products with images, price, currency, sizes, and stock quantities (Seller only).
  - Public product catalog listing and detailed single product view by ID.
  - Seller dashboard to list, unlist, update, and delete products.
  - Parameter validation (`:id` as valid Mongo ObjectIDs) and body validation on all write operations.

- **Request Validation**:
  - `express-validator` middleware enforced across auth and product routes with field-level 400 error responses.

- **Frontend Application**:
  - Built with Vanilla HTML/CSS/JS (ES Modules).
  - Automatic auth state management, custom toast notifications, seller product management, product details view, and shopping cart.

---

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose), `express-validator`, `jsonwebtoken`, `bcryptjs`, `cookie-parser`, `multer`, `imagekit`
- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), ES6+ JavaScript, FontAwesome

---

## Project Structure

```text
ecommerce/
├── client/                     # Frontend Vanilla Web App
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css       # Design System & UI Styles
│   │   ├── js/
│   │   │   ├── api.js          # Fetch API & Refresh Token Interceptor
│   │   │   └── utils.js        # Helper Utilities
│   │   └── images/             # Static Assets
│   ├── index.html              # Product Catalog Page
│   ├── product.html            # Product Detail Page
│   ├── cart.html               # Shopping Cart Page
│   ├── profile.html            # User Profile Page
│   ├── login.html              # Login Page
│   ├── register.html           # Registration Page
│   └── seller-dashboard.html   # Seller Management Dashboard
│
└── server/                     # Backend Express REST API
    ├── src/
    │   ├── app/                # Express App Setup & Middleware
    │   ├── config/             # DB & ImageKit Config
    │   ├── controllers/        # Route Handlers (Auth, Product, Cart)
    │   ├── middleware/         # Auth & Validation Middlewares
    │   ├── models/             # Mongoose Schemas (User, Product, Cart)
    │   ├── routes/             # Express Routers
    │   ├── utils/              # JWT Generator & Token Helpers
    │   └── validations/        # express-validator Schemas
    └── index.js                # Server Entrypoint
```

---

## Installation & Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB instance (local or MongoDB Atlas connection string)

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with your configurations
cat <<EOT > .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_ACCESS_SECRET=your_access_token_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
EOT

# Start server in development mode
npm run dev
```

### 2. Frontend Setup

You can serve the `client/` directory using any static web server (e.g., Live Server extension in VS Code, `npx serve client`, or Python HTTP server):

```bash
# Serve client folder on port 8000
npx serve client -p 8000
```

---

## API Documentation

### 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (`name`, `email`, `password`, `confirmPassword`). Returns created user profile. |
| `POST` | `/api/auth/login` | Public | Authenticate user. Returns `accessToken` in body and sets `refreshToken` in `httpOnly` cookie. |
| `POST` | `/api/auth/refresh-token` | Public* | Verify `refreshToken` cookie & MongoDB session, issues new access token. |
| `POST` | `/api/auth/logout` | Authenticated | Clears stored refresh token in DB and clears `httpOnly` cookie. |
| `GET` | `/api/auth/me` | Authenticated | Fetch logged-in user profile. |

### 2. Product Endpoints (`/api/products`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Get all active/published products. |
| `GET` | `/api/products/:id` | Public | Get single product by ID (validates `:id` format). |
| `POST` | `/api/products` | Authenticated (Seller) | Create a new product (supports image uploads & stock sizes). |
| `PUT` | `/api/products/:id` | Authenticated (Seller) | Update product details by ID. |
| `DELETE` | `/api/products/:id` | Authenticated (Seller) | Delete product by ID. |
| `GET` | `/api/products/seller` | Authenticated (Seller) | Get all products uploaded by logged-in seller. |
| `PATCH` | `/api/products/list/:id` | Authenticated (Seller) | Publish/List an unlisted product. |
| `PATCH` | `/api/products/unlist/:id` | Authenticated (Seller) | Unlist a product from public view. |

### 3. Cart Endpoints (`/api/cart`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Authenticated | Fetch items in user's shopping cart. |
| `POST` | `/api/cart/add` | Authenticated | Add product item to cart. |

---

## Error Handling & Validation Format

All invalid requests rejected by `express-validator` return `400 Bad Request` with structured field-level error messages:

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "Passwords do not match",
      "path": "confirmPassword",
      "location": "body"
    }
  ]
}
```

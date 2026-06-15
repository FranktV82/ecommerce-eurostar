# E-commerce Eurostar REST API

## Description

This project is a REST API for an e-commerce platform built with **Node.js** and **Express**. It allows consumers to register, log in to receive a JWT token, and perform authenticated checkouts. All data is stored in memory — no database is required.

The API follows a layered architecture with **Routes**, **Middleware**, **Controllers**, **Services**, and **Models** under the `src` folder.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/FranktV82/ecommerce-eurostar.git
cd ecommerce-eurostar
```

2. Install dependencies:

```bash
npm install
```

## How to Run

Start the server:

```bash
npm start
```

The API runs at `http://localhost:3001` by default. You can change the port with the `PORT` environment variable.

For development with auto-restart on file changes:

```bash
npm run dev
```

## Rules

- **Authentication**: Only authenticated users (with a valid JWT) can perform checkout.
- **Payment methods**: Checkout accepts only `cash` or `credit_card`.
- **Cash discount**: Paying with `cash` applies a **10% discount** on the order subtotal.
- **In-memory storage**: Users and products are stored in memory. Data resets when the server restarts.
- **Endpoints**: The API exposes exactly four endpoints — register, login, checkout, and healthcheck.

## Existent Data

### Users (password for all: `password123`)

| ID | Email               | Name           |
|----|---------------------|----------------|
| 1  | alice@example.com   | Alice Johnson  |
| 2  | bob@example.com     | Bob Smith      |
| 3  | carol@example.com   | Carol Williams |

### Products

| ID | Name                     | Price  |
|----|--------------------------|--------|
| 1  | Eurostar Standard Ticket | £89.00 |
| 2  | Eurostar Plus Ticket     | £149.00|
| 3  | Travel Insurance         | £25.00 |

## How to Use the REST API

### 1. Healthcheck

Verify the server is running.

```http
GET /healthcheck
```

**Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2026-06-15T12:00:00.000Z"
}
```

---

### 2. Register

Create a new user account.

```http
POST /register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "mypassword",
  "name": "New User"
}
```

**Response (201):**

```json
{
  "user": {
    "id": 4,
    "email": "newuser@example.com",
    "name": "New User"
  },
  "token": "<JWT>"
}
```

---

### 3. Login

Authenticate and receive a JWT token.

```http
POST /login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "user": {
    "id": 1,
    "email": "alice@example.com",
    "name": "Alice Johnson"
  },
  "token": "<JWT>"
}
```

---

### 4. Checkout

Complete a purchase. Requires authentication.

```http
POST /checkout
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "productIds": [1, 3],
  "paymentMethod": "cash"
}
```

**Payment methods:** `cash` or `credit_card`

**Response (200) — cash payment (10% discount applied):**

```json
{
  "items": [
    {
      "id": 1,
      "name": "Eurostar Standard Ticket",
      "description": "One-way standard class ticket on Eurostar",
      "price": 89
    },
    {
      "id": 3,
      "name": "Travel Insurance",
      "description": "Comprehensive travel insurance for your journey",
      "price": 25
    }
  ],
  "paymentMethod": "cash",
  "subtotal": 114,
  "discount": 11.4,
  "total": 102.6
}
```

**Example with credit card (no discount):**

```json
{
  "productIds": [2],
  "paymentMethod": "credit_card"
}
```

**Response (200):**

```json
{
  "items": [
    {
      "id": 2,
      "name": "Eurostar Plus Ticket",
      "description": "One-way plus class ticket with extra legroom",
      "price": 149
    }
  ],
  "paymentMethod": "credit_card",
  "subtotal": 149,
  "discount": 0,
  "total": 149
}
```

---

### Error responses

| Status | Scenario                                      |
|--------|-----------------------------------------------|
| 400    | Missing or invalid request body               |
| 401    | Missing, invalid, or expired JWT              |
| 404    | One or more product IDs not found             |
| 409    | Email already registered                      |

### Example with cURL

```bash
# Login
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'

# Checkout with cash (replace TOKEN with the JWT from login)
curl -X POST http://localhost:3001/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"productIds":[1,3],"paymentMethod":"cash"}'
```

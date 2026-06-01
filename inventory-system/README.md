# StockFlow — Inventory & Order Management System

A full-stack **Inventory & Order Management System** built with FastAPI, React, and PostgreSQL, containerized with Docker.

---

## 🏗️ Architecture

```
┌─────────────────┐     HTTP      ┌──────────────────┐     SQL      ┌─────────────┐
│  React Frontend │ ────────────► │  FastAPI Backend  │ ──────────► │  PostgreSQL │
│   (Port 3000)   │               │   (Port 8000)     │             │  (Port 5432)│
└─────────────────┘               └──────────────────┘             └─────────────┘
```

**Tech Stack:**
- **Frontend:** React 18, React Router v6, Axios, react-hot-toast
- **Backend:** Python 3.11, FastAPI, SQLAlchemy, Pydantic
- **Database:** PostgreSQL 15
- **Containerization:** Docker, Docker Compose

---

## ✅ Features & Business Rules

### Products
- Full CRUD (Create, Read, Update, Delete)
- **Unique SKU enforcement** — duplicate SKUs are rejected
- Low-stock alerts (≤ 5 units highlighted)
- Category and description support

### Customers
- Full CRUD
- **Unique email enforcement** — duplicate emails are rejected
- Contact details: phone, address

### Orders
- Multi-item order creation
- **Stock validation** — orders are rejected if any item exceeds available stock
- **Automatic stock deduction** — stock is reduced immediately on order creation
- Order status lifecycle: `pending → confirmed → shipped → delivered → cancelled`
- Real-time total calculation

### Dashboard
- Live stats: total products, customers, orders, revenue
- Low-stock item count
- Pending order count

---

## 🚀 Quick Start (Local with Docker)

### Prerequisites
- [Docker Desktop](https://docs.docker.com/get-docker/) installed
- [Git](https://git-scm.com/) installed

### Step 1 — Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/inventory-system.git
cd inventory-system
```

### Step 2 — Set up environment variables
```bash
cp .env.example .env
# Edit .env if you want to change passwords (optional for local dev)
```

### Step 3 — Build and start all services
```bash
docker-compose up --build
```

Wait about 30–60 seconds for all services to start.

### Step 4 — Access the application
| Service   | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:3000        |
| Backend API | http://localhost:8000      |
| API Docs  | http://localhost:8000/docs   |

---

## 🔌 API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products |
| POST | `/products` | Create a product |
| GET | `/products/{id}` | Get a product |
| PUT | `/products/{id}` | Update a product |
| DELETE | `/products/{id}` | Delete a product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | List all customers |
| POST | `/customers` | Create a customer |
| GET | `/customers/{id}` | Get a customer |
| PUT | `/customers/{id}` | Update a customer |
| DELETE | `/customers/{id}` | Delete a customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | List all orders |
| POST | `/orders` | Create an order |
| GET | `/orders/{id}` | Get an order |
| PATCH | `/orders/{id}/status` | Update order status |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get summary statistics |

---

## ☁️ Deployment Guide

### Backend — Deploy on Render (Free)

1. Go to [render.com](https://render.com) and sign up
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Name:** `stockflow-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   ```
6. For PostgreSQL: Click **"New"** → **"PostgreSQL"** on Render, copy the connection URL

### Frontend — Deploy on Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Add New Project"** → import your GitHub repo
3. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```
5. Click **Deploy**

### Alternative: Deploy on Railway (Free tier)

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Add a PostgreSQL plugin
4. Set environment variables for both backend and frontend services

---

## 🐳 Docker Hub

### Push backend image
```bash
docker build -t YOUR_DOCKERHUB_USERNAME/stockflow-backend:latest ./backend
docker push YOUR_DOCKERHUB_USERNAME/stockflow-backend:latest
```

### Push frontend image
```bash
docker build -t YOUR_DOCKERHUB_USERNAME/stockflow-frontend:latest ./frontend
docker push YOUR_DOCKERHUB_USERNAME/stockflow-frontend:latest
```

### Pull and run from Docker Hub
```bash
# Pull images
docker pull YOUR_DOCKERHUB_USERNAME/stockflow-backend:latest
docker pull YOUR_DOCKERHUB_USERNAME/stockflow-frontend:latest

# Run with compose
docker-compose up
```

---

## 📁 Project Structure

```
inventory-system/
├── backend/
│   ├── main.py          # FastAPI app & routes
│   ├── models.py        # SQLAlchemy database models
│   ├── schemas.py       # Pydantic validation schemas
│   ├── crud.py          # Database operations
│   ├── database.py      # DB connection setup
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios API calls
│   │   ├── pages/       # Dashboard, Products, Customers, Orders
│   │   ├── App.js       # Router & layout
│   │   └── App.css      # Global styles
│   ├── public/
│   ├── nginx.conf       # SPA routing config
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔧 Development (without Docker)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
export DATABASE_URL="postgresql://postgres:password@localhost:5432/inventory_db"
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

---

## 📝 Sample Data to Test

**Create a Product:**
```json
POST /products
{
  "name": "Wireless Headphones",
  "sku": "WH-001",
  "price": 49.99,
  "stock_quantity": 100,
  "category": "Electronics"
}
```

**Create a Customer:**
```json
POST /customers
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+91-9876543210"
}
```

**Create an Order:**
```json
POST /orders
{
  "customer_id": 1,
  "items": [{"product_id": 1, "quantity": 2}],
  "notes": "Express delivery please"
}
```

---

## 🛡️ Business Rules Summary

| Rule | Implementation |
|------|---------------|
| Unique SKU | 400 error on duplicate SKU |
| Unique Email | 400 error on duplicate email |
| Stock validation | 400 error if quantity > stock |
| Auto stock deduction | Stock reduced atomically on order creation |
| Positive prices | Pydantic validator rejects ≤ 0 |
| Non-empty orders | Must have at least 1 item |

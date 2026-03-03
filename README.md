# 🖧 Sir Host — Full MERN Hosting Website

Fast, Reliable, Affordable hosting platform built with MongoDB, Express, React, and Node.js.

---

## 📁 Project Structure

```
sirhost/
├── server/          ← Node.js + Express API
│   ├── index.js
│   ├── .env
│   ├── models/      ← Mongoose schemas (User, Plan, Order, Contact)
│   ├── controllers/ ← Business logic
│   ├── routes/      ← API endpoints
│   └── middleware/  ← JWT auth guard
│
└── client/          ← React + Vite frontend
    └── src/
        ├── pages/
        │   ├── public/Home.jsx      ← Full public website
        │   └── admin/               ← Admin panel pages
        │       ├── Login.jsx
        │       ├── Dashboard.jsx    ← Charts & stats
        │       ├── Plans.jsx        ← CRUD hosting plans
        │       ├── Orders.jsx       ← Manage subscriptions
        │       ├── Messages.jsx     ← Contact messages + reply
        │       └── Users.jsx        ← Manage customers
        ├── components/admin/AdminLayout.jsx
        ├── context/AuthContext.jsx
        └── utils/api.js
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)

### 1. Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 2. Configure environment

The `server/.env` file is already configured for local development:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sirhost
JWT_SECRET=sirhost_super_secret_jwt_key_2024
JWT_EXPIRE=7d
ADMIN_EMAIL=sirhost.ng@gmail.com
ADMIN_PASSWORD=Admin@SirHost2024
```

Change `JWT_SECRET` and `ADMIN_PASSWORD` for production!

### 3. Run the backend

```bash
cd server
npm run dev      # development (nodemon)
# or
npm start        # production
```

Server starts at: **http://localhost:5000**

On first run it will:
- Connect to MongoDB
- Auto-create the admin account
- Seed 9 default hosting plans (3 web, 3 VPS, 3 dedicated)

### 4. Run the frontend

```bash
cd client
npm run dev
```

Frontend starts at: **http://localhost:5173**

---

## 🔐 Admin Panel

**URL:** http://localhost:5173/admin/login

**Default credentials:**
- Email: `sirhost.ng@gmail.com`
- Password: `Admin@SirHost2024`

### Admin Features:
| Page       | Features |
|------------|----------|
| Dashboard  | Revenue charts, order stats, pie chart, bar charts |
| Plans      | Create / edit / delete hosting plans with features |
| Orders     | View all orders, update status, create new orders |
| Messages   | View contact messages, mark read, send replies |
| Users      | View customers, activate/suspend/delete accounts |

---

## 🌐 Public Website

**URL:** http://localhost:5173

### Sections:
- **Hero** — CTA with stats
- **Services** — Web, VPS, Dedicated, Domains
- **Features** — NVMe, SSL, Backups, Support
- **Pricing** — Live from DB (tabbed: Web / VPS / Dedicated)
- **Domain Search** — With extension pricing
- **About** — Company info and metrics
- **Testimonials** — Customer reviews
- **Contact** — Form that saves to MongoDB

---

## 📡 API Endpoints

| Method | Endpoint              | Auth    | Description          |
|--------|-----------------------|---------|----------------------|
| POST   | /api/auth/login       | Public  | Admin/user login     |
| GET    | /api/auth/me          | JWT     | Get current user     |
| GET    | /api/plans            | Public  | List active plans    |
| POST   | /api/plans            | Admin   | Create plan          |
| PUT    | /api/plans/:id        | Admin   | Update plan          |
| DELETE | /api/plans/:id        | Admin   | Delete plan          |
| POST   | /api/contacts         | Public  | Submit contact form  |
| GET    | /api/contacts         | Admin   | List all messages    |
| POST   | /api/contacts/:id/reply | Admin | Reply to message   |
| GET    | /api/orders           | Admin   | List all orders      |
| GET    | /api/orders/stats     | Admin   | Dashboard stats      |
| POST   | /api/orders           | Admin   | Create order         |
| PUT    | /api/orders/:id/status| Admin  | Update order status  |
| GET    | /api/users            | Admin   | List all users       |
| POST   | /api/users            | Admin   | Create user          |
| PUT    | /api/users/:id/status | Admin  | Suspend/activate     |
| DELETE | /api/users/:id        | Admin   | Delete user          |

---

## 🏗️ Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Database  | MongoDB + Mongoose      |
| Backend   | Node.js + Express       |
| Auth      | JWT + bcryptjs          |
| Frontend  | React 18 + Vite         |
| Routing   | React Router v6         |
| Charts    | Recharts                |
| HTTP      | Axios                   |
| Font      | Sora (Google Fonts)     |

---

## 📞 Contact Details

- **Phone:** 07025519997
- **Email:** sirhost.ng@gmail.com
- **Address:** 31 Monrocia Street, Wuse 2, Abuja, Nigeria

---

## 📦 Production Deployment

1. Build the React app: `cd client && npm run build`
2. Serve the `client/dist` folder via Express static middleware or a CDN
3. Set `MONGO_URI` to your MongoDB Atlas connection string
4. Change `JWT_SECRET` to a strong random string
5. Deploy server to Railway, Render, or any Node.js host

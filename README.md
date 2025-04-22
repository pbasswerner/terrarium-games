# 🎲 Terrarium Games

Terrarium Games is a full-stack e-commerce web application built to showcase and manage a board game storefront. It supports public browsing, user registration, bookmarking, product notifications, and an admin dashboard for game management.

---

## 🚀 Live Demo

- **Frontend:** [terrarium-games.vercel.app](https://terrarium-games-client.vercel.app)
- **Backend API:** [https://terrarium-games.onrender.com/](https://terrarium-games.onrender.com/)


---

## 👤 User Flows

### 🔓 Unlogged User
- View all games (from Prisma + Shopify).
- Click "Buy" for Shopify games → opens Shopify store.
- Click "Notify Me" on Prisma games → redirects to login.
- Access: Home, Game Page, Login, Register.

### 🔐 Logged-In User
- Bookmark games and toggle bookmarks.
- Use "Notify Me" on Prisma games (no duplicates).
- View Profile with:
  - Bookmarked games
  - Notify Me list
- Logout and authentication handling.

### 👩‍💼 Admin User
- Access Admin Dashboard:
  - Add/Edit/Delete games
  - Manage visibility
- Dashboard UI mirrors product cards with admin controls.
- Access: Add Product, Edit Product, Admin Dashboard.

---

## ✨ Features

- React frontend (with Bootstrap UI)
- Node + Express + Prisma backend
- Secure token-based auth (cookie-based)
- External API integration: **Shopify Storefront API**
- Responsive design
- Protected admin routes
- Dynamic cards (Buy vs Notify)
- Bookmarking and product notifications
- Reusable modals + confirmation flows
- Live toast alerts and badge statuses

---

## 📁 Folder Structure

```
📦 root/
├── terrarium-client/          # React app
├── api/             # Express backend + Prisma
├── prisma/          # Prisma schema + migrations
├── accessibility_reports/ # Lighthouse reports
└── README.md
```

---

## 📊 Lighthouse Accessibility Reports
Saved in `accessibility_reports/`:
- Home Page
- Game Detail Page
- Profile Page

---

## 🧪 Tests

- All tests written using **React Testing Library**
- Located in `terrarium-client/src/tests/`


_Last updated: April 21, 2025_


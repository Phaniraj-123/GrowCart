# 🌾 GrowCart – Farm & Grocery E-commerce Platform

> A ready-to-launch e-commerce platform built for grocery stores, farm supply shops, and local produce sellers.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()
[![Built With](https://img.shields.io/badge/Built%20With-Vanilla%20JS-yellow.svg)]()

---

## 🌿 About GrowCart

GrowCart is a ready-to-launch e-commerce platform designed for grocery stores, farm supply shops, and local produce sellers. It includes a complete admin dashboard for managing products, orders, and inventory — no heavy frameworks, just clean and fast Vanilla JS.

---

## ✨ Features

- 🛒 **Product Catalog** — Organized listings with categories and pricing
- 🧺 **Shopping Cart** — Add, update, and remove items seamlessly
- 📦 **Order Tracking** — Customers can follow their orders in real-time
- 🖥️ **Admin Dashboard** — Full control over the store from one place
- 📊 **Inventory Management** — Monitor stock levels and get low-stock alerts
- 📱 **Mobile Responsive UI** — Looks great on any screen size
- 🚚 **Delivery System Ready** — Built with delivery workflow integration in mind

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Dev Tools | Nodemon |

---

## 📸 Screenshots

### 🏠 Home Page
![Home Page](./screenshots/home.png)

### 🛒 Product Catalog
![Product Catalog](./screenshots/catalog.png)

### 🧺 Shopping Cart
![Shopping Cart](./screenshots/cart.png)

### 🖥️ Admin Dashboard
![Admin Dashboard](./screenshots/admin.png)

### 📦 Order Tracking
![Order Tracking](./screenshots/orders.png)

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- MySQL (local or remote)
- npm

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/growcart.git
cd growcart

# 2. Install dependencies
npm install
```

### Database Setup
```bash
# Import the SQL schema
mysql -u root -p your_database_name < database/growcart.sql
```

### Environment Variables

Create a `.env` file in the root directory:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=growcart
SESSION_SECRET=your_secret_key
```

### Run the App
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

App will be live at `http://localhost:3000`

---

## 📡 API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Add product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/:id` | Get order details |
| PUT | `/api/orders/:id/status` | Update order status (admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | View cart |
| POST | `/api/cart` | Add item to cart |
| DELETE | `/api/cart/:id` | Remove item |

---

## 🗺️ Roadmap

- [ ] Payment gateway integration (Stripe / Razorpay)
- [ ] Customer reviews & ratings
- [ ] Email notifications on order updates
- [ ] Discount codes & promotions
- [ ] Sales analytics in admin dashboard

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/Phaniraj-123)
- LinkedIn: [yourname](https://linkedin.com/in/phanirajbn)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## ⭐ Support

If you like this project, please give it a ⭐ on GitHub — it helps a lot!

---

> *"From the farm to your door — fresh, fast, and simple."* 🥦🚜

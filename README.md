# 💰 Expense Tracker — Smart Personal Finance Manager

A modern, full-stack expense tracking application designed to help users **monitor spending, manage finances, and gain insights into their habits** — built with a focus on clean UI, scalability, and real-world architecture.

---

## 🚀 Live Demo

👉 *https://expense-tracker-cyan-nine-41.vercel.app/*

---

## ✨ Features

### 🔹 Core Functionality

* Add, edit, and delete expenses
* Categorize transactions
* Real-time updates

### 📊 Analytics & Insights

* Visual breakdown of spending
* Category-wise expense distribution
* Time-based filtering (daily / monthly)
* Smart financial overview

### 🔐 Authentication

* Secure user login & signup
* Session-based access control
* Protected routes

### ⚡ Performance

* Optimized rendering with modern React architecture
* Fast data fetching and updates
* Smooth user experience

---

## 🧠 Problem It Solves

Managing personal finances manually is inefficient and error-prone.
This project provides:

* A **centralized system** to track expenses
* **Clear visibility** into spending habits
* A foundation for **better financial decisions**

Expense tracking apps help users log, categorize, and analyze spending effectively, improving financial awareness and planning

---

## 🛠 Tech Stack

### Frontend

* Next.js
* React Hooks
* Tailwind CSS

### Backend / Database

* Supabase
* PostgreSQL

### Deployment

* Vercel

---

## 🏗 Architecture Overview

```text
User Action (Add Expense)
        ↓
Frontend (React UI)
        ↓
API / Supabase Client
        ↓
Database (Store Transaction)
        ↓
UI Updates in Real-time
```

### Key Design Decisions:

* Backend handled via Supabase (no custom server needed)
* Clean separation between UI and data logic
* Scalable schema for future analytics features

---

## 📂 Project Structure

```bash
/app            → Routes & pages
/components     → Reusable UI components
/hooks          → Custom hooks
/lib            → API & utility functions
/public         → Static assets
```

---

## ⚙️ Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

## 🧪 Run Locally

```bash
npm install
npm run dev
```

### Production Mode Test

```bash
npm run build
npm start
```

---

## 📈 Future Improvements

* Export data (CSV / PDF)
* Multi-user shared expense tracking
* AI-based financial insights

---

## 💡 Key Learnings

* Managing **client vs server data flow**
* Handling **authentication with Supabase**
* Designing **scalable database schemas**
* Building **real-world production apps**

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a PR

---

## 📄 License

MIT License

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!

---

## 👨‍💻 Author

Built with a focus on solving real-world problems and improving developer skills.

---
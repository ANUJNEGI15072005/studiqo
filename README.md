# Studiqo 🚀

Studiqo is an AI-powered study planner and productivity web app that helps students organize tasks, generate smart study schedules, and stay consistent.

---

## ✨ Features

* 🔐 Authentication (Email + Google)
* 🤖 AI Study Plan Generator
* 📝 Smart Notes System
* 📅 Task & Schedule Management
* ⚡ Clean and responsive UI

---

## 🛠️ Tech Stack

* Frontend: Next.js, React, Tailwind CSS
* Backend: Next.js API Routes
* Database: MongoDB
* Auth: Better Auth (Email + Google OAuth)
* Deployment: Vercel

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/studiqo.git
cd studiqo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env.local` file:

```env
MONGO_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 4. Run the development server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🌐 Deployment

The app is deployed on Vercel.

Make sure to update environment variables in production:

```env
BETTER_AUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

Also update Google OAuth redirect URLs accordingly.

---

## 📌 Notes

* Do not commit `.env` files
* Ensure MongoDB network access is enabled
* Google OAuth must include correct redirect URIs

---

## 👨‍💻 Author

Anuj Negi

---

## 📄 License

This project is for learning and personal use.

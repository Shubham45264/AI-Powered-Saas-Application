# 🎥 AI-Powered Saas Application

A **modern, full-stack SaaS application** built with **Next.js 14**, **Cloudinary**, **Clerk**, and **Prisma** that enables users to **compress large videos using AI-driven optimization** and **convert images into social-media-ready formats** for **Instagram, Twitter (X), and Facebook**—all from a single dashboard.

---

## 🏷️ Tech Badges

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge\&logo=next.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-blue?style=for-the-badge\&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge\&logo=prisma)
![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge\&logo=clerk)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge\&logo=cloudinary)

---

## ✨ Features

### 📉 AI-Powered Video Compression

* Upload and process large videos (**60MB+**) asynchronously
* Automatic resolution downscaling (up to **480p**)
* **Eco-quality optimization** for up to **90% file size reduction**
* Cloud-based processing using **Cloudinary**

---

### 🖼️ Social Media Image Converter

Convert a single image into multiple **platform-specific formats** instantly:

| Platform        | Formats Supported            |
| --------------- | ---------------------------- |
| **Instagram**   | Square (1:1), Portrait (4:5) |
| **Twitter (X)** | Landscape (16:9)             |
| **Facebook**    | Feed & Cover sizes           |

* Auto-cropping and smart alignment
* Real-time preview before download
* Optimized for social sharing

---

### 🔐 Authentication & User Management

* Secure authentication powered by **Clerk**
* Custom sign-in and sign-up flows
* Webhook-based user syncing with PostgreSQL (Neon)

---

### 📱 Modern Dashboard UI

* Glassmorphic design using **Tailwind CSS & DaisyUI**
* Fully responsive across all devices
* Intuitive media management experience

---

## 🛠️ Tech Stack

| Category         | Technology              |
| ---------------- | ----------------------- |
| Framework        | Next.js 14 (App Router) |
| Styling          | Tailwind CSS, DaisyUI   |
| Authentication   | Clerk                   |
| Database         | PostgreSQL (Neon.tech)  |
| ORM              | Prisma                  |
| Media Processing | Cloudinary              |
| Deployment       | Vercel                  |
| Version Control  | GitHub                  |

---

## 🚀 Getting Started

### ✅ Prerequisites

* Node.js **18+**
* Cloudinary account
* Clerk account
* PostgreSQL database (Neon recommended)

---

### 📦 Installation

```bash
git clone https://github.com/Shubham45264/AI-Powered-Saas-Application.git
cd AI-Powered-Saas-Application/28-ai-powered-saas
npm install
```

---

### 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Database
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"

# Webhooks
CLERK_WEBHOOK_SECRET=your_webhook_secret
```

---

### 🗄️ Database Setup

```bash
npx prisma db push
npx prisma generate
```

---

### ▶️ Run the Application

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔗 Clerk Webhook Configuration

1. Open **Clerk Dashboard → Webhooks**
2. Add endpoint:

   ```
   https://your-domain.com/api/webhooks/clerk
   ```
3. Subscribe to:

   * `user.created`
   * `user.updated`
   * `user.deleted`
4. Add the signing secret to `.env`:

   ```env
   CLERK_WEBHOOK_SECRET=your_webhook_secret
   ```

---

## 📌 Use Cases

* Content creators optimizing media for social platforms
* SaaS products requiring media compression
* Marketing teams preparing assets for multiple platforms
* Developers learning modern SaaS architecture

---

## 📜 License

This project is licensed under the **MIT License**.
See the `LICENSE` file for details.

---

## 👨‍💻 Author

**Built with ❤️ by [Shubham Jamdar](https://github.com/Shubham45264)**
Computer Engineer | Web Developer | SaaS Builder


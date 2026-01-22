# 🎥 AI-Powered Video SaaS Compressor

A powerful, modern SaaS application built with **Next.js 14**, **Cloudinary**, **Clerk**, and **Prisma**. This platform allows users to upload large videos and automatically compresses them using AI-driven optimization techniques, achieving up to **90% reduction** in file size without significant quality loss.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-blue?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary)

---

## ✨ Features

- **🚀 High-Performance Video Uploads**: Asynchronous processing via Cloudinary, handling large files (60MB+) smoothly.
- **📉 AI-Driven Compression**: Automatically downscales videos to 480p and applies aggressive `eco-quality` optimization for ~90% storage savings.
- **🔐 Secure User Authentication**: Managed by Clerk with custom multi-step sign-in/up flows.
- **🔄 Real-time User Syncing**: Webhook integration ensures Clerk users are automatically synced with the PostgreSQL (Neon) database.
- **📱 Responsive Dashboard**: Stunning glassmorphic UI built with DaisyUI and Tailwind CSS.
- **🖼️ Social Media Creator**: Transform uploaded images into multiple social media formats (Instagram, Twitter, Facebook) instantly.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & DaisyUI
- **Database**: PostgreSQL (Neon.tech)
- **ORM**: Prisma
- **Authentication**: Clerk
- **Media Hosting**: Cloudinary
- **Deployment**: GitHub / Vercel

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- A Cloudinary account
- A Clerk account
- A Neon.tech (or any PostgreSQL) database

### 2. Installation
```bash
git clone https://github.com/Shubham45264/AI-Powered-Saas-Application.git
cd AI-Powered-Saas-Application/28-ai-powered-saas
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following:

```env
# Clerk Auth
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

### 4. Database Setup
```bash
npx prisma db push
npx prisma generate
```

### 5. Running the App
```bash
npm run dev
```

---

## 🔗 Webhook Configuration

To enable automatic user syncing:
1. Go to **Clerk Dashboard > Webhooks**.
2. Add a new endpoint pointing to `https://your-domain.com/api/webhooks/clerk`.
3. Subscribe to `user.created`, `user.updated`, and `user.deleted` events.
4. Copy the **Signing Secret** to your `.env` file as `CLERK_WEBHOOK_SECRET`.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ by [Shubham Jamdar](https://github.com/Shubham45264)**

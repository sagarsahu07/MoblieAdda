# Mobile Adda Bhilai

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD627)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-1C1C1C?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Mobile Adda Bhilai** is a premium **Digital Mobile Inventory Showcase** built specifically for a local mobile shop. This application serves as a digital showroom catalog where customers can search, filter, and inspect detailed specifications of available certified pre-owned smartphones and contact the shop owners directly to finalize purchases.

Unlike standard e-commerce projects, Version 1 focuses strictly on inventory display and client-side communication (WhatsApp and direct calls). No customer login, shopping cart, or payment integration is required. Only the shop owner has secure access to the administrative dashboard.

---

## 🚀 Features

### Public Website
* **Home Page**: Features a stunning hero banner, showcases featured smartphones in stock, presents "Why Choose Us" trust seals, highlights owner profiles, and details showroom hours/GPS coordinates.
* **Mobile Catalog Listings**: Displays available smartphones in a responsive, modern card layout indicating battery health, price discounts, and stock status.
* **Mobile Details Page**: Highlights zoomed gallery images, extensive diagnostics reports (display original, original battery checks, biometrics validation), and contact triggers.
* **Search & Filters**: Enables clients to instantly search by brand or model name, select by manufacturer, filter by minimum/maximum price ranges, and toggle available stock status.
* **Direct Communication Triggers**: Includes "WhatsApp Enquiry" buttons that generate prefilled, structured text detailing the product name, color, health rating, and price.
* **Responsive, Mobile-First Design**: Optimized for smooth animations and micro-interactions on mobile viewports.

### Admin Panel (Owner Only)
* **Secure Login**: Access validation secured via robust passwords and JSON Web Tokens.
* **Dashboard Overview**: Displays statistical counters (Total Phones, Available Phones, Sold, Featured) and timeline logs of recent admin activity.
* **Mobile CRUD Management**: Allows the owner to add, edit, or delete smartphone entries, specify battery health metrics, toggle screen status (original vs replaced), and write detailed descriptions.
* **IMEI Logs**: Secure tracking of sensitive device serials (IMEI code is restricted to admin forms and is completely hidden from public access).
* **Multi-Image Uploader**: Leverages Supabase Storage integration to drag-and-drop multiple angle pictures.
* **Dynamic Shop Settings**: Allows the owner to modify address labels, WhatsApp links, instagram pages, and opening hours without modifying the codebase.

---

## 🛠️ Tech Stack

* **Frontend**: React (v18), Vite, Tailwind CSS, React Router (v6), Axios, Framer Motion, Lucide Icons.
* **Backend**: Node.js, Express.js.
* **Database**: PostgreSQL hosted via Supabase.
* **ORM**: Prisma.
* **Authentication**: JWT (JSON Web Tokens) & BcryptJS.
* **Storage**: Supabase Storage Buckets (Images).
* **Deployment**: Vercel (Frontend), Railway / Render (Backend).

---

## 📁 Project Structure

The project follows a modular, scalable monorepo layout:

```
15.MobileAdda/
├── package.json               # Root monorepo manager (runs dev services concurrently)
├── backend/                   # Node.js + Express.js API Application
│   ├── prisma/
│   │   ├── schema.prisma      # Prisma schema modeling
│   │   └── seed.js            # Seeder file loaded with PDF shop information
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # Prisma Client instantiation
│   │   ├── controllers/
│   │   │   ├── authController.js    # JWT token creation & admin sessions
│   │   │   ├── logController.js     # Activity audit logs fetching
│   │   │   ├── mobileController.js  # CRUD inventory filters and details
│   │   │   └── shopController.js    # Shop configurations read/write
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT header validation middleware
│   │   ├── routes/
│   │   │   └── v1.js          # API router endpoints grouped under /api/v1/
│   │   ├── services/
│   │   │   └── supabaseStorage.js   # Supabase Storage client integration
│   │   ├── validations/
│   │   │   └── mobile.js      # Form and payload inputs validation
│   │   └── index.js           # Server initializer listening on port 5000
│   └── .env                   # Configuration file (database URL, JWT key)
└── frontend/                  # React + Vite Client Application
    ├── public/
    ├── src/
    │   ├── components/        # Reusable global design components
    │   │   ├── Footer.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── Navbar.jsx
    │   │   └── PhoneCard.jsx
    │   ├── context/
    │   │   └── ShopContext.jsx  # Global state manager (fetches shop settings, handles offline demo fallbacks)
    │   ├── pages/             # Layout pages
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminLogin.jsx
    │   │   ├── AdminMobileForm.jsx
    │   │   ├── AdminSettings.jsx
    │   │   ├── Home.jsx
    │   │   ├── MobileDetail.jsx
    │   │   └── Mobiles.jsx
    │   ├── services/
    │   │   └── api.js         # Custom Axios client with request token interceptors
    │   ├── App.jsx            # React Router paths configuration
    │   ├── index.css          # Injected typography and glass panel configurations
    │   └── main.jsx           # React app mount bootstrap
    ├── index.html             # Main HTML template containing SEO keywords
    ├── vite.config.js
    └── tailwind.config.js     # Custom premium palette styles
```

---

## 🗄️ Database Schema

Prisma models mapped to Supabase PostgreSQL:

```mermaid
erDiagram
    users {
        String id PK
        String name
        String email UK
        String password
        String role
        DateTime created_at
        DateTime updated_at
    }
    shop_settings {
        String id PK
        String shop_name
        String owner_name
        String phone
        String whatsapp
        String address
        String logo
        String instagram
        String facebook
        String youtube
        String google_map
        String about_shop
        String opening_hours
        DateTime created_at
        DateTime updated_at
    }
    mobiles {
        String id PK
        String shop_id FK
        String slug UK
        String brand
        String model
        String variant
        String ram
        String storage
        String color
        Int battery_health
        Boolean battery_original
        Boolean display_original
        String body_condition
        String camera_condition
        Boolean face_id_or_fingerprint
        String network
        String imei
        String warranty
        String description
        Float price
        Float offer_price
        Boolean featured
        String status
        DateTime created_at
        DateTime updated_at
    }
    mobile_images {
        String id PK
        String mobile_id FK
        String image_url
        String image_type
        DateTime created_at
    }
    activity_logs {
        String id PK
        String action
        DateTime created_at
    }

    shop_settings ||--o{ mobiles : "has many"
    mobiles ||--o{ mobile_images : "contains multiple"
```

### Table Details
1. **Users**: Stores administrative credentials.
2. **ShopSettings**: A single row containing showroom profile details (opening hours, whatsapp group invitations, coordinate links).
3. **Mobiles**: Stores smartphone attributes, battery statuses, custom grades, and hidden IMEI numbers.
4. **MobileImages**: Links multiple image URLs to a specific smartphone ID for gallery carousels.
5. **ActivityLogs**: Tracks recent modifications done by the admin.

---

## 🔑 Environment Variables

Copy `backend/.env.example` to `backend/.env` and update details:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | Listening port for the Express backend | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:pass@db.supabase.co:5432/postgres?schema=public` |
| `JWT_SECRET` | Secret key used to sign JWT authorization tokens | `my_jwt_super_secret_key_change_me_in_production` |
| `SUPABASE_URL` | Endpoint of your Supabase project | `https://xzyabc.supabase.co` |
| `SUPABASE_ANON_KEY` | Public anonymous key for API access | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_BUCKET` | Storage bucket name created for mobile photos | `mobile-images` |
| `VITE_API_URL` | Frontend env variable pointing to backend API | `http://localhost:5000/api/v1` |

---

## 🛠️ Installation & Setup

Follow these steps to run the project locally:

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/mobile-adda.git
cd mobile-adda

# Install dependencies in root, backend, and frontend
npm run install:all
```

### 2. Configure Database & Storage
1. Go to [Supabase](https://supabase.com/), sign in, and create a new project.
2. Create a new Storage Bucket named `mobile-images` and toggle its access to **Public**.
3. Obtain your Database connection string from `Project Settings -> Database -> Connection String (Transaction mode)`.
4. Replace connection details and keys inside the `backend/.env` file.

### 3. Migrate and Seed Database
Generate schema tables and load PDF information:
```bash
cd backend
npx prisma migrate dev --name init
node prisma/seed.js
cd ..
```

### 4. Run Development Server
```bash
# Starts both frontend and backend concurrently
npm run dev
```
* **Frontend client**: http://localhost:5173
* **Backend API**: http://localhost:5000/api/v1

---

## 📝 API Documentation

All endpoints are versioned under `/api/v1/`.

### 🛡️ Authentication Endpoints

#### POST `/api/v1/auth/login` (Public)
Validates admin credentials.
* **Request**:
  ```json
  {
    "email": "admin@mobileadda.com",
    "password": "admin123"
  }
  ```
* **Response (Success)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...",
    "user": { "id": "uuid", "name": "Ashu & Abhishek", "email": "admin@mobileadda.com", "role": "ADMIN" }
  }
  ```

---

### 🏪 Shop Settings Endpoints

#### GET `/api/v1/shop` (Public)
Fetches dynamic configurations (phone, address, social media links).
* **Response**:
  ```json
  {
    "success": true,
    "data": {
      "shopName": "Mobile Adda Bhilai",
      "phone": "+91 70007 34481",
      "whatsapp": "https://chat.whatsapp.com/DnKJOzi...",
      "address": "Supela Akash Ganga, Bhilai..."
    }
  }
  ```

#### PUT `/api/v1/shop` (Admin Only)
Modifies showroom metadata.
* **Header**: `Authorization: Bearer <token>`
* **Request**: Send fields to update.

---

### 📱 Mobiles (Inventory) Endpoints

#### GET `/api/v1/mobiles` (Public)
Fetches all mobiles. Supports query filters (`?q=`, `?brand=`, `?status=`, `?minPrice=`, `?maxPrice=`, `?sort=`).
* **Note**: Public responses **never** contain the `imei` field.
* **Response**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "id": "uuid",
        "slug": "apple-iphone-14-pro-max-256gb",
        "brand": "Apple",
        "model": "iPhone 14 Pro Max",
        "price": 74999,
        "images": [{"imageUrl": "https://..."}]
      }
    ]
  }
  ```

#### GET `/api/v1/mobiles/detail/:slug` (Public)
Fetches a single device detail via slug. (IMEI is hidden).

#### GET `/api/v1/mobiles/admin/detail/:id` (Admin Only)
Fetches full details including the **IMEI** code.
* **Header**: `Authorization: Bearer <token>`

#### POST `/api/v1/mobiles` (Admin Only)
Adds a new smartphone. Automatically generates a unique URL slug.
* **Header**: `Authorization: Bearer <token>`

#### PUT `/api/v1/mobiles/:id` (Admin Only)
Edits smartphone specifications or updates status (`Available`, `Sold`, `Reserved`).
* **Header**: `Authorization: Bearer <token>`

#### DELETE `/api/v1/mobiles/:id` (Admin Only)
Removes product from the catalog.
* **Header**: `Authorization: Bearer <token>`

---

## 🎨 UI Showcase

| Public Home Page | Public Catalogue |
| :---: | :---: |
| *[Place Home Page Screenshot]* | *[Place Catalog Listing Screenshot]* |

| Mobile Details | Owner Admin Dashboard |
| :---: | :---: |
| *[Place Detail Page Screenshot]* | *[Place Admin Dashboard Screenshot]* |

---

## 🔒 Security Implementations

* **Bcrypt Password Hashing**: Administrative credentials are secure in database tables using salt hashing algorithms.
* **Secure Session Handling**: Express endpoints for modifications are locked via JWT extraction validation.
* **IMEI Confidentiality**: To prevent fraud, serial logs are completely omitted from public response schemas.
* **Payload Sanitation**: Body inputs are validated against schema boundaries to block illegal mutations.

---

## ⚡ Performance Optimizations

* **Vite Fast Bundling**: Leverages Vite ES-modules compiler to bundle JS chunks in seconds.
* **Database Query Selections**: Explicit Prisma select blocks verify only needed properties are fetched, minimizing payloads.
* **Dynamic Fallbacks**: Handles backend offline state gracefully by toggling a local state mock database context so that developers can visually inspect layout configurations easily.
* **Optimized Image Containers**: Pre-rendered thumbnail feeds avoid fetching full resolutions initially.

---

## 🗺️ Future Roadmap

### Version 2
* **Customer Accounts**: Allow users to signup and login to write remarks.
* **Wishlist Storage**: Enable users to save favorite items.
* **In-App Notifications**: Alerts when popular flagships are restocked.

### Version 3
* **Repair Booking Portal**: Allow users to reserve time slots for device repairs.
* **Exchange Appraisals**: Multi-choice diagnostic wizard for old devices to receive instant trade-in value offers.
* **Direct Payments & Bookings**: Integrated escrow gateways for secure device reservation booking.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ✍️ Author
* **Project Name**: Mobile Adda Bhilai
* **Developed By**: Antigravity AI

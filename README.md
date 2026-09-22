# Kaal Vastr — Customer E-Commerce Website & Admin Platform

A premium, production-oriented clothing e-commerce website for **Kaal Vastr**, built with React, TypeScript, Tailwind CSS, Supabase (PostgreSQL, Auth, Storage), TanStack Query, and Framer Motion.

---

## Key Features

### 🛍️ Customer-Facing E-Commerce Experience
- **Home / Catalogue Page**: Explore clothing drops with category chips (Hoodies, T-Shirts, Pants, Outerwear, Sweatshirts), live search, price sorting, and responsive product cards with hover lift/zoom micro-interactions.
- **Product Detail Page (`/product/:id`)**: High-resolution image gallery, price badges (selling vs. compare-at discount), category/SKU details, size selector with visibly disabled unavailable sizes, color selection, quantity controls, and out-of-stock indicators.
- **Slide-Over Shopping Cart Drawer**: Instant item preview, quantity increase/decrease/removal, dynamic subtotal calculation, and persistent cart state (`localStorage`).
- **Structured WhatsApp Order Generator**: Form collecting customer name and contact phone number. Generates a structured message detailing line items, sizes, quantities, line totals, and final amount, then opens `https://wa.me/<whatsapp_number>?text=...` directly.
- **Dynamic Business Information**: Flagship studio address, mobile helpline, WhatsApp destination, operating hours, email, and social media links.

### 🔒 Admin Portal & Product Management (`/admin`)
- **Route-Level & RLS Security**: Public users cannot create, edit, or archive products. Protected routes enforce authentication (`/admin/login`).
- **Product Management Table**: Searchable table displaying product image, name, category, SKU, selling price, stock inventory, status badges (Active vs. Archived vs. Out of Stock), with edit and quick-archive toggles.
- **Product Form Modal (CRUD)**: Create or edit product records with fields for Name, Category, Brand, SKU, Description, Selling Price, Compare-at Price, Sizes array, Colors, Stock count, and Active/Archive flags.
- **Supabase Storage Image Upload**: Upload product images directly to Supabase Storage bucket (`product-images`) with live image preview.
- **Business Settings Editor**: Live update Kaal Vastr's WhatsApp order destination number, phone helpline, store address, operating timings, and social links.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router v6
- **Styling**: Tailwind CSS (Dark Charcoal `#0C0C0E` base, White, Silver/Grey accents)
- **Icons**: Lucide React
- **Backend / Database**: Supabase (PostgreSQL), Supabase Auth, Supabase Storage
- **State & Queries**: TanStack Query v5, Context API
- **Validation & Forms**: React Hook Form, Zod

---

## Database & Supabase Migration Setup

The database schema and policies are fully specified in:
```text
supabase/migrations/20260921000000_initial_schema.sql
```

### Table Schema Summary

1. **`products` Table**:
   - `id`: UUID (Primary Key)
   - `name`: TEXT (Not Null)
   - `category`: TEXT (Not Null)
   - `brand`: TEXT (Default 'Kaal Vastr')
   - `sku`: TEXT (Unique, Not Null)
   - `description`: TEXT
   - `selling_price`: NUMERIC(10,2) (Not Null)
   - `compare_at_price`: NUMERIC(10,2)
   - `sizes`: TEXT[] (Default ARRAY['S', 'M', 'L', 'XL'])
   - `colors`: TEXT[]
   - `image_url`: TEXT
   - `images`: TEXT[]
   - `stock`: INT (Default 10)
   - `is_available`: BOOLEAN (Default true)
   - `is_archived`: BOOLEAN (Default false)

2. **`business_settings` Table**:
   - `id`: UUID (Primary Key)
   - `business_name`: TEXT
   - `whatsapp_number`: TEXT (Configurable destination)
   - `mobile_number`: TEXT
   - `email`: TEXT
   - `address`: TEXT
   - `store_timings`: TEXT
   - `instagram_url`: TEXT
   - `facebook_url`: TEXT

3. **Row Level Security (RLS) Policies**:
   - `products`: Public SELECT for active products (`is_archived = false`). Full INSERT, UPDATE, DELETE restricted to authenticated admin users (`auth.role() = 'authenticated'`).
   - `business_settings`: Public SELECT for all users. UPDATE restricted to authenticated admin users.
   - `storage.objects`: Public read access for `product-images` bucket. Write/delete restricted to authenticated admin users.

---

## Local Development & Setup Instructions

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

---



*(Supports both Supabase Auth authentication and offline fallback demo login).*

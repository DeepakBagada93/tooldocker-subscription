# Tooldocker WebApp Master Blueprint

### Subscription-Based AI Marketplace Platform

---

## 🧠 Product Vision

Tooldocker is a **subscription-based AI-powered industrial marketplace** where vendors subscribe to sell products, buyers discover products using AI-powered search, and admins manage the entire ecosystem.

The platform combines:

* SaaS subscription model
* AI-powered product discovery
* AI-assisted product creation
* Scalable headless architecture

---

## 🎯 Core Business Model

Unlike traditional marketplaces, Tooldocker does NOT use commission.

Instead:

* Vendors pay **monthly/yearly subscription**
* Vendors can list products based on plan limits
* Buyers purchase products normally
* Revenue = **Recurring subscriptions (MRR)**

---

## 👥 User Roles

### 1. Admin

* Manage vendors
* Create subscription plans
* Monitor revenue (MRR)
* Moderate products
* Control categories
* Manage AI rules

### 2. Vendor

* Subscribe to a plan
* Add/manage products
* Use AI to generate products
* Upload products in bulk
* Manage orders

### 3. Buyer

* Search products (AI-powered)
* Browse categories
* Add to cart
* Checkout
* Track orders

---

## 💳 Subscription System

### Plans Example

| Plan    | Price | Product Limit |
| ------- | ----- | ------------- |
| Starter | $29   | 20 products   |
| Growth  | $79   | 100 products  |
| Pro     | $199  | Unlimited     |

### Rules

* Vendor MUST have active subscription
* Product creation blocked if expired
* Product limit enforced

---

## 🤖 AI Engine (Groq Cloud)

### Buyer AI Search

* Natural language search
* "I need a machine to cut granite"
* AI converts → structured query
* Fetch from Supabase

### Vendor AI Tools

* Generate product descriptions
* Auto-fill specs
* SEO metadata generation
* Category detection

### Admin AI

* Detect spam products
* Auto moderation
* Data insights

---

## 🎨 UI/UX Design System

### Style

* Industrial + Modern SaaS
* Dark/Light mode

### Components

* Animated SVG loaders
* Custom micro-interactions
* Skeleton loaders
* Empty states

### Key Animations

* AI typing animation
* Product loading shimmer
* Dashboard transitions

---

## 🖼 Custom Animated SVG Ideas

* AI assistant icon with pulse effect
* Product loading gear animation
* Subscription upgrade animation
* Empty state illustration (factory theme)

---

## 🧱 Frontend Architecture

Tech:

* Next.js 14 (App Router)
* Tailwind CSS
* TypeScript

Structure:

/app
/components
/lib
/hooks
/context

Layouts:

* Public
* Vendor
* Admin
* Buyer

---

## 🗄 Backend Architecture

* Supabase PostgreSQL
* Supabase Auth
* Supabase Storage

---

## 🧩 Core Database Tables

* users
* profiles
* vendors
* subscription_plans
* vendor_subscriptions
* products
* categories
* orders
* order_items
* reviews
* notifications

---

## 🔐 Security

* Row Level Security (RLS)
* Role-based access
* Server-side API validation

---

## 📦 Bulk Product Upload

* CSV upload
* Excel support
* AI enhancement of data
* Validation system
* Import preview

---

## ⚡ Performance Strategy

* SSR (Next.js)
* CDN (Vercel)
* Image optimization
* Query optimization

---

## 🚀 Deployment

* Vercel (frontend)
* Supabase (backend)
* Groq Cloud (AI)

---

## 🔄 Migration Cleanup (IMPORTANT)

When setting up database:

* REMOVE all demo/sample data
* Ensure tables are empty
* Keep only schema

Steps:

1. Delete seed/demo scripts
2. Clear tables:

```sql
TRUNCATE products, users, orders, categories RESTART IDENTITY CASCADE;
```

3. Keep only:

* schema
* constraints
* RLS policies

---

## 📈 Future Features

* AI recommendations
* Voice search
* Image-based product detection
* Vendor ads system

---

## 🧠 Final System Flow

Vendor:
Signup → Subscribe → Add Products → Sell

Buyer:
Search (AI) → View → Buy → Track

Admin:
Control → Analyze → Scale

---

## 🎉 Conclusion

Tooldocker is a **modern SaaS + AI marketplace**, designed for scalability, automation, and recurring revenue.

It replaces complexity (commissions, payouts) with simplicity (subscriptions + AI).

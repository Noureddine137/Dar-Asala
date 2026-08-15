# Dar Asala

A premium DTC e-commerce storefront for handcrafted Moroccan women's leather bags, built with
Next.js App Router, TypeScript, Tailwind CSS v4, Prisma/PostgreSQL and Stripe.

## Stack

- **Next.js 16** (App Router, Server Components, Turbopack)
- **TypeScript**, **Tailwind CSS v4** (design tokens in `app/globals.css`)
- **PostgreSQL** via **Prisma ORM**
- **Stripe Checkout** for payment
- **Zustand** (with `persist`) for cart, wishlist, UI-overlay and cookie-consent state
- **Radix UI primitives** for accessible dialogs/accordions

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in a PostgreSQL `DATABASE_URL`. Stripe keys are
   optional in development — checkout will show a friendly "not configured" message until
   `STRIPE_SECRET_KEY` is set.

3. Run migrations and seed demo data (12 products, 6 collections, reviews):

   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

4. (Optional) Regenerate the placeholder art-direction images used across the site:

   ```bash
   npm run db:generate-images
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:seed` | Seed the database with demo catalog data |
| `npm run db:generate-images` | Regenerate placeholder editorial imagery |

## Project Structure

```
app/
  (storefront)/        Public storefront routes (home, collections, products, cart, checkout, …)
  admin/                Minimal admin (Basic-Auth protected): products, orders, custom requests
  api/                  Route handlers (search, cart/checkout, newsletter, contact, webhooks)
components/
  layout/ navigation/ homepage/ product/ collection/ cart/ ui/ forms/ analytics/ account/ faq/
lib/
  commerce/             Prisma-backed data-access layer (products, collections)
  store/                Zustand stores (cart, wishlist, UI overlay, cookie consent)
  content/              Static editorial/nav/legal copy
  stripe/                Stripe client
  admin/                 Server Actions for the admin area
prisma/
  schema.prisma, seed.ts
scripts/
  generate-images.mjs    Generates the placeholder art-direction imagery in public/images
```

## Admin

`/admin` is protected by HTTP Basic Auth. Set `ADMIN_USERNAME` / `ADMIN_PASSWORD` in your
environment — the admin area returns `503` until both are set, and `401` on the wrong
credentials. It supports listing/editing products (incl. variant stock), viewing and updating
order status, and reviewing custom-order requests.

## Placeholder imagery

There is no licensed photography in this build. All product, hero, category and editorial
images are original, programmatically generated gradient/silhouette compositions (see
`scripts/generate-images.mjs`) standing in for real photography — warm palette, Moroccan arch
motifs and stylized bag silhouettes rather than generic gray boxes. Swap `public/images/**`
for real photography before launch.

## What's stubbed / needs production setup

- **Payments**: Stripe Checkout Sessions are fully wired (`/api/checkout`,
  `/api/webhooks/stripe`), but need real `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` /
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` values and a webhook endpoint registered in Stripe.
- **Transactional email**: contact form and custom-order requests are stored/logged; wiring a
  real provider (e.g. Resend) only requires `RESEND_API_KEY`.
- **Image uploads**: the admin product editor renders existing images but has no upload UI —
  connect an object storage provider (S3, Cloudinary, Vercel Blob) to add one.
- **Customer accounts**: no authentication system yet. Wishlist works via `localStorage`
  without an account; `/account` is a placeholder pointing at that and at order lookup via
  support.
- **Legal pages** (`/legal/*`): placeholder copy, explicitly marked for legal review before
  launch.

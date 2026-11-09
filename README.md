# CitaFácil — Appointment & sales management SaaS for salons (Next.js)

A multi-tenant web app for small beauty salons: appointments, clients, staff, services, products, point of sale (receipts), reports and subscription billing, with a super-admin area to manage businesses.
This was a practice project; it is shared as a code sample.

**Stack:** Next.js (App Router) · TypeScript · React · Prisma + SQLite · Auth.js (next-auth) · Zod · bcryptjs · Motion.

**Data model (Prisma):** Business, User, Staff, Service, Client, Appointment, Product, Sale, SaleItem, BillingPayment.

**Main areas (`app/`):** `(auth)` sign-up/login · `(app)` dashboard, appointments, clients, staff, services, products, cash register, reports, settings · `(billing)` subscription · `(admin)` platform admin · `legal`.
Built with AI-assisted development.

## Run locally
```bash
npm install
cp .env.example .env        # then edit the values
npx prisma migrate dev      # creates the local SQLite database
npm run db:seed             # demo business + demo user (password from SEED_DEMO_PASSWORD)
npm run dev                 # http://localhost:3000
```
Make an existing account a platform super-admin: `npm run make-admin -- you@example.com`.

All business data in the seed (names, phones, addresses) is fictional. Secrets live only in your local `.env`, which is git-ignored.

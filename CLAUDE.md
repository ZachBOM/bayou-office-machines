# Bayou Office Machines — Project Brief

## The Business
- **Company:** Bayou Office Machines
- **Location:** South Louisiana
- **What we do:** Service and sell Toshiba MFPs (multifunction printers), Toshiba solutions, and Brother printers/copiers
- **Customers:** ~200 contract customers (businesses we have active service agreements with)
- **Assets:** Logo already exists

## What We're Building
A full business web application with three distinct areas:

### 1. Public Website (anyone can visit)
- Home, About, Services, Products, Contact pages — full marketing site
- "Request a Quote" form — collects visitor info and sends it to our team (no prices shown on site, we call them back)
- Goal: generate new leads and help people understand who we are

### 2. Customer Portal (verified contract customers only)
- Customers sign up themselves but **cannot do anything until we approve their account**
- Once approved and linked to a machine in our system, they can:
  - Submit service calls via a form with dropdowns (error codes, paper quality issues, noise issues, etc.)
  - Upload a photo or video of the problem
  - Request an upgrade or new machine (funnels back to us as a lead)
- Account approval is manual — we verify they are a real contract customer before activating

### 3. Worker/Admin Side (internal team only)
- CRM to manage ~200 contract customers
- Approve or deny new customer account requests
- View and manage incoming service calls
- Assign service calls to technicians
- Track service call status
- **Note:** Role-based permissions (who sees what) will be added later — start with basics first

## Tech Stack
- **Base44** — AI-powered app builder to scaffold and build the app quickly
- **GitHub** — Where all the code is stored and version controlled
- **Vercel** — Hosts and deploys the website (auto-deploys when code changes on GitHub)
- **PostHog** — Analytics: tracks how visitors use the site, where they click, page views
- **Supabase** — Database (stores customers, machines, service calls) + handles login/authentication
- **Resend** — Sends automated emails (account approval notifications, service call confirmations, etc.)
- **Supabase Storage** — Stores uploaded photos and videos from service call submissions

## Key Business Rules
1. No prices shown on the website — all quotes go through our team
2. Service call forms are only accessible to verified, approved account holders
3. Approved accounts must be linked to an actual machine we service
4. We do not service outside of South Louisiana — account approval prevents out-of-area submissions
5. Quote requests are open to anyone (logged in or not) — they just submit info and we call them

## Current State
- Starting from scratch — no existing code
- Currently use a Toshiba-provided system to track customers/machines
- Goal is to eventually have the new CRM work alongside or replace the Toshiba tracking system
- Role-based access control (admin vs technician vs office staff) is a future phase

## What to Build First
1. Set up GitHub repo and connect to Vercel
2. Scaffold the project with Base44
3. Build the public-facing marketing pages
4. Add Supabase for database and authentication
5. Build the customer portal (sign up, approval flow, service call form)
6. Build the worker/admin side (CRM, service call management)
7. Add PostHog analytics
8. Add file/video upload for service calls

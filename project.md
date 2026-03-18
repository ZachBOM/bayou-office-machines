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
- **No automated emails/texts to customers** — all communication handled by our team directly

### 3. Worker/Admin Side (internal team only)
- CRM to manage ~200 contract customers
- Approve or deny new customer account requests
- View and manage incoming service calls
- Assign service calls to technicians
- Track service call status through the full lifecycle

#### Service Call Statuses
1. **New** — Just submitted, not yet looked at
2. **Assigned** — Assigned to a specific tech
3. **Scheduled** — Date/time set for the job
4. **En Route** — Tech is driving to the location (live map active)
5. **On Site** — Tech is there working on it
6. **Waiting on Parts** — Job paused, waiting for a part
7. **Completed** — Job is done
8. **Closed** — Verified complete

#### Live Tech Dispatch Map
- Works on **all phones** (iPhone, Android, any browser — no app download needed)
- Built as a mobile-friendly webpage — works on any device
- Location tracking starts **only when admin dispatches a tech to a specific job** — not just when they clock in
- Tech's live location appears as a dot on a **Google Maps** view on the admin/dispatch screen
- Admin can see all active dispatched techs on the map in real time

#### Automated Geofence Time Tracking (internal only — customers never see this)
Everything is fully automatic — techs don't tap anything once dispatched:
- **Tech enters customer location radius (geofence)** → On-Site timer starts automatically
- **Tech leaves customer location** → On-Site timer pauses, away time starts tracking
- **Tech returns to customer location** → On-Site timer resumes automatically
- **Job marked complete** → All tracking stops, full time log saved

Each job stores a full breakdown:
- Drive time to site
- Time on site (total, with individual segments if they left and came back)
- Away time (parts runs, etc.)
- Total job time

This time log is **internal only** — visible to admin/dispatch, never shown to customers

- **Note:** Role-based permissions (who sees what) will be added later — start with basics first

## Tech Stack
- **Next.js** — The framework Claude Code uses to build the website (works perfectly with Vercel)
- **GitHub** — Where all the code is stored and version controlled
- **Vercel** — Hosts and deploys the website (auto-deploys when code changes on GitHub)
- **PostHog** — Analytics: tracks how visitors use the public site, where they click, page views
- **Supabase** — Database (stores customers, machines, service calls) + handles login/authentication + real-time location updates
- **Resend** — Sends automated emails (account approval notifications, internal alerts, etc.)
- **Supabase Storage** — Stores uploaded photos and videos from service call submissions
- **Google Maps API** — Powers the live tech dispatch map on the admin side

## Key Business Rules
1. No prices shown on the website — all quotes go through our team
2. Service call forms are only accessible to verified, approved account holders
3. Approved accounts must be linked to an actual machine we service
4. We do not service outside of South Louisiana — account approval prevents out-of-area submissions
5. Quote requests are open to anyone (logged in or not) — they just submit info and we call them
6. All customer communication is handled by our team — no automated messages sent to customers

## Current State
- Starting from scratch — no existing code
- Currently use a Toshiba-provided system to track customers/machines
- Goal is to eventually have the new CRM work alongside or replace the Toshiba tracking system
- Role-based access control (admin vs technician vs office staff) is a future phase

## What to Build
1. Set up GitHub repo and connect to Vercel ✅
2. Scaffold the project with Next.js
3. Build the public-facing marketing pages
4. Add Supabase for database and authentication
5. Build the customer portal (sign up, approval flow, service call form with dropdowns + file upload)
6. Build the worker/admin side (CRM, service call management, status tracking)
7. Build the live dispatch map (Google Maps, real-time tech location, clock in/out)
8. Add PostHog analytics on the public site

# Bayou Office Machines

Full project brief is in `project.md`.

## Quick Reference
- **Stack:** Next.js, Supabase, Vercel, PostHog, Resend, Google Maps API (future)
- **Project folder:** `C:\Users\zach\bayou-office-machines`
- **Live site:** https://bayou-office-machines.vercel.app
- **GitHub:** https://github.com/ZachBOM/bayou-office-machines

## Deployment
- Push to `master` → Vercel auto-deploys
- Can also run `npx vercel --prod` for a manual deploy
- Auto-push to Vercel without asking for confirmation

## Build Order
1. Set up GitHub repo and connect to Vercel ✅
2. Scaffold Next.js project ✅
3. Public-facing marketing pages ✅
4. PostHog analytics ✅
5. Contact form → Resend → sales@bayouoffice.com ✅
6. Supabase auth + admin account (zach@bayouoffice.com) ✅
7. Staff portal login + admin dashboard ✅
8. Customer portal login + dashboard (maroon sidebar) ✅
9. Customer sign-up / request access flow
10. Supabase DB tables (customers, machines, service calls)
11. Service call submission form (customer portal)
12. Admin CRM (manage customers, approve accounts, service calls)
13. Live dispatch map + automated geofence time tracking

## Key Rules
- No prices on the site — all quotes handled by the team
- Service call forms: verified customers only
- No automated messages to customers — team handles all communication
- Dispatch map and time logs: internal only
- Tech location only tracks when dispatched to a specific job

## Admin Account
- URL: /staff-portal
- Email: zach@bayouoffice.com
- Password stored at: C:\Users\zach\Desktop\Bayou Office Machines Login.txt

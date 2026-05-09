# lpsnlp

Backend-first monorepo scaffold for RPM Lovely Public Senior Secondary School.

## Structure

- `backend/` Express + TypeScript + MongoDB API
- `frontend/` placeholder app package for later UI work
- `docs/` implementation and API notes

## Backend quick start

1. Install Node.js Active LTS. As of May 9, 2026, Node.js `v24.15.0` is the current Active LTS from the official Node.js releases page.
2. Copy `backend/.env.example` to `backend/.env`
3. Install dependencies in `backend/`
4. Run `npm run dev`

## Backend scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run typecheck`
- `npm run lint`
- `npm run test`

## Notes

- The backend enables Google OAuth, Cloudinary, SMTP email, Razorpay, and Sentry only when their env vars are present.
- ERP Phase 2 route surfaces are intentionally scaffolded as models and services first so the public/admin Phase 1 backend stays stable.


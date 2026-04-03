# LocalMart

LocalMart is a React + Vite e-commerce web app scaffold built for vendors and buyers. It integrates Supabase for data/storage/edge-functions, Firebase for authentication (Google sign-in), and Paystack for payments. TailwindCSS is used for styling and Zustand for lightweight state management.

This README documents how to run, configure, and extend the project.

---

## Table of contents

- Project overview
- Tech stack
- Key features
- Getting started (local)
- Environment variables
- Project structure
- Important implementation notes
- Deployment
- Troubleshooting & tips
- Contributing
- License

---

## Project overview

LocalMart is a marketplace web app that allows vendors to register, create subaccounts (Paystack) for split payments, and buyers to browse and purchase products. The app uses Supabase as the primary backend (database + edge functions), Firebase for third-party auth, and Paystack for payments.

## Tech stack

- Frontend: React 19, Vite
- Styling: Tailwind CSS, PostCSS
- State: Zustand
- Auth: Firebase (Google sign-in)
- Backend / DB: Supabase (Postgres, Auth, Edge Functions)
- Payments: Paystack (client and server helpers)
- Maps/geocoding: Leaflet + OpenRouteService (ORS) API usage via VITE_LEAFLET_ORS_KEY
- Linting: ESLint

## Key features

- Vendor registration & onboarding including bank account verification and Paystack subaccount creation
- Product listing, product pages, vendor storefront pages
- Cart, checkout flow with Paystack integration (supports subaccount and split payments)
- User authentication via Firebase Google sign-in
- Vendor utilities and dashboards (orders, analytics, notifications)

## Getting started (local)

Prerequisites:

- Node 18+ (or compatible with project dependencies)
- npm or yarn
- Supabase project (database + Edge Functions)
- Firebase project (for Google sign-in)
- Paystack account (for public key and server-side secret used by Supabase functions)

Steps:

1. Clone the repo

   git clone <repo-url>

2. Install dependencies

   npm install

3. Create a local environment file

   Copy `.env.example` or create a `.env.local` file in the project root and set the variables listed below. Do NOT commit secrets to git.

4. Start the dev server

   npm run dev

5. Open http://localhost:5173 (Vite default) in your browser.

## Environment variables

The project uses Vite and expects environment variables prefixed with `VITE_`. Create a `.env.local` (or `.env`) and set the following keys (example placeholders):

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Firebase (used for Google sign-in)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_MEASUREMENT_ID=...

# Paystack (client-side public key)
VITE_PAYSTACK_PUBLIC_KEY=pk_live_or_pk_test...

# ORS / Leaflet geocoding key used by delivery-time utilities
VITE_LEAFLET_ORS_KEY=your-ors-key
```

Notes:

- Server-side secrets (e.g., Paystack secret keys) should NOT be exposed to the frontend. In this project those are expected to be used inside Supabase Edge Functions. The frontend calls those functions via `supabase.functions.invoke(...)` (see below).

## Supabase Edge Functions used by the frontend

The frontend calls the following Supabase Edge Functions (via `supabase.functions.invoke`):

- `create-subaccount` — creates a Paystack subaccount for a vendor using server-side secret credentials
- `verify-account` — verifies a bank account number with Paystack
- `verify-payment` — verifies a payment reference with Paystack

Make sure these functions are implemented in your Supabase project and that they use your Paystack secret key safely on the server.

## Important files & where to look

- `package.json` — scripts & dependencies
- `vite.config.js` — Vite config
- `vercel.json` — rewrite config for Vercel
- `src/main.jsx` — React entry
- `src/App.jsx` — app root (routing, providers)
- `src/routes/AppRoutes.jsx` — application routes
- `src/supabase-client.js` — Supabase client initialization (reads `VITE_SUPABASE_*`)
- `src/firebase/firebase.js` — Firebase init & Google sign-in helper
- `src/hooks/usePaymentHook.js` — Paystack client-side integration helper
- `src/components/verifyVendors/*` — vendor registration and paystack account helpers (calls Supabase functions)
- `src/components/Cart/*` — cart, payment verification, order creation
- `src/state-store/*` — Zustand stores for cart, product, location, wishlist

Project layout (high level):

- `src/components` — UI components (pages, store, cart, checkout, vendor utilities)
- `src/firebase` — Firebase auth helpers
- `src/state-store` — global app state (Zustand)
- `src/styles` — small CSS pieces (checkbox/radio)

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build for production (Vite)
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

## Firebase Google Sign-In

The app uses Firebase for Google authentication. To configure:

1. Create a Firebase project.
2. Enable Google sign-in in Authentication > Sign-in method.
3. Add the web app and copy the config values into `.env.local` (the `VITE_FIREBASE_*` variables listed above).

The helper `src/firebase/firebase.js` exposes `signInWithGoogle()` used in the login/signup forms.

## Paystack integration notes

- Client-side uses `@paystack/inline-js` and the public key (VITE_PAYSTACK_PUBLIC_KEY).
- Sensitive operations (creating subaccounts, verifying accounts, verifying payments) are implemented as Supabase Edge Functions called from the frontend. These functions should store and use the Paystack secret key.
- The frontend expects responses of the shape `{ success: true, ... }` from those functions and performs UX flows accordingly.

## Maps / Geocoding

- The code uses Leaflet for maps and OpenRouteService (ORS) API for distance/travel calculations. Set `VITE_LEAFLET_ORS_KEY` to use these helpers.

## Deployment

- The project includes a `vercel.json` rewrite that ensures client-side routing works on Vercel. Deploy as a static site (build with `npm run build`).
- Set the same environment variables in the Vercel project settings (do NOT expose your secret keys publicly). Use Supabase for server-side interactions that require secrets.

## Troubleshooting & tips

- If API calls to Supabase fail, confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct and that CORS/allowed origins are permitted on Supabase (if needed).
- Payment errors often stem from missing/incorrect Paystack keys on the server functions. Test functions independently when possible.
- If the Firebase Google sign-in popup fails, check your Firebase app's authorized domains and ensure `localhost` is allowed.

## Quality gates & suggested next steps

- Linting: run `npm run lint` and fix reported issues.
- Add a `.env.example` file (non-sensitive) listing required VITE keys so contributors know what to set.
- Implement small unit tests or component tests (e.g., with Vitest or React Testing Library) to cover critical flows like payment initialization and vendor registration form validation.

## Contributing

Pick an issue or open one describing a feature or bug. Please include reproducible steps and a sandbox if possible.

## License

Add a license file if you intend to open-source the repository (e.g., MIT). Currently the `package.json` marks the project as private.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

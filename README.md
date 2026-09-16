# Sarathi — Safer School Commute

Sarathi is a frontend-only prototype for a scheduled, parent-paid school commute service. It is based on the uploaded product brief and focuses on the core safety promise: a familiar crew, hard vehicle capacity, verified custody handoffs, fixed route corridors, calm tracking, and human-controlled exception recovery.

## What is included

- **Parent view:** current trip safety status, ETA, locked crew, capacity, custody ledger, notifications, absence credit, household billing, and trip history.
- **Crew view:** school mode, guaranteed payout, route manifest, check-in scan simulation, pre-departure checklist, safety record, and exception support.
- **School console:** gate scanner simulation, arrival queue, manifest reconciliation, and countersignature state.
- **Control room:** route overview, live pod list, seeded route-delay exception, acknowledgement flow, human-reviewed local-AI assist explanation, and privacy controls.
- **Responsive UI:** desktop and mobile layouts with a light/dark theme toggle.

This is intentionally a **basic interactive prototype without a backend**. Data is seeded in the browser and resets when the page is refreshed.

## Complete product design and lifecycle document

The full source brief, product-design rationale, operating model, lifecycle, MVP boundary, KPI targets, AI/privacy principles, and pilot roadmap are available in the repository here: [Complete Product Design and Lifecycle Document](docs/complete-product-design-and-lifecycle-document.pdf).

## Run locally

Requirements: Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

Then open the local Vite URL printed in the terminal.

## Validate the build

```bash
pnpm check
pnpm build
```

## Try the main flows

1. Start in **Parent view** and use **Track trip**, **Alerts**, and **Billing** in the top navigation.
2. In Alerts, use **Mark child absent** to see the manifest/credit recovery state.
3. Use the left workspace switcher to open **Crew view**, then toggle the open checklist item and use **Scan handoff**.
4. Open **School console**, open the gate scanner, then select **Countersign** to complete the school handoff.
5. Open **Control room**, use **Acknowledge & notify** on the seeded Cab 02 delay to resolve the exception and update the live metrics.
6. Use the moon/sun icon in the top-right corner to preview the dark theme.

## Deploy from GitHub

This repository includes a small Express production server, so deploy it as a **Node.js web service**, not as a static-only site.

Use these settings on Render, Railway, or a similar Node host:

```text
Build command: pnpm install --frozen-lockfile && pnpm build
Start command: pnpm start
Node version: 20 or newer
```

The server listens on the platform-provided `PORT` and serves the frontend from `dist/public`. Do not set the publish directory to `dist` on a static host; the browser bundle is in `dist/public`. The production fallback is implemented as Express middleware so nested URLs are served correctly across Express router versions.

For Vercel, the repository now includes `vercel.json` with the correct settings: `pnpm install --frozen-lockfile`, `pnpm build:vercel`, output directory `dist/public`, and a single-page-app rewrite to `index.html`. The server process and `server/index.ts` are not used in Vercel static mode.

## Product boundaries represented in the prototype

The UI treats over-capacity, missing scans, route anomalies, and wrong-collector scenarios as safety-critical states. It intentionally does not include parent-viewable cabin video, in-ride tablets, face matching, emotion recognition, or autonomous AI escalation. AI is presented as a small event-log assistant; human operators remain responsible for safety decisions.

## Project structure

```text
client/
  src/
    pages/Home.tsx   # complete role-switchable prototype UI
    index.css        # design system and responsive styling
    App.tsx          # app shell route
server/              # scaffold placeholder; no product backend added
shared/              # scaffold placeholder
```

## Next production steps

A production pilot would need authentication and role permissions, persistent route/manifest/ledger storage, real QR/RFID scanning, notification delivery, payment integration, and a vetted operational audit trail. Those should be added only after usability tests with parents, drivers, attendants, and school coordinators.

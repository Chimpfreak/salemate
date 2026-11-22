# Salemate — AI Sales & Trading Operations Partner

Salemate is an AI operations service built for B2B trading teams (starting with UAE GPU & enterprise IT hardware trading desks).

## Live Pitch Walkthrough
- **Startup Pitch Page (`/`):** Plain-English service story, interactive **8x NVIDIA H100 AI GPU** cost-trap proof, before/after Friday-night trade walkthrough, and embedded live Salemate preview.
- **Company Login & Registration (`/login`):** Multi-company authentication (`1 user = 1 trading company`) with 3 pre-seeded UAE trading desks (password: `salemate2026`) and live custom company signup:
  - `founder@alnoorsystems.ae` — **Al Noor AI & Compute Trading LLC** (GPU Trading Desk)
  - `desk@emiratesedge.ae` — **Emirates Edge Hardware Trading FZE** (Server Trading Desk)
  - `ops@abudhabicore.ae` — **Abu Dhabi Core Networks LLC** (Networking Desk)
- **Private Company Workspace (`/workspace`):** Isolated per-company Deal Memory, Morning Batch Sweep, 60-second Shadow Quotes, Silent BOM & UAE/META warranty guardrails, deterministic `3.6725` AED/USD peg + `5%` UAE CIF duty + `5%` UAE VAT math, Negotiation Copilot, and 4-Stage Paperwork Suite (Customer Quote, 3-Way PO Match, Client-Hidden Supplier PO, and 5% UAE VAT Tax Invoice).
- **Hosted Buyer Smart Deal Room (`/deal/DEAL-2026-884`):** Buyer-facing quote verification, one-click PO confirmation, and UAE PDPL-compliant first-party activity log.

## Deploy Live on Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FChimpfreak%2Fsalemate&project-name=salemate)

Works out of the box with zero external API keys required (pitch-safe mode). Optionally add these in **Vercel Project Settings → Environment Variables** and redeploy for live Gemini parsing & real Resend emails:
- `GEMINI_API_KEY` — Google AI Studio API key
- `RESEND_API_KEY` — Resend API key
- `SALEMATE_SENDER_EMAIL` — `onboarding@resend.dev` (or verified domain)

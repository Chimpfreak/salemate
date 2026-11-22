# Salemate v3 — Google Antigravity Project Context (`GEMINI.md`)

## 1. Mission & Beachhead
Salemate v3 is an **Autonomous B2B Trading & Compliance OS** built for small B2B IT hardware resellers (3–15 staff) in the UAE who lose time-sensitive deals during off-hours, weekends, and peak holiday seasons.
- **Core Job:** Normalize messy supplier quotes, validate technical BOM dependencies, calculate UAE landed cost in AED (`1 USD = 3.6725 AED`), and generate human-approved quotations, masked back-to-back POs, and 5% UAE VAT invoices.
- **Active Sprint Target:** Sheraa / Nestlé NextGen Founders Sprint Day (Validate Track). Keep the UI fast, self-contained, and demo-safe even without external database dependencies.

## 2. Architecture & File Map
- `app/page.js` — Main 5-Agent Trading OS dashboard (Enquiry Queue, Zero-Wait Shadow Quotes `<60s`, Silent BOM Guardrails, Negotiation Copilot, Morning Batch Sweep, and 4-Stage Sale Document & Live Email Dispatch Modal).
- `app/deal/[token]/page.js` — Hosted Smart Deal Room for buyer quote review & PO acceptance (UAE PDPL-compliant first-party telemetry).
- `app/api/analyze/route.js` — Live AI parser powered by `@google/genai` (`gemini-2.5-flash`) returning strict JSON for custom pasted enquiries and supplier quotes.
- `app/api/inbound-email/route.js` — Webhook endpoint for Resend Inbound (`email.received`) that parses incoming emails and appends them to the active queue.
- `app/api/send-email/route.js` — Human-gated outbound email dispatcher via Resend (`RESEND_API_KEY`) with safe simulated fallback when keys are unset.
- `lib/store.js` — Pre-seeded UAE IT hardware scenarios (`10x Dell PowerEdge R750`, `24x Cisco Catalyst C9300`, and `Fast-Path Ballpark` triage) + in-memory session state.

## 3. Non-Negotiable Engineering Rules
1. **Deterministic Financial Math:** Never let an LLM compute landed costs, customs duties, AED conversions, or 5% VAT. Keep all pricing math deterministic in JavaScript (`USD_TO_AED = 3.6725`, `CIF` triggers 5% UAE customs duty, `DDP` = 0% extra duty).
2. **Human-in-the-Loop Gate:** Outbound customer quotations and supplier Purchase Orders must NEVER auto-send without explicit human approval in the UI.
3. **Zero-Leakage Supplier POs:** Back-to-back Supplier POs must always redact the end-customer's name and contact details.
4. **Demo Resilience:** Every API route (`/api/analyze`, `/api/inbound-email`, `/api/send-email`) must handle missing `.env.local` keys gracefully without crashing the UI during a live pitch.

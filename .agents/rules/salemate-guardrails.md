---
trigger: always_on
description: Enforces Salemate v3 domain invariants, UAE currency/VAT math, and demo resilience in Google Antigravity
---

# Salemate v3 Coding & Domain Guardrails

When modifying or extending this repository in Google Antigravity:
- **Tech Stack:** Next.js 15 (App Router), React 19, Tailwind CSS, `lucide-react`, `@google/genai`, and `resend`. Do not introduce heavy ORMs or external Docker dependencies during the sprint.
- **Currency & Tax Constants:** Always preserve the fixed UAE Dirham peg (`USD_TO_AED = 3.6725`) and `5%` UAE VAT calculation on customer invoices.
- **Silent BOM & Regional Warranty Checks:** Always flag missing physical accessories (such as 2U sliding rack rails or redundant PSUs) and regional warranty mismatches (`US-Import` vs. `Official UAE / META ProSupport`).
- **Verification Loop:** Before concluding any code change, run `npm run build` in the terminal to verify zero Next.js build or bundling errors.

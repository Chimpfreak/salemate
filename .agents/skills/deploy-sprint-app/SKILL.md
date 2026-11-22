---
name: deploy-sprint-app
description: Verifies the Salemate v3 Next.js build locally, initializes Git, pushes to GitHub, and prepares Vercel deployment with live email webhooks.
---

# Deploy Salemate v3 Sprint Application

Follow these exact steps when asked to test, port, or deploy Salemate v3:

1. **Install & Verify Build:**
   - Run `npm install` to ensure `@google/genai`, `resend`, `next`, and `lucide-react` are installed.
   - Run `npm run build` to confirm zero compilation or Next.js App Router errors.
2. **Environment Configuration:**
   - Check if `.env.local` exists; if not, copy `.env.example` to `.env.local` and remind the user to add `GEMINI_API_KEY` and `RESEND_API_KEY`.
3. **Local Preview & Browser Verification:**
   - Start `npm run dev` on port `3000` and verify that the main dashboard (`/`), Smart Deal Room (`/deal/DEAL-2026-884`), and API routes (`/api/inbound-email`) respond with HTTP 200.
4. **GitHub & Vercel Deployment:**
   - Initialize Git (`git init && git add . && git commit -m "Salemate v3 Antigravity build"`) if `.git` is absent.
   - Guide the user to push to their GitHub repository and import into Vercel (`vercel.com/new`) with `GEMINI_API_KEY`, `RESEND_API_KEY`, and `SALEMATE_SENDER_EMAIL` set in Vercel Environment Variables.

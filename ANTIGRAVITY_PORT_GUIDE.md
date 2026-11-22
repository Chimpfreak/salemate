# Porting & Running Salemate v3 in Google Antigravity

This package is pre-configured with native **Google Antigravity** workspace context (`GEMINI.md`), always-on rules (`.agents/rules/salemate-guardrails.md`), and a deployment skill (`.agents/skills/deploy-sprint-app/SKILL.md`).

---

## Step 1: Open in Antigravity App or Antigravity CLI (`agy`)

### Option A — Antigravity Desktop App / IDE
1. Unzip `salemate-v3-antigravity-ready.zip` to a local folder (e.g., `~/projects/salemate-v3`).
2. Launch **Google Antigravity** (or your IDE with the Antigravity extension).
3. Click **Projects $ightarrow$ Create New Project $ightarrow$ New Project** and select your `salemate-v3` folder.
4. Select **Local mode** in the worktree selector so the agent edits directly in your active folder.
5. Antigravity will automatically load `GEMINI.md` and `.agents/rules/salemate-guardrails.md` into the agent's context.

### Option B — Antigravity CLI (`agy`)
Open your terminal inside the unzipped `salemate-v3` folder and launch a project session:
```bash
cd ~/projects/salemate-v3
agy --new-project
```

---

## Step 2: Run Your First Antigravity Verification & Deployment Prompt
In the Antigravity agent prompt box, paste:
> `Use the deploy-sprint-app skill to install dependencies, run npm run build, start the dev server, and verify the dashboard in the browser.`

Antigravity will:
1. Generate an **Implementation Plan** artifact.
2. Execute `npm install` and `npm run build` in the terminal sandbox.
3. Launch the app and verify the UI and routes.

---

## Step 3: Push to GitHub & Deploy Live on Vercel
Ask Antigravity:
> `Initialize a git repo, commit all files, and help me push this to GitHub so I can import it into Vercel.`

Once imported into Vercel (`vercel.com/new`):
1. Open **Project Settings $ightarrow$ Environment Variables** in Vercel and add:
   - `GEMINI_API_KEY` — Your Google AI Studio API key (for live `+ Live AI Parse` and inbound email extraction).
   - `RESEND_API_KEY` — Your Resend API key (for live email sending & receiving).
   - `SALEMATE_SENDER_EMAIL` — `onboarding@resend.dev` (or your verified domain).
2. Click **Redeploy**.
3. *(Optional)* In Resend $ightarrow$ **Webhooks**, set `email.received` to `https://<your-vercel-domain>.vercel.app/api/inbound-email` to test real inbound RFQ emails live during your pitch.

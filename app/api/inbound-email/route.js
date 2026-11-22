import { NextResponse } from "next/server";
import {
  addDealToStore,
  calculateQuoteFinancials,
  deterministicParseRfqText,
  getStoreDeals,
} from "@/lib/store";

/**
 * GET /api/inbound-email
 * Health check & active queue snapshot (verified by deploy-sprint-app skill).
 */
export async function GET() {
  const deals = getStoreDeals();
  return NextResponse.json({
    ok: true,
    service: "salemate-v3-inbound-email-webhook",
    provider: "Resend Inbound (email.received)",
    status: "listening",
    queuedDealsCount: deals.length,
    deals: deals.map((d) => ({
      token: d.token,
      title: d.title,
      buyerCompany: d.buyerCompany,
      receivedAt: d.receivedAt,
      stage: d.stage,
    })),
  });
}

/**
 * POST /api/inbound-email
 * Accepts Resend Inbound `email.received` webhook payloads or live pitch simulations,
 * parses the RFQ deterministically (never crashes without API keys), and appends to queue.
 */
export async function POST(request) {
  try {
    const payload = await request.json();

    // Support both Resend webhook format ({ type: 'email.received', data: {...} }) and direct pitch payload
    const emailData = payload?.data || payload || {};
    const fromRaw = String(emailData.from || "k.alzarooni@majid-tech.ae");
    const subject = String(
      emailData.subject || "Urgent Off-Hours RFQ: 12x Dell PowerEdge R750 for Dubai DC"
    );
    const bodyText = String(
      emailData.text ||
        emailData.html?.replace(/<[^>]+>/g, " ") ||
        `${subject}. Need 12x Dell PowerEdge R750 servers. Competing Miami broker quoted $6,400 CIF US-Import without rack rails or redundant PSU. Need UAE AED landed quote with 5% VAT ASAP.`
    );

    const emailMatch = fromRaw.match(/<([^>]+)>/);
    const senderEmail = emailMatch ? emailMatch[1] : fromRaw;
    const senderName = emailMatch ? fromRaw.split("<")[0].trim() : "Khalid Al-Zarooni";

    const parsedDeal = deterministicParseRfqText(
      `${subject} — ${bodyText}`,
      senderEmail,
      senderName
    );
    parsedDeal.channel = payload?.type === "email.received" ? "Resend Inbound Webhook" : "Simulated Inbound Email";
    parsedDeal.receivedAt = "Just Now (Inbound Webhook)";
    parsedDeal.telemetry[0] = {
      time: "Just Now",
      event: `Inbound email captured from ${senderEmail} via /api/inbound-email`,
      type: "intake",
    };

    addDealToStore(parsedDeal);
    const financials = calculateQuoteFinancials(
      parsedDeal.supplierQuotes[0],
      parsedDeal.quantity,
      parsedDeal.targetMarginPct
    );

    return NextResponse.json({
      ok: true,
      event: payload?.type || "email.received.simulated",
      deal: parsedDeal,
      financials,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Invalid inbound email payload" },
      { status: 400 }
    );
  }
}

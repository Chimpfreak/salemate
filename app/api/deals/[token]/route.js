import { NextResponse } from "next/server";
import {
  acceptDealPO,
  appendDealChatMessage,
  calculateQuoteFinancials,
  getDealByToken,
  recordDealTelemetry,
  rejectDealQuote,
  reopenDealQuote,
} from "@/lib/store";

export async function GET(_request, { params }) {
  const { token } = await params;
  const deal = getDealByToken(token);
  if (!deal) {
    return NextResponse.json({ ok: false, error: "Deal room not found" }, { status: 404 });
  }
  const primaryQuote =
    deal.supplierQuotes.find((q) => q.id === deal.recommendedQuoteId) || deal.supplierQuotes[0];
  const financials = calculateQuoteFinancials(primaryQuote, deal.quantity, deal.targetMarginPct);
  return NextResponse.json({ ok: true, deal, primaryQuote, financials });
}

export async function POST(request, { params }) {
  const { token } = await params;
  const body = await request.json().catch(() => ({}));
  const action = body?.action;

  if (action === "accept_po") {
    const deal = acceptDealPO(token, body?.buyerPoNumber, body?.approverName);
    if (!deal) {
      return NextResponse.json({ ok: false, error: "Deal not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, deal });
  }

  if (action === "reject_quote") {
    const deal = rejectDealQuote(token, body?.reason, body?.note, body?.buyerName);
    if (!deal) {
      return NextResponse.json({ ok: false, error: "Deal not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, deal });
  }

  if (action === "reopen_quote") {
    const deal = reopenDealQuote(token);
    if (!deal) {
      return NextResponse.json({ ok: false, error: "Deal not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, deal });
  }

  if (action === "chat_message") {
    const deal = appendDealChatMessage(token, {
      text: body?.text,
      connector: body?.connector || "whatsapp",
      senderName: body?.senderName,
    });
    if (!deal) {
      return NextResponse.json({ ok: false, error: "Deal not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, deal });
  }

  if (action === "telemetry") {
    const deal = recordDealTelemetry(
      token,
      body?.event || "Buyer inspected Smart Deal Room (UAE PDPL first-party event)",
      "buyer"
    );
    if (!deal) {
      return NextResponse.json({ ok: false, error: "Deal not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, deal });
  }

  return NextResponse.json({ ok: false, error: "Unsupported action" }, { status: 400 });
}

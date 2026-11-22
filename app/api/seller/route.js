import { NextResponse } from "next/server";
import { confirmSellerOrderReady, getSellerPortalData } from "@/lib/store";

/**
 * GET /api/seller?sellerId=seller_redington
 * Returns strictly zero-leakage sales metrics & order ledger for a Seller Partner.
 * NEVER includes customer PII, reseller cut/margin, or customer selling price.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId") || "seller_redington";
  const data = getSellerPortalData(sellerId);
  return NextResponse.json({ ok: true, ...data });
}

/**
 * POST /api/seller
 * Allows a Seller Partner to confirm blind-shipment stock readiness to Salemate's consolidation dock.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, sellerId = "seller_redington", orderRef } = body || {};

    if (action === "confirm_ready" && orderRef) {
      confirmSellerOrderReady(orderRef);
      const data = getSellerPortalData(sellerId);
      return NextResponse.json({ ok: true, ...data });
    }

    return NextResponse.json({ ok: false, error: "Unsupported seller action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to update seller order" },
      { status: 500 }
    );
  }
}

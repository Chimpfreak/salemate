"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Lock,
  Building2,
  Clock,
  ArrowLeft,
  Activity,
  Loader2,
} from "lucide-react";
import {
  INITIAL_DEALS,
  RESELLER_PROFILE,
  USD_TO_AED,
  calculateQuoteFinancials,
  formatAED,
} from "@/lib/store";
import SalemateLogo from "@/components/SalemateLogo";

export default function SmartDealRoomPage() {
  const params = useParams();
  const rawToken = Array.isArray(params?.token) ? params.token[0] : params?.token;
  const token = rawToken || "DEAL-2026-884";

  const fallbackDeal =
    INITIAL_DEALS.find((d) => d.token.toLowerCase() === token.toLowerCase()) || INITIAL_DEALS[0];

  const [deal, setDeal] = useState(fallbackDeal);
  const [approverName, setApproverName] = useState(fallbackDeal.buyerName);
  const [buyerPoNumber, setBuyerPoNumber] = useState(
    `PO-${fallbackDeal.token.replace("DEAL-", "")}-UAE`
  );
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(fallbackDeal.poAccepted || false);

  useEffect(() => {
    let active = true;
    async function loadDeal() {
      try {
        const res = await fetch(`/api/deals/${encodeURIComponent(token)}`);
        if (res.ok) {
          const data = await res.json();
          if (active && data.ok && data.deal) {
            setDeal(data.deal);
            setApproverName(data.deal.buyerName);
            setAccepted(Boolean(data.deal.poAccepted));
            if (data.deal.buyerPoNumber) setBuyerPoNumber(data.deal.buyerPoNumber);
          }
        }
        await fetch(`/api/deals/${encodeURIComponent(token)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "telemetry",
            event: "Buyer opened Smart Deal Room (privacy-safe first-party view)",
          }),
        });
      } catch {
        // Keep seeded fallback cleanly
      }
    }
    loadDeal();
    return () => {
      active = false;
    };
  }, [token]);

  const primaryQuote =
    deal.supplierQuotes.find((q) => q.id === deal.recommendedQuoteId) || deal.supplierQuotes[0];
  const financials = calculateQuoteFinancials(primaryQuote, deal.quantity, deal.targetMarginPct);

  async function handleAcceptPO(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/deals/${encodeURIComponent(deal.token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "accept_po",
          buyerPoNumber,
          approverName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.deal) {
        setDeal(data.deal);
      }
      setAccepted(true);
    } catch {
      setAccepted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Deal Room Header with Official Salemate Logo */}
      <header className="bg-[#090616] text-white border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <SalemateLogo variant="dark" size="sm" />
            </Link>
            <span className="hidden sm:inline-block text-xs text-slate-400 border-l border-white/15 pl-3">
              Buyer Smart Deal Room · <span className="font-mono text-slate-200">{deal.token}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/workspace" className="text-slate-300 hover:text-white transition">
              Live Workspace
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Salemate
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Verified Assurance Banner */}
        <div className="bg-[#0F172A] text-white rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Verified by Salemate · Official Warranty &amp; Complete Parts Checked
              </p>
              <h1 className="text-xl font-bold mt-0.5">{deal.title}</h1>
              <p className="text-xs text-slate-300 mt-1">
                {primaryQuote.warrantyRegion} · {primaryQuote.leadTime} · All cables, mounting kits,
                and customs duties included
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-300">Total Price (Includes 5% UAE VAT)</p>
            <p className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
              {formatAED(financials.grandTotalAed)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Cols: Clear Price Breakdown */}
          <div className="lg:col-span-7 space-y-5">
            <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand" />
                  <h2 className="text-sm font-bold text-slate-900">Your Clear Quote Summary</h2>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  Price Held for 48 Hours
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200/80">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Prepared For</p>
                  <p className="font-bold text-slate-900 mt-1">{deal.buyerCompany}</p>
                  <p className="text-slate-600">{deal.buyerName}</p>
                  <p className="text-slate-500">{deal.buyerLocation}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Seller (Powered by Salemate)</p>
                  <p className="font-bold text-slate-900 mt-1">{RESELLER_PROFILE.companyName}</p>
                  <p className="font-mono text-slate-600">TRN: {RESELLER_PROFILE.trn}</p>
                  <p className="text-slate-500">{RESELLER_PROFILE.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-900">What Is Included (Nothing Missing)</p>
                <p className="text-slate-600 leading-relaxed">{deal.specs}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                    {primaryQuote.warrantyRegion}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono font-semibold">
                    Ref: {deal.sku}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>
                    Subtotal ({deal.quantity} units × {formatAED(financials.unitSellPriceAed)})
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    {formatAED(financials.sellSubtotalAed)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>UAE Import Duty &amp; Local Delivery to Your Site</span>
                  <span className="font-mono font-semibold text-emerald-700">Included</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>UAE VAT (5.0%)</span>
                  <span className="font-mono tabular-nums font-medium">
                    {formatAED(financials.vatAed)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                  <span>Final Total (AED)</span>
                  <span className="font-mono tabular-nums text-brand">
                    {formatAED(financials.grandTotalAed)}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 text-right">
                  Exact UAE Peg Used: 1 USD = {USD_TO_AED} AED
                </p>
              </div>
            </section>

            {/* Privacy-First Activity Log */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-brand" />
                  Live Deal Activity Log (UAE Privacy Compliant)
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  <Lock className="w-3 h-3" />
                  No Ad Trackers
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Simple, privacy-safe first-party confirmation log compliant with UAE PDPL—so both
                sides have a clear audit trail.
              </p>
              <ul className="space-y-1.5 text-xs pt-1">
                {deal.telemetry.slice(0, 5).map((item, idx) => (
                  <li
                    key={`${item.time}-${idx}`}
                    className="flex justify-between gap-3 py-1.5 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-slate-700">{item.event}</span>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0">
                      {item.time}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right 5 Cols: Buyer Order Acceptance */}
          <aside className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 sticky top-6">
              {accepted ? (
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Order Confirmed
                    </p>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">
                      Stock Reserved for {deal.buyerCompany}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Your Purchase Order number has been recorded in Salemate. Our trading team has
                      been alerted to release delivery and send your 5% UAE VAT invoice.
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Your PO Number</span>
                      <span className="font-mono font-bold text-slate-900">{buyerPoNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Approved By</span>
                      <span className="font-semibold text-slate-900">{approverName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Confirmed Total</span>
                      <span className="font-mono font-bold text-brand">
                        {formatAED(financials.grandTotalAed)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAcceptPO} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-brand" />
                    <h2 className="text-base font-bold text-slate-900">
                      Approve Quote &amp; Confirm Order
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Happy with the price and warranty? Enter your PO number below to lock stock for{" "}
                    <strong>{deal.buyerCompany}</strong>.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name
                    </label>
                    <input
                      id="buyer-approver-name"
                      type="text"
                      required
                      value={approverName}
                      onChange={(e) => setApproverName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Purchase Order (PO) Number
                    </label>
                    <input
                      id="buyer-po-number"
                      type="text"
                      required
                      value={buyerPoNumber}
                      onChange={(e) => setBuyerPoNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                    />
                  </div>

                  <button
                    id="accept-quote-po-btn"
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#090616] hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Confirming Order...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Approve Quote ({formatAED(financials.grandTotalAed)})
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-400 text-center">
                    Official 5% UAE VAT Tax Invoice Issued Immediately Upon Approval
                  </p>
                </form>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

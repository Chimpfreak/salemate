"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  CheckCircle2,
  PackageCheck,
  Building2,
  ArrowLeft,
  ArrowUpRight,
  Truck,
  BadgeDollarSign,
  Boxes,
  Loader2,
} from "lucide-react";
import SalemateLogo from "@/components/SalemateLogo";
import {
  SELLER_PARTNERS,
  USD_TO_AED,
  formatAED,
  formatUSD,
  getSellerPortalData,
} from "@/lib/store";

export default function SellerPortalPage() {
  const [selectedSellerId, setSelectedSellerId] = useState(SELLER_PARTNERS[0].id);
  const [portalData, setPortalData] = useState(() =>
    getSellerPortalData(SELLER_PARTNERS[0].id)
  );
  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let active = true;
    async function fetchSellerData() {
      try {
        const res = await fetch(`/api/seller?sellerId=${encodeURIComponent(selectedSellerId)}`);
        if (res.ok) {
          const data = await res.json();
          if (active && data.ok) {
            setPortalData(data);
          }
        }
      } catch {
        if (active) {
          setPortalData(getSellerPortalData(selectedSellerId));
        }
      }
    }
    fetchSellerData();
    return () => {
      active = false;
    };
  }, [selectedSellerId]);

  async function handleConfirmReady(orderRef) {
    setConfirmingOrder(orderRef);
    try {
      const res = await fetch("/api/seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm_ready",
          sellerId: selectedSellerId,
          orderRef,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          setPortalData(data);
        }
      }
      setToast(`Order ${orderRef} marked ready for blind pickup at Salemate Consolidation Bay.`);
      setTimeout(() => setToast(""), 4500);
    } finally {
      setConfirmingOrder(null);
    }
  }

  const { seller, availableSellers, summary, orders } = portalData;

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#060510] text-white border-b border-white/15 shadow-lg shadow-black/25">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <SalemateLogo variant="dark" size="sm" />
            </Link>
            <span className="hidden sm:inline-block text-xs text-slate-300 border-l border-white/15 pl-3 font-medium">
              Seller Partner View · Zero-Leakage Sales Ledger
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <Link
              href="/deal/DEAL-2026-884"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 transition"
            >
              Buyer View
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white text-obsidian hover:bg-slate-100 font-bold transition"
            >
              Trading Desk
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 py-8 space-y-7">
        {toast && (
          <div className="px-4 py-3 rounded-xl bg-obsidian text-white text-xs flex items-center gap-2.5 shadow-lg border border-emerald-400/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Seller Partner Switcher + Zero-Leakage Hero Card */}
        <section className="rounded-3xl bg-obsidian text-white p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1.5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sky-300">
                Seller Partner Portal · Verified Sales Generated For You
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {seller.sellerName}
              </h1>
              <p className="text-xs text-slate-300">
                {seller.partnerTier} · {seller.location} · Focus: {seller.category}
              </p>
            </div>

            {/* Switch Seller Partner for Pitch Demos */}
            <div className="flex flex-col sm:items-end gap-1.5">
              <label
                htmlFor="seller-partner-select"
                className="font-mono text-[10px] uppercase tracking-wider text-slate-400"
              >
                Preview Seller Account
              </label>
              <select
                id="seller-partner-select"
                value={selectedSellerId}
                onChange={(e) => setSelectedSellerId(e.target.value)}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
              >
                {availableSellers.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.sellerName} — {s.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payout-Only KPI Strip (Zero Platform Cut, Zero Customer Sell Price) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-300">
                <BadgeDollarSign className="w-3.5 h-3.5" />
                Total Sales Made For You
              </div>
              <p className="text-2xl font-bold font-mono tabular-nums text-white pt-1">
                {formatAED(summary.totalSalesMadeAed)}
              </p>
              <p className="font-mono text-[11px] text-slate-400">
                {formatUSD(summary.totalSalesMadeUsd)} agreed seller payout
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-sky-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Settled &amp; Paid Out
              </div>
              <p className="text-2xl font-bold font-mono tabular-nums text-white pt-1">
                {formatAED(summary.settledAed)}
              </p>
              <p className="font-mono text-[11px] text-slate-400">
                {formatUSD(summary.settledUsd)} cleared to your bank
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-300">
                <Boxes className="w-3.5 h-3.5" />
                Units Sold Through Salemate
              </div>
              <p className="text-2xl font-bold font-mono tabular-nums text-white pt-1">
                {summary.totalUnitsMoved} Units
              </p>
              <p className="text-[11px] text-slate-400">
                Across {summary.ordersCount} verified orders
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-500/15 border border-emerald-400/30 p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-300">
                <Lock className="w-3.5 h-3.5" />
                Zero-Leakage Ledger
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Displays <strong>only your agreed payout</strong>. End-buyer data, platform margin,
                and final resale prices are strictly omitted.
              </p>
            </div>
          </div>
        </section>

        {/* Three Explicit Privacy Guarantees Strip */}
        <section className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-surface border border-slate-900/10 rounded-2xl p-4 flex items-start gap-3">
            <EyeOff className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">End-Customer Identity Masked</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                No buyer names, company contacts, emails, or TRNs appear anywhere in this portal.
              </p>
            </div>
          </div>
          <div className="bg-surface border border-slate-900/10 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Your Payout Only — Zero Spread Shown</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Every figure reflects strictly the wholesale revenue Salemate generated for{" "}
                {seller.sellerName} (1 USD = {USD_TO_AED} AED).
              </p>
            </div>
          </div>
          <div className="bg-surface border border-slate-900/10 rounded-2xl p-4 flex items-start gap-3">
            <Truck className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Blind Consolidation Delivery</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                All shipments deliver directly to <strong>{seller.consolidationDock}</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Sales Ledger Table */}
        <section className="bg-surface border border-slate-900/10 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-900/10 flex flex-wrap items-center justify-between gap-3 bg-canvas/50">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Sales Made For {seller.sellerName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Masked order references with your confirmed payout amount (AED &amp; USD)
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Lock className="w-3 h-3" />
              Customer &amp; Resale Margin Hidden
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-white">
                  <th className="py-3.5 px-6 font-semibold">Order Ref &amp; Date</th>
                  <th className="py-3.5 px-4 font-semibold">Hardware Supplied</th>
                  <th className="py-3.5 px-4 font-semibold">End Buyer</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Amount Made For You</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-6 text-right font-semibold">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.orderRef} className="hover:bg-canvas/40 transition">
                    <td className="py-4 px-6">
                      <p className="font-mono font-bold text-slate-900">{ord.orderRef}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{ord.date}</p>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-semibold text-slate-900">{ord.item}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Qty: {ord.quantity} · {ord.incoterms} · Dock: {ord.shipToDock}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 font-mono text-[10px] font-semibold text-slate-600">
                        <EyeOff className="w-3 h-3 text-slate-400" />
                        {ord.endBuyerMasked}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <p className="font-mono tabular-nums font-bold text-sm text-emerald-800">
                        {formatAED(ord.sellerPayoutAed)}
                      </p>
                      <p className="font-mono tabular-nums text-[11px] text-slate-500">
                        {formatUSD(ord.sellerPayoutUsd)}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          ord.status.includes("Settled") || ord.status.includes("Confirmed Ready")
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : ord.status.startsWith("On Hold")
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {ord.readyConfirmed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <PackageCheck className="w-4 h-4" />
                          Ready / Completed
                        </span>
                      ) : ord.status.startsWith("On Hold") ? (
                        <span className="text-slate-400 font-medium">Paused</span>
                      ) : (
                        <button
                          id={`confirm-ready-${ord.orderRef}`}
                          type="button"
                          disabled={confirmingOrder === ord.orderRef}
                          onClick={() => handleConfirmReady(ord.orderRef)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian hover:bg-slate-800 text-white text-[11px] font-bold transition disabled:opacity-50 cursor-pointer"
                        >
                          {confirmingOrder === ord.orderRef ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Building2 className="w-3.5 h-3.5 text-sky-300" />
                          )}
                          Confirm Stock Ready
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

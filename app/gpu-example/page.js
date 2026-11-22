"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import {
  INITIAL_DEALS,
  USD_TO_AED,
  calculateQuoteFinancials,
  formatAED,
  round2,
} from "@/lib/store";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

const STORY_MODES = {
  without: {
    eyebrow: "Friday 11:42 PM · Without Salemate",
    headline: "A 978,000 AED GPU order slips away before Monday morning.",
    steps: [
      {
        time: "11:42 PM",
        title: "Urgent WhatsApp arrives",
        chat: "A Dubai AI lab needs 8 NVIDIA H100 GPUs before Monday. Your team is asleep—no reply goes out.",
      },
      {
        time: "Saturday",
        title: "Manual Excel chaos",
        chat: "Hours lost copying USD broker texts into spreadsheets. A US broker looks $13,600 cheaper on paper.",
      },
      {
        time: "The Trap",
        title: "Hidden bills wipe out profit",
        chat: "Missing 16-pin GPU cables, cooling kits, 5% UAE import tax, and zero local warranty kill the trade.",
      },
    ],
  },
  with: {
    eyebrow: "Friday 11:42 PM · With Salemate",
    headline: "Captured in 41 seconds. Traps exposed. Profit locked.",
    steps: [
      {
        time: "11:42 PM",
        title: "Instant 41-second ballpark",
        chat: "Salemate reads the WhatsApp message, scores the buyer 95/100, and holds 8 Dubai H100 GPUs immediately.",
      },
      {
        time: "11:43 PM",
        title: "Grey-market broker caught",
        chat: "Salemate proves the 'cheaper' US quote lands AED 24,668 HIGHER once cables & 5% duty are added—and flags the IBAN switch.",
      },
      {
        time: "8:00 AM",
        title: "1-click approval & masked PO",
        chat: "You wake up to a ready Customer Quote, Client-Hidden Supplier Order, and 5% UAE VAT invoice waiting for your click.",
      },
    ],
  },
};

export default function GpuExamplePage() {
  const gpuDeal = INITIAL_DEALS[0];
  const safeQuote = gpuDeal.supplierQuotes[0];
  const riskyQuote = gpuDeal.supplierQuotes[1];

  const [storyMode, setStoryMode] = useState("with");
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [auditParts, setAuditParts] = useState(true);
  const [auditTax, setAuditTax] = useState(true);

  const safeFin = calculateQuoteFinancials(safeQuote, gpuDeal.quantity, 12, []);
  const riskyBomIds = auditParts ? riskyQuote.missingBomItems.map((b) => b.id) : [];
  const riskyAdj = auditTax ? riskyQuote : { ...riskyQuote, incoterms: "DDP" };
  const riskyFin = calculateQuoteFinancials(riskyAdj, gpuDeal.quantity, 12, riskyBomIds);
  const diffAed = round2(riskyFin.totalLandedCostAed - safeFin.totalLandedCostAed);

  const activeStory = STORY_MODES[storyMode];

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Visual Editorial Hero */}
        <section className="bg-obsidian text-white py-14 lg:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sky-300">
                Real-World Case Study · GPU Trading
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-[1.06]">
                One Friday night{" "}
                <span className="font-serif italic font-normal text-sky-300">GPU trade</span> shows
                why Salemate exists.
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                We use trading <strong>8× NVIDIA H100 AI GPUs</strong> to show our service in
                action—because one missed cable, 5% customs fee, or slow weekend reply costs tens of
                thousands of dirhams.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/deal/DEAL-2026-884"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-obsidian hover:bg-slate-100 text-xs font-bold transition"
                >
                  Open Buyer Chat Room
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/seller"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition"
                >
                  Open Seller Payout View
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
                <img
                  src="/gpu-sculpture.jpg"
                  alt="Editorial sculptural still life of AI GPU hardware"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Timeline with Hover/Tap Chatbox Bubbles */}
        <section className="editorial-grain py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Compare the same night,{" "}
                  <span className="font-serif italic font-normal text-indigo-800">
                    side by side
                  </span>
                  .
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Hover or tap any moment below to open the detail bubble.
                </p>
              </div>
              <div className="inline-flex p-1 rounded-full bg-stone border border-slate-900/10 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStoryMode("without");
                    setActiveStepIdx(0);
                  }}
                  className={`px-5 py-2 rounded-full font-semibold transition cursor-pointer ${
                    storyMode === "without"
                      ? "bg-obsidian text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Without Salemate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStoryMode("with");
                    setActiveStepIdx(0);
                  }}
                  className={`px-5 py-2 rounded-full font-semibold transition cursor-pointer ${
                    storyMode === "with"
                      ? "bg-obsidian text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  With Salemate
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 items-start">
              {/* 3 Minimalist Hover/Tap Step Cards */}
              <div className="lg:col-span-7 grid sm:grid-cols-3 gap-4">
                {activeStory.steps.map((s, idx) => {
                  const active = activeStepIdx === idx;
                  return (
                    <button
                      key={s.title}
                      type="button"
                      onMouseEnter={() => setActiveStepIdx(idx)}
                      onClick={() => setActiveStepIdx(idx)}
                      className={`text-left rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                        active
                          ? "bg-obsidian text-white border-obsidian shadow-xl -translate-y-0.5"
                          : "bg-surface text-slate-900 border-slate-900/10 hover:border-slate-900/30 shadow-sm"
                      }`}
                    >
                      <span
                        className={`font-mono text-xs font-bold ${
                          active
                            ? storyMode === "with"
                              ? "text-emerald-300"
                              : "text-rose-300"
                            : "text-slate-400"
                        }`}
                      >
                        {s.time}
                      </span>
                      <div>
                        <p className="text-base font-bold leading-snug">{s.title}</p>
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[10px] mt-2 ${
                            active ? "text-sky-300" : "text-indigo-600"
                          }`}
                        >
                          <MessageCircle className="w-3 h-3" />
                          {active ? "Viewing" : "Hover / tap"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Conversational Bubble Explaining Selected Moment */}
              <div className="lg:col-span-5 rounded-3xl bg-obsidian text-white p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider font-bold ${
                      storyMode === "with" ? "text-emerald-300" : "text-rose-300"
                    }`}
                  >
                    {activeStory.eyebrow}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {activeStory.steps[activeStepIdx].time}
                  </span>
                </div>
                <p className="text-base font-bold text-white">{activeStory.headline}</p>
                <div className="bg-white/[0.08] rounded-2xl rounded-tl-sm p-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {activeStory.steps[activeStepIdx].chat}
                </div>
              </div>
            </div>

            {/* Interactive Numbers Proof */}
            <div className="bg-surface rounded-3xl border border-slate-900/10 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-indigo-700 font-bold">
                    Interactive Landed-Cost Proof · 1 USD = {USD_TO_AED} AED
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Toggle Salemate&apos;s checks to see the hidden trap flip the price
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-canvas border border-slate-900/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={auditParts}
                      onChange={(e) => setAuditParts(e.target.checked)}
                    />
                    <span className="font-semibold">Missing cables &amp; cooling (+$1,150/u)</span>
                  </label>
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-canvas border border-slate-900/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={auditTax}
                      onChange={(e) => setAuditTax(e.target.checked)}
                    />
                    <span className="font-semibold">5% UAE import tax</span>
                  </label>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-canvas border border-slate-900/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Overseas US Broker</p>
                    <p className="text-rose-700 font-mono text-[11px] mt-0.5">No UAE Warranty</p>
                  </div>
                  <p className="font-mono tabular-nums text-xl font-bold text-slate-900">
                    {formatAED(riskyFin.totalLandedCostAed)}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-600 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Dubai Official Stock</p>
                    <p className="text-emerald-800 font-mono text-[11px] mt-0.5">
                      3Y UAE Warranty · Complete Kit
                    </p>
                  </div>
                  <p className="font-mono tabular-nums text-xl font-bold text-emerald-800">
                    {formatAED(safeFin.totalLandedCostAed)}
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl text-xs flex items-center gap-3 ${
                  diffAed > 0
                    ? "bg-obsidian text-white"
                    : "bg-amber-50 border border-amber-200 text-amber-950"
                }`}
              >
                {diffAed > 0 ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span>
                  {diffAed > 0
                    ? `Trap Exposed: Overseas broker actually lands ${formatAED(diffAed)} MORE expensive with zero UAE warranty.`
                    : `Without Salemate's audit, the risky broker looks ${formatAED(Math.abs(diffAed))} cheaper on paper.`}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

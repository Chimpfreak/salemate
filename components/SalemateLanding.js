"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  EyeOff,
  FileCheck2,
  Building2,
} from "lucide-react";
import {
  INITIAL_DEALS,
  USD_TO_AED,
  calculateQuoteFinancials,
  formatAED,
  round2,
} from "@/lib/store";
import SalemateLogo from "@/components/SalemateLogo";
import SalematePreviewOS from "@/components/SalematePreviewOS";
import WorkspaceToolsGuide from "@/components/WorkspaceToolsGuide";

const PLAIN_STEPS = [
  {
    num: "01",
    label: "Capture",
    title: "Reads messy messages",
    desc: "Pulls exact quantities, specs, and deadlines out of frantic WhatsApp texts or emails—and separates serious buyers from time-wasters.",
  },
  {
    num: "02",
    label: "Respond",
    title: "Replies in under 60 seconds",
    desc: "Drafts a fast, profit-safe ballpark price even on Friday nights or weekends so the buyer stays locked in with your team.",
  },
  {
    num: "03",
    label: "Audit",
    title: "Exposes hidden supplier traps",
    desc: "Spots missing cables or cooling kits, grey-market warranties invalid in the UAE, 5% import taxes, and suspicious bank-account changes.",
  },
  {
    num: "04",
    label: "Calculate",
    title: "Exact AED profit & VAT math",
    desc: "Uses deterministic formulas (3.6725 AED rate + 5% UAE VAT)—never AI guesswork—so your net margin is never eroded.",
  },
  {
    num: "05",
    label: "Approve",
    title: "Waits for your final 'Yes'",
    desc: "Prepares the Customer Quote, Client-Hidden Supplier Order, and UAE VAT Invoice—and sends only after you click Approve.",
  },
];

const STORY_MODES = {
  without: {
    eyebrow: "Friday 11:42 PM · Without Salemate",
    headline: "A 978,000 AED GPU order slips away before Monday morning.",
    steps: [
      {
        time: "11:42 PM",
        title: "Urgent WhatsApp arrives",
        detail: "A Dubai AI lab needs 8 NVIDIA H100 GPUs before Monday. Your team is asleep.",
      },
      {
        time: "Next Day",
        title: "Chasing quotes in spreadsheets",
        detail: "Hours lost copying USD broker texts into Excel. A 'cheap' US quote looks $13,600 lower on paper.",
      },
      {
        time: "The Trap",
        title: "Hidden costs hit after you quote",
        detail: "Missing 16-pin cables, cooling kits, 5% customs duty, and zero UAE warranty wipe out your entire margin—or the buyer already went elsewhere.",
      },
    ],
  },
  with: {
    eyebrow: "Friday 11:42 PM · With Salemate",
    headline: "Captured in 41 seconds. Traps exposed. Profit protected.",
    steps: [
      {
        time: "11:42 PM",
        title: "Instant 41-second ballpark drafted",
        detail: "Salemate reads the WhatsApp message, verifies the buyer is serious, and prepares a fast AED anchor quote so they don't call a competitor.",
      },
      {
        time: "11:43 PM",
        title: "Grey-market broker caught red-handed",
        detail: "Salemate proves the 'cheaper' US broker actually costs AED 24,668 MORE once missing cables and 5% UAE duty are added—and flags the bank-switch risk.",
      },
      {
        time: "8:00 AM",
        title: "One click to review, approve & close",
        detail: "You wake up to a ready Customer Quote, a Client-Hidden Supplier Order, and a 5% UAE VAT invoice—all waiting for your click.",
      },
    ],
  },
};

export default function SalemateLanding() {
  const gpuDeal = INITIAL_DEALS[0]; // 8x NVIDIA H100 80GB PCIe GPUs
  const safeQuote = gpuDeal.supplierQuotes[0];
  const riskyQuote = gpuDeal.supplierQuotes[1];

  const [auditHiddenParts, setAuditHiddenParts] = useState(true);
  const [auditImportTax, setAuditImportTax] = useState(true);
  const [storyMode, setStoryMode] = useState("with");

  const [pilotCompany, setPilotCompany] = useState("");
  const [pilotEmail, setPilotEmail] = useState("");
  const [pilotSubmitted, setPilotSubmitted] = useState(false);

  const safeFin = calculateQuoteFinancials(safeQuote, gpuDeal.quantity, 12, []);
  const riskyBomIds = auditHiddenParts ? riskyQuote.missingBomItems.map((b) => b.id) : [];
  const riskyAdjusted = auditImportTax ? riskyQuote : { ...riskyQuote, incoterms: "DDP" };
  const riskyFin = calculateQuoteFinancials(riskyAdjusted, gpuDeal.quantity, 12, riskyBomIds);
  const trapDiffAed = round2(riskyFin.totalLandedCostAed - safeFin.totalLandedCostAed);

  // Normalized visual bar widths (scale relative to AED 860,000 ceiling)
  const barScaleMax = 865000;
  const safeBarPct = Math.min(100, Math.round((safeFin.totalLandedCostAed / barScaleMax) * 100));
  const riskyBarPct = Math.min(100, Math.round((riskyFin.totalLandedCostAed / barScaleMax) * 100));

  const activeStory = STORY_MODES[storyMode];

  function handlePilotSubmit(e) {
    e.preventDefault();
    if (!pilotEmail.trim()) return;
    setPilotSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      {/* =====================================================================
          FLOATING EDITORIAL NAVBAR
         ===================================================================== */}
      <header className="sticky top-0 z-40 bg-obsidian/85 backdrop-blur-xl border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <SalemateLogo variant="dark" size="sm" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium tracking-wide text-slate-300">
            <a href="#story" className="hover:text-white transition">
              The GPU Example
            </a>
            <a href="#service" className="hover:text-white transition">
              Our Service
            </a>
            <a href="#tools" className="hover:text-white transition">
              Workspace Tools
            </a>
            <a href="#live-preview" className="hover:text-white transition">
              Live Preview
            </a>
            <a href="#promises" className="hover:text-white transition">
              Protection
            </a>
            <a href="#pilot" className="hover:text-white transition">
              Pilot
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/deal/DEAL-2026-884"
              className="hidden xl:inline-flex items-center gap-1 px-3 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 transition"
            >
              Buyer View
            </Link>
            <Link
              id="nav-seller-view"
              href="/seller"
              className="hidden lg:inline-flex items-center gap-1 px-3 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 transition"
            >
              Seller View
            </Link>
            <Link
              id="nav-company-login"
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition"
            >
              Company Login
            </Link>
            <Link
              id="nav-open-workspace"
              href="/workspace"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-obsidian hover:bg-slate-100 text-xs font-bold transition shadow-sm"
            >
              Workspace
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* =====================================================================
            CINEMATIC HERO WITH SCULPTURAL GLASS RIBBON ARTWORK
           ===================================================================== */}
        <section className="relative overflow-hidden bg-obsidian text-white">
          {/* Bespoke Sculptural Glass Ribbon Backdrop */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <img
              src="/hero-ribbon.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-right opacity-75 animate-ribbon"
            />
            {/* Editorial Vignette ensuring effortless left-side contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/88 to-obsidian/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/40" />
          </div>

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Expressive Editorial Copy */}
            <div className="lg:col-span-6 space-y-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-sky-300/90">
                AI Sales &amp; Operations Service · Built for Trading Teams
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-bold tracking-[-0.03em] leading-[1.04] text-white">
                Close high-value trades{" "}
                <span className="font-serif italic font-normal text-sky-300 tracking-normal">
                  in sixty seconds
                </span>
                —without hidden supplier traps.
              </h1>

              <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed max-w-xl font-normal">
                We don&apos;t sell hardware—we run the back-office for the trading teams that do.{" "}
                <strong className="text-white font-semibold">Salemate</strong> reads your buyer
                messages, catches hidden supplier fees and warranty scams, calculates exact AED
                profit &amp; VAT, and drafts ready-to-send paperwork while you keep final approval.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <a
                  href="#live-preview"
                  className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-obsidian hover:bg-slate-100 text-sm font-bold transition shadow-lg shadow-black/30"
                >
                  Explore Live GPU Demo
                  <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                </a>
                <Link
                  href="/workspace"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition"
                >
                  Open Full Workspace
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-x-8 gap-y-2 text-xs text-slate-400">
                <span>Works with WhatsApp &amp; Email</span>
                <span>Exact 3.6725 AED &amp; 5% VAT Math</span>
                <span>100% Human-Approved Sends</span>
              </div>
            </div>

            {/* Right Gallery-Framed Live GPU Cost-Trap Visual */}
            <div className="lg:col-span-6">
              <div className="obsidian-glass rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">
                      Real-World Proof · GPU Trading
                    </p>
                    <h2 className="text-lg font-semibold text-white mt-1">
                      8x NVIDIA H100 GPUs —{" "}
                      <span className="font-serif italic font-normal text-slate-200">
                        paper price vs. true cost
                      </span>
                    </h2>
                  </div>
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-slate-200 shrink-0">
                    AED {USD_TO_AED}
                  </span>
                </div>

                {/* Tactile Audit Switches */}
                <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
                  <label className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={auditHiddenParts}
                      onChange={(e) => setAuditHiddenParts(e.target.checked)}
                      className="rounded border-white/30 bg-transparent text-sky-400 focus:ring-sky-400"
                    />
                    <span className="text-slate-200 font-medium">
                      Missing cables &amp; cooling (+$1,150/GPU)
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={auditImportTax}
                      onChange={(e) => setAuditImportTax(e.target.checked)}
                      className="rounded border-white/30 bg-transparent text-sky-400 focus:ring-sky-400"
                    />
                    <span className="text-slate-200 font-medium">
                      5% UAE import tax + customs
                    </span>
                  </label>
                </div>

                {/* Animated Visual Cost Comparison Bars */}
                <div className="space-y-4 pt-1">
                  {/* Overseas Broker Bar */}
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">Overseas US Broker</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30">
                          No UAE Warranty
                        </span>
                      </div>
                      <span className="font-mono tabular-nums font-bold text-sm text-white">
                        {formatAED(riskyFin.totalLandedCostAed)}
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        style={{ width: `${riskyBarPct}%` }}
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          trapDiffAed > 0
                            ? "bg-gradient-to-r from-amber-400 via-rose-500 to-rose-400"
                            : "bg-slate-400"
                        }`}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Paper: {formatAED(round2(riskyFin.hardwareUsd * USD_TO_AED))}
                      {auditHiddenParts
                        ? ` + Parts ${formatAED(round2(riskyFin.bomTotalUsd * USD_TO_AED))}`
                        : ""}
                      {auditImportTax
                        ? ` + Duty ${formatAED(riskyFin.customsDutyAed + riskyFin.clearanceFeeAed)}`
                        : ""}
                    </p>
                  </div>

                  {/* Official Dubai Stock Bar */}
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">Dubai Official Channel</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                          3Y UAE Warranty · Complete
                        </span>
                      </div>
                      <span className="font-mono tabular-nums font-bold text-sm text-emerald-300">
                        {formatAED(safeFin.totalLandedCostAed)}
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        style={{ width: `${safeBarPct}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 transition-all duration-500 ease-out"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      All duties paid · 16-pin GPU harnesses &amp; cooling kits included
                    </p>
                  </div>
                </div>

                {/* Crisp Editorial Verdict */}
                <div
                  className={`rounded-2xl p-4 text-xs flex items-start gap-3 transition-colors ${
                    trapDiffAed > 0
                      ? "bg-emerald-500/15 border border-emerald-400/30 text-emerald-100"
                      : "bg-amber-500/15 border border-amber-400/30 text-amber-100"
                  }`}
                >
                  {trapDiffAed > 0 ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-relaxed">
                    {trapDiffAed > 0 ? (
                      <>
                        <strong className="text-white">Trap Exposed:</strong> The &ldquo;cheaper&rdquo;
                        US quote actually costs{" "}
                        <span className="font-mono font-bold text-emerald-300">
                          {formatAED(trapDiffAed)} MORE
                        </span>{" "}
                        and leaves your buyer with zero local warranty if a card fails.
                      </>
                    ) : (
                      <>
                        <strong className="text-white">Without Salemate&apos;s checks:</strong> The
                        risky quote looks{" "}
                        <span className="font-mono font-bold text-amber-300">
                          {formatAED(Math.abs(trapDiffAed))}
                        </span>{" "}
                        cheaper on paper—leading traders straight into customs bills and lost profit.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            ARCHITECTURAL METRICS RIBBON
           ===================================================================== */}
        <section className="bg-surface border-b border-slate-900/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="font-serif text-4xl sm:text-5xl text-slate-900 leading-none">
                &lt;60<span className="italic text-indigo-700">s</span>
              </p>
              <p className="text-xs text-slate-600 pt-1">
                To reply to after-hours buyers (down from 24 hours)
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-4xl sm:text-5xl text-slate-900 leading-none">
                90m <span className="italic text-emerald-700">→ 3m</span>
              </p>
              <p className="text-xs text-slate-600 pt-1">
                Active manual quoting work saved per complex deal
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-4xl sm:text-5xl text-slate-900 leading-none">
                3.6725
              </p>
              <p className="text-xs text-slate-600 pt-1">
                Exact UAE AED peg &amp; 5% VAT math—never AI guesses
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-4xl sm:text-5xl text-slate-900 leading-none">
                Zero <span className="italic text-slate-500">leaks</span>
              </p>
              <p className="text-xs text-slate-600 pt-1">
                Your customer&apos;s identity stays hidden on every supplier order
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================================
            CHAPTER I — FINE-ART GPU STORYTELLING (BEFORE VS. AFTER)
           ===================================================================== */}
        <section id="story" className="editorial-grain py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Fine-Art Editorial Sculpture Image */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl overflow-hidden bg-stone border border-slate-900/10 shadow-xl">
                <img
                  src="/gpu-sculpture.jpg"
                  alt="Editorial sculptural still life of AI compute GPU hardware"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
                <span>CASE STUDY 01 · GPU TRADING</span>
                <span>8× NVIDIA H100 · AED 978K ORDER</span>
              </div>
            </div>

            {/* Right Interactive Before / After Story */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-700">
                  Why We Use GPU Trading As Our Example
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-[-0.025em] leading-tight mt-2">
                  One Friday night trade shows{" "}
                  <span className="font-serif italic font-normal text-indigo-800">
                    everything broken
                  </span>{" "}
                  in manual B2B trading.
                </h2>
              </div>

              {/* Clean Editorial Toggle Pill */}
              <div className="inline-flex p-1 rounded-full bg-stone border border-slate-900/10 text-xs">
                <button
                  onClick={() => setStoryMode("without")}
                  className={`px-5 py-2 rounded-full font-semibold transition ${
                    storyMode === "without"
                      ? "bg-obsidian text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  The Old Way
                </button>
                <button
                  onClick={() => setStoryMode("with")}
                  className={`px-5 py-2 rounded-full font-semibold transition ${
                    storyMode === "with"
                      ? "bg-obsidian text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  With Salemate
                </button>
              </div>

              <div className="bg-surface rounded-2xl border border-slate-900/10 p-6 sm:p-7 shadow-sm space-y-5">
                <div>
                  <p
                    className={`font-mono text-[11px] font-bold uppercase tracking-wider ${
                      storyMode === "with" ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {activeStory.eyebrow}
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{activeStory.headline}</h3>
                </div>

                <div className="divide-y divide-slate-900/10">
                  {activeStory.steps.map((s) => (
                    <div key={s.title} className="py-4 first:pt-1 last:pb-0 flex gap-5">
                      <span className="font-mono text-xs font-semibold text-slate-400 w-20 shrink-0 pt-0.5">
                        {s.time}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{s.title}</p>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            CHAPTER II — THE SERVICE WE SELL (ARCHITECTURAL MAGAZINE LIST)
           ===================================================================== */}
        <section id="service" className="bg-surface border-y border-slate-900/10 py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-700">
                  The Service We Provide
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-[-0.025em] mt-2">
                  An AI trading desk working quietly{" "}
                  <span className="font-serif italic font-normal text-indigo-800">
                    behind your brand
                  </span>
                  .
                </h2>
              </div>
              <p className="text-sm text-slate-600 max-w-md leading-relaxed">
                Five coordinated steps handle the slow, error-prone work so a 5-person trading team
                operates with the speed and accuracy of a 50-person enterprise desk.
              </p>
            </div>

            <div className="divide-y divide-slate-900/10 border-t border-b border-slate-900/10">
              {PLAIN_STEPS.map((step) => (
                <div
                  key={step.num}
                  className="py-6 sm:py-7 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline hover:bg-canvas/70 transition px-3 -mx-3 rounded-xl"
                >
                  <div className="md:col-span-2 flex items-baseline gap-3">
                    <span className="font-serif text-4xl text-slate-900 leading-none">
                      {step.num}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-700 font-semibold">
                      {step.label}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            CHAPTER II-B — EVERY WORKSPACE TOOL POINTED OUT & EXPLAINED SEPARATELY
           ===================================================================== */}
        <WorkspaceToolsGuide />

        {/* =====================================================================
            CHAPTER III — STUDIO-FRAMED LIVE INTERACTIVE SALEMATE PREVIEW
           ===================================================================== */}
        <section id="live-preview" className="editorial-grain py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-700">
                  Interactive Product Preview
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-[-0.025em] mt-2">
                  Step inside{" "}
                  <span className="font-serif italic font-normal text-indigo-800">Salemate</span> on
                  a live GPU trade.
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Click through the real workspace below—pre-loaded with our{" "}
                  <strong>8x NVIDIA H100 AI GPU</strong> trade. Inspect the 3 suppliers, open the
                  Morning Batch Sweep, or review the 4-stage paperwork suite.
                </p>
              </div>
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-obsidian hover:bg-slate-800 text-white text-xs font-bold transition shadow-md"
              >
                Open Full-Screen Workspace
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Anodized Studio Display Frame around the Embedded App */}
            <div className="rounded-[26px] bg-obsidian p-2.5 sm:p-3.5 shadow-2xl ring-1 ring-slate-900/15">
              <div className="flex items-center justify-between px-3 pb-2.5 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="ml-2 text-slate-300">salemate.app/workspace</span>
                </div>
                <span className="hidden sm:inline text-emerald-400">
                  Interactive Demo · Click Any Control
                </span>
              </div>
              <SalematePreviewOS embedded />
            </div>
          </div>
        </section>

        {/* =====================================================================
            CHAPTER IV — TWO UNBREAKABLE PROMISES + CINEMATIC CLOSING BAND
           ===================================================================== */}
        <section id="promises" className="relative overflow-hidden bg-obsidian text-white py-20 lg:py-28">
          {/* Mirrored Glass Ribbon Atmospheric Backdrop */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <img
              src="/hero-ribbon.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-left opacity-35 scale-x-[-1]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/80 to-obsidian" />
          </div>

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 space-y-20">
            {/* Two Unbreakable Promises */}
            <div className="space-y-10">
              <div className="max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sky-300">
                  Built for Real-World Trust
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] mt-2">
                  Two{" "}
                  <span className="font-serif italic font-normal text-sky-300">unbreakable</span>{" "}
                  promises behind every deal.
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="obsidian-glass rounded-2xl p-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <FileCheck2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">
                      You always hold the final send button
                    </h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Salemate prepares quotes, checks traps, and builds invoices in seconds—but it{" "}
                    <strong className="text-white">never sends anything automatically</strong>. Only
                    after you click Approve does your buyer receive a clean Smart Deal Room link.
                  </p>
                  <Link
                    href="/deal/DEAL-2026-884"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 hover:text-sky-200 transition pt-1"
                  >
                    Preview the Buyer Smart Deal Room
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="obsidian-glass rounded-2xl p-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <EyeOff className="w-5 h-5 text-rose-400" />
                    <h3 className="text-lg font-bold text-white">
                      Suppliers can never steal your customer
                    </h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Every back-to-back order sent to your supplier automatically blacks out your
                    end-buyer&apos;s name, email, and company details and routes goods straight to
                    your Dubai hub.
                  </p>
                  <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-[11px] space-y-1">
                    <p className="text-emerald-400">SUPPLIER ORDER · PO-SUP-2026-884</p>
                    <p className="text-rose-300">End Buyer: [HIDDEN BY SALEMATE]</p>
                    <p className="text-rose-300">Buyer Contact: [HIDDEN BY SALEMATE]</p>
                    <p className="text-slate-300">Deliver To: Your Consolidation Bay, Dubai</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pilot Walkthrough Card */}
            <div
              id="pilot"
              className="rounded-3xl bg-canvas text-slate-900 p-8 sm:p-12 grid lg:grid-cols-12 gap-8 items-center shadow-2xl"
            >
              <div className="lg:col-span-7 space-y-3">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-700">
                  UAE Design Partner Pilot
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-slate-900 leading-tight">
                  Bring one real trade—watch{" "}
                  <span className="font-serif italic font-normal text-indigo-800">Salemate</span>{" "}
                  quote it in 60 seconds.
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                  We&apos;re onboarding early UAE trading teams—starting with GPU and enterprise
                  hardware desks—who want faster responses, zero hidden supplier traps, and cleaner
                  margins.
                </p>
              </div>

              <div className="lg:col-span-5">
                {pilotSubmitted ? (
                  <div className="bg-surface border border-emerald-200 rounded-2xl p-6 space-y-2 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>You&apos;re on the Pilot List</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      We recorded <span className="font-mono text-slate-900">{pilotEmail}</span>
                      {pilotCompany ? ` (${pilotCompany})` : ""} and will reach out shortly to book
                      your 15-minute live walkthrough.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handlePilotSubmit}
                    className="bg-surface border border-slate-900/10 rounded-2xl p-6 space-y-3.5 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Building2 className="w-4 h-4 text-indigo-700" />
                      <span>Request Early Access</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Your Trading Company"
                      value={pilotCompany}
                      onChange={(e) => setPilotCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Work Email (you@company.ae)"
                      value={pilotEmail}
                      onChange={(e) => setPilotEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-mono border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                    />
                    <button
                      id="request-pilot-btn"
                      type="submit"
                      className="w-full py-3 rounded-xl bg-obsidian hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
                    >
                      Book 15-Minute Walkthrough
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          MINIMAL EDITORIAL FOOTER
         ===================================================================== */}
      <footer className="bg-obsidian text-slate-400 border-t border-white/10 py-9">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3.5">
            <SalemateLogo variant="dark" size="sm" />
            <span className="hidden sm:inline border-l border-white/15 pl-3.5 text-slate-400">
              AI Sales &amp; Trading Operations Service · Built in the UAE
            </span>
          </div>
          <div className="flex items-center gap-6 font-medium text-slate-300">
            <Link href="/workspace" className="hover:text-white transition">
              Full Workspace
            </Link>
            <Link href="/deal/DEAL-2026-884" className="hover:text-white transition">
              Buyer View
            </Link>
            <Link href="/seller" className="hover:text-white transition">
              Seller View
            </Link>
            <span className="font-mono text-slate-500">1 USD = 3.6725 AED · 5% UAE VAT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

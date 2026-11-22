"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Linkedin,
  Clock,
} from "lucide-react";
import {
  INITIAL_DEALS,
  USD_TO_AED,
  calculateQuoteFinancials,
  formatAED,
  round2,
} from "@/lib/store";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { FOUNDERS } from "@/lib/founders";
import HoverChatSteps from "@/components/HoverChatSteps";

const VISUAL_PORTALS = [
  {
    href: "/gpu-example",
    tag: "01 · Real-World Case Study",
    title: "The Friday Night GPU Trade",
    subtitle: "Watch 8× NVIDIA H100 GPUs turn from a midnight trap into a 41-second win.",
    image: "/gpu-sculpture.jpg",
    alt: "Fine-art sculptural GPU hardware blades on limestone",
  },
  {
    href: "/tools",
    tag: "02 · Interactive Screen Map",
    title: "Inside the 8 Workspace Tools",
    subtitle: "Hover or tap every tool on the desk to see how Salemate protects your margin.",
    image: "/trading-monolith.jpg",
    alt: "Translucent smoked glass and brushed titanium trading control monolith",
  },
  {
    href: "/protection",
    tag: "03 · Zero-Leakage Architecture",
    title: "Buyer View vs. Seller View",
    subtitle: "Your customer gets live WhatsApp/Email chat—your supplier never sees their name.",
    image: "/vault-shield.jpg",
    alt: "Frosted obsidian slabs protecting a glowing crystalline core",
  },
  {
    href: "/login",
    tag: "04 · Private Company Desk",
    title: "Login & Try the Workspace",
    subtitle: "Sign in as a UAE trading company (1 user = 1 company) to run your private trading OS.",
    image: "/connector-prism.jpg",
    alt: "Emerald and sapphire light beams converging through an optical crystal prism",
  },
];

export default function SalemateLanding() {
  const gpuDeal = INITIAL_DEALS[0];
  const safeQuote = gpuDeal.supplierQuotes[0];
  const riskyQuote = gpuDeal.supplierQuotes[1];

  const [auditHiddenParts, setAuditHiddenParts] = useState(true);
  const [auditImportTax, setAuditImportTax] = useState(true);

  const [pilotEmail, setPilotEmail] = useState("");
  const [pilotSubmitted, setPilotSubmitted] = useState(false);

  const safeFin = calculateQuoteFinancials(safeQuote, gpuDeal.quantity, 12, []);
  const riskyBomIds = auditHiddenParts ? riskyQuote.missingBomItems.map((b) => b.id) : [];
  const riskyAdjusted = auditImportTax ? riskyQuote : { ...riskyQuote, incoterms: "DDP" };
  const riskyFin = calculateQuoteFinancials(riskyAdjusted, gpuDeal.quantity, 12, riskyBomIds);
  const trapDiffAed = round2(riskyFin.totalLandedCostAed - safeFin.totalLandedCostAed);

  const barScaleMax = 865000;
  const safeBarPct = Math.min(100, Math.round((safeFin.totalLandedCostAed / barScaleMax) * 100));
  const riskyBarPct = Math.min(100, Math.round((riskyFin.totalLandedCostAed / barScaleMax) * 100));

  function handlePilotSubmit(e) {
    e.preventDefault();
    if (!pilotEmail.trim()) return;
    setPilotSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <SiteHeader />

      <main className="flex-1 overflow-x-clip">
        {/* =====================================================================
            1. CINEMATIC HERO — CLEAN, VISUAL-FIRST, ZERO CLUTTER
           ===================================================================== */}
        <section className="relative overflow-hidden bg-[#060510] text-white">
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <img
              src="/hero-ribbon.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-right opacity-80 animate-ribbon"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060510] via-[#060510]/85 to-[#060510]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060510] via-transparent to-[#060510]/45" />
          </div>

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-sky-300">
                AI Trading Operations Service · UAE
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.65rem] font-bold tracking-[-0.03em] leading-[1.06]">
                Quote high value trades{" "}
                <span className="font-serif italic font-normal text-sky-300 tracking-normal">
                  in sixty seconds
                </span>
                , never lose profit to hidden traps.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-lg">
                We don&apos;t sell hardware—we run the AI back-office for trading desks that do.
                Instant WhatsApp &amp; Email quotes, hidden supplier trap checks, and zero customer
                leaks.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#060510] hover:bg-slate-100 text-sm font-bold transition shadow-lg"
                >
                  Login &amp; Try Workspace
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/gpu-example"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition"
                >
                  See GPU Case Study
                </Link>
              </div>
            </div>

            {/* Right Interactive Visual GPU Proof */}
            <div className="lg:col-span-6">
              <div className="obsidian-glass rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
                <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-white/10">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-300">
                      Live Proof · 8× NVIDIA H100 GPUs
                    </p>
                    <h2 className="text-lg font-semibold text-white mt-0.5">
                      Paper price vs.{" "}
                      <span className="font-serif italic font-normal text-slate-200">
                        true UAE cost
                      </span>
                    </h2>
                  </div>
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-slate-200 shrink-0">
                    {USD_TO_AED} AED
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
                  <label className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={auditHiddenParts}
                      onChange={(e) => setAuditHiddenParts(e.target.checked)}
                      className="rounded border-white/30 text-sky-400 focus:ring-sky-400"
                    />
                    <span className="text-slate-200 font-medium">Missing cables &amp; cooling</span>
                  </label>
                  <label className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={auditImportTax}
                      onChange={(e) => setAuditImportTax(e.target.checked)}
                      className="rounded border-white/30 text-sky-400 focus:ring-sky-400"
                    />
                    <span className="text-slate-200 font-medium">5% UAE import tax</span>
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white">
                        Overseas Broker{" "}
                        <span className="font-mono text-[10px] text-rose-300 ml-1">
                          No UAE Warranty
                        </span>
                      </span>
                      <span className="font-mono tabular-nums font-bold text-white">
                        {formatAED(riskyFin.totalLandedCostAed)}
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        style={{ width: `${riskyBarPct}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          trapDiffAed > 0
                            ? "bg-gradient-to-r from-amber-400 via-rose-500 to-rose-400"
                            : "bg-slate-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white">
                        Dubai Official Stock{" "}
                        <span className="font-mono text-[10px] text-emerald-300 ml-1">
                          3Y UAE Warranty
                        </span>
                      </span>
                      <span className="font-mono tabular-nums font-bold text-emerald-300">
                        {formatAED(safeFin.totalLandedCostAed)}
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        style={{ width: `${safeBarPct}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-3.5 text-xs flex items-start gap-2.5 ${
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
                        The &ldquo;cheaper&rdquo; overseas quote actually costs{" "}
                        <strong className="font-mono text-emerald-300">
                          {formatAED(trapDiffAed)} MORE
                        </strong>{" "}
                        and gives zero local warranty.
                      </>
                    ) : (
                      <>
                        Without Salemate, the trap looks{" "}
                        <strong className="font-mono text-amber-300">
                          {formatAED(Math.abs(trapDiffAed))}
                        </strong>{" "}
                        cheaper on paper.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            2. SIMPLE 5-STEP STRIP — SMOOTH IN-FLOW CHATBOX ON HOVER / TOUCH
           ===================================================================== */}
        <section className="bg-surface border-b border-slate-900/10 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-[-0.025em]">
                  How Salemate works in{" "}
                  <span className="font-serif italic font-normal text-indigo-800">five steps</span>.
                </h2>
              </div>
              <Link
                href="/service"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:underline"
              >
                Explore Our Service
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <HoverChatSteps theme="light" />
          </div>
        </section>

        {/* =====================================================================
            3. VISUAL GALLERY — EXPLORE EACH DEDICATED PAGE
           ===================================================================== */}
        <section className="editorial-grain py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-700">
                  Explore Salemate
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-[-0.025em] mt-1">
                  Built to see,{" "}
                  <span className="font-serif italic font-normal text-indigo-800">not scroll</span>.
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Link
                  href="/deal/DEAL-2026-884"
                  className="px-4 py-2 rounded-full bg-surface border border-slate-900/15 hover:border-[#060510] font-semibold text-slate-800 transition"
                >
                  Buyer Chat View
                </Link>
                <Link
                  href="/seller"
                  className="px-4 py-2 rounded-full bg-surface border border-slate-900/15 hover:border-[#060510] font-semibold text-slate-800 transition"
                >
                  Seller Payout View
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {VISUAL_PORTALS.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group relative rounded-3xl overflow-hidden bg-[#060510] text-white aspect-[16/10] shadow-xl border border-slate-900/10 flex flex-col justify-end p-6 sm:p-8"
                >
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060510] via-[#060510]/55 to-[#060510]/10" />

                  <div className="relative space-y-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-300">
                      {card.tag}
                    </p>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight text-white">
                          {card.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-md leading-relaxed">
                          {card.subtitle}
                        </p>
                      </div>
                      <span className="w-10 h-10 rounded-full bg-white text-[#060510] flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shadow-md">
                        <ArrowUpRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            4. ABOUT THIS PROJECT & BUILDERS (LINKEDIN PROFILES)
           ===================================================================== */}
        <section className="bg-surface border-t border-slate-900/10 py-14">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-indigo-700 font-bold">
                <Clock className="w-3.5 h-3.5" />
                This product was developed in 8 hr long tech sprint
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Built with love for UAE trading teams —{" "}
                <Link href="/about" className="font-serif italic font-normal text-indigo-800 hover:underline">
                  About Us &amp; This Project
                </Link>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {FOUNDERS.map((f) => (
                <a
                  key={f.name}
                  href={f.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-sm"
                >
                  <Linkedin className="w-4 h-4" />
                  {f.name}
                </a>
              ))}
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition"
              >
                Read Story →
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================================
            5. COMPACT VISUAL PILOT INVITE BAR
           ===================================================================== */}
        <section className="bg-[#060510] text-white py-14 border-t border-white/10">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-300">
                UAE Founder Pilot
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Bring one real GPU trade—watch{" "}
                <span className="font-serif italic font-normal text-sky-300">Salemate</span> run it.
              </h2>
            </div>

            {pilotSubmitted ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-semibold text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Reserved for {pilotEmail}
              </div>
            ) : (
              <form onSubmit={handlePilotSubmit} className="flex w-full md:w-auto gap-2">
                <div className="relative flex-1 md:w-64">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={pilotEmail}
                    onChange={(e) => setPilotEmail(e.target.value)}
                    placeholder="you@company.ae"
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-full bg-white text-[#060510] hover:bg-slate-100 text-xs font-bold shrink-0 transition cursor-pointer"
                >
                  Book Pilot
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

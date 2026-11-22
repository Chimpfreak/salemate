"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  Target,
  ShieldAlert,
  SlidersHorizontal,
  MessageSquareQuote,
  FileCheck2,
  ListChecks,
  Activity,
  ArrowDown,
  ArrowUpRight,
  MapPin,
} from "lucide-react";

const WORKSPACE_TOOLS = [
  {
    id: "anchor-quote",
    num: "01",
    name: "60-Second Anchor Quote",
    where: "Top Emerald Banner inside each deal",
    icon: Zap,
    accent: "emerald",
    plainEnglish:
      "Drafts a fast, profit-safe ballpark price in under 60 seconds using live UAE stock feeds—so buyers get an immediate answer even on Friday nights or weekends.",
    gpuExample:
      "When Gulf Horizon WhatsApps at 11:42 PM for 8 NVIDIA H100 GPUs, Salemate builds an AED 918,400 ballpark in 41 seconds so the buyer doesn't call a rival.",
    whyItMatters:
      "Keeps urgent buyers engaged while your team negotiates final supplier rebates in the background.",
  },
  {
    id: "buyer-score",
    num: "02",
    name: "Buyer Intent Score & Spec Lock",
    where: "Step 1 Panel · Inquiry & Verified Spec",
    icon: Target,
    accent: "sky",
    plainEnglish:
      "Reads chaotic WhatsApp messages and emails, turns them into a verified checklist, and scores from 0–100 whether the buyer is serious or just fishing for free prices.",
    gpuExample:
      "Scores the H100 buyer 95/100 (repeat client, approved budget, Monday deadline) to unlock full sourcing—while vague price-check texts are routed to a 10-second ballpark.",
    whyItMatters:
      "Stops your sales team from burning hours chasing suppliers for low-intent window shoppers.",
  },
  {
    id: "trap-detector",
    num: "03",
    name: "Supplier Audit & Trap Detector",
    where: "Step 3 Table · Supplier Comparison Rows",
    icon: ShieldAlert,
    accent: "rose",
    plainEnglish:
      "Lines up every supplier quote side-by-side and automatically flags missing parts, grey-market warranties invalid in the UAE, 5% import taxes, and suspicious bank-account changes.",
    gpuExample:
      "Catches the overseas GPU broker who looks $1,700/card cheaper on paper—exposing missing 16-pin power cables, cooling kits, zero local warranty, and a sudden new bank IBAN.",
    whyItMatters:
      "Prevents a single sneaky broker quote from wiping out your profit or causing an angry client return.",
  },
  {
    id: "profit-calculator",
    num: "04",
    name: "Exact AED Profit & VAT Engine",
    where: "Step 3 Table · Margin & Duty Sliders",
    icon: SlidersHorizontal,
    accent: "indigo",
    plainEnglish:
      "Slide your target profit percentage and duty rate—every dirham conversion (fixed 3.6725 AED/USD peg), 5% UAE import tax, and 5% VAT total recalculates using exact code math, never AI guesswork.",
    gpuExample:
      "Switch between Standard (12% margin) and 48-Hour Fast-Close (8.5% margin) on the H100 deal to see your exact net dirham profit down to the last AED.",
    whyItMatters:
      "Eliminates Excel formula mistakes and protects your minimum profit floor on every trade.",
  },
  {
    id: "negotiation-copilot",
    num: "05",
    name: "Negotiation Copilot",
    where: "Supplier Row · 'Negotiation Copilot' Button",
    icon: MessageSquareQuote,
    accent: "amber",
    plainEnglish:
      "Writes ready-to-copy WhatsApp and email messages to ask suppliers for better pricing—and helps you explain calmly to buyers why official local stock beats risky grey-market quotes.",
    gpuExample:
      "Generates a one-click reply showing the buyer why Dubai sealed GPUs with 3-year UAE warranty save them from AED 24,668 in hidden customs bills and missing cables.",
    whyItMatters:
      "Turns even junior staff into sharp, data-backed negotiators in one click.",
  },
  {
    id: "four-doc-suite",
    num: "06",
    name: "4-Stage Paperwork Suite",
    where: "Supplier Row · 'Approve & 4-Doc Suite'",
    icon: FileCheck2,
    accent: "emerald",
    plainEnglish:
      "Generates all four trade documents automatically: (1) Customer Quote, (2) 3-Way Order Check, (3) Client-Hidden Supplier PO, and (4) 5% UAE VAT Tax Invoice—and waits for your click before sending.",
    gpuExample:
      "Stamps your company name & UAE TRN on the buyer's invoice while blacking out the buyer's name on the supplier PO so distributors can never bypass you.",
    whyItMatters:
      "Shrinks 90 minutes of manual document copy-pasting down to 3 minutes with zero customer leaks.",
  },
  {
    id: "batch-sweep",
    num: "07",
    name: "Morning Batch Sweep",
    where: "Top Bar · Amber 'Morning Batch Sweep' Button",
    icon: ListChecks,
    accent: "amber",
    plainEnglish:
      "Collects all pre-verified, low-risk repeat-buyer requests that arrived overnight or on the weekend into one simple morning checklist you can approve in a single click.",
    gpuExample:
      "Clear 5 routine morning GPU & hardware orders at 8:00 AM in 10 seconds instead of spending your whole morning typing individual replies.",
    whyItMatters:
      "Lets a 5-person trading desk clear the daily volume of a 50-person team.",
  },
  {
    id: "deal-memory",
    num: "08",
    name: "Buyer Tracker & Deal Memory",
    where: "Bottom Live Feed + Top Bar 'Deal Memory'",
    icon: Activity,
    accent: "sky",
    plainEnglish:
      "Shows the moment a buyer opens your Smart Deal Room link or forwards it to their CFO (UAE privacy-safe), while privately remembering which suppliers delivered on time vs. who caused trouble.",
    gpuExample:
      "Alerts you when the AI lab's CFO reviews your H100 quote (+18 Buying Score) and permanently lowers untrustworthy brokers' scores inside your company's private memory.",
    whyItMatters:
      "Tells you the exact minute to follow up and close—while making your company smarter after every trade.",
  },
];

export default function WorkspaceToolsGuide() {
  const [activeId, setActiveId] = useState(WORKSPACE_TOOLS[0].id);
  const activeTool = WORKSPACE_TOOLS.find((t) => t.id === activeId) || WORKSPACE_TOOLS[0];
  const ActiveIcon = activeTool.icon;

  return (
    <section id="tools" className="bg-surface border-b border-slate-900/10 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-12">
        {/* Section Intro */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-700">
              Inside Your Company Workspace · Tool-by-Tool Guide
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-[-0.025em] leading-tight mt-2">
              Every tool on the screen,{" "}
              <span className="font-serif italic font-normal text-indigo-800">
                pointed out &amp; explained
              </span>{" "}
              in plain English.
            </h2>
            <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
              Before you test the live interactive workspace below, here is what every button and
              panel actually does—shown on a real GPU trade so nothing feels technical or confusing.
            </p>
          </div>
          <a
            href="#live-preview"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-obsidian hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            Jump to Live Workspace Below
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* INTERACTIVE VISUAL WORKSPACE MAP (LEFT) + SPOTLIGHT EXPLAINER (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Annotated Workspace Blueprint */}
          <div className="lg:col-span-7 rounded-3xl bg-obsidian text-white p-5 sm:p-6 shadow-2xl border border-white/10 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-3 border-b border-white/10">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                WORKSPACE SCREEN MAP — CLICK ANY NUMBER TO INSPECT
              </span>
              <span className="text-slate-500 hidden sm:inline">8 Tools</span>
            </div>

            {/* Miniature Spatial Representation of the Real Salemate Screen */}
            <div className="space-y-3 text-xs">
              {/* Zone 1: Top Header Bar (Tools 07 & 08) */}
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Top Bar · Company Controls
                </span>
                <div className="flex flex-wrap gap-2">
                  {["batch-sweep", "deal-memory"].map((tid) => {
                    const t = WORKSPACE_TOOLS.find((x) => x.id === tid);
                    const sel = activeId === tid;
                    return (
                      <button
                        key={tid}
                        type="button"
                        onClick={() => setActiveId(tid)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold text-[11px] transition cursor-pointer ${
                          sel
                            ? "bg-white text-obsidian shadow-sm"
                            : "bg-white/10 text-slate-200 hover:bg-white/20"
                        }`}
                      >
                        <span className="font-mono font-bold text-sky-500">{t.num}</span>
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Zone 2: 60-Second Anchor Quote Strip (Tool 01) */}
              <button
                type="button"
                onClick={() => setActiveId("anchor-quote")}
                className={`w-full text-left rounded-xl p-3.5 border transition cursor-pointer flex items-center justify-between gap-3 ${
                  activeId === "anchor-quote"
                    ? "bg-emerald-500/20 border-emerald-400 text-white"
                    : "bg-white/[0.04] border-white/10 text-slate-200 hover:bg-white/[0.08]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-500 text-obsidian font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                    01
                  </span>
                  <div>
                    <p className="font-bold text-xs">60-Second Anchor Quote Banner</p>
                    <p className="text-[11px] text-slate-400">
                      Instant ballpark price drafted from live UAE stock while you negotiate
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-emerald-300 shrink-0 hidden sm:inline">
                  41s Reply
                </span>
              </button>

              {/* Zone 3: Middle Split — Buyer Score (02) + Decision Table (03, 04, 05, 06) */}
              <div className="grid sm:grid-cols-12 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveId("buyer-score")}
                  className={`sm:col-span-5 text-left rounded-xl p-3.5 border transition cursor-pointer flex flex-col justify-between gap-2 ${
                    activeId === "buyer-score"
                      ? "bg-sky-500/20 border-sky-400 text-white"
                      : "bg-white/[0.04] border-white/10 text-slate-200 hover:bg-white/[0.08]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-sky-400 text-obsidian font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                      02
                    </span>
                    <p className="font-bold text-xs leading-tight">
                      Buyer Intent Score &amp; Spec Lock
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Reads messy WhatsApp requests &amp; filters serious buyers (95/100) from
                    time-wasters.
                  </p>
                </button>

                <div className="sm:col-span-7 rounded-xl bg-white/[0.04] border border-white/10 p-3.5 space-y-2.5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Main Trader Decision Table
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "trap-detector", badgeColor: "bg-rose-400" },
                      { id: "profit-calculator", badgeColor: "bg-indigo-400" },
                      { id: "negotiation-copilot", badgeColor: "bg-amber-400" },
                      { id: "four-doc-suite", badgeColor: "bg-emerald-400" },
                    ].map(({ id, badgeColor }) => {
                      const t = WORKSPACE_TOOLS.find((x) => x.id === id);
                      const sel = activeId === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setActiveId(id)}
                          className={`text-left p-2.5 rounded-lg border transition cursor-pointer flex items-start gap-2 ${
                            sel
                              ? "bg-white text-obsidian border-white shadow-sm"
                              : "bg-white/[0.05] text-slate-200 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full ${badgeColor} text-obsidian font-mono text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5`}
                          >
                            {t.num}
                          </span>
                          <span className="text-[11px] font-bold leading-snug">{t.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Zone 4: Bottom Live Feed */}
              <button
                type="button"
                onClick={() => setActiveId("deal-memory")}
                className={`w-full text-left rounded-xl p-3 border transition cursor-pointer flex items-center justify-between gap-3 ${
                  activeId === "deal-memory"
                    ? "bg-sky-500/20 border-sky-400 text-white"
                    : "bg-white/[0.04] border-white/10 text-slate-200 hover:bg-white/[0.08]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-sky-400 text-obsidian font-mono text-[10px] font-extrabold flex items-center justify-center shrink-0">
                    08
                  </span>
                  <span className="text-xs font-semibold">
                    Live Buyer Activity Feed &amp; Private Deal Memory
                  </span>
                </div>
                <span className="font-mono text-[10px] text-sky-300 hidden sm:inline">
                  CFO Forward Alerts
                </span>
              </button>
            </div>
          </div>

          {/* Right Focused Spotlight Explainer Card */}
          <div className="lg:col-span-5 rounded-3xl bg-canvas border border-slate-900/10 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 font-mono text-xs font-bold text-indigo-700">
                  <span className="w-7 h-7 rounded-full bg-obsidian text-white flex items-center justify-center text-[11px]">
                    {activeTool.num}
                  </span>
                  TOOL {activeTool.num} OF 08
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-surface px-2.5 py-1 rounded-full border border-slate-900/10">
                  <MapPin className="w-3 h-3 text-indigo-600" />
                  {activeTool.where}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-xl bg-obsidian text-white flex items-center justify-center shrink-0">
                  <ActiveIcon className="w-5 h-5 text-sky-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {activeTool.name}
                </h3>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    What it does (Plain English)
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed mt-1">
                    {activeTool.plainEnglish}
                  </p>
                </div>

                <div className="rounded-2xl bg-surface border border-slate-900/10 p-4">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    On Our GPU Trade Example (8× NVIDIA H100)
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed mt-1">
                    {activeTool.gpuExample}
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-3.5">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Why It Matters
                  </p>
                  <p className="text-xs font-semibold text-emerald-950 leading-relaxed mt-0.5">
                    {activeTool.whyItMatters}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-900/10 text-xs">
              <a
                href="#live-preview"
                className="font-bold text-indigo-700 hover:underline inline-flex items-center gap-1"
              >
                Try Tool {activeTool.num} in Live Preview ↓
              </a>
              <Link
                href="/login"
                className="font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
              >
                Open Company Desk
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ALL 8 TOOLS EXPLAINED SEPARATELY — CLEAN 2-COLUMN EDITORIAL GRID */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              All 8 Workspace Tools Explained Separately
            </p>
            <p className="text-xs text-slate-500 hidden sm:block">
              Click any card to pinpoint where it sits on the screen map above
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WORKSPACE_TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isSelected = activeId === tool.id;
              return (
                <button
                  key={tool.id}
                  id={`tool-guide-${tool.id}`}
                  type="button"
                  onClick={() => setActiveId(tool.id)}
                  className={`text-left rounded-2xl p-6 border transition cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? "bg-canvas border-obsidian ring-1 ring-obsidian shadow-md"
                      : "bg-canvas/55 border-slate-900/10 hover:bg-canvas hover:border-slate-900/25"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-3xl leading-none text-slate-900">
                          {tool.num}
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{tool.name}</h3>
                          <p className="font-mono text-[10px] text-indigo-700 mt-0.5">
                            Where to find it: {tool.where}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-obsidian text-sky-300"
                            : "bg-surface border border-slate-900/10 text-slate-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {tool.plainEnglish}
                    </p>

                    <div className="rounded-xl bg-surface border border-slate-900/10 p-3 text-xs text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-900">GPU Example: </span>
                      {tool.gpuExample}
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-emerald-800 pt-2 border-t border-slate-900/10">
                    → {tool.whyItMatters}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

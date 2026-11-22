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
  MessageCircle,
  ArrowRight,
  MapPin,
  X,
} from "lucide-react";

const WORKSPACE_TOOLS = [
  {
    id: "anchor-quote",
    num: "01",
    name: "60-Second Anchor Quote",
    where: "Top Banner",
    icon: Zap,
    plainEnglish:
      "Drafts a fast, profit-safe ballpark price in under 60 seconds using live UAE stock feeds—so buyers get an immediate answer even on Friday nights or weekends.",
    gpuExample:
      "Builds an AED 918,400 H100 ballpark in 41 seconds while you negotiate supplier rebates.",
  },
  {
    id: "buyer-score",
    num: "02",
    name: "Buyer Intent Score",
    where: "Step 1 Panel",
    icon: Target,
    plainEnglish:
      "Reads chaotic WhatsApp and email messages, locks the spec checklist, and scores from 0–100 whether the buyer is serious or just fishing for free prices.",
    gpuExample:
      "Scores Gulf Horizon 95/100 to unlock full sourcing; routes vague price checks to a 10s ballpark.",
  },
  {
    id: "trap-detector",
    num: "03",
    name: "Supplier Trap Detector",
    where: "Decision Table",
    icon: ShieldAlert,
    plainEnglish:
      "Compares every supplier quote side-by-side and flags missing cables, grey-market warranties invalid in the UAE, 5% import taxes, and sudden bank IBAN switches.",
    gpuExample:
      "Exposes $1,150/GPU missing cables & cooling + 5% duty on the Miami broker (AED 24,668 trap).",
  },
  {
    id: "profit-calculator",
    num: "04",
    name: "Exact AED Profit Engine",
    where: "Margin Sliders",
    icon: SlidersHorizontal,
    plainEnglish:
      "Slide your target margin and duty rate—every 3.6725 AED conversion, 5% customs fee, and 5% UAE VAT total recalculates using exact code math, never AI guesses.",
    gpuExample:
      "Toggle between Standard (12%) and 48h Fast-Close (8.5%) to inspect exact net dirham profit.",
  },
  {
    id: "negotiation-copilot",
    num: "05",
    name: "Negotiation Copilot",
    where: "Supplier Row Button",
    icon: MessageSquareQuote,
    plainEnglish:
      "Writes ready-to-copy WhatsApp & email scripts to ask suppliers for rebates and calmly show buyers why verified UAE stock beats risky overseas brokers.",
    gpuExample:
      "One-click reply explaining why official 3-Year UAE H100 warranty saves AED 24,668+ in risk.",
  },
  {
    id: "four-doc-suite",
    num: "06",
    name: "4-Stage Paperwork Suite",
    where: "'Approve & 4-Doc Suite'",
    icon: FileCheck2,
    plainEnglish:
      "Auto-builds Customer Quote, 3-Way Order Check, Client-Hidden Supplier PO, and 5% UAE VAT Invoice—and waits for your click before sending anything.",
    gpuExample:
      "Stamps your company TRN on the invoice while hiding the buyer's name from the distributor.",
  },
  {
    id: "batch-sweep",
    num: "07",
    name: "Morning Batch Sweep",
    where: "Top Bar · Amber Button",
    icon: ListChecks,
    plainEnglish:
      "Bundles all verified overnight repeat-buyer deals into one clean 8:00 AM checklist so you can approve and dispatch them all in a single click.",
    gpuExample:
      "Clear 5 verified morning hardware & GPU orders in 10 seconds instead of 2 hours.",
  },
  {
    id: "deal-memory",
    num: "08",
    name: "Live Tracker & Memory",
    where: "Bottom Feed + Top Bar",
    icon: Activity,
    plainEnglish:
      "Pings you the moment a buyer opens your quote or forwards it to their CFO (UAE PDPL compliant), while remembering reliable vs. risky suppliers privately.",
    gpuExample:
      "Alerts on CFO forward (+18 Buying Score) and permanently flags risky grey-market brokers.",
  },
];

export default function WorkspaceToolsGuide() {
  const [hoverId, setHoverId] = useState(null);
  const [pinnedId, setPinnedId] = useState(WORKSPACE_TOOLS[0].id);

  const activeId = hoverId || pinnedId;
  const activeTool = WORKSPACE_TOOLS.find((t) => t.id === activeId) || WORKSPACE_TOOLS[0];

  return (
    <div className="space-y-12">
      {/* INTERACTIVE WORKSPACE BLUEPRINT + LIVE CHATBOX BUBBLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Annotated Miniature Workspace Blueprint */}
        <div className="lg:col-span-7 rounded-3xl bg-obsidian text-white p-5 sm:p-6 shadow-2xl border border-white/10 space-y-3.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-3 border-b border-white/10">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              HOVER OR TAP ANY NUMBER ON THE SCREEN MAP
            </span>
            <span className="hidden sm:inline text-slate-500">8 Tools</span>
          </div>

          {/* Zone 1: Top Header */}
          <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Top Bar
            </span>
            <div className="flex flex-wrap gap-2">
              {["batch-sweep", "deal-memory"].map((tid) => {
                const t = WORKSPACE_TOOLS.find((x) => x.id === tid);
                const sel = activeId === tid;
                return (
                  <button
                    key={tid}
                    type="button"
                    onMouseEnter={() => setHoverId(tid)}
                    onMouseLeave={() => setHoverId(null)}
                    onClick={() => setPinnedId(tid)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      sel ? "bg-white text-obsidian shadow" : "bg-white/10 text-slate-200 hover:bg-white/20"
                    }`}
                  >
                    <span className="font-mono font-bold text-sky-500">{t.num}</span>
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zone 2: Top Banner */}
          <button
            type="button"
            onMouseEnter={() => setHoverId("anchor-quote")}
            onMouseLeave={() => setHoverId(null)}
            onClick={() => setPinnedId("anchor-quote")}
            className={`w-full text-left rounded-xl p-3.5 border transition cursor-pointer flex items-center justify-between ${
              activeId === "anchor-quote"
                ? "bg-emerald-500/20 border-emerald-400 text-white"
                : "bg-white/[0.04] border-white/10 text-slate-200 hover:bg-white/[0.08]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-emerald-400 text-obsidian font-mono text-xs font-extrabold flex items-center justify-center">
                01
              </span>
              <span className="text-xs font-bold">60-Second Anchor Quote Banner</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-300">41s Ballpark</span>
          </button>

          {/* Zone 3: Split Panel */}
          <div className="grid sm:grid-cols-12 gap-3">
            <button
              type="button"
              onMouseEnter={() => setHoverId("buyer-score")}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => setPinnedId("buyer-score")}
              className={`sm:col-span-5 text-left rounded-xl p-3.5 border transition cursor-pointer flex items-center gap-3 ${
                activeId === "buyer-score"
                  ? "bg-sky-500/20 border-sky-400 text-white"
                  : "bg-white/[0.04] border-white/10 text-slate-200 hover:bg-white/[0.08]"
              }`}
            >
              <span className="w-7 h-7 rounded-full bg-sky-400 text-obsidian font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                02
              </span>
              <span className="text-xs font-bold">Buyer Intent Score &amp; Spec Lock</span>
            </button>

            <div className="sm:col-span-7 rounded-xl bg-white/[0.04] border border-white/10 p-3 grid grid-cols-2 gap-2">
              {["trap-detector", "profit-calculator", "negotiation-copilot", "four-doc-suite"].map(
                (tid) => {
                  const t = WORKSPACE_TOOLS.find((x) => x.id === tid);
                  const sel = activeId === tid;
                  return (
                    <button
                      key={tid}
                      type="button"
                      onMouseEnter={() => setHoverId(tid)}
                      onMouseLeave={() => setHoverId(null)}
                      onClick={() => setPinnedId(tid)}
                      className={`text-left p-2.5 rounded-lg border transition cursor-pointer flex items-center gap-2 ${
                        sel
                          ? "bg-white text-obsidian border-white shadow"
                          : "bg-white/[0.05] text-slate-200 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-sky-400 text-obsidian">
                        {t.num}
                      </span>
                      <span className="text-[11px] font-bold leading-tight">{t.name}</span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Right: Conversational Salemate Chatbox for Active Tool */}
        <div className="lg:col-span-5 rounded-3xl bg-obsidian text-white p-6 border border-white/10 shadow-2xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-white/10 p-1.5 flex items-center justify-center">
                  <img
                    src="/salemate-icon.png"
                    alt="Salemate"
                    className="w-full h-full object-contain"
                  />
                </span>
                <div>
                  <p className="text-xs font-bold text-white">Salemate Assistant</p>
                  <p className="font-mono text-[10px] text-emerald-300">
                    Tool {activeTool.num} · {activeTool.where}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-sky-200">
                <MessageCircle className="w-3 h-3 text-emerald-400" />
                Live Guide
              </span>
            </div>

            <div className="bg-white/[0.07] rounded-2xl rounded-tl-sm p-4 space-y-2.5">
              <h3 className="text-lg font-bold text-white">{activeTool.name}</h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeTool.plainEnglish}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/25 p-3.5 text-xs text-emerald-100 leading-relaxed">
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-300 block mb-1">
                On Our 8× NVIDIA H100 Trade
              </span>
              {activeTool.gpuExample}
            </div>
          </div>

          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-white text-[#060510] hover:bg-slate-100 text-xs font-bold transition"
          >
            Login to Try Tool {activeTool.num}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* COMPACT 8-TOOL VISUAL TILE GRID — HOVER OR TAP OPENS CHATBOX */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-indigo-700 font-bold">
            All 8 Tools — Hover or Tap Any Card to Open Its Chatbox
          </span>
          {hoverId && (
            <button
              type="button"
              onClick={() => setHoverId(null)}
              className="text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {WORKSPACE_TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isOpen = activeId === tool.id;
            return (
              <div
                key={tool.id}
                className="relative"
                onMouseEnter={() => setHoverId(tool.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                <button
                  id={`tool-guide-${tool.id}`}
                  type="button"
                  onClick={() => setPinnedId(tool.id)}
                  className={`w-full text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col gap-3 ${
                    isOpen
                      ? "bg-obsidian text-white border-obsidian shadow-xl -translate-y-0.5"
                      : "bg-surface text-slate-900 border-slate-900/10 hover:border-slate-900/30 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isOpen
                          ? "bg-white/15 text-sky-300"
                          : "bg-canvas text-obsidian border border-slate-900/10"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <span
                      className={`font-serif text-2xl leading-none ${
                        isOpen ? "text-white/60" : "text-slate-400"
                      }`}
                    >
                      {tool.num}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-snug">{tool.name}</p>
                    <p
                      className={`font-mono text-[10px] mt-1 inline-flex items-center gap-1 ${
                        isOpen ? "text-emerald-300" : "text-slate-500"
                      }`}
                    >
                      <MapPin className="w-2.5 h-2.5" />
                      {tool.where}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

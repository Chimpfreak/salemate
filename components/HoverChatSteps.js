"use client";

import { useState } from "react";
import {
  MessageSquareText,
  Zap,
  ShieldAlert,
  Calculator,
  UserCheck,
  MessageCircle,
  Mail,
  X,
} from "lucide-react";

const FLOW_STEPS = [
  {
    num: "01",
    shortTitle: "Read Inquiry",
    subtitle: "WhatsApp & Email",
    icon: MessageSquareText,
    connector: "WhatsApp Business Connector",
    connectorType: "whatsapp",
    chatHeadline: "I read messy messages instantly.",
    chatText:
      "Your buyer texts at 11:42 PM asking for 8 NVIDIA H100 GPUs. I pull out the exact model, quantity, UAE warranty need, and score them 95/100—so you never waste time on window shoppers.",
    gpuBadge: "8× H100 Request · Scored 95/100 Serious",
  },
  {
    num: "02",
    shortTitle: "60s Reply",
    subtitle: "Zero-Wait Ballpark",
    icon: Zap,
    connector: "WhatsApp Cloud API · 41s",
    connectorType: "whatsapp",
    chatHeadline: "I reply in 41 seconds so buyers stay.",
    chatText:
      "Instead of making a high-value buyer wait until Monday morning, I draft a safe AED ballpark from live Dubai stock right away—anchoring the deal while you negotiate supplier discounts.",
    gpuBadge: "AED 918,400 Ballpark · Sent in 41s",
  },
  {
    num: "03",
    shortTitle: "Catch Traps",
    subtitle: "Audit Suppliers",
    icon: ShieldAlert,
    connector: "Email Connector · Auto-Audit",
    connectorType: "email",
    chatHeadline: "I spot 'cheap' quotes that lose money.",
    chatText:
      "An overseas broker quoted $26,200/GPU, but I caught missing 16-pin power cables, cooling brackets, 5% UAE customs tax, zero local warranty, and a suspicious new bank IBAN.",
    gpuBadge: "AED 24,668 Hidden Trap Exposed",
  },
  {
    num: "04",
    shortTitle: "Exact Profit",
    subtitle: "3.6725 AED & 5% VAT",
    icon: Calculator,
    connector: "Exact Code Math · Never AI Guesses",
    connectorType: "email",
    chatHeadline: "Your profit math is 100% deterministic.",
    chatText:
      "I never let AI guess financial numbers. Every USD-to-AED conversion (3.6725 peg), 5% import duty, margin slider, and 5% UAE VAT invoice total is calculated to the exact fils.",
    gpuBadge: "AED 978,053.53 · Exact 5% VAT",
  },
  {
    num: "05",
    shortTitle: "Your Final Yes",
    subtitle: "Human-Approved Send",
    icon: UserCheck,
    connector: "WhatsApp + Email · Human-Gated",
    connectorType: "whatsapp",
    chatHeadline: "Nothing ever sends without your click.",
    chatText:
      "I prepare the Customer Quote, Client-Hidden Supplier Order (your buyer stays secret!), and Tax Invoice—and wait for your click before firing through WhatsApp or Email.",
    gpuBadge: "Zero Customer Leaks · 1-Click Send",
  },
];

/**
 * Smooth, overflow-safe 5-step visual strip.
 * Hovering on desktop or tapping on phone opens the Salemate chatbox cleanly IN FLOW
 * directly below the steps—so it NEVER overlaps headers, footers, or neighboring sections.
 */
export default function HoverChatSteps({ theme = "light" }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const [pinnedIdx, setPinnedIdx] = useState(null);

  const activeIdx = hoverIdx !== null ? hoverIdx : pinnedIdx;
  const activeStep = activeIdx !== null ? FLOW_STEPS[activeIdx] : null;
  const isDark = theme === "dark";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span
          className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
            isDark ? "text-sky-300" : "text-indigo-700"
          }`}
        >
          Hover or tap any step to open Salemate&apos;s chatbox
        </span>
        {activeStep && (
          <button
            type="button"
            onClick={() => {
              setHoverIdx(null);
              setPinnedIdx(null);
            }}
            className={`text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition ${
              isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <X className="w-3.5 h-3.5" />
            Close chatbox
          </button>
        )}
      </div>

      {/* 5 Minimalist Visual Step Nodes */}
      <div className="relative">
        <div
          aria-hidden="true"
          className={`hidden lg:block absolute top-11 left-10 right-10 h-px ${
            isDark
              ? "bg-gradient-to-r from-sky-400/20 via-indigo-400/45 to-emerald-400/20"
              : "bg-gradient-to-r from-slate-300 via-indigo-300 to-emerald-300"
          }`}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 relative">
          {FLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isOpen = activeIdx === idx;
            return (
              <button
                key={step.num}
                id={`hover-step-${step.num}`}
                type="button"
                onMouseEnter={() => setHoverIdx(idx)}
                onMouseLeave={() => setHoverIdx(null)}
                onFocus={() => setHoverIdx(idx)}
                onClick={() => setPinnedIdx((prev) => (prev === idx ? null : idx))}
                aria-expanded={isOpen}
                className={`w-full text-left rounded-2xl p-4 sm:p-5 border transition-all duration-300 ease-out cursor-pointer flex flex-col items-start gap-3 ${
                  isOpen
                    ? isDark
                      ? "bg-white text-obsidian border-white shadow-xl -translate-y-1"
                      : "bg-[#060510] text-white border-[#060510] shadow-xl -translate-y-1"
                    : isDark
                    ? "bg-white/[0.05] text-white border-white/15 hover:bg-white/[0.1]"
                    : "bg-surface text-slate-900 border-slate-900/10 hover:border-slate-900/30 shadow-sm"
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                      isOpen
                        ? isDark
                          ? "bg-[#060510] text-sky-300"
                          : "bg-white/15 text-sky-300"
                        : isDark
                        ? "bg-white/10 text-sky-300"
                        : "bg-canvas text-[#060510] border border-slate-900/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <span
                    className={`font-serif text-2xl leading-none ${
                      isOpen
                        ? isDark
                          ? "text-[#060510]/60"
                          : "text-white/60"
                        : isDark
                        ? "text-white/40"
                        : "text-slate-400"
                    }`}
                  >
                    {step.num}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-bold tracking-tight">{step.shortTitle}</p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      isOpen
                        ? isDark
                          ? "text-slate-600"
                          : "text-slate-300"
                        : isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {step.subtitle}
                  </p>
                </div>

                <span
                  className={`font-mono text-[10px] font-semibold inline-flex items-center gap-1 ${
                    isOpen
                      ? isDark
                        ? "text-indigo-700"
                        : "text-emerald-300"
                      : isDark
                      ? "text-sky-300/80"
                      : "text-indigo-600"
                  }`}
                >
                  <MessageCircle className="w-3 h-3" />
                  {isOpen ? "Chat open" : "Hover / tap"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SMOOTH IN-FLOW CHATBOX STAGE — ZERO OVERFLOW OVER HEADERS OR FOOTERS */}
      <div
        className={`transition-all duration-300 ease-out overflow-hidden ${
          activeStep ? "max-h-[420px] opacity-100 translate-y-0" : "max-h-14 opacity-85 translate-y-0"
        }`}
      >
        {activeStep ? (
          <div
            role="region"
            aria-live="polite"
            className="rounded-2xl bg-[#060510] text-white border border-white/15 shadow-xl p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-white/10 p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src="/salemate-icon.png"
                    alt="Salemate"
                    className="w-full h-full object-contain"
                  />
                </span>
                <div>
                  <p className="text-xs font-bold text-white">
                    Salemate · Step {activeStep.num}: {activeStep.shortTitle}
                  </p>
                  <p className="font-mono text-[10px] text-slate-400">{activeStep.connector}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-sky-200">
                  {activeStep.connectorType === "email" ? (
                    <Mail className="w-3 h-3 text-sky-300" />
                  ) : (
                    <MessageCircle className="w-3 h-3 text-emerald-400" />
                  )}
                  {activeStep.connectorType === "email" ? "Email Connector" : "WhatsApp Connector"}
                </span>
                <span className="hidden sm:inline-flex font-mono text-[10px] text-emerald-300 bg-emerald-500/15 border border-emerald-400/25 rounded-full px-3 py-1">
                  {activeStep.gpuBadge}
                </span>
              </div>
            </div>

            <div className="bg-white/[0.07] rounded-2xl rounded-tl-sm p-4 space-y-1.5">
              <p className="text-sm font-bold text-sky-200">{activeStep.chatHeadline}</p>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeStep.chatText}
              </p>
            </div>

            <div className="sm:hidden font-mono text-[10px] text-emerald-300 bg-emerald-500/15 border border-emerald-400/25 rounded-xl px-3 py-2">
              {activeStep.gpuBadge}
            </div>
          </div>
        ) : (
          <div
            className={`rounded-2xl border border-dashed px-4 py-3.5 text-xs flex items-center justify-center gap-2 ${
              isDark
                ? "border-white/15 text-slate-400 bg-white/[0.02]"
                : "border-slate-300 text-slate-500 bg-canvas/70"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
            <span>Hover over or tap any step above (01–05) to read Salemate&apos;s explanation here.</span>
          </div>
        )}
      </div>
    </div>
  );
}

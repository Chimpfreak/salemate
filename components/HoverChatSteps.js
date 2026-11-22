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
 * Minimalist, visual-first 5-step flow where step explanations live inside
 * a sleek Salemate Chatbox that opens smoothly on mouse hover OR phone touch.
 */
export default function HoverChatSteps({ theme = "light" }) {
  const [openIdx, setOpenIdx] = useState(null);
  const [pinnedIdx, setPinnedIdx] = useState(null);

  const activeIdx = openIdx !== null ? openIdx : pinnedIdx;
  const isDark = theme === "dark";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span
          className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
            isDark ? "text-sky-300" : "text-indigo-700"
          }`}
        >
          Hover or tap any step to chat with Salemate
        </span>
        {activeIdx !== null && (
          <button
            type="button"
            onClick={() => {
              setOpenIdx(null);
              setPinnedIdx(null);
            }}
            className={`text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer ${
              isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <X className="w-3 h-3" />
            Close chatbox
          </button>
        )}
      </div>

      {/* 5 Minimalist Visual Step Nodes */}
      <div className="relative">
        {/* Subtle horizontal connecting beam on desktop */}
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
              <div
                key={step.num}
                className="relative"
                onMouseEnter={() => setOpenIdx(idx)}
                onMouseLeave={() => setOpenIdx(null)}
              >
                <button
                  id={`hover-step-${step.num}`}
                  type="button"
                  onClick={() => setPinnedIdx((prev) => (prev === idx ? null : idx))}
                  onFocus={() => setOpenIdx(idx)}
                  aria-expanded={isOpen}
                  className={`w-full text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col items-start gap-3 ${
                    isOpen
                      ? isDark
                        ? "bg-white text-obsidian border-white shadow-xl -translate-y-1"
                        : "bg-obsidian text-white border-obsidian shadow-xl -translate-y-1"
                      : isDark
                      ? "bg-white/[0.05] text-white border-white/12 hover:bg-white/[0.1]"
                      : "bg-surface text-slate-900 border-slate-900/10 hover:border-slate-900/30 shadow-sm"
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                        isOpen
                          ? isDark
                            ? "bg-obsidian text-sky-300"
                            : "bg-white/15 text-sky-300"
                          : isDark
                          ? "bg-white/10 text-sky-300"
                          : "bg-canvas text-obsidian border border-slate-900/10"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <span
                      className={`font-serif text-2xl leading-none ${
                        isOpen
                          ? isDark
                            ? "text-obsidian/60"
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

                {/* FLOATING CHATBOX POPOVER ON DESKTOP (Opens on Hover / Tap) */}
                {isOpen && (
                  <div
                    role="dialog"
                    aria-label={`Salemate explanation for step ${step.num}`}
                    className={`hidden lg:block absolute z-30 top-full mt-3 w-80 rounded-2xl bg-obsidian text-white border border-white/15 shadow-2xl p-4 space-y-3 ${
                      idx >= 3 ? "right-0" : "left-0"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-white/10 p-1 flex items-center justify-center">
                          <img
                            src="/salemate-icon.png"
                            alt="Salemate"
                            className="w-full h-full object-contain"
                          />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white leading-none">Salemate</p>
                          <p className="font-mono text-[10px] text-emerald-300 mt-0.5">
                            Step {step.num} · {step.shortTitle}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-sky-200">
                        {step.connectorType === "email" ? (
                          <Mail className="w-2.5 h-2.5" />
                        ) : (
                          <MessageCircle className="w-2.5 h-2.5 text-emerald-400" />
                        )}
                        {step.connectorType === "email" ? "Email" : "WhatsApp"}
                      </span>
                    </div>

                    <div className="bg-white/[0.07] rounded-xl rounded-tl-sm p-3 space-y-1.5">
                      <p className="text-xs font-bold text-sky-200">{step.chatHeadline}</p>
                      <p className="text-xs text-slate-200 leading-relaxed">{step.chatText}</p>
                    </div>

                    <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-400/25 rounded-lg px-2.5 py-1.5">
                      <span>{step.gpuBadge}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MOBILE / TABLET TOUCH CHATBOX DRAWER (Always clean, never clips off-screen!) */}
        {activeIdx !== null && (
          <div className="lg:hidden mt-4 rounded-2xl bg-obsidian text-white border border-white/15 shadow-2xl p-5 space-y-3">
            {(() => {
              const step = FLOW_STEPS[activeIdx];
              return (
                <>
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-white/10 p-1 flex items-center justify-center">
                        <img
                          src="/salemate-icon.png"
                          alt="Salemate"
                          className="w-full h-full object-contain"
                        />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white">
                          Salemate · Step {step.num}: {step.shortTitle}
                        </p>
                        <p className="font-mono text-[10px] text-slate-400">{step.connector}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenIdx(null);
                        setPinnedIdx(null);
                      }}
                      className="p-1.5 rounded-lg bg-white/10 text-slate-300"
                      aria-label="Close step chatbox"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-white/[0.07] rounded-xl rounded-tl-sm p-3.5 space-y-1.5">
                    <p className="text-xs font-bold text-sky-200">{step.chatHeadline}</p>
                    <p className="text-xs text-slate-200 leading-relaxed">{step.chatText}</p>
                  </div>
                  <div className="font-mono text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-400/25 rounded-lg px-3 py-1.5">
                    {step.gpuBadge}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

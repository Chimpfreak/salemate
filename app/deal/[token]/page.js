"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileCheck,
  Lock,
  Building2,
  Clock,
  ArrowLeft,
  ArrowUpRight,
  Activity,
  Loader2,
  MessageCircle,
  Mail,
  Send,
  RotateCcw,
} from "lucide-react";
import {
  INITIAL_DEALS,
  RESELLER_PROFILE,
  USD_TO_AED,
  calculateQuoteFinancials,
  formatAED,
} from "@/lib/store";
import SalemateLogo from "@/components/SalemateLogo";

const REJECTION_REASONS = [
  "Price above budget",
  "Delivery timeline too slow",
  "Need different GPU / hardware spec",
  "Went with another option",
  "Project paused for now",
];

const QUICK_REPLIES = [
  "Can you confirm Monday morning delivery in Dubai?",
  "Can you check for a fast-close volume discount?",
  "Please confirm 3-Year Official UAE warranty coverage.",
];

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
  const [accepted, setAccepted] = useState(Boolean(fallbackDeal.poAccepted));
  const [rejected, setRejected] = useState(Boolean(fallbackDeal.poRejected));

  // Reject quote panel state
  const [decisionMode, setDecisionMode] = useState("approve"); // "approve" | "reject"
  const [rejectionReason, setRejectionReason] = useState(REJECTION_REASONS[0]);
  const [rejectionNote, setRejectionNote] = useState("");

  // Unified Platform <-> Buyer Chat (WhatsApp + Email Connectors)
  const [chatChannel, setChatChannel] = useState("whatsapp"); // "whatsapp" | "email"
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

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
            setRejected(Boolean(data.deal.poRejected));
            if (data.deal.buyerPoNumber) setBuyerPoNumber(data.deal.buyerPoNumber);
            if (data.deal.rejectionReason) setRejectionReason(data.deal.rejectionReason);
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
  const chatMessages = Array.isArray(deal.chatMessages) ? deal.chatMessages : [];

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
      setRejected(false);
    } catch {
      setAccepted(true);
      setRejected(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRejectQuote(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/deals/${encodeURIComponent(deal.token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject_quote",
          reason: rejectionReason,
          note: rejectionNote,
          buyerName: approverName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.deal) {
        setDeal(data.deal);
      }
      setRejected(true);
      setAccepted(false);
    } catch {
      setRejected(true);
      setAccepted(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReopenQuote() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/deals/${encodeURIComponent(deal.token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reopen_quote" }),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.deal) {
        setDeal(data.deal);
      }
      setRejected(false);
      setDecisionMode("approve");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSendChat(textOverride = null) {
    const textToSend = String(textOverride ?? chatInput).trim();
    if (!textToSend || sendingChat) return;
    setSendingChat(true);
    if (textOverride === null) setChatInput("");
    try {
      const res = await fetch(`/api/deals/${encodeURIComponent(deal.token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat_message",
          text: textToSend,
          connector: chatChannel,
          senderName: approverName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.deal) {
        setDeal(data.deal);
      }
    } finally {
      setSendingChat(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Header with Official Salemate Logo + Seller/Workspace Links */}
      <header className="sticky top-0 z-30 bg-obsidian text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <SalemateLogo variant="dark" size="sm" />
            </Link>
            <span className="hidden sm:inline-block text-xs text-slate-300 border-l border-white/15 pl-3">
              Buyer Deal Room · <span className="font-mono text-white">{deal.token}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <Link
              href="/seller"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 transition"
            >
              Seller View
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link href="/workspace" className="text-slate-300 hover:text-white transition">
              Workspace
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

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-7 space-y-6">
        {/* Verified Quote Summary Banner */}
        <div className="bg-obsidian text-white rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Verified by Salemate · Official Warranty &amp; Complete Parts Checked
              </p>
              <h1 className="text-xl font-bold mt-0.5">{deal.title}</h1>
              <p className="text-xs text-slate-300 mt-1">
                {primaryQuote.warrantyRegion} · {primaryQuote.leadTime} · All cables, cooling kits,
                and UAE customs duties included
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
          {/* LEFT 7 COLS: UNIFIED WHATSAPP + EMAIL CONNECTOR CHAT + QUOTE DETAILS */}
          <div className="lg:col-span-7 space-y-6">
            {/* UNIFIED PLATFORM <-> CUSTOMER CHAT POWERED BY WHATSAPP & EMAIL CONNECTORS */}
            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Connector Header Bar */}
              <div className="px-5 py-4 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    Direct Chat with Salemate Platform
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Powered by live WhatsApp &amp; Email connectors — every reply stays synced in one
                    thread.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    WhatsApp Connected
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    Email Connected
                  </span>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto bg-canvas/45">
                {chatMessages.map((msg) => {
                  const isBuyer = msg.sender === "buyer";
                  const isEmail = msg.connector === "email";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isBuyer ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 mb-1 px-1 text-[10px] text-slate-500">
                        <span className="font-semibold text-slate-700">{msg.senderLabel}</span>
                        <span>·</span>
                        <span className="font-mono">{msg.time}</span>
                      </div>

                      <div
                        className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                          isBuyer
                            ? "bg-obsidian text-white rounded-br-sm"
                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div
                          className={`mt-2 pt-2 border-t flex items-center gap-1.5 text-[10px] font-mono ${
                            isBuyer
                              ? "border-white/10 text-slate-300"
                              : "border-slate-100 text-slate-500"
                          }`}
                        >
                          {isEmail ? (
                            <Mail className="w-3 h-3 text-sky-400 shrink-0" />
                          ) : (
                            <MessageCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                          )}
                          <span>{msg.connectorDetail}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Composer with Channel Selector */}
              <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                {/* Quick Reply Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSendChat(q)}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-800 text-[11px] font-medium text-slate-600 transition cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Connector Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="text-slate-500 font-medium">Send message via connector:</span>
                  <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200">
                    <button
                      id="connector-whatsapp-btn"
                      type="button"
                      onClick={() => setChatChannel("whatsapp")}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                        chatChannel === "whatsapp"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <MessageCircle className="w-3 h-3" />
                      WhatsApp
                    </button>
                    <button
                      id="connector-email-btn"
                      type="button"
                      onClick={() => setChatChannel("email")}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                        chatChannel === "email"
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Mail className="w-3 h-3" />
                      Email
                    </button>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChat();
                  }}
                  className="flex gap-2"
                >
                  <input
                    id="buyer-chat-input"
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Type a reply to Salemate (routed via ${
                      chatChannel === "whatsapp" ? "WhatsApp Business" : "Email Connector"
                    })...`}
                    className="flex-1 px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                  />
                  <button
                    id="buyer-chat-send-btn"
                    type="submit"
                    disabled={sendingChat || !chatInput.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-obsidian hover:bg-slate-800 text-white text-xs font-bold transition disabled:opacity-45 cursor-pointer"
                  >
                    {sendingChat ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Send
                  </button>
                </form>
              </div>
            </section>

            {/* Clear Quote Breakdown Card */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
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

              <div className="grid sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Prepared For</p>
                  <p className="font-bold text-slate-900 mt-1">{deal.buyerCompany}</p>
                  <p className="text-slate-600">{deal.buyerName}</p>
                  <p className="text-slate-500">{deal.buyerLocation}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">
                    Seller Desk (Powered by Salemate)
                  </p>
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
          </div>

          {/* RIGHT 5 COLS: APPROVE OR REJECT DECISION PANEL + PRIVACY LOG */}
          <aside className="lg:col-span-5 space-y-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 sticky top-20 shadow-sm">
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
                      Your Purchase Order has been synced across WhatsApp &amp; Email. Our UAE desk
                      is releasing blind fulfillment and issuing your 5% UAE VAT tax invoice.
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs">
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
              ) : rejected ? (
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
                      Quote Declined
                    </p>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">
                      Feedback Sent to Salemate Desk
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      We paused the stock hold and synced your decision across WhatsApp &amp; Email.
                      You can chat with us on the left for a revised quote or re-open this offer
                      anytime.
                    </p>
                  </div>
                  <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-rose-700">Reason Logged</span>
                      <span className="font-bold text-rose-950">
                        {deal.rejectionReason || rejectionReason}
                      </span>
                    </div>
                    {(deal.rejectionNote || rejectionNote) && (
                      <p className="text-rose-800 pt-1 border-t border-rose-200/80">
                        &ldquo;{deal.rejectionNote || rejectionNote}&rdquo;
                      </p>
                    )}
                  </div>
                  <button
                    id="reopen-quote-btn"
                    type="button"
                    disabled={submitting}
                    onClick={handleReopenQuote}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reconsider / Re-open Quote
                  </button>
                </div>
              ) : (
                <>
                  {/* Approve vs Reject Segmented Switch */}
                  <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                    <button
                      id="tab-approve-quote"
                      type="button"
                      onClick={() => setDecisionMode("approve")}
                      className={`flex-1 py-2 rounded-lg font-bold transition cursor-pointer ${
                        decisionMode === "approve"
                          ? "bg-obsidian text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Approve Quote
                    </button>
                    <button
                      id="tab-reject-quote"
                      type="button"
                      onClick={() => setDecisionMode("reject")}
                      className={`flex-1 py-2 rounded-lg font-bold transition cursor-pointer ${
                        decisionMode === "reject"
                          ? "bg-rose-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-rose-700"
                      }`}
                    >
                      Reject / Decline
                    </button>
                  </div>

                  {decisionMode === "approve" ? (
                    <form onSubmit={handleAcceptPO} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-brand" />
                        <h2 className="text-base font-bold text-slate-900">
                          Approve Quote &amp; Confirm Order
                        </h2>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Happy with the price and 3-year UAE warranty? Enter your PO number below to
                        lock stock for <strong>{deal.buyerCompany}</strong>.
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
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
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
                          className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                        />
                      </div>

                      <button
                        id="accept-quote-po-btn"
                        type="submit"
                        disabled={submitting}
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-obsidian hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
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
                  ) : (
                    <form onSubmit={handleRejectQuote} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-rose-600" />
                        <h2 className="text-base font-bold text-slate-900">
                          Decline / Reject This Quote
                        </h2>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Not moving forward with this offer? Let Salemate know why—we&apos;ll release
                        the stock hold or send a revised option via WhatsApp/Email.
                      </p>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Primary Reason
                        </label>
                        <div className="space-y-1.5">
                          {REJECTION_REASONS.map((r) => (
                            <label
                              key={r}
                              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                                rejectionReason === r
                                  ? "border-rose-400 bg-rose-50/70 text-rose-950 font-semibold"
                                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <input
                                type="radio"
                                name="rejectionReason"
                                checked={rejectionReason === r}
                                onChange={() => setRejectionReason(r)}
                                className="text-rose-600 focus:ring-rose-500"
                              />
                              <span>{r}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Optional Note (Target Price or Spec Change)
                        </label>
                        <textarea
                          id="buyer-rejection-note"
                          rows={2}
                          value={rejectionNote}
                          onChange={(e) => setRejectionNote(e.target.value)}
                          placeholder="e.g. Need target under AED 920k or 6 units instead of 8..."
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                        />
                      </div>

                      <button
                        id="confirm-reject-quote-btn"
                        type="submit"
                        disabled={submitting}
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending Response...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Confirm Decline &amp; Notify Salemate
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>

            {/* Privacy-First Activity Log */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-brand" />
                  Live Deal Activity Log (UAE PDPL)
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  <Lock className="w-3 h-3" />
                  No Ad Trackers
                </span>
              </div>
              <ul className="space-y-1.5 text-xs">
                {deal.telemetry.slice(0, 6).map((item, idx) => (
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
          </aside>
        </div>
      </main>
    </div>
  );
}

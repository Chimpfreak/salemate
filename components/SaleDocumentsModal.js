"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  FileText,
  ShieldAlert,
  Receipt,
  Send,
  CheckCircle2,
  Lock,
  ExternalLink,
  EyeOff,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  RESELLER_PROFILE,
  USD_TO_AED,
  buildMaskedSupplierPO,
  formatAED,
  formatUSD,
} from "@/lib/store";

const STAGES = [
  { id: "quote", label: "1. Customer Quotation", icon: FileText },
  { id: "po", label: "2. Zero-Leakage Supplier PO", icon: EyeOff },
  { id: "invoice", label: "3. 5% UAE VAT Invoice", icon: Receipt },
  { id: "dispatch", label: "4. Human-Gated Dispatch", icon: Send },
];

export default function SaleDocumentsModal({
  deal,
  selectedQuote,
  financials,
  onClose,
  onDispatched,
}) {
  const [activeStage, setActiveStage] = useState("quote");
  const [dispatchDocType, setDispatchDocType] = useState("Customer Quotation");
  const [recipientEmail, setRecipientEmail] = useState(deal.buyerEmail);
  const [emailSubject, setEmailSubject] = useState(
    `Quotation ${deal.token} — ${deal.title} (${formatAED(financials.grandTotalAed)} Inc. 5% UAE VAT)`
  );
  const [approverName, setApproverName] = useState("Founder / Trading Desk");
  const [humanApproved, setHumanApproved] = useState(false);
  const [sending, setSending] = useState(false);
  const [dispatchReceipt, setDispatchReceipt] = useState(null);
  const [dispatchError, setDispatchError] = useState("");

  const maskedPO = buildMaskedSupplierPO(deal, selectedQuote, financials);
  const invoiceNumber = `INV-UAE-${deal.token.replace("DEAL-", "")}`;
  const todayStr = new Date().toISOString().slice(0, 10);

  function handleDocTypeChange(nextType) {
    setDispatchDocType(nextType);
    setDispatchReceipt(null);
    setDispatchError("");
    if (nextType === "Masked Supplier PO") {
      setRecipientEmail(
        `orders@${selectedQuote.supplierName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 14)}.ae`
      );
      setEmailSubject(
        `Purchase Order ${maskedPO.poNumber} — ${deal.quantity}x ${deal.sku} (${financials.incoterms} ${formatUSD(financials.baseUsd)})`
      );
    } else if (nextType === "5% UAE VAT Tax Invoice") {
      setRecipientEmail(deal.buyerEmail);
      setEmailSubject(
        `UAE Tax Invoice ${invoiceNumber} — ${deal.title} (${formatAED(financials.grandTotalAed)})`
      );
    } else {
      setRecipientEmail(deal.buyerEmail);
      setEmailSubject(
        `Quotation ${deal.token} — ${deal.title} (${formatAED(financials.grandTotalAed)} Inc. 5% UAE VAT)`
      );
    }
  }

  async function handleDispatch(e) {
    e.preventDefault();
    setDispatchError("");
    if (!humanApproved) {
      setDispatchError(
        "Human-in-the-Loop Gate active: please check the approval confirmation box before dispatching."
      );
      return;
    }
    setSending(true);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const dealRoomUrl = `${origin}/deal/${deal.token}`;
      const htmlBody =
        dispatchDocType === "Masked Supplier PO"
          ? `<h2>Back-to-Back Supplier Purchase Order: ${maskedPO.poNumber}</h2>
             <p><strong>Buyer:</strong> ${RESELLER_PROFILE.companyName}</p>
             <p><strong>Ship-To:</strong> ${maskedPO.shipTo}</p>
             <p><strong>End Customer:</strong> [REDACTED — ZERO-LEAKAGE POLICY]</p>
             <p><strong>Hardware:</strong> ${deal.quantity}x ${deal.title} (${financials.incoterms})</p>
             <p><strong>Total PO Value:</strong> ${formatUSD(financials.baseUsd)}</p>`
          : `<h2>${dispatchDocType} — ${deal.token}</h2>
             <p>Dear ${deal.buyerName},</p>
             <p>Please review your UAE VAT-compliant quotation for <strong>${deal.title}</strong>:</p>
             <ul>
               <li>Warranty: ${selectedQuote.warrantyRegion}</li>
               <li>Subtotal: ${formatAED(financials.sellSubtotalAed)}</li>
               <li>5% UAE VAT: ${formatAED(financials.vatAed)}</li>
               <li><strong>Grand Total (Inc. VAT): ${formatAED(financials.grandTotalAed)}</strong></li>
             </ul>
             <p><a href="${dealRoomUrl}">Open Smart Deal Room & Issue PO →</a></p>`;

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmail,
          subject: emailSubject,
          html: htmlBody,
          documentType: dispatchDocType,
          dealToken: deal.token,
          humanApproved: true,
          approvedBy: approverName,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setDispatchError(data.error || "Dispatch failed.");
      } else {
        setDispatchReceipt(data.receipt);
        if (onDispatched) onDispatched(data.receipt);
      }
    } catch (err) {
      setDispatchError(err?.message || "Network error during email dispatch.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-label="4-Stage Sale Document & Live Email Dispatch"
    >
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                {deal.token}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                4-Stage Sale Document &amp; Human-Gated Dispatch Engine
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic UAE AED Math ({USD_TO_AED} peg) · Zero-Leakage Redaction · FTA 5% VAT Compliant
            </p>
          </div>
          <button
            id="close-sale-docs-modal"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Stage Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-white">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                id={`stage-tab-${stage.id}`}
                onClick={() => setActiveStage(stage.id)}
                className={`flex items-center justify-center gap-2 px-3 py-3 text-xs font-semibold border-b-2 transition ${
                  isActive
                    ? "border-brand text-brand bg-emerald-50/40"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{stage.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40">
          {/* STAGE 1: CUSTOMER QUOTATION */}
          {activeStage === "quote" && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">
                    Commercial Quotation · UAE
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {RESELLER_PROFILE.companyName}
                  </h3>
                  <p className="text-xs text-slate-500">{RESELLER_PROFILE.address}</p>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">
                    TRN: {RESELLER_PROFILE.trn}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-slate-900">QT-{deal.token}</p>
                  <p className="text-xs text-slate-500">Date: {todayStr} · Valid 48 Hours</p>
                  <Link
                    href={`/deal/${deal.token}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-brand hover:underline"
                  >
                    Open Buyer Smart Deal Room
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200/80">
                <div>
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Prepared For</p>
                  <p className="font-bold text-slate-900 mt-1">{deal.buyerCompany}</p>
                  <p className="text-slate-600">
                    Attn: {deal.buyerName} ({deal.buyerRole})
                  </p>
                  <p className="text-slate-500">{deal.buyerLocation}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">
                    Compliance &amp; Fulfillment
                  </p>
                  <p className="text-slate-700 mt-1">
                    <strong>Warranty:</strong> {selectedQuote.warrantyRegion}
                  </p>
                  <p className="text-slate-700">
                    <strong>Delivery:</strong> {selectedQuote.leadTime} (DDP Customer Site)
                  </p>
                  <p className="font-mono text-slate-500">
                    FX Peg Reference: 1 USD = {USD_TO_AED} AED
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 font-semibold">Line Item &amp; Verified BOM</th>
                      <th className="py-2 text-right font-semibold">Qty</th>
                      <th className="py-2 text-right font-semibold">Unit Price (AED)</th>
                      <th className="py-2 text-right font-semibold">Line Total (AED)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-slate-900">{deal.title}</p>
                        <p className="text-slate-500 mt-0.5">{deal.specs}</p>
                        {financials.activeBomItems.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {financials.activeBomItems.map((bom) => (
                              <span
                                key={bom.id}
                                className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]"
                              >
                                + {bom.name} Included
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums font-medium">
                        {deal.quantity}
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums">
                        {formatAED(financials.unitSellPriceAed)}
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {formatAED(financials.sellSubtotalAed)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <div className="w-full sm:w-80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal (Excl. VAT)</span>
                    <span className="font-mono tabular-nums font-medium">
                      {formatAED(financials.sellSubtotalAed)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>UAE VAT (5.0%)</span>
                    <span className="font-mono tabular-nums font-medium">
                      {formatAED(financials.vatAed)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Grand Total (AED)</span>
                    <span className="font-mono tabular-nums text-brand">
                      {formatAED(financials.grandTotalAed)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: ZERO-LEAKAGE SUPPLIER PO */}
          {activeStage === "po" && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-900 text-white">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-emerald-300">
                    Zero-Leakage Back-to-Back PO Guardrail Active
                  </p>
                  <p className="text-slate-300 mt-0.5">
                    End-customer company name, buyer contact, email, phone, and TRN are strictly
                    stripped from all supplier Purchase Orders to prevent distributor circumvention.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <p className="text-[11px] uppercase font-semibold text-slate-500">
                    Back-to-Back Purchase Order
                  </p>
                  <h3 className="text-lg font-bold font-mono text-slate-900">
                    {maskedPO.poNumber}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Issued by {maskedPO.buyerBillTo} · {maskedPO.issueDate}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Supplier</p>
                  <p className="font-bold text-slate-900 mt-0.5">{maskedPO.supplierName}</p>
                  <p className="text-slate-500">{maskedPO.supplierLocation}</p>
                  <span className="inline-block mt-1 font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                    Incoterms: {maskedPO.incoterms}
                  </span>
                </div>
              </div>

              {/* Explicit Redacted End-Customer Block */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-red-50/60 border border-red-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-red-800">
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Redacted End-Customer Fields</span>
                  </div>
                  <p className="font-mono text-[11px] text-red-700">
                    Client: {maskedPO.redactedFields.endCustomerCompany}
                  </p>
                  <p className="font-mono text-[11px] text-red-700">
                    Contact: {maskedPO.redactedFields.endCustomerContact}
                  </p>
                  <p className="font-mono text-[11px] text-red-700">
                    Email: {maskedPO.redactedFields.endCustomerEmail}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <p className="font-semibold text-slate-800">Authorized Ship-To Dock</p>
                  <p className="text-slate-600">{maskedPO.shipTo}</p>
                  <p className="text-[11px] text-slate-500">
                    Blind Drop-Ship Instruction: Do not enclose supplier invoice inside cartons.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 font-semibold">SKU / Hardware Description</th>
                      <th className="py-2 text-right font-semibold">Qty</th>
                      <th className="py-2 text-right font-semibold">Unit Cost (USD)</th>
                      <th className="py-2 text-right font-semibold">Total (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5">
                        <span className="font-mono text-[11px] text-slate-500 mr-2">{deal.sku}</span>
                        <span className="font-semibold text-slate-900">{deal.title}</span>
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums">{deal.quantity}</td>
                      <td className="py-2.5 text-right font-mono tabular-nums">
                        {formatUSD(maskedPO.unitPriceUsd)}
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums font-semibold">
                        {formatUSD(financials.hardwareUsd)}
                      </td>
                    </tr>
                    {maskedPO.bomAddons.map((addon) => (
                      <tr key={addon.sku}>
                        <td className="py-2.5">
                          <span className="font-mono text-[11px] text-amber-700 mr-2">
                            {addon.sku}
                          </span>
                          <span className="text-slate-800">Silent BOM Add-On: {addon.name}</span>
                        </td>
                        <td className="py-2.5 text-right font-mono tabular-nums">{addon.qty}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums">
                          {formatUSD(addon.unitCostUsd)}
                        </td>
                        <td className="py-2.5 text-right font-mono tabular-nums font-semibold">
                          {formatUSD(addon.lineTotalUsd)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-xs">
                <span className="text-slate-500">
                  AED Peg Reference ({USD_TO_AED}):{" "}
                  <strong className="font-mono text-slate-800">
                    {formatAED(maskedPO.poTotalAedRef)}
                  </strong>
                </span>
                <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                  Total Supplier PO: {formatUSD(maskedPO.poTotalUsd)}
                </span>
              </div>
            </div>
          )}

          {/* STAGE 3: 5% UAE VAT TAX INVOICE */}
          {activeStage === "invoice" && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
              <div className="flex flex-wrap justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider">
                    TAX INVOICE · UAE FTA 5% VAT
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {RESELLER_PROFILE.companyName}
                  </h3>
                  <p className="text-xs font-mono text-slate-600">
                    Supplier TRN: {RESELLER_PROFILE.trn}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-mono text-sm font-bold text-slate-900">{invoiceNumber}</p>
                  <p className="text-slate-500">Tax Point Date: {todayStr}</p>
                  <p className="text-slate-500">Currency: UAE Dirham (AED)</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Bill To</p>
                  <p className="font-bold text-slate-900 mt-1">{deal.buyerCompany}</p>
                  <p className="text-slate-600">{deal.buyerLocation}</p>
                  <p className="font-mono text-slate-600 mt-0.5">Buyer TRN: {deal.buyerTrn}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-slate-400">
                    Bank Settlement (AED)
                  </p>
                  <p className="font-semibold text-slate-900 mt-1">{RESELLER_PROFILE.bankName}</p>
                  <p className="font-mono text-slate-600 mt-0.5">IBAN: {RESELLER_PROFILE.iban}</p>
                  <p className="text-slate-500 mt-0.5">Terms: Net 15 / PO Reference Required</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 font-semibold">Taxable Supply Description</th>
                      <th className="py-2 text-right font-semibold">Net Amount (AED)</th>
                      <th className="py-2 text-right font-semibold">VAT %</th>
                      <th className="py-2 text-right font-semibold">VAT Amount (AED)</th>
                      <th className="py-2 text-right font-semibold">Gross Total (AED)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-slate-900">{deal.title}</p>
                        <p className="text-slate-500 text-[11px]">
                          Qty: {deal.quantity} · {selectedQuote.warrantyRegion}
                        </p>
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums">
                        {formatAED(financials.sellSubtotalAed)}
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums">5.0%</td>
                      <td className="py-3 text-right font-mono tabular-nums">
                        {formatAED(financials.vatAed)}
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums font-bold text-slate-900">
                        {formatAED(financials.grandTotalAed)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
                <p className="text-slate-500">
                  Deterministic FX Peg Verified: <span className="font-mono">1 USD = 3.6725 AED</span>
                </p>
                <div className="text-right">
                  <p className="text-slate-500">Total Payable (Incl. 5% UAE VAT)</p>
                  <p className="text-lg font-bold font-mono tabular-nums text-brand">
                    {formatAED(financials.grandTotalAed)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: HUMAN-GATED LIVE EMAIL DISPATCH */}
          {activeStage === "dispatch" && (
            <form onSubmit={handleDispatch} className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Human-in-the-Loop Dispatch Gate Enforced</p>
                  <p className="text-amber-800 mt-0.5">
                    Salemate never auto-sends customer quotes or supplier POs. Review the recipient
                    and confirm explicit human approval below to dispatch via Resend (or pitch-safe
                    demo simulator if API key is unset).
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-2.5">
                {["Customer Quotation", "Masked Supplier PO", "5% UAE VAT Tax Invoice"].map(
                  (docType) => (
                    <button
                      type="button"
                      key={docType}
                      onClick={() => handleDocTypeChange(docType)}
                      className={`px-3 py-2.5 rounded-lg border text-xs font-semibold text-left transition ${
                        dispatchDocType === docType
                          ? "border-brand bg-emerald-50/70 text-brand"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {docType}
                    </button>
                  )
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recipient Email
                  </label>
                  <input
                    id="dispatch-recipient-email"
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Approving Human Officer
                  </label>
                  <input
                    id="dispatch-approver-name"
                    type="text"
                    required
                    value={approverName}
                    onChange={(e) => setApproverName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Subject
                </label>
                <input
                  id="dispatch-email-subject"
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
              </div>

              <label className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/70 transition">
                <input
                  id="human-approval-checkbox"
                  type="checkbox"
                  checked={humanApproved}
                  onChange={(e) => setHumanApproved(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  <strong>Human Approval Sign-Off:</strong> I confirm I have audited the Silent BOM
                  accessories, UAE landed cost ({formatAED(financials.totalLandedCostAed)}),{" "}
                  {financials.marginPct}% target margin, and{" "}
                  {dispatchDocType === "Masked Supplier PO"
                    ? "end-customer zero-leakage redaction"
                    : "5% UAE VAT totals"}{" "}
                  before sending.
                </span>
              </label>

              {dispatchError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{dispatchError}</span>
                </div>
              )}

              {dispatchReceipt && (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {dispatchReceipt.simulated
                        ? "Dispatched (Pitch-Safe Demo Mode)"
                        : "Dispatched Live via Resend"}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-emerald-800">
                    Audit ID: {dispatchReceipt.id} · To: {dispatchReceipt.to} · Approved By:{" "}
                    {dispatchReceipt.approvedBy}
                  </p>
                  {dispatchReceipt.notice && (
                    <p className="text-emerald-700">{dispatchReceipt.notice}</p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  id="confirm-dispatch-btn"
                  type="submit"
                  disabled={sending || !humanApproved}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-dark disabled:opacity-45 disabled:cursor-not-allowed transition shadow-sm"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Dispatching...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Approve &amp; Dispatch {dispatchDocType}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

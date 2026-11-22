"use client";

import { useState } from "react";
import { X, Sparkles, Loader2, AlertCircle } from "lucide-react";

const SAMPLE_PROMPTS = [
  {
    label: "US-Import Dell CIF Trap",
    senderEmail: "procurement@dubai-cloudcorp.ae",
    senderName: "Omar Al-Suwaidi",
    text: "Urgent weekend RFQ: Need 8x Dell PowerEdge R750 servers for Media City rack. US broker in Miami quoted $6,290/unit CIF Dubai (US-Import warranty, bare chassis without sliding rails and single PSU). Need full UAE AED landed comparison + 5% VAT quote.",
  },
  {
    label: "Cisco C9300 Switch Refresh",
    senderEmail: "it@abudhabi-maritime.ae",
    senderName: "Layla Al-Ketbi",
    text: "Hi team, please quote 16x Cisco Catalyst C9300-48P-A switches for Abu Dhabi HQ. Competing quote is $3,680 CIF US-Import without 10G uplink modules. We require official UAE META SMARTnet and DDP delivery.",
  },
];

export default function LiveParseModal({ onClose, onDealCreated }) {
  const [rawText, setRawText] = useState(SAMPLE_PROMPTS[0].text);
  const [senderEmail, setSenderEmail] = useState(SAMPLE_PROMPTS[0].senderEmail);
  const [senderName, setSenderName] = useState(SAMPLE_PROMPTS[0].senderName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText, senderEmail, senderName }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to parse RFQ");
      } else {
        onDealCreated(data.deal, data.mode);
        onClose();
      }
    } catch (err) {
      setError(err?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Live AI RFQ and Supplier Quote Parser"
    >
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-bold text-slate-900">
              + Live AI Parse (Gemini 2.5 Flash + Deterministic UAE Math)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70"
            aria-label="Close Live AI Parse modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">Quick Pitch Presets:</span>
            {SAMPLE_PROMPTS.map((preset) => (
              <button
                type="button"
                key={preset.label}
                onClick={() => {
                  setRawText(preset.text);
                  setSenderEmail(preset.senderEmail);
                  setSenderName(preset.senderName);
                }}
                className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-brand text-xs font-medium text-slate-700 transition"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Buyer Contact Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Buyer Email
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Paste Raw WhatsApp Message, Email RFQ, or Supplier Quote
            </label>
            <textarea
              id="live-parse-textarea"
              rows={5}
              required
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste unstructured hardware enquiry or broker quote..."
              className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              AI extracts SKUs, quantities, incoterms, and Silent BOM omissions. All AED (3.6725),
              5% CIF duty, and 5% UAE VAT calculations run deterministically in JavaScript.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              id="run-live-ai-parse-btn"
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-dark disabled:opacity-50 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Parsing &amp; Auditing BOM...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Normalize &amp; Add to Queue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

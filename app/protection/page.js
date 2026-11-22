import Link from "next/link";
import { ArrowRight, EyeOff, FileCheck2, Lock, MessageCircle, ShieldCheck } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export default function ProtectionPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Architectural Vault Hero */}
        <section className="bg-obsidian text-white py-14 lg:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-300">
                Zero-Leakage Governance
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-[1.06]">
                Two{" "}
                <span className="font-serif italic font-normal text-emerald-300">unbreakable</span>{" "}
                rules protecting every trade.
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Buyers get a fast, transparent WhatsApp &amp; Email chat room with full approval or
                decline control. Sellers see only the revenue Salemate generated for them—never your
                client&apos;s identity, never your margin, and never your selling price.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/deal/DEAL-2026-884"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-obsidian hover:bg-slate-100 text-xs font-bold transition"
                >
                  Inspect Buyer View
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/seller"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition"
                >
                  Inspect Seller View
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
                <img
                  src="/vault-shield.jpg"
                  alt="Obsidian glass monolith slabs protecting a luminous emerald core"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Visual Split Proof: What Buyer Sees vs What Seller Sees */}
        <section className="editorial-grain py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-6">
            {/* Buyer View Card */}
            <div className="bg-surface border border-slate-900/10 rounded-3xl p-7 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-mono text-xs font-bold text-indigo-700">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    BUYER VIEW · /deal/DEAL-2026-884
                  </span>
                  <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    UAE PDPL Safe
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Live Chat, Clear VAT &amp; Approve or Decline
                </h2>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Unified chat bridged via WhatsApp Business &amp; Email connectors
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    Transparent AED total + 5% UAE VAT &amp; official 3-year warranty
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                    One-click Approve PO or Decline with feedback—human approved always
                  </li>
                </ul>
              </div>
              <Link
                href="/deal/DEAL-2026-884"
                className="inline-flex items-center justify-center gap-2 py-3 rounded-full bg-obsidian hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                Open Buyer Chat &amp; Quote Room
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Seller View Card */}
            <div className="bg-obsidian text-white rounded-3xl p-7 shadow-xl flex flex-col justify-between space-y-6 border border-white/10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-mono text-xs font-bold text-sky-300">
                    <EyeOff className="w-4 h-4 text-rose-400" />
                    SELLER VIEW · /seller
                  </span>
                  <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30">
                    Zero Leakage
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Payout Ledger Only — Zero Client or Margin Data
                </h2>
                <div className="rounded-2xl bg-black/45 border border-white/10 p-4 font-mono text-xs space-y-1.5">
                  <p className="text-emerald-400">SALES MADE FOR YOU: AED 1,936,909.50</p>
                  <p className="text-rose-300">End Buyer Identity: [PROTECTED BY SALEMATE]</p>
                  <p className="text-rose-300">Platform Cut / Margin: [NEVER SHOWN]</p>
                  <p className="text-rose-300">End-Buyer Selling Price: [NEVER SHOWN]</p>
                  <p className="text-slate-300">Ship-To: Salemate Consolidation Bay 4, JAFZA</p>
                </div>
              </div>
              <Link
                href="/seller"
                className="inline-flex items-center justify-center gap-2 py-3 rounded-full bg-white text-obsidian hover:bg-slate-100 text-xs font-bold transition"
              >
                Open Zero-Leakage Seller View
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

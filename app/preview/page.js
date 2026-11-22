import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import SalematePreviewOS from "@/components/SalematePreviewOS";

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <SiteHeader />

      <main className="flex-1 editorial-grain py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-700">
                Interactive Sandbox · 8× NVIDIA H100 GPU Trade
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-[-0.025em] mt-1">
                Try{" "}
                <span className="font-serif italic font-normal text-indigo-800">Salemate</span>{" "}
                live.
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link
                href="/tools"
                className="px-4 py-2 rounded-full bg-surface border border-slate-900/15 hover:border-obsidian font-semibold text-slate-800 transition"
              >
                Tool Guide
              </Link>
              <Link
                href="/deal/DEAL-2026-884"
                className="px-4 py-2 rounded-full bg-surface border border-slate-900/15 hover:border-obsidian font-semibold text-slate-800 transition"
              >
                Buyer View
              </Link>
              <Link
                href="/seller"
                className="px-4 py-2 rounded-full bg-surface border border-slate-900/15 hover:border-obsidian font-semibold text-slate-800 transition"
              >
                Seller View
              </Link>
              <Link
                href="/workspace"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-obsidian hover:bg-slate-800 text-white font-bold transition shadow-sm"
              >
                Company Workspace
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-[26px] bg-obsidian p-2.5 sm:p-3.5 shadow-2xl ring-1 ring-slate-900/15">
            <div className="flex items-center justify-between px-3 pb-2.5 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="ml-2 text-slate-300">salemate.app/preview</span>
              </div>
              <span className="hidden sm:inline text-emerald-400">
                Interactive Demo · Click Any Control
              </span>
            </div>
            <SalematePreviewOS embedded />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

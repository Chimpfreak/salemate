import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import HoverChatSteps from "@/components/HoverChatSteps";

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Cinematic Prism Hero */}
        <section className="relative overflow-hidden bg-obsidian text-white py-16 lg:py-24">
          <div className="absolute inset-0 pointer-events-none select-none">
            <img
              src="/connector-prism.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/45" />
          </div>

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 space-y-6 max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-sky-300">
              Our Service · WhatsApp &amp; Email Unified
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-[1.06]">
              An AI trading desk running{" "}
              <span className="font-serif italic font-normal text-emerald-300">
                behind your brand
              </span>
              .
            </h1>
            <p className="text-base text-slate-200 leading-relaxed max-w-xl">
              We connect directly to your company&apos;s WhatsApp Business and Email—turning messy
              midnight requests into verified quotes, masked supplier orders, and 5% UAE VAT
              invoices in under 60 seconds.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-obsidian hover:bg-slate-100 text-xs font-bold transition"
              >
                Explore the 8 Workspace Tools
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition"
              >
                Login &amp; Try Workspace
              </Link>
            </div>
          </div>
        </section>

        {/* Impact Strip */}
        <section className="bg-surface border-b border-slate-900/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <p className="font-serif text-4xl sm:text-5xl text-slate-900 leading-none">
                &lt;60<span className="italic text-indigo-700">s</span>
              </p>
              <p className="text-xs text-slate-600 mt-1.5">Off-hours buyer response time</p>
            </div>
            <div>
              <p className="font-serif text-4xl sm:text-5xl text-slate-900 leading-none">
                90m <span className="italic text-emerald-700">→ 3m</span>
              </p>
              <p className="text-xs text-slate-600 mt-1.5">Manual quoting work saved per trade</p>
            </div>
            <div>
              <p className="font-serif text-4xl sm:text-5xl text-slate-900 leading-none">
                3.6725
              </p>
              <p className="text-xs text-slate-600 mt-1.5">Exact AED peg &amp; 5% VAT math</p>
            </div>
            <div>
              <p className="font-serif text-4xl sm:text-5xl text-slate-900 leading-none">
                Zero <span className="italic text-slate-500">leaks</span>
              </p>
              <p className="text-xs text-slate-600 mt-1.5">Buyer identity hidden from suppliers</p>
            </div>
          </div>
        </section>

        {/* Interactive 5-Step Hover/Touch Chatboxes */}
        <section className="editorial-grain py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-[-0.02em]">
                Five simple steps—{" "}
                <span className="font-serif italic font-normal text-indigo-800">
                  hover or tap each one
                </span>
                .
              </h2>
            </div>
            <HoverChatSteps theme="light" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

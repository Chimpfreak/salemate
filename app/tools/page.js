import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import WorkspaceToolsGuide from "@/components/WorkspaceToolsGuide";

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Visual Monolith Hero */}
        <section className="relative overflow-hidden bg-obsidian text-white py-14 lg:py-20">
          <div className="absolute inset-0 pointer-events-none select-none">
            <img
              src="/trading-monolith.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/40" />
          </div>

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-sky-300">
                Inside the Salemate Workspace
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-[1.06]">
                Every workspace tool,{" "}
                <span className="font-serif italic font-normal text-sky-300">
                  pointed out &amp; explained
                </span>
                .
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Hover or tap any number on the screen map—or any of the 8 tool cards—to open
                Salemate&apos;s plain-English chatbox guide.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#060510] hover:bg-slate-100 text-xs font-bold transition shadow-lg"
            >
              Login &amp; Try Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Interactive Blueprint + Hover/Tap Tool Chatboxes */}
        <section className="editorial-grain py-14 lg:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <WorkspaceToolsGuide />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

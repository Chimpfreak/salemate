"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import SalemateLogo from "@/components/SalemateLogo";

const NAV_LINKS = [
  { href: "/gpu-example", label: "GPU Case Study" },
  { href: "/service", label: "Our Service" },
  { href: "/tools", label: "Workspace Tools" },
  { href: "/protection", label: "Protection" },
  { href: "/preview", label: "Live Preview" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-obsidian/88 backdrop-blur-xl border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
          <SalemateLogo variant="dark" size="sm" />
        </Link>

        {/* Desktop Separate-Page Navigation */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-1.5 text-xs">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-full font-medium transition ${
                  active
                    ? "bg-white/15 text-white font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Pills */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/deal/DEAL-2026-884"
            className="hidden xl:inline-flex items-center px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 transition"
          >
            Buyer View
          </Link>
          <Link
            href="/seller"
            className="hidden xl:inline-flex items-center px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 transition"
          >
            Seller View
          </Link>
          <Link
            id="nav-company-login"
            href="/login"
            className="inline-flex items-center px-3.5 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition"
          >
            Company Login
          </Link>
          <Link
            id="nav-open-workspace"
            href="/workspace"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-obsidian hover:bg-slate-100 text-xs font-bold transition shadow-sm"
          >
            Workspace
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Touch Menu Toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Touch Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-obsidian border-t border-white/10 px-5 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {NAV_LINKS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl font-semibold transition ${
                    active
                      ? "bg-white text-obsidian"
                      : "bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
            <Link
              href="/deal/DEAL-2026-884"
              onClick={() => setMobileOpen(false)}
              className="px-3.5 py-2.5 rounded-xl border border-white/15 text-center font-semibold text-slate-200"
            >
              Buyer View
            </Link>
            <Link
              href="/seller"
              onClick={() => setMobileOpen(false)}
              className="px-3.5 py-2.5 rounded-xl border border-white/15 text-center font-semibold text-slate-200"
            >
              Seller View
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="px-3.5 py-2.5 rounded-xl border border-white/20 text-center font-semibold text-white"
            >
              Company Login
            </Link>
            <Link
              href="/workspace"
              onClick={() => setMobileOpen(false)}
              className="px-3.5 py-2.5 rounded-xl bg-white text-obsidian text-center font-bold"
            >
              Workspace →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-obsidian text-slate-400 border-t border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-wrap items-center justify-between gap-6 text-xs">
        <div className="flex items-center gap-3.5">
          <Link href="/">
            <SalemateLogo variant="dark" size="sm" />
          </Link>
          <span className="hidden sm:inline border-l border-white/15 pl-3.5 text-slate-400">
            AI Sales &amp; Trading Operations Service · Built in the UAE
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-5 font-medium text-slate-300">
          <Link href="/gpu-example" className="hover:text-white transition">
            GPU Case Study
          </Link>
          <Link href="/service" className="hover:text-white transition">
            Our Service
          </Link>
          <Link href="/tools" className="hover:text-white transition">
            Tools
          </Link>
          <Link href="/protection" className="hover:text-white transition">
            Protection
          </Link>
          <Link href="/deal/DEAL-2026-884" className="hover:text-white transition">
            Buyer View
          </Link>
          <Link href="/seller" className="hover:text-white transition">
            Seller View
          </Link>
          <Link href="/workspace" className="hover:text-white transition">
            Workspace
          </Link>
        </div>
      </div>
    </footer>
  );
}

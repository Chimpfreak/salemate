"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X, Linkedin } from "lucide-react";
import SalemateLogo from "@/components/SalemateLogo";
import { FOUNDERS } from "@/lib/founders";

const NAV_LINKS = [
  { href: "/gpu-example", label: "GPU Case Study" },
  { href: "/service", label: "Our Service" },
  { href: "/tools", label: "Workspace Tools" },
  { href: "/protection", label: "Protection" },
  { href: "/about", label: "About Us" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#060510] text-white border-b border-white/15 shadow-lg shadow-black/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
          <SalemateLogo variant="dark" size="sm" />
        </Link>

        {/* Desktop Separate-Page Navigation — High Contrast Solid Obsidian Bar */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-1 text-xs">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-full font-medium transition-colors duration-200 ${
                  active
                    ? "bg-white text-[#060510] font-bold shadow-sm"
                    : "text-slate-200 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Pills */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link
            href="/deal/DEAL-2026-884"
            className="hidden xl:inline-flex items-center px-3 py-1.5 rounded-full border border-white/20 bg-white/[0.07] hover:bg-white/15 text-xs font-medium text-slate-100 transition"
          >
            Buyer View
          </Link>
          <Link
            href="/seller"
            className="hidden xl:inline-flex items-center px-3 py-1.5 rounded-full border border-white/20 bg-white/[0.07] hover:bg-white/15 text-xs font-medium text-slate-100 transition"
          >
            Seller View
          </Link>
          <Link
            id="nav-company-login"
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#060510] hover:bg-slate-100 text-xs font-bold transition shadow-sm"
          >
            Login &amp; Workspace
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Touch Menu Toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Touch Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#060510] border-t border-white/15 px-5 py-4 space-y-3 shadow-2xl">
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
                      ? "bg-white text-[#060510]"
                      : "bg-white/10 text-slate-100 hover:bg-white/15"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15 text-xs">
            <Link
              href="/deal/DEAL-2026-884"
              onClick={() => setMobileOpen(false)}
              className="px-3.5 py-2.5 rounded-xl border border-white/20 text-center font-semibold text-slate-100"
            >
              Buyer View
            </Link>
            <Link
              href="/seller"
              onClick={() => setMobileOpen(false)}
              className="px-3.5 py-2.5 rounded-xl border border-white/20 text-center font-semibold text-slate-100"
            >
              Seller View
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="col-span-2 px-3.5 py-2.5 rounded-xl bg-white text-[#060510] text-center font-bold"
            >
              Company Login &amp; Workspace →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#060510] text-slate-400 border-t border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-3.5">
            <Link href="/">
              <SalemateLogo variant="dark" size="sm" />
            </Link>
            <span className="hidden sm:inline border-l border-white/15 pl-3.5 text-slate-300">
              This product was developed in 8 hr long tech sprint
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
            <Link href="/about" className="hover:text-white transition">
              About Us
            </Link>
            <Link href="/deal/DEAL-2026-884" className="hover:text-white transition">
              Buyer View
            </Link>
            <Link href="/seller" className="hover:text-white transition">
              Seller View
            </Link>
            <Link href="/login" className="hover:text-white transition">
              Login
            </Link>
          </div>
        </div>

        {/* Founders LinkedIn Bar */}
        <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <p className="text-slate-400">
            AI Sales &amp; Trading Operations Service · Built in the UAE
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-500">Built by:</span>
            {FOUNDERS.map((f) => (
              <a
                key={f.name}
                href={f.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.07] hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white font-semibold transition"
              >
                <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                {f.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

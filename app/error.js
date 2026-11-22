"use client";

import { useEffect } from "react";
import Link from "next/link";
import SalemateLogo from "@/components/SalemateLogo";

export default function AppErrorBoundary({ error, reset }) {
  useEffect(() => {
    const msg = String(error?.message || "");
    const name = String(error?.name || "");
    // Automatically recover once from stale Next.js chunk errors after a redeploy/rebuild
    if (
      (name === "ChunkLoadError" || msg.includes("Loading chunk") || msg.includes("ChunkLoadError")) &&
      typeof window !== "undefined"
    ) {
      const key = "salemate_chunk_reload_once";
      try {
        if (!window.sessionStorage.getItem(key)) {
          window.sessionStorage.setItem(key, "1");
          window.location.reload();
        }
      } catch {
        window.location.reload();
      }
    }
  }, [error]);

  function handleClearAndReload() {
    try {
      window.localStorage.removeItem("salemate_active_company_v1");
    } catch {}
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-[#060510] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 border border-white/15 rounded-2xl p-6 space-y-4">
        <SalemateLogo variant="dark" size="sm" />
        <h2 className="text-lg font-bold">Something needed a fresh reload</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          {error?.message || "A temporary browser cache mismatch occurred while loading Salemate."}
        </p>
        <div className="flex flex-wrap gap-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-lg bg-white text-[#060510] text-xs font-bold hover:bg-slate-100 transition"
          >
            Try Again
          </button>
          <button
            onClick={handleClearAndReload}
            className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 text-white text-xs font-semibold hover:bg-white/10 transition"
          >
            Fresh Reload
          </button>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg border border-white/20 text-slate-300 text-xs font-semibold hover:text-white transition"
          >
            Company Login
          </Link>
        </div>
      </div>
    </div>
  );
}

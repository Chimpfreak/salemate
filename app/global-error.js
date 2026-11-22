"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="bg-[#060510] text-white min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white/5 border border-white/15 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold">Salemate — Session Refresh Required</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {error?.message || "A client-side update occurred. Click below to reload cleanly."}
          </p>
          <div className="flex gap-2.5">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-lg bg-white text-[#060510] text-xs font-bold"
            >
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg border border-white/20 text-white text-xs font-semibold"
            >
              Reload Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

"use client";

import { useEffect } from "react";

/**
 * Self-healing guard for stale browser chunk caches after a rebuild/redeploy.
 * Prevents Next.js from showing "Application error: a client-side exception has occurred"
 * if a user's open browser tab tries to load an outdated JS chunk hash.
 */
export default function ChunkErrorRecovery() {
  useEffect(() => {
    const reloadOnce = () => {
      try {
        const key = "salemate_auto_recover_ts";
        const last = Number(window.sessionStorage.getItem(key) || 0);
        if (Date.now() - last > 10000) {
          window.sessionStorage.setItem(key, String(Date.now()));
          window.location.reload();
        }
      } catch {
        window.location.reload();
      }
    };

    const onError = (event) => {
      const msg = String(event?.message || event?.error?.message || "");
      const name = String(event?.error?.name || "");
      if (
        name === "ChunkLoadError" ||
        msg.includes("ChunkLoadError") ||
        msg.includes("Loading chunk") ||
        msg.includes("Failed to fetch dynamically imported module")
      ) {
        reloadOnce();
      }
    };

    const onUnhandledRejection = (event) => {
      const msg = String(event?.reason?.message || event?.reason || "");
      const name = String(event?.reason?.name || "");
      if (
        name === "ChunkLoadError" ||
        msg.includes("ChunkLoadError") ||
        msg.includes("Loading chunk") ||
        msg.includes("Failed to fetch dynamically imported module")
      ) {
        reloadOnce();
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}

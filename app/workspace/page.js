"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import SalematePreviewOS from "@/components/SalematePreviewOS";
import SalemateLogo from "@/components/SalemateLogo";
import {
  loadActiveCompanyClient,
  saveActiveCompanyClient,
} from "@/lib/companies";

export default function WorkspacePage() {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    async function verifySession() {
      // 1. Fast client check (localStorage)
      const localComp = loadActiveCompanyClient();
      if (localComp) {
        if (active) {
          setCompany(localComp);
          setChecking(false);
        }
        return;
      }

      // 2. Fallback server cookie check (/api/auth)
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (active && data?.authenticated && data?.company) {
          saveActiveCompanyClient(data.company);
          setCompany(data.company);
          setChecking(false);
          return;
        }
      } catch {
        // Not signed in
      }

      if (active) {
        setChecking(false);
        router.replace("/login");
      }
    }
    verifySession();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    saveActiveCompanyClient(null);
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    }).catch(() => {});
    router.push("/login");
  }

  async function handleSwitchCompany(nextCompany) {
    saveActiveCompanyClient(nextCompany);
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", companyId: nextCompany.id }),
    }).catch(() => {});
    setCompany(nextCompany);
  }

  if (checking || !company) {
    return (
      <div className="min-h-screen bg-obsidian text-white flex flex-col items-center justify-center gap-4 p-6">
        <SalemateLogo variant="dark" size="md" />
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
          <span>Verifying company workspace session...</span>
        </div>
        <a
          href="/login"
          className="mt-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition"
        >
          Go to Company Login →
        </a>
      </div>
    );
  }

  return (
    <SalematePreviewOS
      key={company.id}
      embedded={false}
      company={company}
      onLogout={handleLogout}
      onSwitchCompany={handleSwitchCompany}
    />
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Lock,
  Mail,
  ShieldCheck,
  UserPlus,
  LogIn,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import SalemateLogo from "@/components/SalemateLogo";
import {
  DEMO_COMPANIES,
  getAllCompaniesClient,
  registerCompanyClient,
  saveActiveCompanyClient,
} from "@/lib/companies";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "register"

  // Sign-in form
  const [email, setEmail] = useState("founder@alnoorsystems.ae");
  const [password, setPassword] = useState("salemate2026");

  // Register company form
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [trn, setTrn] = useState("100499882100003");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("salemate2026");
  const [defaultScenario, setDefaultScenario] = useState("gpu_trading");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function completeLoginWithCompany(companyObj) {
    saveActiveCompanyClient(companyObj);
    router.push("/workspace");
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Check client-side custom companies too (works seamlessly across serverless cold starts)
      const clientMatch = getAllCompaniesClient().find(
        (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password
      );

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await res.json();

      if (res.ok && data.ok && data.company) {
        await completeLoginWithCompany(data.company);
        return;
      }

      if (clientMatch) {
        await completeLoginWithCompany(clientMatch);
        return;
      }

      setError(data.error || "Invalid company email or password.");
    } catch {
      const clientMatch = getAllCompaniesClient().find(
        (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password
      );
      if (clientMatch) {
        await completeLoginWithCompany(clientMatch);
      } else {
        setError("Could not sign in. Please verify your email and password.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoCompanySignIn(company) {
    setError("");
    setLoading(true);
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", companyId: company.id }),
      }).catch(() => {});
      await completeLoginWithCompany(company);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterCompany(e) {
    e.preventDefault();
    setError("");
    if (!companyName.trim() || !regEmail.trim()) {
      setError("Please enter your trading company name and work email.");
      return;
    }
    setLoading(true);
    try {
      const createdLocal = registerCompanyClient({
        companyName,
        contactName: contactName || "Founder",
        email: regEmail,
        password: regPassword,
        trn,
        defaultScenario,
        specialty:
          defaultScenario === "gpu_trading"
            ? "NVIDIA AI GPU Trading"
            : defaultScenario === "dell_servers"
            ? "Enterprise Server Trading"
            : "Core Networking Trading",
      });

      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          companyName,
          contactName,
          email: regEmail,
          password: regPassword,
          trn,
          defaultScenario,
        }),
      }).catch(() => {});

      await completeLoginWithCompany(createdLocal);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-canvas">
      {/* LEFT ARTISTIC BRAND PANEL */}
      <aside className="relative lg:col-span-5 bg-obsidian text-white p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <img
            src="/hero-ribbon.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/85 via-obsidian/70 to-obsidian/95" />
        </div>

        <div className="relative flex items-center justify-between">
          <Link href="/">
            <SalemateLogo variant="dark" size="md" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>

        <div className="relative my-12 space-y-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sky-300">
            Company Trading Workspace
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] leading-[1.1]">
            One private trading desk, built for{" "}
            <span className="font-serif italic font-normal text-sky-300">your company</span>.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md">
            Each Salemate account belongs to a single trading company. Your quotes, UAE TRN,
            profit margins, supplier trust memory, and client-hidden orders stay completely isolated
            to your workspace.
          </p>

          <ul className="space-y-3 pt-2 text-xs text-slate-200">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Company TRN &amp; branding auto-stamped on every Quote &amp; 5% VAT Invoice
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Private Deal Memory &amp; Morning Batch Sweep per company
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              Strict human approval before any email or WhatsApp message is sent
            </li>
          </ul>
        </div>

        <p className="relative font-mono text-[11px] text-slate-400">
          Salemate · Exact 3.6725 AED Peg · 5% UAE VAT · Zero Client Leakage
        </p>
      </aside>

      {/* RIGHT AUTHENTICATION PANEL */}
      <main className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 editorial-grain">
        <div className="w-full max-w-lg space-y-6">
          {/* Mode Switcher */}
          <div className="flex p-1 rounded-full bg-stone border border-slate-900/10 text-xs">
            <button
              id="tab-sign-in"
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-bold transition ${
                mode === "login"
                  ? "bg-obsidian text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Company Sign In
            </button>
            <button
              id="tab-create-company"
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-bold transition ${
                mode === "register"
                  ? "bg-obsidian text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Create Company Account
            </button>
          </div>

          <div className="bg-surface border border-slate-900/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            {mode === "login" ? (
              <>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Sign in to your company desk</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your company credentials or choose a pre-loaded UAE trading company below.
                  </p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Company Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="login-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="login-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    id="login-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-obsidian hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Opening Company Workspace...
                      </>
                    ) : (
                      <>
                        Sign In to Workspace
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* 1-Click Demo Company Switcher */}
                <div className="pt-5 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold uppercase tracking-wider text-slate-500">
                      1-Click Demo Companies (Pitch Ready)
                    </span>
                    <span className="font-mono text-slate-400">Pass: salemate2026</span>
                  </div>

                  <div className="space-y-2">
                    {DEMO_COMPANIES.map((comp) => (
                      <button
                        key={comp.id}
                        id={`demo-login-${comp.id}`}
                        type="button"
                        disabled={loading}
                        onClick={() => handleDemoCompanySignIn(comp)}
                        className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {comp.companyName}
                            </p>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                            {comp.specialty} · <span className="font-mono">{comp.email}</span>
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-indigo-700 group-hover:translate-x-0.5 transition shrink-0">
                          Enter →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* CREATE NEW COMPANY ACCOUNT TAB */
              <form onSubmit={handleRegisterCompany} className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Create a Company Workspace</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Each user represents one trading company. Your company name and UAE TRN will
                    appear automatically on all generated quotes and invoices.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Trading Company Name
                    </label>
                    <input
                      id="reg-company-name"
                      type="text"
                      required
                      placeholder="e.g. Desert Horizon GPUs LLC"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      id="reg-contact-name"
                      type="text"
                      required
                      placeholder="e.g. Rashid Al-Nuaimi"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      UAE TRN (Tax Registration No.)
                    </label>
                    <input
                      type="text"
                      value={trn}
                      onChange={(e) => setTrn(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Trading Focus
                    </label>
                    <select
                      value={defaultScenario}
                      onChange={(e) => setDefaultScenario(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                    >
                      <option value="gpu_trading">AI GPU Trading (NVIDIA H100)</option>
                      <option value="dell_servers">Enterprise Rack Servers</option>
                      <option value="cisco_network">Core Networking &amp; Switches</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company Email
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      placeholder="founder@yourcompany.ae"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Workspace Password
                    </label>
                    <input
                      id="reg-password"
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  id="reg-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-obsidian hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Provisioning Workspace...
                    </>
                  ) : (
                    <>
                      Create Company Workspace
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

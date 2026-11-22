import Link from "next/link";
import { ArrowRight, Clock, Linkedin, ShieldCheck, Sparkles, Layers, Cpu } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { FOUNDERS } from "@/lib/founders";

const SPRINT_HIGHLIGHTS = [
  {
    icon: Cpu,
    title: "Real-World GPU Trading Proof",
    detail:
      "Demonstrates how Salemate audits an 8× NVIDIA H100 Friday-night trade, catches AED 24,668 in hidden cable/duty traps, and defends local UAE warranty.",
  },
  {
    icon: Layers,
    title: "Multi-Company Workspace (1 User = 1 Company)",
    detail:
      "Full company sign-in and signup with isolated Deal Memory, Morning Batch Sweep, Negotiation Copilot, and 4-Stage Paperwork stamped with each company's TRN.",
  },
  {
    icon: ShieldCheck,
    title: "Buyer Chat Room + Zero-Leakage Seller View",
    detail:
      "Unified WhatsApp & Email connector chat with Approve/Reject quote controls for buyers, plus a zero-leakage Seller Portal showing only seller payouts.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-[#060510] text-white py-16 lg:py-24">
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <img
              src="/hero-ribbon.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-right opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060510] via-[#060510]/88 to-[#060510]/45" />
          </div>

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              This product was developed in 8 hr long tech sprint
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-[1.06] max-w-3xl">
              About{" "}
              <span className="font-serif italic font-normal text-sky-300">Salemate</span> &amp;
              this project.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Built end-to-end in an intensive <strong className="text-white">8-hour tech sprint</strong>{" "}
              to solve a real operational bottleneck facing UAE B2B trading teams: quoting urgent
              high-value hardware trades in under 60 seconds without losing profit to hidden
              supplier traps or customer circumvention.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#060510] hover:bg-slate-100 text-xs font-bold transition shadow-lg"
              >
                Login &amp; Try Workspace
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/gpu-example"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition"
              >
                Explore GPU Case Study
              </Link>
            </div>
          </div>
        </section>

        {/* Founders / Team LinkedIn Section */}
        <section className="bg-surface border-b border-slate-900/10 py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-10">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-700 font-semibold">
                The Team Behind Salemate
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-[-0.025em] mt-2">
                Meet the{" "}
                <span className="font-serif italic font-normal text-indigo-800">builders</span>.
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                This product was developed in 8 hr long tech sprint. Connect with both of us on
                LinkedIn to talk about Salemate, UAE B2B trading automation, or pilot partnerships.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {FOUNDERS.map((founder) => (
                <div
                  key={founder.name}
                  className="rounded-3xl bg-canvas border border-slate-900/10 p-7 flex flex-col justify-between gap-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#060510] text-white flex items-center justify-center font-serif text-2xl shadow-md">
                        {founder.initials}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{founder.name}</h3>
                        <p className="text-xs font-medium text-indigo-700 mt-0.5">{founder.role}</p>
                        <p className="font-mono text-[11px] text-slate-500 mt-1">
                          8-Hour Tech Sprint Team · UAE
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                    Connect with {founder.name} on LinkedIn
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About This Project Section */}
        <section className="editorial-grain py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-700 font-semibold">
                  About This Project
                </p>
                <h2 className="text-3xl font-bold text-slate-900 tracking-[-0.025em] mt-2">
                  What we shipped in our{" "}
                  <span className="font-serif italic font-normal text-indigo-800">
                    8-hour tech sprint
                  </span>
                  .
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface border border-slate-900/10 font-mono text-[11px] font-semibold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                This product was developed in 8 hr long tech sprint
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {SPRINT_HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-surface border border-slate-900/10 p-6 space-y-3 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#060510] text-sky-300 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

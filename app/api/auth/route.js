import { NextResponse } from "next/server";
import { DEMO_COMPANIES, sanitizeCompanyForSession } from "@/lib/companies";

const COOKIE_NAME = "salemate_company_session";

function getServerRegisteredCompanies() {
  if (!globalThis.__salemateCompanies) {
    globalThis.__salemateCompanies = [];
  }
  return globalThis.__salemateCompanies;
}

export async function GET(request) {
  const cookieVal = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookieVal) {
    return NextResponse.json({ ok: true, authenticated: false, company: null });
  }
  try {
    const decoded = JSON.parse(Buffer.from(cookieVal, "base64").toString("utf8"));
    return NextResponse.json({ ok: true, authenticated: true, company: decoded });
  } catch {
    return NextResponse.json({ ok: true, authenticated: false, company: null });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const action = body?.action || "login";

    if (action === "logout") {
      const res = NextResponse.json({ ok: true, authenticated: false });
      res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
      return res;
    }

    if (action === "register") {
      const email = String(body?.email || "").trim().toLowerCase();
      const companyName = String(body?.companyName || "").trim();
      if (!email || !companyName) {
        return NextResponse.json(
          { ok: false, error: "Company name and work email are required." },
          { status: 400 }
        );
      }

      const safeCompany = sanitizeCompanyForSession({
        id: `comp_custom_${Date.now()}`,
        companyName,
        shortName: companyName.split(" ").slice(0, 2).join(" "),
        contactName: String(body?.contactName || "Founder").trim(),
        role: "Founder / Account Owner",
        email,
        trn: String(body?.trn || "100499882100003").trim(),
        location: "Dubai, UAE",
        warehouseShipTo: `${companyName} — Dubai Consolidation Hub`,
        iban: "AE42 0260 0010 1548 9210 301",
        bankName: "Emirates NBD Corporate",
        defaultScenario: body?.defaultScenario || "gpu_trading",
        defaultMarginPct: 12.5,
        specialty: body?.specialty || "GPU & Enterprise Trading",
        badge: "Registered Company",
      });

      getServerRegisteredCompanies().unshift({ ...safeCompany, password: body?.password || "salemate2026" });

      const res = NextResponse.json({ ok: true, authenticated: true, company: safeCompany });
      res.cookies.set(COOKIE_NAME, Buffer.from(JSON.stringify(safeCompany)).toString("base64"), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    // Standard login (supports demo companies, registered companies, or quick demo switch by companyId)
    const allCompanies = [...DEMO_COMPANIES, ...getServerRegisteredCompanies()];
    let matched = null;

    if (body?.companyId) {
      matched = allCompanies.find((c) => c.id === body.companyId);
    } else {
      const email = String(body?.email || "").trim().toLowerCase();
      const password = String(body?.password || "");
      matched = allCompanies.find(
        (c) => c.email.toLowerCase() === email && c.password === password
      );
    }

    if (!matched) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Invalid company email or password. Try founder@alnoorsystems.ae / salemate2026 or pick a demo company below.",
        },
        { status: 401 }
      );
    }

    const safeCompany = sanitizeCompanyForSession(matched);
    const res = NextResponse.json({ ok: true, authenticated: true, company: safeCompany });
    res.cookies.set(COOKIE_NAME, Buffer.from(JSON.stringify(safeCompany)).toString("base64"), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Authentication failed" },
      { status: 500 }
    );
  }
}

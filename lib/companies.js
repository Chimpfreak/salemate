/**
 * Salemate — Multi-Company Accounts (1 User = 1 Trading Company)
 * Layered persistence: in-memory module state + sessionStorage + localStorage
 * so login works reliably even inside strict sandboxed preview iframes.
 */

export const SESSION_STORAGE_KEY = "salemate_active_company_v1";
export const CUSTOM_COMPANIES_KEY = "salemate_custom_companies_v1";

let memoryActiveCompany = null;
let memoryCustomCompanies = [];

export const DEMO_COMPANIES = [
  {
    id: "comp_alnoor",
    companyName: "Al Noor AI & Compute Trading LLC",
    shortName: "Al Noor Compute",
    contactName: "Zayd Al-Maktoum",
    role: "Managing Partner",
    email: "founder@alnoorsystems.ae",
    password: "salemate2026",
    trn: "100489215400003",
    location: "Dubai Silicon Oasis, UAE",
    warehouseShipTo: "Al Noor AI & Compute Trading LLC — JAFZA Consolidation Bay 4, Dubai",
    iban: "AE42 0260 0010 1548 9210 301",
    bankName: "Emirates NBD Corporate",
    defaultScenario: "gpu_trading",
    defaultMarginPct: 12.0,
    specialty: "NVIDIA H100 / AI GPU Trading",
    badge: "GPU Trading Desk",
  },
  {
    id: "comp_emirates_edge",
    companyName: "Emirates Edge Hardware Trading FZE",
    shortName: "Emirates Edge",
    contactName: "Layla Al-Hashimi",
    role: "Head of Trading",
    email: "desk@emiratesedge.ae",
    password: "salemate2026",
    trn: "100592014400003",
    location: "DAFZA Freezone, Dubai",
    warehouseShipTo: "Emirates Edge Hardware FZE — DAFZA Logistics Wing B, Dubai",
    iban: "AE18 0350 0012 9044 1120 884",
    bankName: "First Abu Dhabi Bank (FAB)",
    defaultScenario: "dell_servers",
    defaultMarginPct: 14.0,
    specialty: "Enterprise Data Center Servers",
    badge: "Server Trading Desk",
  },
  {
    id: "comp_auh_core",
    companyName: "Abu Dhabi Core Networks LLC",
    shortName: "AUH Core Networks",
    contactName: "Omar Al-Ketbi",
    role: "Commercial Director",
    email: "ops@abudhabicore.ae",
    password: "salemate2026",
    trn: "100381927700003",
    location: "ADGM / Mussafah, Abu Dhabi",
    warehouseShipTo: "Abu Dhabi Core Networks LLC — Mussafah Hub 7, Abu Dhabi",
    iban: "AE77 0030 0105 4491 8820 001",
    bankName: "ADCB Corporate Banking",
    defaultScenario: "cisco_network",
    defaultMarginPct: 13.5,
    specialty: "Core Enterprise Networking",
    badge: "Networking Desk",
  },
];

export function isValidCompany(comp) {
  return Boolean(
    comp &&
      typeof comp === "object" &&
      typeof comp.id === "string" &&
      comp.id.length > 0 &&
      typeof comp.companyName === "string" &&
      comp.companyName.length > 0
  );
}

export function sanitizeCompanyForSession(comp) {
  if (!isValidCompany(comp)) return null;
  const { password: _omit, ...safe } = comp;
  return safe;
}

export function getCustomCompaniesClient() {
  if (typeof window === "undefined") return memoryCustomCompanies;
  try {
    const raw = window.localStorage.getItem(CUSTOM_COMPANIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter(isValidCompany);
        memoryCustomCompanies = valid;
        return valid;
      }
    }
  } catch {
    // Fall back to in-memory list when storage is blocked
  }
  return memoryCustomCompanies;
}

export function getAllCompaniesClient() {
  return [...DEMO_COMPANIES, ...getCustomCompaniesClient()];
}

export function saveActiveCompanyClient(company) {
  const safe = sanitizeCompanyForSession(company);
  memoryActiveCompany = safe;

  if (typeof window === "undefined") return;
  try {
    if (!safe) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safe));
    }
  } catch {
    // ignore storage restrictions
  }
  try {
    if (!safe) {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safe));
    }
  } catch {
    // ignore storage restrictions
  }
}

export function loadActiveCompanyClient() {
  if (isValidCompany(memoryActiveCompany)) return memoryActiveCompany;
  if (typeof window === "undefined") return null;

  for (const storeName of ["localStorage", "sessionStorage"]) {
    try {
      const raw = window[storeName].getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValidCompany(parsed)) {
          memoryActiveCompany = parsed;
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
  }
  return null;
}

export function registerCompanyClient({
  companyName,
  contactName,
  email,
  password,
  trn,
  specialty,
  defaultScenario = "gpu_trading",
}) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const slug = cleanEmail.replace(/[^a-z0-9]/g, "").slice(0, 12) || Date.now().toString();
  const newCompany = {
    id: `comp_custom_${slug}`,
    companyName: String(companyName || "UAE Trading Partner LLC").trim(),
    shortName: String(companyName || "Trading Partner").trim().split(" ").slice(0, 2).join(" "),
    contactName: String(contactName || "Founder").trim(),
    role: "Founder / Account Owner",
    email: cleanEmail,
    password: String(password || "salemate2026"),
    trn: String(trn || "100499882100003").trim(),
    location: "Dubai, UAE",
    warehouseShipTo: `${String(companyName || "UAE Trading Partner LLC").trim()} — Dubai Consolidation Hub`,
    iban: "AE42 0260 0010 1548 9210 301",
    bankName: "Emirates NBD Corporate",
    defaultScenario,
    defaultMarginPct: 12.5,
    specialty: specialty || "High-Value B2B GPU & Hardware Trading",
    badge: "Custom Company",
  };

  const nextCustom = [
    newCompany,
    ...getCustomCompaniesClient().filter((c) => c.email !== cleanEmail),
  ];
  memoryCustomCompanies = nextCustom;

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CUSTOM_COMPANIES_KEY, JSON.stringify(nextCustom));
    } catch {
      // ignore storage restrictions
    }
  }
  saveActiveCompanyClient(newCompany);
  return sanitizeCompanyForSession(newCompany);
}

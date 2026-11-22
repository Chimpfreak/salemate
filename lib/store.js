/**
 * Salemate v3 — Deterministic UAE Financial Engine & In-Memory Deal Store
 *
 * Non-negotiable engineering invariants (per GEMINI.md & salemate-guardrails.md):
 * - USD_TO_AED = 3.6725 (fixed UAE Dirham peg)
 * - UAE_VAT_RATE = 0.05 (5% UAE VAT on customer quotes & tax invoices)
 * - CIF incoterms trigger 5% UAE customs duty + standard clearance; DDP = 0% extra duty
 * - Zero-leakage supplier POs always redact end-customer identity
 */

export const USD_TO_AED = 3.6725;
export const UAE_VAT_RATE = 0.05;
export const UAE_CUSTOMS_DUTY_CIF_RATE = 0.05;
export const CIF_CLEARANCE_FEE_AED = 650;

export const RESELLER_PROFILE = {
  companyName: "Al Noor Enterprise Systems LLC",
  address: "Building A4, Dubai Silicon Oasis, Dubai, UAE",
  trn: "100489215400003",
  email: "trading@alnoorsystems.ae",
  phone: "+971 4 388 4920",
  warehouseShipTo: "Al Noor Enterprise Systems LLC — JAFZA Consolidation Bay 4, Dubai, UAE",
  bankName: "Emirates NBD — Corporate Business Banking",
  iban: "AE42 0260 0010 1548 9210 301",
};

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function formatCommas(value, decimals = 2) {
  const num = Number(value || 0);
  const safe = Number.isFinite(num) ? num : 0;
  const fixed = safe.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimals > 0 ? `${withCommas}.${decPart}` : withCommas;
}

export function formatAED(value) {
  return `AED ${formatCommas(value, 2)}`;
}

export function formatUSD(value) {
  return `$${formatCommas(value, 2)}`;
}

/**
 * Deterministic UAE landed cost, sell price, margin, and 5% VAT calculation.
 * Never delegates financial arithmetic to an LLM.
 */
export function calculateQuoteFinancials(quote, quantity, marginPct = 14, enabledBomIds = null) {
  const qty = Math.max(1, Number(quantity) || 1);
  const unitPriceUsd = Math.max(0, Number(quote?.unitPriceUsd) || 0);
  const safeMarginPct = Math.min(60, Math.max(1, Number(marginPct) || 14));
  const incoterms = (quote?.incoterms || "DDP").toUpperCase().startsWith("CIF") ? "CIF" : "DDP";

  const bomItems = Array.isArray(quote?.missingBomItems) ? quote.missingBomItems : [];
  const activeBomItems = bomItems.filter((item) => {
    if (enabledBomIds === null) return item.includedByDefault !== false;
    return enabledBomIds.includes(item.id);
  });

  const hardwareUsd = round2(unitPriceUsd * qty);
  const bomUnitUsd = round2(
    activeBomItems.reduce((sum, item) => sum + (Number(item.unitCostUsd) || 0), 0)
  );
  const bomTotalUsd = round2(bomUnitUsd * qty);
  const baseUsd = round2(hardwareUsd + bomTotalUsd);
  const baseAed = round2(baseUsd * USD_TO_AED);

  const customsDutyRate = incoterms === "CIF" ? UAE_CUSTOMS_DUTY_CIF_RATE : 0;
  const customsDutyAed = round2(baseAed * customsDutyRate);
  const clearanceFeeAed = incoterms === "CIF" ? CIF_CLEARANCE_FEE_AED : 0;

  const totalLandedCostAed = round2(baseAed + customsDutyAed + clearanceFeeAed);
  const unitLandedCostAed = round2(totalLandedCostAed / qty);
  const unitLandedCostUsd = round2(unitLandedCostAed / USD_TO_AED);

  const sellSubtotalAed = round2(totalLandedCostAed / (1 - safeMarginPct / 100));
  const unitSellPriceAed = round2(sellSubtotalAed / qty);
  const unitSellPriceUsd = round2(unitSellPriceAed / USD_TO_AED);
  const grossProfitAed = round2(sellSubtotalAed - totalLandedCostAed);
  const vatAed = round2(sellSubtotalAed * UAE_VAT_RATE);
  const grandTotalAed = round2(sellSubtotalAed + vatAed);

  return {
    quantity: qty,
    incoterms,
    unitPriceUsd,
    hardwareUsd,
    bomUnitUsd,
    bomTotalUsd,
    activeBomItems,
    baseUsd,
    baseAed,
    customsDutyRate,
    customsDutyAed,
    clearanceFeeAed,
    totalLandedCostAed,
    unitLandedCostAed,
    unitLandedCostUsd,
    marginPct: safeMarginPct,
    sellSubtotalAed,
    unitSellPriceAed,
    unitSellPriceUsd,
    grossProfitAed,
    vatAed,
    grandTotalAed,
    exchangeRate: USD_TO_AED,
  };
}

/**
 * Generates a Zero-Leakage Back-to-Back Supplier PO object.
 * Strictly strips and redacts all end-customer PII and company identity.
 */
export function buildMaskedSupplierPO(deal, selectedQuote, financials) {
  const poNumber = `PO-SUP-${deal.token.replace("DEAL-", "")}`;
  return {
    poNumber,
    issueDate: new Date().toISOString().slice(0, 10),
    supplierName: selectedQuote.supplierName,
    supplierLocation: selectedQuote.supplierLocation,
    incoterms: financials.incoterms,
    currency: "USD",
    unitPriceUsd: selectedQuote.unitPriceUsd,
    quantity: deal.quantity,
    bomAddons: financials.activeBomItems.map((item) => ({
      sku: item.sku,
      name: item.name,
      qty: deal.quantity,
      unitCostUsd: item.unitCostUsd,
      lineTotalUsd: round2(item.unitCostUsd * deal.quantity),
    })),
    poTotalUsd: financials.baseUsd,
    poTotalAedRef: financials.baseAed,
    buyerBillTo: RESELLER_PROFILE.companyName,
    shipTo: RESELLER_PROFILE.warehouseShipTo,
    redactedFields: {
      endCustomerCompany: "[REDACTED — END-CLIENT MASKED]",
      endCustomerContact: "[REDACTED — END-CLIENT MASKED]",
      endCustomerEmail: "[REDACTED — ZERO-LEAKAGE POLICY]",
      endCustomerTrn: "[REDACTED — ZERO-LEAKAGE POLICY]",
    },
    complianceNotes: [
      `Warranty Region Required: ${selectedQuote.warrantyRegion}`,
      "Do NOT include supplier commercial invoice or pricing inside physical shipment carton.",
      "Deliver exclusively to Al Noor Enterprise Systems LLC consolidation dock.",
    ],
  };
}

export const INITIAL_DEALS = [
  {
    id: "deal-884",
    token: "DEAL-2026-884",
    title: "8x NVIDIA H100 80GB PCIe AI GPUs",
    category: "GPU Trading (Real-World Example)",
    sku: "NV-H100-80GB-PCIE-META",
    quantity: 8,
    specs: "80GB HBM3 Memory, PCIe Gen5, Dual-Slot Passive Cooling + Server Airflow Kit, 16-Pin Power Harnesses, Official 3-Year UAE/META Warranty",
    buyerCompany: "Gulf Horizon AI Labs",
    buyerName: "Tariq Al-Mansoori",
    buyerRole: "Head of AI Infrastructure",
    buyerEmail: "t.mansoori@gulfhorizon.ae",
    buyerPhone: "+971 50 412 8891",
    buyerLocation: "DIFC Innovation Hub, Dubai",
    buyerTrn: "100293847100003",
    receivedAt: "Fri 11:42 PM GST",
    channel: "WhatsApp + Email Inquiry",
    offHoursCaptured: true,
    shadowQuoteSeconds: 41,
    urgency: "CRITICAL",
    slaNote: "Monday 09:00 AM Cluster Deployment Cutoff",
    stage: "Ready for Your Approval",
    batchSweepStatus: "pending_review",
    targetMarginPct: 12,
    recommendedQuoteId: "q-884-meta",
    rawEnquiry:
      "Urgent Friday night request: need 8x NVIDIA H100 80GB PCIe GPUs for our Dubai AI cluster upgrade. Must be brand-new with official UAE warranty, power cables, and server cooling brackets, delivered to Dubai within 5 days. Need a ballpark tonight so our CFO can lock budget.",
    shadowQuoteSummary:
      "Instant 41-second ballpark quote drafted Friday night so the buyer didn't walk away. Caught a 'cheaper' US GPU broker whose missing cables, cooling kits, and 5% UAE import duty actually cost AED 24,668 MORE—with no UAE warranty.",
    supplierQuotes: [
      {
        id: "q-884-meta",
        supplierName: "Redington Gulf FZCO (Dubai)",
        supplierLocation: "JAFZA South, Dubai, UAE",
        unitPriceUsd: 27900,
        incoterms: "DDP",
        leadTime: "3 Business Days (In-Stock Dubai)",
        warrantyRegion: "Official UAE / META 3-Year Replacement Warranty",
        warrantyStatus: "compliant",
        recommended: true,
        notes: "Brand-new sealed UAE channel GPUs. Includes all 16-pin EPS-12V power harnesses, server airflow/cooling kits, and full local UAE warranty—with all import duties already paid.",
        missingBomItems: [],
      },
      {
        id: "q-884-us",
        supplierName: "Apex Overseas GPU Brokers",
        supplierLocation: "Miami, FL (Ships CIF to Dubai)",
        unitPriceUsd: 26200,
        incoterms: "CIF",
        leadTime: "9–12 Business Days + Customs Clearance",
        warrantyRegion: "US-Import Grey Market (No UAE Warranty)",
        warrantyStatus: "mismatch",
        recommended: false,
        notes: "Looks $1,700/GPU cheaper on paper, but hides missing GPU power cables, cooling brackets, 5% UAE import tax, and zero local warranty.",
        missingBomItems: [
          {
            id: "bom-gpu-power",
            sku: "NV-PWR-16PIN-KIT",
            name: "Server 16-Pin GPU Power Harness & Retention Bracket",
            unitCostUsd: 450,
            severity: "critical",
            reason: "Bare OEM cards ship without server power cables—cannot power on in the buyer's rack.",
            includedByDefault: true,
          },
          {
            id: "bom-gpu-cooling",
            sku: "NV-THERM-2U-KIT",
            name: "High-Airflow 2U Server Cooling Shroud & Thermal Kit",
            unitCostUsd: 380,
            severity: "critical",
            reason: "Passive H100 cards overheat without server-grade airflow baffles.",
            includedByDefault: true,
          },
          {
            id: "bom-gpu-rails",
            sku: "NV-RAIL-EXT-2U",
            name: "Heavy-Duty GPU Node Support Rails & UAE Power Cords",
            unitCostUsd: 320,
            severity: "warning",
            reason: "Omitted from overseas broker quote; required for safe rack installation in Dubai.",
            includedByDefault: true,
          },
        ],
      },
    ],
    negotiationScripts: [
      {
        label: "Explain Why the 'Cheaper' GPU Quote Costs More",
        scenario: "Buyer asks why a US broker quoted $26,200/GPU",
        script:
          "Tariq, we checked the overseas US-import GPU quote line by line—once you add the missing 16-pin power cables, server cooling kits ($1,150/card), and 5% UAE import duty at customs, that option actually lands AED 24,600+ higher and gives you zero UAE warranty if a card fails. Our Dubai stock is sealed, complete, and ready in 3 days.",
      },
      {
        label: "Lock GPU Stock Over the Weekend",
        scenario: "Buyer wants to hold pricing until Monday morning",
        script:
          "We placed a 48-hour hold on all 8 H100 GPUs in Dubai. You can review the clear AED quote (with 5% UAE VAT) and confirm your order directly in your Smart Deal Room link so we deliver Monday.",
      },
    ],
    telemetry: [
      { time: "Fri 11:42 PM", event: "Buyer WhatsApp & email GPU request captured after hours", type: "intake" },
      { time: "Fri 11:43 PM", event: "Instant 41-second ballpark quote drafted for buyer", type: "shadow" },
      { time: "Fri 11:43 PM", event: "Hidden trap caught: US GPU broker missing parts + 5% import tax + void warranty", type: "guardrail" },
      { time: "Sat 08:12 AM", event: "Buyer opened Smart Deal Room (privacy-safe first-party view)", type: "buyer" },
    ],
    poAccepted: false,
    poRejected: false,
    rejectionReason: "",
    rejectionNote: "",
    buyerPoNumber: "",
    chatMessages: [
      {
        id: "msg-884-1",
        sender: "buyer",
        senderLabel: "Tariq Al-Mansoori (Gulf Horizon AI Labs)",
        connector: "whatsapp",
        connectorDetail: "WhatsApp Business Connector (+971 50 412 8891)",
        time: "Fri 11:42 PM GST",
        text: "Urgent Friday night request: need 8x NVIDIA H100 80GB PCIe GPUs for our Dubai AI cluster upgrade. Must have official UAE warranty, power cables, and server cooling brackets, delivered within 5 days. Need a ballpark tonight so our CFO can lock budget before Monday.",
      },
      {
        id: "msg-884-2",
        sender: "platform",
        senderLabel: "Salemate Trading Desk",
        connector: "whatsapp",
        connectorDetail: "Auto-Synced via WhatsApp Cloud API · 41s Reply",
        time: "Fri 11:43 PM GST",
        text: "Hi Tariq — received! We checked live Dubai channel inventory and placed a 48-hour hold on 8 sealed UAE-warranty NVIDIA H100 80GB PCIe GPUs (complete with 16-pin power harnesses & server airflow kits). Your itemized AED quote (including 5% UAE VAT) is ready right here.",
      },
      {
        id: "msg-884-3",
        sender: "buyer",
        senderLabel: "Tariq Al-Mansoori (Gulf Horizon AI Labs)",
        connector: "email",
        connectorDetail: "Inbound Email Connector (t.mansoori@gulfhorizon.ae)",
        time: "Sat 08:12 AM GST",
        text: "Thanks for getting back to us on a Friday night! Quick question: an overseas broker sent us $26,200/GPU — why is your Dubai stock quoted slightly higher on paper?",
      },
      {
        id: "msg-884-4",
        sender: "platform",
        senderLabel: "Salemate Trading Desk",
        connector: "email",
        connectorDetail: "Delivered via Email Connector (Resend)",
        time: "Sat 08:13 AM GST",
        text: "Great question—we audited that overseas US-import quote line by line. Once you add the missing 16-pin GPU power cables, cooling shrouds ($1,150/card), and 5% UAE customs duty on arrival, the overseas quote actually lands AED 24,668 MORE—and carries zero NVIDIA UAE warranty. Our Dubai stock is sealed, complete, duty-paid, and ready in 3 business days.",
      },
    ],
  },
  {
    id: "deal-885",
    token: "DEAL-2026-885",
    title: "24x Cisco Catalyst C9300-48P-A (PoE+ Switches)",
    category: "Enterprise Networking",
    sku: "C9300-48P-A-META",
    quantity: 24,
    specs: "48-Port PoE+ (715W), Network Advantage, 8x10G SFP+ Uplink Module, StackWise-480, Dual Redundant PSU",
    buyerCompany: "Emirates FinTech Hub LLC",
    buyerName: "Nadia Al-Hashimi",
    buyerRole: "VP Technology Procurement",
    buyerEmail: "n.hashimi@emiratesfintech.ae",
    buyerPhone: "+971 52 774 3102",
    buyerLocation: "DIFC Gate Avenue, Dubai",
    buyerTrn: "100511290400003",
    receivedAt: "Sat 08:19 AM GST",
    channel: "Inbound Email RFQ",
    offHoursCaptured: true,
    shadowQuoteSeconds: 34,
    urgency: "HIGH",
    slaNote: "DIFC Floor Fit-Out Go-Live Next Week",
    stage: "Ready for Human Approval",
    batchSweepStatus: "pending_review",
    targetMarginPct: 12.5,
    recommendedQuoteId: "q-885-meta",
    rawEnquiry:
      "Morning — we need 24x Cisco Catalyst C9300-48P-A for our DIFC floor expansion. Must support 10G fiber uplinks, full stack redundancy, and official Cisco UAE SMARTnet registration. Please share AED pricing with 5% VAT.",
    shadowQuoteSummary:
      "Shadow Quote generated in 34s. Silent BOM Guardrail blocked US broker quote missing C9300-NM-8X uplink modules, secondary 715W PSUs, and StackWise-480 cables ($845/unit hidden cost).",
    supplierQuotes: [
      {
        id: "q-885-meta",
        supplierName: "Ingram Micro META",
        supplierLocation: "Dubai Airport Freezone (DAFZA), UAE",
        unitPriceUsd: 4180,
        incoterms: "DDP",
        leadTime: "4 Business Days (DAFZA Stock)",
        warrantyRegion: "Official UAE / META Cisco SMARTnet Eligible",
        warrantyStatus: "compliant",
        recommended: true,
        notes: "Authorized Cisco META distribution. Complete BOM including 8x10G SFP+ uplink module, redundant 715W PSU, and StackWise-480 stacking cables.",
        missingBomItems: [],
      },
      {
        id: "q-885-us",
        supplierName: "NetBridge Global Trading",
        supplierLocation: "Newark, NJ (CIF Jebel Ali)",
        unitPriceUsd: 3720,
        incoterms: "CIF",
        leadTime: "10–14 Business Days",
        warrantyRegion: "US-Import (Cisco SMARTnet UAE Blocked)",
        warrantyStatus: "mismatch",
        recommended: false,
        notes: "Grey-market US stock cannot be attached to UAE SMARTnet contracts and ships without 10G uplink modules or secondary power supplies.",
        missingBomItems: [
          {
            id: "bom-c9300-nm",
            sku: "C9300-NM-8X",
            name: "8x10G SFP+ Network Uplink Module",
            unitCostUsd: 440,
            severity: "critical",
            reason: "Base C9300 chassis ships with blank uplink slot; cannot connect to 10G fiber core.",
            includedByDefault: true,
          },
          {
            id: "bom-c9300-psu",
            sku: "PWR-C1-715WAC-P",
            name: "Secondary Redundant 715W AC Power Supply",
            unitCostUsd: 310,
            severity: "critical",
            reason: "Required for redundant PoE+ power across 48 access ports.",
            includedByDefault: true,
          },
          {
            id: "bom-c9300-stack",
            sku: "STACK-T1-50CM",
            name: "Cisco StackWise-480 50cm Stacking Cable",
            unitCostUsd: 95,
            severity: "warning",
            reason: "Missing stacking interconnect required for switch stack redundancy.",
            includedByDefault: true,
          },
        ],
      },
    ],
    negotiationScripts: [
      {
        label: "Explain Cisco UAE SMARTnet Compliance",
        scenario: "Procurement compares against online US broker pricing",
        script:
          "Nadia, Cisco enforces regional serial-number entitlement checks for DIFC financial institutions. US-import C9300 units fail UAE SMARTnet onboarding and ship without the C9300-NM-8X 10G module ($440/u) and secondary 715W PSU ($310/u). Our Ingram Micro META quote delivers complete, SMARTnet-verified units DDP Dubai in 4 business days.",
      },
      {
        label: "Fast-Track Split Delivery",
        scenario: "Buyer needs first 8 switches immediately",
        script:
          "We can deliver the first 8 units to DIFC within 48 hours of PO confirmation and the remaining 16 units on Day 4, under one consolidated 5% UAE VAT tax invoice.",
      },
    ],
    telemetry: [
      { time: "Sat 08:19 AM", event: "Weekend RFQ captured via Resend Inbound", type: "intake" },
      { time: "Sat 08:20 AM", event: "Zero-Wait Shadow Quote generated in 34s", type: "shadow" },
      { time: "Sat 08:20 AM", event: "Silent BOM flagged $845/u missing Cisco modules & SMARTnet block", type: "guardrail" },
    ],
    poAccepted: false,
    buyerPoNumber: "",
  },
  {
    id: "deal-886",
    token: "DEAL-2026-886",
    title: "Fast-Path Ballpark: 6x HPE ProLiant DL380 Gen11",
    category: "Fast-Path Triage",
    sku: "P52534-B21-META",
    quantity: 6,
    specs: "Intel Xeon Silver 4416+, 128GB DDR5, 2x 960GB SSD, MR408i-o, Dual 800W PSU, iLO 6 Advanced",
    buyerCompany: "Desert Peak Energy Services",
    buyerName: "Rami Haddad",
    buyerRole: "IT Operations Manager",
    buyerEmail: "r.haddad@desertpeak.ae",
    buyerPhone: "+971 55 901 6640",
    buyerLocation: "Mussafah Industrial Area, Abu Dhabi",
    buyerTrn: "100377829100003",
    receivedAt: "Sun 02:14 AM GST",
    channel: "WhatsApp / Fast-Path Triage",
    offHoursCaptured: true,
    shadowQuoteSeconds: 28,
    urgency: "FAST-PATH",
    slaNote: "Overnight Budgetary Ballpark Triage",
    stage: "Shadow Quote Ready",
    batchSweepStatus: "pending_review",
    targetMarginPct: 15,
    recommendedQuoteId: "q-886-meta",
    rawEnquiry:
      "Quick budgetary ballpark for 6x HPE DL380 Gen11 for Abu Dhabi SCADA cluster. Need rough AED landed number with VAT tonight so we can get management green light tomorrow morning.",
    shadowQuoteSummary:
      "Fast-Path Ballpark triage completed in 28s using historical UAE META tier-1 distributor pricing. Optional 2U Easy Install Rail Kit flagged for pre-PO verification.",
    supplierQuotes: [
      {
        id: "q-886-meta",
        supplierName: "Mindware Distribution UAE",
        supplierLocation: "Dubai / Abu Dhabi Delivery",
        unitPriceUsd: 5450,
        incoterms: "DDP",
        leadTime: "5 Business Days (DDP Abu Dhabi)",
        warrantyRegion: "Official UAE / META HPE Pointnext 3Y",
        warrantyStatus: "compliant",
        recommended: true,
        notes: "Authorized HPE META distributor pricing. Toggle optional 2U Easy Install Rail Kit below if rack rails are not already installed in SCADA cabinet.",
        missingBomItems: [
          {
            id: "bom-dl380-rails",
            sku: "P52341-B21",
            name: "HPE 2U Easy Install Sliding Rail Kit",
            unitCostUsd: 120,
            severity: "warning",
            reason: "Verify whether existing SCADA rack has HPE Gen11 rails; recommended to include by default.",
            includedByDefault: true,
          },
        ],
      },
    ],
    negotiationScripts: [
      {
        label: "Convert Fast-Path Ballpark to Firm Quote",
        scenario: "Buyer approves ballpark budget on Sunday morning",
        script:
          "Rami, glad the overnight AED ballpark helped secure sign-off. Our Mindware UAE allocation is live DDP Abu Dhabi with HPE 3Y META warranty and sliding rail kits included—click Approve in the Smart Deal Room to lock stock.",
      },
    ],
    telemetry: [
      { time: "Sun 02:14 AM", event: "Overnight Fast-Path triage request captured", type: "intake" },
      { time: "Sun 02:14 AM", event: "Zero-Wait Ballpark Quote generated in 28s", type: "shadow" },
      { time: "Sun 02:15 AM", event: "Silent BOM advisory: HPE 2U sliding rail kit added by default", type: "guardrail" },
    ],
    poAccepted: false,
    buyerPoNumber: "",
  },
];

/**
 * In-memory server/client store with globalThis persistence for Next.js App Router API routes.
 */
function initStore() {
  if (!globalThis.__salemateV3Store) {
    globalThis.__salemateV3Store = {
      deals: JSON.parse(JSON.stringify(INITIAL_DEALS)),
      dispatchedEmails: [],
    };
  }
  return globalThis.__salemateV3Store;
}

export function getStoreDeals() {
  return initStore().deals;
}

export function getDealByToken(token) {
  const deals = initStore().deals;
  return deals.find((d) => d.token.toLowerCase() === String(token || "").toLowerCase()) || null;
}

export function addDealToStore(newDeal) {
  const store = initStore();
  store.deals = [newDeal, ...store.deals];
  return newDeal;
}

export function recordDealTelemetry(token, eventText, type = "buyer") {
  const deal = getDealByToken(token);
  if (!deal) return null;
  const timeLabel = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  deal.telemetry.unshift({ time: `${timeLabel} GST`, event: eventText, type });
  return deal;
}

export function acceptDealPO(token, buyerPoNumber, approverName) {
  const deal = getDealByToken(token);
  if (!deal) return null;
  deal.poAccepted = true;
  deal.poRejected = false;
  deal.rejectionReason = "";
  deal.rejectionNote = "";
  deal.buyerPoNumber = buyerPoNumber || `PO-BUYER-${Math.floor(1000 + Math.random() * 9000)}`;
  deal.stage = "PO Accepted — Ready for Dispatch";
  deal.batchSweepStatus = "approved";
  if (!Array.isArray(deal.chatMessages)) deal.chatMessages = [];
  deal.chatMessages.push({
    id: `msg-acc-${Date.now()}`,
    sender: "buyer",
    senderLabel: `${approverName || deal.buyerName} (${deal.buyerCompany})`,
    connector: "email",
    connectorDetail: "Quote Approved • Synced to Email & WhatsApp",
    time: "Just Now",
    text: `Approved this quote and issued Purchase Order ${deal.buyerPoNumber}. Please confirm dispatch schedule and 5% UAE VAT tax invoice.`,
  });
  deal.chatMessages.push({
    id: `msg-acc-rep-${Date.now() + 1}`,
    sender: "platform",
    senderLabel: "Salemate Trading Desk",
    connector: "whatsapp",
    connectorDetail: "Auto-Synced via WhatsApp + Email Connectors",
    time: "Just Now",
    text: `Confirmed! Purchase Order ${deal.buyerPoNumber} is locked. Our UAE trading desk is releasing your masked fulfillment order now and preparing your 5% UAE VAT tax invoice.`,
  });
  recordDealTelemetry(
    token,
    `Buyer (${approverName || deal.buyerName}) accepted quote & issued ${deal.buyerPoNumber}`,
    "accepted"
  );
  return deal;
}

export function rejectDealQuote(token, reason, note, buyerName) {
  const deal = getDealByToken(token);
  if (!deal) return null;
  deal.poAccepted = false;
  deal.poRejected = true;
  deal.rejectionReason = reason || "Price above budget";
  deal.rejectionNote = String(note || "").trim();
  deal.stage = `Declined by Buyer (${deal.rejectionReason})`;
  if (!Array.isArray(deal.chatMessages)) deal.chatMessages = [];
  deal.chatMessages.push({
    id: `msg-rej-${Date.now()}`,
    sender: "buyer",
    senderLabel: `${buyerName || deal.buyerName} (${deal.buyerCompany})`,
    connector: "email",
    connectorDetail: "Quote Declined • Synced to Email & WhatsApp",
    time: "Just Now",
    text: `Declined current quote — Reason: ${deal.rejectionReason}.${deal.rejectionNote ? ` Note: "${deal.rejectionNote}"` : ""}`,
  });
  deal.chatMessages.push({
    id: `msg-rej-rep-${Date.now() + 1}`,
    sender: "platform",
    senderLabel: "Salemate Trading Desk",
    connector: "whatsapp",
    connectorDetail: "Synced via WhatsApp + Email Connectors",
    time: "Just Now",
    text: `Understood, thank you for the clear feedback (${deal.rejectionReason}). We've paused the stock hold and alerted our human trading team—reply here anytime if you'd like us to re-quote an alternative option or volume discount.`,
  });
  recordDealTelemetry(
    token,
    `Buyer declined quote (${deal.rejectionReason})`,
    "rejected"
  );
  return deal;
}

export function reopenDealQuote(token) {
  const deal = getDealByToken(token);
  if (!deal) return null;
  deal.poRejected = false;
  deal.stage = "Re-opened by Buyer for Review";
  recordDealTelemetry(token, "Buyer reopened quote to reconsider or request revision", "buyer");
  return deal;
}

export function appendDealChatMessage(token, { text, connector = "whatsapp", senderName }) {
  const deal = getDealByToken(token);
  if (!deal) return null;
  const cleanText = String(text || "").trim();
  if (!cleanText) return deal;
  if (!Array.isArray(deal.chatMessages)) deal.chatMessages = [];

  const isEmail = connector === "email";
  deal.chatMessages.push({
    id: `msg-b-${Date.now()}`,
    sender: "buyer",
    senderLabel: `${senderName || deal.buyerName} (${deal.buyerCompany})`,
    connector: isEmail ? "email" : "whatsapp",
    connectorDetail: isEmail
      ? `Sent via Email Connector (${deal.buyerEmail})`
      : `Sent via WhatsApp Business Connector (${deal.buyerPhone})`,
    time: "Just Now",
    text: cleanText,
  });

  // Deterministic, helpful platform reply routed back via the same connector
  let replyText =
    "Got your message! Our UAE trading desk has been notified via Salemate. Any pricing or delivery update will be confirmed by a human trader right back here in this thread.";
  if (/discount|cheaper|price|budget|lower|revise/i.test(cleanText)) {
    replyText =
      "Thanks for flagging your budget target. I've notified our human trading desk to check if a fast-close volume rebate is available on our Dubai stock—we'll send a revised human-approved figure right back in this thread shortly.";
  } else if (/deliver|monday|when|ship|time|days|fast/i.test(cleanText)) {
    replyText =
      "Our Dubai JAFZA stock is physically sealed and ready—once your PO is approved, we can deliver DDP directly to your Dubai site within 3 business days (or arrange priority Monday morning drop-off).";
  } else if (/warranty|official|uae|meta|support/i.test(cleanText)) {
    replyText =
      "Every unit is factory-sealed Official UAE / META channel stock—100% eligible for 3-Year local UAE replacement warranty with serial numbers verified prior to delivery.";
  } else if (/po|approve|ready|confirm|order/i.test(cleanText)) {
    replyText =
      "Wonderful! Just enter your PO number in the Approve card on the right (or reply with your PO # here) and we will lock stock allocation and issue your 5% UAE VAT tax invoice immediately.";
  }

  deal.chatMessages.push({
    id: `msg-p-${Date.now() + 1}`,
    sender: "platform",
    senderLabel: "Salemate Platform Concierge",
    connector: isEmail ? "email" : "whatsapp",
    connectorDetail: isEmail
      ? "Synced via Email Connector (Resend)"
      : "Synced via WhatsApp Cloud API",
    time: "Just Now",
    text: replyText,
  });

  recordDealTelemetry(
    token,
    `Buyer messaged via ${isEmail ? "Email" : "WhatsApp"} Connector`,
    "buyer"
  );
  return deal;
}

/**
 * ============================================================================
 * ZERO-LEAKAGE SELLER / SUPPLIER PARTNER PORTAL DATA
 * Strictly enforces:
 * - Shows ONLY the sales/payout amount Salemate generated for the seller
 * - NEVER includes end-customer name, company, email, phone, location, or TRN
 * - NEVER includes Salemate's cut/margin/profit or the customer's selling price
 * ============================================================================
 */
export const SELLER_PARTNERS = [
  {
    id: "seller_redington",
    sellerName: "Redington Gulf FZCO",
    location: "JAFZA South, Dubai, UAE",
    partnerTier: "Official UAE / META Channel Partner",
    category: "AI GPUs & Enterprise Servers",
    consolidationDock: "Salemate Partner Consolidation Bay 4 — JAFZA, Dubai",
    historicalOrders: [
      {
        orderRef: "SLM-PO-2026-879",
        date: "Nov 18, 2026",
        item: "8x NVIDIA H100 80GB PCIe AI GPUs (UAE Channel Kit)",
        quantity: 8,
        incoterms: "DDP Dubai",
        sellerPayoutUsd: 223200,
        status: "Settled & Paid",
        readyConfirmed: true,
      },
      {
        orderRef: "SLM-PO-2026-871",
        date: "Nov 12, 2026",
        item: "10x Dell PowerEdge R750 2U Rack Servers (Complete META Kit)",
        quantity: 10,
        incoterms: "DDP Dubai",
        sellerPayoutUsd: 69800,
        status: "Settled & Paid",
        readyConfirmed: true,
      },
      {
        orderRef: "SLM-PO-2026-864",
        date: "Nov 04, 2026",
        item: "4x NVIDIA RTX 5090 32GB Workstation GPUs (UAE Sealed)",
        quantity: 4,
        incoterms: "DDP Dubai",
        sellerPayoutUsd: 11200,
        status: "Delivered — Payment Scheduled",
        readyConfirmed: true,
      },
    ],
  },
  {
    id: "seller_ingram",
    sellerName: "Ingram Micro META",
    location: "DAFZA Freezone, Dubai, UAE",
    partnerTier: "Authorized Cisco & Enterprise Partner",
    category: "Enterprise Networking & Switches",
    consolidationDock: "Salemate Partner Consolidation Bay 2 — DAFZA, Dubai",
    historicalOrders: [
      {
        orderRef: "SLM-PO-2026-885",
        date: "Nov 21, 2026",
        item: "24x Cisco Catalyst C9300-48P-A Complete Bundles (UAE SMARTnet)",
        quantity: 24,
        incoterms: "DDP Dubai",
        sellerPayoutUsd: 100320,
        status: "Confirmed PO — Ready for Blind Drop-Ship",
        readyConfirmed: false,
      },
      {
        orderRef: "SLM-PO-2026-858",
        date: "Nov 02, 2026",
        item: "12x Cisco SFP-10G-SR-S= Genuine Transceiver Packs",
        quantity: 12,
        incoterms: "DDP Dubai",
        sellerPayoutUsd: 3104,
        status: "Settled & Paid",
        readyConfirmed: true,
      },
    ],
  },
  {
    id: "seller_mindware",
    sellerName: "Mindware Distribution UAE",
    location: "Dubai / Abu Dhabi Hub, UAE",
    partnerTier: "Authorized HPE & Storage Distributor",
    category: "Enterprise Compute & Storage",
    consolidationDock: "Salemate Partner Consolidation Bay 4 — JAFZA, Dubai",
    historicalOrders: [
      {
        orderRef: "SLM-PO-2026-886",
        date: "Nov 22, 2026",
        item: "6x HPE ProLiant DL380 Gen11 + 2U Sliding Rail Kits",
        quantity: 6,
        incoterms: "DDP Abu Dhabi",
        sellerPayoutUsd: 33420,
        status: "Allocation Reserved — Awaiting Final PO",
        readyConfirmed: false,
      },
      {
        orderRef: "SLM-PO-2026-852",
        date: "Oct 29, 2026",
        item: "16x Enterprise 3.84TB NVMe U.2 Storage Drives",
        quantity: 16,
        incoterms: "DDP Dubai",
        sellerPayoutUsd: 19550,
        status: "Settled & Paid",
        readyConfirmed: true,
      },
    ],
  },
];

function getSellerDispatchState() {
  if (!globalThis.__salemateSellerConfirmations) {
    globalThis.__salemateSellerConfirmations = {};
  }
  return globalThis.__salemateSellerConfirmations;
}

export function confirmSellerOrderReady(orderRef) {
  const map = getSellerDispatchState();
  map[orderRef] = true;
  return true;
}

/**
 * Returns strictly zero-leakage sales metrics & order ledger for a Seller Partner.
 * Explicitly NEVER returns customer data, reseller margin/cut, or customer selling price.
 */
export function getSellerPortalData(sellerId = "seller_redington") {
  const partner =
    SELLER_PARTNERS.find((s) => s.id === sellerId) || SELLER_PARTNERS[0];
  const confirmations = getSellerDispatchState();
  const liveDeals = getStoreDeals();

  // Pull in live flagship GPU order for Redington dynamically (payout = wholesale USD ONLY, NEVER sell price!)
  const dynamicOrders = [];
  if (partner.id === "seller_redington") {
    const gpuDeal = liveDeals.find((d) => d.token === "DEAL-2026-884");
    if (gpuDeal) {
      const q = gpuDeal.supplierQuotes[0];
      const sellerPayoutUsd = round2(q.unitPriceUsd * gpuDeal.quantity);
      const orderRef = "SLM-PO-2026-884";
      dynamicOrders.push({
        orderRef,
        date: "Live Active Order",
        item: `${gpuDeal.title} (${q.warrantyRegion})`,
        quantity: gpuDeal.quantity,
        incoterms: q.incoterms,
        sellerPayoutUsd,
        sellerPayoutAed: round2(sellerPayoutUsd * USD_TO_AED),
        status: gpuDeal.poAccepted
          ? "Confirmed PO — Ready for Blind Dispatch"
          : gpuDeal.poRejected
          ? "On Hold — Buyer Requested Revision"
          : "Pending Final Buyer Confirmation",
        readyConfirmed: Boolean(confirmations[orderRef]),
        endBuyerMasked: "[PROTECTED BY SALEMATE]",
        shipToDock: partner.consolidationDock,
      });
    }
  }

  const staticOrders = partner.historicalOrders.map((ord) => ({
    orderRef: ord.orderRef,
    date: ord.date,
    item: ord.item,
    quantity: ord.quantity,
    incoterms: ord.incoterms,
    sellerPayoutUsd: ord.sellerPayoutUsd,
    sellerPayoutAed: round2(ord.sellerPayoutUsd * USD_TO_AED),
    status: confirmations[ord.orderRef]
      ? "Confirmed Ready for Blind Pickup"
      : ord.status,
    readyConfirmed: Boolean(ord.readyConfirmed || confirmations[ord.orderRef]),
    endBuyerMasked: "[PROTECTED BY SALEMATE]",
    shipToDock: partner.consolidationDock,
  }));

  const orders = [...dynamicOrders, ...staticOrders];
  const activeOrders = orders.filter((o) => !o.status.startsWith("On Hold"));
  const totalSalesMadeUsd = round2(
    activeOrders.reduce((sum, o) => sum + o.sellerPayoutUsd, 0)
  );
  const totalSalesMadeAed = round2(totalSalesMadeUsd * USD_TO_AED);
  const settledUsd = round2(
    orders
      .filter((o) => o.status.includes("Settled") || o.status.includes("Paid"))
      .reduce((sum, o) => sum + o.sellerPayoutUsd, 0)
  );
  const settledAed = round2(settledUsd * USD_TO_AED);
  const totalUnitsMoved = activeOrders.reduce((sum, o) => sum + o.quantity, 0);

  return {
    seller: {
      id: partner.id,
      sellerName: partner.sellerName,
      location: partner.location,
      partnerTier: partner.partnerTier,
      category: partner.category,
      consolidationDock: partner.consolidationDock,
    },
    availableSellers: SELLER_PARTNERS.map((s) => ({
      id: s.id,
      sellerName: s.sellerName,
      category: s.category,
    })),
    summary: {
      totalSalesMadeUsd,
      totalSalesMadeAed,
      settledUsd,
      settledAed,
      ordersCount: activeOrders.length,
      totalUnitsMoved,
      exchangeRate: USD_TO_AED,
    },
    privacyGuarantee: {
      customerDataExposed: false,
      platformCutExposed: false,
      endSellingPriceExposed: false,
    },
    orders,
  };
}

export function recordDispatchedEmail(entry) {
  const store = initStore();
  store.dispatchedEmails.unshift(entry);
  return entry;
}

/**
 * Deterministic pitch-safe parser fallback when GEMINI_API_KEY is unset.
 * Extracts quantity, hardware title, unit USD price, incoterms, warranty region,
 * and Silent BOM risks without ever crashing the live demo.
 */
export function deterministicParseRfqText(rawText, senderEmail = "procurement@uae-enterprise.ae", senderName = "Inbound Buyer") {
  const text = String(rawText || "").trim();
  const qtyMatch = text.match(/(\d+)\s*(?:x|units?|pcs|servers?|switches?)/i);
  const quantity = qtyMatch ? Math.min(500, Math.max(1, parseInt(qtyMatch[1], 10))) : 8;

  const priceMatch = text.match(/\$\s*([\d,]+(?:\.\d+)?)|USD\s*([\d,]+(?:\.\d+)?)/i);
  const rawPrice = priceMatch ? parseFloat((priceMatch[1] || priceMatch[2]).replace(/,/g, "")) : 0;

  const isCisco = /cisco|catalyst|c9300|c9200|nexus|switch/i.test(text);
  const isHpe = /hpe|proliant|dl380|dl360/i.test(text);
  const isDell = /dell|poweredge|r750|r650|r760/i.test(text);
  const isCif = /\bCIF\b|miami|us[-\s]?import|new\s*jersey|air\s*freight|grey\s*market/i.test(text);
  const isUsWarranty = /us[-\s]?import|us\s*warranty|grey\s*market|no\s*uae/i.test(text);

  let hardwareName = "Enterprise Rack Server Bundle";
  let category = "Compute & Data Center";
  let defaultUnitUsd = 5850;
  let sku = "ENT-HW-2026";

  if (isCisco) {
    hardwareName = "Cisco Catalyst C9300-48P-A Switches";
    category = "Enterprise Networking";
    defaultUnitUsd = 3950;
    sku = "C9300-48P-A";
  } else if (isHpe) {
    hardwareName = "HPE ProLiant DL380 Gen11 Servers";
    category = "Compute & Data Center";
    defaultUnitUsd = 5490;
    sku = "P52534-B21";
  } else if (isDell) {
    hardwareName = "Dell PowerEdge R750 2U Servers";
    category = "Compute & Data Center";
    defaultUnitUsd = 6420;
    sku = "DELL-PER750";
  }

  const unitPriceUsd = rawPrice >= 200 ? rawPrice : defaultUnitUsd;
  const missingBomItems = [];

  if (!isCisco || /server|rack|dell|hpe/i.test(text)) {
    if (/no\s*rail|without\s*rail|missing\s*rail|bare|cif|us/i.test(text) || !/rail/i.test(text)) {
      missingBomItems.push({
        id: `bom-rails-${Date.now()}`,
        sku: "RAIL-2U-SLIDE",
        name: "2U Sliding Rack Rail Kit",
        unitCostUsd: 145,
        severity: "critical",
        reason: "Silent BOM Guardrail: Rack rails not explicitly listed in quote.",
        includedByDefault: true,
      });
    }
    if (/single\s*psu|no\s*redundant|without\s*psu|cif|us/i.test(text) || !/dual\s*psu|redundant/i.test(text)) {
      missingBomItems.push({
        id: `bom-psu-${Date.now()}`,
        sku: "PSU-1400W-RED",
        name: "2nd Redundant Hot-Plug Power Supply",
        unitCostUsd: 290,
        severity: "critical",
        reason: "Silent BOM Guardrail: Redundant PSU not confirmed for enterprise uptime.",
        includedByDefault: true,
      });
    }
  } else {
    missingBomItems.push({
      id: `bom-uplink-${Date.now()}`,
      sku: "C9300-NM-8X",
      name: "8x10G SFP+ Fiber Uplink Module",
      unitCostUsd: 440,
      severity: "critical",
      reason: "Silent BOM Guardrail: 10G uplink module omitted from base switch quote.",
      includedByDefault: true,
    });
  }

  const tokenNum = Math.floor(890 + Math.random() * 100);
  const token = `DEAL-2026-${tokenNum}`;
  const incoterms = isCif ? "CIF" : "DDP";
  const warrantyStatus = isUsWarranty || isCif ? "mismatch" : "compliant";
  const warrantyRegion =
    warrantyStatus === "mismatch"
      ? "US-Import (UAE On-Site Warranty Unverified)"
      : "Official UAE / META ProSupport Eligible";

  const supplierQuotes = [
    {
      id: `q-${tokenNum}-parsed`,
      supplierName: isCif ? "Parsed External CIF Broker" : "Parsed UAE META Supplier",
      supplierLocation: isCif ? "US Export Hub (CIF Dubai)" : "Dubai Freezone, UAE",
      unitPriceUsd,
      incoterms,
      leadTime: isCif ? "8–12 Business Days + Customs" : "3–5 Business Days DDP Dubai",
      warrantyRegion,
      warrantyStatus,
      recommended: warrantyStatus === "compliant",
      notes: `Extracted via Salemate Intake Parser (${incoterms} ${formatUSD(unitPriceUsd)}/unit).`,
      missingBomItems,
    },
  ];

  // If the parsed quote was CIF/US-import, also provide an automatic UAE META benchmark quote
  if (isCif || warrantyStatus === "mismatch") {
    supplierQuotes.unshift({
      id: `q-${tokenNum}-meta`,
      supplierName: "UAE META Channel Benchmark (Redington / Ingram)",
      supplierLocation: "Dubai, UAE (DDP)",
      unitPriceUsd: round2(unitPriceUsd * 1.09),
      incoterms: "DDP",
      leadTime: "3–4 Business Days (Local Stock)",
      warrantyRegion: "Official UAE / META ProSupport 3Y",
      warrantyStatus: "compliant",
      recommended: true,
      notes: "Auto-matched UAE META distributor benchmark with full BOM & local warranty.",
      missingBomItems: [],
    });
  }

  return {
    id: `deal-${tokenNum}`,
    token,
    title: `${quantity}x ${hardwareName}`,
    category,
    sku,
    quantity,
    specs: text.slice(0, 140) + (text.length > 140 ? "..." : ""),
    buyerCompany: senderEmail.includes("@")
      ? senderEmail.split("@")[1].split(".")[0].toUpperCase() + " Holdings UAE"
      : "Dubai Enterprise Buyer LLC",
    buyerName: senderName || "Procurement Desk",
    buyerRole: "IT Procurement",
    buyerEmail: senderEmail || "procurement@uae-enterprise.ae",
    buyerPhone: "+971 50 555 0194",
    buyerLocation: "Dubai, UAE",
    buyerTrn: "100492018300003",
    receivedAt: "Just Now (Live Intake)",
    channel: "Live AI Parse / Inbound",
    offHoursCaptured: true,
    shadowQuoteSeconds: 19,
    urgency: "HIGH",
    slaNote: "Live Parsed — Zero-Wait Shadow Quote Ready",
    stage: "Ready for Human Approval",
    batchSweepStatus: "pending_review",
    targetMarginPct: 14,
    recommendedQuoteId: supplierQuotes[0].id,
    rawEnquiry: text,
    shadowQuoteSummary: `Parsed ${quantity}x ${hardwareName} in <20s. Normalized ${incoterms} incoterms to AED (1 USD = 3.6725 AED) and attached ${missingBomItems.length} Silent BOM guardrail checks.`,
    supplierQuotes,
    negotiationScripts: [
      {
        label: "Landed Cost & Warranty Justification",
        scenario: "Buyer compares unit USD against US-import broker",
        script: `Our quote normalizes 5% UAE CIF duty, missing rack/power accessories, and guarantees official UAE / META warranty coverage with DDP delivery and 5% FTA-compliant UAE VAT invoicing.`,
      },
    ],
    telemetry: [
      { time: "Just Now", event: "RFQ parsed & normalized via Salemate Intake Agent", type: "intake" },
      { time: "Just Now", event: "Zero-Wait Shadow Quote generated in 19s", type: "shadow" },
      {
        time: "Just Now",
        event: `Silent BOM Guardrail checked ${missingBomItems.length} physical dependencies`,
        type: "guardrail",
      },
    ],
    poAccepted: false,
    buyerPoNumber: "",
  };
}

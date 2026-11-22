import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  addDealToStore,
  calculateQuoteFinancials,
  deterministicParseRfqText,
  round2,
} from "@/lib/store";

export async function POST(request) {
  try {
    const body = await request.json();
    const rawText = String(body?.text || "").trim();
    const senderEmail = body?.senderEmail || "procurement@uae-enterprise.ae";
    const senderName = body?.senderName || "UAE Procurement Lead";

    if (!rawText) {
      return NextResponse.json(
        { error: "Please paste an RFQ or supplier quote to analyze." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let parsedDeal = null;
    let mode = "demo_fallback";

    if (apiKey && apiKey.trim().length > 5) {
      try {
        const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
        const prompt = `You are Salemate v3's B2B IT Hardware Intake & Silent BOM Agent for UAE resellers.
Extract structured data from this messy customer RFQ or supplier quote.
CRITICAL: Do NOT calculate AED conversions, customs duties, or UAE VAT—JavaScript handles all financial math deterministically.
Return ONLY valid JSON matching this schema:
{
  "hardwareTitle": "string (e.g. Dell PowerEdge R750 2U Servers)",
  "sku": "string",
  "category": "string",
  "quantity": number,
  "specs": "string",
  "buyerCompany": "string",
  "buyerName": "string",
  "supplierName": "string",
  "unitPriceUsd": number,
  "incoterms": "CIF" | "DDP",
  "warrantyRegion": "string",
  "warrantyStatus": "compliant" | "mismatch",
  "missingBomItems": [
    {
      "sku": "string",
      "name": "string",
      "unitCostUsd": number,
      "severity": "critical" | "warning",
      "reason": "string"
    }
  ]
}

Input Text:
"""
${rawText}
"""`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const jsonText = response.text;
        const extracted = JSON.parse(jsonText);

        const tokenNum = Math.floor(900 + Math.random() * 99);
        const token = `DEAL-2026-${tokenNum}`;
        const incoterms = String(extracted.incoterms || "DDP").toUpperCase().startsWith("CIF")
          ? "CIF"
          : "DDP";
        const unitPriceUsd = Math.max(100, Number(extracted.unitPriceUsd) || 5500);
        const quantity = Math.max(1, Number(extracted.quantity) || 5);
        const bomItems = Array.isArray(extracted.missingBomItems)
          ? extracted.missingBomItems.map((item, idx) => ({
              id: `bom-ai-${tokenNum}-${idx}`,
              sku: item.sku || `BOM-${idx + 1}`,
              name: item.name || "Missing Hardware Accessory",
              unitCostUsd: Math.max(10, Number(item.unitCostUsd) || 150),
              severity: item.severity === "warning" ? "warning" : "critical",
              reason: item.reason || "Flagged by Silent BOM Guardrail.",
              includedByDefault: true,
            }))
          : [];

        const supplierQuotes = [
          {
            id: `q-${tokenNum}-ai`,
            supplierName: extracted.supplierName || (incoterms === "CIF" ? "External CIF Broker" : "UAE META Supplier"),
            supplierLocation: incoterms === "CIF" ? "International Export (CIF Dubai)" : "Dubai, UAE (DDP)",
            unitPriceUsd,
            incoterms,
            leadTime: incoterms === "CIF" ? "9–12 Business Days" : "3–5 Business Days",
            warrantyRegion:
              extracted.warrantyRegion ||
              (extracted.warrantyStatus === "mismatch"
                ? "US-Import (No UAE On-Site Support)"
                : "Official UAE / META Warranty"),
            warrantyStatus: extracted.warrantyStatus === "mismatch" || incoterms === "CIF" ? "mismatch" : "compliant",
            recommended: extracted.warrantyStatus !== "mismatch" && incoterms !== "CIF",
            notes: "Extracted live via Gemini 2.5 Flash; all AED, duty, and 5% VAT math computed deterministically.",
            missingBomItems: bomItems,
          },
        ];

        if (incoterms === "CIF" || extracted.warrantyStatus === "mismatch") {
          supplierQuotes.unshift({
            id: `q-${tokenNum}-meta-bench`,
            supplierName: "Official UAE META Channel Benchmark",
            supplierLocation: "JAFZA / DAFZA, Dubai, UAE",
            unitPriceUsd: round2(unitPriceUsd * 1.09),
            incoterms: "DDP",
            leadTime: "3–4 Business Days",
            warrantyRegion: "Official UAE / META ProSupport 3Y",
            warrantyStatus: "compliant",
            recommended: true,
            notes: "Auto-benchmarked local UAE DDP option with complete BOM & regional warranty.",
            missingBomItems: [],
          });
        }

        parsedDeal = {
          id: `deal-${tokenNum}`,
          token,
          title: `${quantity}x ${extracted.hardwareTitle || "IT Hardware RFQ"}`,
          category: extracted.category || "Enterprise Hardware",
          sku: extracted.sku || "SKU-AI-PARSED",
          quantity,
          specs: extracted.specs || rawText.slice(0, 140),
          buyerCompany: extracted.buyerCompany || "UAE Enterprise Client LLC",
          buyerName: extracted.buyerName || senderName,
          buyerRole: "IT Procurement",
          buyerEmail: senderEmail,
          buyerPhone: "+971 50 555 0199",
          buyerLocation: "Dubai, UAE",
          buyerTrn: "100492018300003",
          receivedAt: "Just Now (Gemini 2.5 Flash)",
          channel: "Live AI Parse",
          offHoursCaptured: true,
          shadowQuoteSeconds: 14,
          urgency: "HIGH",
          slaNote: "Live Gemini 2.5 Flash Parse Complete",
          stage: "Ready for Human Approval",
          batchSweepStatus: "pending_review",
          targetMarginPct: 14,
          recommendedQuoteId: supplierQuotes[0].id,
          rawEnquiry: rawText,
          shadowQuoteSummary: `Live Gemini 2.5 Flash parsed ${quantity}x ${extracted.hardwareTitle}. Deterministic UAE engine calculated AED landed cost (3.6725 peg) & 5% VAT.`,
          supplierQuotes,
          negotiationScripts: [
            {
              label: "Defend Complete BOM & UAE Warranty",
              scenario: "Buyer compares headline USD price",
              script:
                "Our UAE DDP quotation includes official META regional warranty, zero surprise 5% CIF customs duty, and verified physical accessories ready for immediate deployment.",
            },
          ],
          telemetry: [
            { time: "Just Now", event: "Live Gemini 2.5 Flash JSON extraction succeeded", type: "intake" },
            { time: "Just Now", event: "Deterministic UAE AED + 5% VAT math applied", type: "shadow" },
            { time: "Just Now", event: `Silent BOM audited ${bomItems.length} accessory risks`, type: "guardrail" },
          ],
          poAccepted: false,
          buyerPoNumber: "",
        };
        mode = "gemini_live";
      } catch (aiErr) {
        console.warn("Gemini live parse fallback triggered:", aiErr?.message);
        parsedDeal = deterministicParseRfqText(rawText, senderEmail, senderName);
        mode = "demo_fallback";
      }
    } else {
      parsedDeal = deterministicParseRfqText(rawText, senderEmail, senderName);
      mode = "demo_fallback";
    }

    addDealToStore(parsedDeal);
    const primaryQuote = parsedDeal.supplierQuotes[0];
    const financials = calculateQuoteFinancials(
      primaryQuote,
      parsedDeal.quantity,
      parsedDeal.targetMarginPct
    );

    return NextResponse.json({
      ok: true,
      mode,
      deal: parsedDeal,
      financials,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to parse RFQ" },
      { status: 500 }
    );
  }
}

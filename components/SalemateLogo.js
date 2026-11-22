"use client";

/**
 * Official Salemate Brand Logo Component
 * Uses the authentic Salemate icon & wordmark extracted from the official brand asset.
 * - variant="dark": For dark headers/surfaces (renders crisp transparent logo with white wordmark)
 * - variant="light": For light surfaces (pairs the official icon in a dark pill with deep ink wordmark)
 */
export default function SalemateLogo({ variant = "light", size = "md", showWordmark = true }) {
  const heightMap = {
    sm: "h-7",
    md: "h-8",
    lg: "h-10",
  };
  const iconSizeMap = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7",
  };
  const textSizeMap = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  if (variant === "dark" && showWordmark) {
    return (
      <span className="inline-flex items-center select-none">
        <img
          src="/salemate-logo-dark.png"
          alt="Salemate"
          className={`${heightMap[size] || "h-8"} w-auto object-contain`}
        />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span className="inline-flex items-center justify-center rounded-lg bg-[#090616] p-1.5 shadow-sm ring-1 ring-white/10">
        <img
          src="/salemate-icon.png"
          alt="Salemate"
          className={`${iconSizeMap[size] || "h-6 w-6"} object-contain`}
        />
      </span>
      {showWordmark && (
        <span
          className={`font-extrabold tracking-tight ${textSizeMap[size] || "text-lg"} ${
            variant === "dark" ? "text-white" : "text-slate-900"
          }`}
        >
          Salemate
        </span>
      )}
    </span>
  );
}

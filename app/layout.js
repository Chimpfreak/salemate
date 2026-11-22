import { Plus_Jakarta_Sans, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import ChunkErrorRecovery from "@/components/ChunkErrorRecovery";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Salemate — AI Sales & Trading Operations Partner",
  description:
    "Salemate is an AI operations service for B2B trading teams. Quote buyers in under 60 seconds, spot hidden supplier traps, calculate exact UAE AED landed costs and 5% VAT, and send human-approved quotes and client-protected supplier orders.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-canvas text-ink font-sans antialiased selection:bg-indigo-100 selection:text-indigo-950">
        <ChunkErrorRecovery />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import CaptionOverlay from "./components/CaptionOverlay";
import FocusNarrator from "./components/FocusNarrator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InclusiveAID - Assistente Virtual Inclusivo",
  description: "Assistente virtual adaptado para pessoas com deficiência",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AccessibilityProvider>
          <main id="main-content" className="min-h-screen bg-background">
            {children}
          </main>
          <CaptionOverlay />
          <FocusNarrator />
        </AccessibilityProvider>
      </body>
    </html>
  );
}

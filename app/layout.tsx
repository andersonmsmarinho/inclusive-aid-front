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
        {/* Link de atalho para navegação via teclado */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-black p-2 z-50">Pular para conteúdo principal</a>
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

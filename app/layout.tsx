import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        <main className="min-h-screen bg-gray-50">
        {children}
        </main>
      </body>
    </html>
  );
}

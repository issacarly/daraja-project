import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CurriculumAIWidget from "@/components/CurriculumAIWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Daraja - CBC Kenya Learning Platform",
  description:
    "Bridging online resources to classroom learning for CBC Kenya students Grade 1-9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        {children}
        <CurriculumAIWidget />
      </body>
    </html>
  );
}

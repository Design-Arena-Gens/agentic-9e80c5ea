"use client";

import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"]
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen selection:bg-slate-700 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}

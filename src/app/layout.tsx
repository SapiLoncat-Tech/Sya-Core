import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Sya-Core | Sistem Manajemen LKM Syariah",
  description: "Platform manajemen akuntansi syariah berbasis web untuk mendukung pencatatan, pemantauan, dan pelaporan keuangan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-background text-foreground flex min-h-screen selection:bg-emerald-500/30`}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto h-screen p-8 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2"></div>
          {children}
        </main>
      </body>
    </html>
  );
}

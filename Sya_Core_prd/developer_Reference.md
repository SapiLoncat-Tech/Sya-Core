# Developer Reference - Sya-Core

Dokumen ini berisi kompilasi lengkap dari *source code* komponen, *layout*, dan *halaman utama* yang telah dikembangkan untuk proyek **Sya-Core**. Referensi ini sangat berguna untuk memahami arsitektur UI, *styling* kustom berbasis Tailwind CSS, dan komponen yang digunakan di berbagai fitur aplikasi.

---

## 1. Konfigurasi Global & Tailwind (CSS)
**Path:** `src/app/globals.css`

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme {
  --font-sans: var(--font-inter);
  --font-heading: var(--font-outfit);

  --color-background: oklch(0.12 0.01 250);
  --color-foreground: oklch(0.98 0 0);

  --color-card: oklch(0.15 0.02 250);
  --color-card-foreground: oklch(0.98 0 0);

  --color-popover: oklch(0.15 0.02 250);
  --color-popover-foreground: oklch(0.98 0 0);

  --color-primary: oklch(0.65 0.18 160);
  --color-primary-foreground: oklch(0.98 0 0);

  --color-secondary: oklch(0.2 0.04 250);
  --color-secondary-foreground: oklch(0.98 0 0);

  --color-muted: oklch(0.2 0.04 250);
  --color-muted-foreground: oklch(0.65 0 0);

  --color-accent: oklch(0.65 0.18 160);
  --color-accent-foreground: oklch(0.98 0 0);

  --color-destructive: oklch(0.5 0.2 20);
  --color-destructive-foreground: oklch(0.98 0 0);

  --color-border: oklch(0.25 0.04 250);
  --color-input: oklch(0.25 0.04 250);
  --color-ring: oklch(0.65 0.18 160);

  --radius-lg: 1rem;
  --radius-md: calc(1rem - 2px);
  --radius-sm: calc(1rem - 4px);
}

@utility glass {
  background: rgba(20, 25, 35, 0.4);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

@utility glass-card {
  background: linear-gradient(145deg, rgba(30, 35, 45, 0.6) 0%, rgba(20, 25, 35, 0.8) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

@utility text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(90deg, oklch(0.7 0.15 160), oklch(0.8 0.1 190));
}

* {
  border-color: var(--color-border);
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-image:
    radial-gradient(circle at 15% 50%, rgba(20, 160, 120, 0.08), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(40, 180, 200, 0.08), transparent 25%);
  background-attachment: fixed;
}
```

---

## 2. Root Layout
**Path:** `src/app/layout.tsx`

```tsx
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
```

---

## 3. Komponen Sidebar
**Path:** `src/components/Sidebar.tsx`

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  HeartHandshake, 
  BarChart3, 
  Settings,
  LogOut,
  MoonStar
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Manajemen Anggota", href: "/members", icon: Users },
  { name: "Akad & Pembiayaan", href: "/financing", icon: FileText },
  { name: "Dana Ziswaf", href: "/ziswaf", icon: HeartHandshake },
  { name: "Laporan & Analytics", href: "/reports", icon: BarChart3 },
  { name: "Pengaturan", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 glass border-r border-white/5 flex flex-col justify-between h-screen sticky top-0 left-0 z-20">
      <div>
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <MoonStar className="text-emerald-400 w-8 h-8 mr-3" />
          <h1 className="text-xl font-heading font-bold text-gradient tracking-wide">
            Sya-Core
          </h1>
        </div>

        <div className="p-4 flex flex-col gap-2 mt-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">Menu Utama</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <div className={clsx(
                  "flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative group cursor-pointer overflow-hidden",
                  isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                )}>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={clsx("w-5 h-5 mr-3 relative z-10", isActive ? "text-emerald-400" : "group-hover:text-emerald-300 transition-colors")} />
                  <span className="text-sm font-medium relative z-10">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-6 border-t border-white/5">
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <span className="text-emerald-400 font-bold text-sm">AM</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Ahmad Manajer</p>
            <p className="text-xs text-gray-400 truncate">Manajer LKM</p>
          </div>
        </div>
        <button className="mt-4 flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors group">
          <LogOut className="w-4 h-4 mr-3 group-hover:text-red-400" />
          Keluar Sistem
        </button>
      </div>
    </aside>
  );
}
```

---

## 4. Dashboard / Executive Summary
**Path:** `src/app/page.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { 
  Wallet, 
  Users, 
  Coins, 
  HeartHandshake,
  TrendingUp,
  AlertCircle,
  BellRing
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const healthData = [
  { subject: 'Likuiditas', A: 85, fullMark: 100 },
  { subject: 'Solvabilitas', A: 90, fullMark: 100 },
  { subject: 'Rentabilitas', A: 75, fullMark: 100 },
  { subject: 'Kualitas Aset', A: 88, fullMark: 100 },
  { subject: 'Kepatuhan Syariah', A: 95, fullMark: 100 },
];

const growthData = [
  { name: 'Jan', pembiayaan: 4000, dana: 2400 },
  { name: 'Feb', pembiayaan: 4500, dana: 2800 },
  { name: 'Mar', pembiayaan: 4800, dana: 3100 },
  { name: 'Apr', pembiayaan: 5200, dana: 3600 },
  { name: 'Mei', pembiayaan: 6000, dana: 4000 },
  { name: 'Jun', pembiayaan: 6500, dana: 4800 },
];

const stats = [
  { title: "Total Aset", value: "Rp 12.5 M", change: "+12.5%", icon: Wallet, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { title: "Anggota Aktif", value: "1,245", change: "+4.2%", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { title: "Total Pembiayaan", value: "Rp 8.2 M", change: "+8.1%", icon: Coins, color: "text-amber-400", bg: "bg-amber-400/10" },
  { title: "Saldo Ziswaf", value: "Rp 450 Jt", change: "+15.3%", icon: HeartHandshake, color: "text-purple-400", bg: "bg-purple-400/10" },
];

const alerts = [
  { id: 1, title: "Jatuh Tempo Hari Ini", desc: "12 anggota memiliki jadwal angsuran Murabahah.", type: "warning" },
  { id: 2, title: "Peringatan NPF", desc: "Pembiayaan macet Bpk. Budi masuk bulan ke-3.", type: "danger" },
  { id: 3, title: "Validasi Laporan", desc: "Laporan bulanan siap untuk divalidasi Manajer.", type: "info" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Executive Summary</h1>
          <p className="text-gray-400">Ringkasan performa keuangan dan operasional LKM Syariah Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/5 transition-colors text-sm font-medium">
            <BellRing className="w-4 h-4 text-emerald-400" />
            <span>Notifikasi</span>
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">3</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass-card rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="glass-card rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-heading font-semibold text-white mb-6">Indeks Kesehatan Koperasi</h3>
          <div className="flex-1 min-h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={healthData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Skor"
                  dataKey="A"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="#10b981"
                  fillOpacity={0.3}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(20, 25, 35, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-heading font-semibold text-white">Tren Pembiayaan vs Dana Pihak Ketiga</h3>
          </div>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPembiayaan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDana" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#4b5563" tick={{fill: '#9ca3af'}} />
                <YAxis stroke="#4b5563" tick={{fill: '#9ca3af'}} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(20, 25, 35, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="pembiayaan" stroke="#10b981" fillOpacity={1} fill="url(#colorPembiayaan)" name="Pembiayaan" />
                <Area type="monotone" dataKey="dana" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDana)" name="Dana Pihak Ketiga" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alert Panel */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-white mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-amber-400" />
          Perhatian Khusus
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map(alert => (
            <div key={alert.id} className={
              `glass border-l-4 rounded-xl p-4 flex gap-4 ` + 
              (alert.type === 'warning' ? 'border-amber-400' : alert.type === 'danger' ? 'border-red-400' : 'border-blue-400')
            }>
              <div>
                <h4 className="text-white font-medium mb-1 text-sm">{alert.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{alert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 5. Master Data Anggota
**Path:** `src/app/members/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreVertical, Plus, FileText, CheckCircle2 } from "lucide-react";

const members = [
  { id: "M-001", name: "Ahmad Syafiq", nik: "320192837182", type: "Anggota Penuh", status: "Aktif", balance: "Rp 12.500.000", ao: "Budi Santoso" },
  { id: "M-002", name: "Siti Aminah", nik: "320192837183", type: "Anggota Biasa", status: "Aktif", balance: "Rp 4.200.000", ao: "Rina Marlina" },
  { id: "M-003", name: "Budi Raharjo", nik: "320192837184", type: "Calon Anggota", status: "Non-Aktif", balance: "Rp 500.000", ao: "Budi Santoso" },
  { id: "M-004", name: "Fatmawati", nik: "320192837185", type: "Anggota Penuh", status: "Aktif", balance: "Rp 28.100.000", ao: "Rina Marlina" },
  { id: "M-005", name: "Hasan Basri", nik: "320192837186", type: "Anggota Biasa", status: "Aktif", balance: "Rp 1.150.000", ao: "Budi Santoso" },
];

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Master Data Anggota</h1>
          <p className="text-gray-400">Kelola profil nasabah, simpanan, dan status keanggotaan.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center shadow-lg shadow-emerald-500/20">
          <Plus className="w-5 h-5 mr-2" />
          Tambah Anggota
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02]">
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama, NIK, atau ID..." 
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors w-full md:w-auto justify-center">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors w-full md:w-auto justify-center">
              <FileText className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">ID & Nama</th>
                <th className="px-6 py-4 font-medium">NIK</th>
                <th className="px-6 py-4 font-medium">Jenis</th>
                <th className="px-6 py-4 font-medium">AO Area</th>
                <th className="px-6 py-4 font-medium">Total Saldo</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((member, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={member.id} 
                  className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium group-hover:text-emerald-400 transition-colors">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{member.nik}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{member.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{member.ao}</td>
                  <td className="px-6 py-4 font-medium text-white">{member.balance}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      member.status === 'Aktif' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {member.status === 'Aktif' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/5 flex justify-between items-center text-sm text-gray-500">
          <span>Menampilkan 5 dari 1,245 anggota</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 glass rounded hover:text-white disabled:opacity-50" disabled>Seb</button>
            <button className="px-3 py-1 glass bg-emerald-500/20 text-emerald-400 rounded border-emerald-500/30">1</button>
            <button className="px-3 py-1 glass rounded hover:text-white">2</button>
            <button className="px-3 py-1 glass rounded hover:text-white">3</button>
            <button className="px-3 py-1 glass rounded hover:text-white">Sel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 6. Akad & Pembiayaan
**Path:** `src/app/financing/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSignature, Calculator, ArrowRight, Eye, CalendarCheck, Save } from "lucide-react";

export default function FinancingPage() {
  const [akadType, setAkadType] = useState("murabahah");
  const [plafon, setPlafon] = useState("10000000");
  const [tenor, setTenor] = useState("12");
  const [margin, setMargin] = useState("15");

  // Simple calculation for demo
  const pokok = parseInt(plafon) || 0;
  const tTenor = parseInt(tenor) || 1;
  const tMargin = parseInt(margin) || 0;
  
  const totalMargin = (pokok * tMargin) / 100;
  const totalPembiayaan = pokok + totalMargin;
  const angsuranPerBulan = totalPembiayaan / tTenor;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Akad & Pembiayaan</h1>
        <p className="text-gray-400">Input kontrak syariah, simulasi angsuran, dan preview jurnal akuntansi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Input */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-1 h-fit">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
              <FileSignature className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">Formulir Akad</h3>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nasabah</label>
              <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none">
                <option value="">Pilih Nasabah...</option>
                <option value="M-001">Ahmad Syafiq (M-001)</option>
                <option value="M-002">Siti Aminah (M-002)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Jenis Akad</label>
              <select 
                value={akadType}
                onChange={(e) => setAkadType(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
              >
                <option value="murabahah">Murabahah (Jual Beli)</option>
                <option value="mudharabah">Mudharabah (Bagi Hasil)</option>
                <option value="musyarakah">Musyarakah (Kemitraan)</option>
                <option value="qardh">Qardh (Pinjaman Kebajikan)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Plafon Pembiayaan (Rp)</label>
              <input 
                type="number" 
                value={plafon}
                onChange={(e) => setPlafon(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <AnimatePresence mode="popLayout">
              {akadType === "murabahah" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Margin (%)</label>
                    <input 
                      type="number" 
                      value={margin}
                      onChange={(e) => setMargin(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Tenor (Bulan)</label>
                    <input 
                      type="number" 
                      value={tenor}
                      onChange={(e) => setTenor(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="button" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-emerald-500/20">
              <Calculator className="w-5 h-5" />
              Kalkulasi & Preview
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Summary & Simulation */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
              <CalendarCheck className="w-5 h-5 mr-2 text-blue-400" />
              Simulasi Murabahah
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1">Harga Pokok</p>
                <p className="text-lg font-bold text-white">Rp {(pokok).toLocaleString()}</p>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1">Total Margin</p>
                <p className="text-lg font-bold text-amber-400">Rp {(totalMargin).toLocaleString()}</p>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-400 mb-1">Total Harga Jual</p>
                <p className="text-lg font-bold text-white">Rp {(totalPembiayaan).toLocaleString()}</p>
              </div>
              <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                <p className="text-xs text-emerald-300 mb-1">Angsuran / Bulan</p>
                <p className="text-lg font-bold text-emerald-400">Rp {(angsuranPerBulan).toLocaleString(undefined, {maximumFractionDigits:0})}</p>
              </div>
            </div>

            <div className="overflow-hidden border border-white/10 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/40 text-gray-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Bulan Ke</th>
                    <th className="px-4 py-3 font-medium">Porsi Pokok</th>
                    <th className="px-4 py-3 font-medium">Porsi Margin</th>
                    <th className="px-4 py-3 font-medium">Total Angsuran</th>
                    <th className="px-4 py-3 font-medium text-right">Sisa Hutang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[1, 2, 3].map((b) => (
                    <tr key={b} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-gray-400">{b}</td>
                      <td className="px-4 py-3 text-white">Rp {(pokok/tTenor).toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                      <td className="px-4 py-3 text-amber-400">Rp {(totalMargin/tTenor).toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                      <td className="px-4 py-3 text-emerald-400 font-medium">Rp {(angsuranPerBulan).toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                      <td className="px-4 py-3 text-right text-gray-400">Rp {(totalPembiayaan - (angsuranPerBulan * b)).toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center text-gray-500 text-xs italic bg-white/[0.01]">
                      Menampilkan 3 bulan pertama dari {tTenor} bulan...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Journal Preview */}
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-purple-500 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-white flex items-center">
                <Eye className="w-5 h-5 mr-2 text-purple-400" />
                Preview Jurnal Otomatis
              </h3>
              <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-md border border-purple-500/30">
                Pencairan Murabahah
              </span>
            </div>
            
            <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
              <div className="grid grid-cols-12 text-gray-500 mb-2 border-b border-white/10 pb-2">
                <div className="col-span-2">Kode Akun</div>
                <div className="col-span-6">Nama Akun</div>
                <div className="col-span-2 text-right">Debit</div>
                <div className="col-span-2 text-right">Kredit</div>
              </div>
              
              <div className="grid grid-cols-12 text-gray-300 py-1">
                <div className="col-span-2 text-emerald-400">14101</div>
                <div className="col-span-6">Piutang Murabahah</div>
                <div className="col-span-2 text-right">{(totalPembiayaan).toLocaleString()}</div>
                <div className="col-span-2 text-right">-</div>
              </div>
              
              <div className="grid grid-cols-12 text-gray-300 py-1">
                <div className="col-span-2 text-emerald-400">22101</div>
                <div className="col-span-6 pl-4">Margin Murabahah Ditangguhkan</div>
                <div className="col-span-2 text-right">-</div>
                <div className="col-span-2 text-right text-amber-400">{(totalMargin).toLocaleString()}</div>
              </div>
              
              <div className="grid grid-cols-12 text-gray-300 py-1">
                <div className="col-span-2 text-emerald-400">11101</div>
                <div className="col-span-6 pl-4">Kas / Bank Syariah</div>
                <div className="col-span-2 text-right">-</div>
                <div className="col-span-2 text-right text-red-400">{(pokok).toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center shadow-lg shadow-purple-500/20">
                <Save className="w-4 h-4 mr-2" />
                Simpan & Validasi Akad
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
```

---

## 7. Pengaturan Sistem
**Path:** `src/app/settings/page.tsx`

```tsx
"use client";

import { Settings, Shield, Sliders, Users } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Pengaturan Sistem</h1>
        <p className="text-gray-400">Konfigurasi Role-Based Access Control (RBAC) dan parameter produk.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* User Management */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-400" />
            Manajemen Pengguna (RBAC)
          </h3>

          <div className="space-y-4">
            {[
              { role: "Admin Sistem", desc: "Akses penuh sistem dan parameter.", count: 2 },
              { role: "Manajer LKM", desc: "Dashboard eksekutif dan validasi laporan.", count: 1 },
              { role: "Staf Akuntansi / Pembiayaan", desc: "Input akad, angsuran, dan validasi jurnal.", count: 4 },
              { role: "Account Officer (AO)", desc: "Akses data nasabah lapangan (terbatas).", count: 8 },
              { role: "Dewan Pengawas Syariah", desc: "Akses read-only untuk audit kepatuhan.", count: 3 },
            ].map((role, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
                <div>
                  <h4 className="text-sm font-medium text-white">{role.role}</h4>
                  <p className="text-xs text-gray-400 mt-1">{role.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg">
                    <Users className="w-3 h-3 mr-1" /> {role.count}
                  </div>
                  <button className="text-gray-400 hover:text-white px-3 py-1 bg-white/5 rounded-lg text-xs transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-4 w-full bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-sm font-medium transition-colors border border-white/5">
            + Tambah Pengguna Baru
          </button>
        </div>

        {/* Product Configuration */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
            <Sliders className="w-5 h-5 mr-2 text-emerald-400" />
            Konfigurasi Produk
          </h3>

          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-emerald-400 border-b border-white/10 pb-2">Parameter Pembiayaan</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <label className="text-xs text-gray-400 block mb-1">Margin Murabahah Default</label>
                  <div className="flex items-center">
                    <input type="text" defaultValue="15" className="bg-transparent text-white font-medium w-full focus:outline-none" />
                    <span className="text-gray-500">% / thn</span>
                  </div>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <label className="text-xs text-gray-400 block mb-1">Denda Keterlambatan</label>
                  <div className="flex items-center">
                    <input type="text" defaultValue="0" className="bg-transparent text-white font-medium w-full focus:outline-none" disabled />
                    <span className="text-gray-500 text-xs">(Dana Kebajikan)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-emerald-400 border-b border-white/10 pb-2">Parameter Simpanan (Nisbah)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <label className="text-xs text-gray-400 block mb-1">Porsi LKM (Mudharabah)</label>
                  <div className="flex items-center">
                    <input type="text" defaultValue="40" className="bg-transparent text-white font-medium w-full focus:outline-none" />
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <label className="text-xs text-gray-400 block mb-1">Porsi Nasabah (Mudharabah)</label>
                  <div className="flex items-center">
                    <input type="text" defaultValue="60" className="bg-transparent text-white font-medium w-full focus:outline-none" />
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20">
              Simpan Konfigurasi
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
```
